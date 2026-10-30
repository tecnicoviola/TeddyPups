const fs = require('fs');

function search(file, keywords) {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  for (const kw of keywords) {
    let idx = 0;
    while ((idx = content.indexOf(kw, idx)) !== -1) {
      console.log(`[${file}] Found "${kw}" at ${idx}:`);
      console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 200)));
      console.log('-----------------------------');
      idx += kw.length;
    }
  }
}

// Check paw canvas in src
search('src/components/PawTrailCanvas.tsx', ['cursor', 'paw', 'svg', 'trail', 'hover', 'black', 'square', 'white']);

