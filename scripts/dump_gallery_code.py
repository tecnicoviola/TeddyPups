import json

txt = open('d:/Blu_tai/reference/js/1y11gwrsbuw85.js', encoding='utf-8', errors='ignore').read()
idx = txt.find('Previous photo')
snippet = txt[max(0, idx-1500):min(len(txt), idx+2000)]

with open('d:/Blu_tai/reference/original_gallery_code.js', 'w', encoding='utf-8') as f:
    f.write(snippet)

print('Wrote original_gallery_code.js, length:', len(snippet))
