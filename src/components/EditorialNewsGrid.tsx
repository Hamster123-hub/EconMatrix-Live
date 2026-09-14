import React from 'react';
import { Article } from '../types';
import { translateArticleData, getUIText, translateCategory } from '../utils/translations';
import { ArrowRight, ChevronRight, Clock } from 'lucide-react';
import { HorizontalAdBanner } from './HorizontalAdBanner';

interface HeadlineLeftThumbRightCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  language: 'en' | 'si' | 'ta';
  onSelectCategory?: (category: string) => void;
}

export const HeadlineLeftThumbRightCard: React.FC<HeadlineLeftThumbRightCardProps> = ({
  article,
  onSelectArticle,
  language,
  onSelectCategory,
}) => {
  const trArt = translateArticleData(article, language);

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'AUG 25, 2026';

  return (
    <div
      onClick={() => onSelectArticle(article)}
      className="group cursor-pointer bg-white hover:bg-slate-50/80 p-3 sm:p-4 border-b border-slate-200 transition-all w-full flex flex-row items-start justify-between gap-4"
    >
      {/* LEFT: Badges & Category Pill + Headline + Date */}
      <div className="flex-1 min-w-0 pr-2 space-y-1.5">
        {/* Ticker Badges Row: Blue Category Tag + Breaking/Lead */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Small Blue Category Tag */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectCategory && article.primary_category) {
                onSelectCategory(article.primary_category);
              }
            }}
            className="inline-flex items-center gap-0.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider transition cursor-pointer shadow-2xs"
            title={`Filter by ${article.primary_category || 'ECONOMY'}`}
          >
            <span>{translateCategory(article.primary_category || 'ECONOMY', language)}</span>
            <ChevronRight className="w-2.5 h-2.5 text-amber-300" />
          </button>

          {/* Breaking Badge */}
          {article.is_breaking && (
            <span className="bg-rose-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider animate-pulse">
              {getUIText('breakingNews', language)}
            </span>
          )}

          {/* Lead Story Badge */}
          {article.is_lead_story && (
            <span className="bg-[#091527] text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider">
              ★ LEAD
            </span>
          )}

          {/* Optional Reading Time */}
          <span className="text-[9.5px] text-slate-400 font-mono hidden sm:inline-flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            {article.reading_time_minutes || 3}m
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-sans text-[15.5px] sm:text-[16px] lg:text-[17px] font-bold text-slate-900 group-hover:text-[#0284C7] leading-[1.25] tracking-[-0.01em] transition line-clamp-3">
          {trArt.title}
        </h3>

        {/* Deck preview or date stamp */}
        {trArt.deck ? (
          <p className="font-sans text-xs text-slate-600 line-clamp-1">
            {trArt.deck}
          </p>
        ) : (
          <div className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">
            ON: {formattedDate}
          </div>
        )}
      </div>

      {/* RIGHT: Thumbnail Image */}
      {article.featured_image_url && (
        <div className="w-28 h-20 sm:w-36 sm:h-24 md:w-44 md:h-28 overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
          <img
            src={article.featured_image_url}
            alt={trArt.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}
    </div>
  );
};

export const RectangularStoryCard = HeadlineLeftThumbRightCard;

interface EditorialNewsGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  language: 'en' | 'si' | 'ta';
  onSelectCategory?: (category: string) => void;
  onNavigateToAdCenter?: () => void;
  onNavigateToAllStories?: () => void;
  onOpenWhatsAppModal?: () => void;
}

export const EditorialNewsGrid: React.FC<EditorialNewsGridProps> = ({
  articles,
  onSelectArticle,
  language,
  onSelectCategory,
  onNavigateToAdCenter,
  onNavigateToAllStories,
}) => {
  if (!articles || articles.length === 0) return null;

  // Take up to 10 stories for the main home page feed stream
  const feedArticles = articles.slice(0, 10);
  const firstBatch = feedArticles.slice(0, 4);
  const secondBatch = feedArticles.slice(4, 10);

  return (
    <div className="space-y-4 w-full bg-white border border-slate-200 p-2 sm:p-4 shadow-2xs">
      {/* First Batch of Headline-Left / Thumb-Right Stories */}
      <div className="divide-y divide-slate-200 w-full">
        {firstBatch.map((art) => (
          <HeadlineLeftThumbRightCard
            key={art.article_id}
            article={art}
            onSelectArticle={onSelectArticle}
            language={language}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>

      {/* Middle Horizontal Ad Banner (Slot 1) */}
      <div className="my-4">
        <HorizontalAdBanner
          language={language}
          onNavigateToAdCenter={onNavigateToAdCenter}
          slotLocation="feed_inline_1"
          slotId="feed_middle"
        />
      </div>

      {/* Second Batch of Stories */}
      {secondBatch.length > 0 && (
        <div className="divide-y divide-slate-200 w-full">
          {secondBatch.map((art) => (
            <HeadlineLeftThumbRightCard
              key={art.article_id}
              article={art}
              onSelectArticle={onSelectArticle}
              language={language}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      )}

      {/* Click For All Stories Button */}
      <div className="flex justify-center pt-4 pb-2">
        <button
          onClick={() => {
            if (onNavigateToAllStories) {
              onNavigateToAllStories();
            }
          }}
          className="group flex items-center gap-3 bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest px-8 py-3 rounded-none transition shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{getUIText('clickForAllStories', language)}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Horizontal Ad Banner (Slot 2) */}
      <div className="my-4">
        <HorizontalAdBanner
          language={language}
          onNavigateToAdCenter={onNavigateToAdCenter}
          slotLocation="feed_inline_2"
          slotId="feed_bottom"
        />
      </div>
    </div>
  );
};
