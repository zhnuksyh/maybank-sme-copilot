from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import json
from app.services.ocr import process_pdfs
from app.database import SessionLocal, Company, Analysis

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
    
    # (LlamaParse supports multiple formats, but prompt says PDF bank statements)
    
    try:
        result = await process_pdfs(files)
        
        # Save to Database
        if result.get("status") == "success":
            db = SessionLocal()
            try:
                # 1. Company Handling
                name = result.get("entity_name", "Unknown Company")
                company = db.query(Company).filter(Company.name == name).first()
                if not company:
                    company = Company(name=name, ssm_number="Unknown") # Populate SSM if we extract it later
                    db.add(company)
                    db.commit()
                    db.refresh(company)
                
                # 2. Analysis Record
                summary = result.get("summary", {})
                analysis = Analysis(
                    company_id=company.id,
                    score=int(summary.get("score", 0)),
                    risk_level=summary.get("risk_level", "Unknown"),
                    total_inflow=float(summary.get("total_inflow", 0.0)),
                    total_outflow=float(summary.get("total_outflow", 0.0)),
                    raw_json_results=json.dumps(result) # Store full payload for re-render
                )
                db.add(analysis)
                db.commit()
                db.refresh(analysis)
                
                # Append ID to result so frontend knows it matches a DB record
                result["id"] = analysis.id
                
            except Exception as db_e:
                print(f"Database Error: {db_e}")
            finally:
                db.close()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
