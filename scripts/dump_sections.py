from bs4 import BeautifulSoup
import json

with open('reference/pages/puppies_korean-teacup-maltipoo-female.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
s0 = soup.find('div', id='S:0')
article = s0.find('article', class_='tp-storybook')
gutter = article.find('div', class_='gutter')

children = list(gutter.find_all(recursive=False))

print("=== 0. BREADCRUMB ===")
print(children[0].prettify())

print("\n=== 1. CHAPTER ===")
print(children[1].prettify())

print("\n=== 2. TWO COLS (GALLERY + INFO CARDS) ===")
left_col = children[2].find('div', class_='lg:col-span-7')
right_col = children[2].find('div', class_='lg:col-span-5')

print("--- LEFT COL (GALLERY) ---")
print(left_col.prettify()[:2500])
print("... [TRUNCATED] ...")

print("--- RIGHT COL (INFO + WHAT COMES) ---")
print(right_col.prettify())

print("\n=== 3. COMING HOME FROM ABROAD ===")
print(children[3].prettify())

print("\n=== 4. ENQUIRY SECTION ===")
print(children[4].prettify()[:3000])

print("\n=== 5. PREV / NEXT NAV ===")
print(children[5].prettify())

