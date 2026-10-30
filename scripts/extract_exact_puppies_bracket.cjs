const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

const sIdx = html.indexOf('"puppies":[');
console.log('sIdx:', sIdx);
if (sIdx !== -1) {
  // Let's find matching bracket for array
  let depth = 0;
  let endIdx = -1;
  const start = sIdx + '"puppies":'.length;
  for (let i = start; i < html.length; i++) {
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
  if (endIdx !== -1) {
    const rawArrayStr = html.slice(start, endIdx);
    // Unescape if needed
    let parsed;
    try {
      parsed = JSON.parse(rawArrayStr);
    } catch (e) {
      // It might be inside a string like \"puppies\":[...]
      const unescaped = rawArrayStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      parsed = JSON.parse(unescaped);
    }
    console.log('Parsed puppies count:', parsed.length);
    fs.writeFileSync('src/data/puppiesCatalog.json', JSON.stringify(parsed, null, 2));
    console.log('Saved to src/data/puppiesCatalog.json');
  }
}

