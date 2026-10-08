import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Article } from '../types';
import {
  Instagram,
  X,
  CheckCircle2,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Download,
  Sparkles,
  ArrowDownToLine,
  Image as ImageIcon,
  Edit3,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Layers,
  BookOpen,
  Upload,
  User,
} from 'lucide-react';

const LANKAECON_BRAND_EMBLEM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230B1E36"/><circle cx="50" cy="50" r="44" fill="none" stroke="%23EAB308" stroke-width="2.5"/><text x="50" y="58" font-size="34" font-family="sans-serif" font-weight="900" fill="%23FFFFFF" text-anchor="middle">LE</text><path d="M50 16 L53 23 L61 24 L55 29 L57 37 L50 33 L43 37 L45 29 L39 24 L47 23 Z" fill="%23EAB308"/></svg>`;

export interface InstagramStoryModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'entire_story' | 'summary';
  onOpenSummaryStoryPage?: (article: Article) => void;
}

// Canvas helper: rounded rectangle with radius clamping
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Canvas helper: text wrapper with max lines limit
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 4
): number {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      lineCount++;
      if (lineCount >= maxLines) {
        return currentY + lineHeight;
      }
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim().length > 0 && lineCount < maxLines) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

// Break text into lines using actual canvas width measurement
export function breakTextIntoLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine ? `${currentLine} ${words[n]}` : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[n];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Clean text helper (removes markdown and HTML tags)
export function stripMarkup(str: string): string {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Format readable date
export function formatArticleDate(rawDate?: string): string {
  if (!rawDate) {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// Extract real numerical metrics
export function extractMetricsFromText(fullContent: string): string[] {
  const metricRegex = /(?:\b(?:Rs\.?|LKR|\$|USD|EUR|GBP)\s*[\d\.,]+\s*(?:B|M|billion|million|crore|lakh|trillion)?\b|[\+\-]?\d+(?:\.\d+)?%|\b\d+(?:,\d+)*(?:\.\d+)?\s*(?:MT|metric tons?|TEUs?|containers?|MW|megawatts?|barrels?|litres?|tons?|hectares?|units?|passengers?|tourists?|arrivals?|flights?)\b|\b\d+\.?\d*\s*(?:bps|basis points)\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,4}\b|\bQ[1-4]\s+\d{4}\b)/gi;
  const foundMetrics = fullContent.match(metricRegex) || [];
  return Array.from(new Set(foundMetrics.map((m) => m.trim()))).filter((m) => m.length > 1).slice(0, 6);
}

// Deterministic story extraction for single-slide executive summary
export function extractDeterministicStoryData(article: Article) {
  const title = stripMarkup(article.title || '');
  const deck = stripMarkup(article.deck || '');
  const cleanBody = stripMarkup(article.body || '');
  const category = (article.primary_category || 'ECONOMY').toUpperCase();

  let authorName = 'LankaEcon News Desk';
  if (Array.isArray(article.authors) && article.authors.length > 0) {
    const firstAuthor = article.authors[0];
    const fullName = `${firstAuthor.first_name || ''} ${firstAuthor.last_name || ''}`.trim();
    if (fullName) authorName = fullName;
  } else if ((article as any).authorName) {
    authorName = (article as any).authorName;
  }

  const pubDate = formatArticleDate(article.published_at || article.created_at);
  const readTime = `${article.reading_time_minutes || 3} min read`;

  const fullContent = `${title}. ${deck}. ${cleanBody}`;
  const keyNumbers = extractMetricsFromText(fullContent);

  const cleanSentences = cleanBody
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && !s.startsWith('#') && !s.includes('http'));

  const summaryBullets: string[] = [];

  // 1. Core Lead Event
  if (deck) {
    summaryBullets.push(deck.trim());
  } else if (cleanSentences[0]) {
    summaryBullets.push(cleanSentences[0]);
  } else {
    summaryBullets.push(title);
  }

  // 2. Numerical / Quantitative detail
  const numSentence = cleanSentences.find((s) => /\d/.test(s) && s !== summaryBullets[0]);
  if (numSentence) {
    summaryBullets.push(numSentence);
  } else if (cleanSentences[1]) {
    summaryBullets.push(cleanSentences[1]);
  }

  // 3. Contextual causes or key drivers
  const contextSentence = cleanSentences.find((s) => s !== summaryBullets[0] && s !== summaryBullets[1]);
  if (contextSentence) {
    summaryBullets.push(contextSentence);
  }

  // 4. Sector implications
  const impactSentence = cleanSentences.find((s) => s !== summaryBullets[0] && s !== summaryBullets[1] && s !== summaryBullets[2]);
  if (impactSentence) {
    summaryBullets.push(impactSentence);
  } else {
    summaryBullets.push(`Significant macroeconomic implications across Sri Lanka's ${category.toLowerCase()} sector.`);
  }

  const catSlug = category.replace(/[^A-Z0-9]/gi, '');
  const hashtags = `#LankaEcon #SriLankaNews #SriLankaEconomy #${catSlug} #SriLanka #${category.toLowerCase()}`;
  const macroImpact = `Direct operational and policy implications for Sri Lanka's ${category.toLowerCase()} sector, enterprise supply chains, and market participants.`;

  const detailedCaption = `🇱🇰 LANKAECON DISPATCH [EXECUTIVE SUMMARY] • ${category}\n\n📌 ${title.toUpperCase()}\n✍️ By ${authorName} • LankaEcon Desk\n📅 ${pubDate} • ${readTime}\n\n${summaryBullets.map((b) => b.trim()).join('\n\n')}\n\n${keyNumbers.length > 0 ? `📊 KEY FIGURES & METRICS:\n${keyNumbers.map((n) => `• ${n}`).join('\n')}\n\n` : ''}💡 SECTOR TAKEAWAY:\n• ${macroImpact}\n\n🔗 Read full story at: https://www.lankaecon.lk/story/${article.article_id}\n\n${hashtags}`;

  return {
    title,
    deck: deck || title,
    storyOverview: summaryBullets.slice(0, 2).join('\n'),
    authorName,
    pubDate,
    readTime,
    category,
    keyNumbers,
    summaryBullets,
    macroImpact,
    detailedCaption,
  };
}

// Extraction for PUBLISHING THE ENTIRE STORY across sequential Instagram Story slides
export function extractEntireStoryData(article: Article) {
  const title = stripMarkup(article.title || '');
  const deck = stripMarkup(article.deck || '');
  const rawBody = article.body || '';
  const cleanBody = stripMarkup(rawBody);
  const category = (article.primary_category || 'ECONOMY').toUpperCase();

  let authorName = 'LankaEcon News Desk';
  if (Array.isArray(article.authors) && article.authors.length > 0) {
    const firstAuthor = article.authors[0];
    const fullName = `${firstAuthor.first_name || ''} ${firstAuthor.last_name || ''}`.trim();
    if (fullName) authorName = fullName;
  } else if ((article as any).authorName) {
    authorName = (article as any).authorName;
  }

  const pubDate = formatArticleDate(article.published_at || article.created_at);
  const readTime = `${article.reading_time_minutes || 3} min read`;
  const keyNumbers = extractMetricsFromText(`${title}. ${deck}. ${cleanBody}`);

  // Extract all actual paragraphs
  let rawParagraphs = rawBody
    .split(/\n\s*\n|\r\n\r\n/)
    .map((p) => stripMarkup(p))
    .filter((p) => p.length > 25 && !p.startsWith('#') && !p.includes('http'));

  if (rawParagraphs.length === 0) {
    const sentences = cleanBody
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25 && !s.startsWith('#') && !s.includes('http'));

    if (sentences.length <= 3) {
      rawParagraphs = sentences;
    } else {
      rawParagraphs = [];
      for (let i = 0; i < sentences.length; i += 2) {
        rawParagraphs.push(sentences.slice(i, i + 2).join(' '));
      }
    }
  }

  // Prepend deck if distinct from first paragraph
  if (deck && rawParagraphs[0] && !rawParagraphs[0].toLowerCase().includes(deck.slice(0, 30).toLowerCase())) {
    rawParagraphs.unshift(deck.trim());
  } else if (deck && rawParagraphs.length === 0) {
    rawParagraphs.push(deck.trim());
  }

  if (rawParagraphs.length === 0) {
    rawParagraphs = [cleanBody || title];
  }

  // The entire story is published in ONE single high-resolution Instagram Story graphic
  const totalSlides = 1;
  const slides = [
    {
      slideIndex: 0,
      paragraphs: rawParagraphs,
      isFirstSlide: true,
      isLastSlide: true,
    },
  ];

  const wordCount = cleanBody.split(/\s+/).length;
  const isLongStory = wordCount > 100 || rawParagraphs.length >= 4;

  const catSlug = category.replace(/[^A-Z0-9]/gi, '');
  const hashtags = `#LankaEcon #SriLankaNews #SriLankaEconomy #${catSlug} #SriLanka #${category.toLowerCase()}`;
  const macroImpact = `Direct operational and policy implications for Sri Lanka's ${category.toLowerCase()} sector, trade partners, and enterprise stakeholders.`;

  // Caption contains the COMPLETE ENTIRE STORY text in one single post
  const detailedCaption = `🇱🇰 LANKAECON DISPATCH [ENTIRE STORY] • ${category}\n\n📌 ${title.toUpperCase()}\n✍️ By ${authorName} • LankaEcon Desk\n📅 ${pubDate} • ${readTime}\n\n${rawParagraphs.map((p) => p.trim()).join('\n\n')}\n\n${keyNumbers.length > 0 ? `📊 KEY FIGURES & METRICS:\n${keyNumbers.map((n) => `• ${n}`).join('\n')}\n\n` : ''}💡 SECTOR TAKEAWAY:\n• ${macroImpact}\n\n🔗 Read full article online at: https://www.lankaecon.lk/story/${article.article_id}\n\n${hashtags}`;

  return {
    title,
    deck: deck || title,
    authorName,
    pubDate,
    readTime,
    category,
    keyNumbers,
    allParagraphs: rawParagraphs,
    wordCount,
    isLongStory,
    slides,
    totalSlides,
    macroImpact,
    detailedCaption,
  };
}

// Draw high-resolution native 1080x1920 Instagram Story Graphic
function drawInstagramStory(
  canvas: HTMLCanvasElement,
  article: Article,
  storyStyle: 'light_badge' | 'gold_badge' | 'navy_badge' | 'red_badge',
  storyMode: 'entire_story' | 'summary',
  paragraphs: string[],
  keyNumbers: string[],
  macroImpact: string,
  avatarImage?: HTMLImageElement | null
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  const palette = {
    light_badge: {
      bgTop: '#1E293B',
      bgMid: '#0F172A',
      bgBottom: '#020617',
      cardBg: '#FFFDF9',
      cardBorder: '#0B1E36',
      innerBorder: '#D4A373',
      headerBg: '#0B1E36',
      headerText: '#D4A373',
      titleText: '#0B1E36',
      deckText: '#334155',
      chipBg: '#0B1E36',
      chipText: '#FDE047',
      bulletBoxBg: '#F8F5EE',
      bulletBorder: '#E2D9CC',
      bulletText: '#1E293B',
      bulletPrefix: '#B45309',
      stickerBg: '#0B1E36',
      stickerText: '#FFFFFF',
      stickerSub: '#FDE68A',
    },
    gold_badge: {
      bgTop: '#2A1810',
      bgMid: '#1C0F0A',
      bgBottom: '#0D0704',
      cardBg: '#FFFDF8',
      cardBorder: '#8B4513',
      innerBorder: '#D97706',
      headerBg: '#8B4513',
      headerText: '#FEF3C7',
      titleText: '#2A1810',
      deckText: '#57534E',
      chipBg: '#8B4513',
      chipText: '#FDE68A',
      bulletBoxBg: '#FDF8F0',
      bulletBorder: '#E8DCCB',
      bulletText: '#1C1917',
      bulletPrefix: '#9A3412',
      stickerBg: '#8B4513',
      stickerText: '#FEF3C7',
      stickerSub: '#FDE68A',
    },
    navy_badge: {
      bgTop: '#081526',
      bgMid: '#0E223D',
      bgBottom: '#030812',
      cardBg: '#F8FAFC',
      cardBorder: '#0284C7',
      innerBorder: '#38BDF8',
      headerBg: '#0284C7',
      headerText: '#FFFFFF',
      titleText: '#0F172A',
      deckText: '#334155',
      chipBg: '#0284C7',
      chipText: '#FFFFFF',
      bulletBoxBg: '#F0F9FF',
      bulletBorder: '#BAE6FD',
      bulletText: '#0F172A',
      bulletPrefix: '#0369A1',
      stickerBg: '#0284C7',
      stickerText: '#FFFFFF',
      stickerSub: '#E0F2FE',
    },
    red_badge: {
      bgTop: '#450A0A',
      bgMid: '#2B0606',
      bgBottom: '#130202',
      cardBg: '#FFFDF9',
      cardBorder: '#DC2626',
      innerBorder: '#EF4444',
      headerBg: '#DC2626',
      headerText: '#FFFFFF',
      titleText: '#1F2937',
      deckText: '#374151',
      chipBg: '#DC2626',
      chipText: '#FFFFFF',
      bulletBoxBg: '#FEF2F2',
      bulletBorder: '#FECACA',
      bulletText: '#1F2937',
      bulletPrefix: '#DC2626',
      stickerBg: '#DC2626',
      stickerText: '#FFFFFF',
      stickerSub: '#FEE2E2',
    },
  }[storyStyle] || {
    bgTop: '#1E293B',
    bgMid: '#0F172A',
    bgBottom: '#020617',
    cardBg: '#FFFDF9',
    cardBorder: '#0B1E36',
    innerBorder: '#D4A373',
    headerBg: '#0B1E36',
    headerText: '#D4A373',
    titleText: '#0B1E36',
    deckText: '#334155',
    chipBg: '#0B1E36',
    chipText: '#FDE047',
    bulletBoxBg: '#F8F5EE',
    bulletBorder: '#E2D9CC',
    bulletText: '#1E293B',
    bulletPrefix: '#B45309',
    stickerBg: '#0B1E36',
    stickerText: '#FFFFFF',
    stickerSub: '#FDE68A',
  };

  // 1. Full Story Canvas Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, palette.bgTop);
  grad.addColorStop(0.5, palette.bgMid);
  grad.addColorStop(1, palette.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Outer Story Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // 3. Instagram Story Top Bar (Single clean story bar)
  const barY = 46;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 60, barY, width - 120, 6, 3);
  ctx.fill();

  // 4. Instagram Profile Header
  const avatarX = 98;
  const avatarY = 106;
  const avatarRadius = 32;

  ctx.save();
  // Outer gradient story ring
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, 36, 0, Math.PI * 2);
  const ringGrad = ctx.createLinearGradient(avatarX - 36, avatarY - 36, avatarX + 36, avatarY + 36);
  ringGrad.addColorStop(0, '#F59E0B');
  ringGrad.addColorStop(0.5, '#EC4899');
  ringGrad.addColorStop(1, '#8B5CF6');
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Circle clipping for avatar image or solid background with monogram
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.closePath();

  if (avatarImage && avatarImage.complete && avatarImage.naturalWidth > 0) {
    ctx.save();
    ctx.clip();
    // Dark background under transparent images
    ctx.fillStyle = '#0B1E36';
    ctx.fill();
    // Aspect-fit/cover into circle
    const imgW = avatarImage.naturalWidth;
    const imgH = avatarImage.naturalHeight;
    const size = Math.min(imgW, imgH);
    const sx = (imgW - size) / 2;
    const sy = (imgH - size) / 2;
    ctx.drawImage(
      avatarImage,
      sx, sy, size, size,
      avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2
    );
    ctx.restore();
  } else {
    // Inner Avatar Background & Monogram "LE"
    ctx.fillStyle = '#0B1E36';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 23px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LE', avatarX, avatarY);
  }
  ctx.restore();

  // Handle & Verified Badge
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 30px system-ui, -apple-system, sans-serif';
  ctx.fillText('lankaecon.lk', 150, 98);

  // Verified checkmark circle
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(348, 93, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0B1E36';
  ctx.font = '900 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓', 348, 98);

  // Subtitle
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 19px monospace';
  const headerSubtitle =
    storyMode === 'entire_story'
      ? 'Entire Story Dispatch • Complete News'
      : 'Executive Summary Brief • Social Digest';
  ctx.fillText(headerSubtitle, 150, 125);

  // Story Close icon on right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '700 26px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('✕', width - 60, 108);

  // 5. Central Dispatch Card
  const cardX = 46;
  const cardY = 150;
  const cardW = width - 92; // 988px
  const cardH = 1548; // reaches down to Y = 1698

  // Outer shadow & card fill
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = palette.cardBg;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.restore();

  // Outer bold border
  ctx.strokeStyle = palette.cardBorder;
  ctx.lineWidth = 6;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.stroke();

  // Inner decorative border
  ctx.strokeStyle = palette.innerBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, cardX + 10, cardY + 10, cardW - 20, cardH - 20, 18);
  ctx.stroke();

  // 6. Header Tag inside Card
  ctx.fillStyle = palette.headerBg;
  const badgeWidth = 440;
  roundRect(ctx, cardX + 26, cardY + 22, badgeWidth, 42, 8);
  ctx.fill();
  ctx.fillStyle = palette.headerText;
  ctx.font = '900 19px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';

  const badgeTitle =
    storyMode === 'entire_story'
      ? '🇱🇰 LANKAECON • ENTIRE STORY DISPATCH'
      : '🇱🇰 LANKAECON • EXECUTIVE SUMMARY BRIEF';
  ctx.fillText(badgeTitle, cardX + 40, cardY + 49);

  // Category Tag on right
  const categoryName = (article.primary_category || 'ECONOMY').toUpperCase();
  ctx.fillStyle = '#E0F2FE';
  roundRect(ctx, cardX + cardW - 240, cardY + 22, 214, 42, 8);
  ctx.fill();
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX + cardW - 240, cardY + 22, 214, 42, 8);
  ctx.stroke();
  ctx.fillStyle = '#0369A1';
  ctx.font = '900 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(categoryName, cardX + cardW - 133, cardY + 49);

  // Author byline & Date line
  let authorByline = 'LankaEcon News Desk';
  if (Array.isArray(article.authors) && article.authors.length > 0) {
    const a = article.authors[0];
    const n = `${a.first_name || ''} ${a.last_name || ''}`.trim();
    if (n) authorByline = n;
  } else if ((article as any).authorName) {
    authorByline = (article as any).authorName;
  }
  const dateStr = formatArticleDate(article.published_at || article.created_at);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(
    `BY ${authorByline.toUpperCase()} • ${dateStr.toUpperCase()} • ${article.reading_time_minutes || 3} MIN READ`,
    cardX + 30,
    cardY + 94
  );

  let curY = cardY + 140;

  // 7. Headline Rendering - bold 46px font with comfortable leading for crystal clear readability
  ctx.fillStyle = palette.titleText;
  ctx.font = 'bold 46px "Georgia", "Times New Roman", serif';
  curY = wrapText(ctx, article.title, cardX + 30, curY, cardW - 60, 57, 3);
  curY += 12;

  // Key Metrics Corridor (if present)
  if (keyNumbers && keyNumbers.length > 0) {
    let chipX = cardX + 30;
    const chipRowY = curY;
    const metricsToDraw = keyNumbers.slice(0, 5);

    metricsToDraw.forEach((num) => {
      ctx.font = '900 22px monospace';
      const textWidth = ctx.measureText(num).width;
      const pillW = textWidth + 28;

      if (chipX + pillW > cardX + cardW - 30) return;

      ctx.fillStyle = palette.chipBg;
      roundRect(ctx, chipX, chipRowY, pillW, 36, 6);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      roundRect(ctx, chipX, chipRowY, pillW, 36, 6);
      ctx.stroke();

      ctx.fillStyle = palette.chipText;
      ctx.fillText(num, chipX + 14, chipRowY + 25);
      chipX += pillW + 10;
    });
    curY = chipRowY + 48;
  }

  // 8. Story Narrative Container - fills down to bottom of card
  const pointsBoxX = cardX + 20;
  const pointsBoxW = cardW - 40; // 948px
  const pointsBoxY = curY + 6;
  const bottomLimitY = cardY + cardH - 18; // 1680px
  const pointsBoxH = Math.max(bottomLimitY - pointsBoxY, 920);

  // Background frame
  ctx.fillStyle = palette.bulletBoxBg;
  roundRect(ctx, pointsBoxX, pointsBoxY, pointsBoxW, pointsBoxH, 16);
  ctx.fill();
  ctx.strokeStyle = palette.bulletBorder;
  ctx.lineWidth = 2.5;
  roundRect(ctx, pointsBoxX, pointsBoxY, pointsBoxW, pointsBoxH, 16);
  ctx.stroke();

  // Header banner on narrative container
  ctx.fillStyle = palette.headerBg;
  roundRect(ctx, pointsBoxX + 18, pointsBoxY + 14, 430, 36, 6);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 17px system-ui, -apple-system, sans-serif';
  const boxBannerText =
    storyMode === 'entire_story'
      ? '📖 FULL STORY • COMPLETE DISPATCH'
      : '📰 EXECUTIVE SUMMARY • KEY POINTS';
  ctx.fillText(boxBannerText, pointsBoxX + 32, pointsBoxY + 38);

  // 9. DYNAMIC TYPESETTING ENGINE:
  // Designed with very slightly enlarged font scaling so text is immediately legible on mobile phones
  // Starting with generous breathing room below the header banner
  const textStartY = pointsBoxY + 96;
  const availH = (pointsBoxY + pointsBoxH - 24) - textStartY;
  const availW = pointsBoxW - 56; // 892px

  const cleanParas = (paragraphs && paragraphs.length > 0 ? paragraphs : [article.title])
    .map((p) => p.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);

  // Determine optimal font size (testing downward from 39.5px to 20.5px for high legibility)
  let bestFontSize = 24.5;
  let bestLineHeight = 37;
  let bestParaGap = 22;
  let bestLinesByPara: string[][] = [];

  for (let testSize = 39.5; testSize >= 20.5; testSize -= 0.5) {
    ctx.font = `600 ${testSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const testLineHeight = Math.round(testSize * 1.48);
    const testParaGap = Math.round(testSize * 0.75);

    const linesByPara: string[][] = [];
    let totalLines = 0;
    for (const p of cleanParas) {
      const lines = breakTextIntoLines(ctx, p, availW);
      linesByPara.push(lines);
      totalLines += lines.length;
    }

    const totalH = (totalLines * testLineHeight) + (Math.max(0, cleanParas.length - 1) * testParaGap);
    if (totalH <= availH) {
      bestFontSize = testSize;
      bestLineHeight = testLineHeight;
      bestParaGap = testParaGap;
      bestLinesByPara = linesByPara;
      break;
    }
  }

  // Fallback for very extensive text, maintaining minimum 19px
  if (bestLinesByPara.length === 0) {
    bestFontSize = 19;
    ctx.font = `600 ${bestFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    bestLineHeight = Math.round(bestFontSize * 1.42);
    bestParaGap = Math.round(bestFontSize * 0.6);
    for (const p of cleanParas) {
      bestLinesByPara.push(breakTextIntoLines(ctx, p, availW));
    }
  }

  // Distribute remaining space into line-height and paragraph spacing
  const totalCalculatedLines = bestLinesByPara.reduce((acc, l) => acc + l.length, 0);
  const initialHeight = (totalCalculatedLines * bestLineHeight) + (Math.max(0, cleanParas.length - 1) * bestParaGap);
  const remainingSpace = availH - initialHeight;

  let finalLineHeight = bestLineHeight;
  let finalParaGap = bestParaGap;

  if (remainingSpace > 15) {
    const extraPerLine = (remainingSpace * 0.5) / Math.max(1, totalCalculatedLines);
    const addedLine = Math.min(extraPerLine, bestLineHeight * 0.35);
    finalLineHeight = Math.round(bestLineHeight + addedLine);

    const unusedAfterLines = remainingSpace - (addedLine * totalCalculatedLines);
    finalParaGap = Math.round(bestParaGap + Math.max(0, unusedAfterLines / Math.max(1, cleanParas.length - 1)));
  }

  // Render all paragraphs and lines with high contrast and optical clarity
  let lineY = textStartY;
  const textStartX = pointsBoxX + 28;

  ctx.fillStyle = palette.bulletText;

  bestLinesByPara.forEach((lines, pIdx) => {
    const isFirstPara = pIdx === 0;

    // Accent bar on left
    ctx.fillStyle = isFirstPara ? (palette.bulletPrefix || '#D97706') : 'rgba(217, 119, 6, 0.45)';
    const barH = Math.max(22, Math.min(lines.length * finalLineHeight - (finalLineHeight - bestFontSize), 44));
    roundRect(ctx, textStartX - 16, lineY - bestFontSize + 4, 4.5, barH, 2);
    ctx.fill();

    ctx.fillStyle = palette.bulletText;
    // 600 weight font guarantees sharp, clear, bold letters on mobile devices
    ctx.font = `600 ${bestFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    lines.forEach((lineText) => {
      ctx.fillText(lineText, textStartX, lineY);
      lineY += finalLineHeight;
    });

    lineY += finalParaGap;
  });

  // 10. Bottom Link Sticker
  const stickerY = 1710;
  ctx.fillStyle = palette.stickerBg;
  roundRect(ctx, cardX, stickerY, cardW, 108, 22);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  roundRect(ctx, cardX + 4, stickerY + 4, cardW - 8, 100, 18);
  ctx.stroke();

  // Sticker Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 26px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🔗 TAP TO READ FULL ARTICLE & ANALYSIS', cardX + 34, stickerY + 44);
  ctx.fillStyle = palette.stickerSub;
  ctx.font = 'bold 23px monospace';
  ctx.fillText(`lankaecon.lk/story/${article.article_id}`, cardX + 34, stickerY + 80);

  // Arrow button inside sticker
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('↗', cardX + cardW - 34, stickerY + 66);

  // 11. Bottom Brand Watermark
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = 'bold 17px monospace';
  ctx.fillText('ECON MATRIX NEWSROOM DISPATCH • OFFICIAL INSTAGRAM: @LANKAECON.LK', width / 2, 1850);

  // 12. Bottom Instagram Interaction Bar Mockup
  const barBottomY = 1868;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  roundRect(ctx, 60, barBottomY, 780, 42, 21);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Send message...', 90, barBottomY + 27);
  ctx.font = '24px system-ui, sans-serif';
  ctx.fillText('🤍', 890, barBottomY + 28);
  ctx.fillText('✈️', 960, barBottomY + 28);
}

export const InstagramStoryModal: React.FC<InstagramStoryModalProps> = ({
  article,
  isOpen,
  onClose,
  initialMode = 'entire_story',
  onOpenSummaryStoryPage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Core Mode State: 'entire_story' or 'summary'
  const [storyMode, setStoryMode] = useState<'entire_story' | 'summary'>(initialMode);

  const [storyStyle, setStoryStyle] = useState<'light_badge' | 'gold_badge' | 'navy_badge' | 'red_badge'>('light_badge');
  const [activeTab, setActiveTab] = useState<'graphic' | 'edit' | 'caption'>('graphic');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishedResult, setPublishedResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isAiEnriching, setIsAiEnriching] = useState(false);
  const [isMakingSummary, setIsMakingSummary] = useState(false);

  // Parsed story data
  const entireStoryData = useMemo(() => {
    if (!article) return null;
    return extractEntireStoryData(article);
  }, [article]);

  const summaryStoryData = useMemo(() => {
    if (!article) return null;
    return extractDeterministicStoryData(article);
  }, [article]);

  // Story Content State
  const [storyTitle, setStoryTitle] = useState(article?.title || '');
  const [keyNumbers, setKeyNumbers] = useState<string[]>([]);
  const [summaryBullets, setSummaryBullets] = useState<string[]>([]);
  const [macroImpact, setMacroImpact] = useState<string>('');
  const [detailedCaption, setDetailedCaption] = useState<string>('');
  const [newMetricInput, setNewMetricInput] = useState('');

  // Circle Profile Image state (top rainbow ring avatar)
  const [circleAvatarUrl, setCircleAvatarUrl] = useState<string>(
    article?.authors?.[0]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [circleAvatarMode, setCircleAvatarMode] = useState<'author' | 'upload' | 'brand' | 'monogram'>('author');
  const [loadedAvatarImg, setLoadedAvatarImg] = useState<HTMLImageElement | null>(null);
  const [customCircleInput, setCustomCircleInput] = useState<string>('');

  // Preload circle avatar image
  useEffect(() => {
    if (circleAvatarMode === 'monogram' || !circleAvatarUrl) {
      setLoadedAvatarImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLoadedAvatarImg(img);
    img.onerror = () => setLoadedAvatarImg(null);
    img.src = circleAvatarUrl;
  }, [circleAvatarUrl, circleAvatarMode]);

  const handleUploadCircleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        if (resultUrl) {
          setCircleAvatarUrl(resultUrl);
          setCircleAvatarMode('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Synchronize when article changes or modal opens
  useEffect(() => {
    if (article) {
      setStoryMode(initialMode);
      const entireData = extractEntireStoryData(article);
      const sumData = extractDeterministicStoryData(article);

      setStoryTitle(entireData.title);
      setKeyNumbers(entireData.keyNumbers);
      setMacroImpact(entireData.macroImpact);
      if (article.authors?.[0]?.avatar_url) {
        setCircleAvatarUrl(article.authors[0].avatar_url);
        setCircleAvatarMode('author');
      }

      if (initialMode === 'summary') {
        setSummaryBullets(sumData.summaryBullets);
        setDetailedCaption(sumData.detailedCaption);
      } else {
        setSummaryBullets(entireData.allParagraphs);
        setDetailedCaption(entireData.detailedCaption);
      }
    }
  }, [article?.article_id, initialMode]);

  // Canvas Redraw Callback
  const refreshCanvasPreview = useCallback(() => {
    if (!article) return;
    const canvas = canvasRef.current || document.createElement('canvas');

    drawInstagramStory(
      canvas,
      { ...article, title: storyTitle },
      storyStyle,
      storyMode,
      summaryBullets,
      keyNumbers,
      macroImpact,
      circleAvatarMode === 'monogram' ? null : loadedAvatarImg
    );
  }, [
    article,
    storyTitle,
    storyStyle,
    storyMode,
    summaryBullets,
    keyNumbers,
    macroImpact,
    loadedAvatarImg,
    circleAvatarMode,
  ]);

  useEffect(() => {
    if (isOpen && article) {
      refreshCanvasPreview();
    }
  }, [isOpen, article, refreshCanvasPreview]);

  // Handle switching to Summary mode
  const handleSwitchToSummary = () => {
    setStoryMode('summary');
    if (summaryStoryData) {
      setSummaryBullets(summaryStoryData.summaryBullets);
      setDetailedCaption(summaryStoryData.detailedCaption);
    }
  };

  // Handle switching to Entire Story mode
  const handleSwitchToEntireStory = () => {
    setStoryMode('entire_story');
    if (entireStoryData) {
      setSummaryBullets(entireStoryData.allParagraphs);
      setDetailedCaption(entireStoryData.detailedCaption);
    }
  };

  // Backend Action: "Make a Summary & Upload to Instagram"
  const handleMakeSummaryAndUploadToInstagram = async () => {
    if (!article) return;
    setIsMakingSummary(true);

    try {
      let author = 'LankaEcon News Desk';
      if (Array.isArray(article.authors) && article.authors.length > 0) {
        const a = article.authors[0];
        author = `${a.first_name || ''} ${a.last_name || ''}`.trim() || author;
      } else if ((article as any).authorName) {
        author = (article as any).authorName;
      }

      // Call backend summary and upload endpoint
      const res = await fetch('/api/instagram/make-summary-and-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.article_id,
          title: article.title,
          deck: article.deck,
          body: article.body,
          category: article.primary_category,
          authorName: author,
          storyStyle,
          instagramHandle: 'lankaecon.lk',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStoryMode('summary');
        if (Array.isArray(data.summaryBullets)) {
          setSummaryBullets(data.summaryBullets);
        }
        if (Array.isArray(data.keyNumbers)) {
          setKeyNumbers(data.keyNumbers);
        }
        if (data.macroImpact) {
          setMacroImpact(data.macroImpact);
        }
        if (data.caption) {
          setDetailedCaption(data.caption);
          await navigator.clipboard.writeText(data.caption).catch(() => {});
        }

        // Auto download graphic to laptop
        await handleDownloadStoryImage('png');

        // Open Instagram
        window.open('https://www.instagram.com/lankaecon.lk/?hl=en', '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Make summary and upload error:', err);
      handleSwitchToSummary();
    } finally {
      setIsMakingSummary(false);
    }
  };

  const handleCopyCaption = () => {
    const textToCopy =
      detailedCaption ||
      `🇱🇰 LANKAECON DISPATCH: ${storyTitle}\n\nRead full story at: https://www.lankaecon.lk/story/${article?.article_id}\n\n#LankaEcon #SriLankaNews #SriLankaEconomy`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAddMetric = () => {
    if (newMetricInput.trim() && keyNumbers.length < 8) {
      setKeyNumbers([...keyNumbers, newMetricInput.trim()]);
      setNewMetricInput('');
    }
  };

  const handleRemoveMetric = (index: number) => {
    setKeyNumbers(keyNumbers.filter((_, i) => i !== index));
  };

  const handleBulletChange = (index: number, val: string) => {
    const updated = [...summaryBullets];
    updated[index] = val;
    setSummaryBullets(updated);
  };

  // Generate blob for story
  const generateStoryBlob = (
    format: 'image/png' | 'image/jpeg' = 'image/png'
  ): Promise<{ blob: Blob; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');

      drawInstagramStory(
        canvas,
        { ...article!, title: storyTitle },
        storyStyle,
        storyMode,
        summaryBullets,
        keyNumbers,
        macroImpact,
        circleAvatarMode === 'monogram' ? null : loadedAvatarImg
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed'));
          return;
        }
        resolve({ blob, dataUrl: canvas.toDataURL(format) });
      }, format, 0.95);
    });
  };

  // Download Story Image to Laptop
  const handleDownloadStoryImage = async (format: 'png' | 'jpeg' = 'png') => {
    if (!article) return;
    setIsDownloading(true);
    try {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const ext = format === 'png' ? 'png' : 'jpg';
      const { blob } = await generateStoryBlob(mimeType);

      const fileName = `LankaEcon_Story_${article.article_id || 'dispatch'}.${ext}`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 200);

      if (detailedCaption) {
        navigator.clipboard.writeText(detailedCaption).catch(() => {});
      }

      setDownloadedFileName(fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (e) {
      console.error(e);
      alert('Could not render 1080x1920 image canvas.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Publish / Share & Connect to Instagram
  const handlePublishStory = async () => {
    if (!article) return;
    setIsPublishing(true);
    setPublishProgress(20);

    try {
      const { blob, dataUrl } = await generateStoryBlob('image/png');
      setPublishProgress(50);

      const fileName = `LankaEcon_Instagram_Story_${article.article_id || 'dispatch'}.png`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 200);

      if (detailedCaption) {
        await navigator.clipboard.writeText(detailedCaption);
      }
      setPublishProgress(70);

      await fetch('/api/instagram/upload-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.article_id,
          title: storyTitle,
          mode: storyMode === 'entire_story' ? 'ENTIRE_STORY' : 'SUMMARY',
          slideIndex: 0,
          totalSlides: 1,
          category: article.primary_category,
          storyStyle,
          keyNumbers,
          summaryBullets,
          caption: detailedCaption,
          imageBase64: dataUrl,
          instagramHandle: 'lankaecon.lk',
        }),
      }).catch(() => {});

      setPublishProgress(90);
      window.open('https://www.instagram.com/lankaecon.lk/?hl=en', '_blank', 'noopener,noreferrer');
      setPublishProgress(100);
      setPublishedResult({ downloadedFileName: fileName });
    } catch (err) {
      console.error(err);
      window.open('https://www.instagram.com/lankaecon.lk/?hl=en', '_blank', 'noopener,noreferrer');
      alert('Story graphic generated and downloaded to your laptop!');
    } finally {
      setIsPublishing(false);
    }
  };

  const styleConfigs = {
    light_badge: { name: 'Standard Light Badge (Double Border)', accent: 'border-slate-300' },
    gold_badge: { name: 'Broadsheet Gold Badge', accent: 'border-amber-600' },
    navy_badge: { name: 'Executive Navy Badge', accent: 'border-sky-500' },
    red_badge: { name: 'Market Red Alert Badge', accent: 'border-rose-600' },
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-[#0F172A] border-2 border-slate-700 w-full max-w-6xl rounded-none shadow-2xl my-4 sm:my-6 p-4 sm:p-6 space-y-5 text-white">
        
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Instagram className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-base uppercase tracking-tight text-white">
                  LankaEcon Instagram Story Publishing Studio
                </h3>
                <span className="bg-[#0284C7] text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                  1080×1920 HD
                </span>
                {storyMode === 'entire_story' ? (
                  <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>ENTIRE STORY (1 SLIDE)</span>
                  </span>
                ) : (
                  <span className="bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>EXECUTIVE SUMMARY</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Official Account: <a href="https://www.instagram.com/lankaecon.lk/?hl=en" target="_blank" rel="noreferrer" className="text-pink-400 font-bold underline hover:text-pink-300">@lankaecon.lk</a> • High visual density, complete narrative & verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadStoryImage('png')}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-md border border-emerald-500 flex items-center gap-1.5 shrink-0"
              title="Download 1080x1920 Story PNG image directly to your laptop"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Download PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer rounded-xs shadow-md border border-slate-700 shrink-0"
              title="Close Studio"
            >
              <X className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Global Download Success Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-950/90 border-2 border-emerald-500 p-3.5 rounded-xs flex items-center justify-between gap-3 text-xs text-emerald-200 shadow-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">
                  Downloaded <span className="text-emerald-300 font-mono">{downloadedFileName}</span> to your Laptop!
                </p>
                <p className="text-[11px] text-emerald-200/90">
                  Ready in your <strong>Downloads</strong> folder. Full caption copied to clipboard!
                </p>
              </div>
            </div>
            <button
              onClick={() => setDownloadSuccess(false)}
              className="text-emerald-400 hover:text-white text-xs font-mono font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* STORY LENGTH & PUBLISHING OPTIONS TOOLBAR */}
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase text-amber-400 tracking-wider">
                Story Publishing Mode:
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {entireStoryData?.wordCount || 0} words • {entireStoryData?.isLongStory ? 'Long Story' : 'Standard Story'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {storyMode === 'entire_story'
                ? 'Entire story mode renders the complete article text on a single story slide with high-density full-coverage typesetting.'
                : 'Summary mode condenses long stories into a fast, punchy 4-paragraph executive brief.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher Buttons */}
            <div className="flex items-center bg-slate-950 border border-slate-700 p-1 rounded-xs">
              <button
                onClick={handleSwitchToEntireStory}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition rounded-xs cursor-pointer ${
                  storyMode === 'entire_story' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Entire Story (1 Slide)</span>
              </button>
              <button
                onClick={handleSwitchToSummary}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition rounded-xs cursor-pointer ${
                  storyMode === 'summary' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summary (1 Slide)</span>
              </button>
            </div>

            {/* Option to Open Dedicated Full Page Summary Studio */}
            {onOpenSummaryStoryPage && article && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSummaryStoryPage(article);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md rounded-xs border border-amber-400"
                title="Open full page Summary Studio to write custom text and download to computer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Open Summary Studio Page</span>
              </button>
            )}

            {/* Backend Long Story Option: "Make a Summary & Upload to Instagram" */}
            <button
              onClick={handleMakeSummaryAndUploadToInstagram}
              disabled={isMakingSummary}
              className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md rounded-xs border border-rose-400/50"
              title="Generates a structured executive summary of long stories on the backend and uploads it to Instagram"
            >
              {isMakingSummary ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Summarizing & Uploading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Make Summary & Upload to IG</span>
                </>
              )}
            </button>
          </div>
        </div>

        {publishedResult ? (
          /* Success Screen */
          <div className="bg-emerald-950/80 border-2 border-emerald-500 p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-2xl text-emerald-300 uppercase">
              Story Graphic Saved to Laptop!
            </h4>
            <p className="text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
              The graphic <span className="font-bold text-white">"{publishedResult.downloadedFileName}"</span> is ready in your Downloads folder!
            </p>

            <div className="bg-slate-900 border border-slate-700 p-4 max-w-md mx-auto text-left font-mono text-xs space-y-2">
              <p className="text-amber-400 font-bold flex items-center justify-between">
                <span>INSTAGRAM DISPATCH STATUS:</span>
                <span className="text-emerald-400">READY TO POST</span>
              </p>
              <p className="text-slate-300">Target Account: <strong className="text-pink-400">@lankaecon.lk</strong></p>
              <p className="text-slate-300">Story Mode: <span className="text-amber-300 font-bold">{storyMode === 'entire_story' ? 'Entire Story' : 'Summary'}</span></p>
              <p className="text-slate-300">File Type: <span className="text-emerald-300 font-bold">1080x1920 HD PNG</span></p>
              <p className="text-slate-300">Clipboard: <span className="text-amber-300">Full Caption Copied</span></p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <button
                onClick={() => handleDownloadStoryImage('png')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md rounded-xs"
              >
                <Download className="w-4 h-4" />
                <span>Re-Download PNG</span>
              </button>

              <a
                href="https://www.instagram.com/lankaecon.lk/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs px-6 py-3 uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md rounded-xs"
              >
                <Instagram className="w-4 h-4" />
                <span>Open @lankaecon.lk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyCaption}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3 uppercase tracking-wider transition cursor-pointer rounded-xs flex items-center gap-2 border border-slate-700"
              >
                <Copy className="w-4 h-4" />
                <span>{isCopied ? 'Copied Again!' : 'Copy Caption Again'}</span>
              </button>

              <button
                onClick={() => setPublishedResult(null)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 uppercase tracking-wider transition cursor-pointer rounded-xs border border-slate-700"
              >
                Back to Studio
              </button>
            </div>
          </div>
        ) : (
          /* Customization & Preview Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: 1:1 Instagram Story Preview Canvas & Slide Navigator */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram Story (1080×1920)</span>
                </span>
                <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 border border-emerald-700/80 font-bold">
                  {storyMode === 'entire_story' ? 'ENTIRE STORY (1 SLIDE)' : 'SUMMARY SLIDE'}
                </span>
              </div>

              {/* Smartphone Preview Mockup */}
              <div className="relative w-full max-w-[340px] mx-auto bg-slate-950 p-2.5 rounded-[36px] border-4 border-slate-700 shadow-2xl overflow-hidden">
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 border border-slate-700"></div>

                <div className="w-full aspect-[9/16] bg-slate-900 rounded-[24px] overflow-hidden relative shadow-inner border border-slate-800 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={1080}
                    height={1920}
                    className="w-full h-full object-contain select-none"
                  />
                </div>

                <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-2.5"></div>
              </div>

              {/* DEDICATED LAPTOP DOWNLOAD BUTTONS */}
              <div className="bg-slate-900/90 border border-slate-700 p-3 space-y-2 rounded-xs max-w-[340px] mx-auto">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center font-bold">
                  📥 Download Controls
                </p>

                {/* Primary Button */}
                <button
                  onClick={() => handleDownloadStoryImage('png')}
                  disabled={isDownloading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xs py-3 uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 rounded-xs border border-emerald-400/80"
                  title="Save story PNG to your laptop"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? 'Downloading...'
                      : 'Download Story (PNG)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadStoryImage('jpeg')}
                    disabled={isDownloading}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] py-2 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 rounded-xs border border-slate-600"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JPG</span>
                  </button>

                  <button
                    onClick={handleCopyCaption}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] py-2 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 rounded-xs border border-slate-600"
                  >
                    <Copy className="w-3.5 h-3.5 text-pink-400" />
                    <span>{isCopied ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Style Selector, Story Editor, Caption Viewer & Instagram Actions */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between h-full">
              
              <div className="space-y-4">
                
                {/* 3 View Mode Tabs */}
                <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xs">
                  <button
                    onClick={() => setActiveTab('graphic')}
                    className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'graphic' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Visual Theme</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'edit' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Edit Narrative ({summaryBullets.length} paras)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('caption')}
                    className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'caption' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-pink-400" />
                    <span>Post Caption</span>
                  </button>
                </div>

                {activeTab === 'edit' ? (
                  /* IN-DEPTH STORY EDITOR */
                  <div className="bg-slate-900 border border-slate-700 p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 font-extrabold text-xs text-amber-300 uppercase">
                        <Edit3 className="w-4 h-4 text-amber-400" />
                        <span>
                          {storyMode === 'entire_story'
                            ? 'Edit Entire Story Narrative (All Paragraphs)'
                            : 'Edit Summary Paragraphs'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (article) {
                              if (storyMode === 'entire_story') {
                                const ext = extractEntireStoryData(article);
                                setStoryTitle(ext.title);
                                setKeyNumbers(ext.keyNumbers);
                                setSummaryBullets(ext.allParagraphs);
                                setMacroImpact(ext.macroImpact);
                                setDetailedCaption(ext.detailedCaption);
                              } else {
                                const ext = extractDeterministicStoryData(article);
                                setStoryTitle(ext.title);
                                setKeyNumbers(ext.keyNumbers);
                                setSummaryBullets(ext.summaryBullets);
                                setMacroImpact(ext.macroImpact);
                                setDetailedCaption(ext.detailedCaption);
                              }
                            }
                          }}
                          className="text-[10px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                          title="Reset to article facts"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset from Article</span>
                        </button>
                      </div>
                    </div>

                    {/* Headline Edit */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Story Headline:
                      </label>
                      <input
                        type="text"
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 p-2 text-xs text-white rounded-xs focus:border-sky-400 outline-none font-serif"
                      />
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-2 border-t border-slate-800 pt-2">
                      <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                        Narrative Paragraphs ({summaryBullets.length}):
                      </label>
                      {summaryBullets.map((bullet, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">
                              Paragraph {idx + 1}:
                            </span>
                            {summaryBullets.length > 1 && (
                              <button
                                onClick={() =>
                                  setSummaryBullets(summaryBullets.filter((_, i) => i !== idx))
                                }
                                className="text-[9px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <textarea
                            rows={3}
                            value={bullet}
                            onChange={(e) => handleBulletChange(idx, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 p-2 text-xs text-slate-200 rounded-xs focus:border-sky-400 outline-none font-sans"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setSummaryBullets([
                            ...summaryBullets,
                            `Additional detailed reporting and market context from Colombo.`,
                          ])
                        }
                        className="w-full py-1.5 border border-dashed border-slate-700 hover:border-amber-400 text-[11px] text-amber-300 font-bold rounded-xs cursor-pointer flex items-center justify-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Paragraph</span>
                      </button>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2 border-t border-slate-800 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                          Key Metrics & Figures ({keyNumbers.length}):
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">Rendered on Story Header</span>
                      </div>

                      {keyNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {keyNumbers.map((num, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/50 text-amber-300 px-2 py-0.5 text-xs font-mono font-bold rounded-xs"
                            >
                              <span>{num}</span>
                              <button
                                onClick={() => handleRemoveMetric(idx)}
                                className="text-rose-400 hover:text-white font-bold ml-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add metric (e.g. +14.2%, Rs. 1,480/kg, USD 68M)..."
                          value={newMetricInput}
                          onChange={(e) => setNewMetricInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMetric();
                            }
                          }}
                          className="flex-1 bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white rounded-xs focus:border-sky-400 outline-none font-mono"
                        />
                        <button
                          onClick={handleAddMetric}
                          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Sectoral Takeaway */}
                    <div className="space-y-1 border-t border-slate-800 pt-2">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Sector Takeaway (Highlight Box):
                      </label>
                      <textarea
                        rows={2}
                        value={macroImpact}
                        onChange={(e) => setMacroImpact(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 p-2 text-xs text-amber-200 rounded-xs focus:border-amber-400 outline-none font-sans"
                        placeholder="Direct operational or policy implications for Sri Lanka..."
                      />
                    </div>
                  </div>
                ) : activeTab === 'caption' ? (
                  /* Caption View */
                  <div className="bg-slate-900 border border-slate-700 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 font-extrabold text-xs text-amber-300 uppercase">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span>
                          {storyMode === 'entire_story'
                            ? 'Complete Entire Story Caption (Full Article Text)'
                            : 'Executive Summary Caption'}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyCaption}
                        className="flex items-center gap-1 bg-[#0284C7] hover:bg-sky-600 text-white font-bold text-[10px] px-2.5 py-1 uppercase tracking-wider transition cursor-pointer rounded-xs"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-300" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Caption</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      This caption contains {storyMode === 'entire_story' ? 'the entire story text in paragraphs' : 'a structured executive summary'} formatted with hashtags and emojis:
                    </p>

                    <div className="bg-slate-950 p-3 border border-slate-800 rounded-xs font-sans text-xs text-slate-200 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed custom-scrollbar selection:bg-pink-600">
                      {detailedCaption || 'Generating dispatch caption...'}
                    </div>
                  </div>
                ) : (
                  /* Visual Theme View */
                  <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-700 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs uppercase text-amber-400 tracking-wider">
                          Official Instagram Dispatch Engine
                        </span>
                        <a
                          href="https://www.instagram.com/lankaecon.lk/?hl=en"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-pink-400 font-mono hover:underline"
                        >
                          <span>@lankaecon.lk</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <p className="text-xs text-slate-300">
                        {storyMode === 'entire_story' ? (
                          <>
                            Configured for <strong className="text-emerald-400">Entire Story Publishing</strong>. The complete article is rendered on a single high-density story graphic with dynamic auto-fit typesetting covering the space.
                          </>
                        ) : (
                          <>
                            Configured for <strong className="text-amber-300">Executive Summary Publishing</strong>. Long stories are automatically distilled into a high-density 4-paragraph brief with key numbers.
                          </>
                        )}
                      </p>

                      <div className="bg-slate-950 p-2.5 border border-slate-800 text-[11px] font-mono text-amber-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase text-slate-400 font-bold">
                            Detected Data Points ({keyNumbers.length}):
                          </span>
                          <button
                            onClick={() => setActiveTab('edit')}
                            className="text-[9px] text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Details</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {keyNumbers.map((num, i) => (
                            <span
                              key={i}
                              className="bg-amber-400/20 text-amber-300 px-2 py-0.5 border border-amber-400/50 font-bold text-[10px]"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Circle Profile Image / Avatar Customizer */}
                    <div className="bg-slate-900 border border-slate-700 p-3.5 space-y-3 rounded-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shrink-0 shadow-md">
                            <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                              {circleAvatarMode === 'monogram' || !circleAvatarUrl ? (
                                <span className="text-[11px] font-black text-amber-300">LE</span>
                              ) : (
                                <img src={circleAvatarUrl} alt="Circle avatar" className="w-full h-full object-cover" />
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs uppercase text-slate-200 tracking-wider">
                              Top Profile Circle Image / Badge
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Displays inside the rainbow circle at the top-left of the story card
                            </p>
                          </div>
                        </div>
                        <span className="text-[9.5px] font-mono px-2 py-0.5 bg-slate-800 text-amber-300 border border-slate-700 uppercase font-bold">
                          {circleAvatarMode.toUpperCase()}
                        </span>
                      </div>

                      {/* 4 Avatar Selection Options */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {/* 1. Upload Custom Photo */}
                        <label className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                          circleAvatarMode === 'upload'
                            ? 'bg-[#0284C7] border-sky-400 text-white shadow-xs'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        }`}>
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span className="font-bold text-[10.5px]">Upload Photo</span>
                          <span className="text-[9px] text-slate-400">From Laptop</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadCircleImage}
                          />
                        </label>

                        {/* 2. Author Portrait */}
                        <button
                          type="button"
                          onClick={() => {
                            const authorAvatar = article?.authors?.[0]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                            setCircleAvatarUrl(authorAvatar);
                            setCircleAvatarMode('author');
                          }}
                          className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                            circleAvatarMode === 'author'
                              ? 'bg-[#0284C7] border-sky-400 text-white shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                          }`}
                        >
                          <User className="w-3.5 h-3.5 text-sky-300" />
                          <span className="font-bold text-[10.5px]">Author Photo</span>
                          <span className="text-[9px] text-slate-400">Desk Reporter</span>
                        </button>

                        {/* 3. Official Brand Crest */}
                        <button
                          type="button"
                          onClick={() => {
                            setCircleAvatarUrl(LANKAECON_BRAND_EMBLEM_SVG);
                            setCircleAvatarMode('brand');
                          }}
                          className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                            circleAvatarMode === 'brand'
                              ? 'bg-[#0284C7] border-sky-400 text-white shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span className="font-bold text-[10.5px]">LankaEcon Logo</span>
                          <span className="text-[9px] text-slate-400">Official Seal</span>
                        </button>

                        {/* 4. Initials Monogram */}
                        <button
                          type="button"
                          onClick={() => {
                            setCircleAvatarMode('monogram');
                          }}
                          className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center ${
                            circleAvatarMode === 'monogram'
                              ? 'bg-[#0284C7] border-sky-400 text-white shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="font-mono font-black text-amber-300 text-xs">LE</span>
                          <span className="font-bold text-[10.5px]">LE Monogram</span>
                          <span className="text-[9px] text-slate-400">Gold Initials</span>
                        </button>
                      </div>

                      {/* URL input fallback */}
                      <div className="flex gap-2 pt-0.5">
                        <input
                          type="text"
                          placeholder="Or paste direct image URL (https://...)..."
                          value={customCircleInput}
                          onChange={(e) => setCustomCircleInput(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white rounded-xs focus:border-sky-400 outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customCircleInput.trim()) {
                              setCircleAvatarUrl(customCircleInput.trim());
                              setCircleAvatarMode('upload');
                            }
                          }}
                          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-xs cursor-pointer"
                        >
                          Apply URL
                        </button>
                      </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-xs uppercase text-slate-200 tracking-wider">
                        Select Badge Color Theme
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {(Object.keys(styleConfigs) as (keyof typeof styleConfigs)[]).map((styleKey) => {
                          const styleOption = styleConfigs[styleKey];
                          return (
                            <button
                              key={styleKey}
                              onClick={() => setStoryStyle(styleKey)}
                              className={`p-3 border-2 font-bold text-left transition flex items-center justify-between cursor-pointer ${
                                storyStyle === styleKey
                                  ? 'border-pink-500 bg-slate-900 ring-2 ring-pink-500/50 text-white shadow-md'
                                  : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="text-[11px] font-extrabold block">{styleOption.name}</span>
                                <span className="text-[9px] text-slate-400 font-mono block">Double-Border Frame</span>
                              </div>
                              {storyStyle === styleKey && <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions Box */}
                <div className="bg-slate-900/80 border border-slate-800 p-3 space-y-1 text-xs">
                  <p className="font-extrabold text-amber-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                    <span>How to post on Instagram:</span>
                    <span className="text-emerald-400 font-mono">1080×1920 PNG</span>
                  </p>
                  <ol className="text-[11px] text-slate-300 list-decimal pl-4 space-y-1">
                    <li>Click <strong>"Download Story (PNG)"</strong> to save the 1080×1920 graphic directly to your laptop.</li>
                    <li>Click <strong>"Post to @lankaecon.lk"</strong> to open Instagram and paste the copied caption.</li>
                    <li>Upload the story graphic to your Instagram Story or via Meta Business Suite!</li>
                  </ol>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                {isPublishing ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-pink-400 font-bold">
                      <span>Generating Graphic & Connecting to Instagram...</span>
                      <span>{publishProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${publishProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Primary Button */}
                    <button
                      onClick={() => handleDownloadStoryImage('png')}
                      disabled={isDownloading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 rounded-xs border border-emerald-400/80"
                      title="Download image to your laptop"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>
                        {isDownloading
                          ? 'Saving...'
                          : 'Download Story (PNG)'}
                      </span>
                    </button>

                    {/* Secondary Button */}
                    <button
                      onClick={handlePublishStory}
                      className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs px-5 py-3.5 uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 rounded-xs"
                      title="Download image and open official @lankaecon.lk Instagram page"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Post to @lankaecon.lk</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onClose}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs px-4 py-3.5 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 rounded-xs shrink-0"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                      <span>Close</span>
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5">
                  <span>Target Instagram Profile:</span>
                  <a
                    href="https://www.instagram.com/lankaecon.lk/?hl=en"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 font-bold underline hover:text-pink-300"
                  >
                    https://www.instagram.com/lankaecon.lk/?hl=en
                  </a>
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
