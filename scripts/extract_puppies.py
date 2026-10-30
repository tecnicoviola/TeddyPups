import json

with open('reference/data/puppy_browser_props_raw.txt', 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()

idx = raw.find('"puppies":[')
start = idx + len('"puppies":')

# Use json decoder to decode starting at start
decoder = json.JSONDecoder()
puppies, end = decoder.raw_decode(raw[start:])
print(f"Successfully decoded {len(puppies)} puppies!")

with open('src/data/originalPuppies.json', 'w', encoding='utf-8') as f:
    json.dump(puppies, f, indent=2)

for i, p in enumerate(puppies):
    print(f"{i+1:2d}. {p.get('slug'):<35} | {p.get('displayName') or p.get('name'):<25} | {p.get('status')}")

