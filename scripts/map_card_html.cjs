const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

// Find all <li> in tp-sketches
const startIdx = html.indexOf('<ul class="tp-sketches mt-20">');
const endIdx = html.indexOf('</ul>', startIdx);
const listHtml = html.slice(startIdx + '<ul class="tp-sketches mt-20">'.length, endIdx);

// split by <li
const rawLis = listHtml.split('<li>').slice(1).map(s => {
  const cEnd = s.lastIndexOf('</li>');
  return s.slice(0, cEnd !== -1 ? cEnd : undefined).trim();
});

console.log('Total raw LI elements:', rawLis.length);

const map = {};
for (const li of rawLis) {
  const mHref = li.match(/href="\/puppies\/([^"]+)"/);
  if (mHref) {
    const slug = mHref[1];
    map[slug] = li;
  }
}

fs.writeFileSync('src/data/puppiesCardHtmlMap.json', JSON.stringify(map, null, 2));
console.log('Saved card HTML map with keys:', Object.keys(map));

