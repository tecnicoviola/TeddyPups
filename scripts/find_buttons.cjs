const fs = require('fs');

for (const p of ['reference/pages', 'reference/mains']) {
  if (fs.existsSync(p)) {
    for (const f of fs.readdirSync(p)) {
      const content = fs.readFileSync(p + '/' + f, 'utf8');
      const matches = content.match(/<[^>]+class="[^"]*(?:paw|badge|btn)[^"]*"[^>]*>/gi);
      if (matches) {
        console.log(p + '/' + f, matches.slice(0, 10));
      }
    }
  }
}

