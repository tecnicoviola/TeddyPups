const fs = require('fs');

const jsFiles = fs.readdirSync('reference/js').filter(f => f.endsWith('.js'));
for (const f of jsFiles) {
  const content = fs.readFileSync('reference/js/' + f, 'utf8');
  if (content.includes('Please check the highlighted fields') || content.includes('Please tell us your name') || content.includes('phone')) {
    const idx = content.indexOf('Please check the highlighted fields');
    if (idx !== -1) {
      console.log('Found validation in', f);
      console.log(content.substring(Math.max(0, idx - 500), Math.min(content.length, idx + 1500)));
    }
  }
}

