import json

input_file = "output/reading_c3.jsonl"
output_file = "output/reading.json"

data = []

with open(input_file, "r", encoding="utf-8") as f:
    for line in f:
        if line.strip():
            data.append(json.loads(line))

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Saved {len(data)} items")