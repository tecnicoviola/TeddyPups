const fs = require('fs');
const content = fs.readFileSync('reference/js/1r-q3nrxl-xzq.js', 'utf8');
const idx = content.indexOf('Sealing the envelope');
console.log(content.substring(Math.max(0, idx - 4000), idx));

