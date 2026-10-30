const fs = require('fs');

function searchCode(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = dir + '/' + f;
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !f.startsWith('.') && f !== 'node_modules') {
      searchCode(full);
    } else if (/\.(tsx|ts|js|jsx)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('data-reveal')) {
        console.log('Found in:', full);
      }
    }
  }
}

searchCode('src');

