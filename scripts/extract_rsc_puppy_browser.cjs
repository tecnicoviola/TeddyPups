const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

// Find all push scripts
const scriptMatches = html.match(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g) || [];

let fullRSC = '';
for (const s of scriptMatches) {
  // extract the string content
  const m = s.match(/self\.__next_f\.push\(\[1,"([\s\S]*)"\]\)/);
  if (m) {
    try {
      const decoded = JSON.parse('"' + m[1] + '"');
      fullRSC += decoded;
    } catch (e) {
      // unescape basic
      fullRSC += m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n');
    }
  }
}

const idx50 = fullRSC.indexOf('50:["$","$Lc6",null,{');
if (idx50 !== -1) {
  console.log('Found 50:');
  const snippet = fullRSC.slice(idx50);
  // find end of JSON or closing bracket
  // let's save snippet to a file to inspect
  fs.writeFileSync('reference/data/puppy_browser_props_raw.txt', snippet.slice(0, 50000));
  console.log('Saved 50KB of props to reference/data/puppy_browser_props_raw.txt');
} else {
  console.log('Not found in fullRSC');
}

