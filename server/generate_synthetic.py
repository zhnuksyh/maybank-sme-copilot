from fpdf import FPDF
import random
from datetime import datetime, timedelta

class PDF(FPDF):
    def header(self):
        # Maybank Yellow Header Line
        self.set_fill_color(255, 204, 0) # Maybank Yellow
        self.rect(0, 0, 210, 25, 'F')
        
        # Logo Text (Simulated)
        self.set_font('Arial', 'B', 24)
        self.set_text_color(0, 0, 0)
        self.cell(10)
        self.cell(0, 15, 'Maybank Islamic', 0, 1, 'L')
        
        self.ln(10)
        
        # Account Info Block
        self.set_font('Arial', 'B', 10)
        self.cell(100, 5, 'MEGAMART SDN BHD', 0, 0)
        self.cell(90, 5, 'STATEMENT OF ACCOUNT', 0, 1, 'R')
        
        self.set_font('Arial', '', 9)
        self.cell(100, 5, '123 JALAN BISNES 4', 0, 0)
        
        # Dynamic Statement Date text if available
        period_text = getattr(self, 'period_text', 'Statement Date: 30 Jun 2024')
        self.cell(90, 5, period_text, 0, 1, 'R')
        
        self.cell(100, 5, 'TAMAN INDAH, 50000 KUALA LUMPUR', 0, 0)
        self.cell(90, 5, '', 0, 1, 'R')
        
        self.ln(5)
        self.set_font('Arial', 'B', 9)
        self.cell(30, 5, 'Account No:', 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(50, 5, '5123 4567 8901', 0, 1)
        
        self.set_font('Arial', 'B', 9)
        self.cell(30, 5, 'Account Type:', 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(50, 5, 'SME First Account-i', 0, 1)

        self.ln(10)

    def chapter_table(self, data):
        self.set_font('Arial', 'B', 8)
        self.set_fill_color(240, 240, 240)
        self.set_draw_color(200, 200, 200)
        
        # Header
        # Columns: Date | Value Date | Description | Debit | Credit | Balance
        self.cell(20, 8, 'Date', 1, 0, 'C', 1)
        self.cell(80, 8, 'Transaction Description', 1, 0, 'C', 1)
        self.cell(30, 8, 'Debit', 1, 0, 'C', 1)
        self.cell(30, 8, 'Credit', 1, 0, 'C', 1)
        self.cell(30, 8, 'Balance', 1, 1, 'C', 1)

        self.set_font('Arial', '', 8)
        for row in data:
            self.cell(20, 6, row[0], 'LR', 0, 'C')
            self.cell(80, 6, row[1][:45], 'LR', 0, 'L') # Truncate desc if too long
            self.cell(30, 6, row[2], 'LR', 0, 'R')
            self.cell(30, 6, row[3], 'LR', 0, 'R')
            self.cell(30, 6, row[4], 'LR', 1, 'R')
            
        self.cell(190, 0, '', 'T', 1) # Closure line

def generate_monthly_data(month_idx):
    data = []
    # Fixed start date for the year
    year_start = datetime(2024, 1, 1)
    
    # Calculate start and end of this specific month
    month_start = year_start + timedelta(days=30*month_idx)
    
    # Opening Balance logic
    balance = 10000.00 + (13000.00 * month_idx)
    
    # Opening Balance Row
    date_str = month_start.strftime('%d/%m/%y')
    data.append((date_str, "OPENING BALANCE", "", "", f"{balance:,.2f}"))
    
    # 1. Concentration Risk
    date_str = (month_start + timedelta(days=5)).strftime('%d/%m/%y')
    credit = 20000.00
    balance += credit
    data.append((date_str, "TRF FROM MAIN CLIENT BERHAD", "", f"{credit:,.2f}", f"{balance:,.2f}"))
    
    # 2. Regular Operational Expenses
    for i in range(random.randint(4, 7)):
        day = random.randint(1, 28)
        date_str = (month_start + timedelta(days=day)).strftime('%d/%m/%y')
        debit = float(random.randint(500, 2000))
        balance -= debit
        data.append((date_str, "PAYMENT TO SUPPLIER XYZ", f"{debit:,.2f}", "", f"{balance:,.2f}"))

    # 3. Small Inflows
    for i in range(random.randint(1, 4)):
        day = random.randint(1, 28)
        date_str = (month_start + timedelta(days=day)).strftime('%d/%m/%y')
        credit = float(random.randint(100, 500))
        balance += credit
        data.append((date_str, "CASH DEPOSIT", "", f"{credit:,.2f}", f"{balance:,.2f}"))
        
    # 4. RED FLAG: Bounced Cheque (Every 2 months)
    if month_idx % 2 != 0: 
        day = 15
        date_str = (month_start + timedelta(days=day)).strftime('%d/%m/%y')
        debit = 5000.00
        balance -= debit
        data.append((date_str, "RETURN CHEQUE - INSUFFICIENT FUNDS", f"{debit:,.2f}", "", f"{balance:,.2f}"))
        
    # 5. RED FLAG: Gambling (Month 3 = April)
    if month_idx == 3:
        day = 20
        date_str = (month_start + timedelta(days=day)).strftime('%d/%m/%y')
        debit = 2500.00
        balance -= debit
        data.append((date_str, "DEBIT CARD - GENTING CASINO", f"{debit:,.2f}", "", f"{balance:,.2f}"))
    
    # Sort
    data.sort(key=lambda x: datetime.strptime(x[0], '%d/%m/%y'))
    
    return data, month_start

# Main Generation Loop
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

for i, m_name in enumerate(months):
    pdf = PDF()
    
    # Set custom text for the header
    pdf.period_text = f"Statement Period: 01 {m_name} 2024 - 28 {m_name} 2024"
    
    pdf.add_page()
    data, start_date = generate_monthly_data(i)
    pdf.chapter_table(data)
    
    filename = f"Maybank_Statement_2024_{i+1:02d}_{m_name}.pdf"
    pdf.output(filename, 'F')
    print(f"Generated: {filename}")
