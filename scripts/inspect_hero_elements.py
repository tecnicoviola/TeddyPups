from bs4 import BeautifulSoup

with open('reference/home_hero_sample.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

# Find all divs or elements with arch or pup
print("Sections/Divs inside Hero:")
for el in soup.find_all(True):
    cls = el.get('class', [])
    if any('arch' in c or 'pup' in c or 'bubble' in c or 'parade' in c or 'fence' in c for c in cls):
        print(f"<{el.name} class='{' '.join(cls)}'> id={el.get('id')}")

