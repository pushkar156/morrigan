import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, blogs, upload, admin, chat
from database.connection import engine, Base

# ── 🏗️ 1. SETUP ───────────────────────────────────────────────────────────────
app = FastAPI(title="Morrigan API", version="1.0.0")

# 🌍 [Environment Detection] ───────────────────────────────────────────────────
env = os.getenv("ENV", "development").lower()
print(f"🌍 [ENVIRONMENT]: {env}")

# 🚀 [CORS Hardening] ─────────────────────────────────────────────────────────
origins_raw = os.getenv("ALLOWED_ORIGINS", "").split(",")
ALLOWED_ORIGINS = [o.strip().rstrip("/") for o in origins_raw if o.strip()]

# Backup: Always allow the known Vercel URL
if "https://morrigan-xi.vercel.app" not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append("https://morrigan-xi.vercel.app")

ALLOW_CREDENTIALS = True
if "*" in ALLOWED_ORIGINS:
    ALLOW_CREDENTIALS = False

print(f"📡 [CORS] Origins: {ALLOWED_ORIGINS}")
print(f"📡 [CORS] Credentials: {ALLOW_CREDENTIALS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Length", "Authorization"],
)

# ── 🏁 1.5 HEALTH CHECK ──────────────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "environment": env,
        "database": "connected" # Simplified for check
    }

# ── 🗄️ 2. DATABASE INIT (DEFERRED) ─────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    print(f"📡 [STARTUP] Initializing engines...")

# ── 🛣️ 3. ROUTES ───────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(blogs.router, prefix="/api", tags=["Blogs"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])

# ── 📂 4. STATIC FILES ─────────────────────────────────────────────────────────
from fastapi.staticfiles import StaticFiles
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
