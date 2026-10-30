import json
import os

with open('src/data/originalPuppies.json', 'r', encoding='utf-8') as f:
    puppies = json.load(f)

public_imgs = set(os.listdir('public/images'))

def resolve(url):
    basename = os.path.basename(url)
    if basename in public_imgs:
        return f"/images/{basename}"
    # Try replacing webp with jpg or vice versa
    for ext in ['.jpg', '.jpeg', '.webp', '.png']:
        candidate = os.path.splitext(basename)[0] + ext
        if candidate in public_imgs:
            return f"/images/{candidate}"
    return url

for p in puppies:
    cover_resolved = resolve(p['cover']['url'])
    print(f"Puppy {p['slug']}: cover -> {cover_resolved} (exists: {os.path.exists('public' + cover_resolved)})")
    for idx, m in enumerate(p.get('media', [])):
        if m['kind'] == 'video' and m.get('poster'):
            m_res = resolve(m['poster']['url'])
        else:
            m_res = resolve(m['url'])
        if not os.path.exists('public' + m_res):
            print(f"  WARNING: Media {idx} ({m['kind']}) not found: {m_res} (orig: {m['url']})")

print("All media resolution checked!")

