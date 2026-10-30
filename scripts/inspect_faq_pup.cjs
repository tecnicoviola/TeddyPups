const fs = require('fs');
const faqHtml = fs.readFileSync('reference/live_faq.html', 'utf8');
const idx = faqHtml.indexOf('Teddy, reading');
if (idx !== -1) {
  console.log(faqHtml.substring(idx - 400, idx + 1000));
} else {
  console.log('not found "Teddy, reading"');
}

