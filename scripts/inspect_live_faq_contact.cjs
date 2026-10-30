const fs = require('fs');

console.log('--- INSPECTING FAQ PAGE ---');
const faqHtml = fs.readFileSync('reference/live_faq.html', 'utf8');
let idx = 0;
while ((idx = faqHtml.indexOf('pup-', idx)) !== -1) {
  console.log('FAQ PUP SNIPPET:', faqHtml.substring(Math.max(0, idx - 150), Math.min(faqHtml.length, idx + 400)));
  console.log('----------------------------------------------------');
  idx += 30;
  if (idx > 200000) break;
}

console.log('--- INSPECTING CONTACT PAGE ---');
const contactHtml = fs.readFileSync('reference/live_contact.html', 'utf8');
idx = 0;
while ((idx = contactHtml.indexOf('pup-', idx)) !== -1) {
  console.log('CONTACT PUP SNIPPET:', contactHtml.substring(Math.max(0, idx - 150), Math.min(contactHtml.length, idx + 400)));
  console.log('----------------------------------------------------');
  idx += 30;
  if (idx > 200000) break;
}

