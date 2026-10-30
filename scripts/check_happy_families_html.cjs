const fs = require('fs');

const html = fs.readFileSync('reference/mains/happy-families.html', 'utf8');

// Look for gallery items or polaroids
console.log('happy-families.html length:', html.length);
const polaroidIdx = html.indexOf('tp-polaroid');
console.log('tp-polaroid at:', polaroidIdx);
if (polaroidIdx !== -1) {
  console.log(html.substring(polaroidIdx - 100, polaroidIdx + 300));
}

