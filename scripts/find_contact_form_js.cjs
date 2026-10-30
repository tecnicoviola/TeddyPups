const fs = require('fs');

const jsFiles = fs.readdirSync('reference/js').filter(f => f.endsWith('.js'));
for (const f of jsFiles) {
  const content = fs.readFileSync('reference/js/' + f, 'utf8');
  if (content.includes('Sealing the envelope') || content.includes('Please check the highlighted') || content.includes('Message received')) {
    console.log('Found contact form in', f);
    const idx = content.indexOf('Sealing the envelope');
    console.log(content.substring(Math.max(0, idx - 1500), Math.min(content.length, idx + 2500)));
  }
}

