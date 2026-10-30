const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');
const lines = css.split('\n');
lines.forEach((line, i) => {
  if (line.includes('tp-basket') || line.includes('tp-breathe') || line.includes('tp-blink')) {
    console.log(`${i+1}: ${line}`);
  }
});

