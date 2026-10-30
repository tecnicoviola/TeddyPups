const fs = require('fs');
const html = fs.readFileSync('reference/pages/puppies.html', 'utf8');

// Find all occurrences of breed slugs/names in the filter
const breeds = [
  { slug: 'maltipoo', name: 'Maltipoo' },
  { slug: 'pomeranian', name: 'Pomeranian' },
  { slug: 'poodle', name: 'Poodle' },
  { slug: 'cavapoo', name: 'Cavapoo' },
  { slug: 'shih-tzu', name: 'Shih Tzu' }
];

console.log('Breeds defined:', breeds);

