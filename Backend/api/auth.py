import os
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from utils.auth import verify_password, create_access_token

router = APIRouter()

# ── Models ───────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

# ── Endpoints ───────────────────────────────────────────────────────────────
@router.post("/login")
async def login(req: LoginRequest):
    """Verifies admin credentials and returns a JWT token."""
    ADMIN_USER = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASS = os.getenv("ADMIN_PASSWORD_HASH") # Expects a PBKDF2 hash
    
    # Check plaintext backup (ONLY for early dev or local fallback)
    ADMIN_PASS_PLAIN = os.getenv("ADMIN_PASSWORD", "morrigan123")

    if req.username != ADMIN_USER:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Final credential verify
    is_valid = False
    
    # 1. Check if hashed password matches
    if ADMIN_PASS:
        is_valid = verify_password(req.password, ADMIN_PASS)
    
    # 2. Check plaintext fallback (if not hashed yet)
    if not is_valid and req.password == ADMIN_PASS_PLAIN:
        is_valid = True

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Generate Token
    access_token = create_access_token(data={"sub": req.username})
    return {"access_token": access_token, "token_type": "bearer"}
