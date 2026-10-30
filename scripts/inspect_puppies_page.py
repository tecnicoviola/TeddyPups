from bs4 import BeautifulSoup
import re

with open('reference/mains/puppies.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("Page tag:", soup.div.get('class'), soup.div.get('data-page'))
sections = soup.find_all('section')
print("Sections count:", len(sections))
for i, s in enumerate(sections):
    print(f"Section {i}: aria-label={s.get('aria-label') or s.get('aria-labelledby')}, class={s.get('class')}")

