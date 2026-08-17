import json

with open(r"D:\AI_road\Project\full_stack_projects\chinese-app\data\raw\complete.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(type(data))

if isinstance(data, list):
    print("Number of items(words): ", len(data))
    print("First word: ", json.dumps(data[0], ensure_ascii=False, indent=2))
else:
    print(data.keys())