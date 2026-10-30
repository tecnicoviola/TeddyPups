const fs = require('fs');

function searchFiles(files, term) {
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, 'utf8');
    let idx = 0;
    while ((idx = content.indexOf(term, idx)) !== -1) {
      console.log(`[${f}] Found "${term}" at ${idx}:`);
      console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 400)));
      console.log('====================================');
      idx += term.length;
    }
  }
}

searchFiles([
  'reference/css/10jf32vdx50lp.css',
  'reference/css/2gh-2btcjgkih.css'
], 'tp-viewer');

