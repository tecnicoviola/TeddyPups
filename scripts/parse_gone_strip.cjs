const fs = require('fs');
const sec = fs.readFileSync('reference/data/already_gone_home_strip.html', 'utf8');

const items = sec.split('<li');
console.log('Total puppies in row:', items.length - 1);

for (let i = 1; i < items.length; i++) {
  const item = '<li' + items[i];
  const mName = item.match(/class="tp-sketch__name[^>]*>([^<]+)<\/span>/);
  const mMeta = item.match(/class="tp-sketch__meta"[^>]*>([^<]+)<\/span>/);
  const mHref = item.match(/href="([^"]+)"/);
  console.log(i, mName ? mName[1] : '?', '|', mMeta ? mMeta[1] : '?', '|', mHref ? mHref[1] : '?');
}

