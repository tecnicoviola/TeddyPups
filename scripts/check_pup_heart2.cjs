const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');
const idx = css.indexOf('.pup-heart');
console.log(css.substring(idx, idx + 400));

