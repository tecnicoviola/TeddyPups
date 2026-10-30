import json

with open('src/data/originalPuppies.json', 'r', encoding='utf-8') as f:
    puppies = json.load(f)

p0 = puppies[1] # korean-teacup-maltipoo-female
print("Keys of puppy object:", list(p0.keys()))
print("Puppy records:", p0.get('records'))
print("Cover:", p0.get('cover'))

