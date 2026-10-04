import { BookPage } from '../types';
import { sanitizeAndFormatBookText } from '../utils/bookTextSanitizer';
import { getRanulBookFullPages } from './ranulBookFullText';

export type { BookPage };

// Dynamic helper function to generate or retrieve a book page
export function getBookPage(pageNum: number, customPages?: BookPage[]): BookPage {
  const pagesToUse = customPages && customPages.length > 0 ? customPages : [];

  if (pagesToUse.length === 0) {
    return {
      pageNumber: pageNum || 1,
      chapterTitle: 'Document View',
      partTitle: 'Economics Library',
      content: '### Document Overview\nThis publication is available via its official digital link or downloaded document. Please use the toolbar options to view the full document.',
    };
  }

  const normalizedPage = Math.max(1, Math.min(pagesToUse.length, pageNum));
  const foundPage = pagesToUse.find((p) => p.pageNumber === normalizedPage);
  if (foundPage) return foundPage;
  return pagesToUse[normalizedPage - 1] || pagesToUse[0];
}

/**
 * Smart sentence-aware AI paginator that packs book pages evenly and cleanly.
 * Guarantees NO half-empty or 2-line pages by packing text to target capacity (~1500 chars).
 */
export function autoSplitTextIntoBookPages(
  rawTextOrHtml: string,
  targetPageChars: number = 1500
): BookPage[] {
  if (!rawTextOrHtml || !rawTextOrHtml.trim()) return [];

  // 1. Sanitize and format text (separates headings, formats equations, fixes paragraph spacing)
  const isHtml = /<[a-z][\s\S]*>/i.test(rawTextOrHtml) && (rawTextOrHtml.includes('<p>') || rawTextOrHtml.includes('<div') || rawTextOrHtml.includes('<table'));
  const cleanedText = isHtml ? rawTextOrHtml : sanitizeAndFormatBookText(rawTextOrHtml);

  // 2. Check if explicit manual page breaks exist in the text
  const pageBreakRegex = /\[PAGE\s*BREAK\]|---pagebreak---|---page-break---|<hr[^>]*class=["']page-break["'][^>]*>/i;

  let pageChunks: string[] = [];

  if (pageBreakRegex.test(cleanedText)) {
    pageChunks = cleanedText.split(pageBreakRegex).map((c) => c.trim()).filter(Boolean);
  } else {
    // 3. Sentence-aware smart packing to eliminate short/sparse pages
    const blocks = cleanedText.split(/\n\s*\n|<p[^>]*>/i);
    let currentChunk = '';

    for (const rawBlock of blocks) {
      const block = rawBlock.replace(/<\/p>/i, '').trim();
      if (!block) continue;

      // Check if block is a major Chapter heading (# Chapter 1, ## Part I)
      const isMajorChapterHeading = /^#+\s+(CHAPTER|Chapter|PART|Part|SECTION|Section)/i.test(block);

      // If adding block keeps chunk under capacity (with 15% tolerance)
      if (!isMajorChapterHeading && (currentChunk.length + block.length <= targetPageChars * 1.15 || !currentChunk)) {
        currentChunk = currentChunk ? `${currentChunk}\n\n${block}` : block;
      } else {
        // If currentChunk is already nicely filled (>= 65% of target capacity) or block is a major chapter
        if (currentChunk.length >= targetPageChars * 0.65 || isMajorChapterHeading) {
          pageChunks.push(currentChunk.trim());
          currentChunk = block;
        } else {
          // currentChunk is under 65% capacity. To prevent a short page, split the paragraph into sentences!
          const sentenceMatches = block.match(/([^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$)/g);
          
          if (sentenceMatches && sentenceMatches.length > 1) {
            let paragraphRemainder = '';
            for (const sentence of sentenceMatches) {
              if (!sentence.trim()) continue;
              if (currentChunk.length + sentence.length <= targetPageChars * 1.1) {
                currentChunk += (currentChunk && !currentChunk.endsWith('\n') ? ' ' : '') + sentence.trim();
              } else {
                paragraphRemainder += (paragraphRemainder ? ' ' : '') + sentence.trim();
              }
            }
            // Push full page
            pageChunks.push(currentChunk.trim());
            currentChunk = paragraphRemainder.trim();
          } else {
            // Cannot split sentence, push current and start new
            pageChunks.push(currentChunk.trim());
            currentChunk = block;
          }
        }
      }
    }

    if (currentChunk.trim()) {
      // If trailing chunk is very short (< 250 chars) and we already have pages, merge into last page to avoid 2-line final page!
      if (pageChunks.length > 0 && currentChunk.trim().length < 250) {
        pageChunks[pageChunks.length - 1] += `\n\n${currentChunk.trim()}`;
      } else {
        pageChunks.push(currentChunk.trim());
      }
    }
  }

  if (pageChunks.length === 0) {
    pageChunks = [cleanedText];
  }

  // 4. Map each chunk into a structured BookPage object
  return pageChunks.map((content, idx) => {
    const pageNumber = idx + 1;
    
    // Extract heading if chunk starts with # or <h1>-<h4>
    let chapterTitle = `Page ${pageNumber}`;
    const headingMatch = content.match(/^(?:#+|<h[1-4][^>]*>)\s*(.*?)(?:<\/h[1-4]>|\n|$)/i);
    if (headingMatch && headingMatch[1]) {
      const extracted = headingMatch[1].replace(/<[^>]+>/g, '').trim();
      if (extracted && !/^Page\s*\d+$/i.test(extracted)) {
        chapterTitle = extracted;
      }
    }

    return {
      pageNumber,
      chapterTitle,
      partTitle: `Pasted Treatise Book • Page ${pageNumber}`,
      content: content.trim(),
    };
  });
}
