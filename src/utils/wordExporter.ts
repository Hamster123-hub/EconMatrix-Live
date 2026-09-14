import { BOOK_METADATA, BOOK_CHAPTERS, BOOK_EQUATIONS } from '../data/bookData';

/**
 * Generates and triggers a browser download of the complete manuscript
 * "THE STORY BEHIND SRI LANKA'S TRAGIC MIS-FORTUNE"
 * formatted as a Word document (.doc / .docx compatible).
 */
export function exportBookToWordDocument(filename: string = 'Sri_Lanka_Tragic_Misfortune.doc'): void {
  const htmlDoc = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${BOOK_METADATA.title}${BOOK_METADATA.author ? ` - ${BOOK_METADATA.author}` : ''}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000000;
      margin: 1in;
    }
    h1.book-title {
      font-size: 24pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 2in;
      margin-bottom: 12pt;
      color: #000000;
    }
    h2.book-subtitle {
      font-size: 14pt;
      font-style: italic;
      text-align: center;
      margin-bottom: 1.5in;
      color: #333333;
    }
    .author-name {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2in;
    }
    .page-break {
      page-break-before: always;
    }
    h2.part-header {
      font-size: 16pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 36pt;
      margin-bottom: 18pt;
      border-bottom: 2pt solid #000;
      padding-bottom: 6pt;
    }
    h3.chapter-title {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 24pt;
      margin-bottom: 6pt;
      color: #0b1f3a;
    }
    h4.chapter-subtitle {
      font-size: 11pt;
      font-style: italic;
      margin-bottom: 12pt;
      color: #555555;
    }
    p {
      text-align: justify;
      text-indent: 0.25in;
      margin-top: 0;
      margin-bottom: 6pt;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 12pt;
      padding-left: 0.5in;
    }
    li {
      margin-bottom: 4pt;
    }
    .toc-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24pt;
    }
    .toc-table td {
      padding: 4pt 0;
      border-bottom: 1px dotted #ccc;
    }
    .formula-box {
      background-color: #f4f6f9;
      border: 1px solid #003366;
      padding: 10pt;
      margin: 12pt 0;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10pt;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
    }
    .table-custom th, .table-custom td {
      border: 1px solid #333;
      padding: 6pt;
      text-align: left;
      font-size: 10pt;
    }
    .table-custom th {
      background-color: #003366;
      color: #ffffff;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div style="text-align: center;">
    <h1 class="book-title">${BOOK_METADATA.title}</h1>
    <h2 class="book-subtitle">${BOOK_METADATA.subtitle}</h2>
    ${BOOK_METADATA.author ? `<div class="author-name">BY ${BOOK_METADATA.author.toUpperCase()}</div>` : ''}
    <p style="text-align: center; text-indent: 0; font-size: 10pt; color: #666;">Colombo, Sri Lanka • Academic & Policy Edition</p>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h2 style="font-size: 16pt; font-weight: bold; text-align: center;">TABLE OF CONTENTS</h2>
  <table class="toc-table">
    <tr><td colspan="2"><strong>PREFACE & NOTE ON TERMINOLOGY AND CONVENTIONS</strong></td></tr>
    <tr><td>CBSL Repo vs Reverse Repo Inversion & Key Rate Acronyms</td><td style="text-align: right;">Page 9</td></tr>
    <tr><td colspan="2" style="padding-top: 12pt;"><strong>PART I: THE THEORETICAL FRAMEWORK</strong></td></tr>
    ${BOOK_CHAPTERS.filter(c => c.part.includes('Part I')).map(c => `
      <tr>
        <td><strong>Chapter ${c.chapterNumber}:</strong> ${c.title}</td>
        <td style="text-align: right;">Ch. ${c.chapterNumber}</td>
      </tr>
    `).join('')}
    <tr><td colspan="2" style="padding-top: 12pt;"><strong>PART II: THE OPERATIONAL REALITY</strong></td></tr>
    ${BOOK_CHAPTERS.filter(c => c.part.includes('Part II')).map(c => `
      <tr>
        <td><strong>Chapter ${c.chapterNumber}:</strong> ${c.title}</td>
        <td style="text-align: right;">Ch. ${c.chapterNumber}</td>
      </tr>
    `).join('')}
  </table>

  <div class="page-break"></div>

  <!-- PREFACE & NOTE ON TERMINOLOGY -->
  <h2 class="part-header">PREFACE & TERMINOLOGY</h2>
  <h3 class="chapter-title">Preface Note on Terminology and Conventions</h3>
  <p>In the study of monetary operations, precise definitions are essential. Readers should be aware that the terminology used by the Central Bank of Sri Lanka (CBSL) differs in critical ways from conventions used by the U.S. Federal Reserve and other major Western central banks.</p>
  <p><strong>1. The "Repo" Inversion:</strong> The most significant difference lies in the naming of Open Market Operations (OMOs). The CBSL names these operations based on the perspective of the commercial bank, whereas the Federal Reserve names them based on the perspective of the Central Bank.</p>
  <ul>
    <li><strong>CBSL "Repo" (Liquidity Absorption):</strong> Action: Central Bank sells securities to commercial banks. Effect: Cash is removed from the banking system. Western Equivalent: Reverse Repo.</li>
    <li><strong>CBSL "Reverse Repo" (Liquidity Injection):</strong> Action: Central Bank buys securities from commercial banks. Effect: Fresh cash is injected into the banking system. Western Equivalent: Repo.</li>
  </ul>
  <p><strong>2. Key Interest Rate Acronyms:</strong></p>
  <ul>
    <li><strong>OPR (Overnight Policy Rate):</strong> The single primary policy rate announced by the Monetary Policy Board.</li>
    <li><strong>AWCMR (Average Weighted Call Money Rate):</strong> The weighted average interest rate at which commercial banks lend unsecured funds to each other overnight. Operating Target.</li>
    <li><strong>SLFR (Standing Lending Facility Rate):</strong> Ceiling rate at which commercial banks borrow from the Central Bank.</li>
    <li><strong>SDFR (Standing Deposit Facility Rate):</strong> Floor rate at which commercial banks deposit excess cash with the Central Bank.</li>
  </ul>

  <!-- MATHEMATICAL IDENTITIES SUMMARY -->
  <div class="page-break"></div>
  <h2 class="part-header">CORE MACROECONOMIC EQUATIONS</h2>
  ${BOOK_EQUATIONS.map(eq => `
    <div class="formula-box">
      <strong>${eq.name}</strong><br>
      <em>Reference: ${eq.bookPageRef}</em><br><br>
      Formula: <strong>${eq.displayFormula}</strong><br>
      LaTeX: <code>${eq.latexFormula}</code><br><br>
      Insight: ${eq.economicInsight}
    </div>
  `).join('')}

  <!-- BOOK CHAPTERS -->
  <div class="page-break"></div>
  <h2 class="part-header">PART I: THE THEORETICAL FRAMEWORK</h2>

  ${BOOK_CHAPTERS.map((ch, idx) => {
    const isFirstPartTwo = idx > 0 && ch.part.includes('Part II') && !BOOK_CHAPTERS[idx-1].part.includes('Part II');
    return `
      ${isFirstPartTwo ? `
        <div class="page-break"></div>
        <h2 class="part-header">PART II: THE OPERATIONAL REALITY</h2>
      ` : ''}
      <div style="margin-top: 24pt;">
        <h3 class="chapter-title">CHAPTER ${ch.chapterNumber}: ${ch.title}</h3>
        <h4 class="chapter-subtitle">${ch.subtitle}</h4>
        <p><strong>Key Concepts:</strong> ${ch.keyConcepts.join(' • ')}</p>
        <div>
          ${ch.summaryMarkdown
            .replace(/### (.*)/g, '<h4 style="font-size:12pt; font-weight:bold; margin-top:12pt;">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .split('\n\n')
            .map(p => p.trim().startsWith('-') ? `<ul>${p.split('\n').map(li => `<li>${li.replace(/^- /, '')}</li>`).join('')}</ul>` : `<p>${p}</p>`)
            .join('')}
        </div>
      </div>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 24pt 0;">
    `;
  }).join('')}

  <!-- CONCLUSION -->
  <div class="page-break"></div>
  <h2 class="part-header">THE CONCLUSION</h2>
  <h3 class="chapter-title">The Discipline of Prosperity</h3>
  <p>The continuous reserve accumulation in a flexible inflation targeting environment, without a rigorous sterilization mechanism, results in a de facto partial convertibility problem. By converting foreign assets into domestic liquidity and refusing to reconvert them upon demand, the monetary authority inadvertently engineers depreciation.</p>
  <p>Money is not a magic wand; it is a ledger of our social reality. From the philosophical debates of David Hume and Karl Marx to the high-stakes trading floors of Colombo, attempts to defy the fundamental laws of political economy—specifically the Impossible Trinity—are the root cause of financial instability.</p>

</body>
</html>`;

  const blob = new Blob(['\ufeff', htmlDoc], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
