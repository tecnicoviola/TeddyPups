const fs = require('fs');

const css = fs.readFileSync('src/styles/main.css', 'utf8');

function printRules(pattern) {
  let idx = 0;
  while ((idx = css.indexOf(pattern, idx)) !== -1) {
    console.log('--- FOUND ' + pattern + ' at ' + idx + ' ---');
    console.log(css.substring(Math.max(0, idx - 50), Math.min(css.length, idx + 250)));
    idx += pattern.length;
  }
}

printRules('.tp-gone-strip');
printRules('.tp-sketch--small');
printRules('.tp-sketch__sticker--home');
