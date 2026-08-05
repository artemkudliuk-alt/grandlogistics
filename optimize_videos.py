"""Веб-оптимизация 13 финальных видео: H.264 CRF 23, preset slow, faststart, без аудио.
Выход — канонические имена (loop01.mp4, transit12.mp4 ...), на них ссылается код сайта."""
import subprocess
import sys
from pathlib import Path

FFMPEG = Path(r"C:\Users\Jaku\AppData\Local\Flowframes\FlowframesData\pkgs\av\ffmpeg.exe")
VIDEOS_DIR = Path(r"E:\logistic\site\public\videos")

JOBS = {}
for i in range(1, 8):
    JOBS[f"loop{i:02d}"] = f"loop{i:02d}-2k-60fps.mp4"
for t in ["transit12", "transit23", "transit34", "transit45", "transit56", "transit67"]:
    JOBS[t] = f"{t}-2k-2x-RIFE-RIFE4.0-60fps.mp4"


def main():
    for out_name, src_name in JOBS.items():
        src = VIDEOS_DIR / src_name
        dst = VIDEOS_DIR / f"{out_name}.mp4"
        if dst.exists() and out_name == "transit12":
            print(f"[skip] {out_name} — уже сжат в тесте")
            continue
        if not src.exists():
            print(f"[ERROR] нет источника {src_name}")
            continue
        print(f"▶ {src_name} → {out_name}.mp4", flush=True)
        proc = subprocess.run(
            [
                str(FFMPEG), "-y", "-i", str(src),
                "-c:v", "libx264", "-preset", "slow", "-crf", "23",
                "-an", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                str(dst),
            ],
            capture_output=True, text=True, timeout=3600,
        )
        if proc.returncode != 0:
            print(f"[ERROR] {out_name}: {(proc.stderr or '')[-400:]}", flush=True)
        else:
            print(f"[done] {out_name}.mp4 ({dst.stat().st_size / 1e6:.1f} MB, было {src.stat().st_size / 1e6:.1f} MB)", flush=True)
    print("Оптимизация завершена.")


if __name__ == "__main__":
    sys.exit(main())
