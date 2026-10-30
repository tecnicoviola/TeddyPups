const fs = require('fs');

const css = fs.readFileSync('reference/css/10jf32vdx50lp.css', 'utf8');

let idx = 0;
while ((idx = css.indexOf('cursor:', idx)) !== -1) {
  console.log('--- FOUND cursor: at ' + idx + ' ---');
  console.log(css.substring(Math.max(0, idx - 40), Math.min(css.length, idx + 150)));
  idx += 7;
}

