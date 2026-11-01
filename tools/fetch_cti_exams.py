"""
Tool tải đề thi mẫu chuẩn CTI (Hanban) cho HSK 1 và HSK 2:
- Tải file PDF đề thi + đáp án
- Tải file Audio MP3 nghe chuẩn
Lưu vào data/raw_exams/
"""

import os
import urllib.request

BASE_URL = "https://raw.githubusercontent.com/sowbug/hsk-mock-exams-pinyin/master/originals"

EXAMS = {
    "hsk1": ["H10901", "H10902", "H11003", "H11004", "H11005"],
    "hsk2": ["H20901", "H20902", "H21003", "H21004", "H21005"]
}

def download_file(url, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        print(f"[SKIP] Đã có: {out_path}")
        return True
    try:
        print(f"[DOWNLOADING] {url} -> {out_path}...")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(out_path, 'wb') as out_f:
            out_f.write(resp.read())
        print(f"[OK] {out_path} ({os.path.getsize(out_path)} bytes)")
        return True
    except Exception as e:
        print(f"[ERROR] Không tải được {url}: {e}")
        return False

def main():
    root_dir = os.path.join(os.path.dirname(__file__), "..", "data", "raw_exams")
    os.makedirs(root_dir, exist_ok=True)

    for level, codes in EXAMS.items():
        lvl_dir = os.path.join(root_dir, level)
        os.makedirs(lvl_dir, exist_ok=True)
        for code in codes:
            pdf_url = f"{BASE_URL}/{code}.pdf"
            mp3_url = f"{BASE_URL}/{code}.mp3"
            
            pdf_path = os.path.join(lvl_dir, f"{code}.pdf")
            mp3_path = os.path.join(lvl_dir, f"{code}.mp3")
            
            download_file(pdf_url, pdf_path)
            download_file(mp3_url, mp3_path)

if __name__ == "__main__":
    main()
