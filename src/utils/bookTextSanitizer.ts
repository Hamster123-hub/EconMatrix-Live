/**
 * bookTextSanitizer.ts
 * Advanced AI-grade sanitizer and formatter for Economic Textbooks, Manuscripts, and Word Documents.
 * Fixes:
 * 1. Unseparated Headings (Chapters, Sections, ALL-CAPS titles)
 * 2. Mangled Equations & LaTeX Formulas (\frac, \Delta, \sum, \int, Eq. 1: ..., \begin{equation})
 * 3. Line-wrap breaking sentences across lines (Word / PDF export artifacts)
 * 4. Excessive blank lines & paragraph gaps
 * 5. Inline variable formatting ($M$, $V$, $P$, $Y$, $\Delta$)
 */

export function sanitizeAndFormatBookText(rawText: string): string {
  if (!rawText || !rawText.trim()) return '';

  let text = rawText;

  // 1. Normalize line endings, non-breaking spaces, and tabs
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  text = text.replace(/\u00a0/g, ' ').replace(/&nbsp;/gi, ' ');
  text = text.replace(/\t/g, '    ');

  // 2. Fix hyphenated line breaks (e.g. "macro-\neconomics" -> "macroeconomics")
  text = text.replace(/([a-zA-Z])\-\s*\n\s*([a-zA-Z])/g, '$1$2');

  // 3. Normalize Word OMML / Math XML tags if present in plain text
  text = text.replace(/<m:oMathPara>[\s\S]*?<\/m:oMathPara>/gi, (m) => {
    const cleanMath = m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return `\n\n$$ ${cleanMath} $$\n\n`;
  });
  text = text.replace(/<m:oMath>[\s\S]*?<\/m:oMath>/gi, (m) => {
    const cleanMath = m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return ` $${cleanMath}$ `;
  });

  // 4. Smooth out hard line breaks inside sentences (Word / PDF copy paste issue)
  // If line ends with a word/comma and next line starts with lowercase letter or word without heading indicator
  const lines = text.split('\n');
  const smoothedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i].trim();
    const next = i < lines.length - 1 ? lines[i + 1].trim() : '';

    if (!curr) {
      smoothedLines.push('');
      continue;
    }

    // Check if curr line is a heading, bullet, equation, or explicit break
    const isCurrSpecial =
      /^#+/.test(curr) ||
      /^[\-\*\•\u2022\u25cf\u25cb\u25a0]/.test(curr) ||
      /^\d+[\.\)]\s/.test(curr) ||
      /^CHAPTER/i.test(curr) ||
      /^SECTION/i.test(curr) ||
      /^PART/i.test(curr) ||
      curr.startsWith('$$') ||
      curr.startsWith('\\[') ||
      curr.endsWith(':');

    const isNextLowercaseOrWord =
      next &&
      !/^#+/.test(next) &&
      !/^[\-\*\•\u2022\u25cf\u25cb\u25a0]/.test(next) &&
      !/^\d+[\.\)]\s/.test(next) &&
      !/^CHAPTER/i.test(next) &&
      !/^SECTION/i.test(next) &&
      !/^PART/i.test(next) &&
      !next.startsWith('$$') &&
      !next.startsWith('\\[') &&
      /^[a-z0-9\(\'\"]/.test(next);

    // If current line does NOT end with sentence terminal (.!?), and next line looks like continuation, merge!
    if (!isCurrSpecial && !/[\.\!\?\:\;]$/.test(curr) && isNextLowercaseOrWord) {
      lines[i + 1] = `${curr} ${next}`;
    } else {
      smoothedLines.push(curr);
    }
  }

  // 5. Line-by-line smart parser for Headings, Equations, Lists, and Paragraphs
  const processedLines: string[] = [];

  for (let i = 0; i < smoothedLines.length; i++) {
    const line = smoothedLines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
        processedLines.push('');
      }
      continue;
    }

    // A. Detect Equations & Mathematical Identities
    const isExplicitEqMarker =
      /^Equation\s*\d*[:\.\s]/i.test(trimmed) ||
      /^Eq\.\s*\d*[:\.\s]/i.test(trimmed) ||
      /^Formula\s*[:\.\s]/i.test(trimmed) ||
      /^Identity\s*[:\.\s]/i.test(trimmed) ||
      /^Model\s*[:\.\s]/i.test(trimmed) ||
      /^Mathematical Identity/i.test(trimmed) ||
      /^Theorem\s*\d*[:\.\s]/i.test(trimmed);

    const isLatexBlock =
      trimmed.startsWith('$$') ||
      trimmed.startsWith('\\[') ||
      trimmed.startsWith('\\begin{equation}') ||
      trimmed.startsWith('\\begin{align}');

    const isMathExpressionLine =
      (/\\(frac|sum|int|partial|Delta|alpha|beta|gamma|theta|sigma|lambda|infty|sqrt|partial|Rightarrow)/.test(trimmed) && !trimmed.startsWith('#')) ||
      (/^[a-zA-Z0-9_\(\)\{\}\s\+\-\*\/=\\^\\\,\.\:\;]+\s*=\s*[a-zA-Z0-9_\(\)\{\}\s\+\-\*\/=\\^\\\,\.\:\;]+$/.test(trimmed) &&
        trimmed.length >= 5 &&
        trimmed.length < 140 &&
        trimmed.includes('=') &&
        (trimmed.includes('_') || trimmed.includes('^') || trimmed.includes('\\') || trimmed.includes('/') || trimmed.includes('+') || trimmed.includes('-') || trimmed.includes('*')));

    if (isExplicitEqMarker || isLatexBlock || isMathExpressionLine) {
      // Ensure single blank line before equation
      if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
        processedLines.push('');
      }

      if (isLatexBlock) {
        processedLines.push(trimmed);
      } else if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        processedLines.push(trimmed);
      } else {
        processedLines.push(`$$ ${trimmed} $$`);
      }

      // Ensure single blank line after equation
      processedLines.push('');
      continue;
    }

    // B. Detect Headings & Chapter Titles
    const isMarkdownHeading = /^#+\s+/.test(trimmed);
    const isChapterHeading =
      /^(CHAPTER|Chapter|PART|Part|SECTION|Section|APPENDIX|Appendix|MODULE|Module)\s+[\dIVXLCDM\w]+[\s\:\.\-]/i.test(trimmed) ||
      /^(CHAPTER|Chapter|PART|Part|SECTION|Section)\s+[\dIVXLCDM\w]+$/i.test(trimmed);

    const isNumberedHeading = /^\d+\.\d+(\.\d+)?\s+[A-Z]/.test(trimmed) || /^[1-9]\.0?\s+[A-Z]/.test(trimmed);

    const isAllCapsTitle =
      /^[A-Z0-9\s\,\-\–\:\(\)\&]{5,85}$/.test(trimmed) &&
      !trimmed.endsWith('.') &&
      !trimmed.includes('HTTP') &&
      !trimmed.includes('WWW') &&
      trimmed.split(' ').length <= 12 &&
      !trimmed.includes('TABLE') &&
      !trimmed.includes('FIGURE') &&
      !trimmed.includes('SOURCE');

    if (isMarkdownHeading || isChapterHeading || isNumberedHeading || isAllCapsTitle) {
      // Ensure single blank line before heading
      if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
        processedLines.push('');
      }

      if (isMarkdownHeading) {
        processedLines.push(trimmed);
      } else if (isChapterHeading) {
        processedLines.push(`## ${trimmed}`);
      } else if (isNumberedHeading) {
        processedLines.push(`### ${trimmed}`);
      } else {
        processedLines.push(`### ${trimmed}`);
      }

      // Ensure single blank line after heading
      processedLines.push('');
      continue;
    }

    // C. Detect Inline Math Variable Tokens (e.g. "where Y is output, C is consumption")
    let paragraphLine = trimmed;
    // Auto-wrap single isolated math expressions like " M = C + D " or " Delta M " if not inside $
    paragraphLine = paragraphLine.replace(/\b([M|V|P|Y|C|I|G|X|Q|K|L|r|i|i_\w|r_\w|M_\w|P_\w|Y_\w])\s*=\s*([a-zA-Z0-9_\+\-\*\/\(\)\{\}]+)\b/g, (m) => `$${m}$`);

    // D. Bullet or Numbered List Items
    if (/^[\-\*\•\u2022\u25cf\u25cb\u25a0]\s+/.test(paragraphLine) || /^\d+[\.\)]\s+/.test(paragraphLine)) {
      processedLines.push(paragraphLine);
      continue;
    }

    // E. Regular Paragraph Line
    processedLines.push(paragraphLine);
  }

  // 6. Final Join and Collapse Excess Empty Lines (Max 1 empty line = double newline \n\n)
  let sanitized = processedLines.join('\n');
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n').trim();

  return sanitized;
}

/**
 * Format math expression strings for human reading
 */
export function formatMathExpression(formulaStr: string): string {
  if (!formulaStr) return '';
  let clean = formulaStr.trim();

  // Strip wrapping $$ or \[ \]
  clean = clean.replace(/^(\$\$|\$|\\\[|\\begin\{equation\}|\\begin\{align\})|(\$\$|\$|\\\]|\\end\{equation\}|\\end\{align\})$/g, '').trim();

  // Convert LaTeX macros to readable mathematical unicode symbols if raw
  clean = clean
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\pi/g, 'π')
    .replace(/\\infty/g, '∞')
    .replace(/\\sum/g, '∑')
    .replace(/\\int/g, '∫')
    .replace(/\\partial/g, '∂')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈');

  return clean;
}
