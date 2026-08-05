"""
Апскейл 13 видео сайта в 2K через WaveSpeed AI (wavespeed-ai/video-upscaler).
Оригиналы не трогаем: результат сохраняется рядом как <name>-2k.mp4

Режимы:
  python upscale_videos.py submit   — загрузить видео и отправить задачи (быстро)
  python upscale_videos.py poll     — проверить статусы, скачать готовые (можно звать повторно)
  python upscale_videos.py status   — просто показать состояние
"""
import json
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

API_KEY = "wsk_live_F84qf_zck_igWbhxaY8cbNJTmdAr4lOP5QPOWa8HHkc"
BASE = "https://api.wavespeed.ai/api/v3"
MODEL = "wavespeed-ai/video-upscaler"
TARGET = "2k"

VIDEOS_DIR = Path(r"E:\logistic\site\public\videos")
STATE_FILE = VIDEOS_DIR / "upscale_jobs.json"

HEADERS_JSON = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def api_post_json(url: str, payload: dict) -> dict:
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(), headers=HEADERS_JSON, method="POST"
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode())


def api_get(url: str) -> dict:
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {API_KEY}"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def upload_file(path: Path) -> str:
    """POST /media/upload/binary (multipart) → публичный URL файла."""
    boundary = "----wavespeedboundary"
    body = b""
    body += f"--{boundary}\r\n".encode()
    body += f'Content-Disposition: form-data; name="file"; filename="{path.name}"\r\n'.encode()
    body += b"Content-Type: video/mp4\r\n\r\n"
    body += path.read_bytes()
    body += f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        f"{BASE}/media/upload/binary",
        data=body,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=600) as resp:
        data = json.loads(resp.read().decode())
    # ответ может быть в data или напрямую
    d = data.get("data", data)
    url = d.get("download_url") or d.get("url") or d.get("media_url")
    if not url:
        raise RuntimeError(f"Неожиданный ответ upload: {data}")
    return url


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_submit():
    state = load_state()
    videos = sorted(
        p for p in VIDEOS_DIR.glob("*.mp4") if not p.stem.endswith("-2k")
    )
    print(f"Найдено видео: {len(videos)}")
    for v in videos:
        name = v.stem
        if name in state and state[name].get("id"):
            print(f"  [skip] {name} — задача уже отправлена ({state[name]['id']})")
            continue
        print(f"  [upload] {name} ({v.stat().st_size / 1e6:.1f} MB)...", flush=True)
        try:
            url = upload_file(v)
            resp = api_post_json(f"{BASE}/{MODEL}", {"video": url, "target_resolution": TARGET})
            task = resp.get("data", resp)
            state[name] = {
                "id": task.get("id"),
                "get_url": task.get("urls", {}).get("get"),
                "src_url": url,
                "status": "submitted",
            }
            save_state(state)
            print(f"  [ok] {name} → задача {task.get('id')}", flush=True)
        except Exception as e:
            print(f"  [ERROR] {name}: {e}", flush=True)
    print("Отправка завершена.")


def cmd_poll():
    state = load_state()
    if not state:
        print("Нет отправленных задач. Сначала: submit")
        return
    pending = 0
    for name, job in state.items():
        if job.get("status") == "done":
            continue
        get_url = job.get("get_url") or f"{BASE}/predictions/{job['id']}/result"
        try:
            resp = api_get(get_url)
            res = resp.get("data", resp)
            st = res.get("status")
            if st == "completed":
                out_url = (res.get("outputs") or [None])[0]
                if not out_url:
                    print(f"  [ERROR] {name}: completed без outputs: {res}")
                    job["status"] = "error"
                    continue
                dest = VIDEOS_DIR / f"{name}-2k.mp4"
                print(f"  [download] {name}-2k.mp4 ...", flush=True)
                urllib.request.urlretrieve(out_url, dest)
                job["status"] = "done"
                job["output"] = str(dest)
                print(f"  [done] {name} → {dest.name} ({dest.stat().st_size / 1e6:.1f} MB)", flush=True)
            elif st in ("failed", "cancelled", "timeout"):
                job["status"] = "error"
                job["error"] = json.dumps(res)[:500]
                print(f"  [FAILED] {name}: {job['error']}", flush=True)
            else:
                pending += 1
                job["status"] = st
                print(f"  [wait] {name}: {st}")
        except Exception as e:
            pending += 1
            print(f"  [ERROR poll] {name}: {e}")
        save_state(state)
    print(f"Готово: {sum(1 for j in state.values() if j.get('status') == 'done')}/{len(state)}, в работе: {pending}")


def cmd_status():
    state = load_state()
    for name, job in state.items():
        print(f"  {name}: {job.get('status')}")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "status"
    if mode == "submit":
        cmd_submit()
    elif mode == "poll":
        cmd_poll()
    else:
        cmd_status()
