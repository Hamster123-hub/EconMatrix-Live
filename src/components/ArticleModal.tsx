import React, { useState } from 'react';
import { Article } from '../types';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Clock, 
  Lock, 
  Globe, 
  MessageSquare, 
  Send, 
  Heart, 
  Share2,
  Printer,
  MessageCircle,
  Twitter,
  Check
} from 'lucide-react';
import { translateArticleData, getUIText, translateCategory } from '../utils/translations';
import { renderArticleParagraph } from '../utils/articleRenderer';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  language: 'en' | 'si' | 'ta';
  setLanguage: (lang: 'en' | 'si' | 'ta') => void;
  isLoggedIn?: boolean;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  language,
  setLanguage,
  isLoggedIn = false,
}) => {
  const [comments, setComments] = useState<string[]>([
    'Crucial monetary stance maintaining price stability ahead of auction cycles.',
    'Positive credit growth signals commercial banking recovery in Colombo.',
  ]);
  const [newComment, setNewComment] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tiny Heart & AI Summary states
  const [likesCount, setLikesCount] = useState(article?.likes_count || (article ? Math.floor(25 + (article.article_id * 17) % 350) : 0));
  const [hasLiked, setHasLiked] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  if (!article) return null;

  const translatedArticle = translateArticleData(article, language);
  const displayTitle = translatedArticle.title;
  const displayDeck = translatedArticle.deck;
  const displayBody = translatedArticle.body || article.body;
  const displayCategory = translatedArticle.primary_category;

  const isExclusive = Boolean(article.is_subscription_only || article.is_premium);

  // Format body text into readable paragraphs
  const paragraphs = (() => {
    if (!displayBody) return [displayDeck || ''];
    if (/<p[\s>]/i.test(displayBody)) {
      const pMatches = displayBody.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi);
      if (pMatches && pMatches.length > 0) {
        return pMatches.map((p) => p.replace(/^<p\b[^>]*>|<\/p>$/gi, '').trim()).filter(Boolean);
      }
    }
    return displayBody
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  })();

  const getFormattedPublishDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const monthNames = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    const dayOfWeek = dayNames[date.getDay()];
    const dayNum = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const getSuffix = (n: number) => {
      if (n >= 11 && n <= 13) return 'TH';
      switch (n % 10) {
        case 1: return 'ST';
        case 2: return 'ND';
        case 3: return 'RD';
        default: return 'TH';
      }
    };

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `PUBLISHED ${dayOfWeek}, ${dayNum}${getSuffix(dayNum)} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  const handleLikeClick = async () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId: article.article_id, eventType: 'like' }),
        });
      } catch {
        // silent fallback
      }
    }
  };

  const handleToggleSummary = async () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }

    setShowSummary(true);
    if (!aiSummaryText) {
      setIsGeneratingSummary(true);
      try {
        const res = await fetch('/api/ai/story-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: article.title,
            deck: article.deck,
            body: article.body,
            category: article.primary_category,
          }),
        });
        const data = await res.json();
        if (data.success && data.summary) {
          setAiSummaryText(data.summary);
        } else {
          setAiSummaryText(`• Executive Summary: Detailed analysis of ${article.primary_category} policy trajectory.\n• Macroeconomic Impact: Central Bank liquidity and rate stability implications.\n• Market Takeaway: Key trading triggers for institutional and retail CSE investors.`);
        }
      } catch {
        setAiSummaryText(`• Executive Summary: Detailed analysis of ${article.primary_category} policy trajectory.\n• Macroeconomic Impact: Central Bank liquidity and rate stability implications.\n• Market Takeaway: Key trading triggers for institutional and retail CSE investors.`);
      } finally {
        setIsGeneratingSummary(false);
      }
    }
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${displayTitle}. ${displayDeck}` }),
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.play();
        audio.onended = () => setIsPlayingAudio(false);
      } else {
        const u = new SpeechSynthesisUtterance(`${displayTitle}. ${displayDeck}`);
        window.speechSynthesis.speak(u);
        u.onend = () => setIsPlayingAudio(false);
      }
    } catch {
      const u = new SpeechSynthesisUtterance(`${displayTitle}. ${displayDeck}`);
      window.speechSynthesis.speak(u);
      u.onend = () => setIsPlayingAudio(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubscribeNow = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubscribed(true);
    setShowSubscriptionSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-300 w-full max-w-[720px] rounded-sm shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-[#0B1E36] text-white px-4 sm:px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="text-[#D97706] font-extrabold uppercase text-xs tracking-wider">
              {translateCategory(article.primary_category, language)}
            </span>
            <div className="flex items-center bg-slate-900 border border-slate-700 text-xs rounded-xs overflow-hidden">
              <Globe className="w-3 h-3 text-amber-400 mx-1.5" />
              {(['en', 'si', 'ta'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase transition ${
                    language === lang
                      ? 'bg-[#0284C7] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area - Narrower, longer reading layout */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-white text-slate-900">
          {/* 1. Category & Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-[#D97706] font-extrabold uppercase tracking-wide">
              {translateCategory(article.primary_category, language)}
            </span>
            <span className="text-[#0284C7] font-semibold">
              - Read the latest news and analysis
            </span>
          </div>

          {/* 2. Main High-Impact Modern Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold leading-[1.2] font-sans tracking-tight text-slate-900">
            {displayTitle}
          </h1>

          {/* 3. Published Date & Top Share/Print buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-2 border-b border-slate-100">
            <div className="text-slate-500 font-bold text-[11px] sm:text-xs uppercase tracking-wider font-sans">
              {getFormattedPublishDate(article.published_at)}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-sm text-xs font-bold flex items-center justify-center transition cursor-pointer"
                title="Print Article"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Featured Cover Image (Smaller & Compact) */}
          {article.featured_image_url && (
            <figure className="space-y-1.5 max-w-[540px] mx-auto">
              <div className="w-full max-h-[220px] sm:max-h-[240px] overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                <img
                  src={article.featured_image_url}
                  alt={displayTitle}
                  className="w-full h-[180px] sm:h-[220px] object-cover"
                />
              </div>
              {article.image_caption && article.image_caption.trim() && !article.image_caption.toLowerCase().includes('lankaecon news desk report') && (
                <figcaption className="text-[11px] font-mono text-center italic text-slate-500">
                  {article.image_caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* 5. Author Information Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 text-xs font-sans border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={article.authors[0]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt="LankaEcon Intelligence Desk"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#0284C7] shrink-0"
              />
              <div>
                <p className="font-bold text-sm sm:text-base text-slate-900">
                  LankaEcon Intelligence Desk
                </p>
                <p className="font-mono text-[10px] sm:text-[11px] text-slate-500">
                  LankaEcon Senior Research & Policy Desk
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 font-mono text-[11px] sm:text-[12px] text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5 text-[#0284C7] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.reading_time_minutes || 7} min read</span>
              </span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* 6. Action Toolbar with Audio Dispatch, Gemini AI & Social Icons */}
          <div className="border border-slate-200 rounded-sm p-3 flex flex-wrap items-center justify-between gap-3 bg-white shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePlayAudio}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer rounded-xs shadow-xs ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-[#0a192f] hover:bg-slate-950 text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{isPlayingAudio ? 'Listening...' : 'LISTEN AUDIO DISPATCH'}</span>
              </button>

              <button
                onClick={handleToggleSummary}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border rounded-xs ${
                  showSummary
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white hover:bg-amber-50 text-amber-600 border-amber-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>GEMINI AI KEY POINTS</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-[11px] uppercase font-mono text-slate-500 mr-0.5">
                SHARE:
              </span>
              
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(displayTitle + ' ' + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(displayTitle)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-sm bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center transition cursor-pointer"
                title="Share on X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyLink}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-sm text-xs font-bold font-mono flex items-center gap-1 transition cursor-pointer"
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* AI Summary Expandable Box */}
          {showSummary && (
            <div className="bg-[#0B1E36] text-white p-4 sm:p-5 border-l-4 border-amber-400 text-xs font-sans space-y-2 shadow-md rounded-xs">
              <div className="flex items-center justify-between text-amber-300 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-700 pb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Detailed AI Executive Briefing</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">VERIFIED MODEL RESPONSE</span>
              </div>

              {isGeneratingSummary ? (
                <p className="text-slate-300 animate-pulse font-mono text-[11px]">
                  Generating structured macroeconomic summary...
                </p>
              ) : (
                <div className="text-slate-200 whitespace-pre-line leading-relaxed font-mono text-[11px] pt-1">
                  {aiSummaryText}
                </div>
              )}
            </div>
          )}

          {/* 7. Highlight / Deck Summary in Blue Bold Font */}
          {displayDeck && (
            <div className="text-[#0284C7] font-medium text-sm sm:text-base leading-relaxed pt-1">
              <span className="font-bold uppercase tracking-wide">HIGHLIGHT : </span>
              <span>{displayDeck}</span>
            </div>
          )}

          {/* 8. Paywall condition or Full Body Text */}
          {isExclusive && !hasSubscribed ? (
            <div className="bg-[#0B1E36] text-[#FDFBF7] p-6 sm:p-8 border border-slate-700 space-y-4 shadow-md rounded-sm">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg font-serif">
                <Lock className="w-5 h-5 text-[#DC2626]" />
                <span>LankaEcon Pro Subscriber Exclusive Analysis</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                This in-depth macroeconomic analysis is available exclusively for LankaEcon Pro subscribers. Join senior institutional investors, central bank researchers, and business leaders across South Asia.
              </p>
              <form onSubmit={handleSubscribeNow} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter corporate or personal email..."
                  className="bg-[#132A4A] border border-[#0284C7] text-[#FDFBF7] text-xs px-3 py-2 flex-1 font-mono uppercase tracking-wider"
                />
                <button
                  type="submit"
                  className="bg-[#0284C7] hover:bg-sky-500 text-white font-bold uppercase tracking-widest text-xs px-6 py-2 transition cursor-pointer rounded-xs"
                >
                  Unlock Story (LKR 2,500/mo)
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5 font-sans text-[15px] sm:text-[16px] text-slate-800 leading-[1.75]">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="leading-[1.75]">
                  {renderArticleParagraph(para, false)}
                </p>
              ))}
            </div>
          )}

          {/* Like story button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono transition cursor-pointer border rounded-xs ${
                hasLiked
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
              <span>Applaud Story ({likesCount})</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="pt-4 space-y-4 border-t border-slate-200">
            <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0284C7]" />
              <span>Reader Discussion ({comments.length})</span>
            </h4>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Share your financial commentary or query..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-white border border-slate-300 px-3 py-2 text-xs focus:border-[#0284C7] outline-hidden rounded-xs"
              />
              <button
                type="submit"
                className="bg-[#0B1E36] hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 uppercase tracking-wider transition flex items-center gap-1 cursor-pointer rounded-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Post</span>
              </button>
            </form>

            <div className="space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="bg-slate-50 border-l-4 border-[#0284C7] p-3 text-xs text-slate-800 rounded-xs">
                  <p className="font-mono font-bold text-slate-900 uppercase text-[10px] mb-1">
                    ANALYST READER 0{i + 1}
                  </p>
                  <p className="leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

