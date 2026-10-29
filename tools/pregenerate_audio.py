"""
Pre-generate audio HSK -> file mp3 tĩnh, đặt tên theo sha1("{lang}:{text}") (đúng công thức /api/tts).

Chạy 1 lần (có thể chạy lại, sẽ bỏ qua file đã có):
    python tools/pregenerate_audio.py                  # tải về thư mục audio_out/
    python tools/pregenerate_audio.py --upload         # tải + upload lên Cloudflare R2 (cần boto3 + biến môi trường)
    python tools/pregenerate_audio.py --limit 200      # chạy thử 200 từ

Biến môi trường khi --upload (Cloudflare R2, S3-compatible):
    R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET

Sau khi upload, bật public/custom domain cho bucket và đặt trong frontend/.env.local:
    AUDIO_CDN_BASE=https://audio.ten-mien-cua-ban.com
-> /api/tts sẽ tự 302 redirect sang CDN, server không còn tốn băng thông / không bị upstream chặn IP.
"""
import argparse
import hashlib
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORDS_JSON = ROOT / "data" / "processed" / "words.json"
OUT_DIR = ROOT / "audio_out"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def audio_key(lang: str, text: str) -> str:
    return hashlib.sha1(f"{lang}:{text}".encode("utf-8")).hexdigest()


def fetch(url: str, timeout: int = 10) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            data = res.read()
            return data if len(data) > 200 else None
    except Exception:
        return None


def synthesize(text: str) -> bytes | None:
    q = urllib.parse.quote(text)
    data = fetch(f"https://dict.youdao.com/dictvoice?audio={q}&le=zh")
    if data:
        return data
    return fetch(f"https://translate.google.com/translate_tts?ie=UTF-8&q={q}&tl=zh-CN&client=tw-ob")


def download_one(text: str) -> tuple[str, bool, bool]:
    key = audio_key("zh", text)
    path = OUT_DIR / f"{key}.mp3"
    if path.exists() and path.stat().st_size > 200:
        return text, True, True
    for attempt in range(3):
        data = synthesize(text)
        if data:
            path.write_bytes(data)
            return text, True, False
        time.sleep(1.5 * (attempt + 1))
    return text, False, False


def make_r2_client():
    import boto3  # pip install boto3

    account = os.environ["R2_ACCOUNT_ID"]
    return boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="Chỉ xử lý N từ đầu (0 = tất cả)")
    parser.add_argument("--workers", type=int, default=4, help="Số luồng tải song song (giữ thấp để không bị chặn)")
    parser.add_argument("--upload", action="store_true", help="Upload các file lên Cloudflare R2")
    args = parser.parse_args()

    words = json.loads(WORDS_JSON.read_text(encoding="utf-8"))
    texts = sorted({w["hanzi"].strip() for w in words if w.get("hanzi")})
    if args.limit:
        texts = texts[: args.limit]

    OUT_DIR.mkdir(exist_ok=True)
    print(f"Tổng {len(texts)} từ -> {OUT_DIR}")

    ok = skipped = failed = 0
    failures: list[str] = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(download_one, t) for t in texts]
        for i, fut in enumerate(as_completed(futures), 1):
            text, success, existed = fut.result()
            if success and existed:
                skipped += 1
            elif success:
                ok += 1
                time.sleep(0.05)  # giãn nhẹ để lịch sự với upstream
            else:
                failed += 1
                failures.append(text)
            if i % 100 == 0 or i == len(texts):
                print(f"  {i}/{len(texts)}  mới={ok}  đã có={skipped}  lỗi={failed}")

    if failures:
        (OUT_DIR / "failed.txt").write_text("\n".join(failures), encoding="utf-8")
        print(f"Có {failed} từ lỗi, danh sách ở audio_out/failed.txt (chạy lại script để thử lại)")

    if args.upload:
        client = make_r2_client()
        bucket = os.environ["R2_BUCKET"]
        files = sorted(OUT_DIR.glob("*.mp3"))
        print(f"Upload {len(files)} file lên R2 bucket '{bucket}'...")
        for i, f in enumerate(files, 1):
            client.upload_file(
                str(f),
                bucket,
                f.name,
                ExtraArgs={"ContentType": "audio/mpeg", "CacheControl": "public, max-age=31536000, immutable"},
            )
            if i % 200 == 0 or i == len(files):
                print(f"  uploaded {i}/{len(files)}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
