import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

uri = f"mongodb+srv://{os.getenv("MONGODB_USER", "")}:{os.getenv("MONGODB_PASSWORD", "")}@{os.getenv("MONGODB_CLUSTER", "")}.uv2aunl.mongodb.net/?appName={os.getenv("MONGODB_CLUSTER", "")}"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.medical_rag
chat_collection = db["chats"]
conversation_collection = db["conversations"]