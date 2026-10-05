import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

/**
 * Parses article text paragraphs to render rich formatting:
 * - [Anchor Text](URL) -> Styled clickable document/hyperlink (opens in new tab)
 * - **bold** -> <strong>
 * - *italic* -> <em>
 * - `code` -> <code>
 * - Standalone URLs -> Clickable links
 */
export const renderArticleParagraph = (text: string, isDarkBg = false): React.ReactNode => {
  if (!text) return null;

  // Regex to match ***bold***, **bold**, *italic*, `code`, [text](url), <b>text</b>, <strong>text</strong>, or standalone URLs (https?://\S+)
  const regex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|<b\b[^>]*>.*?<\/b>|<strong\b[^>]*>.*?<\/strong>|https?:\/\/[^\s<]+[^<.,:;"')\]\s])/gi;
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
          className={`font-black font-extrabold tracking-tight ${isDarkBg ? 'text-white' : 'text-black'}`}
          style={{ color: isDarkBg ? '#FFFFFF' : '#000000', fontWeight: 900 }}
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
          className={`font-black font-extrabold tracking-tight ${isDarkBg ? 'text-white' : 'text-black'}`}
          style={{ color: isDarkBg ? '#FFFFFF' : '#000000', fontWeight: 900 }}
        >
          {inner}
        </strong>
      );
    }

    // Italic *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length >= 2) {
      return (
        <em key={i} className="italic font-serif">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline Code `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
            isDarkBg ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-800 border border-slate-200'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown Link [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const linkText = match[1];
        let linkUrl = match[2];
        if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://') && !linkUrl.startsWith('/') && !linkUrl.startsWith('#')) {
          linkUrl = 'https://' + linkUrl;
        }
        const isDoc = linkUrl.toLowerCase().includes('.pdf') || 
                      linkUrl.toLowerCase().includes('drive.google.com') || 
                      linkUrl.toLowerCase().includes('docs.google.com') ||
                      linkUrl.toLowerCase().includes('dropbox.com') ||
                      linkUrl.toLowerCase().includes('box.com');

        return (
          <a
            key={i}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={isDoc ? `View source document: ${linkText}` : `Open link: ${linkUrl}`}
            className={`font-semibold underline underline-offset-2 transition-all inline-flex items-center gap-1 mx-0.5 group/link cursor-pointer ${
              isDarkBg
                ? 'text-sky-400 hover:text-sky-300 decoration-sky-500/50 hover:decoration-sky-400'
                : 'text-[#0284C7] hover:text-[#0369A1] decoration-sky-400/60 hover:decoration-[#0284C7]'
            }`}
          >
            {isDoc ? (
              <FileText className="w-3.5 h-3.5 inline shrink-0 opacity-80 group-hover/link:scale-110 transition-transform" />
            ) : null}
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0 opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
          </a>
        );
      }
    }

    // Standalone URL
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`font-medium underline underline-offset-2 transition-all inline-flex items-center gap-0.5 mx-0.5 ${
            isDarkBg ? 'text-sky-400 hover:text-sky-300' : 'text-[#0284C7] hover:text-[#0369A1]'
          }`}
        >
          <span>{part.length > 40 ? part.slice(0, 38) + '...' : part}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-70" />
        </a>
      );
    }

    return part;
  });
};
