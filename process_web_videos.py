import os
import subprocess
import time

VIDEOS_DIR = r"e:\logistic\site\public\videos"
TEMP_DIR = r"e:\logistic\site\public\videos_optimized"

os.makedirs(TEMP_DIR, exist_ok=True)

video_files = [f for f in os.listdir(VIDEOS_DIR) if f.endswith('.mp4')]

print(f"Found {len(video_files)} video files for optimization.")

for idx, fname in enumerate(video_files, 1):
  src_path = os.path.join(VIDEOS_DIR, fname)
  out_path = os.path.join(TEMP_DIR, fname)
  poster_name = fname.replace('.mp4', '_poster.jpg')
  poster_path = os.path.join(VIDEOS_DIR, poster_name)

  print(f"[{idx}/{len(video_files)}] Processing {fname}...")

  # 1. FFmpeg перекодирование с +faststart и идеальным балансом веб-качества (CRF 24)
  cmd_convert = [
    "ffmpeg", "-y", "-i", src_path,
    "-c:v", "libx264",
    "-crf", "24",
    "-preset", "medium",
    "-movflags", "+faststart",
    "-pix_fmt", "yuv420p",
    "-an",
    out_path
  ]
  subprocess.run(cmd_convert, check=True)

  # 2. Извлечение 1-го кадра в качестве легкой картинки-постера (.jpg ~40KB)
  cmd_poster = [
    "ffmpeg", "-y", "-ss", "00:00:00.000", "-i", out_path,
    "-vframes", "1",
    "-q:v", "2",
    poster_path
  ]
  subprocess.run(cmd_poster, check=True)

print("All videos successfully re-encoded with +faststart and posters created!")
