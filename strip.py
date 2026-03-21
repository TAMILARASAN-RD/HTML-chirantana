import re
html_path = 'e:/projects/working/HTML-Chirantana-studios/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

def repl(m):
    full_match = m.group(0)
    style_attr = m.group(1)
    return full_match.replace(style_attr, '')

# Match <img ... style="transform: [...]" ... >
pattern = re.compile(r'<img[^>]*?(style="transform:[^"]+")[^>]*?>', re.IGNORECASE)
html = pattern.sub(repl, html)

# Also catch styles that don't have exactly "transform:" at the start of style string
pattern2 = re.compile(r'<img[^>]*?(style="[^"]*transform:[^"]+")[^>]*?>', re.IGNORECASE)
html = pattern2.sub(repl, html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Stripped inline styles.")
