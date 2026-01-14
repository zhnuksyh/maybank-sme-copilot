import os
import tempfile
import pandas as pd
import re
import numpy as np
from typing import List, Dict, Any
from fastapi import UploadFile
from llama_parse import LlamaParse
from datetime import datetime

# Initialize LlamaParse
parser = LlamaParse(
    result_type="markdown",
    verbose=True,
)

async def process_pdfs(files: List[UploadFile]) -> Dict[str, Any]:
    all_transactions = []
    full_raw_markdown = ""
    
    # Metadata extraction
    detected_name = "Unknown Company"
    name_found = False

    for file in files:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        try:
            # Step 1: OCR
            documents = await parser.aload_data(tmp_path)
            
            for doc in documents:
                text = doc.text
                full_raw_markdown += text + "\n\n"
                
                # Attempt name extraction from the first file/page
                if not name_found:
                    possible_name = extract_entity_name(text)
                    if possible_name:
                        detected_name = possible_name
                        name_found = True
                
                # Step 2: Extraction
                transactions = extract_transactions_robust(text)
                all_transactions.extend(transactions)

        except Exception as e:
            print(f"Error processing file {file.filename}: {e}")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    # Step 3: Analytics & Scoring
    if not all_transactions:
        # Fallback if parsing failed completely, return empty structure but with error hint
        return {
            "status": "partial_success",
            "message": "No transactions extracted. Please ensure PDF is a clear bank statement.",
            "summary": {"total_inflow": 0, "total_outflow": 0, "score": 0, "risk_level": "Unknown"},
            "transactions": [],
            "graph_data": [],
            "insights": [],
            "entity_name": detected_name,
            "raw_markdown": full_raw_markdown
        }

    # Sort
    try:
        all_transactions.sort(key=lambda x: pd.to_datetime(x.get('date', ''), dayfirst=True, errors='coerce') or pd.Timestamp.min)
    except:
        pass

    monthly_summary, global_summary = compute_financial_analysis(all_transactions)
    
    return {
        "status": "success",
        "entity_name": detected_name,
        "summary": global_summary,
        "transactions": all_transactions,
        "graph_data": monthly_summary['graph_data'],
        "insights": monthly_summary['insights'],
        "top_payers": monthly_summary.get('top_payers', []),
        "red_flags": monthly_summary.get('red_flags', []),
        "raw_markdown": full_raw_markdown.strip()
    }

def extract_entity_name(text: str) -> str:
    """
    Simple heuristic to find a company name.
    Looks for lines ending in 'Sdn Bhd' or 'Inc' or similar in the first few lines.
    """
    lines = text.split('\n')
    for line in lines[:20]: # Check top 20 lines
        line = line.strip()
        if len(line) > 3 and len(line) < 100:
            if 'sdn bhd' in line.lower() or 'berhad' in line.lower() or 'enterprise' in line.lower():
                return line
            # Heuristic: If line implies an account holder
            if 'account name' in line.lower():
                return line.split(':')[-1].strip()
    return "MegaMart Sdn Bhd" # Fallback/Default

def extract_transactions_robust(markdown_text: str) -> List[Dict[str, Any]]:
    """
    More robust definition of table extraction.
    Searches for headers that resemble standard bank statement columns.
    """
    lines = markdown_text.split('\n')
    
    # Potential header keywords
    date_keywords = ['date', 'txn date', 'posting date']
    amount_keywords = ['amount', 'debit', 'credit', 'withdrawal', 'deposit', 'balance']
    desc_keywords = ['description', 'details', 'particulars', 'transaction']
    
    transactions = []
    
    # 1. Identify Table Block
    # Look for lines starting with |
    table_lines = [line.strip() for line in lines if line.strip().startswith('|') and line.strip().endswith('|')]
    
    if not table_lines:
        return []
        
    # 2. Find Header
    header_idx = -1
    headers = []
    
    for i, line in enumerate(table_lines):
        # clean content
        row_content = [c.strip().lower() for c in line.split('|')[1:-1]]
        # Check if this row has at least one Date keyword AND one Amount keyword
        has_date = any(k in cell for cell in row_content for k in date_keywords)
        has_amnt = any(k in cell for cell in row_content for k in amount_keywords)
        
        if has_date and has_amnt:
            header_idx = i
            headers = [c.strip() for c in line.split('|')[1:-1]] # Keep original case for keys if needed, but let's normalize
            break
            
    if header_idx == -1:
        # Fallback: assume first line is header if it has pipes
        if len(table_lines) > 2:
            header_idx = 0
            headers = [c.strip() for c in table_lines[0].split('|')[1:-1]]
        else:
            return []

    # Map headers to standard keys
    header_map = {}
    for idx, h in enumerate(headers):
        h_lower = h.lower()
        if any(k in h_lower for k in date_keywords):
            header_map['date'] = idx
        elif any(k in h_lower for k in ['debit', 'withdrawal', 'out']):
            header_map['debit'] = idx
        elif any(k in h_lower for k in ['credit', 'deposit', 'in']):
            header_map['credit'] = idx
        elif any(k in h_lower for k in ['amount']):
            header_map['amount'] = idx
        elif any(k in h_lower for k in desc_keywords):
            header_map['description'] = idx
            
    # If no 'date' found, abort
    if 'date' not in header_map:
        return []
        
    # 3. Parse Rows
    for line in table_lines[header_idx+1:]:
        if '---' in line: continue
        
        cells = [c.strip() for c in line.split('|')[1:-1]]
        if len(cells) != len(headers): continue
        
        txn = {}
        # Get Date
        txn['date'] = cells[header_map['date']]
        
        # Get Description
        if 'description' in header_map:
            txn['description'] = cells[header_map['description']]
        else:
            # Fallback: join all non-date/non-amount columns
            excludes = list(header_map.values())
            desc_parts = [c for i, c in enumerate(cells) if i not in excludes]
            txn['description'] = " ".join(desc_parts)

        # Get Amount
        inflow = 0.0
        outflow = 0.0
        
        def parse_curr(val):
            if not val: return 0.0
            clean = re.sub(r'[^\d\.\-]', '', val)
            try: return float(clean)
            except: return 0.0

        if 'credit' in header_map and 'debit' in header_map:
            inflow = parse_curr(cells[header_map['credit']])
            outflow = parse_curr(cells[header_map['debit']])
        elif 'amount' in header_map:
            # Heuristic: If there is a 'sign' column or we need to infer
            # Usually 'amount' + 'cr/dr' indicator column exists in some, but simplistic here:
            # If negative, outflow.
            val = parse_curr(cells[header_map['amount']])
            # Sometimes banks use () for negative or - sign
            if '(' in cells[header_map['amount']] or '-' in cells[header_map['amount']]:
                outflow = abs(val)
            else:
                inflow = val
                
        # Only add valid financial txns
        if inflow > 0 or outflow > 0:
            txn['inflow'] = inflow
            txn['outflow'] = outflow
            transactions.append(txn)
            
    return transactions

def compute_financial_analysis(transactions: List[Dict[str, Any]]):
    df = pd.DataFrame(transactions)
    if df.empty:
        return {"graph_data": [], "insights": []}, {"total_inflow": 0, "total_outflow": 0, "score": 0}
        
    # Ensure datetime
    df['dt'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')
    df = df.dropna(subset=['dt'])
    
    current_month = datetime.now()
    # Filter 2000-2030 to avoid OCR noise dates
    df = df[(df['dt'].dt.year > 2000) & (df['dt'].dt.year <= current_month.year + 1)]

    # Aggregates
    df['month_str'] = df['dt'].dt.strftime('%b')
    df['month_sort'] = df['dt'].dt.to_period('M')
    
    monthly_grp = df.groupby('month_sort').agg({
        'inflow': 'sum',
        'outflow': 'sum',
        'month_str': 'first'
    }).reset_index()
    
    monthly_grp = monthly_grp.sort_values('month_sort')
    
    total_inflow = df['inflow'].sum()
    total_outflow = df['outflow'].sum()
    
    # Build Graph Data
    graph_data = []
    for _, row in monthly_grp.iterrows():
        graph_data.append({
            "month": row['month_str'],
            "inflow": round(row['inflow'], 2),
            "outflow": round(row['outflow'], 2)
        })

    # SCORING ALGORITHM
    # 1. Cash Flow Health (40pts): Inflow > Outflow
    score = 50 # Base
    if total_inflow > total_outflow * 1.1: score += 20
    elif total_inflow > total_outflow: score += 10
    else: score -= 10
    
    # 2. Stability (30pts): Variance of inflow
    # Low variance = good
    if len(monthly_grp) > 1:
        inflow_std = monthly_grp['inflow'].std()
        inflow_mean = monthly_grp['inflow'].mean()
        cv = inflow_std / inflow_mean if inflow_mean > 0 else 1
        if cv < 0.2: score += 20
        elif cv < 0.5: score += 10
    else:
        score += 10 # Neutral if not enough data
        
    # 3. Growth (30pts): Last month > First month
    if len(monthly_grp) >= 2:
        first_m = monthly_grp.iloc[0]['inflow']
        last_m = monthly_grp.iloc[-1]['inflow']
        if last_m > first_m * 1.1: score += 20
        elif last_m > first_m: score += 10
    
    score = max(0, min(100, score)) # Clamp
    
    # RISK CATEGORY
    if score >= 80: risk_level = "Low Risk Profile"
    elif score >= 50: risk_level = "Moderate Risk"
    else: risk_level = "High Risk"

    # INSIGHTS
    insights = []
    
    # 4. CONCENTRATION RISK
    top_payers = []
    if not df.empty and total_inflow > 0:
        inflow_txns = df[df['inflow'] > 0].copy()
        if not inflow_txns.empty:
            # Simple cleaning of description to group similar payers
            inflow_txns['payer'] = inflow_txns['description'].apply(lambda x: re.sub(r'\d+', '', str(x)).strip().upper())
            
            payer_stats = inflow_txns.groupby('payer').agg({'inflow': 'sum'}).sort_values('inflow', ascending=False)
            
            top_1_amt = payer_stats.iloc[0]['inflow']
            top_1_name = payer_stats.index[0]
            concentration_ratio = (top_1_amt / total_inflow) * 100
            
            # Get Top 3 for display
            top_3 = payer_stats.head(3)
            for name, row in top_3.iterrows():
                top_payers.append({"name": name, "amount": round(row['inflow'], 2), "percentage": round((row['inflow']/total_inflow)*100, 1)})
            
            if concentration_ratio > 40:
                score -= 15
                insights.append({
                    "type": "warning",
                    "title": "High Customer Concentration",
                    "text": f"{(concentration_ratio):.1f}% of revenue comes from a single source: {top_1_name}."
                })
            elif concentration_ratio > 20:
                insights.append({
                    "type": "neutral",
                    "title": "Moderate Concentration",
                    "text": f"Top customer contributes {(concentration_ratio):.1f}% of revenue."
                })

    # 5. RED FLAGS
    red_flags = []
    risk_keywords = ['RETURN', 'REVERSAL', 'DISHONOURED', 'INSUFFICIENT', 'FEE', 'PENALTY']
    gambling_keywords = ['GENTING', 'CASINO', 'BET', 'MAGNUM', 'TOTO']
    
    def check_keywords(text, keywords):
        text = str(text).upper()
        return any(k in text for k in keywords)

    # Check for bounced cheques/returns
    returns = df[df['description'].apply(lambda x: check_keywords(x, risk_keywords))]
    if not returns.empty:
        count = len(returns)
        score -= (count * 5) # Heavy penalty
        red_flags.append(f"Detected {count} instances of Returned/Dishonoured transactions.")
        insights.append({
            "type": "negative",
            "title": "Operational Red Flags",
            "text": f"Found {count} transactions indicating bounced cheques or reversals."
        })

    # Check for Gambling/High Risk
    gambling = df[df['description'].apply(lambda x: check_keywords(x, gambling_keywords))]
    if not gambling.empty:
        score -= 20
        red_flags.append("transactions related to Gambling/Casinos detected.")
        insights.append({
            "type": "negative",
            "title": "High Risk Spend",
            "text": "Transactions related to gambling or high-risk activities detected."
        })

    
    # Growth Insight
    if len(monthly_grp) >= 2:
        growth = ((monthly_grp.iloc[-1]['inflow'] - monthly_grp.iloc[0]['inflow']) / monthly_grp.iloc[0]['inflow']) * 100 if monthly_grp.iloc[0]['inflow'] > 0 else 0
        if growth > 5:
            insights.append({
                "type": "positive",
                "title": "Revenue Growth",
                "text": f"Revenue grew by {int(growth)}% compares to the start of the period."
            })
        elif growth < -5:
            insights.append({
                "type": "negative",
                "title": "Declining Revenue",
                "text": f"Revenue dropped by {abs(int(growth))}% over the analysis period."
            })
            
    # Cash Flow Insight
    ratio = total_outflow / total_inflow if total_inflow > 0 else 0
    if ratio > 0.95:
         insights.append({
                "type": "warning",
                "title": "High Burn Rate",
                "text": "Outflow is nearly equal to or exceeds inflow. Monitoring required."
            })
    else:
         insights.append({
                "type": "positive",
                "title": "Healthy Margins",
                "text": "Business maintains a healthy surplus of cash flow."
            })

    score = max(0, min(100, score)) # Clamp
    
    # RISK CATEGORY
    if score >= 80: risk_level = "Low Risk Profile"
    elif score >= 50: risk_level = "Moderate Risk"
    else: risk_level = "High Risk"

    return {
        "graph_data": graph_data, 
        "insights": insights,
        "top_payers": top_payers,
        "red_flags": red_flags
    }, {
        "total_inflow": round(total_inflow, 2),
        "total_outflow": round(total_outflow, 2),
        "score": int(score),
        "risk_level": risk_level
    }

