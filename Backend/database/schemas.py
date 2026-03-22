from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
import json


class BlogBase(BaseModel):
    title: str = Field(..., max_length=500)
    content: str = Field(..., max_length=100000)
    excerpt: Optional[str] = Field(None, max_length=1000)
    author: Optional[str] = Field("Pushkar", max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = Field(None, max_length=2000)
    read_time: Optional[int] = Field(5, ge=1, le=60)
    status: str = Field("draft", pattern="^(draft|published|archived)$")


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
    id: str
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v):
        """The DB stores tags as a JSON string. Parse it back into a list."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return [t.strip() for t in v.split(",") if t.strip()]
        return v

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str = Field(..., max_length=100)
    email: str = Field(..., max_length=150)
    subject: str = Field(..., max_length=200)
    message: str = Field(..., max_length=10000)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
