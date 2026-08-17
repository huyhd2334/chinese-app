import json
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from tqdm import tqdm


# =========================
# CONFIG
# =========================

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "Gemma3:4B"

INPUT_FILE = Path(r"D:\c3\data\c3-m-train.json")
OUTPUT_FILE = Path("output/reading_c3.jsonl")

MAX_ITEMS = 3138  # tổng số câu tối đa lấy từ dataset (không đổi giữa các lần chạy)

# Mỗi lần CHẠY script, chỉ xử lý tối đa bấy nhiêu câu MỚI (chưa có trong OUTPUT_FILE).
# Hôm nay chạy 100 -> tắt máy -> mai chạy lại script, nó tự biết đã làm tới đâu
# và làm tiếp 100 câu tiếp theo.
BATCH_SIZE = 100

# Có coi các item bị lỗi ("error" field, hoặc language check fail) là "cần làm lại" không.
RETRY_FAILED_ITEMS = True

REQUIRE_FOUR_OPTIONS = True

MAX_RETRIES = 2
CHINESE_RATIO_THRESHOLD = 0.15

NUM_PREDICT = 350
CONCURRENCY = 4
FLUSH_EVERY = 20


# =========================
# LANGUAGE VALIDATION
# =========================

VN_DIACRITICS = re.compile(
    r"[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡ"
    r"ùúụủũưừứựửữỳýỵỷỹđ]",
    re.IGNORECASE,
)
CHINESE_CHARS = re.compile(r"[\u4e00-\u9fff]")


def chinese_ratio(text: str) -> float:
    if not text:
        return 1.0
    zh = len(CHINESE_CHARS.findall(text))
    return zh / max(len(text), 1)


def explanation_is_valid(text: str) -> bool:
    if not text or not text.strip():
        return False
    if chinese_ratio(text) > CHINESE_RATIO_THRESHOLD:
        return False
    if not VN_DIACRITICS.search(text):
        return False
    return True


# =========================
# PROMPT
# =========================

def build_prompt(passage, question, options, answer):
    return f"""You are a Chinese language teacher creating learning material for Vietnamese learners.

PASSAGE:
{passage}

QUESTION:
{question}

OPTIONS:
A. {options[0]}
B. {options[1]}
C. {options[2]}
D. {options[3]}

CORRECT ANSWER:
{answer}

Return ONLY valid JSON:

{{
  "explanation": "Vietnamese-only paragraph explaining WHY the answer is correct, based on the passage",
  "evidence": "Copy the exact sentence or phrase from the passage that supports the answer (this is the ONLY field that may contain Chinese text)",
  "vocabulary": [
    {{"word": "Chinese word", "pinyin": "pinyin", "meaning": "Vietnamese meaning"}}
  ],
  "grammar": [
    {{"pattern": "Useful Chinese grammar pattern", "explanation": "Explain briefly in Vietnamese with a short example"}}
  ]
}}

CRITICAL LANGUAGE RULES (follow strictly):
1. "explanation" MUST be written 100% in Vietnamese. Do NOT quote or copy any Chinese
   sentence inside "explanation" — paraphrase the meaning in Vietnamese instead.
2. "evidence" is the ONLY field allowed to contain Chinese text.
3. "vocabulary.meaning" must be Vietnamese only.
4. "grammar.explanation" must be Vietnamese only.
5. Never use English anywhere in the output.

OTHER RULES:
6. Do NOT change the passage, question, options, or answer.
7. explanation must be based ONLY on the passage.
8. evidence MUST be copied exactly from the passage.
9. vocabulary: choose 2-5 useful words for a Chinese learner.
10. Avoid extremely basic words such as 我, 你, 是, 能 unless important to the question.
11. Prefer useful words around HSK 3-6.
12. grammar: only include patterns that actually appear in the passage.
13. Do NOT return generic grammar labels such as "主谓宾结构".
14. If there is no useful grammar pattern, return [].
15. Keep everything concise.
"""


# =========================
# OLLAMA CALL
# =========================

_thread_local = threading.local()


def get_session() -> requests.Session:
    if not hasattr(_thread_local, "session"):
        _thread_local.session = requests.Session()
    return _thread_local.session


def call_ollama_once(prompt, temperature):
    session = get_session()
    response = session.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": temperature,
                "num_predict": NUM_PREDICT,
            },
        },
        timeout=300,
    )
    response.raise_for_status()
    data = response.json()
    return json.loads(data["response"])


def ask_ollama(passage, question, options, answer):
    prompt = build_prompt(passage, question, options, answer)

    last_result = None
    last_error = None

    for attempt in range(MAX_RETRIES + 1):
        temperature = 0 if attempt == 0 else 0.4
        try:
            result = call_ollama_once(prompt, temperature)
        except Exception as e:
            last_error = e
            continue

        last_result = result

        if explanation_is_valid(result.get("explanation", "")):
            return result

    if last_result is not None:
        last_result["_language_check_failed"] = True
        return last_result

    raise last_error if last_error else RuntimeError("Unknown ollama failure")


# =========================
# LOAD / EXTRACT
# =========================

def load_c3(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_questions(data):
    results = []

    for document in data:
        passage_data = document[0]
        questions = document[1]
        document_id = document[2]

        passage = "\n".join(passage_data)

        for q_index, q in enumerate(questions):
            options = q["choice"]

            if REQUIRE_FOUR_OPTIONS and len(options) != 4:
                continue

            answer = q["answer"]

            try:
                answer_index = options.index(answer)
            except ValueError:
                print(f"[WARNING] answer not found: {answer}")
                continue

            results.append({
                "id": f"c3_{document_id}_q{q_index}",
                "source": "C3",
                "source_document_id": document_id,
                "passage": passage,
                "question": q["question"],
                "options": options,
                "answer": answer,
                "answerIndex": answer_index,
            })

    return results


# =========================
# CHECKPOINT: đọc các id đã xử lý xong (thành công) trong OUTPUT_FILE
# =========================

def load_done_ids(path: Path):
    """
    Trả về set các id đã xử lý THÀNH CÔNG (không lỗi, đạt kiểm tra ngôn ngữ).
    Các dòng bị lỗi ("error" field) hoặc bị đánh dấu language-check-failed
    sẽ KHÔNG được coi là done nếu RETRY_FAILED_ITEMS=True -> sẽ được làm lại
    ở lần chạy sau (dòng cũ vẫn còn trong file, dòng mới sẽ được append thêm;
    nên nhớ dedupe khi dùng dữ liệu, hoặc bật comment bên dưới để tự lọc).
    """
    done = set()

    if not path.exists():
        return done

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue

            item_id = d.get("id")
            if not item_id:
                continue

            is_error = "error" in d
            is_lang_fail = d.get("_language_check_failed", False)

            if RETRY_FAILED_ITEMS and (is_error or is_lang_fail):
                # coi như CHƯA xong -> sẽ được xử lý lại lần chạy này
                continue

            done.add(item_id)

    return done


# =========================
# PROCESS
# =========================

def process_item(item):
    try:
        ai_data = ask_ollama(
            passage=item["passage"],
            question=item["question"],
            options=item["options"],
            answer=item["answer"],
        )
        lang_failed = ai_data.pop("_language_check_failed", False)
        item.update(ai_data)
        if lang_failed:
            item["_language_check_failed"] = True
        return item, True, lang_failed
    except Exception as e:
        item["error"] = str(e)
        return item, False, False


def main():
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    print("Loading C3...")
    data = load_c3(INPUT_FILE)
    print(f"Documents loaded: {len(data)}")

    all_items = extract_questions(data)
    print(f"Questions with 4 options: {len(all_items)}")

    if MAX_ITEMS:
        all_items = all_items[:MAX_ITEMS]

    done_ids = load_done_ids(OUTPUT_FILE)
    print(f"Already done (in {OUTPUT_FILE}): {len(done_ids)}")

    remaining = [it for it in all_items if it["id"] not in done_ids]
    print(f"Remaining to process: {len(remaining)}")

    batch = remaining[:BATCH_SIZE] if BATCH_SIZE else remaining
    print(f"Processing this run: {len(batch)} (BATCH_SIZE={BATCH_SIZE})")

    if not batch:
        print("Nothing to do. All items already processed.")
        return

    success = 0
    failed = 0
    language_warnings = 0
    buffer = []

    def flush_buffer(f):
        if buffer:
            f.write("".join(buffer))
            f.flush()
            buffer.clear()

    # "a" = append -> KHÔNG xoá dữ liệu cũ đã chạy hôm trước
    with open(OUTPUT_FILE, "a", encoding="utf-8") as out:
        with ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
            futures = {pool.submit(process_item, item): item for item in batch}

            for future in tqdm(as_completed(futures), total=len(batch)):
                result_item, ok, lang_failed = future.result()

                if ok:
                    success += 1
                    if lang_failed:
                        language_warnings += 1
                else:
                    failed += 1
                    print(f"\n[ERROR] {result_item['id']}: {result_item.get('error')}")

                buffer.append(json.dumps(result_item, ensure_ascii=False) + "\n")

                if len(buffer) >= FLUSH_EVERY:
                    flush_buffer(out)

            flush_buffer(out)

    print("\n====================")
    print("DONE (this run)")
    print("====================")
    print("Success:", success)
    print("Failed:", failed)
    print("Language check failed after retries:", language_warnings)
    print("Total done so far:", len(done_ids) + success)
    print("Total remaining after this run:", len(remaining) - len(batch))
    print("Output:", OUTPUT_FILE)


if __name__ == "__main__":
    main()