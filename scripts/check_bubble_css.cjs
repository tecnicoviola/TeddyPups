const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');
const idx = css.indexOf('.pup-bubble');
if (idx !== -1) {
  console.log(css.substring(idx, idx + 400));
} else {
  console.log('pup-bubble not found');
}

