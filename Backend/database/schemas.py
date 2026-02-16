from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BlogBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    author: Optional[str] = "Pushkar"
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    read_time: Optional[int] = 5
    status: str = "draft"

class BlogCreate(BlogBase):

    published_at: Optional[datetime] = None

class BlogUpdate(BaseModel):

    title: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    read_time: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")
    published_at: Optional[datetime] = None

class BlogResponse(BlogBase):

    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
