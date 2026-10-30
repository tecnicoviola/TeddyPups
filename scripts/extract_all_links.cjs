const fs = require('fs');

const links = new Set();
const pages = fs.readdirSync('reference/pages').filter(f => f.endsWith('.html'));

for (const p of pages) {
  const content = fs.readFileSync('reference/pages/' + p, 'utf8');
  const matches = content.match(/href="[^"]+"/g) || [];
  for (const m of matches) {
    const href = m.slice(6, -1);
    if (href.startsWith('/') && !href.startsWith('/_next') && !href.startsWith('/media')) {
      links.add(href);
    }
  }
}

console.log('Internal links (' + links.size + '):');
for (const l of [...links].sort()) {
  console.log(' - ' + l);
}

