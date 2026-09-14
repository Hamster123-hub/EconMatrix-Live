/**
 * wordPasteHandler.ts
 * Smart converter for Word, Google Docs, and Rich Text clipboard data.
 */

import { sanitizeAndFormatBookText } from './bookTextSanitizer';

export interface ProcessedPasteResult {
  formattedContent: string;
  isHtml: boolean;
  hasTable: boolean;
  hasHeadings: boolean;
  hasLists: boolean;
}

export function cleanWordHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. Remove XML declarations, conditional comments (Word mso comments), and style tags
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<xml>[\s\S]*?<\/xml>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

  // 2. Remove Word-specific tags like <o:p>, <m:*>
  html = html.replace(/<\/?o:[^>]*>/gi, '');

  // 3. Convert Word OMML equations (<m:oMathPara>, <m:oMath>) to clean text
  html = html.replace(/<m:oMathPara>([\s\S]*?)<\/m:oMathPara>/gi, (_match, inner) => {
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return `<div class="equation-block my-4 p-4 bg-[#0B1E36] text-amber-300 font-mono font-bold text-center rounded border-2 border-amber-500 shadow-md"><div class="text-[10px] uppercase tracking-widest text-slate-400 mb-1 border-b border-slate-700 pb-1">MATHEMATICAL FORMULA & IDENTITY</div>${text}</div>`;
  });
  html = html.replace(/<m:oMath>([\s\S]*?)<\/m:oMath>/gi, (_match, inner) => {
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return `<span class="inline-math font-mono font-bold bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded border border-amber-300">${text}</span>`;
  });

  html = html.replace(/<\/?m:[^>]*>/gi, '');

  // 4. Convert Word MsoHeading classes to standard h1-h4 tags with margins
  html = html.replace(/<p[^>]*class="[^"]*MsoHeading1[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, '<h1 class="text-2xl font-serif font-black text-[#0B1E36] border-b-2 border-amber-500 pb-2 mt-6 mb-4">$1</h1>');
  html = html.replace(/<p[^>]*class="[^"]*MsoHeading2[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, '<h2 class="text-xl font-serif font-extrabold text-[#0B1E36] border-b border-slate-300 pb-1 mt-5 mb-3">$1</h2>');
  html = html.replace(/<p[^>]*class="[^"]*MsoHeading3[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, '<h3 class="text-lg font-serif font-bold text-amber-900 mt-4 mb-2">$1</h3>');
  html = html.replace(/<p[^>]*class="[^"]*MsoHeading4[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, '<h4 class="text-base font-serif font-bold text-slate-900 mt-3 mb-2">$1</h4>');

  // 5. Convert Word MsoListParagraph to li list items
  html = html.replace(/<p[^>]*class="[^"]*MsoListParagraph[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, (_match, inner) => {
    const cleanInner = inner.replace(/^(&middot;|\u2022|&bull;|\d+\.)\s*/gi, '');
    return `<li>${cleanInner}</li>`;
  });

  // Wrap loose <li> elements in a <ul> if not wrapped
  if (html.includes('<li>') && !html.includes('<ul>') && !html.includes('<ol>')) {
    html = html.replace(/(<li>[\s\S]*?<\/li>)+/gi, (match) => `<ul class="list-disc pl-6 my-3 space-y-1">${match}</ul>`);
  }

  // 6. Clean up inline styles but preserve basic formatting
  html = html.replace(/\s*style="[^"]*"/gi, '');
  html = html.replace(/\s*class="[^"]*Mso[^"]*"/gi, '');

  // Replace empty paragraphs
  html = html.replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '');
  html = html.replace(/(<br\s*\/?>\s*){3,}/gi, '<br/><br/>');

  return html.trim();
}

/**
 * Handle paste event on any text area or input field.
 * Returns the cleaned string (either formatted HTML or smart Markdown)
 */
export function processPasteData(clipboard: DataTransfer): ProcessedPasteResult | null {
  if (!clipboard) return null;

  const htmlData = clipboard.getData('text/html');
  const plainText = clipboard.getData('text/plain');

  let formattedContent = '';
  let isHtml = false;
  let hasTable = false;
  let hasHeadings = false;
  let hasLists = false;

  // Case A: Rich HTML available from MS Word, Google Docs, or Browser
  if (htmlData && (htmlData.includes('<table') || htmlData.includes('<p') || htmlData.includes('<h') || htmlData.includes('<ul') || htmlData.includes('MsoNormal') || htmlData.includes('MsoListParagraph'))) {
    const cleaned = cleanWordHtml(htmlData);
    if (cleaned && cleaned.length > 5) {
      formattedContent = cleaned;
      isHtml = true;
      hasTable = cleaned.includes('<table');
      hasHeadings = /<h[1-6]/i.test(cleaned);
      hasLists = cleaned.includes('<ul') || cleaned.includes('<li');
      return { formattedContent, isHtml, hasTable, hasHeadings, hasLists };
    }
  }

  // Case B: Plain Text Paste with Tab-Separated Tables or Bullet Symbols
  if (plainText) {
    const sanitizedText = sanitizeAndFormatBookText(plainText);
    const lines = sanitizedText.split('\n');
    const convertedLines: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const bodyRows = tableRows.slice(1);
        let tableHtml = '<table class="w-full border-2 border-slate-800 my-4 shadow-md">\n<thead><tr class="bg-[#0B1E36] text-amber-300 font-mono font-bold text-xs uppercase">\n';
        headers.forEach(h => { tableHtml += `<th class="p-3 border border-slate-700">${h}</th>\n`; });
        tableHtml += '</tr>\n</thead>\n<tbody>\n';
        bodyRows.forEach((row, rIdx) => {
          tableHtml += `<tr class="${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}">\n`;
          row.forEach(cell => { tableHtml += `<td class="p-3 border border-slate-300 text-xs text-slate-900">${cell}</td>\n`; });
          tableHtml += '</tr>\n';
        });
        tableHtml += '</tbody>\n</table>';
        convertedLines.push(tableHtml);
        hasTable = true;
        isHtml = true;
        tableRows = [];
      }
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if line contains tabs (Word table pasted as plain text!)
      if (line.includes('\t')) {
        const cells = line.split('\t').map(c => c.trim()).filter(c => c.length > 0);
        if (cells.length >= 2) {
          inTable = true;
          tableRows.push(cells);
          continue;
        }
      }

      if (inTable) {
        flushTable();
      }

      convertedLines.push(line);
    }

    if (inTable) {
      flushTable();
    }

    formattedContent = convertedLines.join('\n');
    hasHeadings = formattedContent.includes('##') || formattedContent.includes('###');
    hasLists = formattedContent.includes('•') || formattedContent.includes('- ');
    return { formattedContent, isHtml, hasTable, hasHeadings, hasLists };
  }

  return null;
}
