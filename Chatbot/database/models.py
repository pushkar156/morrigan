from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from .connection import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Blog(Base):
    __tablename__ = "blogs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    # Link to the Blog table
    blog_id = Column(String(36), ForeignKey("blogs.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)

    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


    __table_args__ = (
        Index('ix_chat_messages_session_time', 'session_id', 'created_at'),
    )