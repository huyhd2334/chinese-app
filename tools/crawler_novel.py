import requests
import json
import os
import re
import time
from bs4 import BeautifulSoup

def crawl_and_build_nanong(chapter_urls):
    """
    Script mẫu cào và đóng gói truyện Khó Dỗ Dành (难哄) thành file JSON cho ứng dụng.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    chapters = []
    print(f"Bắt đầu xử lý {len(chapter_urls)} chương...")

    for idx, url in enumerate(chapter_urls, 1):
        try:
            print(f"Đang tải chương {idx}: {url}...")
            resp = requests.get(url, headers=headers, timeout=15)
            resp.encoding = resp.apparent_encoding or "utf-8"
            soup = BeautifulSoup(resp.text, "html.parser")

            # Tùy chỉnh selector theo trang nguồn của bạn
            title_el = soup.find(["h1", "h2", ".title"])
            title = title_el.get_text(strip=True) if title_el else f"第 {idx} 章"

            content_el = soup.find(["#content", ".content", "#chaptercontent", ".read-content"])
            if not content_el:
                print(f"Không tìm thấy khối nội dung ở chương {idx}")
                continue

            # Tách các đoạn văn
            paras = []
            for p in content_el.find_all(["p", "div"]):
                t = p.get_text(strip=True)
                if t and len(t) > 1:
                    paras.append(t)

            if not paras:
                raw_text = content_el.get_text("\n", strip=True)
                paras = [p.strip() for p in raw_text.split("\n") if p.strip()]

            char_count = sum(len(p) for p in paras)

            chapters.append({
                "id": idx,
                "chapterNumber": idx,
                "title": title,
                "charCount": char_count,
                "paragraphs": paras,
                "translations": []
            })

            time.sleep(1) # Tránh bị chặn IP
        except Exception as e:
            print(f"Lỗi tải chương {idx}: {e}")

    if not chapters:
        print("Không có chương nào được trích xuất thành công.")
        return

    total_words = sum(c["charCount"] for c in chapters)
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "src", "data", "novels", "nanong.json")

    novel_data = {
        "id": "kho-do-danh",
        "title": "Khó Dỗ Dành",
        "chineseTitle": "难哄",
        "pinyinTitle": "Nán Hǒng",
        "author": "Trúc Dĩ (竹已)",
        "category": "Ngôn tình hiện đại • Đô thị tình duyên • Gặp lại người xưa",
        "tags": ["Trending", "Đô thị", "Gương vỡ lại lành", "Trúc Dĩ", "Trưởng thành", "Ngọt ngào"],
        "level": "HSK 3-5",
        "coverUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm hot cùng hệ liệt với Vụng Trộm Không Thể Giấu. Cuộc hội ngộ định mệnh giữa Tang Diên và Ôn Dĩ Phàm.",
        "totalChapters": len(chapters),
        "totalWords": total_words,
        "chapters": chapters
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(novel_data, f, ensure_ascii=False, indent=2)

    print(f"Đã xuất thành công {len(chapters)} chương vào {output_path}!")

if __name__ == "__main__":
    print("Vui lòng cấu hình danh sách URL trong script trước khi chạy.")
