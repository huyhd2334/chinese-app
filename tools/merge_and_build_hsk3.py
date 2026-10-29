# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

from hsk3_part1 import lessons_1_to_6
from hsk3_part2 import lessons_7_to_12
from hsk3_part3 import lessons_13_to_18

all_18_lessons = lessons_1_to_6 + lessons_7_to_12 + lessons_13_to_18

curriculum_lessons = []
for l in all_18_lessons:
    curriculum_lessons.append({
        "id": f"new_hsk3_standard_{l['lessonNumber']}",
        "bookId": "new_hsk3_standard",
        "lessonNumber": l["lessonNumber"],
        "title": l["title"],
        "titleVi": l["titleVi"],
        "titlePinyin": l["titlePinyin"],
        "vocabulary": l["vocabulary"],
        "dialogues": l["dialogues"],
        "readingPassage": l.get("readingPassage"),
        "grammarNotes": l.get("grammarNotes", []),
        "listeningExercises": l.get("listeningExercises", [])
    })

ts_content = f"""import {{ CurriculumLesson }} from "@/types/curriculum"

export const NEW_HSK3_ALL_LESSONS: CurriculumLesson[] = {json.dumps(curriculum_lessons, ensure_ascii=False, indent=2)}
"""

with open("frontend/src/data/newHsk3Lessons.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated HSK 3: {len(curriculum_lessons)} lessons into frontend/src/data/newHsk3Lessons.ts!")
