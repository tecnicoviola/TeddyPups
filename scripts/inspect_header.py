from bs4 import BeautifulSoup

with open('reference/header_full.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print('Header tag:', soup.header.name, soup.header.get('class'))
bar = soup.find('div', class_='tp-header__bar')
print('Bar children count:', len(list(bar.children)))
for c in bar.children:
    if c.name:
        print(' -', c.name, c.get('class'))

