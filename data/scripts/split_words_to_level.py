import json

hsk_newest = 'newest-7'
hsk_new = 'new-7'

outpath = r"D:\AI_road\Project\full_stack_projects\chinese-app\data\processed\hsk7.json"
inputpath = r"D:\AI_road\Project\full_stack_projects\chinese-app\data\processed\words.json"

with open(inputpath, "r", encoding="utf-8") as f:
    words = json.load(f)

print(type(words))

if isinstance(words, list):
    print("Number of items(words): ", len(words))
    print("First word: ", json.dumps(words[0], ensure_ascii=False, indent=2))
else:
    print(words.keys())

wordsOut = []
for w in words:
    if hsk_newest in w["sourceLevels"]:
       wordsOut.append(w)
    elif hsk_new in w["sourceLevels"]:
       wordsOut.append(w)
    else:
        continue

print(f"{hsk_newest}-{len(wordsOut)}")

with open(outpath,"w",encoding="utf-8") as f:
    json.dump(wordsOut, f, ensure_ascii=False, indent=2)
