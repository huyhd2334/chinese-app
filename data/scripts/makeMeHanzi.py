import json
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

WORDS_FILE = BASE_DIR / "data" / "processed" / "words.json"

# Clone Make Me a Hanzi vào ngoài project hoặc sửa path này

GRAPHICS_FILE = Path(
    r"D:\AI_road\Project\full_stack_projects\chinese-app\data\writing\graphics.txt"
)

OUTPUT_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "writing.json"
)


# ============================================================
# EXTRACT UNIQUE HANZI
# ============================================================

def extract_characters(words):
    characters = set()

    for word in words:
        hanzi = word.get("hanzi", "")

        if not hanzi:
            continue

        for char in hanzi:
            characters.add(char)

    return characters


# ============================================================
# LOAD GRAPHICS DATA
# ============================================================

def load_graphics(graphics_file, needed_chars):

    writing_data = {}

    with open(
        graphics_file,
        "r",
        encoding="utf-8"
    ) as f:

        for line_number, line in enumerate(f, start=1):

            line = line.strip()

            if not line:
                continue

            try:
                data = json.loads(line)
            except json.JSONDecodeError:
                print(
                    f"Warning: invalid JSON at line {line_number}"
                )
                continue

            character = data.get("character")

            if character not in needed_chars:
                continue

            writing_data[character] = {
                "character": character,
                "strokes": data.get("strokes", []),
                "medians": data.get("medians", [])
            }

    return writing_data


# ============================================================
# MAIN
# ============================================================

def main():

    print("================================")
    print("Extract Writing Data")
    print("================================")

    # --------------------------------------------------------
    # Check files
    # --------------------------------------------------------

    if not WORDS_FILE.exists():
        raise FileNotFoundError(
            f"words.json not found:\n{WORDS_FILE}"
        )

    if not GRAPHICS_FILE.exists():
        raise FileNotFoundError(
            f"graphics.txt not found:\n{GRAPHICS_FILE}"
        )

    # --------------------------------------------------------
    # Load words
    # --------------------------------------------------------

    print("\nLoading words...")

    with open(
        WORDS_FILE,
        "r",
        encoding="utf-8"
    ) as f:
        words = json.load(f)

    print(f"Words: {len(words)}")

    # --------------------------------------------------------
    # Extract characters
    # --------------------------------------------------------

    characters = extract_characters(words)

    print(f"Unique characters: {len(characters)}")

    # --------------------------------------------------------
    # Load stroke data
    # --------------------------------------------------------

    print("\nLoading graphics.txt...")

    writing_data = load_graphics(
        GRAPHICS_FILE,
        characters
    )

    # --------------------------------------------------------
    # Statistics
    # --------------------------------------------------------

    found = len(writing_data)
    missing = characters - writing_data.keys()

    print("\n================================")
    print("RESULT")
    print("================================")

    print(f"Unique characters needed: {len(characters)}")
    print(f"Characters found:         {found}")
    print(f"Characters missing:       {len(missing)}")

    if missing:
        print("\nMissing characters:")

        for char in sorted(missing):
            print(char, end=" ")

        print()

    # --------------------------------------------------------
    # Create output directory
    # --------------------------------------------------------

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            writing_data,
            f,
            ensure_ascii=False,
            indent=2
        )

    print("\nSaved:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()