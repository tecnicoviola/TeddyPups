const fs = require('fs');
const puppHtml = fs.readFileSync('reference/pages/puppies.html', 'utf8');

const re = /<g class="tp-sketch__doodle">[\s\S]*?<\/g>/g;
let m;
let count = 0;
while ((m = re.exec(puppHtml)) !== null && count < 10) {
  console.log('DOODLE ' + count + ':', m[0]);
  count++;
}

