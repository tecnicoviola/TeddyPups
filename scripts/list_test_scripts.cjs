const fs = require('fs');

const files = fs.readdirSync('scripts');
console.log('Scripts:', files.filter(f => f.includes('test') || f.includes('cdp') || f.includes('chrome')));

