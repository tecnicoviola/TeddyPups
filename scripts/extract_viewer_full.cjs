const fs = require('fs');

const content = fs.readFileSync('reference/js/37w5q0adtoy9q.js', 'utf8');

const prevIdx = content.indexOf('Previous');
// Let's find where this component function starts
const start = content.lastIndexOf('function', prevIdx - 1500);
const end = content.indexOf('82391', prevIdx);

console.log('Component code from', start, 'to', end);
const code = content.substring(start, end);
fs.writeFileSync('reference/data/viewer_full_component.js', code);
console.log('Length:', code.length);

