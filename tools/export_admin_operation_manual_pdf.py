from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
html_path = (ROOT / 'docs' / 'generated' / 'admin-operation-manual-print.html').resolve()
pdf_path = ROOT / 'docs' / 'generated' / 'admin-operation-manual-print.pdf'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 2200})
    page.goto(html_path.as_uri(), wait_until='networkidle')
    page.pdf(
        path=str(pdf_path),
        format='A4',
        print_background=True,
        margin={'top': '12mm', 'right': '12mm', 'bottom': '12mm', 'left': '12mm'},
    )
    browser.close()

print(f'Exported PDF to {pdf_path}')
