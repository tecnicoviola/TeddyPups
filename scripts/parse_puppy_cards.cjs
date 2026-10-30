const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

// The puppies list in the HTML is inside <ul class="tp-sketches mt-20"><li>...</li>...</ul>
const startIdx = html.indexOf('tp-sketches mt-20');
const endIdx = html.indexOf('</ul>', startIdx);
const sketchesHtml = html.slice(startIdx, endIdx);

// split by <li
const liMatches = sketchesHtml.split('<li');
console.log('Found total li items in puppies.html:', liMatches.length - 1);

const cards = [];
for (let i = 1; i < liMatches.length; i++) {
  const item = '<li' + liMatches[i];
  
  // extract href
  const hrefMatch = item.match(/href="([^"]+)"/);
  const href = hrefMatch ? hrefMatch[1] : '';
  const slug = href.replace('/puppies/', '');

  // extract name
  const nameMatch = item.match(/class="tp-sketch__name[^"]*">([^<]+)<\/span>/);
  const displayName = nameMatch ? nameMatch[1] : '';

  // extract meta
  const metaMatch = item.match(/class="tp-sketch__meta"[^>]*>([\s\S]*?)<\/span>/);
  const meta = metaMatch ? metaMatch[1].replace(/<!-- -->/g, '').trim() : '';

  // extract sticker status
  const stickerMatch = item.match(/class="tp-sketch__sticker[^"]*">([^<]+)<\/span>/);
  const status = stickerMatch ? stickerMatch[1] : 'Available';

  // extract video
  const hasVideo = item.includes('tp-sketch__video');

  // extract photo src
  const srcMatch = item.match(/src="([^"]+)"/);
  const imgSrc = srcMatch ? srcMatch[1] : '';

  cards.push({
    slug,
    displayName,
    meta,
    status,
    hasVideo,
    imgSrc,
    rawHtml: item
  });
}

console.log('Parsed cards:', cards.length);
fs.writeFileSync('reference/data/puppies_listing_parsed.json', JSON.stringify(cards, null, 2));
console.log('Saved to reference/data/puppies_listing_parsed.json');

