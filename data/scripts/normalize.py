import json
import hashlib
from pathlib import Path


RAW_FILE = Path(r"D:\AI_road\Project\full_stack_projects\chinese-app\data\raw\complete.json")
OUTPUT_FILE = Path(r"D:\AI_road\Project\full_stack_projects\chinese-app\data\processed\words.json")


def generate_id(hanzi: str) -> str:

    hash_value = hashlib.sha1(hanzi.encode("utf-8")).hexdigest()[:12]

    return f"word_{hash_value}"


def parse_hsk_levels(levels):
    result = []
    for level in levels:
        try:
            number = int(level.split("-")[-1])
            result.append(number)
        except (ValueError, AttributeError):
            continue

    return result


def normalize_word(item):
    simplified = item["simplified"]

    form = item["forms"][0]

    transcription = form["transcriptions"]

    return {
        "id": generate_id(simplified),

        "hanzi": simplified,

        "traditional": form.get("traditional"),

        "pinyin": transcription.get("pinyin"),

        "pinyinNumeric": transcription.get("numeric"),

        "meanings": form.get("meanings", []),

        "hskLevels": parse_hsk_levels(
            item.get("level", [])
        ),

        "hskLevel": parse_hsk_levels(
            item.get("level", [])[0]
        ),

        "sourceLevels": item.get("level", []),

        "partOfSpeech": item.get("pos", []),

        "radical": item.get("radical"),

        "frequency": item.get("frequency"),

        "classifiers": form.get("classifiers", [])
    }


def main():
    with open(RAW_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    words = []
    for item in data:
        try:
            word = normalize_word(item)
            words.append(word)
        except Exception as e:
            print("ERROR:", e)
            print(item)

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(OUTPUT_FILE,"w",encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"Exported {len(words)} words")


if __name__ == "__main__":
    main()