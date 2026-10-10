import React, { useState } from 'react';
import { ExternalLink, FileText, Camera, ZoomIn, X, Columns, Download } from 'lucide-react';

export interface InlineImageData {
  url: string;
  caption?: string;
  alt?: string;
}

export interface SideBySideImagesData {
  image1: InlineImageData;
  image2: InlineImageData;
  overallCaption?: string;
}

/**
 * Image Lightbox Modal for viewing inline article photos in full resolution
 */
export const ImageLightboxModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
}> = ({ isOpen, onClose, imageUrl, caption }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 sm:p-6 transition-all"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <a
          href={imageUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition shadow-md"
          title="Open or download original image"
        >
          <Download className="w-5 h-5" />
        </a>
        <button
          onClick={onClose}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition shadow-md cursor-pointer"
          title="Close preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={caption || 'Article photo view'}
          className="max-w-full max-h-[75vh] object-contain rounded-sm shadow-2xl border border-slate-700"
        />
        {caption && (
          <p className="mt-3 text-center text-xs sm:text-sm text-slate-300 font-sans italic max-w-2xl px-4 py-1.5 bg-slate-900/80 rounded-sm border border-slate-800">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};

export const ImageZoomModal = ImageLightboxModal;

/**
 * Parses article text paragraphs to render rich formatting:
 * - **bold** / ***bold*** / <b>bold</b> / <strong>bold</strong> -> Refined bold text (#0F172A / text-slate-900, one tone lighter than pitch black and darker than body text) with ZERO stars on sides
 * - *italic* / <i>italic</i> / <em>italic</em> -> Italicized text
 * - [Anchor Text](URL) -> Styled clickable document/hyperlink (opens in new tab)
 * - `code` -> Inline code badge
 * - Standalone URLs -> Clickable links
 */
export const renderArticleParagraph = (text: string, isDarkBg = false): React.ReactNode => {
  if (!text) return null;

  // 1. Pre-process to normalize all bold patterns (***word***, **word**, ** word **, *** 1,002,232 ***) into <b>...</b>
  let processed = text.replace(/\*{2,4}\s*([\s\S]+?)\s*\*{2,4}/g, (_match, inner) => {
    const clean = inner.replace(/^\*+|\*+$/g, '').trim();
    return `<b>${clean}</b>`;
  });

  // 2. Pre-process single-star italic patterns (*word*, * word *) into <i>...</i>
  processed = processed.replace(/(?<!\*)\*\s*([^\n*]+?)\s*\*(?!\*)/g, (_match, inner) => {
    const clean = inner.replace(/^\*+|\*+$/g, '').trim();
    return `<i>${clean}</i>`;
  });

  // 3. Strip any orphan/stray asterisks so no stars can ever show on the sides
  processed = processed.replace(/\*{2,4}/g, '');

  // 4. Split by formatting tokens (HTML anchors, bold, italic, markdown links, code, standalone URLs)
  const regex = /(<a\b[^>]*>[\s\S]*?<\/a>|<b\b[^>]*>[\s\S]*?<\/b>|<strong\b[^>]*>[\s\S]*?<\/strong>|<i\b[^>]*>[\s\S]*?<\/i>|<em\b[^>]*>[\s\S]*?<\/em>|\[.*?\]\(.*?\)|\`[^\`]+\`|https?:\/\/[^\s<]+[^<.,:;"')\]\s])/gi;
  const parts = processed.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // HTML Anchor tag <a href="...">...</a>
    if (/^<a\b[^>]*>[\s\S]*?<\/a>$/i.test(part)) {
      const hrefMatch = part.match(/href=["'](.*?)["']/i);
      const innerMatch = part.match(/^<a\b[^>]*>([\s\S]*?)<\/a>$/i);
      let linkUrl = hrefMatch ? hrefMatch[1].trim() : '#';
      const linkLabel = innerMatch ? innerMatch[1].trim() : linkUrl;

      if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://') && !linkUrl.startsWith('/') && !linkUrl.startsWith('#')) {
        linkUrl = 'https://' + linkUrl;
      }

      const isDoc =
        linkUrl.toLowerCase().includes('.pdf') ||
        linkUrl.toLowerCase().includes('drive.google.com') ||
        linkUrl.toLowerCase().includes('docs.google.com') ||
        linkUrl.toLowerCase().includes('dropbox.com') ||
        linkUrl.toLowerCase().includes('box.com');

      return (
        <a
          key={`anchor-${i}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={isDoc ? `View source document: ${linkLabel}` : `Open link: ${linkUrl}`}
          className={`font-semibold underline underline-offset-2 transition-all inline-flex items-center gap-1 mx-0.5 group/link cursor-pointer ${
            isDarkBg
              ? 'text-sky-400 hover:text-sky-300 decoration-sky-500/50 hover:decoration-sky-400'
              : 'text-[#0284C7] hover:text-[#0369A1] decoration-sky-400/60 hover:decoration-[#0284C7]'
          }`}
        >
          {isDoc ? (
            <FileText className="w-3.5 h-3.5 inline shrink-0 opacity-80 group-hover/link:scale-110 transition-transform" />
          ) : null}
          <span>{linkLabel}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0 opacity-70 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
        </a>
      );
    }

    // Bold tags <b>...</b> or <strong>...</strong>
    if (/^<(b|strong)\b[^>]*>[\s\S]*?<\/\1>$/i.test(part)) {
      const inner = part
        .replace(/^<[^>]+>|<\/[^>]+>$/g, '')
        .replace(/^\*+|\*+$/g, '')
        .trim();

      return (
        <strong
          key={i}
          className={`font-bold tracking-tight ${isDarkBg ? 'text-slate-100' : 'text-slate-800'}`}
          style={{
            color: isDarkBg ? '#F1F5F9' : '#1E293B',
            fontWeight: 700,
          }}
        >
          {inner}
        </strong>
      );
    }

    // Italic tags <i>...</i> or <em>...</em>
    if (/^<(i|em)\b[^>]*>[\s\S]*?<\/\1>$/i.test(part)) {
      const inner = part
        .replace(/^<[^>]+>|<\/[^>]+>$/g, '')
        .replace(/^\*+|\*+$/g, '')
        .trim();

      return (
        <em key={i} className="italic font-serif">
          {inner}
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
        const isDoc =
          linkUrl.toLowerCase().includes('.pdf') ||
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

    // Clean plain text: ensure no rogue asterisks remain on sides
    const cleanText = part.replace(/\*{1,4}/g, '');
    return cleanText;
  });
};

/**
 * Single Inline Image component with zoom preview and caption bar
 */
export const StorySingleImageBlock: React.FC<{
  image: InlineImageData;
  isDarkBg?: boolean;
}> = ({ image, isDarkBg = false }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      <figure
        className={`my-8 group relative rounded-sm overflow-hidden border shadow-xs transition-all ${
          isDarkBg
            ? 'bg-slate-900 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div
          className="relative overflow-hidden cursor-pointer"
          onClick={() => setIsZoomOpen(true)}
          title="Click to view full-resolution photo"
        >
          <img
            src={image.url}
            alt={image.caption || image.alt || 'Story photo'}
            loading="lazy"
            className="w-full h-auto max-h-[580px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.005]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1 font-mono">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Enlarge</span>
            </span>
          </div>
        </div>

        {image.caption && (
          <figcaption
            className={`px-4 py-2.5 border-t text-xs font-sans italic flex items-center justify-between gap-3 ${
              isDarkBg
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-slate-100/80 border-slate-200 text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-sky-500 shrink-0 inline" />
              <span>{image.caption}</span>
            </span>
            <button
              onClick={() => setIsZoomOpen(true)}
              className="text-[11px] font-mono text-sky-500 hover:text-sky-600 transition shrink-0 cursor-pointer"
            >
              Zoom
            </button>
          </figcaption>
        )}
      </figure>

      <ImageLightboxModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageUrl={image.url}
        caption={image.caption}
      />
    </>
  );
};

/**
 * 2 Images Side-by-Side Responsive Grid component with synchronized height, captions, and zoom
 */
export const StorySideBySideImagesBlock: React.FC<{
  data: SideBySideImagesData;
  isDarkBg?: boolean;
}> = ({ data, isDarkBg = false }) => {
  const [activeZoomUrl, setActiveZoomUrl] = useState<string | null>(null);
  const [activeZoomCaption, setActiveZoomCaption] = useState<string | undefined>(undefined);

  return (
    <>
      <div
        className={`my-8 p-3 sm:p-4 rounded-sm border shadow-xs transition-all ${
          isDarkBg
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-slate-50/80 border-slate-200'
        }`}
      >
        {/* Optional Overall Group Caption Header */}
        {data.overallCaption && (
          <div
            className={`flex items-center gap-2 mb-3 pb-2 border-b text-xs font-black uppercase tracking-wider font-mono ${
              isDarkBg
                ? 'text-sky-300 border-slate-800'
                : 'text-slate-800 border-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span>{data.overallCaption}</span>
          </div>
        )}

        {/* 2-Column Responsive Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
          {/* Left / First Image */}
          <div className="flex flex-col group">
            <div
              className={`relative overflow-hidden rounded-sm border aspect-[16/10] sm:aspect-[4/3] cursor-pointer bg-slate-200 dark:bg-slate-800 ${
                isDarkBg ? 'border-slate-800' : 'border-slate-200'
              }`}
              onClick={() => {
                setActiveZoomUrl(data.image1.url);
                setActiveZoomCaption(data.image1.caption || data.overallCaption);
              }}
              title="Click to view photo 1 in full resolution"
            >
              <img
                src={data.image1.url}
                alt={data.image1.caption || 'Left photo'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1 font-mono">
                  <ZoomIn className="w-3 h-3" />
                  <span>Enlarge</span>
                </span>
              </div>
            </div>

            {data.image1.caption && (
              <p
                className={`mt-2 text-xs font-sans italic flex items-center gap-1.5 px-1 leading-snug ${
                  isDarkBg ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <Camera className="w-3 h-3 text-sky-500 shrink-0 inline" />
                <span>{data.image1.caption}</span>
              </p>
            )}
          </div>

          {/* Right / Second Image */}
          <div className="flex flex-col group">
            <div
              className={`relative overflow-hidden rounded-sm border aspect-[16/10] sm:aspect-[4/3] cursor-pointer bg-slate-200 dark:bg-slate-800 ${
                isDarkBg ? 'border-slate-800' : 'border-slate-200'
              }`}
              onClick={() => {
                setActiveZoomUrl(data.image2.url);
                setActiveZoomCaption(data.image2.caption || data.overallCaption);
              }}
              title="Click to view photo 2 in full resolution"
            >
              <img
                src={data.image2.url}
                alt={data.image2.caption || 'Right photo'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1 font-mono">
                  <ZoomIn className="w-3 h-3" />
                  <span>Enlarge</span>
                </span>
              </div>
            </div>

            {data.image2.caption && (
              <p
                className={`mt-2 text-xs font-sans italic flex items-center gap-1.5 px-1 leading-snug ${
                  isDarkBg ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <Camera className="w-3 h-3 text-sky-500 shrink-0 inline" />
                <span>{data.image2.caption}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <ImageLightboxModal
        isOpen={Boolean(activeZoomUrl)}
        onClose={() => {
          setActiveZoomUrl(null);
          setActiveZoomCaption(undefined);
        }}
        imageUrl={activeZoomUrl || ''}
        caption={activeZoomCaption}
      />
    </>
  );
};

export type StoryBlock =
  | { type: 'side-by-side-images'; data: SideBySideImagesData }
  | { type: 'single-image'; data: InlineImageData }
  | { type: 'heading'; text: string; level: number }
  | { type: 'quote'; text: string }
  | { type: 'paragraph'; text: string };

/**
 * Extracts inline images, 2 side-by-side images, headings, quotes, and paragraphs from article body
 */
export function parseArticleBodyBlocks(body: string): StoryBlock[] {
  if (!body) return [];

  const rawBlocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const blocks: StoryBlock[] = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    const raw = rawBlocks[i];

    // 1. Check for :::side-by-side block or :::image-grid block
    // Syntax:
    // :::side-by-side caption="Overall caption"
    // ![Caption 1](url1)
    // ![Caption 2](url2)
    // :::
    const sideBySideBlockMatch = raw.match(/^:::(?:side-by-side|image-grid)(?:[^\n]*caption=["'](.*?)["'])?([\s\S]*?):::$/i);
    if (sideBySideBlockMatch) {
      const overallCap = sideBySideBlockMatch[1] || undefined;
      const innerContent = sideBySideBlockMatch[2] || '';
      const imgMatches = Array.from(innerContent.matchAll(/!\[(.*?)\]\((.*?)\)/g));

      if (imgMatches.length >= 2) {
        blocks.push({
          type: 'side-by-side-images',
          data: {
            overallCaption: overallCap,
            image1: { caption: imgMatches[0][1] || undefined, url: imgMatches[0][2].trim() },
            image2: { caption: imgMatches[1][1] || undefined, url: imgMatches[1][2].trim() },
          },
        });
        continue;
      }
    }

    // 2. Check for HTML 2-images side-by-side grid
    // <div class="story-images-grid-2" data-caption="...">...</div>
    const htmlGridMatch = raw.match(/<div\b[^>]*(?:story-images-grid|story-side-by-side)[^>]*>([\s\S]*?)<\/div>/i);
    if (htmlGridMatch) {
      const capMatch = raw.match(/data-caption=["'](.*?)["']/i);
      const overallCap = capMatch ? capMatch[1] : undefined;
      const imgMatches = Array.from(raw.matchAll(/<img\b[^>]*src=["'](.*?)["'][^>]*(?:alt=["'](.*?)["'])?/gi));
      const figcaps = Array.from(raw.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/gi)).map((m) => m[1]);

      if (imgMatches.length >= 2) {
        blocks.push({
          type: 'side-by-side-images',
          data: {
            overallCaption: overallCap,
            image1: { url: imgMatches[0][1].trim(), caption: figcaps[0] || imgMatches[0][2] || undefined },
            image2: { url: imgMatches[1][1].trim(), caption: figcaps[1] || imgMatches[1][2] || undefined },
          },
        });
        continue;
      }
    }

    // 3. Check for custom shortcode: [images: url1 | url2 | caption: ...] or [side-by-side: url1 | url2 | caption: ...]
    const shortcodeGridMatch = raw.match(/^\[(?:images|images-grid|side-by-side):\s*([^\s|]+)\s*\|\s*([^\s|]+)(?:\s*\|\s*caption:\s*(.*?))?\]$/i);
    if (shortcodeGridMatch) {
      blocks.push({
        type: 'side-by-side-images',
        data: {
          image1: { url: shortcodeGridMatch[1].trim() },
          image2: { url: shortcodeGridMatch[2].trim() },
          overallCaption: shortcodeGridMatch[3] ? shortcodeGridMatch[3].trim() : undefined,
        },
      });
      continue;
    }

    // 4. Check if the block contains TWO adjacent markdown images:
    // ![Caption 1](url1)
    // ![Caption 2](url2)
    const twoImagesMatch = Array.from(raw.matchAll(/!\[(.*?)\]\((.*?)\)/g));
    const nonImageText = raw.replace(/!\[(.*?)\]\((.*?)\)/g, '').trim();

    if (twoImagesMatch.length === 2 && nonImageText.length === 0) {
      blocks.push({
        type: 'side-by-side-images',
        data: {
          image1: { caption: twoImagesMatch[0][1] || undefined, url: twoImagesMatch[0][2].trim() },
          image2: { caption: twoImagesMatch[1][1] || undefined, url: twoImagesMatch[1][2].trim() },
        },
      });
      continue;
    }

    // 5. Check for Single Image in markdown: ![Caption](url)
    const singleImageMatch = raw.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (singleImageMatch) {
      blocks.push({
        type: 'single-image',
        data: {
          caption: singleImageMatch[1] || undefined,
          url: singleImageMatch[2].trim(),
        },
      });
      continue;
    }

    // 6. Check for HTML <figure class="story-image"> or standalone <img src="..." />
    const figureMatch = raw.match(/<figure\b[^>]*>[\s\S]*?<img\b[^>]*src=["'](.*?)["'][^>]*(?:alt=["'](.*?)["'])?[\s\S]*?(?:<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/i);
    if (figureMatch) {
      blocks.push({
        type: 'single-image',
        data: {
          url: figureMatch[1].trim(),
          caption: figureMatch[3] || figureMatch[2] || undefined,
        },
      });
      continue;
    }

    // 7. Check for custom single image tag: [image: url | caption: ...]
    const singleShortcodeMatch = raw.match(/^\[image:\s*([^\s|]+)(?:\s*\|\s*caption:\s*(.*?))?\]$/i);
    if (singleShortcodeMatch) {
      blocks.push({
        type: 'single-image',
        data: {
          url: singleShortcodeMatch[1].trim(),
          caption: singleShortcodeMatch[2] ? singleShortcodeMatch[2].trim() : undefined,
        },
      });
      continue;
    }

    // 8. Headings: ### Subheading or <h3>Subheading</h3>
    const headingMatch = raw.match(/^(?:###\s*(.*)|<h[23]\b[^>]*>(.*?)<\/h[23]>)$/i);
    if (headingMatch) {
      const headingText = headingMatch[1] || headingMatch[2] || '';
      blocks.push({
        type: 'heading',
        text: headingText.trim(),
        level: 3,
      });
      continue;
    }

    // 9. Pull Quote: > Quote or <blockquote>Quote</blockquote>
    const quoteMatch = raw.match(/^(?:>\s*([\s\S]+)|<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>)$/i);
    if (quoteMatch) {
      const quoteText = quoteMatch[1] || quoteMatch[2] || '';
      blocks.push({
        type: 'quote',
        text: quoteText.trim(),
      });
      continue;
    }

    // 10. Default: Regular Text Paragraph
    blocks.push({
      type: 'paragraph',
      text: raw,
    });
  }

  return blocks;
}

/**
 * Master article body renderer:
 * Correctly renders text paragraphs, subheadings, pull quotes,
 * single inline images, and 2 images side-by-side with responsive layouts.
 */
export const renderArticleBody = (body: string, isDarkBg = false): React.ReactNode => {
  if (!body) return null;

  const blocks = parseArticleBodyBlocks(body);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        if (block.type === 'side-by-side-images') {
          return (
            <StorySideBySideImagesBlock
              key={`side-by-side-${idx}`}
              data={block.data}
              isDarkBg={isDarkBg}
            />
          );
        }

        if (block.type === 'single-image') {
          return (
            <StorySingleImageBlock
              key={`single-image-${idx}`}
              image={block.data}
              isDarkBg={isDarkBg}
            />
          );
        }

        if (block.type === 'heading') {
          return (
            <h3
              key={`heading-${idx}`}
              className={`text-xl sm:text-2xl font-black font-sans tracking-tight pt-4 pb-1 border-l-4 border-[#0284C7] pl-3.5 my-6 ${
                isDarkBg ? 'text-white' : 'text-[#0B1E36]'
              }`}
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={`quote-${idx}`}
              className={`border-l-4 border-[#0284C7] pl-4 sm:pl-6 py-2.5 my-6 italic font-serif text-lg leading-relaxed ${
                isDarkBg
                  ? 'bg-slate-900/60 text-slate-200 border-[#0284C7]'
                  : 'bg-sky-50/50 text-slate-800 border-[#0284C7]'
              }`}
            >
              {renderArticleParagraph(block.text, isDarkBg)}
            </blockquote>
          );
        }

        return (
          <p key={`para-${idx}`} className="leading-relaxed">
            {renderArticleParagraph(block.text, isDarkBg)}
          </p>
        );
      })}
    </div>
  );
};
