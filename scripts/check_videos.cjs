const fs = require('fs');
console.log('pup7.mp4 exists?', fs.existsSync('d:/pup7.mp4') || fs.existsSync('pup7.mp4'));
console.log('pup7(1).mp4 exists?', fs.existsSync('d:/pup7(1).mp4') || fs.existsSync('pup7(1).mp4'));

