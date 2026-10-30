import json
import os

with open('src/data/originalPuppies.json', 'r', encoding='utf-8') as f:
    puppies = json.load(f)

public_images = set(os.listdir('public/images'))

found = 0
missing = []

for p in puppies:
    for m in p.get('media', []):
        url = m.get('url', '')
        basename = os.path.basename(url)
        # Also check .webp vs .jpg or video
        alt_names = [
            basename,
            basename.replace('.webp', '.jpg'),
            basename.replace('.jpg', '.webp'),
            basename.replace('.mp4', '.jpg'),
            basename.replace('.mp4', '.webp'),
        ]
        if any(name in public_images for name in alt_names):
            found += 1
        else:
            missing.append((p['slug'], m['kind'], basename))

print(f"Total media items: {sum(len(p.get('media', [])) for p in puppies)}")
print(f"Found in public/images: {found}")
print(f"Missing count: {len(missing)}")
if missing:
    print("Sample missing:", missing[:10])

