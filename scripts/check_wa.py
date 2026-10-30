import re, urllib.parse

txt = open('d:/Blu_tai/reference/pages/puppies_maltipoo-max-male.html', encoding='utf-8', errors='ignore').read()
m = re.findall(r'href="(https://wa\.me[^"]+)"', txt)
for u in m:
    print('URL:', u)
    print('Decoded:', urllib.parse.unquote(u))

