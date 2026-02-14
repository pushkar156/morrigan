from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from pathlib import Path
router = APIRouter()
UPLOAD_DIR = Path("../Web/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File allows only images")
        extension = os.path.splitext(file.filename)[1]
        if not extension:
            extension = ".jpg"
        new_filename = f"{uuid.uuid4()}{extension}"
        file_path = UPLOAD_DIR / new_filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"url": f"/static/uploads/{new_filename}"}
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
