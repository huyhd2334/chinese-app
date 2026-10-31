import json
import os
import re
import sys

def parse_novel_text(file_path, novel_id="kho-do-danh", title="Khó Dỗ Dành", chinese_title="难哄", pinyin_title="Nán Hǒng", author="Trúc Dĩ (竹已)"):
    """
    Chuyển đổi file văn bản tiểu thuyết tiếng Trung (.txt) sang định dạng JSON của app.
    Tự động nhận diện tiêu đề chương: 第x章, Chương x, Chapter x...
    """
    if not os.path.exists(file_path):
        print(f"Lỗi: Không tìm thấy file {file_path}")
        return

    print(f"Đang đọc file: {file_path}...")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Regex nhận diện chương: 第1章, 第 1 章, 第一章...
    chapter_pattern = re.compile(r'(第\s*[0-9一二三四五六七八九十百千万]+\s*章[^\n\r]*)')
    splits = chapter_pattern.split(content)

    chapters = []
    chapter_num = 1

    # Nếu file bắt đầu bằng lời mở đầu trước chương 1
    if splits and not chapter_pattern.match(splits[0]):
        preamble = splits[0].strip()
        if preamble:
            paras = [p.strip() for p in preamble.split('\n') if p.strip()]
            if paras:
                char_count = sum(len(p) for p in paras)
                chapters.append({
                    "id": chapter_num,
                    "chapterNumber": chapter_num,
                    "title": "楔子 / Lời mở đầu",
                    "charCount": char_count,
                    "paragraphs": paras,
                    "translations": []
                })
                chapter_num += 1
        splits = splits[1:]

    # Duyệt qua các cặp (tiêu đề chương, nội dung)
    for i in range(0, len(splits) - 1, 2):
        ch_title = splits[i].strip()
        ch_body = splits[i+1].strip()

        paras = [p.strip() for p in ch_body.split('\n') if p.strip()]
        if not paras:
            continue

        char_count = sum(len(p) for p in paras)
        chapters.append({
            "id": chapter_num,
            "chapterNumber": chapter_num,
            "title": ch_title,
            "charCount": char_count,
            "paragraphs": paras,
            "translations": []
        })
        chapter_num += 1

    total_words = sum(c["charCount"] for c in chapters)

    novel_data = {
        "id": novel_id,
        "title": title,
        "chineseTitle": chinese_title,
        "pinyinTitle": pinyin_title,
        "author": author,
        "category": "Ngôn tình hiện đại • Đô thị tình duyên • Gặp lại người xưa",
        "tags": ["Trending", "Đô thị", "Gương vỡ lại lành", "Trúc Dĩ", "Trưởng thành", "Ngọt ngào"],
        "level": "HSK 3-5",
        "coverUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm hot cùng hệ liệt với Vụng Trộm Không Thể Giấu. Cuộc hội ngộ định mệnh giữa Tang Diên và Ôn Dĩ Phàm.",
        "totalChapters": len(chapters),
        "totalWords": total_words,
        "chapters": chapters
    }

    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "src", "data", "novels", "nanong.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(novel_data, f, ensure_ascii=False, indent=2)

    print(f"Đã xử lý xong {len(chapters)} chương ({total_words:,} chữ).")
    print(f"Đã xuất ra: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Cách sử dụng:")
        print("  python tools/import_novel_txt.py <duong_dan_file_truyen.txt>")
    else:
        parse_novel_text(sys.argv[1])
