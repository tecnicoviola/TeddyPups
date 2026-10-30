const fs = require('fs');
const path = require('path');

function searchImages(dir) {
  let list = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        list = list.concat(searchImages(full));
      }
    } else if (/(cursor|paw|hover)/i.test(f) && /\.(png|jpg|webp)$/i.test(f)) {
      list.push(full);
    }
  }
  return list;
}

console.log('Paw / cursor images on disk:', searchImages('.'));

