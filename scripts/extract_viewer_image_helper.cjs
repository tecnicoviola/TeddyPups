const fs = require('fs');

const content = fs.readFileSync('reference/js/37w5q0adtoy9q.js', 'utf8');

// Search between start of module and usePhotoViewer
const viewerIdx = content.indexOf('Photo viewer');
console.log('--- BEFORE PHOTO VIEWER ---');
console.log(content.substring(Math.max(0, viewerIdx - 1800), viewerIdx));

