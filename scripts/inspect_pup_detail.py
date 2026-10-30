from bs4 import BeautifulSoup

with open('reference/pages/puppies_korean-teacup-maltipoo-female.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
s0 = soup.find('div', id='S:0')
article = s0.find('article', class_='tp-storybook')

print("Article style:", article.get('style'))
for child in article.find_all(recursive=False):
    print(f"Child: <{child.name}> class={child.get('class')} id={child.get('id')}")
    if child.name == 'div':
        for sub in child.find_all(recursive=False):
            print(f"   Sub: <{sub.name}> class={sub.get('class')} id={sub.get('id')}")
            for ssub in sub.find_all(recursive=False):
                print(f"      SSub: <{ssub.name}> class={ssub.get('class')} id={ssub.get('id')}")
