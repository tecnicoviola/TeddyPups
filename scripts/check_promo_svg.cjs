const fs = require('fs');
const html = fs.readFileSync('reference/live_how_it_works.html', 'utf8');
const target = 'Teddy, ready to play';
const pos = html.indexOf(target);
const svgStart = html.lastIndexOf('<svg', pos);
const svgEnd = html.indexOf('</svg>', pos) + 6;
const svg = html.slice(svgStart, svgEnd);
console.log('SVG length:', svg.length);

const dataPMatches = Array.from(svg.matchAll(/data-p="([^"]+)"[^>]*?(transform="[^"]*"|opacity="[^"]*")/g));
for (const m of dataPMatches) {
  console.log(m[1], '-->', m[2]);
}

