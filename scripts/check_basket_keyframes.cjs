const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');

const names = ['tp-breathe', 'tp-blink', 'tp-ear-twitch'];
names.forEach(name => {
  const idx = css.indexOf('@keyframes ' + name);
  if (idx !== -1) {
    console.log(css.substring(idx, idx + 400));
  }
});

