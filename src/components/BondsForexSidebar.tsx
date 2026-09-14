import React from 'react';
import { Article } from '../types';

interface BondsForexSidebarProps {
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
  language?: 'en' | 'si' | 'ta';
}

export const BondsForexSidebar: React.FC<BondsForexSidebarProps> = ({
  articles = [],
  onSelectArticle,
  language = 'en',
}) => {
  return (
    <div className="bg-white border border-slate-200 p-3.5 sm:p-4 space-y-5 shadow-2xs hover:border-slate-300 transition w-full">
      {/* 1. CARD: MONETARY, FOREX */}
      <div className="space-y-3">
        {/* Header Box with top yellow/amber bar accent */}
        <div className="bg-[#E0F2FE] relative pt-2 pb-2 px-3 flex items-center justify-between border-t-4 border-[#0284C7]">
          <h3 className="text-lg sm:text-xl font-black text-[#0284C7] uppercase tracking-wider font-sans">
            {language === 'si' ? 'මුදල් සහ විදේශ විනිමය' : language === 'ta' ? 'நாணயம், அந்நிய செலாவணி' : 'MONETARY, FOREX'}
          </h3>
        </div>

        {/* Graphic Image Banner: Depreciation Bias / Foreign Held Rupee Bonds */}
        <div
          onClick={() => {
            const forexStory = articles.find(a => 
              a.title.toLowerCase().includes('rupee allowed to appreciate') ||
              a.title.toLowerCase().includes('rupee') || 
              a.title.toLowerCase().includes('dollar') || 
              a.primary_category === 'MARKETS'
            ) || articles[0];
            if (forexStory && onSelectArticle) onSelectArticle(forexStory);
          }}
          className="group cursor-pointer relative w-full overflow-hidden bg-gradient-to-br from-[#0B1E36] via-[#1E3A8A] to-[#0284C7] border border-slate-200 shadow-2xs hover:shadow-sm transition"
        >
          {/* Top Left Badge */}
          <div className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 shadow-xs border border-slate-300 font-sans tracking-tight">
            DEPRECIATION BIAS
          </div>

          {/* Graphic SVG Illustration */}
          <div className="p-1 pt-5">
            <svg className="w-full h-auto max-h-48 object-cover" viewBox="0 0 540 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="540" y2="280" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0B1E36"/>
                  <stop offset="0.5" stopColor="#1E3A8A"/>
                  <stop offset="1" stopColor="#0284C7"/>
                </linearGradient>
                <linearGradient id="bondGrad" x1="0" y1="0" x2="160" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/>
                  <stop offset="1" stopColor="#F1F5F9"/>
                </linearGradient>
                <linearGradient id="screenGrad" x1="0" y1="0" x2="180" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0284C7"/>
                  <stop offset="1" stopColor="#0369A1"/>
                </linearGradient>
              </defs>

              {/* Background Grid & Lines */}
              <rect width="540" height="280" fill="url(#bgGrad)"/>
              <path d="M0 200 L120 160 L240 180 L360 110 L480 130 L540 90 L540 280 L0 280 Z" fill="white" fillOpacity="0.05"/>
              <path d="M0 200 L120 160 L240 180 L360 110 L480 130 L540 90" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 4"/>

              {/* Sri Lanka Map Silhouette */}
              <g opacity="0.18">
                <path d="M260 50 C270 40, 290 50, 295 70 C300 90, 310 120, 300 150 C290 180, 275 210, 260 200 C250 190, 245 160, 250 120 C255 80, 250 60, 260 50 Z" fill="#E0F2FE"/>
              </g>

              {/* Left: Treasury Bond Certificate */}
              <g transform="translate(20, 35)">
                <rect x="0" y="0" width="155" height="200" rx="3" fill="url(#bondGrad)" stroke="#CBD5E1" strokeWidth="2"/>
                <rect x="6" y="6" width="143" height="188" fill="none" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 3"/>
                <rect x="15" y="15" width="125" height="22" fill="#0B1E36" rx="2"/>
                <text x="77.5" y="29" fill="#F8FAFC" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  FOREIGN HELD RUPEE BONDS
                </text>
                <text x="77.5" y="46" fill="#0369A1" fontSize="7.5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                  SRI LANKA TREASURY
                </text>
                <line x1="20" y1="60" x2="135" y2="60" stroke="#94A3B8" strokeWidth="1"/>
                <line x1="20" y1="70" x2="135" y2="70" stroke="#CBD5E1" strokeWidth="1"/>

                <rect x="12" y="85" width="131" height="52" fill="#F8FAFC" stroke="#E2E8F0" rx="2"/>
                <circle cx="20" cy="98" r="2" fill="#0284C7"/>
                <text x="26" y="100" fill="#334155" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">Foreign Inflow Surge</text>
                <circle cx="20" cy="112" r="2" fill="#0284C7"/>
                <text x="26" y="114" fill="#334155" fontSize="6.5" fontFamily="sans-serif">Rupee Appreciation Bias</text>
                <circle cx="20" cy="126" r="2" fill="#0284C7"/>
                <text x="26" y="128" fill="#334155" fontSize="6.5" fontFamily="sans-serif">Central Bank Absorption</text>

                <circle cx="120" cy="165" r="14" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5"/>
                <circle cx="120" cy="165" r="10" fill="none" stroke="#FEF08A" strokeWidth="1"/>
              </g>

              {/* Right: Money Market Rates Screen */}
              <g transform="translate(310, 40)">
                <rect x="0" y="0" width="205" height="145" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="3"/>
                <rect x="8" y="8" width="189" height="129" rx="4" fill="url(#screenGrad)"/>
                <text x="102.5" y="24" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  CENTRAL BANK INTERVENTIONS
                </text>
                <line x1="20" y1="30" x2="185" y2="30" stroke="#38BDF8" strokeWidth="0.8"/>

                <rect x="16" y="38" width="50" height="34" rx="3" fill="#0F172A" fillOpacity="0.6"/>
                <text x="41" y="50" fill="#38BDF8" fontSize="7" textAnchor="middle" fontFamily="monospace">Spot USD</text>
                <text x="41" y="64" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">328.36</text>

                <rect x="76" y="38" width="50" height="34" rx="3" fill="#0F172A" fillOpacity="0.6"/>
                <text x="101" y="50" fill="#38BDF8" fontSize="7" textAnchor="middle" fontFamily="monospace">SDFR</text>
                <text x="101" y="64" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">8.25%</text>

                <rect x="136" y="38" width="50" height="34" rx="3" fill="#0F172A" fillOpacity="0.6"/>
                <text x="161" y="50" fill="#38BDF8" fontSize="7" textAnchor="middle" fontFamily="monospace">SLFR</text>
                <text x="161" y="64" fill="#EAB308" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">9.25%</text>

                <rect x="16" y="82" width="170" height="42" fill="#0369A1" fillOpacity="0.5" rx="2"/>
                <text x="24" y="96" fill="#E0F2FE" fontSize="7" fontWeight="bold" fontFamily="sans-serif">• Forex Reserve Purchases</text>
                <text x="24" y="110" fill="#E0F2FE" fontSize="7" fontWeight="bold" fontFamily="sans-serif">• Interbank Liquidity Balance</text>
              </g>

              {/* Currency Notes Overlay */}
              <g transform="translate(190, 180)">
                <rect x="0" y="0" width="115" height="58" rx="2" fill="#0F766E" stroke="#2DD4BF" strokeWidth="1" transform="rotate(3)"/>
                <rect x="10" y="5" width="115" height="58" rx="2" fill="#115E59" stroke="#5EEAD4" strokeWidth="1"/>
                <text x="67.5" y="32" fill="#CCFBF1" fontSize="11" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">
                  Rs. 5000
                </text>
                <text x="67.5" y="44" fill="#99F6E4" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                  CENTRAL BANK OF SRI LANKA
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h3
          onClick={() => {
            const forexStory = articles.find(a => 
              a.title.toLowerCase().includes('rupee allowed to appreciate') ||
              a.title.toLowerCase().includes('rupee') || 
              a.title.toLowerCase().includes('dollar') || 
              a.primary_category === 'MARKETS'
            ) || articles[0];
            if (forexStory && onSelectArticle) onSelectArticle(forexStory);
          }}
          className="font-sans text-[15.5px] sm:text-lg lg:text-[19px] font-bold sm:font-extrabold text-[#091527] hover:text-[#0284C7] leading-[1.25] tracking-[-0.01em] transition cursor-pointer pt-1"
        >
          Sri Lanka Rupee Allowed to Appreciate Amid Foreign Bond Buying
        </h3>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200"></div>

      {/* 3. CARD: BONDS / TREASURY BILL AUCTION */}
      <div className="space-y-3">
        {/* Header Box with top yellow/amber bar accent */}
        <div className="bg-[#E0F2FE] relative pt-2 pb-2 px-3 flex items-center justify-between border-t-4 border-[#0284C7]">
          <h3 className="text-lg sm:text-xl font-black text-[#0284C7] uppercase tracking-wider font-sans">
            {language === 'si' ? 'භාණ්ඩාගාර බැඳුම්කර' : language === 'ta' ? 'பிணையங்கள்' : 'BONDS'}
          </h3>
        </div>

        {/* Treasury Bill Auction Table Graphic Widget */}
        <div
          onClick={() => {
            const bondStory = articles.find(a => a.title.toLowerCase().includes('treasury') || a.title.toLowerCase().includes('yield') || a.primary_category === 'MARKETS') || articles[0];
            if (bondStory && onSelectArticle) onSelectArticle(bondStory);
          }}
          className="group cursor-pointer bg-white border border-slate-300 p-2.5 sm:p-3 shadow-2xs hover:border-[#0284C7] transition"
        >
          <div className="text-center font-bold text-slate-900 uppercase tracking-tight text-[10.5px] sm:text-xs mb-2 border-b border-slate-200 pb-1 font-mono">
            TREASURY BILL AUCTION HELD ON 03 SEPTEMBER 2026
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[9.5px] sm:text-[10.5px] font-mono">
              <thead>
                <tr className="bg-[#0B1E36] text-white">
                  <th className="p-1 border border-slate-700">Maturity (Days)</th>
                  <th className="p-1 text-right border border-slate-700">Offered</th>
                  <th className="p-1 text-right border border-slate-700">Accepted</th>
                  <th className="p-1 text-center border border-slate-700">WAYR (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                <tr className="hover:bg-sky-50/50">
                  <td className="p-1 font-bold border border-slate-200">91 Days</td>
                  <td className="p-1 text-right border border-slate-200">40,000</td>
                  <td className="p-1 text-right border border-slate-200">40,000</td>
                  <td className="p-1 text-right font-extrabold text-emerald-700 border border-slate-200">7.62</td>
                </tr>
                <tr className="hover:bg-sky-50/50">
                  <td className="p-1 font-bold border border-slate-200">182 Days</td>
                  <td className="p-1 text-right border border-slate-200">35,000</td>
                  <td className="p-1 text-right border border-slate-200">35,000</td>
                  <td className="p-1 text-right font-extrabold text-emerald-700 border border-slate-200">7.98</td>
                </tr>
                <tr className="hover:bg-sky-50/50">
                  <td className="p-1 font-bold border border-slate-200">364 Days</td>
                  <td className="p-1 text-right border border-slate-200">25,000</td>
                  <td className="p-1 text-right border border-slate-200">25,000</td>
                  <td className="p-1 text-right font-extrabold text-emerald-700 border border-slate-200">8.29</td>
                </tr>
                <tr className="bg-slate-100 font-extrabold text-slate-900">
                  <td className="p-1 border border-slate-300">Total</td>
                  <td className="p-1 text-right border border-slate-300">100,000</td>
                  <td className="p-1 text-right border border-slate-300">100,000</td>
                  <td className="p-1 border border-slate-300 text-center text-[8.5px] text-slate-500 font-normal">
                    Rs. Mn
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Headline */}
        <h3
          onClick={() => {
            const bondStory = articles.find(a => a.title.toLowerCase().includes('treasury') || a.title.toLowerCase().includes('yield') || a.primary_category === 'MARKETS') || articles[0];
            if (bondStory && onSelectArticle) onSelectArticle(bondStory);
          }}
          className="font-sans text-[15.5px] sm:text-lg lg:text-[19px] font-bold sm:font-extrabold text-[#091527] hover:text-[#0284C7] leading-[1.25] tracking-[-0.01em] transition cursor-pointer pt-1"
        >
          Sri Lanka Treasury Bill Yields Rise Across Maturities
        </h3>
      </div>
    </div>
  );
};
