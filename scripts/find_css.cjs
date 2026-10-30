const fs = require('fs');
const glob = (dir) => {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = dir + '/' + item.name;
    if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git')) {
      res = res.concat(glob(full));
    } else if (item.isFile() && item.name.endsWith('.css')) {
      res.push(full);
    }
  }
  return res;
};
const cssFiles = glob('.');
console.log('CSS files:', cssFiles);
for (const f of cssFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('tp-basket') || content.includes('tp-breathe')) {
    console.log(f, 'has basket/breathe');
  }
}

