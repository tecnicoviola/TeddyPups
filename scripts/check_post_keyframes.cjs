const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css', 'utf8');

const keyframes = ['tp-letter-fold', 'tp-env-in', 'tp-flap', 'tp-env-post', 'tp-box-up', 'tp-flag', 'tp-sent-in'];
for (const k of keyframes) {
  console.log(k, css.includes('@keyframes ' + k));
}

