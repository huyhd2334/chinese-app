import json
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "processed"


def load_json(filename):
    path = PROCESSED_DIR / filename
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_words(words, name):
    print(f"\n===== {name} =====")

    print("Total:", len(words))

    ids = [word.get("id") for word in words]
    duplicate_ids = [id_ for id_, count in Counter(ids).items() if count > 1]
    print("Duplicate IDs:", len(duplicate_ids))

    # Hanzi
    missing_hanzi = [word for word in words if not word.get("hanzi")]
    print("Missing hanzi:", len(missing_hanzi))

    # Pinyin
    missing_pinyin = [word for word in words if not word.get("pinyin")]
    print("Missing pinyin:", len(missing_pinyin))

    # Meaning
    missing_meaning = [word for word in words if not word.get("meanings")]
    print("Missing meaning:", len(missing_meaning))

    # POS
    missing_pos = [word for word in words if not word.get("partOfSpeech")]
    print("Missing POS:", len(missing_pos))

    # HSK
    missing_level = [word for word in words if not word.get("sourceLevels")]
    print("Missing HSK level:", len(missing_level))

    return {
        "duplicate_ids": duplicate_ids,
        "missing_hanzi": missing_hanzi,
        "missing_pinyin": missing_pinyin,
        "missing_meaning": missing_meaning,
        "missing_pos": missing_pos,
        "missing_level": missing_level,
    }


def main():

    words = load_json("words.json")
    validate_words(words, "MASTER WORDS")

    for level in range(1, 8):
        filename = f"hsk{level}.json"
        words = load_json(filename)
        validate_words(words, f"HSK {level}")

if __name__ == "__main__":
    main()