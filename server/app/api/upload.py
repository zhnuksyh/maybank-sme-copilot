from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.services.ocr import process_pdfs

router = APIRouter()

@router.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Endpoint to upload PDF bank statements.
    Processing involves:
    1. Receiving files
    2. Sending to LlamaParse (OCR)
    3. Extracting and Aggregating data
    4. Returning JSON for frontend visualization
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    # Filter for PDFs if needed, but for now allow generic file handling by the service
    # (LlamaParse supports multiple formats, but prompt says PDF bank statements)
    
    try:
        result = await process_pdfs(files)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
