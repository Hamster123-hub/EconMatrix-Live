import fs from 'fs';
import path from 'path';

const translationsPath = path.join(process.cwd(), 'src/utils/translations.ts');
let code = fs.readFileSync(translationsPath, 'utf8');

// We will check if the new entries are already present
if (!code.includes('sri-lanka-caa1-sovereign-rating-confirmed-moodys')) {
  console.log('Injecting comprehensive translations for all remaining articles...');
}
