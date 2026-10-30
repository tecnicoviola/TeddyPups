const fs = require('fs');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
console.log('App.tsx:\n', appTsx);

