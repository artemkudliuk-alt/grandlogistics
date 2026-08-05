import os
from PIL import Image

logo_files = [
    'user_maersk.png',
    'user_msc.png',
    'user_cma.png',
    'user_cosco.png',
    'user_one.png',
    'user_evergreen.png',
    'user_hapag.png',
    'user_dpworld.png'
]

public_dir = r'e:\logistic\site\public\logos'

for filename in logo_files:
    filepath = os.path.join(public_dir, filename)
    if not os.path.exists(filepath):
        print(f"File missing: {filepath}")
        continue
    
    img = Image.open(filepath).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If the pixel is close to white (background), make it fully transparent (alpha = 0)
        if r > 220 and g > 220 and b > 220:
            new_data.append((255, 255, 255, 0))
        else:
            # If it's logo content, make it pure solid white with original alpha
            new_data.append((255, 255, 255, a if a > 0 else 255))
            
    img.putdata(new_data)
    
    # Save trimmed transparent PNG
    out_filename = "clean_" + filename
    out_filepath = os.path.join(public_dir, out_filename)
    img.save(out_filepath, "PNG")
    print(f"Successfully processed and created: {out_filename}")
