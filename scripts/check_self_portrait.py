txt = open('d:/Blu_tai/reference/pages/puppies.html', encoding='utf-8', errors='ignore').read()
idx = txt.find('self-portrait')
snippet = txt[max(0, idx-1000):min(len(txt), idx+1500)]
print('Length:', len(snippet))
with open('d:/Blu_tai/reference/dump_self_portrait.html', 'w', encoding='utf-8') as f:
    f.write(snippet)
print('Wrote dump_self_portrait.html')

