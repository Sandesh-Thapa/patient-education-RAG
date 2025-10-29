import os
from dotenv import load_dotenv
from groq import Groq
from rag.vector_db import get_vector_db_index

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def retrieve_context(query):
    index = get_vector_db_index()
    results = index.search(
        namespace="ns1",
        query={
            "top_k": 5,
            "inputs": {'text': query}
        }
    )

    hits = results['result']['hits']
    context_chunks = [hit['fields']['chunk_text'] for hit in hits if 'chunk_text' in hit['fields']]
    context = "\n\n".join(context_chunks)

    return context

def chat_with_groq(query):
    chat_history = [
        {
            "role": "system",
            "content": (
                "You are a health expert assistant."
                "Use the provided WHO guidelines context to answer accurately."
                "Cite or refer to WHO guidance when relevant."
            )
        }
    ]
    context = retrieve_context(query)

    chat_history.append({
        "role": "user",
        "content": f"Context:\n{context}\n\nQuestion: {query}"
    })

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=chat_history,
        temperature=0.3,
    )
    reply = response.choices[0].message.content
    
    return reply
