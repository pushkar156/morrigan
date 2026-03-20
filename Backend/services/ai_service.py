import os
import time
import random
from typing import Optional
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, RetryError
from pinecone import Pinecone
from dotenv import load_dotenv
from sqlalchemy.orm import Session

load_dotenv()

gemini_keys = [
    os.getenv(f"GEMINI_API_KEY_{i}") for i in range(1, 10)
]
gemini_keys = [k for k in gemini_keys if k and k != "your_actual_gemini_key_here"]
if not gemini_keys and os.getenv("GEMINI_API_KEY"):
    gemini_keys = [os.getenv("GEMINI_API_KEY")]

def execute_with_fallback(action_name, func, *args, **kwargs):
    """Executes a Gemini function, falling back to next keys sequentially on failure."""
    if not gemini_keys:
        raise Exception("No Gemini keys available")
    
    last_error = None
    for i, key in enumerate(gemini_keys):
        try:
            genai.configure(api_key=key)
            print(f"[AI] Attempting {action_name} with Key #{i+1}...")
            # Sleep slightly to avoid spamming if rapidly cycling
            if i > 0: time.sleep(1.5)
            result = func(*args, **kwargs)
            return result
        except (ResourceExhausted, RetryError) as e:
            print(f"[AI] Key #{i+1} failed ({type(e).__name__}). Falling back to next...")
            last_error = e
        except Exception as e:
            # For other errors, we might still want to retry or just fail. Let's retry just in case it's a 500
            print(f"[AI] Key #{i+1} encountered error: {e}. Falling back...")
            last_error = e
            
    raise last_error or Exception("All Gemini keys exhausted or failed.")

pinecone_key = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")

pc = None
index = None
if pinecone_key and pinecone_key != "your_actual_pinecone_key_here" and pinecone_index_name:
    try:
        pc = Pinecone(api_key=pinecone_key)
        index = pc.Index(pinecone_index_name)
    except Exception as e:
        print(f"Warning: Failed to initialize Pinecone: {e}")

CHAT_MODEL = 'models/gemini-2.5-flash'
EMBEDDING_MODEL = "models/gemini-embedding-001"


def is_service_available() -> bool:
    return all([
        len(gemini_keys) > 0,
        pinecone_key and pinecone_key != "your_actual_pinecone_key_here",
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

        if page_content and (is_page_specific_question(query, page_url) or "/blog/" in (page_url or "")):
            # If on a blog, prioritize the local page context for better relevance
            return await answer_page_question_dynamic(query, page_content, page_url)

        res = execute_with_fallback("Embed Content", 
            genai.embed_content,
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

        final_prompt = f"""You are "The Morrigan" — a highly knowledgeable AI assistant for The Morrigan editorial platform, specializing in finance, strategy, M&A, and market analysis.

Use ONLY the following context from our published articles to answer the user's question. If the context doesn't contain enough information, say so honestly rather than making things up.

CONTEXT FROM OUR ARTICLES:
{context_text}

USER QUESTION: {query}

INSTRUCTIONS:
- Be concise but thorough
- Reference specific article titles when citing information
- Use professional, analytical language
- If the answer spans multiple articles, synthesize the insights
- If you cannot answer from the context, say "I don't have enough information in our published articles to answer that fully."
"""

        def generate():
            model = genai.GenerativeModel(CHAT_MODEL)
            return model.generate_content(final_prompt)
            
        response = execute_with_fallback("Generate Content", generate)
        return response.text

    except Exception as e:
        print(f"[ERROR] Chat error: {e}")
        return "I'm experiencing technical difficulties at the moment. Please try again in a few seconds."


def get_page_context(page_url: Optional[str], query: str) -> dict:
    if not page_url:
        return {"page_name": "Unknown"}

    if "/about" in page_url:
        return {"page_name": "About Us", "description": "Learn about the Morrigan team and mission."}
    elif "/journal" in page_url:
        return {"page_name": "Journal", "description": "Browse our full collection of articles and case studies."}
    elif "/contact" in page_url:
        return {"page_name": "Contact", "description": "Get in touch with the Morrigan team."}
    elif "/" == page_url or "/home" in page_url:
        return {"page_name": "Homepage", "description": "Morrigan's main hub for finance and business insights."}
    return {"page_name": "Unknown"}


def is_page_specific_question(query: str, page_url: Optional[str]) -> bool:
    query_lower = query.lower()
    keywords = [
        "this page", "this site", "homepage", "what is this", "navigate", 
        "sections", "where am i", "summarise", "summarize", "about this",
        "this blog", "this article", "read this", "what does it say"
    ]
    return any(kw in query_lower for kw in keywords)


async def answer_page_question_dynamic(query: str, page_content: str, page_url: Optional[str] = None) -> str:
    try:
        page_name = "this page"
        if page_url:
            if "/about" in page_url:
                page_name = "the about page"
            elif "/journal" in page_url:
                page_name = "the journal page"
            elif "/contact" in page_url:
                page_name = "the contact page"
            elif "/" == page_url or "/home" in page_url:
                page_name = "the homepage"

        prompt = f"""You are "The Morrigan" AI assistant embedded on {page_name} of The Morrigan editorial platform.

The user is asking a question about the page they are currently viewing. Here is the page content:

---
{page_content[:3000]}
---

USER QUESTION: {query}

Answer the question based on what you can see on the page. Be helpful and specific."""

        def generate_dynamic():
            model = genai.GenerativeModel(CHAT_MODEL)
            return model.generate_content(prompt)
            
        response = execute_with_fallback("Dynamic Content", generate_dynamic)
        return response.text
    except Exception as e:
        print(f"Error in dynamic response: {e}")
        return "I can see the page content but I'm having trouble processing it right now."
