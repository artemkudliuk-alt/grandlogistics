import os
import subprocess
import json
import shutil

def get_duration(video_path):
    cmd = [
        'ffprobe', '-v', 'error', 
        '-show_entries', 'format=duration', 
        '-of', 'default=noprint_wrappers=1:nokey=1', 
        video_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return float(result.stdout.strip())

def make_seamless_loop(input_path, output_path, fade_duration=1.5):
    try:
        duration = get_duration(input_path)
        print(f"Processing {os.path.basename(input_path)}: duration = {duration:.2f}s, target crossfade = {fade_duration}s")
        
        if duration <= 2 * fade_duration:
            print(f"Warning: Duration is too short for a {fade_duration}s fade. Skipping or reducing fade.")
            return False
            
        # Structure:
        # v1: trim from 0 to D - T
        # v2: trim from D - T to D
        # xfade: transition = fade, duration = T, offset = 0
        limit_main = duration - fade_duration
        
        # We also need to copy the audio if present, but since these are muted loops,
        # we will omit audio (-an) to keep things clean.
        filter_str = (
            f"[0:v]trim=0:{limit_main:.6f},setpts=PTS-STARTPTS[v1]; "
            f"[0:v]trim={limit_main:.6f}:{duration:.6f},setpts=PTS-STARTPTS[v2]; "
            f"[v2][v1]xfade=transition=fade:duration={fade_duration:.6f}:offset=0[outv]"
        )
        
        cmd = [
            'ffmpeg', '-y',
            '-i', input_path,
            '-filter_complex', filter_str,
            '-map', '[outv]',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-crf', '18',          # High quality
            '-preset', 'slow',
            '-an',                 # Remove audio
            output_path
        ]
        
        print(f"Running command: {' '.join(cmd)}")
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode != 0:
            print(f"Error processing {input_path}:")
            print(result.stderr)
            return False
            
        print(f"Successfully created seamless loop: {output_path}")
        new_duration = get_duration(output_path)
        print(f"New duration: {new_duration:.2f}s (expected {duration - fade_duration:.2f}s)")
        return True
        
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")
        return False

def main():
    videos_dir = r"e:\logistic\site\public\videos"
    backup_dir = r"e:\logistic\site\public\videos-backup"
    
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Created backup directory: {backup_dir}")
        
    loop_files = [f"loop0{i}.mp4" for i in range(1, 8)]
    
    for filename in loop_files:
        src_path = os.path.join(videos_dir, filename)
        if not os.path.exists(src_path):
            print(f"File not found: {src_path}")
            continue
            
        backup_path = os.path.join(backup_dir, filename)
        if not os.path.exists(backup_path):
            shutil.copy2(src_path, backup_path)
            print(f"Backed up {filename} to {backup_path}")
        else:
            print(f"Backup already exists for {filename}")
            
        # Process the video file in place
        temp_out = os.path.join(videos_dir, f"temp_{filename}")
        success = make_seamless_loop(backup_path, temp_out, fade_duration=1.5)
        if success:
            # Overwrite the original file
            shutil.move(temp_out, src_path)
            print(f"Overwrote original file with processed loop: {src_path}\n")
        else:
            if os.path.exists(temp_out):
                os.remove(temp_out)
            print(f"Failed to process {filename}\n")

if __name__ == '__main__':
    main()
