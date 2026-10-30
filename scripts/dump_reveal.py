txt = open('d:/Blu_tai/reference/js/1y11gwrsbuw85.js', encoding='utf-8', errors='ignore').read()
idx = txt.find('RevealScope')
snippet = txt[idx:idx+2500]

with open('d:/Blu_tai/reference/reveal_scope_code.js', 'w', encoding='utf-8') as f:
    f.write(snippet)

print('Wrote reveal_scope_code.js')
