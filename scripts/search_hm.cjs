const fs = require('fs');

function searchInDir(dir, pattern) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = dir + '/' + item.name;
    if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git') && !item.name.includes('pup')) {
      searchInDir(full, pattern);
    } else if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.ts') || item.name.endsWith('.tsx') || item.name.endsWith('.html'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(pattern)) {
        console.log(`Found "${pattern}" in ${full}`);
        let idx = content.indexOf(pattern);
        console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 200)));
        console.log('---');
      }
    }
  }
}

searchInDir('reference', 'hm?');
searchInDir('src', 'hm?');

