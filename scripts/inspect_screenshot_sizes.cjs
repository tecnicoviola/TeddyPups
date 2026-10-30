const fs = require('fs');

const dir = 'reference/screenshots';
for (const f of fs.readdirSync(dir)) {
  if (/\.(png|jpg)$/.test(f)) {
    const s = fs.statSync(dir + '/' + f);
    console.log(f, s.size);
  }
}

