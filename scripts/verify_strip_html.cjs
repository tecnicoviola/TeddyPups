const fs = require('fs');

const html = fs.readFileSync('reference/data/already_gone_home_strip_clean.html', 'utf8');

console.log('HTML starts with:', html.substring(0, 150));
console.log('HTML ends with:', html.substring(html.length - 150));
console.log('Total length:', html.length);

