"""
Интерполяция 2K-видео 30 fps → 60 fps через RIFE (из Flowframes, Vulkan).
Пайплайн на видео: ffmpeg extract → rife-ncnn-vulkan (2x) → ffmpeg encode 60fps.
Возобновляемый: стадии пишутся в interp_jobs.json, можно перезапускать.
Запуск:  python interpolate_60fps.py
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

FF_DIR = Path(r"C:\Users\Jaku\AppData\Local\Flowframes\FlowframesData\pkgs\av")
FFMPEG = FF_DIR / "ffmpeg.exe"
RIFE = Path(r"C:\Users\Jaku\AppData\Local\Flowframes\FlowframesData\pkgs\rife-ncnn\rife-ncnn-vulkan.exe")
RIFE_MODEL = Path(r"C:\Users\Jaku\AppData\Local\Flowframes\FlowframesData\pkgs\rife-ncnn\rife-v2.4")

VIDEOS_DIR = Path(r"E:\logistic\site\public\videos")
WORK_ROOT = VIDEOS_DIR / "interp_work"
STATE_FILE = VIDEOS_DIR / "interp_jobs.json"


def run(cmd: list, label: str):
    print(f"    [{label}] {' '.join(str(c) for c in cmd)[:140]}", flush=True)
    proc = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, timeout=3600)
    if proc.returncode != 0:
        tail = (proc.stderr or proc.stdout or "")[-800:]
        raise RuntimeError(f"{label} failed (code {proc.returncode}): {tail}")


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def process(video: Path, state: dict):
    name = video.stem  # e.g. loop01-2k
    out_file = VIDEOS_DIR / f"{name}-60fps.mp4"
    job = state.setdefault(name, {"stage": "new"})
    if out_file.exists() and job.get("stage") == "done":
        print(f"  [skip] {name} — уже готово")
        return

    work = WORK_ROOT / name
    frames_in = work / "in"
    frames_out = work / "out"

    # 1) Извлечение кадров
    if job.get("stage") == "new":
        if work.exists():
            shutil.rmtree(work)
        frames_in.mkdir(parents=True)
        run([FFMPEG, "-y", "-i", video, "-q:v", "2", str(frames_in / "%08d.jpg")], "extract")
        n = len(list(frames_in.glob("*.jpg")))
        print(f"    [extract] {n} кадров", flush=True)
        job["stage"] = "extracted"
        job["frames"] = n
        save_state(state)

    # 2) Интерполяция RIFE 2x
    if job.get("stage") == "extracted":
        frames_out.mkdir(parents=True, exist_ok=True)
        run([
            RIFE, "-i", frames_in, "-o", frames_out,
            "-m", RIFE_MODEL, "-u", "-j", "2:2:2",
            "-f", "%08d.jpg",
        ], "rife")
        n_out = len(list(frames_out.glob("*.jpg")))
        print(f"    [rife] {n_out} кадров", flush=True)
        # входные кадры больше не нужны — чистим диск
        shutil.rmtree(frames_in, ignore_errors=True)
        job["stage"] = "interpolated"
        save_state(state)

    # 3) Сборка mp4 60 fps
    if job.get("stage") == "interpolated":
        run([
            FFMPEG, "-y", "-framerate", "60", "-i", str(frames_out / "%08d.jpg"),
            "-c:v", "libx264", "-preset", "medium", "-crf", "17",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            out_file,
        ], "encode")
        shutil.rmtree(work, ignore_errors=True)
        job["stage"] = "done"
        save_state(state)
        print(f"  [done] {out_file.name} ({out_file.stat().st_size / 1e6:.1f} MB)", flush=True)


def main():
    WORK_ROOT.mkdir(exist_ok=True)
    state = load_state()
    videos = sorted(VIDEOS_DIR.glob("*-2k.mp4"))
    print(f"2K-видео к интерполяции: {len(videos)}")
    for v in videos:
        print(f"▶ {v.name}", flush=True)
        try:
            process(v, state)
        except Exception as e:
            print(f"  [ERROR] {v.name}: {e}", flush=True)
    done = sum(1 for j in state.values() if j.get("stage") == "done")
    print(f"\nГотово: {done}/{len(videos)}")


if __name__ == "__main__":
    sys.exit(main())
