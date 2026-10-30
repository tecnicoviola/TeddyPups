const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

let pos = 0;
while ((pos = html.indexOf('$Lc6', pos)) !== -1) {
  console.log(html.slice(pos - 50, pos + 400));
  pos += 5;
}

