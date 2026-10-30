const fs = require('fs');

function searchAll(dir, term) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = dir + '/' + item.name;
    if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git')) {
      searchAll(full, term);
    } else if (item.isFile()) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(term)) {
        console.log(`Found "${term}" in ${full}`);
        const idx = content.indexOf(term);
        console.log(content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 400)));
      }
    }
  }
}

searchAll('reference', 'Please check the highlighted');

