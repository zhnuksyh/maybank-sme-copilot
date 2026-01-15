from pypdf import PdfReader, PdfWriter

def create_forgery():
    try:
        reader = PdfReader("Maybank_Statement_2024_01_Jan.pdf")
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        # Inject Suspicious Metadata
        writer.add_metadata({
            "/Producer": "Microsoft Word",
            "/Creator": "Microsoft Word 2016",
            "/Title": "Forged Statement"
        })

        with open("forged_bank_statement.pdf", "wb") as f:
            writer.write(f)
            
        print("Forged PDF created: forged_bank_statement.pdf")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_forgery()
