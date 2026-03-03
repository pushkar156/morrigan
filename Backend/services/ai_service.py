import os
import time
from typing import Optional
import google.generativeai as genai
from pinecone import Pinecone
from dotenv import load_dotenv
from sqlalchemy.orm import Session

load_dotenv()

gemini_key = os.getenv("GEMINI_API_KEY")
if gemini_key:
    genai.configure(api_key=gemini_key)

pinecone_key = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")

pc = None
index = None
if pinecone_key and pinecone_index_name:
    try:
        pc = Pinecone(api_key=pinecone_key)
        index = pc.Index(pinecone_index_name)
    except Exception as e:
        print(f"Warning: Failed to initialize Pinecone: {e}")

CHAT_MODEL = 'models/gemini-2.0-flash'
EMBEDDING_MODEL = "models/gemini-embedding-001"

def is_service_available() -> bool:
    return all([
        gemini_key and gemini_key != "your_gemini_api_key_here",
        pinecone_key and pinecone_key != "your_pinecone_api_key_here",
        pinecone_index_name,
        index is not None
    ])

async def ask_morrigan(
    query: str,
    blog_id: Optional[str] = None,
    db: Optional[Session] = None,
    page_url: Optional[str] = None,
    page_content: Optional[str] = None
) -> str:
    if not is_service_available():
        return "I apologize, but the AI service is currently unavailable. Please contact the administrator."

    try:
        time.sleep(1)
        print(f"[DEBUG] Query: {query[:50]}...")

        if page_content and is_page_specific_question(query, page_url):
            return await answer_page_question_dynamic(query, page_content, page_url)

        res = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=query,
            task_type="retrieval_query"
        )

        query_params = {
            'vector': res['embedding'],
            'top_k': 5,
            'include_metadata': True
        }

        if blog_id:
            query_params['filter'] = {'blog_id': blog_id}

        results = index.query(**query_params)

        context_parts = []
        for match in results.get('matches', []):
            metadata = match.get('metadata', {})
            if 'text' in metadata:
                blog_title = metadata.get('blog_title', '')
                text = metadata['text']
                if blog_title:
                    context_parts.append(f"From '{blog_title}':\n{text}")
                else:
                    context_parts.append(text)

        context_text = "\n\n---\n\n".join(context_parts)

        if not context_text:
            if page_content:
                return await answer_page_question_dynamic(query, page_content, page_url)
            return "I couldn't find any relevant information to answer that question. Could you try rephrasing or asking about a different topic?"

        final_prompt = f

        model = genai.GenerativeModel(CHAT_MODEL)
        response = model.generate_content(final_prompt)
        return response.text

    except Exception as e:
        print(f"[ERROR] Chat error: {e}")
        return "I'm experiencing technical difficulties at the moment. Please try again in a few seconds."

def get_page_context(page_url: Optional[str], query: str) -> dict:

    if not page_url: return {"page_name": "Unknown"}

    if "index.html" in page_url:
        return {"page_name": "Homepage", "description": "Morrigan's main hub for finance and business insights."}
    elif "journal.html" in page_url:
        return {"page_name": "Journal", "description": "Browse our full collection of articles and case studies."}
    return {"page_name": "Unknown"}

def is_page_specific_question(query: str, page_url: Optional[str]) -> bool:
    query_lower = query.lower()
    keywords = ["this page", "this site", "homepage", "what is this", "navigate", "sections", "where am i"]
    return any(kw in query_lower for kw in keywords)

async def answer_page_question_dynamic(query: str, page_content: str, page_url: Optional[str] = None) -> str:
    try:
        page_name = "this page"
        if page_url:
            if "index.html" in page_url: page_name = "the homepage"
            elif "journal.html" in page_url: page_name = "the journal page"
            elif "contact.html" in page_url: page_name = "the contact page"

        prompt = f

        model = genai.GenerativeModel(CHAT_MODEL)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error in dynamic response: {e}")
        return "I can see the page content but I'm having trouble processing it right now."
