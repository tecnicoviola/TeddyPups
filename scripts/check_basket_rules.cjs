const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');

const regex = /([^{}]*tp-basket[^{}]*\{[^{}]*\})/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log(match[0]);
}

const regex2 = /([^{}]*tp-breathe[^{}]*\{[^{}]*\})/g;
while ((match = regex2.exec(css)) !== null) {
  console.log(match[0]);
}

