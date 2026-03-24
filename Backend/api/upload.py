import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Request
from utils.auth import get_current_admin

router = APIRouter()

# ── 🔍 [Cloud-Status] Initializing Cloudinary ──────────────────────────────────
c_name = os.getenv("CLOUDINARY_CLOUD_NAME")
c_key = os.getenv("CLOUDINARY_API_KEY")
c_sec = os.getenv("CLOUDINARY_API_SECRET")

if c_name and c_key and c_sec:
    cloudinary.config(
        cloud_name=c_name,
        api_key=c_key,
        api_secret=c_sec,
        secure=True
    )
    print("✅ [Cloudinary] Integrated")
else:
    print("❌ [Cloudinary] Key(s) missing from environment")

@router.post("/upload")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin)
):
    # ── 🔍 [Audit] Incoming Request ──────────────────────────────────────────
    print(f"🧐 [Cloud-Audit] Upload started by {admin}")
    print(f"🧐 [Cloud-Audit] Config Check: NAME={'✅' if c_name else '❌'} KEY={'✅' if c_key else '❌'} SEC={'✅' if c_sec else '❌'}")
    
    content = await file.read()
    
    # --- ☁️ Attempt Cloudinary Upload ---
    if c_name:
        try:
            result = cloudinary.uploader.upload(content, folder="morrigan/uploads")
            print(f"✅ [Cloudinary] Success: {result.get('secure_url')}")
            return {
                "url": result.get("secure_url"),
                "filename": str(uuid.uuid4())
            }
        except Exception as e:
            print(f"❌ [Cloudinary Error] {str(e)}")
            # Fail fast if keys are present but upload fails (likely key typo)
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

    # --- 🏠 Local Fallback (Development Only) ---
    UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename or "image.jpg")[1].lower()
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Build absolute URL using the Request host
        base_url = str(request.base_url).rstrip("/")
        full_url = f"{base_url}/api/uploads/{new_filename}"
        print(f"⚠️ [Fallback] Local storage used: {full_url}")
        
        return {"url": full_url, "filename": new_filename}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Local store failed: {e}")
