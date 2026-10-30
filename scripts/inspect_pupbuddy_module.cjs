const fs = require('fs');
const content = fs.readFileSync('reference/js/177ya708_1zuj.js', 'utf8');
const idx = content.indexOf('PupBuddy');
console.log(content.substring(idx - 100, idx + 3500));

