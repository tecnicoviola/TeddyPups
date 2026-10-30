const http = require('http');

http.get('http://localhost:3000/puppies', (res) => {
  console.log('Puppies page status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response length:', data.length);
  });
}).on('error', err => {
  console.error('Failed to reach dev server:', err.message);
});

