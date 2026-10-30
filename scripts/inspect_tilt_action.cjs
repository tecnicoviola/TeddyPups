const fs = require('fs');
const content = fs.readFileSync('reference/js/177ya708_1zuj.js', 'utf8');
const idx = content.indexOf('tilt:({d:');
console.log(content.substring(Math.max(0, idx - 1000), Math.min(content.length, idx + 2500)));

