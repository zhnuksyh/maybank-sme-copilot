from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Analysis, Company
import json

router = APIRouter()

@router.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    """
    Returns a list of all past analyses, joined with Company data.
    """
    history = db.query(
        Analysis.id,
        Analysis.score,
        Analysis.risk_level,
        Analysis.created_at,
        Company.name.label("company_name")
    ).join(Company).order_by(Analysis.created_at.desc()).all()
    
    return [
        {
            "id": h.id,
            "company_name": h.company_name,
            "score": h.score,
            "risk_level": h.risk_level,
            "date": h.created_at.isoformat()
        }
        for h in history
    ]

@router.get("/api/analysis/{id}")
def get_analysis_detail(id: int, db: Session = Depends(get_db)):
    """
    Returns the full JSON payload for a specific analysis to re-render the dashboard.
    """
    record = db.query(Analysis).filter(Analysis.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    try:
        # Provide the stored JSON
        data = json.loads(record.raw_json_results)
        return data
    except:
        raise HTTPException(status_code=500, detail="Corrupt data in history record")

@router.delete("/api/analysis/{id}")
def delete_analysis(id: int, db: Session = Depends(get_db)):
    """
    Deletes a specific analysis record.
    """
    record = db.query(Analysis).filter(Analysis.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    db.delete(record)
    db.commit()
    return {"message": "Analysis deleted successfully"}
