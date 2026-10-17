import openpyxl
import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"d:\AI_road\Project\full_stack_projects\chinese-app"
RAW_DIR = os.path.join(ROOT_DIR, "data", "raw", "bonusFunctions")
SRC_DATA_DIR = os.path.join(ROOT_DIR, "frontend", "src", "data", "bonus")
PUBLIC_DATA_DIR = os.path.join(ROOT_DIR, "frontend", "public", "content", "bonus")
PROCESSED_DATA_DIR = os.path.join(ROOT_DIR, "data", "processed", "bonus")

for d in [SRC_DATA_DIR, PUBLIC_DATA_DIR, PROCESSED_DATA_DIR]:
    os.makedirs(d, exist_ok=True)

def clean_text(val):
    if val is None:
        return ""
    txt = str(val).strip()
    txt = txt.replace("\xa0", " ")
    txt = re.sub(r"\s+", " ", txt)
    return txt.strip()

def process_hsk5():
    files = [f for f in os.listdir(RAW_DIR) if "HSK" in f and f.endswith(".xlsx")]
    if not files:
        print("Error: HSK5 file not found in", RAW_DIR)
        return []
    
    file_path = os.path.join(RAW_DIR, files[0])
    print(f"Reading HSK5 from: {files[0]}")
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active

    records = []
    for r in range(3, sheet.max_row + 1):
        stt = sheet.cell(r, 1).value
        hanzi = clean_text(sheet.cell(r, 2).value)
        pinyin = clean_text(sheet.cell(r, 3).value).replace("/", "").strip()
        pos = clean_text(sheet.cell(r, 4).value)
        meaning = clean_text(sheet.cell(r, 5).value)
        example = clean_text(sheet.cell(r, 6).value)
        example_pinyin = clean_text(sheet.cell(r, 7).value).replace("/", "").strip()

        if not hanzi:
            continue

        stt_num = int(stt) if stt and str(stt).isdigit() else (len(records) + 1)

        records.append({
            "id": f"hsk5_{stt_num}",
            "stt": stt_num,
            "word": hanzi,
            "hanzi": hanzi,
            "pinyin": pinyin,
            "partOfSpeech": pos,
            "meaning": meaning,
            "example": example,
            "examplePinyin": example_pinyin,
            "category": "HSK 5",
            "topic": "Từ vựng HSK 5",
            "level": 5,
            "language": "zh"
        })

    print(f"Successfully processed {len(records)} HSK5 records.")
    return records


def process_toeic():
    file_path = os.path.join(RAW_DIR, "toiec vocab (Autosaved).xlsx")
    print("Reading TOEIC from:", file_path)
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active

    TOPIC_MAP = {
        'PRE': 'Cơ bản & Công sở (Foundation)',
        'At the shop': 'Mua sắm & Cửa hàng (Shopping)',
        'At the restaurant': 'Nhà hàng & Dịch vụ (Dining)',
        'Other vocab': 'Từ vựng Tổng hợp (General Vocab)',
        'Activities with hands': 'Hành động tay (Hand Actions)',
        'Activities with eyes': 'Hành động mắt (Eye Actions)',
        'Activities with foot': 'Di chuyển & Đi lại (Movement)',
        '1. Two people’s activities': 'Hoạt động giao tiếp (Interaction)',
        '2. Two people’s activities with eyes': 'Hoạt động ánh nhìn (Eye Contact)',
        '3. People’s postures': 'Tư thế con người (Postures)',
        'L23 Investments': 'Đầu tư tài chính (Investments)',
        'L24 Taxes': 'Thuế & Ngân sách (Taxes)',
        'L25 Financial Statements': 'Báo cáo tài chính (Financial Statements)',
    }

    current_topic = 'Cơ bản & Công sở (Foundation)'
    records = []
    prev_entry = None

    for r in range(1, sheet.max_row + 1):
        c1 = clean_text(sheet.cell(r, 1).value)
        c2 = clean_text(sheet.cell(r, 2).value)
        c3 = clean_text(sheet.cell(r, 3).value)
        c4 = clean_text(sheet.cell(r, 4).value)

        # Skip table header
        if c1.lower() in ['word', 'từ vựng'] and c2.lower() in ['phonetics', 'phiên âm']:
            continue
        if c1 == 'PRE' and not c2 and not c3:
            current_topic = TOPIC_MAP['PRE']
            continue

        # Topic header in col 1
        if c1 in TOPIC_MAP and not c2 and not c3:
            current_topic = TOPIC_MAP[c1]
            continue

        # Category in col 1, word in col 2, meaning in col 3
        if c1 in TOPIC_MAP and c2 and c3:
            current_topic = TOPIC_MAP[c1]
            word, pos = extract_pos(c2)
            entry = {
                "id": f"toeic_{len(records) + 1}",
                "stt": len(records) + 1,
                "word": word,
                "phonetic": "",
                "partOfSpeech": pos,
                "meaning": c3,
                "example": c4,
                "topic": current_topic,
                "language": "en"
            }
            records.append(entry)
            prev_entry = entry
            continue

        # Missing c1
        if not c1:
            if c2.startswith('/') and not c3:
                # Extra phonetic for previous entry
                if prev_entry:
                    prev_entry['phonetic'] = (prev_entry['phonetic'] + ' ' + c2).strip()
                continue
            elif c2 and c3:
                word, pos = extract_pos(c2)
                entry = {
                    "id": f"toeic_{len(records) + 1}",
                    "stt": len(records) + 1,
                    "word": word,
                    "phonetic": "",
                    "partOfSpeech": pos,
                    "meaning": c3,
                    "example": c4,
                    "topic": current_topic,
                    "language": "en"
                }
                records.append(entry)
                prev_entry = entry
                continue
            elif c2.startswith('/') and c3:
                # Phonetic in c2, meaning in c3
                word = prev_entry['word'] if prev_entry else ''
                word, pos = extract_pos(word)
                entry = {
                    "id": f"toeic_{len(records) + 1}",
                    "stt": len(records) + 1,
                    "word": word,
                    "phonetic": c2,
                    "partOfSpeech": pos,
                    "meaning": c3,
                    "example": c4,
                    "topic": current_topic,
                    "language": "en"
                }
                records.append(entry)
                prev_entry = entry
                continue
            elif not c2 and c3 and prev_entry:
                prev_entry['meaning'] += '; ' + c3
                if c4:
                    prev_entry['example'] = ((prev_entry.get('example') or '') + ' ' + c4).strip()
                continue
            else:
                continue

        # Synonym or bullet in col 1 without phonetic and meaning
        if c1 and not c2 and not c3:
            if c1.startswith('=') or c1 in ['book', 'hand out (v)', 'traffic jam', 'be able to']:
                if prev_entry:
                    syn = c1.replace('=', '').strip()
                    prev_entry['synonyms'] = prev_entry.get('synonyms', []) + [syn]
                continue
            elif len(c1) > 60:
                continue
            else:
                word, pos = extract_pos(c1)
                entry = {
                    "id": f"toeic_{len(records) + 1}",
                    "stt": len(records) + 1,
                    "word": word,
                    "phonetic": "",
                    "partOfSpeech": pos,
                    "meaning": c4 if c4 and not c4.isdigit() else "",
                    "example": "",
                    "topic": current_topic,
                    "language": "en"
                }
                records.append(entry)
                prev_entry = entry
                continue

        # Normal row with c1
        if c2.startswith('/'):
            phonetic = c2
            meaning = c3
            example = c4
        elif c2 and not c2.startswith('/'):
            if not c3:
                phonetic = ""
                meaning = c2
                example = c4
            else:
                phonetic = "" if c2 in ['、', '-'] else c2
                meaning = c3
                example = c4
        else:
            phonetic = ""
            meaning = c3
            example = c4

        word, pos = extract_pos(c1)
        entry = {
            "id": f"toeic_{len(records) + 1}",
            "stt": len(records) + 1,
            "word": word,
            "phonetic": phonetic,
            "partOfSpeech": pos,
            "meaning": meaning,
            "example": example,
            "topic": current_topic,
            "language": "en"
        }
        records.append(entry)
        prev_entry = entry

    print(f"Successfully processed {len(records)} TOEIC records.")
    return records


def extract_pos(text):
    text = clean_text(text)
    pos_list = []
    # Match patterns like (n), (v), (adj), (adv), (prep), (v.phr), (n.phr), (conj)
    patterns = [r"\(n\)", r"\(v\)", r"\(adj\)", r"\(adv\)", r"\(prep\)", r"\(v\.phr\)", r"\(n\.phr\)", r"\(conj\)", r"\(phr\)"]
    for pat in patterns:
        if re.search(pat, text, re.IGNORECASE):
            clean_tag = pat.replace("\\", "").replace("(", "").replace(")", "").upper()
            pos_list.append(clean_tag)
    
    clean_word = text
    for pat in patterns:
        clean_word = re.sub(pat, "", clean_word, flags=re.IGNORECASE)
    clean_word = re.sub(r"\s+", " ", clean_word).strip()
    clean_word = clean_word.rstrip("-").strip()

    pos_str = " / ".join(pos_list) if pos_list else ""
    return clean_word or text, pos_str


def main():
    hsk5_data = process_hsk5()
    toeic_data = process_toeic()

    # Save outputs
    outputs = [
        (os.path.join(SRC_DATA_DIR, "hsk5_v3.json"), hsk5_data),
        (os.path.join(PUBLIC_DATA_DIR, "hsk5_v3.json"), hsk5_data),
        (os.path.join(PROCESSED_DATA_DIR, "hsk5_v3.json"), hsk5_data),
        (os.path.join(SRC_DATA_DIR, "toeic_vocab.json"), toeic_data),
        (os.path.join(PUBLIC_DATA_DIR, "toeic_vocab.json"), toeic_data),
        (os.path.join(PROCESSED_DATA_DIR, "toeic_vocab.json"), toeic_data),
    ]

    for path, data in outputs:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved: {path} ({len(data)} items)")

    # Manifest / Collection metadata for the gallery
    bonus_manifest = [
        {
            "id": "hsk5",
            "slug": "hsk5",
            "title": "Tổng Hợp Từ Vựng HSK 5",
            "subtitle": "Phiên bản 3.0 Chuẩn Mới",
            "language": "zh",
            "itemCount": len(hsk5_data),
            "coverColor": "from-amber-600 to-red-700",
            "accentColor": "text-china-red",
            "badge": "HSK 3.0 Cao cấp",
            "level": "HSK 5",
            "description": "Toàn bộ 1,070 từ vựng HSK 5 chuẩn phiên bản 3.0 mới nhất với phiên âm Pinyin, âm Hán-Việt, loại từ, nghĩa tiếng Việt chuẩn xác và 100% câu ví dụ thực tế kèm phiên âm.",
            "features": [
                "1,070 từ vựng cao cấp",
                "Kèm âm Hán-Việt & Pinyin",
                "100% câu ví dụ thực tế",
                "Phát âm giọng đọc AI chuẩn",
                "Học thẻ Flashcard 3D"
            ],
            "dataFile": "/content/bonus/hsk5_v3.json"
        },
        {
            "id": "toeic",
            "slug": "toeic",
            "title": "Bộ Từ Vựng TOEIC Chuyên Sâu",
            "subtitle": "Công sở, Thương mại & Đàm phán",
            "language": "en",
            "itemCount": len(toeic_data),
            "coverColor": "from-blue-600 to-indigo-800",
            "accentColor": "text-blue-600",
            "badge": "Tiếng Anh TOEIC",
            "level": "TOEIC 550 - 900+",
            "description": "Kho gần 1,000 từ vựng và cụm từ TOEIC thông dụng nhất chia theo các chủ đề: Hợp đồng, Đầu tư, Thuế, Báo cáo tài chính, Nhân sự, Giao tiếp công sở với phiên âm IPA quốc tế.",
            "features": [
                "986 từ & cụm từ tuyển chọn",
                "Phiên âm IPA chuẩn quốc tế",
                "12+ chủ đề thiết yếu",
                "Từ đồng nghĩa & cụm động từ",
                "Phát âm tiếng Anh chuẩn"
            ],
            "dataFile": "/content/bonus/toeic_vocab.json"
        }
    ]

    manifest_paths = [
        os.path.join(SRC_DATA_DIR, "manifest.json"),
        os.path.join(PUBLIC_DATA_DIR, "manifest.json"),
        os.path.join(PROCESSED_DATA_DIR, "manifest.json"),
    ]
    for mp in manifest_paths:
        with open(mp, "w", encoding="utf-8") as f:
            json.dump(bonus_manifest, f, ensure_ascii=False, indent=2)
        print(f"Saved manifest: {mp}")

if __name__ == "__main__":
    main()
