const fs = require('fs');
const https = require('https');

function fetchPage(url, outPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(outPath, data, 'utf8');
        console.log(`Saved ${outPath} (${data.length} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  await fetchPage('https://puppy.instabizweb.com/faq', 'reference/live_faq.html');
  await fetchPage('https://puppy.instabizweb.com/contact', 'reference/live_contact.html');
}

run();

