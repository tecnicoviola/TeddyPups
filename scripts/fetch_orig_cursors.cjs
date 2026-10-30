const https = require('https');
const fs = require('fs');

function fetchUrl(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(url, 'status:', res.statusCode, 'content-type:', res.headers['content-type']);
      if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          fs.writeFileSync(dest, buf);
          console.log('Saved to', dest, 'bytes:', buf.length);
          if (dest.endsWith('.svg')) {
            console.log('Content preview:\n', buf.toString('utf8').substring(0, 300));
          }
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', (e) => {
      console.log(url, 'error:', e.message);
      resolve(false);
    });
  });
}

async function run() {
  await fetchUrl('https://puppy.instabizweb.com/cursor/paw.svg', 'reference/assets/paw_orig.svg');
  await fetchUrl('https://puppy.instabizweb.com/cursor/paw-press.svg', 'reference/assets/paw_press_orig.svg');
}

run();

