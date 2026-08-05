---
name: video-stream-encoder
description: Re-encodes MP4/WebM videos with FFmpeg +faststart, 720p/1080p mobile scaling, and poster frame extraction. Trigger with /encode-videos, compress videos, or faststart.
---

# Video Stream Encoding Protocol

When invoked via `/encode-videos` or when asked to re-encode 3D video loops:

## 1. FastStart & Dual Format Execution
Run `process_web_videos.py` or `optimize_videos_dual.py`:
```bash
python optimize_videos_dual.py
```

## 2. Encoding Standard
- **WebM (VP9)**: 720p, `-crf 32 -b:v 0 -an` -> **~1.2 MB**
- **MP4 (H.264)**: 720p, `-crf 26 -preset medium -movflags +faststart -pix_fmt yuv420p -an` -> **~1.5 MB**
- **Poster**: 1st frame extracted to JPG -> **~40 KB**

## 3. Verification
Verify `moov` atom placement at byte 0 and check that `<source src="...webm" />` tags are active in `Cinema.tsx` and `HeroVideoScene4.tsx`.
