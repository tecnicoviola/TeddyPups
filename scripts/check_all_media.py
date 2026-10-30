import json

with open('src/data/originalPuppies.json', encoding='utf-8') as f:
    puppies = json.load(f)

for i, p in enumerate(puppies):
    media = p.get('media', [])
    origin = p.get('origin')
    print(f"{i+1:2d}. {p['slug']:<32} | media: {len(media):2d} | origin: {origin}")
