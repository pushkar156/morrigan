from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database.connection import get_db
from database import models, schemas
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

def send_email_notification(name: str, email: str, subject: str, message: str):
    # This will pull from your .env file
    sender_email = os.getenv("GMAIL_ADDRESS")
    app_password = os.getenv("GMAIL_APP_PASSWORD")
    
    # Send it directly to you
    receiver_email = "the.morrigan.news@gmail.com"

    if not sender_email or not app_password:
        print("Note: GMAIL_ADDRESS or GMAIL_APP_PASSWORD not set in .env. Skipping email dispatch.")
        return

    msg = MIMEMultipart()
    msg['From'] = f"The Morrigan System <{sender_email}>"
    msg['To'] = receiver_email
    msg['Subject'] = f"New Contact Request: {subject}"

    body = f"""You have received a new message via The Morrigan Contact Form.

----------------------------------------
NAME: {name}
EMAIL: {email}
SUBJECT: {subject}
----------------------------------------

MESSAGE:
{message}
"""
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to Gmail SMTP Server securely
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, app_password)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        print("Successfully dispatched notification email.")
    except Exception as e:
        print(f"Failed to send email notification: {e}")

@router.post("/contact")
async def handle_contact(
    form_data: schemas.ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        # 1. Save to the database as usual
        db_contact = models.Contact(**form_data.model_dump())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)

        # 2. Trigger the email dispatch in the background so the user doesn't wait
        background_tasks.add_task(
            send_email_notification,
            name=form_data.name,
            email=form_data.email,
            subject=form_data.subject,
            message=form_data.message
        )

        return {"status": "success", "message": "Thank you! Your message has been received."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to handle contact request.")

