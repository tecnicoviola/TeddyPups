const fs = require('fs');

const p1 = 'public/cursor/paw.png';
const p2 = 'public/cursor/paw-press.png';

console.log('paw.png size:', fs.statSync(p1).size);
console.log('paw-press.png size:', fs.statSync(p2).size);

