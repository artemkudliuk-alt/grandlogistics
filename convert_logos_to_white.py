import os
from PIL import Image
import numpy as np

SOURCE_DIR = r'e:\logistic\site\public\user_logos_original'
OUTPUT_DIR = r'e:\logistic\site\public\logos_white'
os.makedirs(OUTPUT_DIR, exist_ok=True)

files = {
    '01_Maersk.png':         'maersk',
    '02_MSC.png':            'msc',
    '03_CMA_CGM.png':        'cma_cgm',
    '04_COSCO_SHIPPING.png': 'cosco',
    '05_OneLogistics.png':   'one',
    '06_Evergreen.png':      'evergreen',
    '07_Hapag_Lloyd.png':    'hapag',
    '08_DP_World.png':       'dpworld',
}

BG_THRESHOLD = 220  # pixels with R, G, B all >= this are treated as white background

for src_filename, dest_name in files.items():
    src_path = os.path.join(SOURCE_DIR, src_filename)
    dst_path = os.path.join(OUTPUT_DIR, dest_name + '.png')

    if not os.path.exists(src_path):
        print(f'MISSING: {src_filename}')
        continue

    img = Image.open(src_path).convert('RGBA')
    data = np.array(img, dtype=np.uint8)

    r = data[:,:,0].astype(np.int32)
    g = data[:,:,1].astype(np.int32)
    b = data[:,:,2].astype(np.int32)
    a = data[:,:,3].astype(np.int32)

    # Background = near-white OR fully transparent
    is_bg = ((r >= BG_THRESHOLD) & (g >= BG_THRESHOLD) & (b >= BG_THRESHOLD)) | (a < 15)

    # Output: pure white pixels where logo exists, transparent where background
    out = np.zeros_like(data)
    out[:,:,0] = 255
    out[:,:,1] = 255
    out[:,:,2] = 255
    out[:,:,3] = np.where(is_bg, 0, np.where(a > 0, a, 255)).astype(np.uint8)

    result = Image.fromarray(out)
    result.save(dst_path, 'PNG')

    pixel_count = int(np.sum(out[:,:,3] > 0))
    size_kb = os.path.getsize(dst_path) // 1024
    print(f'OK: {src_filename} -> logos_white/{dest_name}.png ({pixel_count} visible pixels, {size_kb} KB)')

print('DONE')
