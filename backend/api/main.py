import pymongo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from .utils.chatbot import chat_with_groq
from .database.config import chat_collection
from .database.models import Chat, RoleEnum

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

@app.post("/chat")
def chat(query: Query):
    chat_history = chat_collection.find({"thread_id": query.thread_id}).sort("createdDt", pymongo.ASCENDING)
    user_query = Chat(
        thread_id=query.thread_id,
        message=query.q,
        role=RoleEnum.user
    )
    chat_collection.insert_one(user_query.model_dump())

    def generate():
        for chunk in chat_with_groq(query.q, chat_history, query.thread_id):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")