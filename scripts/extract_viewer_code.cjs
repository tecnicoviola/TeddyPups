const fs = require('fs');

const content = fs.readFileSync('reference/js/37w5q0adtoy9q.js', 'utf8');

// Find the module around index 4216 or tp-viewer
const start = Math.max(0, content.indexOf('tp-viewer') - 2000);
const end = Math.min(content.length, content.indexOf('Previous') + 2000);

console.log('Snippet length:', end - start);
fs.writeFileSync('reference/data/viewer_snippet.js', content.substring(start, end));

// Let's also print around "Previous"
const prevIdx = content.indexOf('Previous');
console.log('--- AROUND PREVIOUS ---');
console.log(content.substring(prevIdx - 600, prevIdx + 800));

