from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database.connection import get_db
from database import schemas
from services import blog_service

router = APIRouter()

@router.get("/blogs", response_model=List[schemas.BlogResponse])
def read_blogs(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return blog_service.get_blogs(db, category=category, skip=skip, limit=limit)

@router.get("/blogs/admin/all", response_model=List[schemas.BlogResponse])
def read_all_blogs_admin(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)

):
    return blog_service.get_all_blogs_admin(db, skip=skip, limit=limit)

@router.post("/blogs", response_model=schemas.BlogResponse)
def create_new_blog(
    blog: schemas.BlogCreate,
    db: Session = Depends(get_db)

):
    return blog_service.create_blog(db=db, blog=blog)

@router.get("/blogs/{slug_or_id}", response_model=schemas.BlogResponse)
def read_blog(slug_or_id: str, db: Session = Depends(get_db)):

    if slug_or_id.isdigit():
        db_blog = blog_service.get_blog_by_id(db, int(slug_or_id))
    else:
        db_blog = blog_service.get_blog_by_slug(db, slug_or_id)

    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog

@router.put("/blogs/{blog_id}", response_model=schemas.BlogResponse)
def update_existing_blog(
    blog_id: int,
    blog_update: schemas.BlogUpdate,
    db: Session = Depends(get_db)

):
    db_blog = blog_service.update_blog(db, blog_id, blog_update)
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog

@router.delete("/blogs/{blog_id}")
def delete_existing_blog(
    blog_id: int,
    db: Session = Depends(get_db)

):
    success = blog_service.delete_blog(db, blog_id)
    if not success:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}
