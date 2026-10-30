const fs = require('fs');
const path = require('path');

const jsDir = 'reference/js';
for (const f of fs.readdirSync(jsDir)) {
  if (!f.endsWith('.js')) continue;
  const full = path.join(jsDir, f);
  const content = fs.readFileSync(full, 'utf8');
  if (content.includes('Previous') || content.includes('tp-viewer') || content.includes('dialog') || content.includes('lightbox')) {
    console.log('Found match in:', f);
    ['Previous', 'tp-viewer', 'lightbox'].forEach(term => {
      let idx = 0;
      while ((idx = content.indexOf(term, idx)) !== -1) {
        console.log(`  [${term}] at ${idx}:`);
        console.log('  ' + content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 250)).replace(/\s+/g, ' '));
        idx += term.length;
      }
    });
  }
}

