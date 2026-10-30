const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

// Find all occurrences of "puppies":[{...}] in puppies.html
const m = html.match(/"puppies":\[\{[\s\S]*?\}\],"breeds":/);
if (m) {
  const jsonStr = '{' + m[0] + '[]}';
  console.log('Extracted puppies array length string:', jsonStr.length);
  try {
    const data = JSON.parse(jsonStr);
    console.log('Successfully parsed puppies count:', data.puppies.length);
    fs.writeFileSync('src/data/puppiesCatalog.json', JSON.stringify(data.puppies, null, 2));
    console.log('Saved to src/data/puppiesCatalog.json');
  } catch (e) {
    console.error('Parse error:', e.message);
  }
} else {
  console.log('Not found via regex');
}

