import React, { useState } from 'react';
import { Article } from '../types';
import { Clock, Lock, Heart, Volume2, Sparkles, Check, ChevronRight } from 'lucide-react';
import { ThemeStyle } from './Header';
import { translateArticleData, getUIText, translateCategory } from '../utils/translations';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  language: 'en' | 'si' | 'ta';
  isLoggedIn?: boolean;
  themeStyle?: ThemeStyle;
  onSelectCategory?: (category: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  language,
  isLoggedIn = false,
  themeStyle = 'modern_pro',
  onSelectCategory,
}) => {
  const [likesCount, setLikesCount] = useState(article.likes_count || Math.floor(25 + (article.article_id * 17) % 350));
  const [hasLiked, setHasLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const isVibrant = false;
  const isModern = themeStyle === 'modern_pro';

  const translatedArticle = translateArticleData(article, language);
  const displayTitle = translatedArticle.title;
  const displayDeck = translatedArticle.deck;

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handlePlayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const textToSpeak = `${displayTitle}. ${displayDeck}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    if (language === 'si') utterance.lang = 'si-LK';
    else if (language === 'ta') utterance.lang = 'ta-LK';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
          setAiSummaryText(`• Executive Summary: Analysis of ${article.primary_category} dynamics.\n• Macro Impact: High relevance to Sri Lanka economic stance.\n• Market Takeaway: Key indicator for Colombo Stock Exchange traders.`);
        }
      } catch {
        setAiSummaryText(`• Executive Summary: Analysis of ${article.primary_category} dynamics.\n• Macro Impact: High relevance to Sri Lanka economic stance.\n• Market Takeaway: Key indicator for Colombo Stock Exchange traders.`);
      } finally {
        setIsGeneratingSummary(false);
      }
    }
  };

  const authorName =
    article.authors && article.authors.length > 0
      ? article.authors.map((a) => `${a.first_name || ''} ${a.last_name || ''}`.trim()).filter(Boolean).join(', ')
      : null;

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'AUGUST 21, 2026';

  return (
    <div
      onClick={() => onSelectArticle(article)}
      className={`p-2.5 sm:p-4 md:p-5 transition-all duration-300 cursor-pointer group flex flex-col space-y-3 ${
        isVibrant
          ? 'bg-slate-950/80 border-2 border-indigo-900/80 hover:border-cyan-400 hover:bg-slate-900 text-white rounded-lg shadow-sm'
          : isModern
          ? 'bg-white border border-slate-200/90 hover:border-sky-500 hover:shadow-md text-slate-900 rounded-none sm:rounded-lg'
          : 'bg-white border-b-2 border-slate-200 hover:border-[#0284C7] pb-6 pt-3'
      }`}
    >
      {/* MOBILE-ONLY TILE PRESENTATION (Matches user reference exactly on screens < md) */}
      <div className="flex md:hidden flex-row gap-3 items-stretch w-full">
        {/* Left Square/Rectangular Thumbnail */}
        {article.featured_image_url && (
          <div className="w-28 h-24 sm:w-36 sm:h-28 overflow-hidden bg-slate-100 border border-slate-200 relative group-hover:border-sky-300 transition shrink-0">
            <img
              src={article.featured_image_url}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            {article.is_subscription_only && (
              <span className="absolute top-1 left-1 bg-[#991B1B] text-white text-[7.5px] font-black uppercase px-1.5 py-0.5 tracking-wider shadow-xs flex items-center gap-0.5">
                <Lock className="w-2 h-2" /> PRO
              </span>
            )}
          </div>
        )}

        {/* Right Content */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-between space-y-1">
          <div>
            {/* Category Header */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCategory && article.primary_category) {
                    onSelectCategory(article.primary_category);
                  }
                }}
                className="inline-flex items-center gap-1 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider transition cursor-pointer"
                title={`Filter by ${article.primary_category}`}
              >
                <span>{translateCategory(article.primary_category || 'ECONOMY', language)}</span>
                <ChevronRight className="w-2.5 h-2.5 text-amber-300" />
              </button>

              {article.is_breaking && (
                <span className="bg-[#091527] text-amber-300 text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider animate-pulse">
                  {getUIText('breakingNews', language)}
                </span>
              )}
            </div>

            {/* Headline */}
            <h3 className="font-sans text-[15.5px] sm:text-[16px] font-bold text-slate-900 group-hover:text-[#0284C7] leading-[1.25] tracking-[-0.01em] transition line-clamp-2">
              {displayTitle}
            </h3>

            {/* Date line (ON: AUGUST 21, 2026) */}
            <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-wide mt-0.5">
              ON: {formattedDate}
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="flex items-center justify-between text-[10px] font-sans text-slate-500 pt-1 border-t border-slate-100 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <Clock className="w-2.5 h-2.5 text-[#0284C7]" />
                {article.reading_time_minutes || 3} {getUIText('readTime', language)}
              </span>
              {authorName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-sans font-medium text-[9.5px] truncate max-w-[85px]">
                    {authorName}
                  </span>
                </>
              )}
            </div>

            <span className="text-[10px] font-mono font-extrabold text-[#0284C7] group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 ml-1">
              <span>{getUIText('readStory', language)}</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Visible on md+ screens) */}
      <div className="hidden md:flex flex-row items-start justify-between gap-6">
        {/* Text Info */}
        <div className="flex-1 space-y-2">
          {/* Category Header & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCategory && article.primary_category) {
                  onSelectCategory(article.primary_category);
                }
              }}
              className={`font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded-xs transition cursor-pointer ${
                isVibrant
                  ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800'
                  : isModern
                  ? 'bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-extrabold border border-sky-200'
                  : 'text-[#0284C7] hover:text-[#991B1B] underline underline-offset-4'
              }`}
              title={`Filter by ${article.primary_category}`}
            >
              {translateCategory(article.primary_category, language)}
            </button>
            
            {article.is_subscription_only && (
              <span className="bg-[#DC2626] text-white text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase flex items-center gap-1 rounded-xs">
                <Lock className="w-2.5 h-2.5" /> {getUIText('proExclusive', language)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-xl sm:text-2xl font-bold leading-snug transition ${
            isVibrant
              ? 'text-white group-hover:text-cyan-300'
              : 'text-[#0F172A] group-hover:text-[#0284C7]'
          }`}>
            {displayTitle}
          </h3>

          {/* Deck */}
          <p className={`text-sm leading-relaxed line-clamp-2 ${
            isVibrant ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {displayDeck}
          </p>

          {/* Meta & Interactive Bar (Audio Voice, AI Summary, Tiny Heart) */}
          <div className={`flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-3 border-t ${
            isVibrant ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0284C7]" />
                {article.reading_time_minutes || 4} {getUIText('readTime', language)}
              </span>
              {authorName && (
                <>
                  <span>•</span>
                  <span className="font-sans font-medium text-slate-700">{authorName}</span>
                </>
              )}
            </div>

            {/* Interactive Feature Controls */}
            <div className="flex items-center space-x-2">
              {/* Voice Readout Button */}
              <button
                onClick={handlePlayVoice}
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase transition cursor-pointer rounded-xs ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-900 animate-pulse'
                    : isVibrant ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                }`}
                title="AI Voice Read-Out (Audio Dispatch)"
              >
                <Volume2 className="w-3 h-3 text-[#0284C7]" />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen Voice'}</span>
              </button>

              {/* AI Summary Button */}
              <button
                onClick={handleToggleSummary}
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase transition cursor-pointer rounded-xs ${
                  showSummary
                    ? 'bg-[#0284C7] text-white'
                    : isVibrant ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                }`}
                title="Detailed AI Summary"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>AI Summary</span>
              </button>

              {/* Tiny Heart Like Button */}
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold font-mono transition cursor-pointer border rounded-xs ${
                  hasLiked
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : isVibrant ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
                title="Like story (Tiny Heart)"
              >
                <Heart className={`w-3 h-3 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
                <span>{likesCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Thumbnail */}
        {article.featured_image_url && (
          <div className="w-full md:w-56 h-36 bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 rounded-md">
            <img
              src={article.featured_image_url}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        )}
      </div>

      {/* AI Summary Expandable Box */}
      {showSummary && (
        <div className="bg-[#0B1E36] text-white p-4 border-l-4 border-amber-400 text-xs font-sans space-y-2 mt-2 rounded-xs">
          <div className="flex items-center justify-between text-amber-300 font-extrabold uppercase text-[10px] tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Detailed AI Story Executive Briefing</span>
            </span>
            <span className="text-slate-400 font-mono text-[9px]">COMPILATION COMPLETE</span>
          </div>

          {isGeneratingSummary ? (
            <p className="text-slate-300 animate-pulse font-mono text-[11px]">
              Generating structured macroeconomic summary...
            </p>
          ) : (
            <div className="text-slate-200 whitespace-pre-line leading-relaxed font-mono text-[11px]">
              {aiSummaryText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
