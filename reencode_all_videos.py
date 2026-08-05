"""
Full video re-encode with quality-first settings.
Uses CRF (Constant Rate Factor) - NOT fixed bitrate.
CRF adapts bitrate to scene complexity: simple scenes = less data, complex = more.
Quality is PRESERVED or IMPROVED, file sizes drop dramatically.

Targets:
  Mobile MP4  - 720p, 30fps, H.264 CRF 23, faststart
  Desktop MP4 - 1080p, 30fps, H.264 CRF 22, faststart
  Mobile WebM - 720p, 30fps, VP9  CRF 33 (VP9 CRF is reversed scale)
"""

import subprocess
import sys
import os
from pathlib import Path

VIDEOS_DIR = Path(__file__).parent / "public" / "videos"
BACKUP_DIR = Path(__file__).parent / "public" / "videos_backup_original"

# All base names (without extension)
BASE_NAMES = [
    "loop01", "loop02", "loop03", "loop04", "loop05", "loop06", "loop07",
    "transit12", "transit23", "transit34", "transit45", "transit56", "transit67",
]

def run(cmd, label):
    print(f"\n▶ {label}")
    print("  " + " ".join(str(c) for c in cmd))
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ✗ ERROR:\n{result.stderr[-1000:]}")
        return False
    print(f"  ✓ Done")
    return True

def file_mb(path: Path) -> str:
    if path.exists():
        return f"{path.stat().st_size / 1024 / 1024:.1f} MB"
    return "missing"

def encode_mobile_mp4(src: Path, dst: Path, name: str) -> bool:
    """720p 30fps H.264 CRF23 faststart"""
    is_transit = "transit" in name
    crf = "21" if is_transit else "23"  # slightly sharper for short transit clips
    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", "scale=1280:720:flags=lanczos",
        "-r", "30",
        "-c:v", "libx264",
        "-crf", crf,
        "-preset", "slow",          # better compression = smaller file same quality
        "-profile:v", "high",
        "-level:v", "4.0",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",   # moov atom at front = instant play
        "-an",                       # no audio
        str(dst)
    ]
    return run(cmd, f"Mobile MP4: {name} → {file_mb(src)} → ?")

def encode_mobile_webm(src: Path, dst: Path, name: str) -> bool:
    """720p 30fps VP9 CRF33 (good quality, 30-50% smaller than H.264)"""
    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", "scale=1280:720:flags=lanczos",
        "-r", "30",
        "-c:v", "libvpx-vp9",
        "-crf", "33",               # VP9 CRF 33 ≈ H.264 CRF 23 visually
        "-b:v", "0",               # pure CRF mode (no target bitrate)
        "-deadline", "good",
        "-cpu-used", "2",
        "-pix_fmt", "yuv420p",
        "-an",
        str(dst)
    ]
    return run(cmd, f"Mobile WebM: {name} → {file_mb(src)} → ?")

def encode_desktop_mp4(src: Path, dst: Path, name: str) -> bool:
    """1080p 30fps H.264 CRF22 faststart"""
    is_transit = "transit" in name
    crf = "20" if is_transit else "22"
    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", "scale=1920:1080:flags=lanczos",
        "-r", "30",
        "-c:v", "libx264",
        "-crf", crf,
        "-preset", "slow",
        "-profile:v", "high",
        "-level:v", "4.1",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        str(dst)
    ]
    return run(cmd, f"Desktop MP4 1080p: {name} → {file_mb(src)} → ?")

def main():
    print("=" * 60)
    print("🎬 Grand Logistics - Full Video Re-encode")
    print("   Quality-first CRF mode | faststart | 30fps")
    print("=" * 60)

    # Backup originals once
    if not BACKUP_DIR.exists():
        BACKUP_DIR.mkdir(parents=True)
        print(f"\n📦 Backing up originals to {BACKUP_DIR.name}/...")
        for f in VIDEOS_DIR.glob("*.mp4"):
            if "_mobile" not in f.name:
                dst = BACKUP_DIR / f.name
                if not dst.exists():
                    import shutil
                    shutil.copy2(f, dst)
                    print(f"  Backed up: {f.name}")
        print("  Backup complete.")

    results = []
    total = len(BASE_NAMES)

    for idx, name in enumerate(BASE_NAMES, 1):
        print(f"\n{'='*60}")
        print(f"[{idx}/{total}] Processing: {name}")
        print(f"{'='*60}")

        src_original = VIDEOS_DIR / f"{name}.mp4"

        if not src_original.exists():
            # Try backup
            src_backup = BACKUP_DIR / f"{name}.mp4"
            if src_backup.exists():
                src_original = src_backup
            else:
                print(f"  ✗ Source not found: {src_original}")
                results.append((name, False, False, False))
                continue

        before_mobile_mp4 = file_mb(VIDEOS_DIR / f"{name}_mobile.mp4")
        before_mobile_webm = file_mb(VIDEOS_DIR / f"{name}_mobile.webm")
        before_desktop = file_mb(src_original)

        dst_mobile_mp4  = VIDEOS_DIR / f"{name}_mobile.mp4"
        dst_mobile_webm = VIDEOS_DIR / f"{name}_mobile.webm"
        dst_desktop     = VIDEOS_DIR / f"{name}.mp4"

        # Use temp names then replace originals
        tmp_desktop = VIDEOS_DIR / f"{name}_new.mp4"

        ok1 = encode_mobile_mp4(src_original, dst_mobile_mp4, name)
        ok2 = encode_mobile_webm(src_original, dst_mobile_webm, name)
        ok3 = encode_desktop_mp4(src_original, tmp_desktop, name)

        if ok3 and tmp_desktop.exists():
            # Replace original desktop with 1080p version
            dst_desktop.unlink(missing_ok=True)
            tmp_desktop.rename(dst_desktop)
            print(f"  ✓ Desktop: {before_desktop} → {file_mb(dst_desktop)}")

        after_mobile_mp4  = file_mb(dst_mobile_mp4)
        after_mobile_webm = file_mb(dst_mobile_webm)

        print(f"\n  📊 Size Report for {name}:")
        print(f"     Desktop MP4:  {before_desktop} → {file_mb(dst_desktop)}")
        print(f"     Mobile MP4:   {before_mobile_mp4} → {after_mobile_mp4}")
        print(f"     Mobile WebM:  {before_mobile_webm} → {after_mobile_webm}")

        results.append((name, ok1, ok2, ok3))

    print("\n" + "=" * 60)
    print("📋 FINAL RESULTS")
    print("=" * 60)
    all_ok = True
    for name, ok1, ok2, ok3 in results:
        status = "✓" if (ok1 and ok2 and ok3) else "✗"
        if not (ok1 and ok2 and ok3):
            all_ok = False
        print(f"  {status} {name:20s} mobile_mp4={ok1} mobile_webm={ok2} desktop={ok3}")

    print("\n" + ("✅ ALL DONE!" if all_ok else "⚠️ Some files had errors. Check above."))
    print("\nNext steps:")
    print("  git add . && git commit -m 'Re-encode: CRF quality-first, 30fps, 1080p desktop, 720p mobile'")
    print("  git push origin main")

if __name__ == "__main__":
    main()
