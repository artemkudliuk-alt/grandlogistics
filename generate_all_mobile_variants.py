import os
import subprocess

VIDEOS_DIR = r"e:\logistic\site\public\videos"

video_files = [
  "loop01.mp4", "loop02.mp4", "loop03.mp4", "loop04.mp4",
  "loop05.mp4", "loop06.mp4", "loop07.mp4",
  "transit12.mp4", "transit23.mp4", "transit34.mp4",
  "transit45.mp4", "transit56.mp4", "transit67.mp4"
]

print(f"Generating all missing mobile variants for {len(video_files)} videos...")

for idx, fname in enumerate(video_files, 1):
  src_path = os.path.join(VIDEOS_DIR, fname)
  base_name = fname.replace('.mp4', '')

  out_webm_mobile = os.path.join(VIDEOS_DIR, f"{base_name}_mobile.webm")
  out_mp4_mobile = os.path.join(VIDEOS_DIR, f"{base_name}_mobile.mp4")

  print(f"[{idx}/{len(video_files)}] Processing {fname}...")

  # 1. Generate MP4 Mobile (H.264, 720p, +faststart ~1.5MB)
  if not os.path.exists(out_mp4_mobile) or os.path.getsize(out_mp4_mobile) == 0:
    cmd_mp4 = [
      "ffmpeg", "-y", "-i", src_path,
      "-vf", "scale=-2:720",
      "-c:v", "libx264",
      "-crf", "26",
      "-preset", "fast",
      "-movflags", "+faststart",
      "-pix_fmt", "yuv420p",
      "-an",
      out_mp4_mobile
    ]
    subprocess.run(cmd_mp4, check=True)

  # 2. Generate WebM Mobile (VP9, 720p ~1.2MB)
  if not os.path.exists(out_webm_mobile) or os.path.getsize(out_webm_mobile) == 0:
    cmd_webm = [
      "ffmpeg", "-y", "-i", src_path,
      "-vf", "scale=-2:720",
      "-c:v", "libvpx-vp9",
      "-crf", "32",
      "-b:v", "0",
      "-an",
      out_webm_mobile
    ]
    subprocess.run(cmd_webm, check=True)

print("All mobile WebM and MP4 variants generated successfully!")
