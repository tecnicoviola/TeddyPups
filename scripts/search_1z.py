import re

txt = open('d:/Blu_tai/reference/1zehnmtvp861v_formatted.js', encoding='utf-8', errors='ignore').read()
strings = re.findall(r'"([^"]{4,60})"', txt)
print('Matches:')
for s in sorted(set(strings)):
    if any(k in s.lower() for k in ['enquir', 'ask', 'letter', 'form', 'success', 'received', 'message', 'pup', 'scroll', 'anim', 'post']):
        print('  ', s)
