from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database.connection import get_db
from services.ai_service import ask_morrigan
from typing import Optional, Dict

router = APIRouter()

@router.post("/chat")
async def chat_with_morrigan(
    payload: Dict = Body(...),
    db: Session = Depends(get_db)
):
    query = payload.get("message")
    blog_id = payload.get("blog_id")
    page_url = payload.get("page_url")
    page_content = payload.get("page_content")

    if not query:
        raise HTTPException(status_code=400, detail="Message is required")

    try:
        response = await ask_morrigan(
            query=query,
            blog_id=blog_id,
            db=db,
            page_url=page_url,
            page_content=page_content
        )
        return {"response": response}
    except Exception as e:
        print(f"[Chat API] Error: {e}")
        return {"response": "I'm having a bit of trouble thinking right now. Could you repeat that?"}
