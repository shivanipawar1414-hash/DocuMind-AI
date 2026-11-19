import fitz


def extract_pdf_text(file_path):

    extracted_pages = []

    pdf = fitz.open(file_path)

    for page_number, page in enumerate(pdf, start=1):

        page_text = page.get_text()

        extracted_pages.append({
            "page": page_number,
            "text": page_text
        })

    pdf.close()

    return extracted_pages