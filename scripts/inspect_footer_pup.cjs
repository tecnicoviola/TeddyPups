const fs = require('fs');

if (fs.existsSync('reference/live_how_it_works.html')) {
  const html = fs.readFileSync('reference/live_how_it_works.html', 'utf8');
  const idx = html.indexOf('tp-basket__pup');
  if (idx !== -1) {
    console.log('--- FOUND IN live_how_it_works.html ---');
    console.log(html.substring(idx - 100, idx + 4000));
  }
}

if (fs.existsSync('reference/footer_full.html')) {
  const html = fs.readFileSync('reference/footer_full.html', 'utf8');
  console.log('--- FOUND IN reference/footer_full.html ---');
  console.log(html.substring(0, 4000));
}

