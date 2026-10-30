const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');
console.log('pup-heart exists?', css.includes('pup-heart'));

