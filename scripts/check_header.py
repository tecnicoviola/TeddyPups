import re

txt = open('d:/Blu_tai/reference/pages/puppies_korean-teacup-maltipoo-female.html', encoding='utf-8', errors='ignore').read()
idx = txt.find('hello, it')
if idx != -1:
    print('Before Chapter 1:')
    print(txt[max(0, idx-400):idx+300])

