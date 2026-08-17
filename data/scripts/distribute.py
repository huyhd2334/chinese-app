from collections import Counter
import json

inputpath = r"D:\AI_road\Project\full_stack_projects\chinese-app\data\processed\words.json"

with open(inputpath, "r", encoding="utf-8") as f:
    words = json.load(f)

levels = Counter()

for word in words:
    for level in word["sourceLevels"]:
        levels[level] += 1

print("\n=== LEVEL DISTRIBUTION ===")

for level in sorted(levels):
    print(f"{level:15} {levels[level]:5}")