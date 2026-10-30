const fs = require('fs');

const jsFiles = fs.readdirSync('reference/js').filter(f => f.endsWith('.js'));
for (const f of jsFiles) {
  const content = fs.readFileSync('reference/js/' + f, 'utf8');
  if (content.includes('Teddy, admiring the wall') || content.includes('tp-memories__foot') || content.includes('admiring')) {
    console.log('Found admiring the wall in', f);
    const idx = content.indexOf('Teddy, admiring the wall');
    console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 1000)));
  }
}

