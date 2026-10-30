const fs = require('fs');

console.log('Read base.css:');
console.log(fs.readFileSync('src/styles/base.css', 'utf8'));

