const fs = require('fs');
const html = fs.readFileSync('reference/data/already_gone_home_strip_clean.html', 'utf8');

// Let's parse each <li> in the <ul>
const liRegex = /<li[\s\S]*?<\/li>/g;
const matches = html.match(liRegex);
console.log('Found <li> elements:', matches ? matches.length : 0);

if (matches) {
  matches.forEach((m, i) => {
    const nameMatch = m.match(/class="tp-sketch__name[^"]*">([^<]+)<\/span>/);
    const linkMatch = m.match(/href="([^"]+)"/);
    const stickerMatch = m.match(/class="tp-sketch__sticker[^"]*">([^<]+)<\/span>/);
    const tiltMatch = m.match(/--tilt:([^;]+);/);
    const washMatch = m.match(/--wash:([^;]+)"/);
    console.log(`Puppy ${i + 1}:`, {
      name: nameMatch ? nameMatch[1] : null,
      href: linkMatch ? linkMatch[1] : null,
      sticker: stickerMatch ? stickerMatch[1] : null,
      tilt: tiltMatch ? tiltMatch[1] : null,
      wash: washMatch ? washMatch[1] : null,
      htmlLength: m.length
    });
  });
}

