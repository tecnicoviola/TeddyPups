const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

const anchor = 'maltipoo-max-male';
const pos = 421505;
const startIdx = html.lastIndexOf('[{', pos);
console.log('startIdx:', startIdx, html.slice(startIdx, startIdx + 30));

let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < html.length; i++) {
  if (html[i] === '[') depth++;
  else if (html[i] === ']') {
    depth--;
    if (depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

console.log('endIdx:', endIdx);
const rawStr = html.slice(startIdx, endIdx);
const unescaped = rawStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
const parsed = JSON.parse(unescaped);
console.log('Parsed puppies count:', parsed.length);
fs.writeFileSync('src/data/puppiesCatalog.json', JSON.stringify(parsed, null, 2));
console.log('Saved to src/data/puppiesCatalog.json');

// Let's also check breeds
const breedsStart = html.indexOf('\"breeds\":[', endIdx);
const breedsEnd = html.indexOf(']', breedsStart) + 1;
const rawBreeds = html.slice(breedsStart + 9, breedsEnd).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
const breeds = JSON.parse(rawBreeds);
console.log('Breeds:', breeds);
fs.writeFileSync('src/data/breedsList.json', JSON.stringify(breeds, null, 2));

