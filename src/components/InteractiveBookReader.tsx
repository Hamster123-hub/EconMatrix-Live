import React, { useState, useEffect, useMemo } from 'react';
import { EconBook, BookPage } from '../types';
import { FormattedText } from './FormattedText';
import { getBookPage, autoSplitTextIntoBookPages } from '../data/book191Pages';
import { CLASSICAL_BOOKS_DATA } from '../data/classicalBooksLibrary';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen, FileText, 
  Sparkles, Printer, Search, List, Bookmark, X, Send, Bot, Check, Sliders, Download, AlertTriangle, ExternalLink,
  Lock, ShieldCheck, KeyRound, Monitor, Eye, ShoppingBag
} from 'lucide-react';
import { isBookPurchased, getBookPurchase } from '../utils/bookAccess';
import { BookCheckoutModal } from './BookCheckoutModal';

interface InteractiveBookReaderProps {
  book: EconBook;
  onClose: () => void;
  language?: 'en' | 'si' | 'ta';
}

interface Chapter {
  id: string;
  chapterNumber: number | string;
  part: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  summary: string;
}

export const InteractiveBookReader: React.FC<InteractiveBookReaderProps> = ({ book, onClose, language = 'en' }) => {
  const isTragicBook = book.id === 'book-ranul-001' || book.title.toLowerCase().includes('tragic mis-fortune') || book.title.toLowerCase().includes('story behind');
  const displayAuthor = isTragicBook ? (book.author || 'Disnaka') : (book.author || '');

  const libraryData = CLASSICAL_BOOKS_DATA[book.id] || null;

  // Dynamically retrieve book pages
  const bookPages: BookPage[] = useMemo(() => {
    if (isTragicBook) return [];
    if (book.pages && book.pages.length > 0) {
      return book.pages;
    }
    if (libraryData?.samplePages && libraryData.samplePages.length > 0) {
      return libraryData.samplePages;
    }
    const autoPages = autoSplitTextIntoBookPages(book.fullRawText || book.description || '');
    if (autoPages.length > 0) return autoPages;
    return [
      {
        pageNumber: 1,
        chapterTitle: 'Overview',
        partTitle: book.category || 'Economics Library',
        content: `### ${book.title}\n**${displayAuthor ? `By ${displayAuthor} (${book.publishedYear})` : `Academic Edition (${book.publishedYear})`}**\n\n${book.description || ''}`,
      }
    ];
  }, [book, isTragicBook, libraryData, displayAuthor]);

  // FlipHTML5 source URL for 3D reader
  const flipUrl = book.flipHtml5Url || (book.readOnlineUrl?.includes('fliphtml5.com') ? book.readOnlineUrl : (isTragicBook ? 'https://online.fliphtml5.com/EconMatrix/asck/' : null));

  // Reader state
  const [readerMode, setReaderMode] = useState<'flipbook' | 'text-reader' | 'pdf'>(flipUrl ? 'flipbook' : 'text-reader');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.max(1, bookPages.length);
  const [viewLayout, setViewLayout] = useState<'two-page' | 'single-page'>('two-page');

  // Purchase & DRM state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => !isTragicBook || isBookPurchased(book.id));
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [previewTocExpanded, setPreviewTocExpanded] = useState<boolean>(false);
  const purchaseRecord = getBookPurchase(book.id);

  useEffect(() => {
    setIsUnlocked(!isTragicBook || isBookPurchased(book.id));
  }, [book.id, isTragicBook]);

  useEffect(() => {
    setReaderMode(flipUrl ? 'flipbook' : 'text-reader');
    setCurrentPage(1);
  }, [book.id, flipUrl]);

  // PAYWALL LOCK SCREEN FOR PAID BOOK IF NOT PURCHASED
  if (isTragicBook && !isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B1320] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-2xl w-full bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl my-auto">
          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase">
              <span>Paid Research Monograph</span>
              <span>•</span>
              <span>Rs. 3,500 LKR</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white leading-tight">
              {book.title}
            </h2>
            <p className="font-serif text-sm text-amber-200/90 italic font-medium">
              "A Nation Held at Ransom by Its Own Central Bank"
            </p>
            <p className="text-xs font-mono text-slate-400">
              By <strong className="text-white">{displayAuthor}</strong> • 191 Pages • 18 Chapters • 3D FlipHTML5
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            Full digital reading access to this 191-page treatise is available for a one-time license fee of <strong className="text-amber-400 font-mono">Rs. 3,500</strong>. You will receive lifetime online access within our web platform.
          </p>

          {/* Table of Contents Free Preview Accordion */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                  Table of Contents & Structure (Free Preview)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTocExpanded(!previewTocExpanded)}
                className="text-amber-400 hover:text-amber-300 text-xs font-mono underline cursor-pointer"
              >
                {previewTocExpanded ? 'Collapse ▲' : 'View All 18 Chapters ▼'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Anyone can explore the table of contents and research scope below prior to purchasing.
            </p>

            {previewTocExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">Ch. 1–2: Surface of Circulation</span>
                  <span className="text-slate-300">Marx vs Classical Predecessors & Money as Social Movement</span>
                </div>
                <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">Ch. 3–4: Quantity & Price Specie-Flow</span>
                  <span className="text-slate-300">Fisherian Velocity & David Hume's Automatic Adjustment</span>
                </div>
                <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">Ch. 5–6: Ricardo, Say's Law & Crisis</span>
                  <span className="text-slate-300">Classical Neutrality vs Separation of Sale & Purchase</span>
                </div>
                <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">Ch. 7–9: Three Master Visions of Money</span>
                  <span className="text-slate-300">Loanable Funds, Keynesian Radical Uncertainty & Synthesis</span>
                </div>
                <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">Ch. 10–12: Monetary vs Fiscal & Impossible Trinity</span>
                  <span className="text-slate-300">Balance of Payments, Twin Deficits & Soft Peg Failures</span>
                </div>
                <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold block">Ch. 13–18: Sri Lanka 2023 Central Bank Act</span>
                  <span className="text-slate-300">Overnight Policy Rate (OPR), Debt Restructuring & Reform</span>
                </div>
              </div>
            )}
          </div>

          {/* Strict Anti-Download & DRM Notice */}
          <div className="bg-slate-950/90 border border-amber-500/30 p-3.5 rounded-xl flex items-start gap-2.5 text-left text-xs font-mono text-amber-200/90">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-white block">Protected Single-User Online Streaming License:</strong>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                To safeguard the author's copyright, local file downloading to laptops or mobile phones is strictly disabled. Full access is granted exclusively within the in-app 3D flipbook reader.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Full Book (Rs. 3,500 LKR)</span>
            </button>

            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs px-5 py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-sky-400" />
              <span>Restore Access</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-transparent hover:bg-slate-800 text-slate-400 font-bold text-xs px-5 py-3.5 rounded-xl transition cursor-pointer"
            >
              Back to Library
            </button>
          </div>
        </div>

        {/* Checkout Modal */}
        <BookCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          book={book}
          onSuccess={() => {
            setIsUnlocked(true);
            setShowCheckoutModal(false);
          }}
          onViewTableOfContents={() => {
            setShowCheckoutModal(false);
            setPreviewTocExpanded(true);
          }}
        />
      </div>
    );
  }

  // Reader customization
  const [paperTheme, setPaperTheme] = useState<'cream' | 'white' | 'sepia' | 'dark'>('cream');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);

  // PDF Page Range Filter for Continuous View
  const [pdfPageRange, setPdfPageRange] = useState<'all' | '1-50' | '51-100' | '101-150' | '151-191'>('all');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Welcome! I am your AI Reading Companion for **${book.title}**${displayAuthor ? ` by **${displayAuthor}**` : ''}.\n\nAsk me anything about any chapter, theoretical proposition, historical context, or argument in this masterwork!`,
    }
  ]);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // DYNAMIC TABLE OF CONTENTS DATA
  const chapters: Chapter[] = useMemo(() => {
    if (libraryData?.tableOfContents && libraryData.tableOfContents.length > 0) {
      return libraryData.tableOfContents.map((tc, idx) => ({
        id: `ch-${idx}`,
        chapterNumber: tc.chapterNumber,
        part: book.category || 'Monetary & Economic Literature',
        title: tc.title,
        pageStart: tc.pageStart || (idx + 1),
        pageEnd: tc.pageEnd || (idx + 1),
        summary: tc.summary,
      }));
    }
    return bookPages.map((bp) => ({
      id: `page-${bp.pageNumber}`,
      chapterNumber: bp.pageNumber,
      part: bp.partTitle || book.category || 'Monetary & Economic Literature',
      title: bp.chapterTitle || `Page ${bp.pageNumber}`,
      pageStart: bp.pageNumber,
      pageEnd: bp.pageNumber,
      summary: bp.content.slice(0, 100),
    }));
  }, [libraryData, bookPages, book]);

  // Page navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  const nextPage = () => {
    const step = viewLayout === 'two-page' ? 2 : 1;
    if (currentPage + step <= totalPages) {
      setCurrentPage((prev) => prev + step);
    } else {
      setCurrentPage(totalPages);
    }
  };

  const prevPage = () => {
    const step = viewLayout === 'two-page' ? 2 : 1;
    if (currentPage - step >= 1) {
      setCurrentPage((prev) => prev - step);
    } else {
      setCurrentPage(1);
    }
  };

  const jumpToChapter = (ch: Chapter) => {
    setCurrentPage(ch.pageStart);
    setShowToc(false);
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter((p) => p !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  // Get current pages
  const leftPageData: BookPage = getBookPage(currentPage, bookPages);
  const rightPageData: BookPage | null = viewLayout === 'two-page' && currentPage + 1 <= totalPages ? getBookPage(currentPage + 1, bookPages) : null;

  // Search across all pages of the book
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { pageNumber: number; matchSnippet: string; chapterTitle: string }[] = [];

    for (let p = 1; p <= totalPages; p++) {
      const pageData = getBookPage(p, bookPages);
      if (
        pageData.content.toLowerCase().includes(q) ||
        pageData.chapterTitle.toLowerCase().includes(q) ||
        (pageData.partTitle && pageData.partTitle.toLowerCase().includes(q))
      ) {
        const idx = pageData.content.toLowerCase().indexOf(q);
        const snippet = idx >= 0 
          ? '...' + pageData.content.substring(Math.max(0, idx - 40), Math.min(pageData.content.length, idx + 80)) + '...'
          : pageData.content.substring(0, 100) + '...';
        results.push({
          pageNumber: p,
          chapterTitle: pageData.chapterTitle,
          matchSnippet: snippet,
        });
      }
    }
    return results;
  }, [searchQuery, totalPages, bookPages]);

  // AI Assistant ask handler
  const handleAskAi = async () => {
    if (!aiPrompt.trim() || aiLoading) return;

    const userText = aiPrompt.trim();
    setAiChat((prev) => [...prev, { role: 'user', text: userText }]);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/econ-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `In the context of Page ${currentPage} (${leftPageData.chapterTitle}) of "${book.title}"${displayAuthor ? ` by ${displayAuthor}` : ''}: ${userText}`,
          chapterTitle: leftPageData.chapterTitle,
          chapterSubtitle: `Page ${currentPage} of ${totalPages}`,
          keyConcepts: book.category,
          chapterContext: leftPageData.content,
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setAiChat((prev) => [...prev, { role: 'assistant', text: data.explanation }]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      setAiChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Analysis for Page ${currentPage} (${leftPageData.chapterTitle}) in "${book.title}":\n\n"${userText}"\n\n${leftPageData.content ? leftPageData.content.slice(0, 200) + '...' : 'This chapter examines the core analytical framework of the publication.'}`,
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Paper theme CSS classes
  const getPaperBg = () => {
    switch (paperTheme) {
      case 'white':
        return 'bg-white text-slate-900 border-slate-300';
      case 'sepia':
        return 'bg-[#F4ECD8] text-[#433422] border-[#E2D2B2]';
      case 'dark':
        return 'bg-[#121B2A] text-slate-200 border-slate-800';
      case 'cream':
      default:
        return 'bg-[#FAF8F3] text-slate-900 border-[#E8E2D5]';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs leading-relaxed';
      case 'lg':
        return 'text-base leading-loose';
      case 'xl':
        return 'text-lg leading-loose';
      case 'md':
      default:
        return 'text-sm leading-relaxed';
    }
  };

  // Filtered pages for PDF view mode
  const pdfPagesList = useMemo(() => {
    let start = 1;
    let end = totalPages;
    if (pdfPageRange === '1-50') { start = 1; end = Math.min(50, totalPages); }
    else if (pdfPageRange === '51-100') { start = Math.min(51, totalPages); end = Math.min(100, totalPages); }
    else if (pdfPageRange === '101-150') { start = Math.min(101, totalPages); end = Math.min(150, totalPages); }
    else if (pdfPageRange === '151-191') { start = Math.min(151, totalPages); end = Math.min(191, totalPages); }

    const list: BookPage[] = [];
    for (let p = start; p <= end; p++) {
      list.push(getBookPage(p, bookPages));
    }
    return list;
  }, [pdfPageRange, totalPages, bookPages]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col min-h-screen overflow-hidden font-sans">
      {/* TOP BAR */}
      <div className="bg-[#0F172A] border-b-2 border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-lg select-none">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-extrabold text-xs px-3.5 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Library</span>
          </button>

          <div className="border-l border-slate-800 pl-3 min-w-0">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block truncate">
              FULL {totalPages}-PAGE COMPLETE BOOK{displayAuthor ? ` • ${displayAuthor}` : ''} ({book.publishedYear})
            </span>
            <h2 className="font-serif font-bold text-xs sm:text-sm text-slate-100 truncate">
              {book.title}
            </h2>
          </div>
        </div>

        {/* Center: Reader Mode */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 p-1">
          {isTragicBook ? (
            <div className="flex items-center gap-2 px-3 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                3D FlipHTML5 Reader (Protected In-Browser)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                DRM Active
              </span>
            </div>
          ) : (
            <>
              {flipUrl && (
                <button
                  onClick={() => setReaderMode('flipbook')}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                    readerMode === 'flipbook'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>3D Flipbook</span>
                </button>
              )}

              <button
                onClick={() => setReaderMode('text-reader')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  readerMode === 'text-reader'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>{totalPages}-Page Text Reader</span>
              </button>

              <button
                onClick={() => setReaderMode('pdf')}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  readerMode === 'pdf'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Document View</span>
              </button>

              {book.readOnlineUrl && (
                <a
                  href={book.readOnlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-mono font-bold uppercase text-sky-400 hover:text-sky-300 transition flex items-center gap-1 border-l border-slate-800 ml-1"
                  title="Open Official Web Document"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Web Document</span>
                </a>
              )}
            </>
          )}
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 border transition cursor-pointer font-mono text-xs flex items-center gap-1 ${
              showSearch
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Search Book"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-[11px]">Search</span>
          </button>

          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 border transition cursor-pointer font-mono text-xs flex items-center gap-1 ${
              showToc
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Contents</span>
          </button>

          <button
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className={`p-2 border transition cursor-pointer font-mono text-xs flex items-center gap-1 ${
              showAiAssistant
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-800'
            }`}
            title="AI Reading Assistant"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">AI Tutor</span>
          </button>

          {(!isTragicBook && book.allowDownload !== false) && (
            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 p-2 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
              title="Print / Export Document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Print / Export</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-2 border border-slate-800 transition cursor-pointer ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SECONDARY TOOLBAR */}
      {readerMode === 'flipbook' && (
        <div className="bg-[#1E293B] border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
          {/* Layout controls */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Layout:</span>
            <button
              onClick={() => setViewLayout('two-page')}
              className={`px-2.5 py-1 text-[11px] border cursor-pointer ${
                viewLayout === 'two-page'
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              📖 Two-Page Spread
            </button>
            <button
              onClick={() => setViewLayout('single-page')}
              className={`px-2.5 py-1 text-[11px] border cursor-pointer ${
                viewLayout === 'single-page'
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              📄 Single Page
            </button>
          </div>

          {/* Theme controls */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold hidden sm:inline">Theme:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPaperTheme('cream')}
                className={`px-2 py-0.5 text-[10px] font-bold border ${
                  paperTheme === 'cream' ? 'ring-2 ring-amber-400 border-amber-600' : ''
                } bg-[#FAF8F3] text-slate-900`}
              >
                Cream
              </button>
              <button
                onClick={() => setPaperTheme('white')}
                className={`px-2 py-0.5 text-[10px] font-bold border ${
                  paperTheme === 'white' ? 'ring-2 ring-sky-400 border-sky-600' : ''
                } bg-white text-slate-900`}
              >
                White
              </button>
              <button
                onClick={() => setPaperTheme('sepia')}
                className={`px-2 py-0.5 text-[10px] font-bold border ${
                  paperTheme === 'sepia' ? 'ring-2 ring-amber-500 border-amber-700' : ''
                } bg-[#F4ECD8] text-[#433422]`}
              >
                Sepia
              </button>
              <button
                onClick={() => setPaperTheme('dark')}
                className={`px-2 py-0.5 text-[10px] font-bold border ${
                  paperTheme === 'dark' ? 'ring-2 ring-amber-400 border-amber-400' : ''
                } bg-[#121B2A] text-slate-200`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Font & Bookmark */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold">Font:</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 text-[10px] border ${fontSize === 'sm' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-1.5 py-0.5 text-[10px] border ${fontSize === 'md' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 text-[10px] border ${fontSize === 'lg' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                A+
              </button>
            </div>

            <button
              onClick={toggleBookmark}
              className={`p-1.5 border transition cursor-pointer flex items-center gap-1 text-[10px] ${
                bookmarks.includes(currentPage)
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookmarks.includes(currentPage) ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 relative flex overflow-hidden bg-slate-950">
        {/* SEARCH DRAWER */}
        {showSearch && (
          <div className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 p-5 overflow-y-auto space-y-4 shrink-0 z-30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-amber-400 text-sm uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search {totalPages}-Page Book</span>
              </h3>
              <button onClick={() => setShowSearch(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search term (e.g. OPR, Reverse Repo, Sterilization, Exter)..."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <p className="text-[10px] text-slate-400 font-mono">
                Found {searchResults.length} page matches across all 191 pages
              </p>
            </div>

            <div className="space-y-2 font-sans text-xs">
              {searchResults.map((res) => (
                <button
                  key={res.pageNumber}
                  onClick={() => {
                    setCurrentPage(res.pageNumber);
                    setShowSearch(false);
                  }}
                  className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer"
                >
                  <div className="flex justify-between items-center font-mono text-[10px] text-amber-400 font-bold mb-1">
                    <span>PAGE {res.pageNumber} OF {totalPages}</span>
                    <span>{res.chapterTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-3 italic">
                    "{res.matchSnippet}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TOC DRAWER */}
        {showToc && (
          <div className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 p-5 overflow-y-auto space-y-4 shrink-0 z-30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-amber-400 text-sm uppercase flex items-center gap-2">
                <List className="w-4 h-4 text-sky-400" />
                <span>Table of Contents ({totalPages} Pages)</span>
              </h3>
              <button onClick={() => setShowToc(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 font-sans text-xs">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => jumpToChapter(ch)}
                  className={`w-full text-left p-3 border transition cursor-pointer ${
                    currentPage >= ch.pageStart && currentPage <= ch.pageEnd
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center font-mono text-[10px] text-sky-400 font-bold mb-1">
                    <span>{typeof ch.chapterNumber === 'number' ? `CHAPTER ${ch.chapterNumber}` : ch.chapterNumber}</span>
                    <span>Pages {ch.pageStart}-{ch.pageEnd}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs leading-snug">{ch.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{ch.summary}</p>
                </button>
              ))}
            </div>

            {bookmarks.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                  Saved Bookmarks ({bookmarks.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {bookmarks.sort((a, b) => a - b).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-1 font-mono text-[10px] font-bold"
                    >
                      Page {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEWPORT AREA */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-8 items-center relative">
          {readerMode === 'flipbook' && flipUrl ? (
            /* 3D INTERACTIVE FLIPBOOK MODE (FLIPHTML5) */
            <div className="w-full max-w-6xl mx-auto my-auto space-y-6 flex flex-col items-center">
              {/* Title Section */}
              <div className="text-center max-w-4xl mx-auto space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-extrabold uppercase px-3.5 py-1 rounded-full shadow-xs">
                  <span>📖 3D DIGITAL FLIPBOOK</span>
                  <span>•</span>
                  <span>{book.category || 'CENTRAL BANK MONETARY POLICY'}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {book.title}
                </h1>
                {book.description && (
                  <p className="font-serif text-base sm:text-lg text-amber-200/90 font-bold italic line-clamp-2 max-w-2xl mx-auto">
                    "{book.description.slice(0, 140)}"
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/60 max-w-lg mx-auto mt-2">
                  {displayAuthor ? (
                    <>
                      <span>Author: <strong className="text-white">{displayAuthor}</strong></span>
                      <span>•</span>
                    </>
                  ) : null}
                  <span>Volume: <strong className="text-white">{book.pagesCount || totalPages} Pages</strong></span>
                  <span>•</span>
                  <span>Format: <strong className="text-amber-400">3D FlipHTML5</strong></span>
                </div>
              </div>

              {/* Centered Flipbook Frame Box */}
              <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-5 shadow-2xl space-y-3">
                {/* Top Controls Toolbar */}
                <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-amber-400">Interactive 3D FlipHTML5 Reader</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('flipbook-iframe-wrapper');
                        if (el && el.requestFullscreen) {
                          el.requestFullscreen();
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                      title="Expand Flipbook Fullscreen In-Browser"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Fullscreen Mode</span>
                    </button>
                  </div>
                </div>

                {/* DRM Protected Notice for Paid Book */}
                {isTragicBook && (
                  <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 select-none">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Protected Online Streaming Edition • Local File Download Disabled</span>
                    </div>
                    {purchaseRecord?.customerName && (
                      <span className="text-slate-400">
                        Licensed Licensee: <strong className="text-white">{purchaseRecord.customerName}</strong> ({purchaseRecord.accessCode})
                      </span>
                    )}
                  </div>
                )}

                {/* Embedded Flipbook iframe provided by user */}
                <div 
                  id="flipbook-iframe-wrapper" 
                  onContextMenu={(e) => e.preventDefault()} 
                  className="w-full bg-black rounded-lg overflow-hidden border border-slate-800 shadow-inner select-none"
                >
                  <div style={{ position: 'relative', paddingTop: 'max(60%, 324px)', width: '100%', height: 0 }}>
                    <iframe
                      style={{ position: 'absolute', border: 'none', width: '100%', height: '100%', left: 0, top: 0 }}
                      src={flipUrl}
                      title={book.title}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : readerMode === 'text-reader' ? (
            /* TEXT READER MODE */
            <div className="w-full max-w-5xl my-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 shadow-2xl relative">
                {/* LEFT PAGE */}
                <div
                  className={`p-6 sm:p-10 border-2 min-h-[620px] flex flex-col justify-between relative shadow-md transition-all duration-300 ${getPaperBg()}`}
                >
                  {/* Top Header */}
                  <div className="border-b border-slate-400/30 pb-2 mb-4 flex items-center justify-between font-mono text-[10px] opacity-70">
                    <span className="font-bold uppercase tracking-wider">{leftPageData.partTitle || book.title}</span>
                    <span>PAGE {leftPageData.pageNumber} OF {totalPages}</span>
                  </div>

                  {/* Body Content */}
                  <div className={`space-y-4 flex-1 ${getFontSizeClass()} font-serif leading-relaxed`}>
                    {leftPageData.pageNumber === 1 ? (
                      /* COVER PAGE */
                      <div className="text-center my-auto space-y-6 py-8">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-800 text-amber-100 px-3 py-1 inline-block">
                          {book.category}
                        </span>
                        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
                          {book.title}
                        </h1>
                        <p className="text-sm font-sans font-bold text-amber-900 uppercase tracking-wider">
                          {displayAuthor ? `By ${displayAuthor} (${book.publishedYear})` : `Academic Edition (${book.publishedYear})`}
                        </p>
                        <div className="w-24 h-0.5 bg-amber-600 mx-auto my-4" />
                        <p className="text-xs font-sans text-slate-600 italic max-w-md mx-auto">
                          "{book.description}"
                        </p>
                        <div className="pt-8">
                          <button
                            onClick={nextPage}
                            className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-mono text-xs font-bold px-6 py-2.5 uppercase tracking-wider transition cursor-pointer"
                          >
                            Start Reading Page 2 →
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* REGULAR PAGE */
                      <div className="space-y-4">
                        {leftPageData.chapterTitle && 
                         !/^Page\s*\d+$/i.test(leftPageData.chapterTitle) && 
                         !leftPageData.content.trim().startsWith('#') && (
                          <div className="border-b-2 border-amber-800/40 pb-2">
                            {leftPageData.partTitle && (
                              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest block">
                                {leftPageData.partTitle}
                              </span>
                            )}
                            <h3 className="font-serif text-lg font-extrabold leading-snug">
                              {leftPageData.chapterTitle}
                            </h3>
                          </div>
                        )}

                        <div className="space-y-3">
                          <FormattedText content={leftPageData.content} isDarkBg={paperTheme === 'dark'} />
                        </div>

                        {leftPageData.keyFormula && (
                          <div className="bg-amber-500/10 border-l-4 border-amber-600 p-3 text-xs font-sans space-y-1 my-4">
                            <span className="font-mono font-bold text-amber-900 uppercase text-[10px] block">
                              💡 KEY OPERATIONAL / MATHEMATICAL IDENTITY:
                            </span>
                            <p className="font-mono font-bold text-slate-900 text-xs">
                              {leftPageData.keyFormula}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer */}
                  <div className="border-t border-slate-400/30 pt-2 mt-4 flex items-center justify-between font-mono text-[10px] opacity-70">
                    <span>{leftPageData.chapterTitle}</span>
                    <span>Page {leftPageData.pageNumber} of {totalPages}</span>
                  </div>
                </div>

                {/* RIGHT PAGE (Two-Page view) */}
                {viewLayout === 'two-page' && rightPageData && (
                  <div
                    className={`hidden md:flex p-6 sm:p-10 border-2 min-h-[620px] flex-col justify-between relative shadow-md transition-all duration-300 ${getPaperBg()}`}
                  >
                    {/* Top Header */}
                    <div className="border-b border-slate-400/30 pb-2 mb-4 flex items-center justify-between font-mono text-[10px] opacity-70">
                      <span>PAGE {rightPageData.pageNumber} OF {totalPages}</span>
                      <span className="font-bold uppercase tracking-wider">{rightPageData.partTitle || displayAuthor || 'LankaEcon Research Desk'}</span>
                    </div>

                    {/* Body Content */}
                    <div className={`space-y-4 flex-1 ${getFontSizeClass()} font-serif leading-relaxed`}>
                      <div className="space-y-4">
                        {rightPageData.chapterTitle && 
                         !/^Page\s*\d+$/i.test(rightPageData.chapterTitle) && 
                         !rightPageData.content.trim().startsWith('#') && (
                          <div className="border-b-2 border-amber-800/40 pb-2">
                            {rightPageData.partTitle && (
                              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest block">
                                {rightPageData.partTitle}
                              </span>
                            )}
                            <h3 className="font-serif text-lg font-extrabold leading-snug">
                              {rightPageData.chapterTitle}
                            </h3>
                          </div>
                        )}

                        <div className="space-y-3">
                          <FormattedText content={rightPageData.content} isDarkBg={paperTheme === 'dark'} />
                        </div>

                        {rightPageData.keyFormula && (
                          <div className="bg-amber-500/10 border-l-4 border-amber-600 p-3 text-xs font-sans space-y-1 my-4">
                            <span className="font-mono font-bold text-amber-900 uppercase text-[10px] block">
                              💡 KEY OPERATIONAL / MATHEMATICAL IDENTITY:
                            </span>
                            <p className="font-mono font-bold text-slate-900 text-xs">
                              {rightPageData.keyFormula}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-slate-400/30 pt-2 mt-4 flex items-center justify-between font-mono text-[10px] opacity-70">
                      <span>{rightPageData.chapterTitle}</span>
                      <span>Page {rightPageData.pageNumber} of {totalPages}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CONTINUOUS FULL PDF DOCUMENT VIEW MODE */
            <div className="w-full max-w-5xl bg-white text-slate-900 p-8 sm:p-12 shadow-2xl border-2 border-slate-800 my-auto font-serif space-y-8">
              {/* PDF Document Header */}
              <div className="border-b-4 border-amber-600 pb-4 flex flex-wrap justify-between items-end gap-4 font-sans">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest block">
                    FULL READABLE BOOK VIEW • {totalPages} PAGES TOTAL
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 mt-1">
                    {book.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                    {displayAuthor ? `By ${displayAuthor} (${book.publishedYear})` : `Academic Edition (${book.publishedYear})`}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-600 font-bold">Range:</span>
                  <select
                    value={pdfPageRange}
                    onChange={(e) => setPdfPageRange(e.target.value as any)}
                    className="bg-slate-100 border border-slate-300 p-2 text-slate-900 font-bold focus:outline-none"
                  >
                    <option value="all">All {totalPages} Pages</option>
                    <option value="1-50">Pages 1 – 50</option>
                    <option value="51-100">Pages 51 – 100</option>
                    <option value="101-150">Pages 101 – 150</option>
                    <option value="151-191">Pages 151 – 191</option>
                  </select>

                  <button
                    onClick={() => window.print()}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold px-4 py-2 uppercase transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Export PDF</span>
                  </button>
                </div>
              </div>

              {/* PDF PAGES FLOW */}
              <div className="space-y-8 divide-y divide-slate-200">
                {pdfPagesList.map((pg) => (
                  <div key={pg.pageNumber} className="pt-6 space-y-3 bg-[#FAF8F3] p-6 border border-slate-200 shadow-xs">
                    <div className="flex justify-between items-center font-mono text-[11px] text-amber-900 font-bold uppercase border-b border-amber-200 pb-1">
                      <span>PAGE {pg.pageNumber} OF {totalPages} • {pg.partTitle || book.title}</span>
                      <button
                        onClick={() => {
                          setCurrentPage(pg.pageNumber);
                          setReaderMode('flipbook');
                        }}
                        className="text-sky-700 hover:underline cursor-pointer"
                      >
                        Open in Flipbook →
                      </button>
                    </div>

                    <h2 className="font-serif font-extrabold text-base sm:text-lg text-slate-950">
                      {pg.chapterTitle}
                    </h2>

                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <FormattedText content={pg.content} />
                    </div>

                    {pg.keyFormula && (
                      <div className="bg-amber-50 border-l-4 border-amber-600 p-3 text-xs font-sans text-slate-900">
                        <span className="font-bold text-amber-900 uppercase font-mono text-[10px] block">Key Operational Formula:</span>
                        <p className="font-mono font-bold text-xs">{pg.keyFormula}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTTOM CONTROLS FOR FLIPBOOK */}
          {readerMode === 'flipbook' && (
            <div className="w-full max-w-3xl bg-[#0F172A] border-2 border-slate-800 p-3 sm:p-4 mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-xl select-none shrink-0">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-extrabold px-4 py-2 uppercase transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>

              <div className="flex-1 flex items-center gap-3 min-w-[200px]">
                <input
                  type="range"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0 bg-slate-900 border border-slate-800 px-2 py-1">
                  <span className="text-amber-400 font-bold">Pg</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= totalPages) setCurrentPage(val);
                    }}
                    className="w-12 bg-transparent text-center font-bold text-white focus:outline-none"
                  />
                  <span className="text-slate-400">/ {totalPages}</span>
                </div>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-extrabold px-4 py-2 uppercase transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* AI TUTOR DRAWER */}
        {showAiAssistant && (
          <div className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 p-5 flex flex-col h-full shrink-0 z-30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-serif font-bold text-amber-400 text-sm uppercase flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>AI Book Tutor & Analyst</span>
              </h3>
              <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 border border-slate-800 text-xs font-mono space-y-1 mb-4">
              <span className="text-[10px] text-sky-400 uppercase font-bold block">CURRENT PAGE:</span>
              <p className="text-slate-200 font-bold truncate">{leftPageData.chapterTitle}</p>
              <p className="text-[10px] text-amber-400">Page {currentPage} of {totalPages}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950 border border-slate-800 mb-4 font-sans text-xs">
              {aiChat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xs space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-sky-950 text-sky-200 border border-sky-800 ml-4'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 mr-4'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block">
                    {msg.role === 'user' ? '👤 You' : '🤖 AI Book Tutor'}
                  </span>
                  <div className="whitespace-pre-line leading-relaxed">
                    <FormattedText text={msg.text} />
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="p-3 bg-slate-900 text-amber-400 font-mono text-xs animate-pulse">
                  Analyzing 191-page book text with Gemini AI...
                </div>
              )}
            </div>

            <div className="flex gap-2 font-mono">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                placeholder="Ask AI about this page or chapter..."
                className="flex-1 bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleAskAi}
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 uppercase text-xs transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
