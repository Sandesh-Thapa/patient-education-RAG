from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class RoleEnum(str, Enum):
    user = "user"
    assistant = "assistant"

class Chat(BaseModel):
    thread_id: str
    message: str
    role: RoleEnum
    createdDt: int = int(datetime.timestamp(datetime.now()))

class Conversation(BaseModel):
    thread_id: str
    title: str
    createdDt: int = int(datetime.timestamp(datetime.now()))