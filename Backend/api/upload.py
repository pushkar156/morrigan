import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from utils.auth import get_current_admin

router = APIRouter()

# 1. Configure Cloudinary from environment variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Dev fallback for local storage
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_SIZE_MB = 5


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin)
):
    """Upload an image file. Prioritizes Cloudinary, falls back to local in Dev."""

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file.content_type}' not allowed."
        )

    content = await file.read()

    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {MAX_SIZE_MB}MB limit")

    # --- ☁️ Attempt Cloudinary Upload ---
    if os.getenv("CLOUDINARY_CLOUD_NAME"):
        try:
            # Re-upload directly from standard memory using upload()
            result = cloudinary.uploader.upload(content, folder="morrigan/uploads")
            return {"url": result.get("secure_url"), "filename": result.get("original_filename")}
        except Exception as e:
            print(f"[Cloudinary Error] {str(e)}. Attempting local fallback...")

    # --- 🏠 Local Fallback (Development Only) ---
    file_extension = os.path.splitext(file.filename or "image.jpg")[1].lower()
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        return {"url": f"/api/uploads/{new_filename}", "filename": new_filename}

    except Exception as e:
        print(f"[Upload Error] {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save image")
