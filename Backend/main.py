from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database.connection import engine, Base

from api import blogs, contact, chat, admin, upload

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Morrigan API",
    description="Backend API for Morrigan Editorial Platform - Context-aware AI chatbot and blog management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

class CORSHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(CORSHeaderMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blogs.router, prefix="/api", tags=["Blogs"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

app.mount("/static", StaticFiles(directory="../Web"), name="static")

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
            "chat": "/api/chat"
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

    gemini_key = os.getenv("GEMINI_API_KEY")
    pinecone_key = os.getenv("PINECONE_API_KEY")

    return {
        "api": "online",
        "services": {
            "database": "operational",
            "gemini_ai": "configured" if gemini_key and gemini_key != "your_gemini_api_key_here" else "not_configured",
            "pinecone": "configured" if pinecone_key and pinecone_key != "your_pinecone_api_key_here" else "not_configured",
            "chatbot": "ready" if (gemini_key and pinecone_key) else "blocked"
        },
        "features": {
            "blogs": "enabled",
            "contact_form": "enabled",
            "chatbot": "pending_api_keys" if not (gemini_key and pinecone_key) else "enabled"
        }
    }

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

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
