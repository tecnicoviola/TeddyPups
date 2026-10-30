const fs = require('fs');

const html = fs.readFileSync('reference/live_happy_families.html', 'utf8');
let idx = 0;
while ((idx = html.indexOf('pup-', idx)) !== -1) {
  console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 350)));
  console.log('---');
  idx += 30;
}

