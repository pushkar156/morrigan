import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.ai_service import ask_morrigan
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Morrigan RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "Online"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response = ask_morrigan(request.message)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)