import React, { useState, useEffect } from 'react';
import { EconBook } from '../types';
import { safeSetStorage } from '../utils/safeStorage';
import { 
  X, BookOpen, CheckCircle, Lock, ShieldCheck, CreditCard, Sparkles, 
  ChevronRight, Download, Eye, DollarSign, Award, Check, FileText, Globe, AlertCircle, RefreshCw
} from 'lucide-react';

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
  language = 'en',
}) => {
  const isTragicBook = book ? (book.id === 'book-ranul-001' || book.title.toLowerCase().includes('tragic mis-fortune') || book.title.toLowerCase().includes('story behind')) : false;
  const displayAuthor = isTragicBook || (book?.author && book.author.toLowerCase().includes('ranul')) ? '' : (book?.author || '');

  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'purchase'>('overview');
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<{ accessCode: string; message: string } | null>(null);

  useEffect(() => {
    if (!book) return;
    // Check local storage for purchase status
    try {
      const storedKey = localStorage.getItem(`purchased_${book.id}`);
      if (storedKey || book.id !== 'book-ranul-001') {
        setIsPurchased(true);
      } else {
        setIsPurchased(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [book?.id]);

  const handleProcessPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      alert('Please enter your email address to receive your digital reader receipt.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/econ-books/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          customerName: customerName.trim() || 'Valued Reader',
          customerEmail: customerEmail.trim(),
          paymentMethod: paymentMethod === 'card' ? 'Visa / MasterCard Credit Card' : paymentMethod === 'bank' ? 'SLIPS Direct Bank Deposit' : 'PayPal Express',
          cardHolder: customerName,
          cardDetails: cardNumber.slice(-4),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsPurchased(true);
        safeSetStorage(`purchased_${book.id}`, data.accessCode || 'PAID');
        setPurchaseSuccess({
          accessCode: data.accessCode,
          message: data.message || 'Payment confirmed! Full 191-page digital flipbook unlocked.',
        });
      } else {
        alert(data.error || 'Payment processing failed. Please check your card details.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyAccessCode = async () => {
    if (!accessCodeInput.trim()) return;
    setIsProcessing(true);
    try {
      if (accessCodeInput.trim().toUpperCase() === 'FREE2026' || accessCodeInput.trim().toUpperCase().startsWith('BK-PERMIT')) {
        setIsPurchased(true);
        safeSetStorage(`purchased_${book.id}`, accessCodeInput.trim());
        setPurchaseSuccess({
          accessCode: accessCodeInput.trim().toUpperCase(),
          message: 'Access permit verified! Full book access unlocked.',
        });
      } else {
        const res = await fetch(`/api/econ-books/verify-purchase?accessCode=${encodeURIComponent(accessCodeInput.trim())}`);
        const data = await res.json();
        if (data.verified) {
          setIsPurchased(true);
          safeSetStorage(`purchased_${book.id}`, accessCodeInput.trim());
          setPurchaseSuccess({
            accessCode: accessCodeInput.trim(),
            message: 'Access permit verified! Full book access unlocked.',
          });
        } else {
          alert('Invalid Access Key. Please enter a valid permit key or complete online purchase.');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !book) return null;

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
                {isPurchased ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Access Unlocked</span>
                  </span>
                ) : (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3 text-rose-300" />
                    <span>Purchase Required for Full Access</span>
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
            <span>Book Overview & Topics</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Read Free Chapter 1 Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'purchase'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-amber-400 border border-amber-500/40 hover:bg-amber-500/10'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isPurchased ? 'Read Online / Flipbook' : 'Purchase Online Access (LKR 2,500)'}</span>
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
                    <span>191 PAGES COMPLETE</span>
                    <span>•</span>
                    <span>REVISED 2026 EDITION</span>
                  </div>
                  <h3 className="font-serif font-black text-xl text-white leading-tight">
                    {book.title}
                  </h3>
                  <p className="font-serif text-sm text-amber-200/90 italic font-bold">
                    "A Nation Held at Ransom by Its Own Central Bank"
                  </p>
                  <p className="text-xs font-mono text-slate-300">
                    {displayAuthor ? <>Author: <strong className="text-white">{displayAuthor}</strong> | </> : null}Published: <strong className="text-white">{book.publishedYear}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                    {isPurchased ? (
                      <button
                        onClick={() => onOpenFlipbook(book)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-lg"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Launch 3D Interactive Flipbook</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('purchase')}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-lg"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Unlock Full Access (LKR 2,500)</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('preview')}
                      className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span>Read Free Chapter 1</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* What This Book Talks About */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-amber-400 border-b border-slate-800 pb-2">
                  What This Book Talks About
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif">
                  {book.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg space-y-2">
                    <h5 className="font-mono font-bold text-xs text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Monetary Policy & Central Bank Discretion</span>
                    </h5>
                    <p className="text-xs text-slate-400 leading-normal">
                      Examines how unsterilized liquidity injections, Standing Lending Facility usage, and open market operations create excess money supply, driving rupee devaluation and high domestic inflation.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg space-y-2">
                    <h5 className="font-mono font-bold text-xs text-amber-300 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-400" />
                      <span>The Impossible Trinity & Balance of Payments</span>
                    </h5>
                    <p className="text-xs text-slate-400 leading-normal">
                      Analyzes Sri Lanka's historical trilemma: attempting to fix interest rates below market equilibrium, manage foreign exchange pegs, and maintain open trade flows simultaneously.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg space-y-2">
                    <h5 className="font-mono font-bold text-xs text-amber-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Overnight Policy Rate (OPR) & IMF Frameworks</span>
                    </h5>
                    <p className="text-xs text-slate-400 leading-normal">
                      Provides step-by-step evaluation of the Central Bank of Sri Lanka Act No. 16 of 2023, the single overnight policy rate corridor, flexible inflation targeting, and debt restructuring timelines.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg space-y-2">
                    <h5 className="font-mono font-bold text-xs text-amber-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      <span>Constitutional & Legislative Reforms</span>
                    </h5>
                    <p className="text-xs text-slate-400 leading-normal">
                      Proposes concrete legal reforms to restrict fiscal dominance, prohibit debt monetization, and establish strict monetary rules to safeguard Sri Lanka's national currency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Table of Contents Summary */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-base text-amber-400 border-b border-slate-800 pb-2">
                  18-Chapter Table of Contents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 1</span>
                    <span className="truncate">Foundations of Monetary Hegemony & Discretion</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 2</span>
                    <span className="truncate">Central Bank Balance Sheet Mechanics</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 3</span>
                    <span className="truncate">Open Market Operations & Interbank Liquidity</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 4</span>
                    <span className="truncate">The Impossible Trinity in Sri Lanka</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 5</span>
                    <span className="truncate">Currency Pegs & Exchange Rate Collapse</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 6</span>
                    <span className="truncate">Fiscal Dominance & Treasury Monetization</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Ch. 7-18</span>
                    <span className="truncate">IMF Restructuring, OPR Transition & Legal Frameworks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">FREE CHAPTER PREVIEW</span>
                  <h4 className="font-serif font-bold text-base text-white">CHAPTER I: The Foundations of Monetary Hegemony & Central Bank Discretion</h4>
                </div>
                <button
                  onClick={() => setActiveTab('purchase')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer shrink-0"
                >
                  Unlock All 18 Chapters
                </button>
              </div>

              {/* Free Chapter Text */}
              <div className="bg-[#FAF9F6] text-slate-950 p-6 sm:p-10 rounded-xl shadow-lg font-serif space-y-4 leading-relaxed max-w-3xl mx-auto border border-amber-200">
                <div className="text-center space-y-1 border-b border-amber-900/20 pb-4 mb-4">
                  <span className="font-mono text-xs font-bold text-amber-900 uppercase tracking-widest block">EXCERPT • CHAPTER 1</span>
                  <h3 className="text-2xl font-black text-slate-950">The Foundations of Monetary Hegemony</h3>
                  {displayAuthor ? <p className="text-xs font-bold text-amber-800 italic">By {displayAuthor}</p> : null}
                </div>

                <p className="text-sm font-medium">
                  The central bank of any sovereign nation exercises a legal monopoly over the issuance of fiat money. In Sri Lanka, the Central Bank of Sri Lanka (CBSL), established under the Monetary Law Act No. 58 of 1949 and updated under the CBSL Act of 2023, stands as the sole authority managing money supply, credit conditions, and external reserves.
                </p>

                <p className="text-sm font-medium">
                  However, the exercising of discretionary monetary power without strict, non-negotiable quantitative rules leads inevitably to monetary distortion. When the central bank purchases Treasury bills directly from the primary market or injects liquidity via Standing Lending Facilities to artificially suppress interest rates below market clearing levels, it creates purchasing power unbacked by real economic productivity.
                </p>

                <div className="p-4 bg-amber-100/80 border-l-4 border-amber-800 rounded text-xs text-amber-950 font-serif italic my-4">
                  "Money creation unbacked by real production is a silent tax upon every rupee holder in the nation. It systematically dilutes purchasing power, drives capital flight, and exhausts official foreign reserves."
                </div>

                <p className="text-sm font-medium">
                  In open market economics, the relationship between domestic money supply and the balance of payments is inviolable. Excess rupee liquidity generated by the central bank overflows into the foreign exchange market as importers convert newly created rupees into foreign currency to acquire imported goods. Without sufficient foreign reserves or rising interest rates to sterilize this liquidity, the exchange rate faces overwhelming depreciation pressure.
                </p>

                {/* Lock Overlay Banner inside preview */}
                <div className="bg-gradient-to-br from-slate-900 to-[#0F1E36] text-white p-6 rounded-xl border border-amber-500/40 text-center space-y-3 mt-8">
                  <Lock className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="font-serif font-bold text-lg text-white">End of Free Chapter 1 Preview</h4>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    You have completed the free sample of Chapter 1. To read the full 191-page treatise (Chapters 2 to 18) and access the 3D interactive flipbook, please purchase digital reader access.
                  </p>
                  <button
                    onClick={() => setActiveTab('purchase')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-lg shadow-lg transition cursor-pointer"
                  >
                    Purchase Full Book Access (LKR 2,500)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchase' && (
            <div className="space-y-6">
              {isPurchased ? (
                <div className="bg-gradient-to-br from-slate-900 to-[#0F1E36] border-2 border-emerald-500/50 p-8 rounded-xl text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-black text-2xl text-white">
                    Full Digital Access Unlocked!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto">
                    You have active lifetime online reader access to <strong className="text-white">"{book.title}"</strong>.
                  </p>
                  {purchaseSuccess?.accessCode && (
                    <div className="inline-block bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg font-mono text-xs text-amber-400">
                      Permit Code: <strong>{purchaseSuccess.accessCode}</strong>
                    </div>
                  )}
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenFlipbook(book);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-6 py-3 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-xl"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Launch 3D Interactive Flipbook</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Summary & Pricing */}
                  <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">DIGITAL BOOK ACCESS</span>
                      <h4 className="font-serif font-bold text-base text-white">{book.title}</h4>
                      {displayAuthor ? <p className="text-xs text-slate-400">By {displayAuthor}</p> : null}
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Digital Reader Access (191 Pages):</span>
                        <span className="font-mono font-bold text-white">LKR 2,500</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>3D Interactive FlipHTML5 License:</span>
                        <span className="font-mono text-emerald-400 font-bold">INCLUDED</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>International Price:</span>
                        <span className="font-mono text-sky-400 font-bold">$12.50 USD</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-amber-400">
                        <span>Total Payable:</span>
                        <span className="font-mono text-base">LKR 2,500</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Instant Online Reading in 3D Flipbook</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Lifetime Access & Multi-Device Compatibility</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Official Digital Reader Receipt Issued</span>
                      </div>
                    </div>

                    {/* Quick Access Permit Box */}
                    <div className="border-t border-slate-800 pt-4 space-y-2">
                      <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                        Have an Access Permit Key / Promo Code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={accessCodeInput}
                          onChange={(e) => setAccessCodeInput(e.target.value)}
                          placeholder="e.g., FREE2026 or BK-PERMIT-..."
                          className="bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded flex-1 font-mono focus:border-amber-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyAccessCode}
                          disabled={isProcessing}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold px-3 py-2 rounded transition cursor-pointer"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Checkout Form */}
                  <form onSubmit={handleProcessPurchase} className="md:col-span-7 bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h4 className="font-serif font-bold text-base text-amber-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                      <span>Complete Online Payment</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Kamal Perera"
                          className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                          Email Address (for Digital Permit & Receipt) *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="reader@example.com"
                          className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                          Select Payment Option
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`p-2.5 rounded border text-xs font-mono text-center transition cursor-pointer ${
                              paymentMethod === 'card'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            💳 Credit / Debit Card
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('bank')}
                            className={`p-2.5 rounded border text-xs font-mono text-center transition cursor-pointer ${
                              paymentMethod === 'bank'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            🏦 SLIPS Bank Transfer
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('paypal')}
                            className={`p-2.5 rounded border text-xs font-mono text-center transition cursor-pointer ${
                              paymentMethod === 'paypal'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            🌐 PayPal / Stripe
                          </button>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4111 2222 3333 4444"
                              className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded focus:border-amber-500 outline-none font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-mono text-slate-400 mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="12/28"
                                className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded focus:border-amber-500 outline-none font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-slate-400 mb-1">CVC / CVV</label>
                              <input
                                type="text"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                placeholder="123"
                                className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded focus:border-amber-500 outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm py-3 rounded-lg shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing Secure Payment...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay LKR 2,500 & Unlock Full Book Access</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
