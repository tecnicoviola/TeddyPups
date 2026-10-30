const http = require('http');

function fetchPath(port, path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ port, status: res.statusCode, length: data.length, title: data.includes('title') });
      });
    }).on('error', (err) => resolve({ port, error: err.message }));
  });
}

async function run() {
  console.log('3000:', await fetchPath(3000, '/faq'));
  console.log('3001:', await fetchPath(3001, '/faq'));
}

run();

