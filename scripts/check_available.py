import json, os, re

data = json.load(open('d:/Blu_tai/src/data/puppiesCatalog.json', encoding='utf-8'))
print('Total available puppies in catalog:', len(data))
origins = set(p.get('origin', {}).get('slug') for p in data)
print('Origins:', origins)

for p in data:
    fn = f"d:/Blu_tai/reference/pages/puppies_{p['slug']}.html"
    if os.path.exists(fn):
        txt = open(fn, encoding='utf-8', errors='ignore').read()
        ch = re.findall(r'<p class="tp-chapter">.*?</p>', txt, re.DOTALL)
        ch_clean = [re.sub(r'<[^>]+>', '', c).strip() for c in ch]
        print(p['slug'], 'Chapters:', ch_clean)
        break

