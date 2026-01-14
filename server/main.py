from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Verify API Key
if not os.getenv("LLAMA_CLOUD_API_KEY"):
    print("WARNING: LLAMA_CLOUD_API_KEY not found in environment variables. OCR will fail.")

from app.api.upload import router as upload_router

app = FastAPI(title="Maybank SME Copilot Backend")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
    "*" # Open for development convenience, tighten for prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upload_router)

@app.get("/")
async def root():
    return {"message": "Maybank SME Copilot Backend is Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
