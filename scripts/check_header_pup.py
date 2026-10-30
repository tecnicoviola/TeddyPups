txt = open('d:/Blu_tai/reference/pages/puppies.html', encoding='utf-8', errors='ignore').read()
idx1 = txt.find('Available puppies')
idx2 = txt.find('self-portrait')
snippet = txt[idx1:idx2+200]

with open('d:/Blu_tai/reference/dump_header_pup.html', 'w', encoding='utf-8') as f:
    f.write(snippet)

print('Wrote dump_header_pup.html')

