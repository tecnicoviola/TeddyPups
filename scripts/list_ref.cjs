const fs = require('fs');
const path = require('path');

function walk(dir) {
  let list = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'assets') {
        list = list.concat(walk(full));
      } else {
        list.push(full + ' (assets folder)');
      }
    } else {
      list.push(full);
    }
  }
  return list;
}

console.log('Reference contents:\n', walk('reference'));

