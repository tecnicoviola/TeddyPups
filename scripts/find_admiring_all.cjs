const fs = require('fs');

function searchAll(dir, term) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = dir + '/' + item.name;
    if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git')) {
      searchAll(full, term);
    } else if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.html') || item.name.endsWith('.txt'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(term)) {
        console.log(`Found "${term}" in ${full}`);
        const idx = content.indexOf(term);
        console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 300)));
        console.log('---');
      }
    }
  }
}

searchAll('reference', 'admiring the wall');

