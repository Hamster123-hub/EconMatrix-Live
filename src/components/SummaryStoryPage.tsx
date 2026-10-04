import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Article } from '../types';
import {
  ArrowLeft,
  Sparkles,
  ArrowDownToLine,
  Copy,
  Check,
  Instagram,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Edit3,
  Smartphone,
  Palette,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sliders,
  X,
  Share2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Download,
  ListOrdered,
  List,
  AlignLeft,
  Wand2,
} from 'lucide-react';
import {
  extractPointsFromText,
  formatPointsToText,
  stripLeadingBullet,
  cleanGeminiMarkdown,
} from '../utils/storyPointsParser';

export interface SummaryStoryPageProps {
  initialArticle?: Article | null;
  onBack: () => void;
  language?: 'en' | 'si' | 'ta';
}

export const SummaryStoryPage: React.FC<SummaryStoryPageProps> = ({
  initialArticle,
  onBack,
  language = 'en',
}) => {
  // Editorial Fields State - "I should be able to write whatever I want"
  const [headline, setHeadline] = useState<string>(() => {
    return (
      initialArticle?.title ||
      'Sri Lanka Central Bank Maintains Policy Rates Steady to Anchor Disinflation'
    );
  });

  const [category, setCategory] = useState<string>(() => {
    return (initialArticle?.primary_category || 'ECONOMY').toUpperCase();
  });

  const [byline, setByline] = useState<string>(() => {
    if (initialArticle?.authors && initialArticle.authors.length > 0) {
      const a = initialArticle.authors[0];
      return `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'LankaEcon News Desk';
    }
    return 'LankaEcon News Desk';
  });

  const [dateline, setDateline] = useState<string>(() => {
    const d = initialArticle?.published_at || initialArticle?.created_at;
    if (d) {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase();
    }
    return 'AUG 21, 2026';
  });

  const [readTime, setReadTime] = useState<string>(() => {
    return `${initialArticle?.reading_time_minutes || 3} MIN READ`;
  });

  // Freeform vs Structured Text
  const [editorMode, setEditorMode] = useState<'freeform' | 'paragraphs'>('freeform');
  const [pointStyle, setPointStyle] = useState<'bullet' | 'numbered' | 'paragraphs'>('bullet');
  const [autoFormatOnPaste, setAutoFormatOnPaste] = useState<boolean>(true);
  const [pointFormatToast, setPointFormatToast] = useState<string | null>(null);

  const [freeformText, setFreeformText] = useState<string>(() => {
    if (initialArticle?.body) {
      const clean = initialArticle.body.replace(/<[^>]*>?/gm, '').trim();
      const extracted = extractPointsFromText(clean);
      if (extracted.length > 0) {
        return formatPointsToText(extracted.slice(0, 4), 'bullet');
      }
      return clean.substring(0, 600);
    }
    const sample = [
      'The Monetary Policy Board of the Central Bank of Sri Lanka (CBSL) has decided to maintain the Standing Deposit Facility Rate (SDFR) and the Standing Lending Facility Rate (SLFR) at current target levels.',
      'Official macroeconomic indicators confirm headline inflation remains anchored well within the target band, supported by robust foreign remittance inflows and sustained export revenue growth.',
      'Institutional analysts in Colombo note that domestic commercial credit expansion is accelerating gradually, while commercial bank interest spreads have eased across SME manufacturing and trade facilities.',
      'The monetary authority underscored that foreign exchange reserves have bolstered import coverage to over 4.8 months, providing stability against external global interest rate shocks.'
    ];
    return formatPointsToText(sample, 'bullet');
  });

  // Structured paragraphs
  const [paragraphs, setParagraphs] = useState<string[]>(() => {
    const extracted = extractPointsFromText(freeformText);
    return extracted.length > 0
      ? extracted
      : freeformText.split(/\n\s*\n/).map((p) => stripLeadingBullet(p)).filter((p) => p.trim().length > 0);
  });

  // Key figures & metrics tags
  const [keyMetrics, setKeyMetrics] = useState<string[]>(() => {
    const raw = `${headline} ${freeformText}`;
    const metricRegex = /(?:\b(?:Rs\.?|LKR|\$|USD|EUR|GBP)\s*[\d.,]+\s*(?:B|M|billion|million|crore|lakh)?\b|[\+\-]?\d+(?:\.\d+)?%|\b\d+(?:,\d+)*(?:\.\d+)?\s*(?:MT|MW|barrels?|litres?|tons?)\b|\b\d+\.?\d*\s*(?:bps)\b)/gi;
    const matches = raw.match(metricRegex);
    if (matches && matches.length > 0) {
      return Array.from(new Set(matches.map((m) => m.trim()))).slice(0, 5);
    }
    return ['+14.2% YoY', 'Rs. 1,480/kg', 'USD 68.4M', '4.8 Months Coverage'];
  });

  const [newMetricInput, setNewMetricInput] = useState('');

  // Sector Takeaway / Highlight Box
  const [sectorTakeaway, setSectorTakeaway] = useState<string>(() => {
    return `Operational takeaway: Lower financing costs and FX reserve buffers provide certainty for Colombo corporates entering long-term capex contracts.`;
  });

  // Theme Style
  const [storyStyle, setStoryStyle] = useState<'navy_gold' | 'deep_emerald' | 'executive_blue' | 'dark_editorial'>('navy_gold');

  // Font scale preference (normal 30px clear, large 35px extra legible, extra_large 40px, compact 25px, auto)
  const [fontScaling, setFontScaling] = useState<'auto' | 'compact' | 'normal' | 'large' | 'extra_large'>('normal');

  // Multi-Slide continuation state
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [paginationMode, setPaginationMode] = useState<'auto' | '2' | '3' | '4' | '5' | 'single'>('auto');
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);

  // Preview & Download States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSummarizingWithAi, setIsSummarizingWithAi] = useState(false);

  // Direct Live Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync freeform text to paragraphs when edited
  const handleFreeformChange = (val: string) => {
    setFreeformText(val);
    const parsed = extractPointsFromText(val);
    if (parsed.length > 0) {
      setParagraphs(parsed);
    } else if (val.trim()) {
      setParagraphs([stripLeadingBullet(val.trim())]);
    } else {
      setParagraphs([]);
    }
  };

  // Automatically format pasted text from Gemini, ChatGPT, or AI into structured points
  const handleFreeformPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!autoFormatOnPaste) return;

    const pastedText = e.clipboardData.getData('text');
    if (!pastedText || !pastedText.trim()) return;

    // Detect if pasted text has bullets, numbers, newlines, markdown asterisks, or multiple sentences
    const hasBullets = /(?:^|\n)\s*(?:[•*\-+▪▫—–>■●◆◇✦❖✔✅👉🔹🔸▫️*️⃣]|\d+[\.\)\-]|\[\d+\]|\(\d+\)|(?:Point|Item|Takeaway|Fact|Key point)\s*#?\d+[\.:\-\)])\s+/im.test(pastedText);
    const hasNewlines = pastedText.includes('\n');
    const hasGeminiMarkdown = /\*\*[^*]+\*\*/.test(pastedText) || /\* [^*]+/.test(pastedText);
    const isMultiSentence = (pastedText.match(/[.!?]\s+[A-Z0-9"']/g) || []).length >= 1;

    if (hasBullets || hasNewlines || hasGeminiMarkdown || isMultiSentence || pastedText.length > 50) {
      e.preventDefault();

      const target = e.currentTarget;
      const currentVal = target.value;
      const isFullReplace = currentVal.trim().length === 0 ||
        (target.selectionEnd - target.selectionStart) >= (currentVal.length * 0.7);

      const textToProcess = isFullReplace
        ? pastedText
        : (currentVal.slice(0, target.selectionStart || 0) + '\n\n' + pastedText + '\n\n' + currentVal.slice(target.selectionEnd || 0));

      const extracted = extractPointsFromText(textToProcess);
      if (extracted.length > 0) {
        const formatted = formatPointsToText(extracted, pointStyle);
        setFreeformText(formatted);
        setParagraphs(extracted);

        setPointFormatToast(`✓ Captured ${extracted.length} story points from your text!`);
        setTimeout(() => setPointFormatToast(null), 4000);
      }
    }
  };

  // Manually reformat current freeform text into points
  const handleManualAutoFormat = () => {
    if (!freeformText.trim()) return;
    const extracted = extractPointsFromText(freeformText);
    if (extracted.length > 0) {
      const formatted = formatPointsToText(extracted, pointStyle);
      setFreeformText(formatted);
      setParagraphs(extracted);
      setPointFormatToast(`✓ Formatted into ${extracted.length} structured story points!`);
      setTimeout(() => setPointFormatToast(null), 3500);
    }
  };

  // Switch bullet / numbered / paragraph style for freeform text
  const handleChangePointStyle = (newStyle: 'bullet' | 'numbered' | 'paragraphs') => {
    setPointStyle(newStyle);
    if (paragraphs.length > 0) {
      const formatted = formatPointsToText(paragraphs, newStyle);
      setFreeformText(formatted);
    }
  };

  // Sync structured paragraphs to freeform text
  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...paragraphs];
    updated[index] = stripLeadingBullet(val);
    setParagraphs(updated);
    setFreeformText(formatPointsToText(updated, pointStyle));
  };

  const handleAddParagraph = () => {
    const updated = [...paragraphs, 'New key takeaway or supporting context for Sri Lanka markets.'];
    setParagraphs(updated);
    setFreeformText(formatPointsToText(updated, pointStyle));
  };

  const handleDeleteParagraph = (index: number) => {
    if (paragraphs.length <= 1) return;
    const updated = paragraphs.filter((_, i) => i !== index);
    setParagraphs(updated);
    setFreeformText(formatPointsToText(updated, pointStyle));
  };

  // Add & Remove Key Metrics
  const handleAddMetric = () => {
    const clean = newMetricInput.trim();
    if (!clean) return;
    if (!keyMetrics.includes(clean)) {
      setKeyMetrics([...keyMetrics, clean]);
    }
    setNewMetricInput('');
  };

  const handleRemoveMetric = (index: number) => {
    setKeyMetrics(keyMetrics.filter((_, i) => i !== index));
  };

  // Preset Palettes with high-contrast text for crystal clear readability
  const palettes = {
    navy_gold: {
      name: 'Colombo Navy & Gold',
      bgTop: '#0B1E36',
      bgMid: '#071526',
      bgBottom: '#020A14',
      cardBg: '#FFFDF9',
      cardBorder: '#0B1E36',
      innerBorder: '#D4A373',
      headerBg: '#0B1E36',
      headerText: '#FDE047',
      titleText: '#0B1E36',
      chipBg: '#0B1E36',
      chipText: '#FDE047',
      chipBorder: '#EAB308',
      narrativeBg: '#F8F5EE',
      narrativeBorder: '#E2D9CC',
      narrativeText: '#0F172A',
      highlightBg: '#FEF3C7',
      highlightBorder: '#F59E0B',
      highlightText: '#78350F',
      footerBadge: '#0B1E36',
    },
    deep_emerald: {
      name: 'Deep Emerald & Mint',
      bgTop: '#064E3B',
      bgMid: '#022C22',
      bgBottom: '#011711',
      cardBg: '#FCFDFB',
      cardBorder: '#064E3B',
      innerBorder: '#10B981',
      headerBg: '#064E3B',
      headerText: '#A7F3D0',
      titleText: '#064E3B',
      chipBg: '#064E3B',
      chipText: '#6EE7B7',
      chipBorder: '#34D399',
      narrativeBg: '#F0FDF4',
      narrativeBorder: '#BBF7D0',
      narrativeText: '#022C22',
      highlightBg: '#D1FAE5',
      highlightBorder: '#10B981',
      highlightText: '#064E3B',
      footerBadge: '#064E3B',
    },
    executive_blue: {
      name: 'Executive Blue & Azure',
      bgTop: '#0B2545',
      bgMid: '#08192E',
      bgBottom: '#030C18',
      cardBg: '#F8FAFC',
      cardBorder: '#0284C7',
      innerBorder: '#38BDF8',
      headerBg: '#0284C7',
      headerText: '#FFFFFF',
      titleText: '#0F172A',
      chipBg: '#0369A1',
      chipText: '#F0F9FF',
      chipBorder: '#38BDF8',
      narrativeBg: '#F0F9FF',
      narrativeBorder: '#BAE6FD',
      narrativeText: '#0F172A',
      highlightBg: '#E0F2FE',
      highlightBorder: '#0284C7',
      highlightText: '#0369A1',
      footerBadge: '#0284C7',
    },
    dark_editorial: {
      name: 'Dark Broadsheet Charcoal',
      bgTop: '#18181B',
      bgMid: '#09090B',
      bgBottom: '#000000',
      cardBg: '#FFFFFF',
      cardBorder: '#18181B',
      innerBorder: '#71717A',
      headerBg: '#18181B',
      headerText: '#F4F4F5',
      titleText: '#09090B',
      chipBg: '#27272A',
      chipText: '#FAFAFA',
      chipBorder: '#52525B',
      narrativeBg: '#F4F4F5',
      narrativeBorder: '#E4E4E7',
      narrativeText: '#09090B',
      highlightBg: '#E4E4E7',
      highlightBorder: '#71717A',
      highlightText: '#09090B',
      footerBadge: '#18181B',
    },
  };

  // Helper function to draw rounded rectangle on canvas
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  };

  // Helper function to break text into lines cleanly
  const breakTextIntoLines = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Multi-slide calculation: split paragraphs into sequential slides if content is long
  const rawParagraphsToDraw = useMemo(() => {
    const list = paragraphs.length > 0 ? paragraphs : extractPointsFromText(freeformText);
    const cleaned = list
      .map((p) => stripLeadingBullet(p))
      .filter((p) => p.trim().length > 0);
    return cleaned.length > 0 ? cleaned : [freeformText.trim() || 'No story content yet'];
  }, [paragraphs, freeformText]);

  // Compute slide chunks dynamically:
  // If there are too many points to fit comfortably in a single story, they automatically spill over to the next slide.
  // Each slide fills its vertical space completely, and only when a point cannot fit does it paginate.
  const slideParagraphChunks = useMemo(() => {
    if (rawParagraphsToDraw.length <= 1) {
      return [rawParagraphsToDraw];
    }

    if (paginationMode === 'single') {
      return [rawParagraphsToDraw];
    }

    if (['2', '3', '4', '5'].includes(paginationMode)) {
      const perSlide = parseInt(paginationMode, 10);
      const chunks: string[][] = [];
      for (let i = 0; i < rawParagraphsToDraw.length; i += perSlide) {
        chunks.push(rawParagraphsToDraw.slice(i, i + perSlide));
      }
      return chunks.length > 0 ? chunks : [rawParagraphsToDraw];
    }

    // Auto-flow mode: exact geometric space calculation based on card dimensions
    // Canvas dimensions: 1080 x 1920. Card: Y=220, H=1480, bottomLimitY=1682
    const cardY = 220;
    const cardH = 1480;
    const bottomLimitY = cardY + cardH - 18; // 1682

    // Estimate headline height (44px bold, line-height 54px, max 3 lines + 12px margin)
    const headlineWords = (headline || '').split(/\s+/).filter(Boolean);
    let headlineLines = 1;
    let charCount = 0;
    for (const w of headlineWords) {
      if (charCount + w.length + 1 > 34 && charCount > 0) {
        headlineLines++;
        charCount = w.length;
      } else {
        charCount += (charCount === 0 ? 0 : 1) + w.length;
      }
    }
    const drawnHeadlineLines = Math.min(3, Math.max(1, headlineLines));
    const headlineHeight = (drawnHeadlineLines * 54) + 12;

    const metricsHeight = (keyMetrics && keyMetrics.length > 0) ? 50 : 0;
    const curY = cardY + 144 + headlineHeight + metricsHeight;
    const pointsBoxY = curY + 6;
    const pointsBoxH = Math.max(bottomLimitY - pointsBoxY, 820);

    // Usable height inside pointsBox:
    // Container top header takes 76px (textStartY = pointsBoxY + 76)
    // Continuation banner on intermediate slides takes 52px + 16px bottom margin + 14px safety gap = 82px
    const availContinuationH = pointsBoxH - 76 - 82;

    // Last slide has takeaway box (126px + 16px margin + 14px safety gap = 156px) or bottom margin 24px
    const hasTakeaway = Boolean(sectorTakeaway && sectorTakeaway.trim().length > 0);
    const availFinalH = pointsBoxH - 76 - (hasTakeaway ? 156 : 24);

    // Helper to calculate wrapped line count for text in 838px paragraph width at 28px font
    const estimateParaLines = (text: string, fontSize: number = 28): number => {
      const charsPerLine = Math.max(30, Math.floor(838 / (fontSize * 0.58)));
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length === 0) return 1;
      let count = 0;
      let curLen = 0;
      for (const w of words) {
        if (curLen + w.length + 1 > charsPerLine && curLen > 0) {
          count++;
          curLen = w.length;
        } else {
          curLen += (curLen === 0 ? 0 : 1) + w.length;
        }
      }
      if (curLen > 0) count++;
      return Math.max(1, count);
    };

    // 1. Check if ALL points comfortably fit on 1 single story slide without overflowing
    // We test standard to compact font sizes (28px down to 21px) to see if all points fit on 1 story
    for (let testF = 28; testF >= 21; testF -= 1) {
      const testLineH = Math.round(testF * 1.42);
      const testGap = Math.round(testF * 0.65);
      let totalAllH = 0;
      for (let i = 0; i < rawParagraphsToDraw.length; i++) {
        const lines = estimateParaLines(rawParagraphsToDraw[i], testF);
        const pH = Math.max(testF + 14, lines * testLineH);
        totalAllH += pH + (i > 0 ? testGap : 0);
      }
      if (totalAllH <= availFinalH) {
        // ALL points fit on 1 single story card without being too long!
        return [rawParagraphsToDraw];
      }
    }

    // 2. The points are genuinely too long to fit onto 1 story!
    // Greedily pack each story slide with as many points as can fit in the vertical space.
    // ONLY when adding the next point exceeds available height does it spill over to the next story!
    const packF = 25;
    const packLineH = 37;
    const packGap = 18;

    const slides: string[][] = [];
    let curSlide: string[] = [];
    let curSlideH = 0;

    for (let i = 0; i < rawParagraphsToDraw.length; i++) {
      const p = rawParagraphsToDraw[i];
      const pLines = estimateParaLines(p, packF);
      const pH = Math.max(packF + 14, pLines * packLineH);
      const isRemainingAfterThis = i < rawParagraphsToDraw.length - 1;

      // On intermediate slides, continuation banner takes space (availContinuationH)
      // On the final slide, takeaway / margin takes space (availFinalH)
      const targetAvailH = isRemainingAfterThis ? availContinuationH : availFinalH;
      const additionalH = curSlide.length > 0 ? (pH + packGap) : pH;

      // ONLY if it is physically too long for this slide:
      const wouldExceedHeight = (curSlideH + additionalH) > targetAvailH;

      if (curSlide.length > 0 && wouldExceedHeight) {
        // Point cannot fit on this story card -> Automatically push to next story slide!
        slides.push(curSlide);
        curSlide = [p];
        curSlideH = pH;
      } else {
        curSlide.push(p);
        curSlideH += additionalH;
      }
    }

    if (curSlide.length > 0) {
      slides.push(curSlide);
    }

    return slides.length > 0 ? slides : [rawParagraphsToDraw];
  }, [rawParagraphsToDraw, sectorTakeaway, headline, keyMetrics, paginationMode]);

  const totalSlides = slideParagraphChunks.length;

  // Reset slide index if it exceeds total slides
  useEffect(() => {
    if (totalSlides > 0 && activeSlideIndex >= totalSlides) {
      setActiveSlideIndex(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides, activeSlideIndex]);

  // Master Canvas Drawing Function (1080x1920) with Multi-Slide Support
  const drawSummaryCanvas = useCallback((slideIdx: number = activeSlideIndex) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const palette = palettes[storyStyle] || (palettes as Record<string, any>)['executive_blue'] || palettes.navy_gold;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, palette.bgTop);
    bgGrad.addColorStop(0.5, palette.bgMid);
    bgGrad.addColorStop(1, palette.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Outer Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, width - 36, height - 36);

    // 3. Instagram Story Top Bar: segmented if multi-slide
    const currentSlide = Math.min(slideIdx, totalSlides - 1);
    const topBarY = 46;
    const topBarTotalW = width - 120; // 960px
    const barGap = 6;
    const segmentW = (topBarTotalW - (totalSlides - 1) * barGap) / totalSlides;

    for (let s = 0; s < totalSlides; s++) {
      const segX = 60 + s * (segmentW + barGap);
      ctx.fillStyle = s <= currentSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)';
      roundRect(ctx, segX, topBarY, segmentW, 6, 3);
      ctx.fill();
    }

    // 4. Instagram Profile Header (@lankaecon.lk)
    const avatarX = 98;
    const avatarY = 106;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, 36, 0, Math.PI * 2);
    const ringGrad = ctx.createLinearGradient(avatarX - 36, avatarY - 36, avatarX + 36, avatarY + 36);
    ringGrad.addColorStop(0, '#F59E0B');
    ringGrad.addColorStop(0.5, '#EC4899');
    ringGrad.addColorStop(1, '#8B5CF6');
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = palette.headerBg;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 23px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LE', avatarX, avatarY);
    ctx.restore();

    // Handle & Verified Checkmark
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 33px system-ui, -apple-system, sans-serif';
    ctx.fillText('lankaecon.lk', 150, 98);

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(354, 93, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0B1E36';
    ctx.font = '900 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓', 354, 98);

    // Subtitle & Slide indicator
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 21px monospace';
    const slideSubtitle = totalSlides > 1
      ? `Executive Summary • Slide ${currentSlide + 1} of ${totalSlides}`
      : 'Executive Summary Story • Official Dispatch';
    ctx.fillText(slideSubtitle, 150, 125);

    // Close marker
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 26px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('✕', width - 60, 108);

    // 5. Central Dispatch Card (Maximized vertical canvas space)
    const cardX = 46;
    const cardY = 150;
    const cardW = width - 92; // 988px
    const cardH = 1716; // Y reaches down to 1866px (maximizing single story space)

    // Shadow & Background
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

    // Inner decorative gold border
    ctx.strokeStyle = palette.innerBorder;
    ctx.lineWidth = 2;
    roundRect(ctx, cardX + 10, cardY + 10, cardW - 20, cardH - 20, 18);
    ctx.stroke();

    // 6. Header Tag inside Card
    ctx.fillStyle = palette.headerBg;
    roundRect(ctx, cardX + 26, cardY + 22, 440, 44, 8);
    ctx.fill();
    ctx.fillStyle = palette.headerText;
    ctx.font = '900 19px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    const cardHeaderBadge = totalSlides > 1
      ? `🇱🇰 LANKAECON • SUMMARY (${currentSlide + 1}/${totalSlides})`
      : '🇱🇰 LANKAECON • EXECUTIVE SUMMARY';
    ctx.fillText(cardHeaderBadge, cardX + 40, cardY + 50);

    // Category Tag on right
    const categoryName = (category || 'ECONOMY').toUpperCase();
    ctx.fillStyle = '#F0F9FF';
    roundRect(ctx, cardX + cardW - 260, cardY + 20, 234, 46, 8);
    ctx.fill();
    ctx.strokeStyle = palette.cardBorder;
    ctx.lineWidth = 2.5;
    roundRect(ctx, cardX + cardW - 260, cardY + 20, 234, 46, 8);
    ctx.stroke();
    ctx.fillStyle = palette.cardBorder;
    ctx.font = '900 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(categoryName, cardX + cardW - 143, cardY + 50);

    // Byline & Date line - bolder and larger for crisp mobile viewing
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(
      `BY ${byline.toUpperCase()} • ${dateline.toUpperCase()} • ${readTime.toUpperCase()}`,
      cardX + 30,
      cardY + 97
    );

    let curY = cardY + 144;

    // 7. Headline Rendering - Bold, prominent and effortlessly legible
    ctx.fillStyle = palette.titleText;
    ctx.font = 'bold 47px "Georgia", "Times New Roman", serif';
    const headlineLines = breakTextIntoLines(ctx, headline, cardW - 60);
    const headlineToDraw = headlineLines.slice(0, 3);
    headlineToDraw.forEach((line) => {
      ctx.fillText(line, cardX + 30, curY);
      curY += 57;
    });
    curY += 12;

    // 8. Key Metrics Corridor - bold, larger figures
    if (keyMetrics && keyMetrics.length > 0) {
      let chipX = cardX + 30;
      const chipRowY = curY;
      const metricsToDraw = keyMetrics.slice(0, 5);

      metricsToDraw.forEach((num) => {
        ctx.font = '900 22px monospace';
        const textWidth = ctx.measureText(num).width;
        const pillW = textWidth + 28;

        if (chipX + pillW > cardX + cardW - 30) return;

        ctx.fillStyle = palette.chipBg;
        roundRect(ctx, chipX, chipRowY, pillW, 36, 6);
        ctx.fill();
        ctx.strokeStyle = palette.chipBorder;
        ctx.lineWidth = 1.6;
        roundRect(ctx, chipX, chipRowY, pillW, 36, 6);
        ctx.stroke();

        ctx.fillStyle = palette.chipText;
        ctx.fillText(num, chipX + 14, chipRowY + 25);
        chipX += pillW + 10;
      });
      curY = chipRowY + 50;
    }

    // 9. Main Narrative Container
    const pointsBoxX = cardX + 20;
    const pointsBoxW = cardW - 40; // 948px
    const pointsBoxY = curY + 6;
    const bottomLimitY = cardY + cardH - 18; // 1680px
    const pointsBoxH = Math.max(bottomLimitY - pointsBoxY, 820);

    // Frame
    ctx.fillStyle = palette.narrativeBg;
    roundRect(ctx, pointsBoxX, pointsBoxY, pointsBoxW, pointsBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = palette.narrativeBorder;
    ctx.lineWidth = 2.5;
    roundRect(ctx, pointsBoxX, pointsBoxY, pointsBoxW, pointsBoxH, 16);
    ctx.stroke();

    // Narrative Container Title Banner
    ctx.fillStyle = palette.headerBg;
    roundRect(ctx, pointsBoxX + 16, pointsBoxY + 14, 480, 38, 6);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 17px monospace';
    const bannerLabel = totalSlides > 1
      ? `⚡ VERIFIED ECONOMIC SUMMARY • PART ${currentSlide + 1} OF ${totalSlides}`
      : '⚡ VERIFIED ECONOMIC SUMMARY • COLOMBO';
    ctx.fillText(bannerLabel, pointsBoxX + 28, pointsBoxY + 39);

    // Continuation pill tag if multiple slides
    if (totalSlides > 1) {
      const continuationTag = currentSlide === 0
        ? 'SWIPE FOR PART 2 ➔'
        : currentSlide === totalSlides - 1
        ? `FINAL PART (${totalSlides}/${totalSlides})`
        : `CONTINUES (PART ${currentSlide + 1}/${totalSlides}) ➔`;

      ctx.fillStyle = '#FEF3C7';
      const tagW = 216;
      roundRect(ctx, pointsBoxX + pointsBoxW - tagW - 16, pointsBoxY + 14, tagW, 38, 6);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.5;
      roundRect(ctx, pointsBoxX + pointsBoxW - tagW - 16, pointsBoxY + 14, tagW, 38, 6);
      ctx.stroke();
      ctx.fillStyle = '#92400E';
      ctx.font = '900 14.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(continuationTag, pointsBoxX + pointsBoxW - tagW / 2 - 16, pointsBoxY + 38);
      ctx.textAlign = 'left';
    }

    // Dynamic Font Calculation & Space Filling - fill the entire card with the story
    const isLastSlide = currentSlide === totalSlides - 1;
    const hasTakeaway = Boolean(sectorTakeaway && sectorTakeaway.trim().length > 0 && isLastSlide);
    const paragraphsToDraw = (slideParagraphChunks[currentSlide] || rawParagraphsToDraw).map((p) => stripLeadingBullet(p));
    const slideStartIdx = slideParagraphChunks
      .slice(0, currentSlide)
      .reduce((acc, chunk) => acc + chunk.length, 0);
    const maxTextWidth = pointsBoxW - 64; // 884px
    const paragraphTextWidth = maxTextWidth - 46; // 838px

    // Define bottom anchors
    const continueBoxH = 54;
    const continueBoxY = pointsBoxY + pointsBoxH - continueBoxH - 16;
    const takeawayBoxH = 130;
    const takeawayBoxY = pointsBoxY + pointsBoxH - takeawayBoxH - 16;

    const textStartY = pointsBoxY + 76;
    let availTextH: number;
    if (!isLastSlide) {
      availTextH = continueBoxY - 14 - textStartY;
    } else if (hasTakeaway) {
      availTextH = takeawayBoxY - 14 - textStartY;
    } else {
      availTextH = (pointsBoxY + pointsBoxH - 24) - textStartY;
    }

    // Determine font size, line-height and paragraph spacing (very slightly enlarged)
    const targetBaseF = fontScaling === 'compact' ? 27.5 : fontScaling === 'large' ? 36 : fontScaling === 'extra_large' ? 42 : 32;
    const maxTestF = fontScaling === 'auto' ? 40 : targetBaseF;

    let fontSize = 30;
    let baseLineHeight = 43;
    let baseParaGap = 20;
    let linesByPara: string[][] = [];

    // Dynamically find the best font size (from maxTestF down to 21px) that fits cleanly into availTextH
    for (let testF = maxTestF; testF >= 21; testF -= 1) {
      ctx.font = `600 ${testF}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const testLineH = Math.round(testF * 1.44);
      const testGap = Math.round(testF * 0.65);

      const tempLines: string[][] = [];
      let totalLines = 0;
      for (const p of paragraphsToDraw) {
        const l = breakTextIntoLines(ctx, p, paragraphTextWidth);
        tempLines.push(l);
        totalLines += l.length;
      }

      const naturalH = (totalLines * testLineH) + (Math.max(0, paragraphsToDraw.length - 1) * testGap);
      if (naturalH <= availTextH || testF === 21) {
        fontSize = testF;
        baseLineHeight = testLineH;
        baseParaGap = testGap;
        linesByPara = tempLines;
        break;
      }
    }

    // Fallback if no lines computed
    if (linesByPara.length === 0) {
      fontSize = 24.5;
      baseLineHeight = 36;
      baseParaGap = 18;
      ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      for (const p of paragraphsToDraw) {
        linesByPara.push(breakTextIntoLines(ctx, p, paragraphTextWidth));
      }
    }

    // FILL THE ENTIRE THING: Distribute remaining vertical space into line-height and paragraph spacing
    const totalLinesCount = linesByPara.reduce((acc, l) => acc + l.length, 0);
    const naturalHeight = (totalLinesCount * baseLineHeight) + (Math.max(0, paragraphsToDraw.length - 1) * baseParaGap);
    const remainingSpace = availTextH - naturalHeight;

    let lineHeight = baseLineHeight;
    let pGap = baseParaGap;

    if (remainingSpace > 10) {
      // Distribute extra space smoothly across lines (up to +40% line height) and gaps
      const extraPerLine = Math.min((remainingSpace * 0.42) / Math.max(1, totalLinesCount), baseLineHeight * 0.4);
      lineHeight = Math.round(baseLineHeight + extraPerLine);

      const unusedSpace = remainingSpace - (extraPerLine * totalLinesCount);
      const extraGap = Math.min(unusedSpace / Math.max(1, paragraphsToDraw.length - 1), 60);
      pGap = Math.round(baseParaGap + extraGap);
    } else if (remainingSpace < -4) {
      // Gracefully tighten line-height and gap if large font is selected so text never spills over
      const deficitPerLine = Math.abs(remainingSpace) / Math.max(1, totalLinesCount);
      lineHeight = Math.max(fontSize + 4, Math.round(baseLineHeight - deficitPerLine));
      pGap = Math.max(8, Math.round(baseParaGap - (deficitPerLine * 0.4)));
    }

    // Draw the narrative paragraphs starting at textStartY
    let textY = textStartY + Math.round(lineHeight * 0.75);

    paragraphsToDraw.forEach((pText, idxInSlide) => {
      const globalBulletNum = slideStartIdx + idxInSlide + 1;
      const pLines = linesByPara[idxInSlide] || [pText];

      // Paragraph numbering badge
      ctx.fillStyle = palette.headerBg;
      roundRect(ctx, pointsBoxX + 22, textY - 25, 36, 36, 6);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 19px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${globalBulletNum}`, pointsBoxX + 40, textY - 1);
      ctx.textAlign = 'left';

      // Lines
      ctx.fillStyle = palette.narrativeText;
      ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      pLines.forEach((line) => {
        ctx.fillText(line, pointsBoxX + 72, textY);
        textY += lineHeight;
      });

      textY += pGap;
    });

    // 10. Sector Takeaway / Highlight Box at the base of the container (Shown on last slide)
    if (hasTakeaway) {
      ctx.fillStyle = palette.highlightBg;
      roundRect(ctx, pointsBoxX + 20, takeawayBoxY, pointsBoxW - 40, takeawayBoxH, 12);
      ctx.fill();
      ctx.strokeStyle = palette.highlightBorder;
      ctx.lineWidth = 2;
      roundRect(ctx, pointsBoxX + 20, takeawayBoxY, pointsBoxW - 40, takeawayBoxH, 12);
      ctx.stroke();

      ctx.fillStyle = palette.highlightText;
      ctx.font = '900 19px monospace';
      ctx.fillText('💡 STRATEGIC TAKEAWAY FOR SRI LANKA ENTERPRISE:', pointsBoxX + 36, takeawayBoxY + 31);

      ctx.font = 'bold 26px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
      const takeawayLines = breakTextIntoLines(ctx, sectorTakeaway, pointsBoxW - 76);
      let tY = takeawayBoxY + 65;
      takeawayLines.slice(0, 2).forEach((tLine) => {
        ctx.fillText(tLine, pointsBoxX + 36, tY);
        tY += 35;
      });
    } else if (!isLastSlide) {
      // Continuation banner at the bottom of intermediate slides
      ctx.fillStyle = '#0B1E36';
      roundRect(ctx, pointsBoxX + 20, continueBoxY, pointsBoxW - 40, continueBoxH, 10);
      ctx.fill();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      roundRect(ctx, pointsBoxX + 20, continueBoxY, pointsBoxW - 40, continueBoxH, 10);
      ctx.stroke();

      ctx.fillStyle = '#FDE047';
      ctx.font = '900 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `👉 STORY CONTINUES ON SLIDE ${currentSlide + 2} OF ${totalSlides} (SWIPE NEXT)`,
        pointsBoxX + pointsBoxW / 2,
        continueBoxY + 34
      );
      ctx.textAlign = 'left';
    }

    // 11. Subtle Bottom Dateline Stamp (Maximized space - removed "Follow LankaEcon.lk on Instagram")
    const footerY = height - 32;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '600 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LankaEcon.lk • Colombo Financial Desk • Tap link in bio for full report', width / 2, footerY);

    // Direct canvas rendering on-screen - no dataURL / state update loops!
  }, [
    activeSlideIndex,
    totalSlides,
    slideParagraphChunks,
    rawParagraphsToDraw,
    headline,
    category,
    byline,
    dateline,
    readTime,
    paragraphs,
    freeformText,
    keyMetrics,
    sectorTakeaway,
    storyStyle,
    fontScaling,
  ]);

  // Redraw canvas whenever any field changes
  useEffect(() => {
    drawSummaryCanvas(activeSlideIndex);
  }, [drawSummaryCanvas, activeSlideIndex]);

  // Generate Image Blob for Download
  const generateCanvasBlob = (format: 'image/png' | 'image/jpeg', slideIdx: number = activeSlideIndex): Promise<{ blob: Blob; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current || document.createElement('canvas');
      drawSummaryCanvas(slideIdx);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas export failed'));
            return;
          }
          resolve({ blob, dataUrl: canvas.toDataURL(format, 0.95) });
        },
        format,
        0.95
      );
    });
  };

  // 1-Click Download Story Image to Computer (The Core User Request!)
  const handleDownloadStoryToComputer = async (format: 'png' | 'jpeg' = 'png') => {
    setIsDownloading(true);
    try {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const ext = format === 'png' ? 'png' : 'jpg';
      const { blob } = await generateCanvasBlob(mimeType, activeSlideIndex);

      const safeSlug = headline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .substring(0, 32);
      const slideSuffix = totalSlides > 1 ? `_part${activeSlideIndex + 1}_of_${totalSlides}` : '';
      const fileName = `LankaEcon_Summary_Story_${safeSlug || 'brief'}${slideSuffix}.${ext}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 250);

      // Auto-copy Instagram caption to clipboard
      const generatedCaption = getFormattedCaption();
      if (generatedCaption) {
        navigator.clipboard.writeText(generatedCaption).catch(() => {});
      }

      setDownloadSuccessToast(fileName);
      setTimeout(() => {
        setDownloadSuccessToast(null);
      }, 6000);
    } catch (err) {
      console.error(err);
      alert('Error rendering or downloading story graphic. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Bulk Download All Sequential Slides
  const handleDownloadAllSlides = async () => {
    if (totalSlides <= 1) {
      await handleDownloadStoryToComputer('png');
      return;
    }
    setIsDownloadingAll(true);
    try {
      const safeSlug = headline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .substring(0, 32);

      for (let s = 0; s < totalSlides; s++) {
        const { blob } = await generateCanvasBlob('image/png', s);
        const fileName = `LankaEcon_Summary_Story_${safeSlug || 'brief'}_part${s + 1}_of_${totalSlides}.png`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        await new Promise((r) => setTimeout(r, 400));
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      // Restore active slide view
      drawSummaryCanvas(activeSlideIndex);

      setDownloadSuccessToast(`Downloaded all ${totalSlides} slides!`);
      setTimeout(() => {
        setDownloadSuccessToast(null);
      }, 6000);
    } catch (err) {
      console.error(err);
      alert('Failed to download all slides.');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Generate Instagram Caption
  const getFormattedCaption = () => {
    const catClean = category.replace(/[^A-Z0-9]/gi, '');
    const hashtags = `#LankaEcon #SriLankaNews #SriLankaEconomy #${catClean} #SriLanka #${category.toLowerCase()}`;
    const bulletText = paragraphs.map((p, idx) => `[${idx + 1}] ${p.trim()}`).join('\n\n');
    const metricsBlock =
      keyMetrics.length > 0
        ? `📊 KEY FIGURES & METRICS:\n${keyMetrics.map((k) => `• ${k}`).join('\n')}\n\n`
        : '';

    return `🇱🇰 LANKAECON DISPATCH [EXECUTIVE SUMMARY] • ${category}\n\n📌 ${headline.toUpperCase()}\n✍️ By ${byline} • LankaEcon Desk\n📅 ${dateline} • ${readTime}\n\n${bulletText}\n\n${metricsBlock}💡 STRATEGIC TAKEAWAY:\n• ${sectorTakeaway}\n\n🔗 Read full report and continuous economic coverage at: https://www.lankaecon.lk\n\n${hashtags}`;
  };

  const handleCopyCaption = async () => {
    const caption = getFormattedCaption();
    try {
      await navigator.clipboard.writeText(caption);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  // AI Assistant: Distill/Summarize text if requested
  const handleAiAutoSummarize = async () => {
    setIsSummarizingWithAi(true);
    try {
      const res = await fetch('/api/instagram/make-summary-and-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: headline,
          deck: headline,
          body: freeformText,
          category,
          authorName: byline,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.summaryBullets) && data.summaryBullets.length > 0) {
        const cleanBullets = data.summaryBullets.map((b: string) => stripLeadingBullet(b));
        setParagraphs(cleanBullets);
        setFreeformText(formatPointsToText(cleanBullets, pointStyle));
        if (Array.isArray(data.keyNumbers) && data.keyNumbers.length > 0) {
          setKeyMetrics(data.keyNumbers);
        }
        if (data.macroImpact) {
          setSectorTakeaway(data.macroImpact);
        }
        setPointFormatToast(`✓ AI extracted ${cleanBullets.length} concise story points!`);
        setTimeout(() => setPointFormatToast(null), 3500);
      } else {
        const extracted = extractPointsFromText(freeformText);
        if (extracted.length > 0) {
          setParagraphs(extracted);
          setFreeformText(formatPointsToText(extracted, pointStyle));
        }
      }
    } catch {
      // Fallback
      const extracted = extractPointsFromText(freeformText);
      if (extracted.length > 0) {
        setParagraphs(extracted);
        setFreeformText(formatPointsToText(extracted, pointStyle));
      }
    } finally {
      setIsSummarizingWithAi(false);
    }
  };

  // Reset to sample template
  const handleResetToSample = () => {
    setHeadline('Sri Lanka Tourism Revenue Surges Past $1.8 Billion in Strong H1 Performance');
    setCategory('ECONOMY');
    setByline('LankaEcon Markets Desk');
    setDateline('AUG 21, 2026');
    setReadTime('3 MIN READ');
    const samplePoints = [
      "Sri Lanka's tourism sector has generated over USD 1.84 billion in earnings during the first seven months of the calendar year, reflecting a robust 42.8% expansion compared to the corresponding period last year.",
      "Official tourist arrivals crossed the 1.2 million threshold in July, propelled by sustained visitor flows from key source markets including India, the United Kingdom, Russia, and Germany.",
      "Industry stakeholders report a noticeable increase in average daily room tariffs across five-star resort corridors and Colombo business hotels, improving operating profit margins.",
      "The Central Bank highlighted that strong tourism services receipts have significantly bolstered current account liquidity and stabilized commercial exchange rate pricing."
    ];
    setFreeformText(formatPointsToText(samplePoints, pointStyle));
    setParagraphs(samplePoints);
    setKeyMetrics(['+42.8% Growth', 'USD 1.84 Billion', '1.2M Arrivals', '$180 Avg Room Rate']);
    setSectorTakeaway('Operational takeaway: Hospitality asset operators should lock in capital upgrade contracts ahead of peak winter booking cycles.');
    setPointFormatToast('✓ Loaded sample story points');
    setTimeout(() => setPointFormatToast(null), 2500);
  };

  // Clear all to write from pure scratch
  const handleClearBlank = () => {
    setHeadline('');
    setCategory('ECONOMY');
    setFreeformText('');
    setParagraphs([]);
    setKeyMetrics([]);
    setSectorTakeaway('');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 bg-[#0B1E36] border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-xs uppercase tracking-wider">
                  Instagram Studio
                </span>
                <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Summary Story Creator</span>
                  <span className="hidden sm:inline text-xs text-amber-400 font-mono font-normal">
                    (1080×1920 HD)
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Write whatever you want, preview the live generated graphic, and download directly to your computer.
              </p>
            </div>
          </div>

          {/* Primary Quick Download & Share Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCaption}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3 py-2 uppercase tracking-wider transition rounded-xs flex items-center gap-1.5 cursor-pointer"
              title="Copy formatted Instagram caption with hashtags"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline">Copy Caption</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadStoryToComputer('png')}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 uppercase tracking-wider transition rounded-xs flex items-center gap-2 cursor-pointer shadow-md border border-emerald-400/80"
              title="Download 1080x1920 PNG to your computer downloads folder"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Download Story (PNG)'}</span>
            </button>

            <a
              href="https://www.instagram.com/lankaecon.lk/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-extrabold text-xs px-3 py-2 uppercase tracking-wider transition rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Open @lankaecon.lk Instagram profile"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">@lankaecon.lk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      {downloadSuccessToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-200 p-3 rounded-xs flex items-center justify-between shadow-lg text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-extrabold">Story graphic successfully downloaded to your computer!</span>
                <span className="block text-[11px] text-emerald-300 font-mono mt-0.5">
                  Saved as: <strong>{downloadSuccessToast}</strong> • Caption with hashtags copied to clipboard.
                </span>
              </div>
            </div>
            <button
              onClick={() => setDownloadSuccessToast(null)}
              className="text-emerald-400 hover:text-white font-mono text-sm px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Left Column Editor | Right Column Live Phone Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: THE WRITER / EDITOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Actions & Templates Bar */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Write Your Story Content</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiAutoSummarize}
                  disabled={isSummarizingWithAi}
                  className="bg-sky-950 hover:bg-sky-900 border border-sky-700 text-sky-300 text-[11px] font-bold px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer transition"
                  title="Format or condense content with AI"
                >
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>{isSummarizingWithAi ? 'Processing...' : 'AI Auto-Format'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToSample}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono px-2 py-1 rounded-xs flex items-center gap-1 cursor-pointer transition border border-slate-700"
                  title="Load example macroeconomic story"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Load Sample</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearBlank}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-mono px-2 py-1 rounded-xs flex items-center gap-1 cursor-pointer transition"
                  title="Wipe fields clean to write from scratch"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* 1. Headline & Category */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                    Story Headline *
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {headline.length} characters (1-3 lines recommended)
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Enter your summary headline..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 p-2.5 text-sm text-white font-serif rounded-xs outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Category Tag:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-amber-300 p-2 rounded-xs outline-none"
                  >
                    <option value="ECONOMY">ECONOMY</option>
                    <option value="MARKETS">MARKETS</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="TRADE">TRADE</option>
                    <option value="POLICY">POLICY</option>
                    <option value="COMMODITIES">COMMODITIES</option>
                    <option value="CENTRAL BANK">CENTRAL BANK</option>
                    <option value="SPECIAL REPORT">SPECIAL REPORT</option>
                    <option value="BREAKING">BREAKING</option>
                  </select>
                </div>

                {/* Byline / Author */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Author / Byline:
                  </label>
                  <input
                    type="text"
                    value={byline}
                    onChange={(e) => setByline(e.target.value)}
                    placeholder="LankaEcon News Desk"
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-2 rounded-xs outline-none"
                  />
                </div>

                {/* Dateline */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Dateline / Date:
                  </label>
                  <input
                    type="text"
                    value={dateline}
                    onChange={(e) => setDateline(e.target.value)}
                    placeholder="AUG 21, 2026"
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-2 rounded-xs outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Main Narrative Editor - "I should be able to write whatever I want" */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Story Narrative & Paragraphs</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Write freely below. Paragraphs automatically typeset and scale to fit the story graphic.
                  </p>
                </div>

                {/* Mode Selector & Quick Font Toggle */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-xs text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setEditorMode('freeform')}
                      className={`px-2 py-1 rounded-xs transition cursor-pointer font-bold ${
                        editorMode === 'freeform'
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Freeform Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('paragraphs')}
                      className={`px-2 py-1 rounded-xs transition cursor-pointer font-bold ${
                        editorMode === 'paragraphs'
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Structured Points ({paragraphs.length})
                    </button>
                  </div>

                  {/* Slide Flow / Auto Pagination Mode Switcher */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded-xs gap-1">
                    <span className="text-[10px] text-sky-400 font-mono font-bold">Flow:</span>
                    <button
                      type="button"
                      onClick={() => setPaginationMode('auto')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        paginationMode === 'auto' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Auto: Fills story fully and automatically splits to next slide if points overflow"
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaginationMode('3')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        paginationMode === '3' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Max 3 points per story"
                    >
                      Max 3
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaginationMode('4')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        paginationMode === '4' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Max 4 points per story"
                    >
                      Max 4
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaginationMode('single')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        paginationMode === 'single' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Fit all points on 1 slide"
                    >
                      1 Slide
                    </button>
                  </div>

                  {/* Quick Font Size Switcher */}
                  <div className="flex items-center bg-slate-950 border border-amber-500/40 px-1.5 py-0.5 rounded-xs gap-1">
                    <span className="text-[10px] text-amber-300 font-mono font-bold">Font:</span>
                    <button
                      type="button"
                      onClick={() => setFontScaling('normal')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        fontScaling === 'normal' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                      title="32px Clear Font"
                    >
                      32px
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScaling('large')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        fontScaling === 'large' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                      title="36px Large & Extra Legible"
                    >
                      36px
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScaling('extra_large')}
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs cursor-pointer ${
                        fontScaling === 'extra_large' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                      title="42px Maximum Impact"
                    >
                      42px
                    </button>
                  </div>
                </div>
              </div>

              {editorMode === 'freeform' ? (
                /* Freeform Textarea with Intelligent Gemini / AI Point Formatting */
                <div className="space-y-2">
                  {/* Quick Format & Paste Controls Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2 border border-slate-800 rounded-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleManualAutoFormat}
                        className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-300 hover:text-white text-[11px] font-bold px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer transition shadow-xs"
                        title="Convert content into clean points (ideal for pasted Gemini text or sentences)"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Format as Points</span>
                      </button>

                      {/* Format Style Selector */}
                      <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xs p-0.5 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => handleChangePointStyle('bullet')}
                          className={`px-2 py-0.5 rounded-xs transition cursor-pointer flex items-center gap-1 font-bold ${
                            pointStyle === 'bullet'
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Format with bullet points (•)"
                        >
                          <List className="w-3 h-3" />
                          <span>Bullets (•)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangePointStyle('numbered')}
                          className={`px-2 py-0.5 rounded-xs transition cursor-pointer flex items-center gap-1 font-bold ${
                            pointStyle === 'numbered'
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Format with numbers (1., 2., 3.)"
                        >
                          <ListOrdered className="w-3 h-3" />
                          <span>Numbered (1, 2)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangePointStyle('paragraphs')}
                          className={`px-2 py-0.5 rounded-xs transition cursor-pointer flex items-center gap-1 font-bold ${
                            pointStyle === 'paragraphs'
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Format as clean paragraph blocks"
                        >
                          <AlignLeft className="w-3 h-3" />
                          <span>Paragraphs</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Auto-format on paste toggle */}
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoFormatOnPaste}
                          onChange={(e) => setAutoFormatOnPaste(e.target.checked)}
                          className="w-3.5 h-3.5 accent-emerald-500 rounded-xs cursor-pointer"
                        />
                        <span className="text-emerald-400 font-mono text-[10px] font-bold">Auto-format Gemini pastes</span>
                      </label>

                      {/* Detected points badge */}
                      <span className="bg-sky-950/80 border border-sky-600/60 text-sky-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <Check className="w-3 h-3 text-sky-400" />
                        <span>{paragraphs.length} Story Points</span>
                      </span>
                    </div>
                  </div>

                  {/* Toast alert banner */}
                  {pointFormatToast && (
                    <div className="bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-mono px-3 py-1.5 rounded-xs flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{pointFormatToast}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPointFormatToast(null)}
                        className="text-emerald-400 hover:text-emerald-200 cursor-pointer p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Multi-Slide Overflow Notification Banner */}
                  {totalSlides > 1 && (
                    <div className="bg-amber-950/60 border border-amber-500/70 text-amber-200 text-xs font-mono px-3 py-2 rounded-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>{rawParagraphsToDraw.length} points detected:</strong> Points overflow single story space and have automatically split into <strong>{totalSlides} sequential story slides</strong>.
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {slideParagraphChunks.map((chunk, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded-xs transition cursor-pointer ${
                              activeSlideIndex === idx
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                            }`}
                          >
                            Slide {idx + 1} ({chunk.length} pts)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      rows={14}
                      value={freeformText}
                      onChange={(e) => handleFreeformChange(e.target.value)}
                      onPaste={handleFreeformPaste}
                      placeholder={`Paste Gemini summary, bullet points, or write freely here...

• Point 1: Monetary Policy Board maintains policy interest rates to sustain stability...

• Point 2: Official headline inflation stays anchored within target band...

• Point 3: Gross official foreign exchange reserves bolstered to USD 5.4 billion...`}
                      className="w-full min-h-[320px] bg-slate-950 border border-slate-700 focus:border-amber-400 p-3.5 text-sm text-slate-100 font-sans leading-relaxed rounded-xs outline-none transition custom-scrollbar resize-y selection:bg-pink-600"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span className="text-slate-400">
                      💡 Pasting from Gemini automatically creates structured story cards. Each point appears as a numbered badge [1], [2]... on your Instagram Story.
                    </span>
                    <span className="text-slate-500">
                      {freeformText.split(/\s+/).filter(Boolean).length} words • {paragraphs.length} points
                    </span>
                  </div>
                </div>
              ) : (
                /* Structured Paragraph by Paragraph */
                <div className="space-y-3">
                  {paragraphs.map((p, idx) => (
                    <div key={idx} className="space-y-1 bg-slate-950 p-2.5 border border-slate-800 rounded-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                          Paragraph {idx + 1}:
                        </span>
                        {paragraphs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteParagraph(idx)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => handleParagraphChange(idx, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-2 text-xs text-white rounded-xs focus:border-sky-400 outline-none"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="w-full py-2 border border-dashed border-slate-700 hover:border-amber-400 text-xs text-amber-300 font-bold rounded-xs cursor-pointer flex items-center justify-center gap-1.5 transition bg-slate-950/50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Another Paragraph</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Key Figures & Metrics Tags */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                    Key Metrics & Data Badges ({keyMetrics.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Highlighted pill chips rendered directly on the story header.
                  </p>
                </div>
              </div>

              {keyMetrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keyMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/60 text-amber-300 px-2.5 py-1 text-xs font-mono font-bold rounded-xs"
                    >
                      <span>{metric}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="text-rose-400 hover:text-white font-bold cursor-pointer"
                        title="Remove metric"
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
                  placeholder="e.g. +14.2% YoY, Rs. 1,480/kg, USD 68.4M..."
                  value={newMetricInput}
                  onChange={(e) => setNewMetricInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMetric();
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white rounded-xs focus:border-amber-400 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>
            </div>

            {/* 4. Sector Takeaway Callout Box */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-2">
              <label className="text-xs font-extrabold text-amber-300 uppercase tracking-wider block">
                Strategic Takeaway Callout Box:
              </label>
              <textarea
                rows={2}
                value={sectorTakeaway}
                onChange={(e) => setSectorTakeaway(e.target.value)}
                placeholder="Operational or market takeaway for Sri Lanka businesses..."
                className="w-full bg-slate-950 border border-slate-700 p-2.5 text-xs text-amber-200 rounded-xs focus:border-amber-400 outline-none leading-relaxed"
              />
            </div>

            {/* 5. Theme Palette & Font Controls */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-3">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-pink-400" />
                <span>Visual Theme & Typography Controls</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(Object.keys(palettes) as (keyof typeof palettes)[]).map((key) => {
                  const pal = palettes[key];
                  const isSelected = storyStyle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStoryStyle(key)}
                      className={`p-2.5 border text-left rounded-xs transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-slate-950 ring-1 ring-amber-400 text-white shadow-md'
                          : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-[11px] font-black block leading-tight">{pal.name}</span>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: pal.bgTop }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: pal.headerBg }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: pal.chipBorder }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Text Scaling Selector */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs gap-2">
                <div>
                  <span className="text-slate-300 font-bold text-xs block">Story Font Size & Legibility:</span>
                  <span className="text-slate-400 font-mono text-[10px]">Configured for high mobile readability</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {([
                    { id: 'normal', label: '28px (Clear)' },
                    { id: 'large', label: '32px (Extra Legible)' },
                    { id: 'extra_large', label: '37px (Max Impact)' },
                    { id: 'compact', label: '24px (Compact)' },
                    { id: 'auto', label: 'Auto-Fit' },
                  ] as const).map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFontScaling(id)}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-xs transition cursor-pointer ${
                        fontScaling === id
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE PHONE PREVIEW & DIRECT COMPUTER DOWNLOAD (5 COLS) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xs space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Live Story Preview
                  </span>
                </div>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono px-2 py-0.5 font-black uppercase rounded-xs">
                  1080×1920 HD Ready
                </span>
              </div>

              {/* Phone Mockup Canvas Frame */}
              <div className="relative mx-auto max-w-[320px] aspect-[9/16] bg-black rounded-2xl p-2.5 shadow-2xl border-4 border-slate-700 overflow-hidden ring-1 ring-white/10">
                {/* Top Phone Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-slate-800 rounded-full z-10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-black rounded-full mr-2" />
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Live Story Graphic Canvas (Direct rendering, no state loops) */}
                <canvas
                  ref={canvasRef}
                  width={1080}
                  height={1920}
                  className="w-full h-full object-contain rounded-xl select-none"
                />
              </div>

              {/* Multi-Slide Navigation Controls */}
              {totalSlides > 1 && (
                <div className="bg-slate-950 border border-amber-500/40 p-2.5 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Continuation Slide {activeSlideIndex + 1} of {totalSlides}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({rawParagraphsToDraw.length} key points total)
                    </span>
                  </div>

                  {/* Slide Carousel Tabs */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activeSlideIndex === 0}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xs transition cursor-pointer"
                      title="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex-1 flex flex-wrap gap-1">
                      {slideParagraphChunks.map((chunk, i) => {
                        const startPt = slideParagraphChunks.slice(0, i).reduce((a, c) => a + c.length, 0) + 1;
                        const endPt = startPt + chunk.length - 1;
                        const ptsLabel = startPt === endPt ? `Pt ${startPt}` : `Pts ${startPt}-${endPt}`;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveSlideIndex(i)}
                            className={`flex-1 min-w-[72px] py-1.5 px-2 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xs transition cursor-pointer text-center ${
                              activeSlideIndex === i
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            Part {i + 1} <span className="opacity-75 text-[9px]">({ptsLabel})</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
                      disabled={activeSlideIndex === totalSlides - 1}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xs transition cursor-pointer"
                      title="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Computer Download Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadStoryToComputer('png')}
                  disabled={isDownloading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 rounded-xs border border-emerald-400"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? 'Rendering & Saving...'
                      : totalSlides > 1
                      ? `Download Current Slide (${activeSlideIndex + 1}/${totalSlides})`
                      : 'Download Story to Computer (PNG)'}
                  </span>
                </button>

                {totalSlides > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAllSlides}
                    disabled={isDownloadingAll}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black text-xs py-3 uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2 rounded-xs border border-amber-400"
                    title="Download all continuation slides in sequence"
                  >
                    <Layers className="w-4 h-4" />
                    <span>
                      {isDownloadingAll
                        ? 'Exporting All Slides...'
                        : `Download All ${totalSlides} Slides in Sequence`}
                    </span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadStoryToComputer('jpeg')}
                    disabled={isDownloading}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs py-2.5 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 rounded-xs"
                    title="Download lightweight JPG"
                  >
                    <span>Download JPG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="bg-[#0284C7] hover:bg-sky-600 text-white font-bold text-xs py-2.5 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 rounded-xs"
                    title="Copy formatted Instagram caption"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>

                <a
                  href="https://www.instagram.com/lankaecon.lk/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs py-2.5 uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2 rounded-xs block text-center"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Open Instagram (@lankaecon.lk)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Instructions Box */}
              <div className="bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1 rounded-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider block text-[10px]">
                  How to publish to Instagram:
                </span>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-300">
                  <li>Click <strong>"Download Story to Computer"</strong> above.</li>
                  <li>Open <strong>@lankaecon.lk</strong> on Instagram or Meta Business Suite.</li>
                  <li>Upload the downloaded 1080×1920 graphic and paste the copied caption!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
