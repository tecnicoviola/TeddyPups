const fs = require('fs');

const code = fs.readFileSync('src/pages/HappyFamiliesPage.tsx', 'utf8');

// Count how many tp-wall__print or img tags there are
const printButtons = code.match(/<button[^>]*class="[^"]*tp-wall__print[^"]*"[^>]*>/g);
console.log('tp-wall__print buttons:', printButtons ? printButtons.length : 0);

// Extract the first 3 images
const imgMatches = code.match(/<img[^>]+>/g);
console.log('Total img tags:', imgMatches ? imgMatches.length : 0);
if (imgMatches) {
  imgMatches.slice(0, 3).forEach((img, i) => console.log(`Img ${i + 1}:`, img.substring(0, 200)));
}

