const fs = require('fs');
const files = ['src/index.css', 'src/App.css', 'src/styles/globals.css'];
for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    console.log(f, 'tp-basket?', content.includes('tp-basket'), 'tp-breathe?', content.includes('tp-breathe'));
  }
}

