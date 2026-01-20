from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os
import sqlite3
import pandas as pd
from app.database import init_db

# Load environment variables
load_dotenv()

# Verify API Key
if not os.getenv("LLAMA_CLOUD_API_KEY"):
    print("WARNING: LLAMA_CLOUD_API_KEY not found in environment variables. OCR will fail.")

from app.api.upload import router as upload_router
from app.api.history import router as history_router
from app.api.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Maybank SME Copilot Backend", lifespan=lifespan)

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
app.include_router(history_router)
app.include_router(chat_router)

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Maybank SME Copilot Backend</title>
            <style>
                body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
                .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
                a { color: #FFC805; text-decoration: none; font-weight: bold; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>✅ Backend is Running</h1>
                <p>Docs available at <a href="/docs">/docs</a></p>
                <p>Raw DB Viewer at <a href="/db-viewer">/db-viewer</a></p>
            </div>
        </body>
    </html>
    """

@app.get("/db-viewer", response_class=HTMLResponse)
def db_viewer():
    """
    Custom Raw Database Viewer to replace the failing VS Code extension.
    """
    try:
        conn = sqlite3.connect("sme_copilot.db")
        
        # Get Companies
        companies = pd.read_sql_query("SELECT * FROM companies", conn)
        companies_html = companies.to_html(index=False, classes="table table-striped w-100")
        
        # Get Analyses (subset of columns)
        analyses = pd.read_sql_query("SELECT id, company_id, score, risk_level, total_inflow, created_at FROM analyses ORDER BY id DESC", conn)
        analyses_html = analyses.to_html(index=False, classes="table table-striped w-100")
        
        conn.close()
        
        return f"""
        <html>
        <head>
            <title>SME Copilot DB Viewer</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {{ padding: 3rem; background: #111827; color: #e5e7eb; font-family: 'Inter', system-ui, -apple-system, sans-serif; }}
                h1 {{ color: #FFC805; font-weight: 800; margin-bottom: 2rem; letter-spacing: -0.025em; }}
                h2 {{ margin-top: 3rem; color: #f3f4f6; border-left: 4px solid #FFC805; padding-left: 1rem; margin-bottom: 1.5rem; font-size: 1.5rem; }}
                
                .container {{ max-width: 1400px; margin: 0 auto; }}
                
                .card {{
                    background: #1f2937;
                    border: 1px solid #374151;
                    border-radius: 1rem;
                    overflow: hidden;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }}

                .table {{ color: #e5e7eb; margin-bottom: 0; width: 100%; table-layout: auto; }}
                .table thead th {{ 
                    background-color: #374151; 
                    color: #FFC805; 
                    border-bottom: 2px solid #4b5563;
                    padding: 1rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    text-align: left;
                }}
                .table td {{ 
                    padding: 1rem; 
                    border-bottom: 1px solid #374151; 
                    vertical-align: middle;
                    text-align: left;
                }}
                .table-striped tbody tr:nth-of-type(odd) {{ background-color: rgba(255, 255, 255, 0.02); }}
                .table-hover tbody tr:hover {{ background-color: rgba(255, 200, 5, 0.1); }}
                
                /* Scrollbar styling */
                ::-webkit-scrollbar {{ width: 8px; height: 8px; }}
                ::-webkit-scrollbar-track {{ background: #1f2937; }}
                ::-webkit-scrollbar-thumb {{ background: #4b5563; border-radius: 4px; }}
                ::-webkit-scrollbar-thumb:hover {{ background: #6b7280; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="d-flex align-items-center gap-3 mb-5">
                     <span style="font-size: 2.5rem;">📂</span>
                     <h1 class="mb-0">SQLite Database Content</h1>
                </div>
                
                <h2>Companies</h2>
                <div class="card">
                    <div class="table-responsive">
                        {companies_html}
                    </div>
                </div>
                
                <h2>Analysis History</h2>
                <div class="card">
                    <div class="table-responsive">
                        {analyses_html}
                    </div>
                </div>
                
                <div style="margin-top: 3rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
                    Maybank SME Copilot • Backend Data Viewer
                </div>
            </div>
        </body>
        </html>
        """
    except Exception as e:
        return f"<h1>Error reading database: {e}</h1>"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
