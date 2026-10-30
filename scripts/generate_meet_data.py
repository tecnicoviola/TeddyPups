with open('reference/mains/home.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re, json

meet_idx = c.find('tp-meet__track')
meet_end = c.find('</ol>', meet_idx)
track_html = c[meet_idx:meet_end+5]
items = re.findall(r'<li class="tp-door[^"]*".*?</li>', track_html, re.DOTALL)

doors_data = []
colors = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"]

for idx, it in enumerate(items):
    if 'tp-door--all' in it:
        continue
    name_m = re.search(r'tp-door__name">([^<]+)<', it)
    slug_m = re.search(r'href="/puppies/([^"]+)"', it)
    tag_m = re.search(r'tp-door__tag[^"]*">([^<]+)<', it)
    meta_m = re.search(r'tp-door__meta">(.*?)</span>', it)
    img_m = re.search(r'src="([^"]+)"', it)
    alt_m = re.search(r'alt="([^"]+)"', it)
    obj_pos_m = re.search(r'object-position:([^;"]+)', it)
    bg_col_m = re.search(r'background-color:([^;"]+)', it)

    # Clean meta HTML comments
    meta_str = meta_m.group(1) if meta_m else ""
    meta_clean = re.sub(r'<!--.*?-->', '', meta_str).strip()

    doors_data.append({
        "name": name_m.group(1).replace('&amp;', '&') if name_m else "",
        "slug": slug_m.group(1) if slug_m else "",
        "tag": tag_m.group(1) if tag_m else "Available",
        "meta": meta_clean,
        "img": img_m.group(1) if img_m else "",
        "alt": alt_m.group(1) if alt_m else "",
        "objectPosition": obj_pos_m.group(1).strip() if obj_pos_m else "center",
        "bgColor": bg_col_m.group(1).strip() if bg_col_m else "#000",
        "doorColor": colors[idx % len(colors)]
    })

print(f"Extracted {len(doors_data)} puppy doors.")
with open('src/data/meetPuppies.json', 'w', encoding='utf-8') as out:
    json.dump(doors_data, out, indent=2)
print("Saved to src/data/meetPuppies.json")

