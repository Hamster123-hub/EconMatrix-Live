import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Volume2, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Heart, 
  Lock, 
  Check, 
  MessageCircle, 
  Twitter, 
  Send, 
  Moon, 
  Sun, 
  ChevronUp,
  Printer,
  Copy
} from 'lucide-react';
import { translateArticleData, getUIText, translateCategory } from '../utils/translations';
import { renderArticleParagraph } from '../utils/articleRenderer';
import {
  getArticleShareUrl,
  getWhatsAppShareUrl,
  getTwitterShareUrl,
  copyArticleShareUrl,
  shareArticleNativeOrCopy,
} from '../utils/shareUtils';

interface FullArticleViewProps {
  article: Article;
  onBack: () => void;
  language: 'en' | 'si' | 'ta';
  setLanguage: (lang: 'en' | 'si' | 'ta') => void;
  isLoggedIn?: boolean;
  isSubscriber?: boolean;
  onOpenSubscribeModal?: () => void;
  relatedArticles?: Article[];
  onSelectArticle?: (art: Article) => void;
}

export const FullArticleView: React.FC<FullArticleViewProps> = ({
  article,
  onBack,
  language,
  setLanguage,
  isLoggedIn = false,
  isSubscriber = false,
  onOpenSubscribeModal,
  relatedArticles = [],
  onSelectArticle,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes_count || Math.floor(42 + (article.article_id * 13) % 200));
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // User-Friendliness: Reading Progress, Font Size, Reader Dark/Light Canvas Mode
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isNightReader, setIsNightReader] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // AI Briefing State
  const [showAiBrief, setShowAiBrief] = useState(false);
  const [aiBriefingText, setAiBriefingText] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Reader Comments State
  const [comments, setComments] = useState<any[]>([
    {
      id: 1,
      author: 'Ranil Perera, CFA',
      title: 'Senior Portfolio Manager',
      text: 'Critical insights for CBSL monetary policy trajectory. The rate corridor alignment is pivotal for Q3 corporate yield expectations.',
      timestamp: '15 mins ago',
      likes: 8,
    },
    {
      id: 2,
      author: 'Dr. Sharmini Cooray',
      title: 'Macroeconomist',
      text: 'Well-researched analysis on sovereign debt sustainability. Secondary market bond yields already reflecting this sentiment.',
      timestamp: '42 mins ago',
      likes: 14,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.article_id]);

  const translatedArticle = translateArticleData(article, language);
  const displayTitle = translatedArticle.title;
  const displayDeck = translatedArticle.deck;
  const displayBody = translatedArticle.body || article.body;

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

  const handlePlayVoice = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const textToSpeak = `${displayTitle}. ${displayDeck}. ${paragraphs.slice(0, 2).join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    if (language === 'si') utterance.lang = 'si-LK';
    else if (language === 'ta') utterance.lang = 'ta-LK';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleToggleAiBrief = async () => {
    if (showAiBrief) {
      setShowAiBrief(false);
      return;
    }

    setShowAiBrief(true);
    if (!aiBriefingText) {
      setIsGeneratingBrief(true);
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
          setAiBriefingText(data.summary);
        } else {
          setAiBriefingText(
            `• Policy Impact: High influence on Sri Lanka fiscal deficit targets.\n• CSE Market Reaction: Banking and export equities expected to respond positively.\n• Key Takeaway: Central Bank & Treasury strategy remains focused on inflation stabilization.`
          );
        }
      } catch {
        setAiBriefingText(
          `• Policy Impact: High influence on Sri Lanka fiscal deficit targets.\n• CSE Market Reaction: Banking and export equities expected to respond positively.\n• Key Takeaway: Central Bank & Treasury strategy remains focused on inflation stabilization.`
        );
      } finally {
        setIsGeneratingBrief(false);
      }
    }
  };

  const handleCopyLink = async () => {
    const success = await copyArticleShareUrl({ article_id: article.article_id, slug: article.slug });
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const res = await shareArticleNativeOrCopy({
      article_id: article.article_id,
      slug: article.slug,
      title: displayTitle,
    });
    if (res === 'copied') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newObj = {
      id: Date.now(),
      author: newCommentAuthor.trim() || 'Verified Subscriber',
      title: 'Financial Market Reader',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 1,
    };

    setComments([newObj, ...comments]);
    setNewCommentText('');
    setNewCommentAuthor('');
  };

  const getBodyFontSize = () => {
    switch (fontSizeLevel) {
      case 'large':
        return 'text-[17px] sm:text-[18px] leading-[1.8]';
      case 'xlarge':
        return 'text-[19px] sm:text-[20px] leading-[1.9]';
      case 'normal':
      default:
        return 'text-[15px] sm:text-[16px] leading-[1.75]';
    }
  };

  return (
    <article className={`min-h-screen font-sans pb-16 transition-colors duration-300 ${
      isNightReader ? 'bg-[#0a0f1d] text-slate-100' : 'bg-white text-slate-900'
    }`}>
      
      {/* Reading Progress Indicator Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-[#0284C7] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Article Navigation Bar (Scrolls away cleanly so only the story is visible) */}
      <div className={`relative z-30 shadow-2xs py-3 px-4 sm:px-8 border-b transition-colors ${
        isNightReader ? 'bg-[#0f172a] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider transition cursor-pointer px-3.5 py-2 border rounded-xs ${
              isNightReader 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-[#0B1E36] border-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
            <span>← {getUIText('backToFeed', language)}</span>
          </button>

          <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
            <span className="font-extrabold text-[#0284C7] uppercase">{translateCategory(article.primary_category, language)}</span>
            {article.is_lead_story && (
              <>
                <span>•</span>
                <span className={isNightReader ? 'text-amber-400 font-bold' : 'text-[#091527] font-bold'}>{getUIText('leadStoryDispatch', language)}</span>
              </>
            )}
            {article.is_breaking && (
              <>
                <span>•</span>
                <span className="text-rose-600 font-bold animate-pulse">{getUIText('breakingNews', language)}</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Reader Font Size Selector */}
            <div className={`hidden sm:flex items-center border rounded overflow-hidden text-[11px] font-bold ${
              isNightReader ? 'border-slate-700' : 'border-slate-300'
            }`}>
              <button
                onClick={() => setFontSizeLevel('normal')}
                className={`px-2 py-1 ${fontSizeLevel === 'normal' ? 'bg-[#0284C7] text-white' : 'hover:bg-slate-200/50'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                className={`px-2 py-1 ${fontSizeLevel === 'large' ? 'bg-[#0284C7] text-white' : 'hover:bg-slate-200/50'}`}
                title="Large Font Size"
              >
                A+
              </button>
            </div>

            {/* Night Reader Toggle */}
            <button
              onClick={() => setIsNightReader(!isNightReader)}
              className={`p-2 text-xs font-bold transition cursor-pointer border rounded-xs ${
                isNightReader ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title={isNightReader ? 'Switch to Day Mode' : 'Switch to Dark Night Reader'}
            >
              {isNightReader ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Language Switcher */}
            <div className={`flex items-center border rounded overflow-hidden text-[10px] font-bold ${
              isNightReader ? 'border-slate-700' : 'border-slate-300'
            }`}>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 ${language === 'en' ? 'bg-[#0B1E36] text-white' : 'hover:bg-slate-200/50'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-2 py-1 ${language === 'si' ? 'bg-[#0B1E36] text-white' : 'hover:bg-slate-200/50'}`}
              >
                සිං
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 ${language === 'ta' ? 'bg-[#0B1E36] text-white' : 'hover:bg-slate-200/50'}`}
              >
                த
              </button>
            </div>

            {/* Save / Bookmark Button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 text-xs font-bold transition cursor-pointer border rounded-xs ${
                isBookmarked
                  ? 'bg-[#0B1E36] text-amber-300 border-[#0B1E36]'
                  : isNightReader ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Bookmark Article"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-300 text-amber-300' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Page Article Canvas - Narrower and Longer */}
      <div className={`max-w-[700px] mx-auto px-4 sm:px-6 py-8 space-y-6 ${isNightReader ? 'bg-[#0a0f1d]' : 'bg-white'}`}>
        
        {/* 1. Category & Analysis Breadcrumb (Screenshot 1 Format) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-[#D97706] dark:text-amber-500 font-extrabold uppercase tracking-wide">
              {translateCategory(article.primary_category, language)}
            </span>
            <span className="text-[#0284C7] font-semibold">
              - Read the latest news and analysis
            </span>
          </div>

          {/* Exclusive / Pro Badge if applicable */}
          <div className="flex items-center gap-2">
            {article.is_subscription_only && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 tracking-widest flex items-center gap-1 border border-amber-600 rounded-xs">
                <Lock className="w-3 h-3 text-slate-950" />
                <span>{getUIText('proExclusive', language)}</span>
              </span>
            )}

            {article.is_subscription_only && (isSubscriber || isLoggedIn) && (
              <span className="bg-emerald-700 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 tracking-widest flex items-center gap-1 rounded-xs">
                <Check className="w-3 h-3 text-white" />
                <span>Subscriber Pass Active</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. Main High-Impact Modern Headline (Screenshot 1 Format) */}
        <h1 className={`text-[21px] sm:text-[26px] md:text-[29px] font-extrabold leading-[1.2] font-sans tracking-tight ${
          isNightReader ? 'text-white' : 'text-slate-900'
        }`}>
          {displayTitle}
        </h1>

        {/* 3. Published Date + Top Share & Print Action Buttons (Screenshot 1 Format) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className={`font-bold text-[11px] sm:text-xs uppercase tracking-wider font-sans ${
            isNightReader ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {getFormattedPublishDate(article.published_at)}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNativeShare}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isNightReader ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Share Article"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className={`px-2.5 py-1.5 rounded-sm text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                isNightReader ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Print Article"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Featured Cover Image (Smaller & Compact) */}
        {article.featured_image_url && (
          <figure className="space-y-1.5 max-w-[540px] mx-auto">
            <div className={`w-full max-h-[220px] sm:max-h-[240px] overflow-hidden rounded-sm border ${
              isNightReader ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <img
                src={article.featured_image_url}
                alt={displayTitle}
                className="w-full h-[180px] sm:h-[220px] object-cover"
              />
            </div>
            {article.image_caption && article.image_caption.trim() && !article.image_caption.toLowerCase().includes('lankaecon news desk report') && (
              <figcaption className={`text-[11px] font-mono text-center italic ${isNightReader ? 'text-slate-400' : 'text-slate-500'}`}>
                {article.image_caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* 5. Author Information Bar (Screenshot 3 Format) */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 text-xs font-sans border-b ${
          isNightReader ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={article.authors[0]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={article.authors[0]?.first_name || 'LankaEcon Intelligence Desk'}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#0284C7] shrink-0"
            />
            <div>
              <p className={`font-bold text-base ${isNightReader ? 'text-white' : 'text-slate-900'}`}>
                LankaEcon Intelligence Desk
              </p>
              <p className={`font-mono text-[11px] ${isNightReader ? 'text-slate-400' : 'text-slate-500'}`}>
                LankaEcon Senior Research & Policy Desk
              </p>
            </div>
          </div>

          <div className={`flex items-center space-x-3 font-mono text-[12px] shrink-0 ${isNightReader ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="flex items-center gap-1.5 text-[#0284C7] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.reading_time_minutes || 7} min read</span>
            </span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* 6. Action Toolbar with Audio Dispatch, Gemini AI & Social Icons (Screenshot 3 Format) */}
        <div className={`border rounded-sm p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs ${
          isNightReader ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Voice Readout Button */}
            <button
              onClick={handlePlayVoice}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer rounded-xs shadow-xs ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-[#0a192f] hover:bg-slate-950 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>{isPlayingAudio ? 'Listening Audio...' : 'LISTEN AUDIO DISPATCH'}</span>
            </button>

            {/* AI Summary Toggle Button */}
            <button
              onClick={handleToggleAiBrief}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border rounded-xs ${
                showAiBrief
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-white hover:bg-amber-50 text-amber-600 border-amber-400 dark:bg-slate-900 dark:text-amber-400 dark:border-amber-500'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>GEMINI AI KEY POINTS</span>
            </button>
          </div>

          {/* Social Share Controls */}
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-xs uppercase font-mono mr-1 ${isNightReader ? 'text-slate-400' : 'text-slate-500'}`}>
              SHARE :
            </span>
            
            <a
              href={getWhatsAppShareUrl({
                article_id: article.article_id,
                slug: article.slug,
                title: displayTitle,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>

            <a
              href={getTwitterShareUrl({
                article_id: article.article_id,
                slug: article.slug,
                title: displayTitle,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-sm bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Share on X"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-sm text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                isNightReader ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Copy Article Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Gemini AI Briefing Box (Expandable) */}
        {showAiBrief && (
          <div className="bg-[#0B1E36] text-white p-5 border-l-4 border-amber-400 space-y-3 font-sans shadow-sm rounded-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="flex items-center gap-2 font-extrabold text-amber-300 text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Executive AI Intelligence Takeaways</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">GEMINI PRO ANALYSIS</span>
            </div>

            {isGeneratingBrief ? (
              <p className="text-slate-300 font-mono text-xs animate-pulse">
                Synthesizing article facts and macro impacts...
              </p>
            ) : (
              <p className="text-slate-200 font-mono text-xs whitespace-pre-line leading-relaxed">
                {aiBriefingText}
              </p>
            )}
          </div>
        )}

        {/* 7. Highlight / Deck Summary in Blue Bold Font (Screenshot 2 Format) */}
        {displayDeck && (
          <div className="text-[#0284C7] font-medium text-base sm:text-lg leading-relaxed pt-2">
            <span className="font-bold uppercase tracking-wide">HIGHLIGHT : </span>
            <span>{displayDeck}</span>
          </div>
        )}

        {/* 8. Full Formatted Article Body (Screenshot 2 Format) */}
        <div className={`space-y-6 font-sans ${getBodyFontSize()} ${
          isNightReader ? 'text-slate-200' : 'text-slate-800'
        }`}>
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {renderArticleParagraph(para, isNightReader)}
            </p>
          ))}
        </div>

        {/* Article Footer & Reader Engagement */}
        <div className={`border p-6 space-y-4 mt-12 rounded-xs ${
          isNightReader ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono transition cursor-pointer border rounded-xs ${
                hasLiked
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : isNightReader ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
              <span>{hasLiked ? (language === 'si' ? 'ඔබ කැමති විය' : language === 'ta' ? 'நீங்கள் விரும்பினீர்கள்' : 'You Liked This') : (language === 'si' ? 'කැමැත්ත පළ කරන්න' : language === 'ta' ? 'விருப்பம் தெரிவிக்க' : 'Applaud Story')} ({likesCount})</span>
            </button>

            <button
              onClick={onBack}
              className="bg-[#0B1E36] hover:bg-slate-900 text-white font-extrabold text-xs px-5 py-2.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 rounded-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
              <span>{getUIText('backToStories', language)}</span>
            </button>
          </div>
        </div>

        {/* Verified Reader Comments Section */}
        <div className={`border-t-2 pt-8 space-y-6 ${isNightReader ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-serif font-bold text-2xl ${isNightReader ? 'text-white' : 'text-[#0B1E36]'}`}>
              {getUIText('commentsHeading', language)} ({comments.length})
            </h3>
            <span className="bg-[#0284C7] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-xs">
              VERIFIED FORUM
            </span>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className={`border p-4 space-y-3 rounded-xs ${
            isNightReader ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-xs font-extrabold uppercase tracking-wider ${isNightReader ? 'text-cyan-300' : 'text-[#0B1E36]'}`}>
              {getUIText('addComment', language)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name & Credentials (e.g. Kapila Silva, CFA)"
                value={newCommentAuthor}
                onChange={(e) => setNewCommentAuthor(e.target.value)}
                className={`p-2 text-xs outline-none focus:border-[#0284C7] ${
                  isNightReader ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <textarea
              rows={3}
              required
              placeholder="Share your perspective on this market dispatch..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className={`w-full p-2 text-xs outline-none focus:border-[#0284C7] ${
                isNightReader ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />

            <button
              type="submit"
              className="bg-[#0B1E36] hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 rounded-xs"
            >
              <Send className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{getUIText('submitComment', language)}</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className={`border-l-4 border-[#0284C7] p-4 space-y-1 rounded-xs ${
                isNightReader ? 'bg-slate-900/80' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-extrabold ${isNightReader ? 'text-white' : 'text-[#0B1E36]'}`}>{c.author}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{c.timestamp}</span>
                </div>
                <p className={`text-xs ${isNightReader ? 'text-slate-300' : 'text-slate-700'}`}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Market Stories Grid */}
        {relatedArticles.length > 0 && (
          <div className={`border-t-2 pt-8 space-y-6 ${isNightReader ? 'border-slate-800' : 'border-[#0B1E36]'}`}>
            <h3 className={`font-sans font-extrabold text-2xl uppercase tracking-tight ${
              isNightReader ? 'text-white' : 'text-[#0B1E36]'
            }`}>
              {getUIText('relatedStories', language)}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((rel) => {
                const trRel = translateArticleData(rel, language);
                return (
                  <div
                    key={rel.article_id}
                    onClick={() => onSelectArticle && onSelectArticle(rel)}
                    className={`border p-4 transition cursor-pointer space-y-2 group shadow-2xs rounded-xs ${
                      isNightReader
                        ? 'bg-slate-900 border-slate-800 hover:border-cyan-400'
                        : 'bg-white border-slate-200 hover:border-[#0284C7]'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#0284C7] uppercase block">
                      {translateCategory(rel.primary_category, language)}
                    </span>
                    <h4 className={`font-bold text-sm group-hover:text-[#0284C7] transition line-clamp-2 ${
                      isNightReader ? 'text-white' : 'text-slate-900'
                    }`}>
                      {trRel.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 ${isNightReader ? 'text-slate-400' : 'text-slate-600'}`}>{trRel.deck}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Floating Scroll to Top Button for User-Friendliness */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-[#0B1E36] hover:bg-slate-900 text-amber-300 p-3 rounded-full shadow-lg border border-amber-400/40 transition-all cursor-pointer flex items-center justify-center"
          title="Scroll to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </article>
  );
};
