const fs = require('fs');
const html = fs.readFileSync('reference/live_faq.html', 'utf8');

const regex = /<li class="tp-note"[^>]*style="([^"]*)"[^>]*>[\s\S]*?<button[^>]*id="([^"]*)"[^>]*>[\s\S]*?<span class="font-plush-text">([^<]*)<\/span>[\s\S]*?<div[^>]*id="([^"]*)"[^>]*>[\s\S]*?<div class="tp-note__flap"><p>([^<]*)<\/p>/g;

let match;
const notes = [];
while ((match = regex.exec(html)) !== null) {
  notes.push({
    style: match[1],
    qId: match[2],
    question: match[3],
    aId: match[4],
    answer: match[5]
  });
}

console.log('Extracted FAQ notes count:', notes.length);
console.log(JSON.stringify(notes, null, 2));

