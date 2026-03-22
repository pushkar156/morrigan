from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database.connection import engine, Base
from api import blogs, contact, chat, admin, upload

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Morrigan API",
    description="Backend API for Morrigan Editorial Platform — Blog management, AI chatbot, and content intelligence",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# ── CORS ──────────────────────────────────────────────────────────────────────
_origins_env = os.getenv("ALLOWED_ORIGINS")
if not _origins_env:
    # If in dev, we can fallback, but in prod we MUST have a whitelist.
    if os.getenv("ENV") != "dev":
        ALLOWED_ORIGINS = [] # Lock the door!
    else:
        ALLOWED_ORIGINS = ["http://localhost:3000"]
else:
    ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# ── Root & Health ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "Morrigan API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/api/docs",
        "endpoints": {
            "blogs": "/api/blogs",
            "contact": "/api/contact",
            "chat": "/api/chat",
            "auth": "/api/auth/login",
            "upload": "/api/upload"
        }
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "api": "operational"
    }


@app.get("/api/status")
def api_status():
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY_1")
    pinecone_key = os.getenv("PINECONE_API_KEY")

    return {
        "api": "online",
        "services": {
            "database": "operational",
            "gemini_ai": "configured" if gemini_key and gemini_key != "your_actual_gemini_key_here" else "not_configured",
            "pinecone": "configured" if pinecone_key and pinecone_key != "your_actual_pinecone_key_here" else "not_configured",
            "chatbot": "ready" if (gemini_key and pinecone_key) else "blocked"
        },
        "features": {
            "blogs": "enabled",
            "contact_form": "enabled",
            "chatbot": "pending_api_keys" if not (gemini_key and pinecone_key) else "enabled"
        }
    }


# ── Error Handlers ────────────────────────────────────────────────────────────

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested resource was not found",
            "path": str(request.url)
        }
    )


@app.exception_handler(500)
async def server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
