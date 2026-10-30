const fs = require('fs');

const code = fs.readFileSync('src/pages/HappyFamiliesPage.tsx', 'utf8');
console.log(code.substring(code.length - 1500));
