/**
 * Utility functions for parsing, cleaning, and formatting story summary points
 * especially when copying/pasting from Gemini, ChatGPT, or other AI models.
 */

/**
 * Remove markdown styling, asterisks, and standard AI preambles/postscripts
 */
export function cleanGeminiMarkdown(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText
    // Remove HTML tags
    .replace(/<[^>]*>?/gm, '')
    // Remove code block backticks
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Strip common AI introductory preambles
  const preamblePatterns = [
    /^(?:here (?:is|are)(?: a| the)? (?:key )?(?:summary|takeaways|points|highlights|breakdown|rundown)[^:\n]*:?)/i,
    /^(?:sure(?: thing)?[!,.]? here (?:is|are)[^:\n]*:?)/i,
    /^(?:certainly[!,.]? here (?:is|are)[^:\n]*:?)/i,
    /^(?:key (?:takeaways|points|highlights|summary|findings):?)/i,
    /^(?:executive summary:?)/i,
    /^(?:summary in points:?)/i,
    /^(?:economic summary:?)/i,
    /^(?:in summary:?)/i,
    /^(?:to summarize:?)/i,
  ];

  // Strip common AI closing outro remarks
  const outroPatterns = [
    /(?:hope this (?:helps|summary is useful|provides clarity)[^.\n]*[.!?:-]?)$/i,
    /(?:let me know if you (?:need|would like|require) (?:more|further|additional)[^.\n]*[.!?:-]?)$/i,
    /(?:feel free to ask (?:for|if you have)[^.\n]*[.!?:-]?)$/i,
    /(?:this summary captures the key points[^.\n]*[.!?:-]?)$/i,
  ];

  // Remove lines that match full preambles
  const lines = cleaned.split('\n');
  const filteredLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      filteredLines.push('');
      continue;
    }

    // Check if line is solely a preamble header
    let isPreamble = false;
    for (const pat of preamblePatterns) {
      if (pat.test(line) && line.length < 80) {
        isPreamble = true;
        break;
      }
    }
    if (isPreamble) continue;

    // Check if line is solely an outro
    let isOutro = false;
    for (const pat of outroPatterns) {
      if (pat.test(line)) {
        isOutro = true;
        break;
      }
    }
    if (isOutro) continue;

    filteredLines.push(lines[i]);
  }

  cleaned = filteredLines.join('\n');

  // Convert markdown bold headers: "**Header:** Text" -> "Header: Text"
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');

  return cleaned.trim();
}

/**
 * Strips leading bullet markers, numbering, dashes, or symbols from an individual point string
 */
export function stripLeadingBullet(text: string): string {
  if (!text) return '';
  return text
    .replace(/^[ \t]*(?:Point|Item|Takeaway|Fact|Key point|Highlight)\s*#?\d+[\.:\-\)][ \t]*/i, '') // e.g. "Point 1: "
    .replace(/^[ \t]*[•*\-+▪▫—–>■●◆◇✦❖✔✅👉🔹🔸▫️*️⃣][ \t]*/, '') // bullets & symbols
    .replace(/^[ \t]*\d+[\.\)\-][ \t]*/, '')          // numbered e.g. "1. " or "1) " or "1- "
    .replace(/^[ \t]*\[\d+\][ \t]*/, '')           // e.g. "[1] "
    .replace(/^[ \t]*\(\d+\)[ \t]*/, '')           // e.g. "(1) "
    .trim();
}

/**
 * Intelligently extracts an array of clean points from any raw text:
 * - Handles bullet lists (*, -, •, 1., Point 1:, etc.)
 * - Handles single-spaced or double-spaced multi-line inputs
 * - Handles unbulleted single paragraphs by separating by sentence boundaries
 * - Captures ALL points without any artificial limits!
 */
export function extractPointsFromText(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  const cleaned = cleanGeminiMarkdown(rawText);
  if (!cleaned) return [];

  const rawLines = cleaned.split('\n');

  // 1. Check if the text has explicit bullet / numbered list items
  const bulletRegex = /^[ \t]*(?:[•*\-+▪▫—–>■●◆◇✦❖✔✅👉🔹🔸▫️*️⃣]|\d+[\.\)\-]|\[\d+\]|\(\d+\)|(?:Point|Item|Takeaway|Fact|Key point|Highlight)\s*#?\d+[\.:\-\)])[ \t]+(.+)$/i;
  const hasBullets = rawLines.some((l) => bulletRegex.test(l.trim()));

  if (hasBullets) {
    const extracted: string[] = [];
    let curPoint = '';

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        // Blank line marks point separation
        if (curPoint.trim()) {
          extracted.push(stripLeadingBullet(curPoint));
          curPoint = '';
        }
        continue;
      }

      const match = trimmed.match(bulletRegex);
      if (match) {
        if (curPoint.trim()) {
          extracted.push(stripLeadingBullet(curPoint));
        }
        curPoint = match[1];
      } else if (curPoint) {
        // Continuation of current bullet item
        curPoint += ' ' + trimmed;
      } else {
        curPoint = trimmed;
      }
    }

    if (curPoint.trim()) {
      extracted.push(stripLeadingBullet(curPoint));
    }

    const filtered = extracted.map((p) => p.trim()).filter((p) => p.length > 1);
    if (filtered.length > 0) {
      return filtered;
    }
  }

  // 2. Check if the text has double-newline separated paragraphs
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => stripLeadingBullet(p.trim()))
    .filter((p) => p.length > 1);

  if (paragraphs.length >= 2) {
    return paragraphs;
  }

  // 3. Check if multiple single-line items exist (e.g. 2+ non-empty lines with no blank lines between)
  const nonBlankLines = rawLines
    .map((l) => stripLeadingBullet(l.trim()))
    .filter((l) => l.length > 3);

  if (nonBlankLines.length >= 2) {
    return nonBlankLines;
  }

  // 4. Single continuous text block: Split into sentences (no limit, capture all)
  const sentences = cleaned
    .split(/(?<=[.?!])\s+(?=[A-Z0-9"'])/)
    .map((s) => stripLeadingBullet(s.trim()))
    .filter((s) => s.length > 5);

  if (sentences.length >= 2) {
    return sentences;
  }

  // Fallback: single point
  const fallback = stripLeadingBullet(cleaned);
  return fallback ? [fallback] : [];
}

/**
 * Formats an array of points into a clean string for the Freeform textarea
 */
export function formatPointsToText(
  points: string[],
  style: 'bullet' | 'numbered' | 'paragraphs' = 'bullet'
): string {
  if (!points || points.length === 0) return '';

  return points
    .map((p, idx) => {
      const clean = stripLeadingBullet(p);
      if (style === 'bullet') {
        return `• ${clean}`;
      } else if (style === 'numbered') {
        return `${idx + 1}. ${clean}`;
      }
      return clean;
    })
    .join('\n\n');
}
