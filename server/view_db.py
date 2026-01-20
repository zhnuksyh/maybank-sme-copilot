import sqlite3
import pandas as pd
import os

def view_database():
    db_path = "sme_copilot.db"
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        
        print("\n=== COMPANIES ===")
        companies = pd.read_sql_query("SELECT * FROM companies", conn)
        if not companies.empty:
            print(companies.to_markdown(index=False))
        else:
            print("No companies found.")

        print("\n\n=== ANALYSES HISTORY ===")
        # Select relevant columns, exclude the massive raw JSON
        analyses = pd.read_sql_query("SELECT id, company_id, score, risk_level, total_inflow, created_at FROM analyses", conn)
        if not analyses.empty:
            print(analyses.to_markdown(index=False))
        else:
            print("No analyses found.")
            
        conn.close()
        
    except Exception as e:
        print(f"Error reading database: {e}")

if __name__ == "__main__":
    # Ensure we show all columns/rows
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 1000)
    view_database()
