const fs = require('fs');
const path = require('path');

function searchAll(dir, term) {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'dist' && !item.startsWith('.')) {
        results = results.concat(searchAll(full, term));
      }
    } else if (/\.(tsx|ts|css|html|js)$/.test(item)) {
      const content = fs.readFileSync(full, 'utf8');
      let idx = 0;
      while ((idx = content.indexOf(term, idx)) !== -1) {
        results.push({
          file: full,
          line: content.substring(0, idx).split('\n').length,
          context: content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 120))
        });
        idx += term.length;
      }
    }
  }
  return results;
}

console.log('Search for "cursor" in src:');
const matches = searchAll('src', 'cursor:');
matches.forEach(m => console.log(`${m.file}:${m.line} -> ${m.context.replace(/\s+/g, ' ')}`));

