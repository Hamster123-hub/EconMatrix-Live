import fs from 'fs';

let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

// 1. Fix line after 12: { ... } in articleDictSI - add comma
content = content.replace(/(878:\s*body:[^}]+\}\n)(\s*\/\/\s*Additional Initial Articles in Sinhala)/, '$1,\n$2');
// Also simple direct replace
content = content.replace(
  '  12: {\n    title: "අපනයන සංවර්ධන මණ්ඩලය (EDB) 2030 වන විට ඩොලර් බිලියන 25 ක ජාතික අපනයන සැලැස්ම එළිදක්වයි",\n    deck: "ඉලෙක්ට්‍රොනික නිෂ්පාදන, සකසන ලද කුළුබඩු, සාගර නිෂ්පාදන සහ ඩිජිටල් තොරතුරු තාක්ෂණ සේවා ප්‍රධාන ක්ෂේත්‍ර ලෙස හඳුනා ගනී.",\n    category: "වෙළඳාම",\n    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — අපනයන සංවර්ධන මණ්ඩලයේ සභාපතිවරයා විසින් 2030 ජාතික අපනයන ව්‍යාප්ති උපායමාර්ගය කොළඹදී එළිදක්වන ලද අතර ඉලෙක්ට්‍රොනික උපාංග, කුළුබඩු, ධීවර නිෂ්පාදන සහ මෘදුකාංග සේවා ප්‍රධාන අපනයන ක්ෂේත්‍ර ලෙස නම් කරන ලදී.`\n  }\n\n  // Additional Initial Articles in Sinhala',
  '  12: {\n    title: "අපනයන සංවර්ධන මණ්ඩලය (EDB) 2030 වන විට ඩොලර් බිලියන 25 ක ජාතික අපනයන සැලැස්ම එළිදක්වයි",\n    deck: "ඉලෙක්ට්‍රොනික නිෂ්පාදන, සකසන ලද කුළුබඩු, සාගර නිෂ්පාදන සහ ඩිජිටල් තොරතුරු තාක්ෂණ සේවා ප්‍රධාන ක්ෂේත්‍ර ලෙස හඳුනා ගනී.",\n    category: "වෙළඳාම",\n    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — අපනයන සංවර්ධන මණ්ඩලයේ සභාපතිවරයා විසින් 2030 ජාතික අපනයන ව්‍යාප්ති උපායමාර්ගය කොළඹදී එළිදක්වන ලද අතර ඉලෙක්ට්‍රොනික උපාංග, කුළුබඩු, ධීවර නිෂ්පාදන සහ මෘදුකාංග සේවා ප්‍රධාන අපනයන ක්ෂේත්‍ර ලෙස නම් කරන ලදී.`\n  },\n\n  // Additional Initial Articles in Sinhala'
);

fs.writeFileSync('src/utils/translations.ts', content, 'utf8');
console.log('Fixed SI comma!');
