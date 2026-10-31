import json
import re
import os
import sys

# Priority overrides for common HSK words where CEDICT had surname/archaic/polyphone collisions
PRIORITY_OVERRIDES = {
    "看": ["xem", "nhìn", "coi"],
    "听": ["nghe", "nghe theo"],
    "说": ["nói", "bàn luận"],
    "都": ["đều", "tất cả"],
    "东西": ["đồ vật", "thứ"],
    "钱": ["tiền", "tiền bạc"],
    "水": ["nước", "chất lỏng"],
    "书": ["sách"],
    "白": ["trắng", "màu trắng"],
    "百": ["trăm", "một trăm"],
    "车": ["xe", "phương tiện"],
    "错": ["sai", "lỗi"],
    "冷": ["lạnh"],
    "米饭": ["cơm"],
    "大": ["to", "lớn"],
    "小": ["nhỏ", "bé"],
    "多": ["nhiều"],
    "少": ["ít", "thiếu"],
    "好": ["tốt", "hay", "được"],
    "给": ["cho", "đưa cho"],
    "还": ["vẫn", "còn"],
    "会": ["biết", "sẽ", "hội họp"],
    "能": ["có thể"],
    "想": ["nghĩ", "muốn", "nhớ"],
    "要": ["muốn", "cần", "phải"],
    "去": ["đi", "đến"],
    "来": ["đến", "tới"],
    "买": ["mua"],
    "卖": ["bán"],
    "在": ["ở", "đang"],
    "着": ["đang", "tiếp diễn"],
    "了": ["rồi", "đã"],
    "的": ["của", "mà"],
    "地": ["một cách", "đất đai"],
    "得": ["được", "phải"],
    "包": ["bao", "túi", "gói"],
    "薄": ["mỏng"],
    "成": ["thành", "trở thành"],
    "常": ["thường", "thường xuyên"],
    "长": ["dài", "lớn lên"],
    "重": ["nặng", "quan trọng", "lại"],
    "行": ["được", "hàng", "ngành nghề"],
    "便": ["tiện", "thuận tiện", "rẻ"],
    "干": ["làm", "khô"],
    "教": ["dạy", "dạy học"],
    "安": ["yên", "an toàn", "lắp đặt"],
    "别": ["đừng", "khác", "chia ly"],
    "步": ["bước", "bước chân"],
    "带": ["mang", "đem"],
    "戴": ["đeo", "đội"],
    "万": ["vạn", "mười nghìn"],
    "红": ["đỏ", "màu đỏ"],
    "黄": ["vàng", "màu vàng"],
    "黑": ["đen", "màu đen"],
    "绿": ["xanh lục", "xanh lá"],
    "蓝": ["xanh lam", "xanh dương"],
    "同": ["cùng", "giống nhau"],
    "叫": ["kêu", "gọi", "tên là"],
    "问": ["hỏi"],
    "答": ["trả lời", "đáp"],
    "对": ["đúng", "đối với"],
    "错": ["sai", "nhầm"],
    "走": ["đi", "rời đi"],
    "跑": ["chạy"],
    "坐": ["ngồi", "đi xe"],
    "站": ["đứng", "nhà ga"],
    "开": ["mở", "bắt đầu", "lái xe"],
    "关": ["đóng", "tắt", "quan hệ"],
    "吃": ["ăn"],
    "喝": ["uống"],
    "睡": ["ngủ"],
    "起": ["dậy", "bắt đầu"],
    "进": ["vào", "tiến"],
    "出": ["ra", "xuất hiện"],
    "回": ["về", "lần"],
    "过": ["qua", "từng"],
    "道": ["đường", "đạo", "nói"],
    "话": ["lời nói", "tiếng"],
    "字": ["chữ"],
    "课": ["bài học", "tiết học"],
    "点": ["giờ", "điểm", "chút ít"],
    "分": ["phút", "điểm", "chia"],
    "天": ["ngày", "trời"],
    "年": ["năm"],
    "月": ["tháng", "mặt trăng"],
    "日": ["ngày", "mặt trời"],
    "时": ["thời gian", "khi", "lúc"],
    "做": ["làm", "chế tạo"],
    "作": ["làm", "sáng tác"],
    "办": ["làm", "giải quyết"],
    "见": ["gặp", "thấy"],
    "丁": ["người", "thứ tư (Thiên can)", "thái hạt lựu"],
    "金子": ["vàng", "tiền vàng"],
    "金": ["vàng", "kim loại"],
    "此致": ["kính thư", "trân trọng kính chào"],
    "底": ["đáy", "nền", "cuối"],
    "分之": ["phần (phân số)"],
    "将军": ["tướng quân", "chiếu tướng"],
    "嗯": ["ừ", "vâng", "dạ"],
    "呀": ["a", "nha", "nhé"],
    "涌": ["phun trào", "dâng trào", "tuôn ra"],
    "爱不释手": ["thích không rời tay", "mê mẩn"],
    "拔苗助长": ["dục tốc bất đạt", "hỏng việc vì nôn nóng"],
    "画龙点睛": ["vẽ rồng điểm mắt", "nét chấm phá cốt lõi"],
    "爱面子": ["sĩ diện", "giữ thể diện"],
    "安定": ["ổn định", "yên định"],
    "把柄": ["cán cân làm tin", "điểm yếu", "thóp"],
    "不肯": ["không chịu", "từ chối"],
    "不利于": ["bất lợi cho", "không có lợi cho"],
    "不难": ["không khó", "dễ dàng"],
    "不如说": ["nói đúng hơn là"],
    "不太": ["không lắm", "không quá"],
    "不一会儿": ["chẳng bao lâu", "chốc lát", "một lát sau"],
    "不予": ["không chấp thuận", "từ chối"],
    "车上": ["trên xe"],
    "趁着": ["nhân lúc", "tranh thủ lúc"],
    "城里": ["trong thành phố", "nội thành"],
    "打篮球": ["chơi bóng rổ"],
    "定为": ["quy định là", "xác định là"],
    "放到": ["đặt vào", "bỏ vào"],
    "飞往": ["bay đến", "bay tới"],
    "公益性": ["tính công ích", "vì cộng đồng"],
    "很难说": ["khó nói", "khó mà nói được"],
    "怀着": ["mang trong lòng", "ấp ủ"],
    "见过": ["từng gặp", "từng thấy"],
    "难以想象": ["khó tưởng tượng nổi", "không thể ngờ"],
    "能不能": ["có thể... không", "được hay không"],
    "纽扣儿": ["khuy áo", "cúc áo"],
    "说起来": ["nhắc tới", "nói đến"],
    "送到": ["gửi đến", "giao tới"],
    "系领带": ["thắt cà vạt"],
    "眼里": ["trong mắt"],
    "一番": ["một phen", "một hồi"],
    "有劲儿": ["có sức", "hăng hái"],
    "这时候": ["lúc này", "vào lúc này"],
    "着眼于": ["chú trọng vào", "nhắm vào"],
    "指着": ["chỉ vào", "nhắm vào"],
    "致力于": ["dốc sức vào", "cống hiến cho"]
}

def clean_definition(text):
    if not text:
        return None
    # Remove bracketed pinyin references like [che4 zou3], [ge4]
    text = re.sub(r'\[[a-zA-Z0-9\s:,\.\-]+\]', '', text)
    # Remove classifier lines
    if re.search(r'^(LT|CL|Lượng từ):', text, re.I):
        return None
    # Remove cross-references
    if re.search(r'^(xem|xem thêm|abbr\.|viết tắt)\b', text, re.I):
        return None
    # Remove idiom/style tags
    text = re.sub(r'\((thành ngữ|nói giảm|thông tục|nghĩa bóng|hình|thuật ngữ|từ mượn|tiếng lóng)\)', '', text, flags=re.I)
    # Remove verbose parentheticals unless the entire definition is inside parens
    without_parens = re.sub(r'\(.*?\)', '', text).strip(' ;,./-~')
    if without_parens:
        text = without_parens
    else:
        # If removing parens left nothing, extract whatever was inside parens
        text = re.sub(r'[\(\)]', '', text)
    # Remove open/unbalanced parens
    text = re.sub(r'[\(\)]', '', text)
    text = re.sub(r'\s+', ' ', text).strip(' ;,./-~')
    return text if len(text) > 0 else None

def simplify_meanings(meanings_list):
    result = []
    seen = set()
    for item in meanings_list:
        # Split on semicolon
        parts = [p.strip() for p in re.split(r'[;]', item) if p.strip()]
        for p in parts:
            c = clean_definition(p)
            if not c:
                continue
            # If overly long with comma, take the first crisp segment
            if len(c) > 28 and ',' in c:
                first_seg = c.split(',')[0].strip()
                if len(first_seg) >= 2:
                    c = first_seg
            c_lower = c.lower()
            if c_lower not in seen and len(c) > 0:
                seen.add(c_lower)
                result.append(c)
            if len(result) >= 3:
                break
        if len(result) >= 3:
            break
    return result[:3]

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cvdict_path = os.path.join(base_dir, "raw", "CVDICT.u8")
    words_json_path = os.path.join(base_dir, "processed", "words.json")
    public_words_json_path = os.path.join(base_dir, "..", "frontend", "public", "content", "words.json")
    
    print(f"Loading CVDICT from {cvdict_path}...")
    entries_by_simp = {}
    with open(cvdict_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            m = re.match(r'^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.+)/$', line)
            if m:
                trad, simp, py, defs = m.groups()
                defs_list = [d.strip() for d in defs.split('/') if d.strip()]
                if simp not in entries_by_simp:
                    entries_by_simp[simp] = []
                entries_by_simp[simp].append({'trad': trad, 'py': py, 'defs': defs_list})
    print(f"Indexed {len(entries_by_simp)} unique simplified words from CVDICT.")

    # Load curriculum / hsk5_v3 verified translations
    curriculum_meanings = {}
    hsk5_v3_path = os.path.join(base_dir, "processed", "bonus", "hsk5_v3.json")
    if os.path.exists(hsk5_v3_path):
        try:
            with open(hsk5_v3_path, 'r', encoding='utf-8') as f:
                hsk5 = json.load(f)
                for item in hsk5:
                    hz = item.get('hanzi') or item.get('word')
                    mn = item.get('meaning')
                    if hz and mn:
                        # Split by comma or semicolon into concise items
                        parts = [p.strip().lower() for p in re.split(r'[,;]', mn) if p.strip()]
                        curriculum_meanings[hz] = parts[:3]
            print(f"Loaded {len(curriculum_meanings)} verified words from hsk5_v3.json")
        except Exception as e:
            print("Error loading hsk5_v3.json:", e)

    # Load words.json
    print(f"Loading words from {words_json_path}...")
    with open(words_json_path, 'r', encoding='utf-8') as f:
        words = json.load(f)
    print(f"Total words to translate: {len(words)}")

    updated_count = 0
    override_count = 0
    curriculum_count = 0
    cvdict_count = 0
    fallback_count = 0

    for w in words:
        hz = w.get('hanzi', '')
        pyn = w.get('pinyinNumeric', '').lower()

        # 1. PRIORITY OVERRIDES
        if hz in PRIORITY_OVERRIDES:
            w['meanings_vi'] = PRIORITY_OVERRIDES[hz]
            override_count += 1
            updated_count += 1
            continue

        # 2. CURRICULUM VERIFIED
        if hz in curriculum_meanings and len(curriculum_meanings[hz]) > 0:
            w['meanings_vi'] = curriculum_meanings[hz]
            curriculum_count += 1
            updated_count += 1
            continue

        # 3. CVDICT LOOKUP
        entries = entries_by_simp.get(hz, [])
        if entries:
            # Filter entries: avoid surnames, archaisms, variants, abbreviations, Japanese names
            valid_entries = []
            for e in entries:
                first_def = e['defs'][0].lower() if e['defs'] else ''
                all_defs = ' '.join(e['defs']).lower()
                is_surname = first_def.startswith('họ ') or first_def.startswith('họ [') or first_def == 'họ'
                is_archaic = first_def.startswith('cổ đại') or 'archaic' in first_def
                is_abbr = first_def.startswith('viết tắt của')
                is_variant = any('biến thể của' in d.lower() or 'variant of' in d.lower() for d in e['defs'])
                is_japanese = any('nhật bản' in d.lower() or 'japanese' in d.lower() or 'kaneko' in d.lower() for d in e['defs'])
                if not (is_surname or is_archaic or is_abbr or is_variant or is_japanese):
                    valid_entries.append(e)

            # If all entries were variants, resolve target of variant
            if not valid_entries:
                for e in entries:
                    for d in e['defs']:
                        vm = re.search(r'biến thể của\s+([^\[\]\s/]+)', d, re.I)
                        if vm:
                            target_hz = vm.group(1).split('|')[-1].strip()
                            if target_hz in entries_by_simp:
                                for te in entries_by_simp[target_hz]:
                                    t_all = ' '.join(te['defs']).lower()
                                    if not ('biến thể của' in t_all or 'họ [' in t_all):
                                        valid_entries.append(te)
                                        break
                        if valid_entries:
                            break
                    if valid_entries:
                        break

            pool = valid_entries if valid_entries else entries

            # Match exact pinyin if possible
            matched_entry = None
            for e in pool:
                if e['py'].lower() == pyn:
                    matched_entry = e
                    break
            # Prefer trad == simp
            if not matched_entry:
                for e in pool:
                    if e.get('trad') == hz:
                        matched_entry = e
                        break
            if not matched_entry:
                matched_entry = pool[0]

            clean_defs = simplify_meanings(matched_entry['defs'])
            if clean_defs:
                w['meanings_vi'] = clean_defs
                cvdict_count += 1
                updated_count += 1
                continue

        # 4. FALLBACK: If somehow not in CVDICT, keep or simplify existing meanings_vi if present
        if w.get('meanings_vi'):
            w['meanings_vi'] = simplify_meanings(w['meanings_vi'])
            fallback_count += 1
            updated_count += 1
        elif w.get('meanings'):
            # simple fallback
            w['meanings_vi'] = simplify_meanings(w['meanings'])
            fallback_count += 1
            updated_count += 1

    print(f"\nTranslation complete!")
    print(f"Total updated: {updated_count} / {len(words)}")
    print(f"  - Priority overrides: {override_count}")
    print(f"  - Curriculum verified: {curriculum_count}")
    print(f"  - CVDICT entries: {cvdict_count}")
    print(f"  - Fallback: {fallback_count}")

    # Verify no missing meanings_vi
    missing = [w['hanzi'] for w in words if not w.get('meanings_vi')]
    print(f"Missing meanings_vi count: {len(missing)}")
    if missing:
        print("Missing sample:", missing[:10])

    # Save to data/processed/words.json
    print(f"Saving to {words_json_path}...")
    with open(words_json_path, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    # Save to frontend/public/content/words.json
    print(f"Saving to {public_words_json_path}...")
    with open(public_words_json_path, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    # Also update HSK level split files in data/processed/
    print("Updating HSK level files (hsk1.json .. hsk7.json)...")
    for lvl in range(1, 8):
        hsk_newest = f"newest-{lvl}"
        hsk_new = f"new-{lvl}"
        outpath = os.path.join(base_dir, "processed", f"hsk{lvl}.json")
        lvl_words = [w for w in words if hsk_newest in w.get("sourceLevels", []) or hsk_new in w.get("sourceLevels", [])]
        with open(outpath, 'w', encoding='utf-8') as f:
            json.dump(lvl_words, f, ensure_ascii=False, indent=2)
        print(f"  - hsk{lvl}.json: {len(lvl_words)} words")

    print("\nAll files successfully updated!")

if __name__ == "__main__":
    main()
