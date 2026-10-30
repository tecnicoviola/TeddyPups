const fs = require('fs');
const js = fs.readFileSync('reference/js/177ya708_1zuj.js', 'utf8');

const sIdx = js.indexOf('e.s(["u",0,"#f9b9a6"');
if (sIdx !== -1) {
  console.log(js.slice(sIdx, sIdx + 1500));
} else {
  console.log('Not found');
}

