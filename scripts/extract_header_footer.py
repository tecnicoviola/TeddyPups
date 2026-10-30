from bs4 import BeautifulSoup

with open('reference/pages/puppies.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

with open('reference/header_full.html', 'w', encoding='utf-8') as f:
    f.write(str(soup.find('header')))

with open('reference/footer_full.html', 'w', encoding='utf-8') as f:
    f.write(str(soup.find('footer')))

with open('reference/main_full.html', 'w', encoding='utf-8') as f:
    f.write(str(soup.find('main')))

print('Extracted reference/header_full.html, reference/footer_full.html, reference/main_full.html!')

