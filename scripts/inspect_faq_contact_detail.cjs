const fs = require('fs');

console.log('=== FAQ ASIDE PUP ===');
const faqHtml = fs.readFileSync('reference/live_faq.html', 'utf8');
const faqAsideIdx = faqHtml.indexOf('tp-notes__aside');
if (faqAsideIdx !== -1) {
  console.log(faqHtml.substring(faqAsideIdx - 50, faqAsideIdx + 2000));
}

console.log('\n=== CONTACT PUP ===');
const contactHtml = fs.readFileSync('reference/live_contact.html', 'utf8');
// Find pup in contact
const contactIdx = contactHtml.indexOf('class="pup-buddy');
if (contactIdx !== -1) {
  console.log(contactHtml.substring(contactIdx - 300, contactIdx + 1500));
}

