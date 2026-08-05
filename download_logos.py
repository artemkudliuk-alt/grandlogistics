import urllib.request
import os

OUT = r'e:\logistic\site\public\user_logos_original'
os.makedirs(OUT, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
    'Accept': 'image/webp,image/png,image/*,*/*;q=0.8',
}

# Using direct PNG image links from Wikipedia Commons (correct small sizes that work)
logos = [
    ('01_Maersk.png',         'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Maersk_Group_Logo.svg/640px-Maersk_Group_Logo.svg.png'),
    ('02_MSC.png',            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/MSC_Cruises_logo.svg/640px-MSC_Cruises_logo.svg.png'),
    ('03_CMA_CGM.png',        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/CMA_CGM_logo.svg/640px-CMA_CGM_logo.svg.png'),
    ('04_COSCO_SHIPPING.png', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Cosco-shipping.svg/640px-Cosco-shipping.svg.png'),
    ('05_ONE.png',            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ocean_Network_Express_Logo.svg/640px-Ocean_Network_Express_Logo.svg.png'),
    ('06_Evergreen.png',      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Evergreen_Marine_logo.svg/640px-Evergreen_Marine_logo.svg.png'),
    ('07_Hapag_Lloyd.png',    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Hapag-Lloyd_logo.svg/640px-Hapag-Lloyd_logo.svg.png'),
    ('08_DP_World.png',       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/DP_World_logo.svg/640px-DP_World_logo.svg.png'),
]

for filename, url in logos:
    dest = os.path.join(OUT, filename)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
        # Check if we got actual image data (not error HTML)
        if len(data) > 5000 and data[:4] in (b'\x89PNG', b'GIF8', b'\xff\xd8\xff'):
            with open(dest, 'wb') as f:
                f.write(data)
            print(f'OK: {filename} ({len(data)//1024} KB)')
        else:
            print(f'BAD DATA: {filename} ({len(data)} bytes, starts with: {data[:20]})')
    except Exception as e:
        print(f'FAIL: {filename} -> {e}')

print('DONE')
