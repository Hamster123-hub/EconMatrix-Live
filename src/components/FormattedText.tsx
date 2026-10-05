import React from 'react';
import { ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { sanitizeAndFormatBookText, formatMathExpression } from '../utils/bookTextSanitizer';

interface FormattedTextProps {
  content?: string;
  googleDocUrl?: string;
  className?: string;
  isDarkBg?: boolean;
}

// Helper to extract Google Doc ID from any valid Google Doc link
export const extractGoogleDocId = (urlStr: string): string | null => {
  if (!urlStr) return null;
  const match = urlStr.match(/document\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

// Helper to parse inline markdown (***bold***, **bold**, *italic*, `code`, $math$, [link](url))
const renderInlineMarkdown = (text: string, isDarkBg = false): React.ReactNode[] => {
  if (!text) return [];
  
  // Regex to match ***bold***, **bold**, *italic*, `code`, $math$, [text](url), <b>text</b>, <strong>text</strong>
  const regex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$|\[.*?\]\(.*?\)|<b\b[^>]*>.*?<\/b>|<strong\b[^>]*>.*?<\/strong>)/gi;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold ***text*** or **text**
    if ((part.startsWith('***') && part.endsWith('***') && part.length >= 6) ||
        (part.startsWith('**') && part.endsWith('**') && part.length >= 4)) {
      const isTriple = part.startsWith('***');
      const inner = isTriple ? part.slice(3, -3).trim() : part.slice(2, -2).trim();
      return (
        <strong
          key={i}
          className={`font-black font-extrabold tracking-tight ${isDarkBg ? 'text-amber-300' : 'text-black'}`}
          style={{ color: isDarkBg ? undefined : '#000000', fontWeight: 900 }}
        >
          {inner}
        </strong>
      );
    }

    // HTML <b>...</b> or <strong>...</strong>
    if (/^<b\b[^>]*>(.*?)<\/b>$/i.test(part) || /^<strong\b[^>]*>(.*?)<\/strong>$/i.test(part)) {
      const inner = part.replace(/^<[^>]+>|<\/[^>]+>$/g, '').trim();
      return (
        <strong
          key={i}
          className={`font-black font-extrabold tracking-tight ${isDarkBg ? 'text-amber-300' : 'text-black'}`}
          style={{ color: isDarkBg ? undefined : '#000000', fontWeight: 900 }}
        >
          {inner}
        </strong>
      );
    }

    // Italic *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={i} className="italic font-serif">
          {inner}
        </em>
      );
    }

    // Inline Math $math$
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <span
          key={i}
          className={`px-1.5 py-0.5 mx-0.5 rounded text-xs font-mono font-bold ${
            isDarkBg
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
              : 'bg-amber-100/90 text-amber-950 border border-amber-300'
          }`}
        >
          {formatMathExpression(inner)}
        </span>
      );
    }

    // Inline Code `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={i}
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
            isDarkBg ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold'
          }`}
        >
          {inner}
        </code>
      );
    }

    // Markdown Link [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0284C7] hover:underline font-bold inline-flex items-center gap-0.5"
          >
            {match[1]}
            <ExternalLink className="w-3 h-3 inline ml-0.5" />
          </a>
        );
      }
    }

    return part;
  });
};

// Check if a block of lines represents a Markdown Table
const isMarkdownTable = (lines: string[]): boolean => {
  if (lines.length < 2) return false;
  const hasPipeLines = lines.filter((l) => l.trim().startsWith('|') && l.trim().endsWith('|'));
  return hasPipeLines.length >= 2;
};

// Render a Markdown Table block
const renderMarkdownTable = (lines: string[], blockIdx: number, isDarkBg = false) => {
  const tableLines = lines.filter((l) => l.trim().includes('|'));
  if (tableLines.length === 0) return null;

  // Filter out the separator line (|---|---|)
  const headerLine = tableLines[0];
  const bodyLines = tableLines.slice(1).filter((l) => !l.replace(/\s+/g, '').match(/^\|?(:?-+:?\|)+:?-+:?\|?$/));

  const headers = headerLine
    .split('|')
    .map((cell) => cell.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

  const rows = bodyLines.map((line) =>
    line
      .split('|')
      .map((cell) => cell.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  return (
    <div key={blockIdx} className="my-5 overflow-x-auto border-2 border-[#0B1E36] rounded-xs shadow-md">
      <table className="w-full text-xs sm:text-sm text-left border-collapse">
        <thead className={`uppercase font-mono font-bold text-[11px] tracking-wider border-b-2 border-amber-500 ${isDarkBg ? 'bg-slate-900 text-amber-300' : 'bg-[#0B1E36] text-amber-300'}`}>
          <tr>
            {headers.map((h, hIdx) => (
              <th key={hIdx} className="p-3 border-r border-slate-700 last:border-0">
                {renderInlineMarkdown(h, true)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-amber-50/50 transition'}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 border-r border-slate-200 last:border-0 text-slate-900 font-sans leading-snug">
                  {renderInlineMarkdown(cell, false)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const FormattedText: React.FC<FormattedTextProps> = ({
  content = '',
  googleDocUrl,
  className = '',
  isDarkBg = false,
}) => {
  const [embedMode, setEmbedMode] = React.useState<'preview' | 'pub'>('preview');

  // Priority 1: Check if explicit or embedded Google Doc URL is provided
  const detectedDocUrl = googleDocUrl || (content.includes('docs.google.com/document/d/') ? (content.match(/https?:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+[^\s<"]*/)?.[0]) : null);
  const docId = detectedDocUrl ? extractGoogleDocId(detectedDocUrl) : null;

  // Generate appropriate iframe src URL based on selected mode
  const getIframeSrc = (id: string, mode: 'preview' | 'pub') => {
    if (mode === 'pub') {
      return `https://docs.google.com/document/d/${id}/pub?embedded=true`;
    }
    return `https://docs.google.com/document/d/${id}/preview`;
  };

  // Priority 2: Check if content is raw or pasted HTML (contains HTML tags like <table, <p>, <b>, <h3>, <ul>, <li>, etc.)
  const isHtmlContent = /<[a-z][\s\S]*>/i.test(content) && (
    content.includes('<table') ||
    content.includes('<div') ||
    content.includes('<p>') ||
    content.includes('<p ') ||
    content.includes('<h') ||
    content.includes('<ul') ||
    content.includes('<ol') ||
    content.includes('<li') ||
    content.includes('<strong') ||
    content.includes('<b')
  );

  return (
    <div className={`space-y-4 leading-relaxed font-sans ${className}`}>
      {/* GOOGLE DOC LIVE EMBEDDED VIEWER (If Doc ID is present) */}
      {docId && (
        <div className="my-6 border-2 border-[#0B1E36] rounded-xs overflow-hidden shadow-2xl bg-white">
          <div className="bg-[#0B1E36] text-white p-3.5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-500">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-mono font-bold text-xs uppercase text-amber-300 tracking-wider block">
                  LIVE EMBEDDED GOOGLE DOCUMENT
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  Preserving 100% Original Tables, Equations, Headings & Formatting
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Embed Mode Toggle Switch */}
              <div className="bg-slate-900 border border-slate-700 rounded p-0.5 flex items-center text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setEmbedMode('preview')}
                  className={`px-2.5 py-1 rounded-xs transition cursor-pointer font-bold ${
                    embedMode === 'preview' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Standard View mode (Requires 'Anyone with link can view' sharing)"
                >
                  Document View
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedMode('pub')}
                  className={`px-2.5 py-1 rounded-xs transition cursor-pointer font-bold ${
                    embedMode === 'pub' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Published Web mode (Requires File -> Share -> Publish to web)"
                >
                  Published Mode
                </button>
              </div>

              <a
                href={detectedDocUrl || `https://docs.google.com/document/d/${docId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-1.5 uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <span>Open in Google Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Guidance helper notice for permissions */}
          <div className="bg-slate-900 border-b border-slate-800 p-2.5 px-4 text-[11px] text-amber-200/90 flex flex-wrap items-center justify-between gap-2 font-mono">
            <span>
              💡 <strong>Quick Google Doc Sharing Guide:</strong> Make sure your Google Doc sharing is set to <strong>"Anyone with the link can view"</strong> (or go to <em>File ➔ Share ➔ Publish to web</em>).
            </span>
            <span className="text-slate-400 text-[10px]">Doc ID: {docId}</span>
          </div>

          <iframe
            src={getIframeSrc(docId, embedMode)}
            className="w-full h-[720px] border-0 bg-white"
            title="Google Doc Content Viewer"
            allow="autoplay"
          />
        </div>
      )}

      {/* RAW & PASTED HTML CONTENT RENDERER */}
      {isHtmlContent ? (
        <div
          className={`prose max-w-none ${isDarkBg ? 'text-slate-100 prose-invert' : 'text-slate-900'} 
            [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-serif [&_h1]:font-black [&_h1]:text-[#0B1E36] [&_h1]:border-b-2 [&_h1]:border-amber-500 [&_h1]:pb-2 [&_h1]:mt-6 [&_h1]:mb-4
            [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-serif [&_h2]:font-extrabold [&_h2]:text-[#0B1E36] [&_h2]:border-b [&_h2]:border-amber-400/60 [&_h2]:pb-1 [&_h2]:mt-5 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-amber-900 [&_h3]:mt-4 [&_h3]:mb-2
            [&_h4]:text-base [&_h4]:sm:text-lg [&_h4]:font-serif [&_h4]:font-bold [&_h4]:text-slate-900 [&_h4]:mt-3 [&_h4]:mb-2
            [&_p]:my-3 [&_p]:leading-relaxed [&_p]:text-sm [&_p]:sm:text-base
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-1.5 [&_ul]:text-sm [&_ul]:sm:text-base
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-1.5 [&_ol]:text-sm [&_ol]:sm:text-base
            [&_li]:leading-relaxed [&_li]:my-1
            [&_strong]:font-black [&_strong]:text-black [&_strong]:font-extrabold
            [&_b]:font-black [&_b]:text-black [&_b]:font-extrabold
            [&_em]:italic [&_em]:font-serif
            [&_blockquote]:my-4 [&_blockquote]:p-4 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-600 [&_blockquote]:bg-amber-50/80 [&_blockquote]:rounded-xs [&_blockquote]:italic [&_blockquote]:font-serif
            [&_table]:w-full [&_table]:border-2 [&_table]:border-[#0B1E36] [&_table]:my-5 [&_table]:rounded-xs [&_table]:shadow-md [&_table]:border-collapse
            [&_thead]:bg-[#0B1E36] [&_thead]:text-amber-300 [&_thead]:uppercase [&_thead]:font-mono [&_thead]:font-bold [&_thead]:text-[11px] [&_thead]:tracking-wider [&_thead]:border-b-2 [&_thead]:border-amber-500
            [&_th]:p-3 [&_th]:border [&_th]:border-slate-700 [&_th]:text-left
            [&_td]:p-3 [&_td]:border [&_td]:border-slate-300 [&_td]:text-slate-900
            [&_tr:nth-child(even)]:bg-slate-50 [&_tr:hover]:bg-amber-50/50`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        /* MARKDOWN & TEXT BLOCK PARSER */
        (() => {
          if (!content && !docId) return null;
          if (!content && docId) return null; // Already rendered doc frame above

          // Sanitize and format book text (fixes headings, equations, and paragraph spacing)
          const formattedText = sanitizeAndFormatBookText(content);

          // Split content into double-newline blocks
          const blocks = formattedText.split(/\n\s*\n/);

          return blocks.map((block, blockIdx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            const lines = trimmed.split('\n');

            // 1. Check for Markdown Table Block
            if (isMarkdownTable(lines)) {
              return renderMarkdownTable(lines, blockIdx, isDarkBg);
            }

            // 2. Check for Headings (# Heading, ## Heading, ### Heading)
            if (trimmed.startsWith('#')) {
              const levelMatch = trimmed.match(/^(#+)\s*(.*)$/);
              if (levelMatch) {
                const level = levelMatch[1].length;
                const headingText = levelMatch[2];

                if (level === 1) {
                  return (
                    <h2
                      key={blockIdx}
                      className={`font-serif font-black text-xl sm:text-2xl border-b-2 pb-1.5 mt-6 mb-3 tracking-tight ${
                        isDarkBg ? 'text-amber-300 border-amber-500/40' : 'text-[#0B1E36] border-[#0B1E36]'
                      }`}
                    >
                      {renderInlineMarkdown(headingText, isDarkBg)}
                    </h2>
                  );
                }
                if (level === 2) {
                  return (
                    <h3
                      key={blockIdx}
                      className={`font-serif font-extrabold text-lg sm:text-xl border-b pb-1 mt-5 mb-2 tracking-tight ${
                        isDarkBg ? 'text-amber-300 border-slate-700' : 'text-slate-900 border-slate-300'
                      }`}
                    >
                      {renderInlineMarkdown(headingText, isDarkBg)}
                    </h3>
                  );
                }
                return (
                  <h4
                    key={blockIdx}
                    className={`font-serif font-bold text-base sm:text-lg mt-4 mb-2 ${
                      isDarkBg ? 'text-amber-200' : 'text-[#0B1E36]'
                    }`}
                  >
                    {renderInlineMarkdown(headingText, isDarkBg)}
                  </h4>
                );
              }
            }

            // 3. Check for Blockquote (> Quote)
            if (trimmed.startsWith('>')) {
              const quoteText = trimmed.replace(/^>\s*/, '');
              return (
                <blockquote
                  key={blockIdx}
                  className={`my-4 p-4 border-l-4 rounded-xs italic font-serif text-sm sm:text-base ${
                    isDarkBg ? 'bg-slate-900 border-amber-400 text-amber-100' : 'bg-amber-50/80 border-amber-600 text-slate-900'
                  }`}
                >
                  {renderInlineMarkdown(quoteText, isDarkBg)}
                </blockquote>
              );
            }

            // 4. Check for List Items Block (starts with -, *, •, or 1.)
            const isListBlock = lines.every(
              (line) =>
                line.trim().startsWith('-') ||
                line.trim().startsWith('*') ||
                line.trim().startsWith('•') ||
                line.trim().match(/^\d+\./)
            );

            if (isListBlock) {
              return (
                <ul key={blockIdx} className="space-y-2 my-3 pl-1">
                  {lines.map((line, lIdx) => {
                    const cleanLine = line.replace(/^[\-\*\•\d\.]+\s*/, '');

                    return (
                      <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span
                          className={`font-bold font-mono text-sm shrink-0 mt-0.5 ${
                            isDarkBg ? 'text-amber-400' : 'text-[#0284C7]'
                          }`}
                        >
                          •
                        </span>
                        <div className={`flex-1 leading-relaxed ${isDarkBg ? 'text-slate-200' : 'text-slate-800'}`}>
                          {renderInlineMarkdown(cleanLine, isDarkBg)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            }

            // 5. Check for Mathematical Formula Identity Display ($$ formula $$, \[ formula \], Equation 1: ..., or \frac)
            const isEquationBlock =
              trimmed.startsWith('$$') ||
              trimmed.startsWith('\\[') ||
              trimmed.startsWith('\\begin{equation}') ||
              (trimmed.startsWith('$') && trimmed.endsWith('$')) ||
              /^Equation\s*\d*[:\.\s]/i.test(trimmed) ||
              /^Eq\.\s*\d*[:\.\s]/i.test(trimmed) ||
              /^Formula\s*[:\.\s]/i.test(trimmed);

            if (isEquationBlock) {
              const rawFormulaStr = trimmed.replace(/^(\$\$|\$|\\\[|\\begin\{equation\})|(\$\$|\$|\\\]|\\end\{equation\})$/g, '').trim();
              const formattedFormula = formatMathExpression(rawFormulaStr);

              return (
                <div
                  key={blockIdx}
                  className={`my-5 p-4 sm:p-5 border-2 rounded-xs text-center font-mono shadow-md ${
                    isDarkBg
                      ? 'bg-slate-950 border-amber-400/60 text-amber-300'
                      : 'bg-[#0B1E36] border-[#0B1E36] text-amber-300'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 mb-2 border-b border-slate-700/80 pb-1.5 flex items-center justify-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>MATHEMATICAL EQUATION & ECONOMIC IDENTITY</span>
                  </div>
                  <div className="py-2 text-base sm:text-xl font-bold tracking-wide leading-relaxed font-mono overflow-x-auto text-amber-200">
                    {formattedFormula || rawFormulaStr}
                  </div>
                </div>
              );
            }

            // 6. Regular Paragraph with Full Inline Markdown (Bold, Italics, Links, Code)
            return (
              <p
                key={blockIdx}
                className={`text-xs sm:text-sm leading-relaxed font-sans mb-3 text-justify ${
                  isDarkBg ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {renderInlineMarkdown(trimmed, isDarkBg)}
              </p>
            );
          });
        })()
      )}
    </div>
  );
};
