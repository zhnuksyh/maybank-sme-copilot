# Maybank SME Copilot

The **Maybank SME Copilot** is an AI-powered financial assistant designed to empower automated credit scoring and financial health analysis for Small and Medium Enterprises (SMEs). By leveraging **Google Gemini** for intelligent reasoning and **LlamaParse** for accurate document extraction, the copilot transforms raw bank statements into actionable insights, risk assessments, and interactive financial advice.

## 🚀 Key Features

*   **📄 Automated Bank Statement Analysis**
    *   Drag-and-drop PDF upload for instant processing.
    *   Extracts transactions, dates, and amounts using **LlamaParse (GenAI-native OCR)**.
    *   Classifies inflows, outflows, and identifies key counterparties.

*   **📊 Financial Health Scoring**
    *   Generates a proprietary **SME Copilot Score (0-100)**.
    *   Evaluates **Cash Flow Health**, **Revenue Stability**, and **Growth Trends**.
    *   categorizes businesses into Low, Moderate, or High Risk profiles.

*   **🛡️ Risk & Fraud Detection**
    *   **Metadata Forensics**: Detects potentially edited or fraudulent PDFs (e.g., created with Photoshop/Canva).
    *   **Red Flags**: Identifies bounced cheques, insufficient funds, and gambling-related transactions.
    *   **Concentration Risk**: Warns if a high percentage of revenue comes from a single client.

*   **💬 Interactive AI Chat**
    *   Chat with your financial data using **Google Gemini 1.5 Flash**.
    *   Ask questions like *"What is my biggest expense this month?"* or *"How volatile is my cash flow?"*.
    *   Context-aware responses based strictly on the uploaded statement.

*   **📈 Visual Dashboard**
    *   Interactive charts for monthly cash flow trends.
    *   Breakdown of top payers and operational insights.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Motion**: [Framer Motion](https://www.framer.com/motion/) for smooth animations.
*   **Charts**: [Recharts](https://recharts.org/) for data visualization.
*   **Icons**: [Lucide React](https://lucide.dev/).

### Backend
*   **API Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python).
*   **Database**: SQLite with [SQLAlchemy](https://www.sqlalchemy.org/).
*   **AI/LLM**:
    *   [Google Gemini 1.5 Flash](https://ai.google.dev/) for chat and reasoning.
    *   [LlamaParse](https://cloud.llamaindex.ai/) for high-fidelity PDF parsing.
*   **Data Processing**: Pandas for financial aggregation/analytics.

---

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   API Keys:
    *   **Google Gemini API Key** (for Chat)
    *   **Llama Cloud API Key** (for PDF Parsing)

### 1. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Create and activate a virtual environment:

```bash
# MacOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in the `server` directory and add your keys:

```ini
GEMINI_API_KEY=your_gemini_key_here
LLAMA_CLOUD_API_KEY=your_llama_cloud_key_here
```

Start the API server:

```bash
uvicorn app.server:app --reload
```
*The server will start at `http://127.0.0.1:8000`*

### 2. Frontend Setup

Open a new terminal and navigate to the project root:

```bash
# If you are in /server, go back out
cd .. 
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```
*The app will be available at `http://localhost:5173`*

---

## 💡 Usage Workflow

1.  **Upload**: Go to the **Upload** tab and select a PDF bank statement.
2.  **Analyze**: Wait for the processing to complete. The system will extract data, run risk checks, and compute scores.
3.  **Review**:
    *   **Results**: View the Financial Health Score, Risk Level, and Red Flags.
    *   **Dashboard**: Explore interactive charts of inflows/outflows.
4.  **Chat**: Switch to the **Copilot** tab to ask specific questions about the analyzed data.

---

## ⚠️ Notes
*   This is a prototype designed for demonstration purposes.
*   Ensure uploaded PDFs are readable bank statements for best results.
*   The "Metadata Forensics" is a heuristic check and not a guarantee of authenticity.
