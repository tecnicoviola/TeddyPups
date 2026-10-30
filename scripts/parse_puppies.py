import json
import re

with open('reference/data/puppy_browser_props_raw.txt', 'r', encoding='utf-8', errors='ignore') as f:
    raw = f.read()

# Find the JSON part for puppies
match = re.search(r'\{"puppies":(\[.*?\])\}', raw)
if match:
    puppies_json = match.group(1)
    puppies = json.loads(puppies_json)
    print(f"Successfully parsed {len(puppies)} puppies from raw props!")
    for i, p in enumerate(puppies):
        print(f"{i+1}. Slug: {p.get('slug')}")
        print(f"   Name: {p.get('name')} | DisplayName: {p.get('displayName')} | Breed: {p.get('breed')}")
        print(f"   Gender: {p.get('gender')} ({p.get('genderLabel')}) | Age: {p.get('age')}")
        print(f"   Status: {p.get('status')} | Where: {p.get('where', 'N/A')}")
        cover = p.get('cover', {})
        print(f"   Cover URL: {cover.get('url')}")
else:
    print("Could not find puppies array with simple regex, trying deeper search...")
    # Search where "puppies":[{"id": starts
    idx = raw.find('"puppies":[')
    print("Found 'puppies':", idx)
