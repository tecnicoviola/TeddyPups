const http = require('http');

const urls = [
  'http://localhost:3000/_next/image?url=%2Fmedia%2FmihUKGFCatU3%2F0461cca56e%2F27b888_bac41adfadc44dce846a1c3fd0cdb0de-mv2.avif&w=3840&q=75',
  'http://localhost:3000/_next/image?url=%2Fmedia%2FQgFG5s09n-ss%2F81af626d2d%2F27b888_5f9a7189bb21477d832047aae2040921-mv2.avif&w=3840&q=75',
  'http://localhost:3000/_next/image?url=%2Fmedia%2F4vu6_PGfL64H%2F537c367d85%2F27b888_747a4667fec640c69aad9bc045d61ac6-mv2.avif&w=3840&q=75',
  'http://localhost:3000/_next/image?url=%2Fmedia%2F159oT4F46uhk%2Fb66c2be87f%2F27b888_ea6e7e0fcd43447d854657b6de98d4cb-mv2.avif&w=3840&q=75',
  'http://localhost:3000/_next/image?url=%2Fmedia%2FbMSEHnYcBTFF%2F970fdc1ee6%2F27b888_5e612a215bf343328c08d99e0e9c5a37-mv2.avif&w=3840&q=75'
];

async function checkAll() {
  for (let i = 0; i < urls.length; i++) {
    await new Promise(resolve => {
      http.get(urls[i], res => {
        let len = 0;
        res.on('data', chunk => len += chunk.length);
        res.on('end', () => {
          console.log(`Puppy ${i+1}: status=${res.statusCode}, bytes=${len}`);
          resolve();
        });
      }).on('error', err => {
        console.error(`Puppy ${i+1} err:`, err.message);
        resolve();
      });
    });
  }
}

checkAll();
