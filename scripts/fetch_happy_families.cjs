const fs = require('fs');
const https = require('https');

https.get('https://puppy.instabizweb.com/happy-families', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('reference/live_happy_families.html', data, 'utf8');
    console.log(`Saved reference/live_happy_families.html (${data.length} bytes)`);
  });
}).on('error', err => console.error(err));

