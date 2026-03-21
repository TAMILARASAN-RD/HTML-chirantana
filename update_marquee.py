import re

with open('e:/projects/working/HTML-Chirantana-studios/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('<!-- Marquee Structure -->')
end_idx = text.find('<!-- Subtle gradient overlays for refined look -->')

if start_idx != -1 and end_idx != -1:
    marquee_code = text[start_idx:end_idx]
    
    # 1. Update the track containers
    marquee_code = marquee_code.replace(
        'class="animate-marquee-reverse gap-12 md:gap-20 items-center mb-8"', 
        'class="animate-marquee-reverse film-reel-track mb-8"'
    )
    marquee_code = marquee_code.replace(
        'class="animate-marquee gap-12 md:gap-20 items-center"', 
        'class="animate-marquee film-reel-track"'
    )
    
    # 2. Update the inner Sets
    marquee_code = marquee_code.replace(
        'class="flex gap-12 md:gap-20 items-center h-16 md:h-20"',
        'class="flex items-center h-full"'
    )
    
    # 3. Replace img tags with wrapped ones
    def repl_img(m):
        src = m.group(1)
        alt = m.group(2)
        return f'<div class="film-reel-item">\n                <img src="{src}" alt="{alt}" loading="lazy" />\n              </div>'
    
    marquee_code = re.sub(r'<img\s+src="([^"]+)"\s+alt="([^"]+)"[^>]+/>', repl_img, marquee_code)
    
    new_text = text[:start_idx] + marquee_code + text[end_idx:]
    with open('e:/projects/working/HTML-Chirantana-studios/index.html', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Marquee updated successfully!')
else:
    print('Could not find boundaries.')
