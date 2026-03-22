from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()

from database.connection import engine, Base
from api import blogs, contact, chat, admin, upload

# 🚀 [Morrigan API] Startup Sequence
app = FastAPI(title="Morrigan API", version="1.0.0")

# ── 🛡️ 1. CORS SHIELD (MUST BE FIRST) ──────────────────────────────────────────
env = os.getenv("ENV", "development").lower()
print(f"🌍 [ENVIRONMENT]: {env}")
if env == "production":
    origins_raw = os.getenv("ALLOWED_ORIGINS", "").split(",")
    ALLOWED_ORIGINS = [o.strip().rstrip("/") for o in origins_raw if o.strip()]
    ALLOW_CREDENTIALS = False if "*" in ALLOWED_ORIGINS else True
else:
    ALLOWED_ORIGINS = ["http://localhost:3000"]
    ALLOW_CREDENTIALS = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "Access-Control-Allow-Origin"],
    expose_headers=["Content-Length", "Authorization"],
)

# ── 🗄️ 2. DATABASE INIT (DEFERRED) ─────────────────────────────────────────────
try:
    Base.metadata.create_all(bind=engine)
    print("✅ [DB] System Online")
except Exception as e:
    print(f"❌ [DB] Startup Delay: {e}")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(blogs.router, prefix="/api", tags=["Blogs"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

# ── Serve uploaded images ─────────────────────────────────────────────────────
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def root():
    return {
        "service": "Morrigan API",
        "status": "online",
        "env": env
    }

# ── Error Handlers ────────────────────────────────────────────────────────────
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"error": "Not Found"})

@app.exception_handler(500)
async def server_error_handler(request, exc):
    return JSONResponse(status_code=500, content={"error": "Internal Error"})

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
