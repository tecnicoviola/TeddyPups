const fs = require('fs');

const code = fs.readFileSync('src/pages/HappyFamiliesPage.tsx', 'utf8');

// Match each <button class="tp-wall__print" ...> ... </button>
const btnRegex = /<button[^>]*class="[^"]*tp-wall__print[^"]*"[^>]*>([\s\S]*?)<\/button>/g;
let match;
const photos = [];
let idx = 0;
while ((match = btnRegex.exec(code)) !== null) {
  const inner = match[1];
  const srcMatch = inner.match(/src="([^"]+)"/);
  const altMatch = inner.match(/alt="([^"]*)"/);
  const captionMatch = inner.match(/class="tp-polaroid__caption[^"]*">([^<]+)<\/span>/);
  photos.push({
    id: `photo-${idx}`,
    index: idx,
    src: srcMatch ? srcMatch[1] : '',
    alt: altMatch ? altMatch[1] : 'TeddyPups happy family',
    caption: captionMatch ? captionMatch[1] : ''
  });
  idx++;
}

console.log('Extracted photos:', photos.length);
console.log('First 3 photos:', photos.slice(0, 3));
console.log('Sample with caption (if any):', photos.filter(p => p.caption));
fs.writeFileSync('src/data/happyFamiliesPhotos.json', JSON.stringify(photos, null, 2));
console.log('Saved to src/data/happyFamiliesPhotos.json');

