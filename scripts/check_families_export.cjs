const fs = require('fs');

const code = fs.readFileSync('src/pages/HappyFamiliesPage.tsx', 'utf8');

// Find export const HappyFamiliesPage
const exportIdx = code.indexOf('export const HappyFamiliesPage');
console.log(code.substring(exportIdx));

