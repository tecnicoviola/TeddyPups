const fs = require('fs');
const puppHtml = fs.readFileSync('reference/pages/puppies.html', 'utf8');
const idx = puppHtml.indexOf('size-4');
if (idx !== -1) {
  console.log(puppHtml.slice(idx - 200, idx + 400));
} else {
  console.log('size-4 not found');
}

