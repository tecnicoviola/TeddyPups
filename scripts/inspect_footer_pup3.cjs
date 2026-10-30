const fs = require('fs');
const html = fs.readFileSync('reference/footer_full.html', 'utf8');
const idx = html.indexOf('tp-basket__pup');
console.log(html.substring(idx + 3500, idx + 8000));

