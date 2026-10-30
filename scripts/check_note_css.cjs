const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');

const regex = /([^{}]*tp-note[^{}]*\{[^{}]*\})/g;
let match;
while ((match = regex.exec(css)) !== null) {
  console.log(match[0]);
}

