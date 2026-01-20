from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db, Analysis
import google.generativeai as genai
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

def get_latest_context(db: Session):
    latest = db.query(Analysis).order_by(Analysis.created_at.desc()).first()
    if not latest or not latest.raw_json_results:
        return None
    
    import json
    try:
        data = json.loads(latest.raw_json_results)
        return data.get("raw_markdown", "")
    except:
        return ""

@router.post("/api/chat")
async def chat_with_copilot(request: ChatRequest, db: Session = Depends(get_db)):
    user_message = request.message
    
    # 1. Get Context
    context_text = get_latest_context(db)
    
    if not context_text:
        return {
            "response": "I don't see any uploaded bank statements yet. Please upload a PDF first so I can analyze it!"
        }
    
    # 2. Configure Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured.")
        
    genai.configure(api_key=api_key)

    try:
        # Use Gemini Flash Latest (Stable Free Tier)
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""
You are the Maybank SME Copilot, an expert financial analyst.
You have access to the parsed text of the user's uploaded bank statement.

CONTEXT:
{context_text[:100000]} 

USER QUESTION:
{user_message}

INSTRUCTIONS:
- Answer accurately based *only* on the provided context.
- Expenses/Inflow numbers must be exact from the text.
- **Use bullet points** for lists and key numbers.
- **Be extremely concise**. Avoid fluffy intro/outro sentences.
- Use markdown tables if comparing data.
"""
        response = model.generate_content(prompt)
        
        return {"response": response.text}

    except Exception as e:
        print(f"Gemini Error: {e}")
        return {"response": f"⚠️ **AI Error**: I couldn't process that request. ({str(e)})"}
