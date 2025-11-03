import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_HOST_NAME = os.getenv("PINECONE_INDEX_HOST")

def get_vector_db_index():
    db = Pinecone(api_key=PINECONE_API_KEY)

    if not db.has_index(PINECONE_INDEX_NAME):
        db.create_index_for_model(
            name=PINECONE_INDEX_NAME,
            cloud="aws",
            region="us-east-1",
            embed={
                "model":"llama-text-embed-v2",
                "field_map":{"text": "chunk_text"}
            }
        )

    return db.Index(name=PINECONE_INDEX_NAME, host=PINECONE_HOST_NAME)