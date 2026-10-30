const fs = require('fs');
const path = require('path');

const files = [
  '27b888_bac41adfadc44dce846a1c3fd0cdb0de-mv2',
  '27b888_5f9a7189bb21477d832047aae2040921-mv2',
  '27b888_747a4667fec640c69aad9bc045d61ac6-mv2',
  '27b888_ea6e7e0fcd43447d854657b6de98d4cb-mv2',
  '27b888_5e612a215bf343328c08d99e0e9c5a37-mv2'
];

function findInDir(dir, pattern) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findInDir(full, pattern));
    } else if (item.includes(pattern)) {
      results.push(full);
    }
  }
  return results;
}

for (const f of files) {
  const found = findInDir('public', f);
  const foundRef = findInDir('reference', f);
  console.log(f, 'in public:', found, 'in ref:', foundRef);
}

