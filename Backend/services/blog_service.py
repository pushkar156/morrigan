import re
import json
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import models, schemas
from fastapi import HTTPException
from .rag_ingestion_service import process_and_store_blog

def generate_slug(title: str) -> str:

    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

def get_blog_by_id(db: Session, blog_id: int):
    return db.query(models.Blog).filter(models.Blog.id == blog_id).first()

def get_blog_by_slug(db: Session, slug: str):
    return db.query(models.Blog).filter(models.Blog.slug == slug).first()

def get_blogs(db: Session, category: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Blog).filter(models.Blog.status == "published")
    if category:
        query = query.filter(models.Blog.category == category)
    return query.order_by(models.Blog.published_at.desc()).offset(skip).limit(limit).all()

def get_all_blogs_admin(db: Session, skip: int = 0, limit: int = 100):

    return db.query(models.Blog).order_by(models.Blog.created_at.desc()).offset(skip).limit(limit).all()

def create_blog(db: Session, blog: schemas.BlogCreate) -> models.Blog:

    blog_data = blog.model_dump()

    if not blog_data.get('slug'):
        slug = generate_slug(blog_data['title'])

        existing = get_blog_by_slug(db, slug)
        if existing:
            slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
        blog_data['slug'] = slug

    if blog_data.get('tags'):
        blog_data['tags'] = json.dumps(blog_data['tags'])

    if blog_data.get('status') == 'published':
        if not blog_data.get('published_at'):
            blog_data['published_at'] = datetime.utcnow()

    db_blog = models.Blog(**blog_data)
    db.add(db_blog)

    try:
        db.commit()
        db.refresh(db_blog)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

    if db_blog.status == "published":
        try:
            process_and_store_blog(
                blog_id=str(db_blog.id),
                title=db_blog.title,
                content=db_blog.content,
                slug=db_blog.slug
            )
        except Exception as e:
            print(f"[Blog Service] RAG Error: {str(e)}")

    return db_blog

def update_blog(db: Session, blog_id: int, blog_update: schemas.BlogUpdate) -> Optional[models.Blog]:

    db_blog = get_blog_by_id(db, blog_id)
    if not db_blog:
        return None

    update_data = blog_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_blog, key, value)

    if db_blog.status == 'published' and not db_blog.published_at:
        db_blog.published_at = datetime.utcnow()

    db.commit()
    db.refresh(db_blog)

    if db_blog.status == "published":
        if "content" in update_data or "title" in update_data or "slug" in update_data:
            process_and_store_blog(
                blog_id=str(db_blog.id),
                title=db_blog.title,
                content=db_blog.content,
                slug=db_blog.slug
            )

    return db_blog

def delete_blog(db: Session, blog_id: int) -> bool:
    db_blog = get_blog_by_id(db, blog_id)
    if not db_blog:
        return False

    db.delete(db_blog)
    db.commit()
    return True
