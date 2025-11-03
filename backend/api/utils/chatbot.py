import os, json, re
from dotenv import load_dotenv
from groq import Groq
from rag.vector_db import get_vector_db_index
from api.database.models import Chat, RoleEnum
from api.database.config import chat_collection
from .prompts import health_guardrail_system_prompt, title_system_prompt

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_chat_title(user_query: str, assistant_response: str) -> str:
    messages = [
        {"role": "system", "content": title_system_prompt},
        {"role": "user", "content": f"User: {user_query}\nAssistant: {assistant_response}"}
    ]

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.3,
    )

    title = response.choices[0].message.content.strip()
    return title[:80]

def extract_json_from_text(text: str):
    """Try to extract a JSON object from a text blob."""
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            return None
    return None


def validate_user_input_with_guardrail(user_input: str, context: str = "") -> dict:
    """
    Context-aware guardrail that validates health-related queries
    and gracefully handles non-JSON or malformed LLM output.
    """
    try:
        combined_prompt = (
            f"Previous Conversation Context:\n{context}\n\n"
            f"Current User Input:\n{user_input}"
            if context else user_input
        )

        messages = [
            {"role": "system", "content": health_guardrail_system_prompt},
            {"role": "user", "content": combined_prompt},
        ]

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.0,
        )

        raw = response.choices[0].message.content.strip()

        try:
            result = json.loads(raw)
        except json.JSONDecodeError:
            result = extract_json_from_text(raw)

        if not result or "valid_input" not in result:
            retry_prompt = (
                "You failed to return strict JSON earlier. "
                "Now respond again strictly in valid JSON format with keys: "
                "valid_input, reason, suspicious, suspicion_reason, markdown. "
                f"\n\nOriginal user input:\n{user_input}"
            )
            retry_response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": retry_prompt},
                ],
                temperature=0.0,
            )
            retry_raw = retry_response.choices[0].message.content.strip()
            result = extract_json_from_text(retry_raw) or {"valid_input": True}

        result.setdefault("valid_input", True)
        result.setdefault("reason", "")
        result.setdefault("suspicious", False)
        result.setdefault("suspicion_reason", "")
        result.setdefault("markdown", "✅ Input accepted as valid.")

        return result

    except Exception as e:
        return {
            "valid_input": True,
            "reason": f"Guardrail exception: {str(e)}",
            "suspicious": False,
            "suspicion_reason": "",
            "markdown": "⚠️ Guardrail temporarily unavailable — continuing safely."
        }

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


def chat_with_groq(query, history, thread_id):
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
    chat_history += [{"role": chat["role"], "content": chat["message"]} for chat in history]
    context = retrieve_context(query)

    chat_history.append({
        "role": "user",
        "content": f"Context:\n{context}\n\nQuestion: {query}"
    })

    stream = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=chat_history,
        temperature=0.3,
        stream=True
    )
    full_reply = ""
    for chunk in stream:
        delta = chunk.choices[0].delta
        if delta and delta.content:
            content = delta.content
            full_reply += content
            yield content

    assistant_result = Chat(
        thread_id=thread_id,
        message=full_reply,
        role=RoleEnum.assistant
    )
    chat_collection.insert_one(assistant_result.model_dump())
