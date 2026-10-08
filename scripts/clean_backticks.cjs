const fs = require('fs');
let s = fs.readFileSync('src/utils/translations.ts', 'utf8');
s = s.split('\\`').join('`');
fs.writeFileSync('src/utils/translations.ts', s, 'utf8');
console.log('Cleaned backtick escapes cleanly!');
