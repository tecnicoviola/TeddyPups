const fs = require('fs');
const puppHtml = fs.readFileSync('reference/pages/puppies.html', 'utf8');

const sidx = puppHtml.indexOf('tp-sketches');
if (sidx !== -1) {
  console.log(puppHtml.slice(sidx, sidx + 3500));
} else {
  console.log('tp-sketches not found');
}

