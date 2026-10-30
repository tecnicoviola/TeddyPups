const fs = require('fs');
const html = fs.readFileSync('reference/mains/puppies.html', 'utf8');
const idx = html.indexOf('tp-gone-strip');
console.log('Index:', idx);
console.log('--- Context before: ---');
console.log(html.substring(Math.max(0, idx - 400), idx));
console.log('--- Context after strip ends: ---');
const endIdx = html.indexOf('</section>', idx);
console.log(html.substring(endIdx, endIdx + 500));

