import fs from 'fs';

let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

const needle = '  12: {\n    title: "ஏற்றுமதி அபிவிருத்தி சபை (EDB) 2030 ஆம் ஆண்டளவில் 25 பில்லியன் டாலர் தேசிய ஏற்றுமதி வரைபடத்தை கோடிட்டுக் காட்டுகிறது",';

if (content.includes('sri-lanka-caa1-sovereign-rating-confirmed-moodys') && !content.includes('மூடிஸ் (Moody\'s) இலங்கையின் Caa1')) {
  // Read newEntriesTA from scripts/update_translations.ts
  const scriptCode = fs.readFileSync('scripts/update_translations.ts', 'utf8');
  const match = scriptCode.match(/const newEntriesTA = `([\s\S]*?)`;/);
  if (match && match[1]) {
    const taEntries = match[1];
    
    // We insert after article 12 in articleDictTA
    const ta12End = '    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஏற்றுமதி அபிவிருத்தி சபையின் தலைவர் 2030 தேசிய ஏற்றுமதி விரிவாக்க மூலோபாயத்தை கொழும்பில் வெளியிட்டார், மின்னணு பாகங்கள், நறுமணப் பொருட்கள், கடல் பொருட்கள் மற்றும் மென்பொருள் சேவைகள் முக்கிய ஏற்றுமதித் துறைகளாக அறிவிக்கப்பட்டன.`\n  }\n};';
    
    if (content.includes(ta12End)) {
      content = content.replace(ta12End, '    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஏற்றுமதி அபிவிருத்தி சபையின் தலைவர் 2030 தேசிய ஏற்றுமதி விரிவாக்க மூலோபாயத்தை கொழும்பில் வெளியிட்டார், மின்னணு பாகங்கள், நறுமணப் பொருட்கள், கடல் பொருட்கள் மற்றும் மென்பொருள் சேவைகள் முக்கிய ஏற்றுமதித் துறைகளாக அறிவிக்கப்பட்டன.`\n  },\n' + taEntries + '\n};');
      fs.writeFileSync('src/utils/translations.ts', content, 'utf8');
      console.log('Successfully injected Tamil entries!');
    } else {
      console.log('ta12End pattern not found');
    }
  }
} else {
  console.log('Already injected or condition not met');
}
