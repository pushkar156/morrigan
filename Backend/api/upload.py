
import os
import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles

router = APIRouter()

# Directory where images will be saved
# Note: In production, consider using a cloud storage service like AWS S3 or Google Cloud Storage.
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "Web", "uploads")

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Handle image uploads from the admin editor.
    Returns a static URL that can be used to access the image.
    """
    # Simple validation
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    # Generate a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    try:
        # Save the file to the local filesystem
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Return the public URL
        # The frontend expects a path served via /static/uploads/
        return {"url": f"/static/uploads/{new_filename}"}
        
    except Exception as e:
        print(f"[Upload Error] {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save image")
