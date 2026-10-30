const fs = require('fs');
const js = fs.readFileSync('reference/js/177ya708_1zuj.js', 'utf8');

const dIdx = js.indexOf('function d({className:e=""})');
console.log(js.slice(dIdx, dIdx + 2000));

