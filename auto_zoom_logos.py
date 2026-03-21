import os
import re
from PIL import Image

image_dir = 'e:/projects/working/HTML-Chirantana-studios/assets/clients'
html_path = 'e:/projects/working/HTML-Chirantana-studios/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

for filename in os.listdir(image_dir):
    if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')): continue
    path = os.path.join(image_dir, filename)
    try:
        img = Image.open(path).convert('RGBA')
        w, h = img.size
        pixels = img.load()
        min_x, min_y, max_x, max_y = w, h, -1, -1
        
        # simple bounding box ignoring fully transparent or nearly white pixels
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                # > 20 alpha is visible
                # > 240 rgb is practically white background built into the image
                if a > 20 and not (r > 240 and g > 240 and b > 240):
                    if x < min_x: min_x = x
                    if x > max_x: max_x = x
                    if y < min_y: min_y = y
                    if y > max_y: max_y = y
        
        if min_x <= max_x and min_y <= max_y:
            crop_w = max_x - min_x + 1
            crop_h = max_y - min_y + 1
            
            w_ratio = w / float(crop_w) if crop_w > 0 else 1.0
            h_ratio = h / float(crop_h) if crop_h > 0 else 1.0
            
            # The padding factor tells us how much we can scale it up
            # if an image is 50% empty space, ratio is ~2.0
            scale = min(w_ratio, h_ratio)
            
            # clamp scale to 2.0 to avoid huge blowups
            scale = max(1.0, min(scale, 2.0))
            
            # if significant padding is found, we apply the scale!
            if scale > 1.15:
                print(f"Zooming {filename} by {scale:.2f}x")
                src_str = f'src="assets/clients/{filename}"'
                
                def repl(m):
                    tag = m.group(0)
                    if 'transform: scale' in tag: return tag
                    if 'style=' in tag:
                        return tag.replace('style="', f'style="transform: scale({scale:.2f}); ')
                    else:
                        return tag.replace('<img ', f'<img style="transform: scale({scale:.2f});" ')
                
                # ensure we only match the actual filename and its tag
                # escape the filename
                safe_src = re.escape(src_str)
                # match the <img ... src="assets/clients/filename" ... />
                pattern = r'<img\s+[^>]*?' + safe_src + r'[^>]*?>'
                html = re.sub(pattern, repl, html, flags=re.IGNORECASE)
                
    except Exception as e:
        print('Error processing', filename, e)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Auto-scaled logos successfully.')
