import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bold, Italic, Link2, Heading, Quote, List, Eye, Code, FileText, CheckCircle2 } from 'lucide-react';

interface RichArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
}

/**
 * Converts Markdown formatting (**bold**, *italic*, ### Heading, > quote, [link](url))
 * to rich HTML tags for the visual editor.
 */
function markdownToHtml(text: string): string {
  if (!text) return '';

  // 1. Triple or double asterisks with optional spaces -> <b>...</b>
  let html = text.replace(/\*{2,4}\s*([\s\S]+?)\s*\*{2,4}/g, (_match, inner) => {
    const clean = inner.replace(/^\*+|\*+$/g, '').trim();
    return `<b style="font-weight: 900; color: #000000; -webkit-text-stroke: 0.35px #000000;">${clean}</b>`;
  });

  // 2. Single asterisks for italic -> <i>...</i>
  html = html.replace(/(?<!\*)\*\s*([^\n*]+?)\s*\*(?!\*)/g, (_match, inner) => {
    return `<i>${inner.trim()}</i>`;
  });

  // 3. Any stray orphan asterisks on the sides of words are stripped
  html = html.replace(/\*{2,4}/g, '');

  // 4. Markdown links [text](url) -> <a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_match, label, url) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('/') && !cleanUrl.startsWith('#')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #0284C7; font-weight: 700; text-decoration: underline;">${label}</a>`;
  });

  // 5. Headings ### Heading -> <h3>
  html = html.replace(/^###\s*(.*)$/gm, '<h3 style="font-size: 1.15rem; font-weight: 900; color: #0B1E36; margin: 1rem 0 0.5rem 0;">$1</h3>');

  // 6. Blockquotes > quote -> <blockquote>
  html = html.replace(/^>\s*(.*)$/gm, '<blockquote style="border-left: 3px solid #0284C7; padding-left: 0.75rem; margin: 0.75rem 0; font-style: italic; color: #334155;">$1</blockquote>');

  // 7. Paragraphs: convert double newlines to paragraph breaks if not already HTML
  if (!html.includes('<p>') && !html.includes('<div>')) {
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h3') || trimmed.startsWith('<blockquote')) return trimmed;
        return `<p style="margin-bottom: 1rem; line-height: 1.75;">${trimmed.replace(/\n/g, '<br>')}</p>`;
      })
      .filter(Boolean)
      .join('');
  }

  return html;
}

/**
 * Converts HTML from contentEditable back to clean, portable text/markdown
 * ensuring bold text is stored cleanly without rogue asterisks.
 */
function htmlToCleanContent(html: string): string {
  if (!html) return '';

  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = doc.body.firstElementChild;
  if (!container) return '';

  // Process child nodes to reconstruct clean markdown/text
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Bold tags
      if (tagName === 'b' || tagName === 'strong') {
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        if (!inner) return '';
        // Return clean bold markdown without any spaces inside the asterisks
        return `**${inner.replace(/^\*+|\*+$/g, '')}**`;
      }

      // Italic tags
      if (tagName === 'i' || tagName === 'em') {
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        if (!inner) return '';
        return `*${inner.replace(/^\*+|\*+$/g, '')}*`;
      }

      // Anchors / Hyperlinks
      if (tagName === 'a') {
        const href = el.getAttribute('href') || '';
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        return href ? `[${inner || href}](${href})` : inner;
      }

      // Headings
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        return `\n\n### ${inner}\n\n`;
      }

      // Blockquotes
      if (tagName === 'blockquote') {
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        return `\n\n> ${inner}\n\n`;
      }

      // Paragraphs & Divs
      if (tagName === 'p' || tagName === 'div') {
        const inner = Array.from(el.childNodes).map(processNode).join('');
        return inner ? `\n\n${inner}` : '\n';
      }

      // Line breaks
      if (tagName === 'br') {
        return '\n';
      }

      // Lists
      if (tagName === 'li') {
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        return `\n- ${inner}`;
      }

      // Default: process all children
      return Array.from(el.childNodes).map(processNode).join('');
    }

    return '';
  };

  const clean = processNode(container)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return clean;
}

export const RichArticleEditor: React.FC<RichArticleEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or paste your article dispatch here... Highlight any text and click "Bold" or press Ctrl+B to make words darker with zero stars.',
  minHeight = '380px',
  required = false,
}) => {
  const [mode, setMode] = useState<'visual' | 'source'>('visual');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [savedSelectionRange, setSavedSelectionRange] = useState<Range | null>(null);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const sourceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalUpdate = useRef(false);

  // Initialize visual editor content when mounting or when value changes externally
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (visualEditorRef.current) {
      const targetHtml = markdownToHtml(value);
      if (visualEditorRef.current.innerHTML !== targetHtml) {
        visualEditorRef.current.innerHTML = targetHtml;
      }
    }
  }, [value, mode]);

  // Handle content changes from Visual contentEditable
  const handleVisualInput = useCallback(() => {
    if (!visualEditorRef.current) return;
    const html = visualEditorRef.current.innerHTML;
    const cleanContent = htmlToCleanContent(html);
    isInternalUpdate.current = true;
    onChange(cleanContent);
  }, [onChange]);

  // Helper to save selection before modal opens
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelectionRange(sel.getRangeAt(0));
      setLinkText(sel.toString());
    } else {
      setSavedSelectionRange(null);
      setLinkText('');
    }
  };

  // Helper to restore selection
  const restoreSelection = () => {
    if (savedSelectionRange) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange);
      }
    }
  };

  // BOLD BUTTON ACTION:
  // In Visual mode: Executes document.execCommand('bold') -> Selected words become DARKER immediately!
  // In Source mode: Wraps selected text in **clean**
  const handleBoldClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) {
        visualEditorRef.current.focus();
      }
      document.execCommand('bold', false);
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const orig = textarea.value;
      const selected = orig.substring(start, end);

      if (selected.length > 0) {
        const match = selected.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const lead = match ? match[1] : '';
        const core = match ? match[2] : selected;
        const trail = match ? match[3] : '';

        const isWrapped = core.startsWith('**') && core.endsWith('**') && core.length >= 4;
        let replacement: string;
        if (isWrapped) {
          replacement = lead + core.slice(2, -2) + trail;
        } else {
          replacement = lead + `**${core}**` + trail;
        }

        const updated = orig.substring(0, start) + replacement + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + lead.length, start + replacement.length - trail.length);
        }, 10);
      } else {
        const placeholderText = '**Bold Words**';
        const updated = orig.substring(0, start) + placeholderText + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + placeholderText.length - 2);
        }, 10);
      }
    }
  };

  // ITALIC BUTTON ACTION
  const handleItalicClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) {
        visualEditorRef.current.focus();
      }
      document.execCommand('italic', false);
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const orig = textarea.value;
      const selected = orig.substring(start, end);

      if (selected.length > 0) {
        const match = selected.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const lead = match ? match[1] : '';
        const core = match ? match[2] : selected;
        const trail = match ? match[3] : '';

        const isWrapped = core.startsWith('*') && core.endsWith('*') && !core.startsWith('**') && core.length >= 2;
        let replacement: string;
        if (isWrapped) {
          replacement = lead + core.slice(1, -1) + trail;
        } else {
          replacement = lead + `*${core}*` + trail;
        }

        const updated = orig.substring(0, start) + replacement + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + lead.length, start + replacement.length - trail.length);
        }, 10);
      } else {
        const placeholderText = '*italic words*';
        const updated = orig.substring(0, start) + placeholderText + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 1, start + placeholderText.length - 1);
        }, 10);
      }
    }
  };

  // SUBHEADING ACTION
  const handleHeadingClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) visualEditorRef.current.focus();
      document.execCommand('formatBlock', false, '<h3>');
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const orig = textarea.value;
      const insertion = '\n\n### Section Subheading\n\n';
      const updated = orig.substring(0, start) + insertion + orig.substring(start);
      onChange(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 6, start + 24);
      }, 10);
    }
  };

  // PULL QUOTE ACTION
  const handleQuoteClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) visualEditorRef.current.focus();
      document.execCommand('formatBlock', false, '<blockquote>');
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const orig = textarea.value;
      const insertion = '\n\n> "Important economic observation or Central Bank quote."\n\n';
      const updated = orig.substring(0, start) + insertion + orig.substring(start);
      onChange(updated);
    }
  };

  // BULLET POINTS ACTION
  const handleListClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) visualEditorRef.current.focus();
      document.execCommand('insertUnorderedList', false);
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const orig = textarea.value;
      const insertion = '\n- Indicator item 1\n- Indicator item 2\n- Indicator item 3\n';
      const updated = orig.substring(0, start) + insertion + orig.substring(start);
      onChange(updated);
    }
  };

  // HYPERLINK MODAL TRIGGER
  const handleOpenLinkModal = () => {
    saveCurrentSelection();
    setShowLinkModal(true);
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    let validUrl = linkUrl.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://') && !validUrl.startsWith('/') && !validUrl.startsWith('#')) {
      validUrl = 'https://' + validUrl;
    }

    if (mode === 'visual') {
      restoreSelection();
      if (visualEditorRef.current) visualEditorRef.current.focus();

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        document.execCommand('createLink', false, validUrl);
      } else {
        const textToInsert = linkText.trim() || validUrl;
        const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" style="color: #0284C7; font-weight: 700; text-decoration: underline;">${textToInsert}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      }
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const orig = textarea.value;
        const textToUse = linkText.trim() || (start !== end ? orig.substring(start, end) : 'Link Document');
        const markdown = `[${textToUse}](${validUrl})`;
        const updated = orig.substring(0, start) + markdown + orig.substring(end);
        onChange(updated);
      }
    }

    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        handleBoldClick();
      } else if (key === 'i') {
        e.preventDefault();
        handleItalicClick();
      } else if (key === 'k') {
        e.preventDefault();
        handleOpenLinkModal();
      }
    }
  };

  const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = value ? value.length : 0;

  return (
    <div className="border border-slate-300 rounded-xs bg-white shadow-2xs overflow-hidden flex flex-col">
      {/* TOOLBAR */}
      <div className="bg-[#F8F7F4] border-b border-slate-200 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Left: Quick Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* BOLD BUTTON - Prominent Amber Accent */}
          <button
            type="button"
            onClick={handleBoldClick}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black border border-amber-400 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition active:scale-95"
            title="Highlight words and click to make them DARKER & BOLD (Ctrl+B)"
          >
            <Bold className="w-4 h-4 text-amber-950 stroke-[3]" />
            <span className="font-extrabold tracking-tight">Bold (Ctrl+B)</span>
          </button>

          {/* ITALICS BUTTON */}
          <button
            type="button"
            onClick={handleItalicClick}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold italic border border-emerald-300 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95"
            title="Highlight words to make ITALIC (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
            <span>Italics (Ctrl+I)</span>
          </button>

          {/* HYPERLINK BUTTON */}
          <button
            type="button"
            onClick={handleOpenLinkModal}
            className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 font-extrabold border border-sky-300 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95"
            title="Attach a link, PDF, or reference doc (Ctrl+K)"
          >
            <Link2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Add Link</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

          {/* H3 SUBHEADING */}
          <button
            type="button"
            onClick={handleHeadingClick}
            className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 rounded-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
            title="Insert Subheading"
          >
            <Heading className="w-3.5 h-3.5 text-slate-700" />
            <span className="hidden md:inline">H3 Heading</span>
          </button>

          {/* PULL QUOTE */}
          <button
            type="button"
            onClick={handleQuoteClick}
            className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 rounded-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
            title="Insert Pull Quote"
          >
            <Quote className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline">Quote</span>
          </button>

          {/* BULLETS */}
          <button
            type="button"
            onClick={handleListClick}
            className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 rounded-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
            title="Insert Bullet List"
          >
            <List className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Bullets</span>
          </button>
        </div>

        {/* Right: Mode Switcher (Visual vs Source) */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xs border border-slate-300 text-xs">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-2.5 py-1 rounded-xs flex items-center gap-1 font-bold transition cursor-pointer ${
              mode === 'visual'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Visual WYSIWYG Mode - Words become darker when clicked"
          >
            <Eye className="w-3 h-3 text-[#0284C7]" />
            <span>Visual Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('source')}
            className={`px-2.5 py-1 rounded-xs flex items-center gap-1 font-bold transition cursor-pointer ${
              mode === 'source'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Raw Markdown / Source Mode"
          >
            <Code className="w-3 h-3 text-slate-600" />
            <span>Source Code</span>
          </button>
        </div>
      </div>

      {/* EDITOR SURFACE */}
      <div className="relative flex-1 bg-white">
        {mode === 'visual' ? (
          <div
            ref={visualEditorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleVisualInput}
            onKeyDown={handleKeyDown}
            style={{
              minHeight,
            }}
            data-placeholder={placeholder}
            className="w-full p-4 sm:p-5 text-[15px] sm:text-[16px] font-serif leading-relaxed text-slate-800 outline-none focus:bg-amber-50/5 transition overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:italic empty:before:pointer-events-none 
              [&_b]:font-black [&_b]:text-black [&_b]:font-extrabold [&_b]:tracking-tight
              [&_strong]:font-black [&_strong]:text-black [&_strong]:font-extrabold [&_strong]:tracking-tight
              [&_i]:italic [&_i]:font-serif
              [&_em]:italic [&_em]:font-serif
              [&_h3]:font-sans [&_h3]:font-black [&_h3]:text-lg [&_h3]:text-[#0B1E36] [&_h3]:mt-4 [&_h3]:mb-2
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#0284C7] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:bg-sky-50/40 [&_blockquote]:text-slate-700
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
              [&_li]:my-1
              [&_a]:text-[#0284C7] [&_a]:underline [&_a]:font-bold"
          />
        ) : (
          <textarea
            ref={sourceTextareaRef}
            rows={16}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-4 sm:p-5 text-sm font-mono leading-relaxed text-slate-900 border-0 outline-none focus:bg-amber-50/5 transition resize-y"
          />
        )}
      </div>

      {/* FOOTER BAR: Metrics & Guidance */}
      <div className="bg-[#FAF9F5] border-t border-slate-200 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-bold text-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Words get darker on Bold click (zero stars on sides)</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-900 font-semibold">Ctrl+B for <strong>Bold</strong></span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-900 font-semibold">Ctrl+I for <em>Italics</em></span>
          <span className="text-slate-300">•</span>
          <span className="text-sky-900 font-semibold">Ctrl+K for <u>Link</u></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-white border border-slate-300 px-2 py-0.5 rounded-xs font-bold text-slate-700">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-slate-400">
            {charCount} chars
          </span>
        </div>
      </div>

      {/* HYPERLINK INSERTION MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border-2 border-[#0284C7] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-sans font-black text-slate-900 text-sm flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#0284C7]" />
                <span>Insert Hyperlink or Document Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Text to Display in Article:
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Official CBSL Communique or Full Report PDF"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#0284C7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Web URL or Document Link (https://...): *
                </label>
                <input
                  type="url"
                  required
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://cbsl.gov.lk/report.pdf or https://example.com"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#0284C7] outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xs cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-xs transition"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
