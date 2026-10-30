const fs = require('fs');

const fullHtml = fs.readFileSync('reference/data/already_gone_home_strip_clean.html', 'utf8');

const prefix = '<section aria-labelledby="gone-title" class="tp-gone-strip">';
const suffix = '</section>';

if (!fullHtml.startsWith(prefix) || !fullHtml.endsWith(suffix)) {
  console.error('Mismatch in prefix/suffix!');
  process.exit(1);
}

const innerHtml = fullHtml.substring(prefix.length, fullHtml.length - suffix.length);

const data = {
  innerHtml: innerHtml
};

fs.writeFileSync('src/data/alreadyGoneHomeHtml.json', JSON.stringify(data, null, 2));
console.log('Successfully written src/data/alreadyGoneHomeHtml.json with innerHtml length:', innerHtml.length);

