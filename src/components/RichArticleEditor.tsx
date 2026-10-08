import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Link2,
  Heading,
  Quote,
  List,
  Eye,
  Code,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  Columns,
  UploadCloud,
  Loader2,
  X,
  Camera,
  Sparkles
} from 'lucide-react';

interface RichArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
}

const SRI_LANKA_STOCK_PHOTOS = [
  {
    name: 'Colombo Port ECT',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    caption: 'Colombo Port Eastern Container Terminal maritime operations'
  },
  {
    name: 'Hambantota Deep Port',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    caption: 'Hambantota International Port container throughput'
  },
  {
    name: 'Financial District / CBSL',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'Colombo financial core and central banking institutions'
  },
  {
    name: 'Ceylon Tea Export',
    url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    caption: 'Agricultural estate harvesting Ceylon tea for global markets'
  },
  {
    name: 'Renewable Solar Power',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    caption: 'Utility-scale solar power generation facility in Southern province'
  },
  {
    name: 'Stock Exchange Markets',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Colombo Stock Exchange equity market trading monitors'
  }
];

/**
 * Converts Markdown formatting (**bold**, *italic*, ### Heading, > quote, [link](url), images, side-by-side)
 * to rich HTML tags for the visual editor.
 */
function markdownToHtml(text: string): string {
  if (!text) return '';

  let html = text;

  // 1. Triple or double asterisks with optional spaces -> <b>...</b>
  html = html.replace(/\*{2,4}\s*([\s\S]+?)\s*\*{2,4}/g, (_match, inner) => {
    const clean = inner.replace(/^\*+|\*+$/g, '').trim();
    return `<b style="font-weight: 900; color: #000000; -webkit-text-stroke: 0.35px #000000;">${clean}</b>`;
  });

  // 2. Single asterisks for italic -> <i>...</i>
  html = html.replace(/(?<!\*)\*\s*([^\n*]+?)\s*\*(?!\*)/g, (_match, inner) => {
    return `<i>${inner.trim()}</i>`;
  });

  // 3. Strip any stray orphan asterisks
  html = html.replace(/\*{2,4}/g, '');

  // 4. Side-by-side images block: :::side-by-side ... ::: or :::image-grid ... :::
  html = html.replace(/:::(?:side-by-side|image-grid)(?:[^\n]*caption=["'](.*?)["'])?([\s\S]*?):::/gi, (_m, overallCap, inner) => {
    const imgMatches = Array.from(inner.matchAll(/!\[(.*?)\]\((.*?)\)/g));
    if (imgMatches.length >= 2) {
      const capAttr = overallCap ? ` data-caption="${overallCap.replace(/"/g, '&quot;')}"` : '';
      const headerHtml = overallCap
        ? `<div style="grid-column: span 2; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0284C7; font-family: monospace; padding-bottom: 6px; border-bottom: 1px solid #E2E8F0; margin-bottom: 8px;">📷 ${overallCap}</div>`
        : '';
      return `<div class="story-images-grid-2" data-layout="side-by-side"${capAttr} contenteditable="false" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0; padding: 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; user-select: none;">
        ${headerHtml}
        <figure style="margin: 0; display: flex; flex-direction: column;">
          <img src="${imgMatches[0][2]}" alt="${imgMatches[0][1] || ''}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 2px; border: 1px solid #CBD5E1;" />
          ${imgMatches[0][1] ? `<figcaption style="font-size: 11px; font-style: italic; color: #64748B; margin-top: 4px;">${imgMatches[0][1]}</figcaption>` : ''}
        </figure>
        <figure style="margin: 0; display: flex; flex-direction: column;">
          <img src="${imgMatches[1][2]}" alt="${imgMatches[1][1] || ''}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 2px; border: 1px solid #CBD5E1;" />
          ${imgMatches[1][1] ? `<figcaption style="font-size: 11px; font-style: italic; color: #64748B; margin-top: 4px;">${imgMatches[1][1]}</figcaption>` : ''}
        </figure>
      </div>`;
    }
    return _m;
  });

  // 5. Single markdown image: ![caption](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, caption, url) => {
    return `<figure class="story-inline-image" data-layout="single-image" contenteditable="false" style="margin: 18px 0; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; overflow: hidden; display: block; user-select: none;">
      <img src="${url}" alt="${caption || ''}" style="width: 100%; max-height: 420px; object-fit: cover; display: block;" />
      ${caption ? `<figcaption style="padding: 6px 12px; font-size: 11px; font-style: italic; color: #475569; background: #F1F5F9; border-top: 1px solid #CBD5E1;">📷 ${caption}</figcaption>` : ''}
    </figure>`;
  });

  // 6. Markdown links [text](url) -> <a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_match, label, url) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('/') && !cleanUrl.startsWith('#')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #0284C7; font-weight: 700; text-decoration: underline;">${label}</a>`;
  });

  // 7. Headings ### Heading -> <h3>
  html = html.replace(/^###\s*(.*)$/gm, '<h3 style="font-size: 1.15rem; font-weight: 900; color: #0B1E36; margin: 1.25rem 0 0.5rem 0;">$1</h3>');

  // 8. Blockquotes > quote -> <blockquote>
  html = html.replace(/^>\s*(.*)$/gm, '<blockquote style="border-left: 3px solid #0284C7; padding-left: 0.75rem; margin: 0.75rem 0; font-style: italic; color: #334155;">$1</blockquote>');

  // 9. Paragraphs: convert double newlines to paragraph breaks if not already HTML
  if (!html.includes('<p>') && !html.includes('<div>')) {
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h3') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<div') || trimmed.startsWith('<figure')) return trimmed;
        return `<p style="margin-bottom: 1rem; line-height: 1.75;">${trimmed.replace(/\n/g, '<br>')}</p>`;
      })
      .filter(Boolean)
      .join('');
  }

  return html;
}

/**
 * Converts HTML from contentEditable back to clean, portable text/markdown
 */
function htmlToCleanContent(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const container = doc.body.firstElementChild;
  if (!container) return '';

  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Ignore editor badge buttons
      if (el.classList && (el.classList.contains('remove-grid-badge') || el.classList.contains('remove-image-badge'))) {
        return '';
      }

      // Side-by-Side Images Grid Container
      if (
        (el.classList && el.classList.contains('story-images-grid-2')) ||
        el.getAttribute('data-layout') === 'side-by-side'
      ) {
        const overallCap = el.getAttribute('data-caption') || '';
        const imgEls = Array.from(el.querySelectorAll('img'));
        if (imgEls.length >= 2) {
          const cap1 = imgEls[0].getAttribute('alt') || '';
          const url1 = imgEls[0].getAttribute('src') || '';
          const cap2 = imgEls[1].getAttribute('alt') || '';
          const url2 = imgEls[1].getAttribute('src') || '';
          const capHeader = overallCap ? ` caption="${overallCap}"` : '';
          return `\n\n:::side-by-side${capHeader}\n![${cap1}](${url1})\n![${cap2}](${url2})\n:::\n\n`;
        }
      }

      // Single Inline Image Container
      if (
        (el.classList && el.classList.contains('story-inline-image')) ||
        tagName === 'figure' ||
        (tagName === 'img' && !el.closest('.story-images-grid-2'))
      ) {
        const imgEl = tagName === 'img' ? (el as HTMLImageElement) : el.querySelector('img');
        const capEl = el.querySelector('figcaption');
        if (imgEl) {
          const src = imgEl.getAttribute('src') || '';
          const caption = capEl?.textContent?.replace(/^📷\s*/, '').trim() || imgEl.getAttribute('alt') || '';
          return `\n\n![${caption}](${src})\n\n`;
        }
      }

      // Bold tags
      if (tagName === 'b' || tagName === 'strong') {
        const inner = Array.from(el.childNodes).map(processNode).join('').trim();
        if (!inner) return '';
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

      // Default
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
  placeholder = 'Write or paste your article dispatch here... Insert images or side-by-side photo grids anywhere in the story.',
  minHeight = '380px',
  required = false,
}) => {
  const [mode, setMode] = useState<'visual' | 'source'>('visual');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Single Image Modal State
  const [showSingleImageModal, setShowSingleImageModal] = useState(false);
  const [singleImageUrl, setSingleImageUrl] = useState('');
  const [singleImageCaption, setSingleImageCaption] = useState('');
  const [singleImagePosition, setSingleImagePosition] = useState<'middle' | 'cursor' | 'start' | 'end'>('middle');
  const [isUploadingSingle, setIsUploadingSingle] = useState(false);

  // Side-by-Side Images Modal State
  const [showSideBySideModal, setShowSideBySideModal] = useState(false);
  const [leftImageUrl, setLeftImageUrl] = useState('');
  const [leftImageCaption, setLeftImageCaption] = useState('');
  const [rightImageUrl, setRightImageUrl] = useState('');
  const [rightImageCaption, setRightImageCaption] = useState('');
  const [overallGridCaption, setOverallGridCaption] = useState('');
  const [sideBySidePosition, setSideBySidePosition] = useState<'middle' | 'cursor' | 'start' | 'end'>('middle');
  const [isUploadingLeft, setIsUploadingLeft] = useState(false);
  const [isUploadingRight, setIsUploadingRight] = useState(false);

  const [savedSelectionRange, setSavedSelectionRange] = useState<Range | null>(null);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const sourceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const leftFileInputRef = useRef<HTMLInputElement>(null);
  const rightFileInputRef = useRef<HTMLInputElement>(null);
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

  // Synchronize on visual editor user typing
  const handleVisualInput = useCallback(() => {
    if (!visualEditorRef.current) return;
    const html = visualEditorRef.current.innerHTML;
    const cleanContent = htmlToCleanContent(html);
    isInternalUpdate.current = true;
    onChange(cleanContent);
  }, [onChange]);

  // Save selection before opening modal
  const saveCurrentSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelectionRange(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined' || !savedSelectionRange) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRange);
    }
  };

  // Helper to insert markdown or HTML content at cursor or middle/start/end of story
  const insertContentAtPosition = (
    markdownSnippet: string,
    htmlSnippet: string,
    position: 'middle' | 'cursor' | 'start' | 'end' = 'middle'
  ) => {
    const cleanMd = markdownSnippet.trim();
    const cleanHtml = htmlSnippet.trim();

    if (position === 'cursor') {
      if (mode === 'visual' && savedSelectionRange) {
        restoreSelection();
        if (visualEditorRef.current) {
          visualEditorRef.current.focus();
          document.execCommand('insertHTML', false, cleanHtml + '<p><br></p>');
          handleVisualInput();
          return;
        }
      } else if (mode === 'source' && sourceTextareaRef.current) {
        const textarea = sourceTextareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const orig = textarea.value;
        const updated = orig.substring(0, start) + '\n\n' + cleanMd + '\n\n' + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + cleanMd.length + 4, start + cleanMd.length + 4);
        }, 10);
        return;
      }
      // If cursor was not explicitly focused, fall through to 'middle'
      position = 'middle';
    }

    if (mode === 'visual') {
      if (visualEditorRef.current) {
        const children = Array.from(visualEditorRef.current.children) as HTMLElement[];
        if (children.length === 0) {
          visualEditorRef.current.innerHTML = cleanHtml + '<p><br></p>';
        } else if (position === 'start') {
          children[0]?.insertAdjacentHTML('afterend', cleanHtml);
        } else if (position === 'end') {
          children[children.length - 1]?.insertAdjacentHTML('afterend', cleanHtml);
        } else {
          // 'middle' placement: find midpoint paragraph element
          const midIdx = Math.max(0, Math.floor(children.length / 2) - 1);
          const targetChild = children[midIdx] || children[0];
          targetChild?.insertAdjacentHTML('afterend', cleanHtml);
        }
        handleVisualInput();
      }
    } else {
      // Source / Markdown mode
      const rawText = value || '';
      const paragraphs = rawText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      if (paragraphs.length <= 1) {
        onChange(`${rawText.trim()}\n\n${cleanMd}`);
      } else {
        let insertIdx = 1;
        if (position === 'start') {
          insertIdx = 1;
        } else if (position === 'end') {
          insertIdx = paragraphs.length;
        } else {
          // 'middle': calculate midpoint
          insertIdx = Math.max(1, Math.floor(paragraphs.length / 2));
        }
        paragraphs.splice(insertIdx, 0, cleanMd);
        onChange(paragraphs.join('\n\n'));
      }
    }
  };

  // Apply Single Image Insertion
  const handleApplySingleImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleImageUrl.trim()) return;

    const url = singleImageUrl.trim();
    const caption = singleImageCaption.trim();

    const markdownSnippet = `\n\n![${caption}](${url})\n\n`;
    const htmlSnippet = `<figure class="story-inline-image" data-layout="single-image" contenteditable="false" style="position: relative; margin: 18px 0; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; overflow: hidden; display: block; user-select: none;">
      <span class="remove-image-badge" style="position: absolute; top: 6px; right: 6px; background: #EF4444; color: white; border-radius: 9999px; width: 22px; height: 22px; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; box-shadow: 0 1px 3px rgba(0,0,0,0.3);" title="Remove photo from story" onclick="this.closest('.story-inline-image').remove();">✕</span>
      <img src="${url}" alt="${caption}" style="width: 100%; max-height: 440px; object-fit: cover; display: block;" />
      ${caption ? `<figcaption style="padding: 6px 12px; font-size: 11px; font-style: italic; color: #475569; background: #F1F5F9; border-top: 1px solid #CBD5E1;">📷 ${caption}</figcaption>` : ''}
    </figure><p><br></p>`;

    insertContentAtPosition(markdownSnippet, htmlSnippet, singleImagePosition);

    setShowSingleImageModal(false);
    setSingleImageUrl('');
    setSingleImageCaption('');
  };

  // Apply Side-by-Side Images Insertion
  const handleApplySideBySide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leftImageUrl.trim() || !rightImageUrl.trim()) return;

    const url1 = leftImageUrl.trim();
    const cap1 = leftImageCaption.trim();
    const url2 = rightImageUrl.trim();
    const cap2 = rightImageCaption.trim();
    const overallCap = overallGridCaption.trim();

    const capAttr = overallCap ? ` caption="${overallCap}"` : '';
    const markdownSnippet = `\n\n:::side-by-side${capAttr}\n![${cap1}](${url1})\n![${cap2}](${url2})\n:::\n\n`;

    const overallHeader = overallCap
      ? `<div style="grid-column: span 2; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0284C7; font-family: monospace; padding-bottom: 6px; border-bottom: 1px solid #E2E8F0; margin-bottom: 8px;">📷 ${overallCap}</div>`
      : '';

    const htmlSnippet = `<div class="story-images-grid-2" data-layout="side-by-side"${overallCap ? ` data-caption="${overallCap.replace(/"/g, '&quot;')}"` : ''} contenteditable="false" style="position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0; padding: 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 4px; user-select: none;">
      <span class="remove-grid-badge" style="position: absolute; top: 6px; right: 6px; background: #EF4444; color: white; border-radius: 9999px; width: 22px; height: 22px; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; box-shadow: 0 1px 3px rgba(0,0,0,0.3);" title="Remove side-by-side images" onclick="this.closest('.story-images-grid-2').remove();">✕</span>
      ${overallHeader}
      <figure style="margin: 0; display: flex; flex-direction: column;">
        <img src="${url1}" alt="${cap1}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 2px; border: 1px solid #CBD5E1;" />
        ${cap1 ? `<figcaption style="font-size: 11px; font-style: italic; color: #64748B; margin-top: 4px;">${cap1}</figcaption>` : ''}
      </figure>
      <figure style="margin: 0; display: flex; flex-direction: column;">
        <img src="${url2}" alt="${cap2}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 2px; border: 1px solid #CBD5E1;" />
        ${cap2 ? `<figcaption style="font-size: 11px; font-style: italic; color: #64748B; margin-top: 4px;">${cap2}</figcaption>` : ''}
      </figure>
    </div><p><br></p>`;

    insertContentAtPosition(markdownSnippet, htmlSnippet, sideBySidePosition);

    setShowSideBySideModal(false);
    setLeftImageUrl('');
    setLeftImageCaption('');
    setRightImageUrl('');
    setRightImageCaption('');
    setOverallGridCaption('');
  };

  // Upload handler for single image
  const handleUploadSingleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSingle(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/articles/upload-inline-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64Data,
            fileName: file.name,
            caption: singleImageCaption || file.name.replace(/\.[^/.]+$/, ''),
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          setSingleImageUrl(data.url);
          if (!singleImageCaption && data.caption) {
            setSingleImageCaption(data.caption);
          }
        } else {
          setSingleImageUrl(base64Data);
        }
      } catch {
        setSingleImageUrl(base64Data);
      } finally {
        setIsUploadingSingle(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload handler for side-by-side left/right
  const handleUploadSideFile = async (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (side === 'left') setIsUploadingLeft(true);
    else setIsUploadingRight(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/articles/upload-inline-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64Data,
            fileName: file.name,
            caption: (side === 'left' ? leftImageCaption : rightImageCaption) || file.name.replace(/\.[^/.]+$/, ''),
          }),
        });
        const data = await res.json();
        const urlToUse = data.success && data.url ? data.url : base64Data;
        if (side === 'left') {
          setLeftImageUrl(urlToUse);
          if (!leftImageCaption && data.caption) setLeftImageCaption(data.caption);
        } else {
          setRightImageUrl(urlToUse);
          if (!rightImageCaption && data.caption) setRightImageCaption(data.caption);
        }
      } catch {
        if (side === 'left') setLeftImageUrl(base64Data);
        else setRightImageUrl(base64Data);
      } finally {
        if (side === 'left') setIsUploadingLeft(false);
        else setIsUploadingRight(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // BOLD ACTION
  const handleBoldClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) visualEditorRef.current.focus();
      document.execCommand('bold', false);
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const orig = textarea.value;

      if (start !== end) {
        const selected = orig.substring(start, end);
        const cleanSelected = selected.replace(/^\*+|\*+$/g, '').trim();
        const replacement = `**${cleanSelected}**`;
        const updated = orig.substring(0, start) + replacement + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + replacement.length - 2);
        }, 10);
      } else {
        const placeholderText = '**bold words**';
        const updated = orig.substring(0, start) + placeholderText + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + placeholderText.length - 2);
        }, 10);
      }
    }
  };

  // ITALIC ACTION
  const handleItalicClick = () => {
    if (mode === 'visual') {
      if (visualEditorRef.current) visualEditorRef.current.focus();
      document.execCommand('italic', false);
      handleVisualInput();
    } else {
      const textarea = sourceTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const orig = textarea.value;

      if (start !== end) {
        const selected = orig.substring(start, end);
        const cleanSelected = selected.replace(/^\*+|\*+$/g, '').trim();
        const replacement = `*${cleanSelected}*`;
        const updated = orig.substring(0, start) + replacement + orig.substring(end);
        onChange(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 1, start + replacement.length - 1);
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

  // Keyboard shortcuts
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
          {/* BOLD BUTTON */}
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

          {/* INSERT SINGLE IMAGE BUTTON */}
          <button
            type="button"
            onClick={() => {
              saveCurrentSelection();
              setShowSingleImageModal(true);
            }}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-950 font-black border border-purple-300 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95"
            title="Insert 1 Image in the middle of story"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
            <span>1 Image (Middle)</span>
          </button>

          {/* INSERT 2 IMAGES SIDE BY SIDE BUTTON */}
          <button
            type="button"
            onClick={() => {
              saveCurrentSelection();
              setShowSideBySideModal(true);
            }}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black border border-indigo-400 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95"
            title="Insert 2 Images Side-by-Side in the middle of story"
          >
            <Columns className="w-3.5 h-3.5 text-indigo-700" />
            <span className="font-extrabold">2 Images (Side by Side)</span>
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
            title="Visual WYSIWYG Mode"
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
      <div className="relative min-h-[360px] bg-white flex flex-col">
        {mode === 'visual' ? (
          <div
            ref={visualEditorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleVisualInput}
            onKeyDown={handleKeyDown}
            style={{ minHeight }}
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
            <span>Images and side-by-side grids render in story feed & full view</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-purple-900 font-semibold">1 Image (Middle)</span>
          <span className="text-slate-300">•</span>
          <span className="text-indigo-900 font-semibold">2 Images Side by Side</span>
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

      {/* MODAL 1: SINGLE IMAGE INSERTION MODAL */}
      {showSingleImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xs border-2 border-purple-500 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-sans font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Add 1 Image in Middle of Story</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSingleImageModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySingleImage} className="space-y-4">
              {/* Image Source Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Image URL or Upload from Computer: *
                  </label>
                  <button
                    type="button"
                    onClick={() => singleFileInputRef.current?.click()}
                    disabled={isUploadingSingle}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-xs"
                  >
                    {isUploadingSingle ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                    <span>Upload File</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={singleFileInputRef}
                  accept="image/*"
                  onChange={handleUploadSingleFile}
                  className="hidden"
                />
                <input
                  type="text"
                  required
                  value={singleImageUrl}
                  onChange={(e) => setSingleImageUrl(e.target.value)}
                  placeholder="https://... or /uploads/image.jpg"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-purple-500 outline-none font-mono"
                />
              </div>

              {/* Quick Preset Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Quick Macro Stock Presets:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {SRI_LANKA_STOCK_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSingleImageUrl(p.url);
                        if (!singleImageCaption) setSingleImageCaption(p.caption);
                      }}
                      className="text-left text-[10px] font-medium p-1.5 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xs transition truncate cursor-pointer"
                      title={p.caption}
                    >
                      <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Caption / Photo Credit:
                </label>
                <input
                  type="text"
                  value={singleImageCaption}
                  onChange={(e) => setSingleImageCaption(e.target.value)}
                  placeholder="e.g. Construction ongoing at Eastern Container Terminal (Photo: SLPA / EconMatrix)"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                />
              </div>

              {/* Where to insert position */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Position in Story:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <label
                    onClick={() => setSingleImagePosition('middle')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      singleImagePosition === 'middle'
                        ? 'bg-purple-100 border-purple-500 text-purple-950 ring-1 ring-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="singlePos"
                      checked={singleImagePosition === 'middle'}
                      onChange={() => setSingleImagePosition('middle')}
                      className="text-purple-600"
                    />
                    <span>Story Middle</span>
                  </label>
                  <label
                    onClick={() => setSingleImagePosition('cursor')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      singleImagePosition === 'cursor'
                        ? 'bg-purple-100 border-purple-500 text-purple-950 ring-1 ring-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="singlePos"
                      checked={singleImagePosition === 'cursor'}
                      onChange={() => setSingleImagePosition('cursor')}
                      className="text-purple-600"
                    />
                    <span>At Cursor</span>
                  </label>
                  <label
                    onClick={() => setSingleImagePosition('start')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      singleImagePosition === 'start'
                        ? 'bg-purple-100 border-purple-500 text-purple-950 ring-1 ring-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="singlePos"
                      checked={singleImagePosition === 'start'}
                      onChange={() => setSingleImagePosition('start')}
                      className="text-purple-600"
                    />
                    <span>Below Lead</span>
                  </label>
                  <label
                    onClick={() => setSingleImagePosition('end')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      singleImagePosition === 'end'
                        ? 'bg-purple-100 border-purple-500 text-purple-950 ring-1 ring-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="singlePos"
                      checked={singleImagePosition === 'end'}
                      onChange={() => setSingleImagePosition('end')}
                      className="text-purple-600"
                    />
                    <span>At Story End</span>
                  </label>
                </div>
              </div>

              {/* Live Preview */}
              {singleImageUrl && (
                <div className="border border-slate-200 rounded-xs overflow-hidden bg-slate-50 p-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                    Live Preview:
                  </span>
                  <img
                    src={singleImageUrl}
                    alt={singleImageCaption || 'Preview'}
                    className="w-full max-h-48 object-cover rounded-xs border border-slate-300"
                  />
                  {singleImageCaption && (
                    <p className="mt-1 text-xs italic text-slate-600 font-sans">
                      📷 {singleImageCaption}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSingleImageModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xs cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!singleImageUrl.trim()}
                  className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-xs transition"
                >
                  Insert Image Into Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 2 IMAGES SIDE-BY-SIDE INSERTION MODAL */}
      {showSideBySideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xs border-2 border-indigo-500 shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-sans font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Columns className="w-4 h-4 text-indigo-600" />
                <span>Add 2 Images Side by Side in Middle of Story</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSideBySideModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySideBySide} className="space-y-4">
              {/* Overall Group Caption (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Group Caption / Headline (Optional):
                </label>
                <input
                  type="text"
                  value={overallGridCaption}
                  onChange={(e) => setOverallGridCaption(e.target.value)}
                  placeholder="e.g. Maritime Infrastructure: Colombo Port vs Hambantota Port expansion"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* 2-Columns Side-by-Side Configuration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LEFT IMAGE BOX */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-black uppercase text-indigo-900 font-mono flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>1. Left Image *</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => leftFileInputRef.current?.click()}
                      disabled={isUploadingLeft}
                      className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded-xs"
                    >
                      {isUploadingLeft ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                      <span>Upload</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={leftFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleUploadSideFile(e, 'left')}
                    className="hidden"
                  />

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Image URL:</label>
                    <input
                      type="text"
                      required
                      value={leftImageUrl}
                      onChange={(e) => setLeftImageUrl(e.target.value)}
                      placeholder="https://... or /uploads/..."
                      className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-900 font-mono outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Left Caption:</label>
                    <input
                      type="text"
                      value={leftImageCaption}
                      onChange={(e) => setLeftImageCaption(e.target.value)}
                      placeholder="e.g. Colombo Port ECT terminal berth"
                      className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Quick Preset Buttons for Left */}
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLeftImageUrl(SRI_LANKA_STOCK_PHOTOS[0].url);
                        setLeftImageCaption(SRI_LANKA_STOCK_PHOTOS[0].caption);
                      }}
                      className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-300 hover:bg-indigo-50 text-slate-700 rounded-xs"
                    >
                      Colombo Port
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLeftImageUrl(SRI_LANKA_STOCK_PHOTOS[2].url);
                        setLeftImageCaption(SRI_LANKA_STOCK_PHOTOS[2].caption);
                      }}
                      className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-300 hover:bg-indigo-50 text-slate-700 rounded-xs"
                    >
                      Central Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLeftImageUrl(SRI_LANKA_STOCK_PHOTOS[3].url);
                        setLeftImageCaption(SRI_LANKA_STOCK_PHOTOS[3].caption);
                      }}
                      className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-300 hover:bg-indigo-50 text-slate-700 rounded-xs"
                    >
                      Ceylon Tea
                    </button>
                  </div>
                </div>

                {/* RIGHT IMAGE BOX */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-black uppercase text-indigo-900 font-mono flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>2. Right Image *</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => rightFileInputRef.current?.click()}
                      disabled={isUploadingRight}
                      className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 rounded-xs"
                    >
                      {isUploadingRight ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                      <span>Upload</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={rightFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleUploadSideFile(e, 'right')}
                    className="hidden"
                  />

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Image URL:</label>
                    <input
                      type="text"
                      required
                      value={rightImageUrl}
                      onChange={(e) => setRightImageUrl(e.target.value)}
                      placeholder="https://... or /uploads/..."
                      className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-900 font-mono outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Right Caption:</label>
                    <input
                      type="text"
                      value={rightImageCaption}
                      onChange={(e) => setRightImageCaption(e.target.value)}
                      placeholder="e.g. Hambantota deep water dock"
                      className="w-full bg-white border border-slate-300 px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Quick Preset Buttons for Right */}
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRightImageUrl(SRI_LANKA_STOCK_PHOTOS[1].url);
                        setRightImageCaption(SRI_LANKA_STOCK_PHOTOS[1].caption);
                      }}
                      className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-300 hover:bg-indigo-50 text-slate-700 rounded-xs"
                    >
                      Hambantota Port
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRightImageUrl(SRI_LANKA_STOCK_PHOTOS[4].url);
                        setRightImageCaption(SRI_LANKA_STOCK_PHOTOS[4].caption);
                      }}
                      className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-300 hover:bg-indigo-50 text-slate-700 rounded-xs"
                    >
                      Solar Energy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRightImageUrl(SRI_LANKA_STOCK_PHOTOS[5].url);
                        setRightImageCaption(SRI_LANKA_STOCK_PHOTOS[5].caption);
                      }}
                      className="text-[9.5px] px-1.5 py-0.5 bg-white border border-slate-300 hover:bg-indigo-50 text-slate-700 rounded-xs"
                    >
                      Stock Exchange
                    </button>
                  </div>
                </div>
              </div>

              {/* Where to insert position */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Position in Story:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <label
                    onClick={() => setSideBySidePosition('middle')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      sideBySidePosition === 'middle'
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sidePos"
                      checked={sideBySidePosition === 'middle'}
                      onChange={() => setSideBySidePosition('middle')}
                      className="text-indigo-600"
                    />
                    <span>Story Middle</span>
                  </label>
                  <label
                    onClick={() => setSideBySidePosition('cursor')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      sideBySidePosition === 'cursor'
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sidePos"
                      checked={sideBySidePosition === 'cursor'}
                      onChange={() => setSideBySidePosition('cursor')}
                      className="text-indigo-600"
                    />
                    <span>At Cursor</span>
                  </label>
                  <label
                    onClick={() => setSideBySidePosition('start')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      sideBySidePosition === 'start'
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sidePos"
                      checked={sideBySidePosition === 'start'}
                      onChange={() => setSideBySidePosition('start')}
                      className="text-indigo-600"
                    />
                    <span>Below Lead</span>
                  </label>
                  <label
                    onClick={() => setSideBySidePosition('end')}
                    className={`flex items-center gap-1.5 p-2 rounded-xs border cursor-pointer font-bold transition ${
                      sideBySidePosition === 'end'
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sidePos"
                      checked={sideBySidePosition === 'end'}
                      onChange={() => setSideBySidePosition('end')}
                      className="text-indigo-600"
                    />
                    <span>At Story End</span>
                  </label>
                </div>
              </div>

              {/* Live Side-by-Side Preview */}
              {(leftImageUrl || rightImageUrl) && (
                <div className="border border-slate-200 rounded-xs overflow-hidden bg-slate-100/60 p-3">
                  <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-2 font-mono">
                    Live Side-by-Side Preview:
                  </span>
                  {overallGridCaption && (
                    <div className="text-xs font-black uppercase text-indigo-700 font-mono mb-2">
                      📷 {overallGridCaption}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-1 border border-slate-300 rounded-xs">
                      {leftImageUrl ? (
                        <>
                          <img
                            src={leftImageUrl}
                            alt={leftImageCaption || 'Left'}
                            className="w-full aspect-[16/10] object-cover rounded-xs"
                          />
                          {leftImageCaption && (
                            <p className="mt-1 text-[10.5px] italic text-slate-600 truncate font-sans">
                              {leftImageCaption}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="aspect-[16/10] flex items-center justify-center text-slate-400 text-xs italic bg-slate-50">
                          Waiting for left image...
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-1 border border-slate-300 rounded-xs">
                      {rightImageUrl ? (
                        <>
                          <img
                            src={rightImageUrl}
                            alt={rightImageCaption || 'Right'}
                            className="w-full aspect-[16/10] object-cover rounded-xs"
                          />
                          {rightImageCaption && (
                            <p className="mt-1 text-[10.5px] italic text-slate-600 truncate font-sans">
                              {rightImageCaption}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="aspect-[16/10] flex items-center justify-center text-slate-400 text-xs italic bg-slate-50">
                          Waiting for right image...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSideBySideModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xs cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!leftImageUrl.trim() || !rightImageUrl.trim()}
                  className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-xs transition"
                >
                  Insert 2 Images Side by Side
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
