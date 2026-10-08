import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/utils/financialTranslator.ts');
let code = fs.readFileSync(filePath, 'utf8');

// Ensure policy rate & rate / rates are before generic words
const patchSI = `
  [/\\bcentral bank policy rates\\b/gi, 'මහ බැංකු ප්‍රතිපත්ති පොලී අනුපාතික'],
  [/\\bcentral bank policy rate\\b/gi, 'මහ බැංකු ප්‍රතිපත්ති පොලී අනුපාතිකය'],
  [/\\bpolicy rates\\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතික'],
  [/\\bpolicy rate\\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතිකය'],
  [/\\binterest rates\\b/gi, 'පොලී අනුපාතික'],
  [/\\binterest rate\\b/gi, 'පොලී අනුපාතිකය'],
  [/\\bexchange rates\\b/gi, 'විනිමය අනුපාතික'],
  [/\\bexchange rate\\b/gi, 'විනිමය අනුපාතිකය'],
  [/\\brates\\b/gi, 'අනුපාතික'],
  [/\\brate\\b/gi, 'අනුපාතිකය'],
`;

const patchTA = `
  [/\\bcentral bank policy rates\\b/gi, 'மத்திய வங்கி கொள்கை வட்டி விகிதங்கள்'],
  [/\\bcentral bank policy rate\\b/gi, 'மத்திய வங்கி கொள்கை வட்டி விகிதம்'],
  [/\\bpolicy rates\\b/gi, 'கொள்கை வட்டி விகிதங்கள்'],
  [/\\bpolicy rate\\b/gi, 'கொள்கை வட்டி விகிதம்'],
  [/\\binterest rates\\b/gi, 'வட்டி விகிதங்கள்'],
  [/\\binterest rate\\b/gi, 'வட்டி விகிதம்'],
  [/\\bexchange rates\\b/gi, 'மாற்று விகிதங்கள்'],
  [/\\bexchange rate\\b/gi, 'மாற்று விகிதம்'],
  [/\\brates\\b/gi, 'விகிதங்கள்'],
  [/\\brate\\b/gi, 'விகிதம்'],
`;

code = code.replace(
  'const SINHALA_TERMS: [RegExp, string][] = [',
  'const SINHALA_TERMS: [RegExp, string][] = [' + patchSI
);

code = code.replace(
  'const TAMIL_TERMS: [RegExp, string][] = [',
  'const TAMIL_TERMS: [RegExp, string][] = [' + patchTA
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully patched rate and policy rate!');
