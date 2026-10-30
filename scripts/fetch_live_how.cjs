const https = require('https');
const fs = require('fs');

https.get('https://puppy.instabizweb.com/how-it-works', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('reference/live_how_it_works.html', data, 'utf8');
    const ids = Array.from(data.matchAll(/id=["']([^"']+)["']/g)).map(m => m[1]);
    console.log('IDs on live page:', ids);
    const scripts = Array.from(data.matchAll(/src=["']([^"']+\.js)["']/g)).map(m => m[1]);
    console.log('Scripts:', scripts);
  });
});

