const fs = require('fs');

const code = fs.readFileSync('src/components/PawTrailCanvas.tsx', 'utf8');
const zIdx = code.indexOf('z-');
if (zIdx !== -1) {
  console.log(code.substring(zIdx - 20, zIdx + 50));
} else {
  console.log(code.substring(code.indexOf('className'), code.indexOf('className') + 80));
}

