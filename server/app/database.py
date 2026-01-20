from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import json

DATABASE_URL = "sqlite:///./sme_copilot.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ssm_number = Column(String, index=True, nullable=True) # Optional for now
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analyses = relationship("Analysis", back_populates="company")

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    # High Level Stats
    score = Column(Integer)
    risk_level = Column(String)
    total_inflow = Column(Float)
    total_outflow = Column(Float)
    
    # Store full JSON result for re-rendering
    # SQLite doesn't have native JSON type in older versions, so we store as Text
    raw_json_results = Column(Text) 
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    company = relationship("Company", back_populates="analyses")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
