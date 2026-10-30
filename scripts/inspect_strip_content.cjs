const fs = require('fs');
const html = fs.readFileSync('reference/mains/puppies.html', 'utf8');
const start = html.indexOf('<section aria-labelledby="gone-title" class="tp-gone-strip">');
const end = html.indexOf('</section>', start) + '</section>'.length;
const stripHtml = html.substring(start, end);

console.log('Total length:', stripHtml.length);
fs.writeFileSync('reference/data/already_gone_home_strip_clean.html', stripHtml);

// Extract all img src
const imgRegex = /src="([^"]+)"/g;
let match;
const srcs = [];
while ((match = imgRegex.exec(stripHtml)) !== null) {
  srcs.push(match[1]);
}
console.log('Images found:', srcs);

// Extract all links
const hrefRegex = /href="([^"]+)"/g;
const hrefs = [];
while ((match = hrefRegex.exec(stripHtml)) !== null) {
  hrefs.push(match[1]);
}
console.log('Links found:', hrefs);

