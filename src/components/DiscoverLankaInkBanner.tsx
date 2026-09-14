import React from 'react';
import { Feather, Sparkles, BookOpen, ArrowRight, Palette, Award } from 'lucide-react';

interface DiscoverLankaInkBannerProps {
  onNavigateToInkCanvas: () => void;
  language?: 'en' | 'si' | 'ta';
}

export const DiscoverLankaInkBanner: React.FC<DiscoverLankaInkBannerProps> = ({
  onNavigateToInkCanvas,
}) => {
  return (
    <div className="my-8 bg-gradient-to-r from-[#2A1810] via-[#4A2612] to-[#0B1E36] text-amber-100 p-6 sm:p-8 border-2 border-[#D4A373] shadow-lg rounded-xs relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-amber-300">
        <Feather className="w-64 h-64" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        
        {/* Left Info Section */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-[#991B1B] text-amber-100 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 border border-amber-400/40 flex items-center gap-1.5 rounded-xs">
              <Feather className="w-3.5 h-3.5 text-amber-300" />
              FEATURED CULTURAL ATELIER
            </span>
            <span className="text-amber-300 text-xs font-serif italic hidden sm:inline">
              Sri Lankan Fine Arts, Poetry & Literature
            </span>
          </div>

          <h3 className="font-serif font-black text-2xl sm:text-4xl text-[#FAF7F2] leading-snug">
            Discover Lanka Ink & Canvas
          </h3>

          <p className="text-xs sm:text-sm text-amber-100/90 font-serif leading-relaxed">
            Explore rare Sri Lankan literary books, poetry anthologies, artisan wood carvings, cultural video podcasts, and critical essays curated by master Sri Lankan creators.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-300/90 pt-1 font-serif">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Poetry & Novels
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Visual Fine Arts
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Artisan Crafts
            </span>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={onNavigateToInkCanvas}
            className="w-full md:w-auto bg-gradient-to-r from-[#D4A373] to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-serif font-black px-6 py-3.5 text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-xl border border-amber-200 rounded-xs transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Explore Ink & Canvas Atelier</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
