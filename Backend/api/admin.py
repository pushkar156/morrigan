import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from database import schemas
from utils.auth import verify_password, create_access_token, get_current_admin
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# 🔐 Security Configuration
# These are loaded from .env or your Hosting Dashboard (Render/Railway)
ADMIN_USERNAMES_RAW = os.getenv("ADMIN_USERNAMES", "admin,Admin,ADMIN,Morrigan,MORRIGAN")
ADMIN_USERNAMES = [u.strip() for u in ADMIN_USERNAMES_RAW.split(",") if u.strip()]
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/auth/login", response_model=schemas.Token)
async def login_json(body: LoginRequest):
    """Login via JSON body (used by the Next.js frontend)."""
    return _authenticate(body.username, body.password)


@router.post("/login", response_model=schemas.Token)
async def login_form(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login via OAuth2 form (used by Swagger UI / tools)."""
    return _authenticate(form_data.username, form_data.password)


def _authenticate(username: str, password: str) -> dict:
    """Shared authentication logic."""
    if username not in ADMIN_USERNAMES:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Try hash-based verification first, fall back to plaintext for dev
    authenticated = False
    if ADMIN_PASSWORD_HASH:
        try:
            authenticated = verify_password(password, ADMIN_PASSWORD_HASH)
        except Exception:
            authenticated = False

    if not authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def read_users_me(admin: str = Depends(get_current_admin)):
    """Returns the currently authenticated admin's username."""
    return {"username": admin}
