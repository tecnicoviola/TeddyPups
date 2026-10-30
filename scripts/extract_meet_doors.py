with open('reference/mains/home.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
meet_idx = c.find('tp-meet__track')
meet_end = c.find('</ol>', meet_idx)
track_html = c[meet_idx:meet_end+5]
items = re.findall(r'<li class="tp-door[^"]*".*?</li>', track_html, re.DOTALL)
print('Found doors:', len(items))
for idx, it in enumerate(items):
    name = re.search(r'tp-door__name">([^<]+)<', it)
    slug = re.search(r'href="/puppies/([^"]+)"', it)
    tag = re.search(r'tp-door__tag[^"]*">([^<]+)<', it)
    meta = re.search(r'tp-door__meta">(.*?)</span>', it)
    img = re.search(r'src="([^"]+)"', it)
    door_color = re.search(r'--door:([^;"]+)', it)
    print(f'Door {idx}: name={name.group(1) if name else ""}, slug={slug.group(1) if slug else ""}, tag={tag.group(1) if tag else ""}, color={door_color.group(1) if door_color else ""}')

