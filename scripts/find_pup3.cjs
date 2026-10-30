const fs = require('fs');

console.log('d:\\ files:', fs.readdirSync('d:\\').filter(f => /\.(png|jpg|mp4)$/i.test(f)));
