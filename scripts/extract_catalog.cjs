const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

const targetIdx = 421505;
// Find start of puppies array: look backwards for [
const startIdx = html.indexOf('[{\\"id\\":\\"4218427a', targetIdx - 50);
console.log('startIdx:', startIdx);

// Look for matching ]
let inQuote = false;
let depth = 0;
let endIdx = -1;

for (let i = startIdx; i < html.length; i++) {
  const ch = html[i];
  if (ch === '\\' && html[i+1] === '"') {
    inQuote = !inQuote;
    i++;
    continue;
  }
  if (!inQuote) {
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
}

console.log('endIdx:', endIdx);
const rawStr = html.slice(startIdx, endIdx);
const unescaped = rawStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
try {
  const puppies = JSON.parse(unescaped);
  console.log('PARSED PUPPIES COUNT:', puppies.length);
  fs.writeFileSync('src/data/puppiesCatalog.json', JSON.stringify(puppies, null, 2));
  console.log('Successfully saved src/data/puppiesCatalog.json!');
} catch (e) {
  console.error('Failed to parse:', e.message);
  fs.writeFileSync('temp_err.txt', unescaped);
}

