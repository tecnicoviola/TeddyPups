const fs = require('fs');

// Check puppies.html in reference
const puppHtml = fs.readFileSync('reference/mains/puppies.html', 'utf8');

// Look for paw icon or button inside card
const m = puppHtml.match(/<button[\s\S]*?<\/button>/gi) || [];
console.log('Buttons found:', m.length);
m.forEach((b, i) => {
  if (i < 5) console.log(`Button ${i}:`, b.substring(0, 300));
});

// Also look for svg or icons inside puppy links / cards
const linkMatches = puppHtml.match(/<a[^>]*href="\/puppies\/[^"]*"[\s\S]*?<\/a>/gi) || [];
console.log('Puppy links found:', linkMatches.length);
if (linkMatches[0]) {
  console.log('Sample Puppy Link / Card:');
  console.log(linkMatches[0]);
}

// Check CSS classes related to card buttons or paw
const cssFiles = fs.readdirSync('reference/css');
for (const f of cssFiles) {
  const css = fs.readFileSync('reference/css/' + f, 'utf8');
  ['tp-card', 'tp-kennel', 'tp-door', 'paw', 'action'].forEach(term => {
    let idx = 0;
    while ((idx = css.indexOf(term, idx)) !== -1) {
      console.log(`[${f}] Term '${term}':`, css.substring(Math.max(0, idx - 40), Math.min(css.length, idx + 120)));
      idx += term.length + 50;
    }
  });
}
