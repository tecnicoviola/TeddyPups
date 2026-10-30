const fs = require('fs');
const path = require('path');

function listFiles(dir, filter) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        res = res.concat(listFiles(full, filter));
      }
    } else if (!filter || filter.test(item)) {
      res.push(full);
    }
  }
  return res;
}

console.log('Videos:', listFiles('.', /\.(mp4|webm)$/i));
console.log('Screenshots/Images in reference:', listFiles('reference', /\.(png|jpg|jpeg|webp|avif)$/i).slice(0, 20));

