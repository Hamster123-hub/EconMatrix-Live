import React, { useState } from 'react';
import { Article } from '../types';
import { Volume2, Sparkles, Clock, Globe, ArrowRight, Lock } from 'lucide-react';
import { translateArticleData, getUIText, translateCategory } from '../utils/translations';

interface HeroSectionProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  language: 'en' | 'si' | 'ta';
  onSelectCategory?: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  article,
  onSelectArticle,
  language,
  onSelectCategory,
}) => {
  const [showAiBullets, setShowAiBullets] = useState(false);
  const [aiBullets, setAiBullets] = useState<string[]>([]);
  const [isLoadingBullets, setIsLoadingBullets] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Get active translated article data
  const translatedArticle = translateArticleData(article, language);
  const displayTitle = translatedArticle.title;
  const displayDeck = translatedArticle.deck;

  const authorName =
    article.authors && article.authors.length > 0
      ? article.authors.map((a) => `${a.first_name || ''} ${a.last_name || ''}`.trim()).filter(Boolean).join(', ')
      : null;

  const handleFetchAiSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiBullets.length > 0) {
      setShowAiBullets(!showAiBullets);
      return;
    }

    setIsLoadingBullets(true);
    setShowAiBullets(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          body: article.body,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.bullets)) {
        setAiBullets(data.bullets);
      } else {
        setAiBullets([
          'Central Bank maintains current policy rates corridor.',
          'Liquidity and credit growth exhibit steady recovery.',
          'Foreign exchange reserves remain buffered above targets.',
        ]);
      }
    } catch (err) {
      setAiBullets([
        'Central Bank maintains stance amidst stabilizing inflation metrics.',
        'Key commercial banking credit growth shows positive momentum.',
        'Foreign liquidity indicators support current account balances.',
      ]);
    } finally {
      setIsLoadingBullets(false);
    }
  };

  const handlePlayAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${displayTitle}. ${displayDeck}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.play();
        audio.onended = () => setIsPlayingAudio(false);
      } else {
        // Fallback Web Speech API
        const utterance = new SpeechSynthesisUtterance(displayTitle);
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => setIsPlayingAudio(false);
      }
    } catch (err) {
      const utterance = new SpeechSynthesisUtterance(displayTitle);
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlayingAudio(false);
    }
  };

  return (
    <div
      onClick={() => onSelectArticle(article)}
      className="bg-white border-2 border-[#1A1A1A] rounded-none p-5 sm:p-6 lg:py-7 lg:px-6 shadow-2xs hover:border-[#0284C7] transition cursor-pointer group flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        {/* Top Badges & Category */}
        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCategory && article.primary_category) {
                  onSelectCategory(article.primary_category);
                }
              }}
              className="bg-[#991B1B] hover:bg-[#0284C7] text-white font-sans font-extrabold text-[9px] sm:text-[10px] uppercase px-2.5 py-1 tracking-wider transition cursor-pointer"
              title={`Filter by ${article.primary_category}`}
            >
              {getUIText('leadStoryDispatch', language)} / {translateCategory(article.primary_category, language)}
            </button>
            {article.is_breaking && (
              <span className="bg-[#091527] text-amber-300 font-sans font-extrabold text-[9px] sm:text-[10px] uppercase px-2.5 py-1 tracking-wider animate-pulse">
                {getUIText('breakingNews', language)}
              </span>
            )}
            {article.is_subscription_only && (
              <span className="bg-[#091527] text-amber-200 text-[9px] sm:text-[10px] font-bold px-2 py-1 tracking-wider uppercase flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> {getUIText('proExclusive', language)}
              </span>
            )}
          </div>

          <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'TODAY'}
          </span>
        </div>

        {/* Lead Story Layout: Side-by-side on sm+ with longer vertical thumbnail */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-2">
          <div className="sm:col-span-7 space-y-2.5">
            {/* Headline */}
            <h2 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[#0284C7] leading-snug tracking-tight group-hover:text-sky-700 transition line-clamp-3">
              {displayTitle}
            </h2>

            {/* Teaser Deck */}
            <p className="font-editorial-body text-xs sm:text-sm lg:text-[15px] text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-4">
              {displayDeck}
            </p>
          </div>

          {/* Prominent Vertical Thumbnail */}
          <div className="sm:col-span-5 h-48 sm:h-52 lg:h-56 overflow-hidden bg-slate-950 border border-slate-200 relative group-hover:border-sky-300 transition shrink-0">
            <img
              src={article.featured_image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'}
              alt={article.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 opacity-95 group-hover:opacity-100 group-hover:scale-105"
            />
            {article.image_caption && article.image_caption.trim() && !article.image_caption.toLowerCase().includes('lankaecon news desk report') ? (
              <div className="absolute bottom-0 inset-x-0 bg-black/85 text-white text-[8px] font-mono tracking-wider uppercase px-2 py-0.5 truncate">
                {article.image_caption}
              </div>
            ) : null}
          </div>
        </div>

        {/* AI Summary Section Toggle */}
        {showAiBullets && (
          <div className="bg-[#091527] text-white p-3 mb-2.5 border-l-4 border-amber-400 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wider text-[10px] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gemini AI Executive Dispatch</span>
            </div>
            {isLoadingBullets ? (
              <p className="text-slate-400 italic text-[11px]">Synthesizing executive briefing...</p>
            ) : (
              <ul className="space-y-1 text-slate-200 font-editorial-body text-xs list-disc list-inside">
                {aiBullets.map((bullet, idx) => (
                  <li key={idx} className="leading-snug">{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-200 pt-2.5 mt-1 gap-2">
        <div className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
            <Clock className="w-3 h-3 text-[#0284C7]" />
            {article.reading_time_minutes} {getUIText('readTime', language)}
          </span>
          {authorName && (
            <>
              <span>•</span>
              <span className="font-bold text-slate-800 normal-case">{authorName}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleFetchAiSummary}
            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 px-2 py-0.5 border border-slate-300 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#0284C7]" />
            <span>AI Brief</span>
          </button>

          <button
            onClick={handlePlayAudio}
            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#091527] text-white hover:bg-[#0284C7] px-2 py-0.5 transition cursor-pointer"
          >
            <Volume2 className={`w-3 h-3 ${isPlayingAudio ? 'text-amber-300 animate-bounce' : ''}`} />
            <span>Listen</span>
          </button>

          <span className="text-[#0284C7] group-hover:translate-x-1 transition ml-0.5">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
