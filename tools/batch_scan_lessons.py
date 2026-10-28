import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz
import numpy as np
from PIL import Image
import io
import json
from rapidocr_onnxruntime import RapidOCR

engine = RapidOCR()
doc = fitz.open(r"D:\dowload\hsk1 - tiếng việt (3.0).pdf")

# Page map of lessons in PDF (1-based index)
# From TOC:
# Lesson 1: 17-20
# Lesson 2: 21-25
# Lesson 3: 26-33
# Lesson 4: 34-42
# Lesson 5: 43-50
# Lesson 6: 51-60
# Lesson 7: 61-69
# Lesson 8: 70-77
# Lesson 9: 78-85
# Lesson 10: 86-94
# Lesson 11: 95-102
# Lesson 12: 103-111
# Lesson 13: 112-120
# Lesson 14: 121-129
# Lesson 15: 130-137

lessons_range = [
    (3, 26, 30),
    (4, 34, 38),
    (5, 43, 47),
    (6, 51, 55),
    (7, 61, 65),
    (8, 70, 74),
    (9, 78, 82),
    (10, 86, 90),
    (11, 95, 99),
    (12, 103, 107),
    (13, 112, 116),
    (14, 121, 125),
    (15, 130, 134)
]

output_data = {}

for l_num, p_start, p_end in lessons_range:
    print(f"Scanning Lesson {l_num} (Pages {p_start}-{p_end})...")
    lines = []
    for p in range(p_start - 1, min(p_end, len(doc))):
        page = doc[p]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        res, _ = engine(np.array(img))
        if res:
            for item in res:
                lines.append(item[1])
    output_data[l_num] = lines
    print(f"  Lesson {l_num}: Extracted {len(lines)} lines")

with open("data/raw_extracted_lessons.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("Done scanning all lessons!")
