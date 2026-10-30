const fs = require('fs');
const html = fs.readFileSync('reference/live_how_it_works.html', 'utf8');

const matches = [];
let idx = 0;
while ((idx = html.indexOf('basket', idx)) !== -1) {
  matches.push(html.substring(Math.max(0, idx - 80), Math.min(html.length, idx + 120)));
  idx += 6;
  if (matches.length > 15) break;
}
console.log('Matches for "basket":', matches);

