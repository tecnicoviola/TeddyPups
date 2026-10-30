const fs = require('fs');

const jsFiles = fs.readdirSync('reference/js').filter(f => f.endsWith('.js'));
for (const f of jsFiles) {
  const content = fs.readFileSync('reference/js/' + f, 'utf8');
  if (content.includes('Teddy Pup once') || content.includes('memories__foot')) {
    console.log('Found in', f);
    const idx = content.indexOf('Teddy Pup once');
    console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 1000)));
  }
}

