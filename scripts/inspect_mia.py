import re

txt = open('d:/Blu_tai/reference/pages/puppies_maltipoo-mia-girl.html', encoding='utf-8', errors='ignore').read()
chapters = re.findall(r'<p class="tp-chapter">.*?</p>', txt, re.DOTALL)
for c in chapters:
    print('Chapter:', re.sub(r'\s+', ' ', c))
headings = re.findall(r'<h2[^>]*>.*?</h2>', txt, re.DOTALL)
for h in headings:
    print('Heading:', re.sub(r'\s+', ' ', h))

