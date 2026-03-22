import os
import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from utils.auth import get_current_admin

router = APIRouter()

# Store uploads inside Backend/uploads/ (dev). In production, swap for cloud storage.
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_SIZE_MB = 5


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin)
):
    """Upload an image file. Returns a URL for the stored image.
    Requires admin authentication."""

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file.content_type}' not allowed. Accepted: JPEG, PNG, WebP, GIF, SVG"
        )

    content = await file.read()

    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {MAX_SIZE_MB}MB limit")

    file_extension = os.path.splitext(file.filename or "image.jpg")[1].lower()
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # Return a URL path that the frontend can reference
        return {"url": f"/api/uploads/{new_filename}", "filename": new_filename}

    except Exception as e:
        print(f"[Upload Error] {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save image")
