const fs = require('fs');
const map = require('../src/data/puppiesCardHtmlMap.json');
const card = Object.values(map)[0];
const img = card.match(/<img[^>]+>/);
console.log('Img in cardHtmlMap:', img ? img[0] : 'no img');
