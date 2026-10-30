const fs = require('fs');
const files = fs.readdirSync('d:/');
console.log('Files in D: matching pup:', files.filter(f => f.toLowerCase().includes('pup')));

