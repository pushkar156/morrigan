from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from .connection import Base
from datetime import datetime

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, index=True)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    author = Column(String(200), default="Pushkar")
    category = Column(String(100), index=True)
    tags = Column(String(500), nullable=True)
    featured_image = Column(String(1000), nullable=True)
    read_time = Column(Integer, default=5)
    status = Column(String(50), default="draft")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    email = Column(String(200))
    subject = Column(String(500))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
