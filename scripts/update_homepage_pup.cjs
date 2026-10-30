const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Find pup-probe
let idx = code.indexOf('<div aria-hidden=\\"true\\" class=\\"pup-probe\\">');
if (idx !== -1) {
  let endQuote = code.indexOf('";', idx);
  console.log('Replacing from', idx, 'to', endQuote);
  code = code.substring(0, idx) + '";' + code.substring(endQuote + 2);
}

// Add PupJourney import
if (!code.includes('PupJourney')) {
  code = code.replace(
    "import { HeroStage } from '../components/HeroStage';",
    "import { HeroStage } from '../components/HeroStage';\nimport { PupJourney } from '../components/pup/PupJourney';"
  );
  code = code.replace(
    '<div dangerouslySetInnerHTML={{ __html: REST_OF_PAGE_HTML }} />',
    '<div dangerouslySetInnerHTML={{ __html: REST_OF_PAGE_HTML }} />\n          <PupJourney />'
  );
}

fs.writeFileSync('src/pages/HomePage.tsx', code, 'utf8');
console.log('HomePage.tsx updated successfully');

