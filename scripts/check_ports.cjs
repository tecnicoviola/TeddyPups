const http = require('http');

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      console.log(`Port ${port} responds with status: ${res.statusCode}`);
      resolve(true);
    });
    req.on('error', () => {
      console.log(`Port ${port} is NOT responding.`);
      resolve(false);
    });
  });
}

async function run() {
  await checkPort(3000);
  await checkPort(3001);
  await checkPort(5173);
}

run();

