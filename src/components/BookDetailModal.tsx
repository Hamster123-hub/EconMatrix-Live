import React, { useState, useEffect } from 'react';
import { EconBook } from '../types';
import { CLASSICAL_BOOKS_DATA, BookLibraryDetails } from '../data/classicalBooksLibrary';
import { 
  X, BookOpen, CheckCircle, ShieldCheck, Sparkles, 
  Download, Eye, Award, FileText, Globe, ExternalLink, Info, AlertTriangle,
  Lock, KeyRound, ShoppingBag, Check
} from 'lucide-react';
import { isBookPurchased, getBookPurchase } from '../utils/bookAccess';
import { BookCheckoutModal } from './BookCheckoutModal';

interface BookDetailModalProps {
  book: EconBook | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFlipbook: (book: EconBook) => void;
  language?: 'en' | 'si' | 'ta';
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenFlipbook,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'access'>('overview');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const isTragicBook = book ? (
    book.id === 'book-ranul-001' || 
    book.title.toLowerCase().includes('tragic mis-fortune') || 
    book.title.toLowerCase().includes('story behind')
  ) : false;

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => !isTragicBook || (book ? isBookPurchased(book.id) : false));
  const purchaseRecord = book ? getBookPurchase(book.id) : null;

  useEffect(() => {
    if (book) {
      setIsUnlocked(!isTragicBook || isBookPurchased(book.id));
    }
  }, [book, isTragicBook, isOpen]);

  if (!isOpen || !book) return null;

  const displayAuthor = isTragicBook 
    ? (book.author || 'Disnaka') 
    : (book.author || '');

  const libraryData: BookLibraryDetails | null = CLASSICAL_BOOKS_DATA[book.id] || null;

  // Derive book details
  const subtitle = isTragicBook 
    ? "A Nation Held at Ransom by Its Own Central Bank" 
    : libraryData?.subtitle || book.category || "Academic & Policy Research";

  const volumeLabel = isTragicBook 
    ? "191 Pages • 18 Chapters • Paid Edition (Rs. 3,500 LKR)"
    : libraryData?.volumeLabel || (book.pagesCount ? `${book.pagesCount} Pages • Complete Edition` : 'Academic Edition');

  const topics = isTragicBook
    ? [
        {
          title: 'Monetary Policy & Central Bank Discretion',
          description: 'Examines how unsterilized liquidity injections, Standing Lending Facility usage, and open market operations create excess money supply, driving rupee devaluation and high domestic inflation.',
        },
        {
          title: 'The Impossible Trinity & Balance of Payments',
          description: "Analyzes Sri Lanka's historical trilemma: attempting to fix interest rates below market equilibrium, manage foreign exchange pegs, and maintain open trade flows simultaneously.",
        },
        {
          title: 'Overnight Policy Rate (OPR) & IMF Frameworks',
          description: 'Provides step-by-step evaluation of the Central Bank of Sri Lanka Act No. 16 of 2023, the single overnight policy rate corridor, flexible inflation targeting, and debt restructuring timelines.',
        },
        {
          title: 'Constitutional & Legislative Reforms',
          description: "Proposes concrete legal reforms to restrict fiscal dominance, prohibit debt monetization, and establish strict monetary rules to safeguard Sri Lanka's national currency.",
        },
      ]
    : libraryData?.keyTopics || [
        {
          title: 'Foundational Economic Methodology',
          description: `Core economic models and principles introduced in ${book.title}.`,
        },
        {
          title: 'Market Structure & Policy Analysis',
          description: 'Empirical and theoretical foundations governing prices, production, and institutional policy.',
        },
      ];

  const tableOfContents = isTragicBook
    ? [
        { chapterNumber: 'Ch. 1', title: 'The Surface of Circulation (Marx vs Classical Predecessors)', summary: 'C-M-C circuit, metamorphosis of commodities, and the classical money veil.' },
        { chapterNumber: 'Ch. 2', title: 'Money as Social Movement in the Form of a Thing', summary: 'Labor theory of value in money, commodity fetishism, and currency tokens.' },
        { chapterNumber: 'Ch. 3', title: 'How Much Money Is Needed? Quantity and Velocity', summary: 'Fisherian equation of exchange, real income, and circulation requirements.' },
        { chapterNumber: 'Ch. 4', title: 'David Hume: Quantity Theory & Price-Specie-Flow', summary: 'Automatic balance of payments adjustments and the specie-flow mechanism.' },
        { chapterNumber: 'Ch. 5', title: "Ricardo, Say's Law, and the Question of Crisis", summary: 'Capital accumulation, glut controversies, and classical monetary neutrality.' },
        { chapterNumber: 'Ch. 6', title: "Marx: Attacking Hume & Ricardo's Monetary Theory", summary: 'Separation of sale and purchase as the genetic possibility of crises.' },
        { chapterNumber: 'Ch. 7', title: 'Classical View: Interest, Money and Capital', summary: 'Loanable funds theory, natural vs market rate of interest.' },
        { chapterNumber: 'Ch. 8', title: 'The Keynesian Revolution: Money and Uncertainty', summary: 'Liquidity preference, animal spirits, and radical uncertainty.' },
        { chapterNumber: 'Ch. 9', title: 'Three Visions of Money and Capitalism', summary: 'Synthesis of classical, Marxist, and Keynesian macroeconomic schools.' },
        { chapterNumber: 'Ch. 10', title: 'Delineating Economic Policy: Monetary vs. Fiscal Operations', summary: 'Independent central bank plumbing vs Treasury debt issuance.' },
        { chapterNumber: 'Ch. 11', title: 'The Ledger of Nations: Balance of Payments & Twin Deficits', summary: 'Current account identity CA = S - I and foreign reserve mechanics.' },
        { chapterNumber: 'Ch. 12', title: 'Exchange Rate Regimes and the Impossible Trinity', summary: 'The trilemma: independent rates, fixed FX, and free capital mobility.' },
        { chapterNumber: 'Ch. 13', title: "Sri Lanka's New Monetary Regime (The 2023 Central Bank Act)", summary: 'Flexible inflation targeting, statutory independence, and OPR framework.' },
        { chapterNumber: 'Ch. 14–18', title: 'OPR Corridor, Debt Restructuring & Monetary Constitution', summary: 'Operational guidelines for permanent rupee stability.' },
      ]
    : libraryData?.tableOfContents || [
        { chapterNumber: 'Book I', title: 'Foundational Principles', summary: book.description || 'Core theoretical principles and definitions.' },
        { chapterNumber: 'Book II', title: 'Policy Applications', summary: 'Institutional implementations and empirical cases.' },
      ];

  const preview = libraryData?.previewExcerpt || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1320] border-2 border-amber-500/50 rounded-xl shadow-2xl max-w-4xl w-full text-slate-100 overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#0F172A] border-b border-slate-800 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-lg font-mono shadow-md">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {book.category || 'Monetary Economics'}
                </span>
                {isTragicBook ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>3D FlipHTML5 Reader Linked</span>
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Free Open Access Library</span>
                  </span>
                )}
              </div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-white mt-1 leading-tight">
                {book.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Close Window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-2 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isTragicBook ? 'Contents & Overview (Free Preview)' : 'Book Overview & Structure'}</span>
          </button>

          {!isTragicBook && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Read Chapter Excerpt</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('access')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'access'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-amber-400 border border-amber-500/40 hover:bg-amber-500/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{isTragicBook ? '3D FlipHTML5 Reader' : 'Online Document & Reader'}</span>
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Summary Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0F1E36] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-32 h-44 object-cover rounded-lg shadow-xl border border-amber-500/40 shrink-0"
                />
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-extrabold uppercase px-3 py-0.5 rounded-full">
                    <span>{volumeLabel}</span>
                  </div>
                  <h3 className="font-serif font-black text-xl text-white leading-tight">
                    {book.title}
                  </h3>
                  <p className="font-serif text-sm text-amber-200/90 italic font-bold">
                    "{subtitle}"
                  </p>
                  <p className="text-xs font-mono text-slate-300">
                    {displayAuthor ? <>Author: <strong className="text-white">{displayAuthor}</strong> | </> : null}
                    Published / Edition: <strong className="text-white">{book.publishedYear}</strong>
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                    {isTragicBook ? (
                      isUnlocked ? (
                        <>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenFlipbook(book);
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-lg"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Launch 3D Flipbook (Unlocked)</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('access')}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-amber-400" />
                            <span>Read In Modal</span>
                          </button>
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1.5 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>License Active (No Download)</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setShowCheckoutModal(true)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-xl"
                          >
                            <Lock className="w-4 h-4" />
                            <span>Unlock Full Book (Rs. 3,500 LKR)</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('access')}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4 text-sky-400" />
                            <span>Restore Access</span>
                          </button>
                        </>
                      )
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenFlipbook(book);
                          }}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-lg"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Open In-App Book Reader</span>
                        </button>
                        {book.readOnlineUrl && (
                          <a
                            href={book.readOnlineUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                            <span>Read Document on Web</span>
                          </a>
                        )}
                        {book.downloadUrl && (
                          <a
                            href={book.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Download PDF</span>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* What This Book Talks About */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-amber-400 border-b border-slate-800 pb-2">
                  What This Work Examines
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {book.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {topics.map((t, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg space-y-2">
                      <h5 className="font-mono font-bold text-xs text-amber-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{t.title}</span>
                      </h5>
                      <p className="text-xs text-slate-400 leading-normal">
                        {t.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table of Contents Summary */}
              <div className="space-y-3 pt-2">
                {isTragicBook && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono text-amber-400 font-bold uppercase text-[10px] block">Free Table of Contents Preview</span>
                        <p className="text-slate-300 text-xs">
                          Anyone can inspect the full 18-chapter outline and summaries below. Full 191-page digital flipbook access is Rs. 3,500.
                        </p>
                      </div>
                    </div>
                    {!isUnlocked && (
                      <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-lg transition cursor-pointer shrink-0 shadow flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock Full Book (Rs. 3,500)</span>
                      </button>
                    )}
                  </div>
                )}

                <h4 className="font-serif font-bold text-base text-amber-400 border-b border-slate-800 pb-2">
                  Table of Contents & Structure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  {tableOfContents.map((ch, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{ch.chapterNumber}</span>
                        <span className="font-semibold text-white truncate">{ch.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{ch.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && !isTragicBook && preview && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">CLASSICAL TEXT EXCERPT</span>
                  <h4 className="font-serif font-bold text-base text-white">{preview.chapterTitle}</h4>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenFlipbook(book);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded transition cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Launch In-App Reader</span>
                </button>
              </div>

              {/* Chapter Text */}
              <div className="bg-[#FAF9F6] text-slate-950 p-6 sm:p-10 rounded-xl shadow-lg font-serif space-y-4 leading-relaxed max-w-3xl mx-auto border border-amber-200">
                <div className="text-center space-y-1 border-b border-amber-900/20 pb-4 mb-4">
                  <span className="font-mono text-xs font-bold text-amber-900 uppercase tracking-widest block">{book.title}</span>
                  <h3 className="text-2xl font-black text-slate-950">{preview.sectionTitle}</h3>
                  {displayAuthor ? <p className="text-xs font-bold text-amber-800 italic">By {displayAuthor}</p> : null}
                </div>

                {preview.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm font-medium">
                    {p}
                  </p>
                ))}

                {preview.quote && (
                  <div className="p-4 bg-amber-100/80 border-l-4 border-amber-800 rounded text-xs text-amber-950 font-serif italic my-4">
                    "{preview.quote}"
                  </div>
                )}

                {preview.keyFormula && (
                  <div className="bg-slate-900 text-amber-300 font-mono text-xs p-3 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block">Key Identity / Proposition:</span>
                    <strong>{preview.keyFormula}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-6">
              {isTragicBook ? (
                isUnlocked ? (
                  /* Active 3D FlipHTML5 Reader for Unlocked Purchaser */
                  <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <strong className="text-amber-400 font-serif text-sm">THE STORY BEHIND SRI LANKA'S TRAGIC MIS-FORTUNE</strong>
                        <span className="text-emerald-400 font-mono text-[10px] uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">License Verified</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenFlipbook(book);
                          }}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Fullscreen Mode</span>
                        </button>
                      </div>
                    </div>

                    {/* DRM Notice Banner */}
                    <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 select-none">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Protected Online Streaming Edition • Local File Download Disabled</span>
                      </div>
                      {purchaseRecord?.customerName && (
                        <span>
                          Licensed to: <strong className="text-white">{purchaseRecord.customerName}</strong> ({purchaseRecord.accessCode})
                        </span>
                      )}
                    </div>

                    {/* Embedded FlipHTML5 Reader Container */}
                    <div 
                      onContextMenu={(e) => e.preventDefault()} 
                      className="w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl select-none"
                    >
                      <div style={{ position: 'relative', paddingTop: 'max(60%, 324px)', width: '100%', height: 0 }}>
                        <iframe
                          style={{ position: 'absolute', border: 'none', width: '100%', height: '100%', left: 0, top: 0 }}
                          src="https://online.fliphtml5.com/EconMatrix/asck/"
                          title="THE STORY BEHIND SRI LANKA'S TRAGIC MIS-FORTUNE"
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Paywall View for Locked Monograph */
                  <div className="bg-gradient-to-br from-slate-900 to-[#0F1E36] border-2 border-amber-500/50 p-6 sm:p-8 rounded-2xl space-y-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-inner">
                      <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                        Paid Research Publication • Single-User Web License
                      </span>
                      <h3 className="font-serif font-black text-2xl text-white">
                        Unlock Full 191-Page Monograph
                      </h3>
                      <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                        Lifetime online reading access to <strong className="text-white">"THE STORY BEHIND SRI LANKA'S TRAGIC MIS-FORTUNE"</strong> in our high-definition 3D interactive flipbook.
                      </p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="text-slate-400">Monograph Price</span>
                        <strong className="text-amber-400 text-lg font-black">Rs. 3,500 LKR</strong>
                      </div>
                      <div className="space-y-1.5 text-slate-300 text-[11px]">
                        <p className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Full 18 Chapters (Complete 191 Pages)</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>3D Interactive Flipbook with Page Physics</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>AI Economic Reading Tutor & Analysis</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Official IRD Tax Invoice & Access Permit</span>
                        </p>
                      </div>
                    </div>

                    {/* Strict Anti-Download & DRM Notice */}
                    <div className="bg-slate-950 border border-amber-500/30 p-3.5 rounded-xl max-w-md mx-auto text-left text-xs font-mono text-amber-200/90 flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="text-white block">Protected Online Streaming Edition:</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          To protect the author's copyright, local file downloading to laptops or mobile phones is strictly disabled. Full access is granted online via web browser.
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Unlock Full Book — Rs. 3,500 LKR</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('overview')}
                        className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-5 py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-sky-400" />
                        <span>Browse Table of Contents (Free)</span>
                      </button>

                      <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="w-full sm:w-auto bg-transparent hover:bg-slate-800 text-slate-400 font-bold text-xs px-4 py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                        <span>Restore Access</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Free Access & Reading for other classical books */
                <div className="bg-gradient-to-br from-slate-900 to-[#0F1E36] border-2 border-emerald-500/50 p-8 rounded-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-black text-2xl text-white">
                      Free Academic & Public Domain Access
                    </h3>
                    <p className="text-sm text-slate-300 max-w-lg mx-auto">
                      <strong className="text-white">"{book.title}"</strong> is an open-access classical or policy publication available freely for scholarly study.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenFlipbook(book);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer shadow-lg text-center"
                    >
                      <BookOpen className="w-6 h-6" />
                      <span>Launch In-App Reader</span>
                      <span className="text-[10px] opacity-80 font-normal">Interactive text reader</span>
                    </button>

                    {book.readOnlineUrl ? (
                      <a
                        href={book.readOnlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-900/80 hover:bg-sky-800 text-sky-100 border border-sky-600/50 font-bold text-xs p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer shadow text-center"
                      >
                        <ExternalLink className="w-6 h-6 text-sky-300" />
                        <span>Read on Project Gutenberg</span>
                        <span className="text-[10px] text-sky-300 font-mono">Official Web Source</span>
                      </a>
                    ) : null}

                    {book.downloadUrl ? (
                      <a
                        href={book.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/50 font-bold text-xs p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer shadow text-center"
                      >
                        <Download className="w-6 h-6 text-emerald-300" />
                        <span>Download Free PDF</span>
                        <span className="text-[10px] text-emerald-300 font-mono">Full eBook Download</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Book Checkout & Payment Gateway Modal */}
        <BookCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          book={book}
          onSuccess={() => {
            setIsUnlocked(true);
            setShowCheckoutModal(false);
            setActiveTab('access');
          }}
          onViewTableOfContents={() => {
            setShowCheckoutModal(false);
            setActiveTab('overview');
          }}
        />
      </div>
    </div>
  );
};
