import React from 'react';
import { Article } from '../types';
import { translateArticleData, getUIText, translateCategory } from '../utils/translations';
import { ChevronRight } from 'lucide-react';

interface InitialStoriesHeroProps {
  leadStory: Article;
  subLeadStory?: Article;
  secondaryStory1?: Article;
  secondaryStory2?: Article;
  onSelectArticle: (article: Article) => void;
  language: 'en' | 'si' | 'ta';
  onSelectCategory?: (category: string) => void;
}

export const InitialStoriesHero: React.FC<InitialStoriesHeroProps> = ({
  leadStory,
  subLeadStory,
  secondaryStory1,
  secondaryStory2,
  onSelectArticle,
  language,
  onSelectCategory,
}) => {
  const trLead = translateArticleData(leadStory, language);
  const trSub = subLeadStory ? translateArticleData(subLeadStory, language) : null;
  const trSec1 = secondaryStory1 ? translateArticleData(secondaryStory1, language) : null;
  const trSec2 = secondaryStory2 ? translateArticleData(secondaryStory2, language) : null;

  return (
    <div className="w-full bg-white border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-2xs mb-6">
      {/* 2-Column Main Hero Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Lead Story (Headline -> Big Image -> Sub-Lead Blue Strip Banner) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* 1. Lead Story Big Headline on TOP with Ticker Badges */}
          <div className="space-y-2">
            {/* Top Badges: LEAD STORY + BREAKING + Blue Category Tag */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Blue Category Tag */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCategory && leadStory.primary_category) {
                    onSelectCategory(leadStory.primary_category);
                  }
                }}
                className="inline-flex items-center gap-1 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 tracking-wider transition cursor-pointer shadow-2xs"
                title={`Filter by ${leadStory.primary_category || 'ECONOMY'}`}
              >
                <span>{translateCategory(leadStory.primary_category || 'ECONOMY', language)}</span>
                <ChevronRight className="w-3 h-3 text-amber-300" />
              </button>

              {/* Lead Story Badge - ONLY shown when is_lead_story is true */}
              {leadStory.is_lead_story && (
                <span className="bg-[#091527] text-white text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 tracking-wider font-sans">
                  {getUIText('leadStoryDispatch', language)}
                </span>
              )}

              {/* Breaking Badge if applicable - ONLY shown when is_breaking is true */}
              {leadStory.is_breaking && (
                <span className="bg-rose-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 tracking-wider animate-pulse">
                  {getUIText('breakingNews', language)}
                </span>
              )}
            </div>

            <div 
              onClick={() => onSelectArticle(leadStory)}
              className="group cursor-pointer"
            >
              <h1 className="font-sans text-[21px] sm:text-[26px] lg:text-[29px] font-extrabold text-slate-900 leading-[1.25] tracking-[-0.015em] group-hover:text-[#0284C7] transition">
                {trLead.title}
              </h1>
            </div>
          </div>

          {/* 2. Lead Story Featured Image directly below headline */}
          <div
            onClick={() => onSelectArticle(leadStory)}
            className="group cursor-pointer relative w-full aspect-[16/9] overflow-hidden bg-slate-900 border border-slate-200 shadow-2xs"
          >
            <img
              src={leadStory.featured_image_url || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80'}
              alt={trLead.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            {leadStory.image_caption && leadStory.image_caption.trim() && !leadStory.image_caption.toLowerCase().includes('lankaecon news desk report') && (
              <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase px-3 py-1 truncate">
                {leadStory.image_caption}
              </div>
            )}
          </div>

          {/* 3. Sub-Lead Highlight Bar / Card with Blue Top Border Accent & Badges */}
          {subLeadStory && trSub && (
            <div
              onClick={() => onSelectArticle(subLeadStory)}
              className="group cursor-pointer bg-[#F0F9FF] border-t-4 border-[#0284C7] border-x border-b border-sky-200/80 p-3.5 sm:p-4 hover:bg-sky-100/60 transition shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCategory && subLeadStory.primary_category) {
                      onSelectCategory(subLeadStory.primary_category);
                    }
                  }}
                  className="inline-flex items-center gap-0.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[8.5px] font-extrabold uppercase px-2 py-0.5 tracking-wider transition cursor-pointer"
                >
                  <span>{translateCategory(subLeadStory.primary_category || 'ECONOMY', language)}</span>
                </button>
                {subLeadStory.is_breaking && (
                  <span className="bg-rose-600 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider animate-pulse">
                    {getUIText('breakingNews', language)}
                  </span>
                )}
              </div>

              <h2 className="font-sans text-[19px] sm:text-[21px] font-extrabold text-slate-900 group-hover:text-[#0284C7] leading-[1.25] tracking-[-0.015em] transition">
                {trSub.title}
              </h2>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 2 Secondary Featured Stories (2 columns side-by-side on mobile, vertical stack on desktop) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:gap-6 pt-1 lg:pt-0">
          
          {/* Secondary Story 1 */}
          {secondaryStory1 && trSec1 && (
            <div
              onClick={() => onSelectArticle(secondaryStory1)}
              className="group cursor-pointer flex flex-col space-y-2"
            >
              {/* Image on top */}
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs relative">
                <img
                  src={secondaryStory1.featured_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                  alt={trSec1.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Ticker Tags */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCategory && secondaryStory1.primary_category) {
                      onSelectCategory(secondaryStory1.primary_category);
                    }
                  }}
                  className="inline-flex items-center gap-0.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[7.5px] sm:text-[8.5px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 tracking-wider transition cursor-pointer"
                >
                  <span>{translateCategory(secondaryStory1.primary_category || 'ECONOMY', language)}</span>
                </button>

                {secondaryStory1.is_breaking && (
                  <span className="bg-rose-600 text-white text-[7px] sm:text-[8px] font-extrabold uppercase px-1 sm:px-1.5 py-0.5 tracking-wider animate-pulse">
                    {getUIText('breakingNews', language)}
                  </span>
                )}
                {secondaryStory1.is_lead_story && (
                  <span className="bg-[#091527] text-white text-[7px] sm:text-[8px] font-extrabold uppercase px-1 sm:px-1.5 py-0.5 tracking-wider">
                    ★ LEAD
                  </span>
                )}
              </div>

              {/* Bold headline underneath */}
              <h3 className="font-sans text-[15.5px] sm:text-[16px] lg:text-[17px] font-bold text-slate-900 group-hover:text-[#0284C7] leading-[1.25] tracking-[-0.01em] transition line-clamp-4">
                {trSec1.title}
              </h3>
            </div>
          )}

          {/* Secondary Story 2 */}
          {secondaryStory2 && trSec2 && (
            <div
              onClick={() => onSelectArticle(secondaryStory2)}
              className="group cursor-pointer flex flex-col space-y-2"
            >
              {/* Image on top */}
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                <img
                  src={secondaryStory2.featured_image_url || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'}
                  alt={trSec2.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Ticker Tags */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCategory && secondaryStory2.primary_category) {
                      onSelectCategory(secondaryStory2.primary_category);
                    }
                  }}
                  className="inline-flex items-center gap-0.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[7.5px] sm:text-[8.5px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 tracking-wider transition cursor-pointer"
                >
                  <span>{translateCategory(secondaryStory2.primary_category || 'ECONOMY', language)}</span>
                </button>

                {secondaryStory2.is_breaking && (
                  <span className="bg-rose-600 text-white text-[7px] sm:text-[8px] font-extrabold uppercase px-1 sm:px-1.5 py-0.5 tracking-wider animate-pulse">
                    {getUIText('breakingNews', language)}
                  </span>
                )}
                {secondaryStory2.is_lead_story && (
                  <span className="bg-[#091527] text-white text-[7px] sm:text-[8px] font-extrabold uppercase px-1 sm:px-1.5 py-0.5 tracking-wider">
                    ★ LEAD
                  </span>
                )}
              </div>

              {/* Bold headline underneath */}
              <h3 className="font-sans text-[15.5px] sm:text-[16px] lg:text-[17px] font-bold text-slate-900 group-hover:text-[#0284C7] leading-[1.25] tracking-[-0.01em] transition line-clamp-4">
                {trSec2.title}
              </h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

