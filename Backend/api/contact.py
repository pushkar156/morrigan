from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from database import models, schemas

router = APIRouter()

@router.post("/contact")
async def handle_contact(
    form_data: schemas.ContactCreate,
    db: Session = Depends(get_db)
):
    try:
        db_contact = models.Contact(**form_data.model_dump())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return {"status": "success", "message": "Thank you! Your message has been received."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save message")
