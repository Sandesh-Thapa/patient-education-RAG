import json
import pymongo
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from .utils.chatbot import (
    chat_with_groq,
    validate_user_input_with_guardrail,
    generate_chat_title
)
from .database.config import chat_collection, conversation_collection
from .database.models import Chat, RoleEnum, Conversation


app = FastAPI(title="Health Expert Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    q: str
    thread_id: str

@app.get("/", tags=["Welcome"])
def welcome():
    return JSONResponse({"message": "Health Chatbot API service is running..."})


@app.post("/new-chat")
def new_chat(query: Query):
    """Starts a new conversation and generates a title."""
    guardrail_system = validate_user_input_with_guardrail(query.q)

    def event_stream():
        if not guardrail_system.get("valid_input"):
            msg = guardrail_system.get("markdown", "⚠️ Input rejected by guardrails.")
            yield f"data: {json.dumps({'message': msg})}\n\n"
            yield "event: end\ndata: [DONE]\n\n"
            return

        user_query = Chat(
            thread_id=query.thread_id,
            message=query.q,
            role=RoleEnum.user
        )
        chat_collection.insert_one(user_query.model_dump())

        full_reply = ""
        try:
            for chunk in chat_with_groq(query.q, [], query.thread_id):
                full_reply += chunk
                yield f"data: {json.dumps({'message': chunk})}\n\n"

            chat_collection.insert_one(Chat(
                thread_id=query.thread_id,
                message=full_reply,
                role=RoleEnum.assistant
            ).model_dump())

            title = generate_chat_title(query.q, full_reply)
            conversation_collection.insert_one(Conversation(
                thread_id=query.thread_id,
                title=title
            ).model_dump())

            yield f"data: {json.dumps({'title': title})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "event: end\ndata: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/chat")
def chat(query: Query):
    """Handles follow-up queries using context and guardrails."""
    chat_history = list(
        chat_collection.find({"thread_id": query.thread_id}).sort("createdDt", pymongo.ASCENDING)
    )

    context_for_guardrail = "\n".join(f"{m['role']}: {m['message']}" for m in chat_history[-4:])
    guardrail_system = validate_user_input_with_guardrail(query.q, context_for_guardrail)

    def event_stream():
        if not guardrail_system.get("valid_input"):
            msg = guardrail_system.get("markdown", "⚠️ Input rejected by guardrails.")
            yield f"data: {json.dumps({'message': msg})}\n\n"
            yield "event: end\ndata: [DONE]\n\n"
            return

        user_query = Chat(
            thread_id=query.thread_id,
            message=query.q,
            role=RoleEnum.user
        )
        chat_collection.insert_one(user_query.model_dump())

        try:
            for chunk in chat_with_groq(query.q, chat_history, query.thread_id):
                yield f"data: {json.dumps({'message': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "event: end\ndata: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/chats")
def get_chat_list():
    """Fetch list of all conversations (id, title, created date)."""
    conversations = (
        conversation_collection
        .find({}, {"_id": 0, "thread_id": 1, "title": 1, "createdDt": 1})
        .sort("createdDt", pymongo.DESCENDING)
    )
    return {"chats": list(conversations)}


@app.get("/chat/{thread_id}")
def get_chat_conversation(thread_id: str):
    """Fetch chat messages for a specific thread."""
    chat_history = list(
        chat_collection
        .find({"thread_id": thread_id}, {"_id": 0})
        .sort("createdDt", pymongo.ASCENDING)
    )
    return {"chat_history": chat_history}