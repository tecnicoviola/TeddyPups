const fs = require('fs');

const css = fs.readFileSync('src/styles/main.css', 'utf8');

let idx = 0;
while ((idx = css.indexOf('[data-reveal', idx)) !== -1) {
  console.log('--- FOUND [data-reveal at ' + idx + ' ---');
  console.log(css.substring(Math.max(0, idx - 50), Math.min(css.length, idx + 200)));
  idx += 12;
}

