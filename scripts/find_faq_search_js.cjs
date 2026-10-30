const fs = require('fs');

const jsFiles = fs.readdirSync('reference/js').filter(f => f.endsWith('.js'));
for (const f of jsFiles) {
  const content = fs.readFileSync('reference/js/' + f, 'utf8');
  if (content.includes('tp-notes__search') || content.includes('sniff out a question')) {
    console.log('Found FAQ search in', f);
    const idx = content.indexOf('tp-notes__search');
    console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 2500)));
  }
}

