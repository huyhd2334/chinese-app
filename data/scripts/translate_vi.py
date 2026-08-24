import json
import time
from deep_translator import GoogleTranslator

FILE_PATH = "../../frontend/public/content/words.json"

def main():
    print("Loading data...")
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        words = json.load(f)
    
    print(f"Total words: {len(words)}")
    translator = GoogleTranslator(source='en', target='vi')
    
    batch_size = 20
    updated_count = 0

    for i in range(0, len(words), batch_size):
        batch = words[i:i+batch_size]
        
        # Skip if already translated
        needs_translation = [w for w in batch if "meanings_vi" not in w and w.get("meanings")]
        if not needs_translation:
            continue
            
        texts = [" | ".join(w.get("meanings", [])) for w in needs_translation]
        
        try:
            # Join texts with a clear separator
            combined = " \n---\n ".join(texts)
            translated_combined = translator.translate(combined)
            translated_texts = [x.strip() for x in translated_combined.split("\n---\n")]
            
            if len(translated_texts) == len(needs_translation):
                for j, w in enumerate(needs_translation):
                    w["meanings_vi"] = [x.strip() for x in translated_texts[j].split("|")]
                updated_count += len(needs_translation)
            else:
                print(f"Length mismatch at index {i}")
                
        except Exception as e:
            print(f"Error at index {i}: {str(e).encode('ascii', 'ignore').decode()}")
            time.sleep(2)
            
        if updated_count > 0 and updated_count % 500 == 0:
            print(f"Translated {updated_count} words... saving intermediate.")
            with open(FILE_PATH, 'w', encoding='utf-8') as f:
                json.dump(words, f, ensure_ascii=False, indent=2)
                
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    print("Translation complete!")

if __name__ == "__main__":
    import sys
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    main()