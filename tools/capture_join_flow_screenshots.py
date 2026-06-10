from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / 'docs' / 'generated' / 'join-flow-images'
BASE_URL = 'https://aps-auth-system.vercel.app'


def capture(page, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # Prefer the main content area to avoid excessive blank space in manuals.
    main = page.locator('main').first
    if main.count() > 0:
        main.screenshot(path=str(path))
    else:
        page.screenshot(path=str(path))


with sync_playwright() as p:
    browser = p.chromium.launch()
    # Keep screenshots readable while avoiding oversized output.
    page = browser.new_page(viewport={'width': 1365, 'height': 980})

    # Top page where users choose the appropriate form.
    page.goto(f'{BASE_URL}/', wait_until='networkidle')
    capture(page, OUT_DIR / 'join-form-top.png')

    page.goto(f'{BASE_URL}/join/form/aoyama-student', wait_until='networkidle')
    capture(page, OUT_DIR / 'aoyama-form-initial.png')

    # Trigger the name format warning intentionally (no half-width space).
    page.fill('input[placeholder="例: 山田 太郎"]', '山田太郎')
    page.wait_for_timeout(400)
    capture(page, OUT_DIR / 'aoyama-form-name-warning.png')

    page.goto(f'{BASE_URL}/join/form/other', wait_until='networkidle')
    capture(page, OUT_DIR / 'other-form-initial.png')

    page.locator('text=入会の流れ').first.scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    capture(page, OUT_DIR / 'other-form-flow.png')

    browser.close()

print(f'Captured join flow screenshots to {OUT_DIR}')
