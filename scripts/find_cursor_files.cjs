const fs = require('fs');
const path = require('path');

function searchAll(dir, name) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      res = res.concat(searchAll(full, name));
    } else if (item.toLowerCase().includes(name.toLowerCase())) {
      res.push(full);
    }
  }
  return res;
}

console.log('Cursor files in reference:', searchAll('reference', 'cursor'));
console.log('Cursor files in public:', searchAll('public', 'cursor'));

