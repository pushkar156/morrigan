import os
import re
import time
import uuid
from typing import List, Dict, Any
from bs4 import BeautifulSoup
import google.generativeai as genai
from pinecone import Pinecone
from dotenv import load_dotenv
load_dotenv()
EMBEDDING_MODEL = "models/gemini-embedding-001"
CHUNK_SIZE = 1500
CHUNK_OVERLAP = 200
gemini_key = os.getenv("GEMINI_API_KEY")
pinecone_key = os.getenv("PINECONE_API_KEY")
index_name = os.getenv("PINECONE_INDEX_NAME")
if gemini_key:
    genai.configure(api_key=gemini_key)
pc = None
index = None
if pinecone_key and index_name:
    try:
        pc = Pinecone(api_key=pinecone_key)
        index = pc.Index(index_name)
    except Exception as e:
        print(f"[RAG Service] Pinecone init warning: {e}")
def clean_text(html_content: str) -> str:
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    for script in soup(["script", "style"]):
        script.extract()
    text = soup.get_text(separator=" ")
    text = re.sub(r'\s+', ' ', text).strip()
    return text
def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    if not text:
        return []
    chunks = []
    start = 0
    text_len = len(text)
    while start < text_len:
        end = start + chunk_size
        if end < text_len:
            last_period = -1
            for punctuation in ['.', '!', '?']:
                pos = text.rfind(punctuation, start, end)
                if pos != -1:
                    last_period = max(last_period, pos)
            if last_period != -1 and last_period > start + (chunk_size * 0.5):
                end = last_period + 1
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end - overlap
        if start >= end:
            start = end
    return chunks
def generate_embedding(text: str) -> List[float]:
    try:
        time.sleep(1)
        response = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document"
        )
        return response['embedding']
    except Exception as e:
        print(f"[RAG Service] Embedding error: {e}")
        return []
def process_and_store_blog(blog_id: str, title: str, content: str, slug: str) -> Dict[str, Any]:
    if not index:
        return {"status": "error", "message": "Pinecone not initialized"}
    print(f"[RAG] Processing blog: {title} ({blog_id})")
    cleaned_text = clean_text(content)
    chunks = chunk_text(cleaned_text)
    print(f"[RAG] Created {len(chunks)} chunks")
    vectors_to_upsert = []
    for i, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)
        if not embedding:
            print(f"[RAG] Failed to embed chunk {i}")
            continue
        vector_id = f"{blog_id}_{i}"
        metadata = {
            "blog_id": str(blog_id),
            "slug": slug,
            "blog_title": title,
            "text": chunk,
            "chunk_index": i,
            "total_chunks": len(chunks)
        }
        vectors_to_upsert.append((vector_id, embedding, metadata))
    if vectors_to_upsert:
        try:
            try:
                index.delete(filter={"blog_id": str(blog_id)})
                print(f"[RAG] Cleared old vectors for blog_id {blog_id}")
            except Exception as e:
                print(f"[RAG] Warning during delete: {e}")
            batch_size = 100
            for i in range(0, len(vectors_to_upsert), batch_size):
                batch = vectors_to_upsert[i:i + batch_size]
                index.upsert(vectors=batch)
            print(f"[RAG] Successfully upserted {len(vectors_to_upsert)} vectors")
            return {"status": "success", "chunks_processed": len(vectors_to_upsert)}
        except Exception as e:
            print(f"[RAG] Upsert error: {e}")
            return {"status": "error", "message": str(e)}
    return {"status": "error", "message": "No vectors created"}
if __name__ == "__main__":
    sample_html = "<h1>Test Blog</h1><p>This is a test paragraph for the RAG system.</p>"
    print(clean_text(sample_html))
