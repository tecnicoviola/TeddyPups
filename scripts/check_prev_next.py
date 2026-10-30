import glob
from bs4 import BeautifulSoup
import os

files = glob.glob('reference/pages/puppies_*.html')
print(f"Found {len(files)} puppy detail html files")

for f in sorted(files):
    slug = os.path.basename(f).replace('puppies_', '').replace('.html', '')
    html = open(f, encoding='utf-8', errors='ignore').read()
    soup = BeautifulSoup(html, 'html.parser')
    s0 = soup.find('div', id='S:0')
    if not s0:
        continue
    nav = s0.find('nav', attrs={'aria-label': 'More puppies'})
    if not nav:
        continue
    links = nav.find_all('a')
    prev_link = links[0].get('href') if len(links) > 0 else 'None'
    prev_name = links[0].find_all('span')[-1].text.strip() if len(links) > 0 else ''
    next_link = links[1].get('href') if len(links) > 1 else 'None'
    next_name = links[1].find_all('span')[-1].text.strip() if len(links) > 1 else ''
    print(f"{slug:<35} | PREV: {prev_name:<20} ({prev_link}) | NEXT: {next_name:<20} ({next_link})")

