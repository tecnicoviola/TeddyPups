const fs = require('fs');

function searchKeyword(dir, kw) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = dir + '/' + f;
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.chrome_data') searchKeyword(full, kw);
    } else {
      if (f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.json') || f.endsWith('.txt')) {
        const s = fs.readFileSync(full, 'utf8');
        if (s.includes(kw)) {
          console.log(`Match for "${kw}" in: ${full}`);
        }
      }
    }
  }
}

searchKeyword('reference', 'Already gone home');
searchKeyword('reference', 'gone home ♥');
searchKeyword('reference', 'These puppies have found their families');
searchKeyword('reference', 'gone-home');

