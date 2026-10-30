const fs = require('fs');
if (fs.existsSync('reference/pup7_frames')) {
  console.log(fs.readdirSync('reference/pup7_frames'));
} else {
  console.log('pup7_frames does not exist');
}

