import pymongo, json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from .utils.chatbot import chat_with_groq, validate_user_input_with_guardrail, generate_chat_title
from .database.config import chat_collection, conversation_collection
from .database.models import Chat, RoleEnum, Conversation

app = FastAPI()

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
    return JSONResponse("API service is running...")

@app.post("/new-chat")
def new_chat(query: Query):
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

            assistant_entry = Chat(
                thread_id=query.thread_id,
                message=full_reply,
                role=RoleEnum.assistant
            )
            chat_collection.insert_one(assistant_entry.model_dump())

            title = generate_chat_title(query.q, full_reply)
            chat_title = Conversation(
                thread_id=query.thread_id,
                title=title,
            )
            conversation_collection.insert_one(chat_title.model_dump())

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "event: end\ndata: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/chat")
def chat(query: Query):
    guardrail_system = validate_user_input_with_guardrail(query.q)

    def event_stream():
        if not guardrail_system.get("valid_input"):
            msg = guardrail_system.get("markdown", "⚠️ Input rejected by guardrails.")
            yield f"data: {json.dumps({'message': msg})}\n\n"
            yield "event: end\ndata: [DONE]\n\n"
            return

        chat_history = chat_collection.find({"thread_id": query.thread_id}).sort("createdDt", pymongo.ASCENDING)
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