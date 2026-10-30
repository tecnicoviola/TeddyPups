const fs = require('fs');
const txt = fs.readFileSync('reference/data/puppy_browser_props_raw.txt', 'utf8');

const bIdx = txt.indexOf('"breeds":');
if (bIdx !== -1) {
  console.log(txt.slice(bIdx, bIdx + 800));
} else {
  console.log('breeds not found');
}

