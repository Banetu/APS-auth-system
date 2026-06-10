from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / 'docs' / 'generated' / 'dashboard-images'
PUBLIC_DIR = IMAGES_DIR / 'public'


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
	font_candidates = [
		('C:/Windows/Fonts/meiryob.ttc' if bold else 'C:/Windows/Fonts/meiryo.ttc'),
		('C:/Windows/Fonts/YuGothB.ttc' if bold else 'C:/Windows/Fonts/YuGothM.ttc'),
		('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf'),
	]
	for candidate in font_candidates:
		if Path(candidate).exists():
			return ImageFont.truetype(candidate, size=size)
	return ImageFont.load_default()


FONT_14 = load_font(14)
FONT_16 = load_font(16)
FONT_18_B = load_font(18, bold=True)
FONT_22_B = load_font(22, bold=True)
RED = '#d92d20'
WHITE = '#ffffff'
BLACK = '#101828'
GRAY = '#475467'
MASK = '#f8fafc'
MASK_BORDER = '#cbd5e1'


def rgba(image: Image.Image) -> Image.Image:
	return image.convert('RGBA')


def save(image: Image.Image, filename: str) -> None:
	PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
	image.convert('RGB').save(PUBLIC_DIR / filename, quality=95)


def rounded_box(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], outline: str, fill: str | None = None, width: int = 4, radius: int = 16) -> None:
	draw.rounded_rectangle(box, radius=radius, outline=outline, fill=fill, width=width)


def redact(image: Image.Image, box: tuple[int, int, int, int], label: str = '個人情報を伏せています') -> None:
	overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
	draw = ImageDraw.Draw(overlay)
	rounded_box(draw, box, outline=MASK_BORDER, fill=MASK, width=2, radius=12)
	text_box = (box[0] + 12, box[1] + 8)
	draw.text(text_box, label, fill=GRAY, font=FONT_14)
	image.alpha_composite(overlay)


def label_box(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, body: str) -> None:
	rounded_box(draw, box, outline=RED, fill=WHITE, width=3, radius=16)
	draw.text((box[0] + 14, box[1] + 10), title, fill=BLACK, font=FONT_18_B)
	draw.multiline_text((box[0] + 14, box[1] + 38), body, fill=GRAY, font=FONT_16, spacing=5)


def badge(draw: ImageDraw.ImageDraw, center: tuple[int, int], number: int) -> None:
	x, y = center
	draw.ellipse((x - 24, y - 24, x + 24, y + 24), fill=RED, outline=WHITE, width=3)
	text = str(number)
	bbox = draw.textbbox((0, 0), text, font=FONT_22_B)
	tw = bbox[2] - bbox[0]
	th = bbox[3] - bbox[1]
	draw.text((x - tw / 2, y - th / 2 - 2), text, fill=WHITE, font=FONT_22_B)


def framed_callout(
	draw: ImageDraw.ImageDraw,
	frame_box: tuple[int, int, int, int],
	number: int,
	title: str,
	body: str,
	label_anchor: tuple[int, int, int, int],
	badge_center: tuple[int, int] | None = None,
) -> None:
	rounded_box(draw, frame_box, outline=RED, width=5, radius=18)
	label_box(draw, label_anchor, title, body)
	badge(draw, badge_center or (label_anchor[0] - 18, label_anchor[1] - 18), number)


def crop(source: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
	return source.crop(box)


def generate_overview() -> None:
	image = rgba(Image.open(IMAGES_DIR / 'dashboard-full-wide.png'))
	draw = ImageDraw.Draw(image)

	redact(image, (1040, 8, 1338, 42), '管理者メールを伏せています')
	redact(image, (245, 96, 720, 130), 'ログイン中メールを伏せています')
	redact(image, (226, 334, 1475, 1498), '申請者の氏名・学籍・連絡先を伏せています')
	redact(image, (226, 1706, 1475, 2994), 'プロフィールの氏名・LINE名・電話番号・メールを伏せています')
	redact(image, (226, 3056, 1475, 3190), 'お問い合わせの送信者情報と本文を伏せています')

	framed_callout(
		draw,
		(226, 58, 1475, 132),
		1,
		'ログイン状態の確認',
		'担当者本人の管理者アカウントで開けているかを最初に確認します。',
		(1010, 70, 1440, 145),
	)
	framed_callout(
		draw,
		(226, 153, 1475, 240),
		2,
		'概要統計',
		'今日どこから見始めるかを決めるため、未処理件数の目安を先に見ます。',
		(1015, 165, 1450, 255),
	)
	framed_callout(
		draw,
		(226, 261, 1475, 1490),
		3,
		'入会リクエスト一覧',
		'新規申請や未処理申請を確認する起点です。\n必要に応じて横スクロールし、右端の操作を使います。',
		(1030, 290, 1470, 390),
	)
	framed_callout(
		draw,
		(226, 1534, 1475, 2986),
		4,
		'学生プロフィール一覧',
		'登録後の確認、名簿整理、情報修正に使います。',
		(1035, 1560, 1475, 1650),
	)
	framed_callout(
		draw,
		(226, 3018, 1475, 3177),
		5,
		'お問い合わせ一覧',
		'問い合わせ本文の確認と、対応済みデータの整理に使います。',
		(1025, 2885, 1455, 2975),
	)

	header = Image.new('RGBA', image.size, (255, 255, 255, 0))
	hdraw = ImageDraw.Draw(header)
	label_box(hdraw, (40, 40, 520, 150), '外部共有用サンプル', 'この画像は個人情報を伏せた配布用です。')
	image.alpha_composite(header)

	save(image, 'dashboard-overview-public.png')


def generate_join_requests() -> None:
	image = rgba(Image.open(IMAGES_DIR / 'join-requests-section.png'))
	draw = ImageDraw.Draw(image)

	redact(image, (18, 120, 1232, 1046), '申請者の氏名・学籍・連絡先を伏せています')

	framed_callout(
		draw,
		(18, 18, 340, 64),
		1,
		'一覧タイトル',
		'ここで新規申請と未処理申請を確認します。',
		(820, 28, 1228, 115),
	)
	framed_callout(
		draw,
		(12, 64, 1236, 118),
		2,
		'表示項目',
		'学生番号・氏名・学年などを見て、申請内容と確認対象を判断します。',
		(740, 132, 1228, 228),
	)
	label_box(draw, (730, 250, 1228, 380), '3. 右端の操作', '実画面では横スクロール先の右端に\n「認証済みにする」「削除」があります。\n確認後にだけ実行してください。')
	badge(draw, (704, 226), 3)

	save(image, 'join-requests-public.png')


def generate_profile_controls() -> None:
	full = rgba(Image.open(IMAGES_DIR / 'dashboard-full-wide.png'))
	image = crop(full, (226, 1534, 1475, 1860))
	draw = ImageDraw.Draw(image)

	redact(image, (20, 108, 1228, 322), 'プロフィールの氏名・LINE名・電話番号・メールを伏せています')
	redact(image, (1168, 95, 1245, 323), '')

	framed_callout(
		draw,
		(18, 18, 470, 62),
		1,
		'青山学院大学生のみ表示',
		'青学生だけを見たい時に使います。名簿確認の最初の絞り込みです。',
		(850, 18, 1220, 92),
	)
	framed_callout(
		draw,
		(182, 46, 330, 84),
		2,
		'ソート項目',
		'学部順・学生番号順・学年順など、確認したい切り口を選びます。',
		(810, 98, 1222, 182),
	)
	framed_callout(
		draw,
		(334, 46, 424, 84),
		3,
		'昇順',
		'小さい順・あいうえお順で確認したい時に使います。',
		(730, 188, 1075, 262),
	)
	framed_callout(
		draw,
		(430, 46, 518, 84),
		4,
		'降順',
		'大きい順・逆順で確認したい時に使います。',
		(1085, 188, 1225, 262),
	)
	framed_callout(
		draw,
		(530, 42, 690, 88),
		5,
		'表示件数',
		'絞り込みが効いているか、表示件数で確認できます。',
		(845, 268, 1225, 344),
	)

	save(image, 'profile-controls-public.png')


def generate_profile_modal() -> None:
	image = rgba(Image.open(IMAGES_DIR / 'profile-edit-modal.png'))
	draw = ImageDraw.Draw(image)

	redact(image, (102, 81, 280, 108), 'メールを伏せています')
	for box in [
		(24, 135, 247, 168),
		(264, 135, 488, 168),
		(24, 208, 247, 239),
		(264, 208, 488, 239),
		(24, 279, 247, 308),
		(264, 279, 488, 308),
		(24, 348, 247, 377),
		(264, 348, 488, 377),
		(24, 416, 247, 447),
	]:
		redact(image, box, '')

	framed_callout(
		draw,
		(22, 108, 490, 452),
		1,
		'編集できる項目',
		'大学名・学生番号・氏名・学部・学科・学年・LINE名・電話番号を修正できます。',
		(22, 458, 320, 528),
	)
	framed_callout(
		draw,
		(401, 486, 456, 521),
		2,
		'保存する',
		'修正後はこのボタンで保存します。保存しないと一覧に反映されません。',
		(326, 436, 506, 486),
	)
	label_box(draw, (330, 70, 502, 132), '注意', 'メールアドレスは\n編集できません。')

	save(image, 'profile-edit-modal-public.png')


def generate_contact_list() -> None:
	image = rgba(Image.open(IMAGES_DIR / 'contact-section.png'))
	draw = ImageDraw.Draw(image)

	redact(image, (22, 118, 350, 164), '送信者情報を伏せています')
	redact(image, (628, 118, 980, 164), '本文を伏せています')

	framed_callout(
		draw,
		(620, 116, 980, 162),
		1,
		'本文を開く',
		'青いメッセージ部分を押すと全文モーダルが開きます。最初の確認操作です。',
		(760, 16, 1228, 92),
	)
	framed_callout(
		draw,
		(1182, 114, 1234, 164),
		2,
		'削除',
		'対応済みで残す必要がない問い合わせだけ削除します。',
		(880, 94, 1228, 164),
	)

	save(image, 'contact-list-public.png')


def generate_contact_modal() -> None:
	image = rgba(Image.open(IMAGES_DIR / 'contact-message-modal.png'))
	draw = ImageDraw.Draw(image)

	redact(image, (63, 80, 220, 100), '')
	redact(image, (82, 112, 232, 135), '')
	redact(image, (61, 144, 132, 167), '')
	redact(image, (34, 207, 646, 276), '本文を伏せています')

	framed_callout(
		draw,
		(24, 74, 235, 169),
		1,
		'送信者情報',
		'氏名・メール・件名を見て、誰からの問い合わせか判断します。',
		(392, 68, 652, 142),
	)
	framed_callout(
		draw,
		(22, 200, 650, 278),
		2,
		'メッセージ本文',
		'長文の問い合わせはここで全文を読み、対応内容を判断します。',
		(388, 150, 652, 224),
	)

	save(image, 'contact-message-modal-public.png')


def main() -> None:
	generate_overview()
	generate_join_requests()
	generate_profile_controls()
	generate_profile_modal()
	generate_contact_list()
	generate_contact_modal()
	print('Generated public dashboard assets in', PUBLIC_DIR)


if __name__ == '__main__':
	main()