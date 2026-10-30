from bs4 import BeautifulSoup

with open('reference/pages/puppies_korean-teacup-maltipoo-female.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
s0 = soup.find('div', id='S:0')
article = s0.find('article', class_='tp-storybook')
gutter = article.find('div', class_='gutter')
children = list(gutter.find_all(recursive=False))

with open('reference/dump_gallery.html', 'w', encoding='utf-8') as f:
    f.write(children[2].find('div', class_='lg:col-span-7').prettify())

with open('reference/dump_info_cards.html', 'w', encoding='utf-8') as f:
    f.write(children[2].find('div', class_='lg:col-span-5').prettify())

with open('reference/dump_coming_home.html', 'w', encoding='utf-8') as f:
    f.write(children[3].prettify())

with open('reference/dump_enquiry.html', 'w', encoding='utf-8') as f:
    f.write(children[4].prettify())

with open('reference/dump_prev_next.html', 'w', encoding='utf-8') as f:
    f.write(children[5].prettify())

print("Dumped 5 section files successfully!")

