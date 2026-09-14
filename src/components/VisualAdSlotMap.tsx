import React, { useState } from 'react';
import { LANKAECON_AD_SLOTS, AdSlotSpecification } from '../data/adSlotsData';
import { downloadAdSpecPdf } from '../utils/adSpecPdfGenerator';
import { AdCampaign } from '../types';
import {
  FileDown,
  LayoutTemplate,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Eye,
  Megaphone,
  CreditCard,
  Maximize2,
  Info,
} from 'lucide-react';

interface VisualAdSlotMapProps {
  activeAds?: AdCampaign[];
  onSelectSlot?: (slotLocation: string) => void;
  selectedSlot?: string;
  compact?: boolean;
}

export const VisualAdSlotMap: React.FC<VisualAdSlotMapProps> = ({
  activeAds = [],
  onSelectSlot,
  selectedSlot,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'wireframe' | 'table'>('wireframe');
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [selectedSlotModal, setSelectedSlotModal] = useState<AdSlotSpecification | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      downloadAdSpecPdf();
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getSlotActiveAd = (slotKey: string) => {
    if (slotKey === 'feed_inline_1' || slotKey === 'feed_inline') {
      return activeAds.find(
        (a) => (a.slotLocation === 'feed_inline_1' || a.slotLocation === 'feed_inline') && (a.status === 'active' || !a.status)
      );
    }
    return activeAds.find((a) => a.slotLocation === slotKey && (a.status === 'active' || !a.status));
  };

  return (
    <div className="bg-white border-2 border-[#0B1E36] shadow-lg rounded-none overflow-hidden font-sans">
      {/* Top Banner Bar */}
      <div className="bg-[#0B1E36] text-white px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b-2 border-amber-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base uppercase tracking-wider text-white">
                Official Advertising Slot & Placement Architecture
              </h3>
              <span className="bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-xs">
                Isolated Slots
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Clear visual map of all 6 commercial ad placements across LankaEcon digital publication.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Download Official PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider px-4 py-2 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF Map'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('wireframe')}
          className={`pb-2.5 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'wireframe'
              ? 'border-[#0284C7] text-[#0284C7] bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Visual Layout Map</span>
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`pb-2.5 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'table'
              ? 'border-[#0284C7] text-[#0284C7] bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Complete Technical Specs & Rates</span>
        </button>
      </div>

      {activeTab === 'wireframe' ? (
        <div className="p-5 space-y-6">
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-none flex items-start gap-2.5 text-xs text-sky-900">
            <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <p>
              <strong>Strict Slot Isolation Guarantee:</strong> Each advertising box is independent. When you upload an ad to one designated slot (e.g. <em>Top Sidebar</em>), it is displayed strictly in that slot and will <strong>never leak or bleed</strong> into other slots. Click any slot below to view technical details or assign an ad.
            </p>
          </div>

          {/* NEWSPAPER PAGE WIREFRAME CONTAINER */}
          <div className="border-2 border-slate-300 bg-slate-100 p-4 rounded-none shadow-inner max-w-4xl mx-auto space-y-4">
            
            {/* 1. HEADER LEADERBOARD SLOT */}
            {(() => {
              const slot = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === 'header_banner')!;
              const activeAd = getSlotActiveAd('header_banner');
              const isSelected = selectedSlot === 'header_banner';
              const isHovered = hoveredSlot === 'header_banner';

              return (
                <div
                  onMouseEnter={() => setHoveredSlot('header_banner')}
                  onMouseLeave={() => setHoveredSlot(null)}
                  onClick={() => {
                    if (onSelectSlot) onSelectSlot('header_banner');
                    setSelectedSlotModal(slot);
                  }}
                  className={`p-3 border-2 transition cursor-pointer relative overflow-hidden text-center ${
                    isSelected || isHovered
                      ? 'border-sky-500 bg-sky-900 text-white ring-2 ring-sky-400'
                      : 'border-slate-800 bg-[#0B1E36] text-white hover:border-amber-400'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1 px-1">
                    <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-xs">
                      SLOT 1: MASTHEAD SUPER-LEADERBOARD
                    </span>
                    <span className="font-mono text-amber-300">header_banner • 970 x 90 px</span>
                    <span className="text-emerald-300 font-bold">LKR 60,000 / $200 USD</span>
                  </div>
                  <div className="py-2 px-3 bg-black/40 border border-white/10 rounded-xs flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">
                      {activeAd ? `🟢 Live Ad: "${activeAd.title}" (${activeAd.companyName})` : '⚪ Slot Open • Ready for Masthead Sponsor Creative'}
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 uppercase tracking-widest font-extrabold shrink-0">
                      Full Width Top
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Publication Masthead Mockup */}
            <div className="bg-white border border-slate-300 py-2.5 px-4 text-center">
              <h2 className="font-serif font-black text-xl tracking-tight text-slate-900 uppercase">
                LANKAECON INTELLIGENCE NETWORK
              </h2>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                Sri Lanka's Premier Macroeconomic & Business Publication
              </p>
            </div>

            {/* Split Content Columns: Left (68%) / Right Sidebar (32%) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* LEFT / CENTER COLUMN (8 COLS) */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Breaking Updates Ribbon */}
                <div className="bg-rose-50 border border-rose-200 py-1 px-3 text-[10px] font-bold text-rose-800 flex items-center gap-2">
                  <span className="bg-rose-700 text-white px-1.5 py-0.2 uppercase text-[8px] font-black">BREAKING</span>
                  <span>Macroeconomic Intelligence, Inflation & CSE Updates</span>
                </div>

                {/* 2. TOP HERO UPDATES BILLBOARD */}
                {(() => {
                  const slot = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === 'hero_top_updates')!;
                  const activeAd = getSlotActiveAd('hero_top_updates');
                  const isSelected = selectedSlot === 'hero_top_updates';
                  const isHovered = hoveredSlot === 'hero_top_updates';

                  return (
                    <div
                      onMouseEnter={() => setHoveredSlot('hero_top_updates')}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => {
                        if (onSelectSlot) onSelectSlot('hero_top_updates');
                        setSelectedSlotModal(slot);
                      }}
                      className={`p-3 border-2 transition cursor-pointer relative overflow-hidden ${
                        isSelected || isHovered
                          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-400'
                          : 'border-sky-600 bg-sky-100/70 hover:border-sky-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1">
                        <span className="bg-[#0284C7] text-white font-black px-1.5 py-0.5 rounded-xs">
                          SLOT 2: TOP HERO BILLBOARD
                        </span>
                        <span className="font-mono text-sky-900">hero_top_updates • 728 x 90 px</span>
                        <span className="text-emerald-700 font-bold">LKR 45,000 / $150 USD</span>
                      </div>
                      <div className="py-2.5 px-3 bg-white border border-sky-300 rounded-xs flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {activeAd ? `🟢 Live Ad: "${activeAd.title}" (${activeAd.companyName})` : '⚪ Slot Open • High-Visibility Hero Banner Unit'}
                        </span>
                        <span className="text-[9px] bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 uppercase tracking-wider shrink-0">
                          Prime Center
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* News Article Stream Mockup */}
                <div className="bg-white border border-slate-300 p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-xs w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-xs w-full"></div>
                  <div className="h-3 bg-slate-100 rounded-xs w-5/6"></div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                    Editorial Stories #1, #2, #3 • Front-Page Lead Coverage
                  </div>
                </div>

                {/* 4. FEED INLINE EDITORIAL PARTNER BOX #1 */}
                {(() => {
                  const slot = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === 'feed_inline_1') || LANKAECON_AD_SLOTS[3];
                  const activeAd = getSlotActiveAd('feed_inline_1');
                  const isSelected = selectedSlot === 'feed_inline_1' || selectedSlot === 'feed_inline';
                  const isHovered = hoveredSlot === 'feed_inline_1' || hoveredSlot === 'feed_inline';

                  return (
                    <div
                      onMouseEnter={() => setHoveredSlot('feed_inline_1')}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => {
                        if (onSelectSlot) onSelectSlot('feed_inline_1');
                        if (slot) setSelectedSlotModal(slot);
                      }}
                      className={`p-3 border-2 transition cursor-pointer relative overflow-hidden ${
                        isSelected || isHovered
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                          : 'border-emerald-600 bg-emerald-100/70 hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1">
                        <span className="bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-xs">
                          SLOT 4: IN-FEED MPU #1 (MID-FEED)
                        </span>
                        <span className="font-mono text-emerald-900">feed_inline_1 • 300 × 250 px (6:5)</span>
                        <span className="text-emerald-800 font-bold">LKR 35,000 / $120 USD</span>
                      </div>
                      <div className="py-2.5 px-3 bg-white border border-emerald-300 rounded-xs flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {activeAd ? `🟢 Live Ad: "${activeAd.title}" (${activeAd.companyName})` : '⚪ Slot 1 Open • Native In-Feed MPU 300×250 Display'}
                        </span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 uppercase tracking-wider shrink-0">
                          Mid-Feed MPU #1
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Secondary News Stream Mockup */}
                <div className="bg-white border border-slate-300 p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-xs w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded-xs w-full"></div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                    Secondary News Stream • Articles #5, #6, #7
                  </div>
                </div>

                {/* 5. FEED INLINE EDITORIAL PARTNER BOX #2 */}
                {(() => {
                  const slot = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === 'feed_inline_2') || LANKAECON_AD_SLOTS[4];
                  const activeAd = getSlotActiveAd('feed_inline_2');
                  const isSelected = selectedSlot === 'feed_inline_2';
                  const isHovered = hoveredSlot === 'feed_inline_2';

                  return (
                    <div
                      onMouseEnter={() => setHoveredSlot('feed_inline_2')}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => {
                        if (onSelectSlot) onSelectSlot('feed_inline_2');
                        if (slot) setSelectedSlotModal(slot);
                      }}
                      className={`p-3 border-2 transition cursor-pointer relative overflow-hidden ${
                        isSelected || isHovered
                          ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-400'
                          : 'border-teal-600 bg-teal-100/70 hover:border-teal-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1">
                        <span className="bg-teal-700 text-white font-black px-1.5 py-0.5 rounded-xs">
                          SLOT 5: IN-FEED MPU #2 (BOTTOM-FEED)
                        </span>
                        <span className="font-mono text-teal-900">feed_inline_2 • 300 × 250 px (6:5)</span>
                        <span className="text-teal-800 font-bold">LKR 35,000 / $120 USD</span>
                      </div>
                      <div className="py-2.5 px-3 bg-white border border-teal-300 rounded-xs flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {activeAd ? `🟢 Live Ad: "${activeAd.title}" (${activeAd.companyName})` : '⚪ Slot 2 Open • Native In-Feed MPU 300×250 Display'}
                        </span>
                        <span className="text-[9px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 uppercase tracking-wider shrink-0">
                          Bottom-Feed MPU #2
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* "Click For All Stories" Button Mockup */}
                <div className="p-2 bg-slate-100 border border-dashed border-slate-300 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  "Click For All Stories" Button & Full News Archive
                </div>

              </div>

              {/* RIGHT SIDEBAR COLUMN (4 COLS) */}
              <div className="md:col-span-4 space-y-4">
                
                {/* 3. TOP SIDEBAR FEATURED BILLBOARD */}
                {(() => {
                  const slot = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === 'sidebar_top')!;
                  const activeAd = getSlotActiveAd('sidebar_top');
                  const isSelected = selectedSlot === 'sidebar_top';
                  const isHovered = hoveredSlot === 'sidebar_top';

                  return (
                    <div
                      onMouseEnter={() => setHoveredSlot('sidebar_top')}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => {
                        if (onSelectSlot) onSelectSlot('sidebar_top');
                        setSelectedSlotModal(slot);
                      }}
                      className={`p-3 border-2 transition cursor-pointer relative overflow-hidden ${
                        isSelected || isHovered
                          ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-400'
                          : 'border-rose-600 bg-rose-100/70 hover:border-rose-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1">
                        <span className="bg-[#DC2626] text-white font-black px-1.5 py-0.5 rounded-xs">
                          SLOT 3: TOP SIDEBAR
                        </span>
                        <span className="font-mono text-rose-900">sidebar_top</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-bold mb-2">
                        300 x 250 / 300 x 350 px • LKR 50,000 / $170
                      </div>
                      <div className="p-3 bg-white border border-rose-300 rounded-xs space-y-1.5 text-center">
                        <span className="text-xs font-extrabold text-slate-900 block truncate">
                          {activeAd ? `🟢 ${activeAd.title}` : '⚪ Featured Billboard'}
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          Above CSE Stock Ticker
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Stock Ticker & Market Watch Mockup */}
                <div className="bg-slate-900 text-white p-3 space-y-1.5 text-center">
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                    LIVE CSE STOCK TICKER & RATES
                  </div>
                  <div className="text-[9px] text-slate-300">
                    ASPI: 11,842.10 ▲ +45.20 • S&P SL20: 3,490.80
                  </div>
                </div>

                {/* 5. MARKET INTELLIGENCE LOWER SIDEBAR WIDGET */}
                {(() => {
                  const slot = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === 'sidebar_widget')!;
                  const activeAd = getSlotActiveAd('sidebar_widget');
                  const isSelected = selectedSlot === 'sidebar_widget';
                  const isHovered = hoveredSlot === 'sidebar_widget';

                  return (
                    <div
                      onMouseEnter={() => setHoveredSlot('sidebar_widget')}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => {
                        if (onSelectSlot) onSelectSlot('sidebar_widget');
                        setSelectedSlotModal(slot);
                      }}
                      className={`p-3 border-2 transition cursor-pointer relative overflow-hidden ${
                        isSelected || isHovered
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-400'
                          : 'border-purple-600 bg-purple-100/70 hover:border-purple-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider mb-1">
                        <span className="bg-purple-700 text-white font-black px-1.5 py-0.5 rounded-xs">
                          SLOT 6: LOWER SIDEBAR
                        </span>
                        <span className="font-mono text-purple-900">sidebar_widget</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-bold mb-2">
                        300 x 250 px • LKR 30,000 / $100
                      </div>
                      <div className="p-3 bg-white border border-purple-300 rounded-xs space-y-1.5 text-center">
                        <span className="text-xs font-extrabold text-slate-900 block truncate">
                          {activeAd ? `🟢 ${activeAd.title}` : '⚪ Strategic Sidebar Unit'}
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          Beneath CBSL Macro Indicators
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Central Bank Indicators Mockup */}
                <div className="bg-slate-200 border border-slate-300 p-2.5 text-center text-[9px] text-slate-700 font-semibold">
                  CBSL Benchmark Policy Rates & Reserves
                </div>

              </div>

            </div>

          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {LANKAECON_AD_SLOTS.map((s, idx) => (
              <div
                key={s.slotLocation}
                onClick={() => {
                  if (onSelectSlot) onSelectSlot(s.slotLocation);
                  setSelectedSlotModal(s);
                }}
                className="p-3 border border-slate-200 hover:border-[#0284C7] bg-slate-50 hover:bg-white transition cursor-pointer space-y-1 rounded-none shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-sky-700 bg-sky-100 px-1.5 py-0.5">
                    {s.slotLocation}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700">
                    LKR {s.priceLKR.toLocaleString()} / ${s.priceUSD}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{s.displayName}</h4>
                <p className="text-[10px] text-slate-500">{s.recommendedDimensions}</p>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* TABLE MODE */
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0B1E36] text-white uppercase text-[10px] tracking-wider">
                <th className="p-3 border border-slate-700">#</th>
                <th className="p-3 border border-slate-700">Slot Key / Identifier</th>
                <th className="p-3 border border-slate-700">Display Name & Page Position</th>
                <th className="p-3 border border-slate-700">Dimensions (WxH)</th>
                <th className="p-3 border border-slate-700">Allowed Creative Formats</th>
                <th className="p-3 border border-slate-700">Rate (30 Days)</th>
                <th className="p-3 border border-slate-700">Estimated Reach</th>
                <th className="p-3 border border-slate-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {LANKAECON_AD_SLOTS.map((slot, idx) => (
                <tr key={slot.slotLocation} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900 border border-slate-200">{idx + 1}</td>
                  <td className="p-3 border border-slate-200 font-mono font-bold text-sky-700">
                    {slot.slotLocation}
                  </td>
                  <td className="p-3 border border-slate-200">
                    <div className="font-extrabold text-slate-900">{slot.displayName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{slot.pagePositionDescription}</div>
                  </td>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-800">
                    {slot.recommendedDimensions}
                  </td>
                  <td className="p-3 border border-slate-200 text-[11px] text-slate-600">
                    {slot.allowedFormats.join(', ')}
                  </td>
                  <td className="p-3 border border-slate-200 font-extrabold text-emerald-700 whitespace-nowrap">
                    LKR {slot.priceLKR.toLocaleString()} / ${slot.priceUSD} USD
                  </td>
                  <td className="p-3 border border-slate-200 text-slate-600">
                    {slot.estimatedImpressions}
                  </td>
                  <td className="p-3 border border-slate-200 text-center">
                    <button
                      onClick={() => {
                        if (onSelectSlot) onSelectSlot(slot.slotLocation);
                        setSelectedSlotModal(slot);
                      }}
                      className="bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-[10px] uppercase px-3 py-1.5 transition cursor-pointer"
                    >
                      View Specs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SLOT DETAIL MODAL */}
      {selectedSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-black text-sky-700 bg-sky-100 px-2 py-0.5 uppercase">
                  Slot Key: {selectedSlotModal.slotLocation}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedSlotModal.displayName}</h3>
              </div>
              <button
                onClick={() => setSelectedSlotModal(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-bold block mb-1">Visual Hierarchy & Position:</span>
                <p className="font-semibold text-slate-900">{selectedSlotModal.exactPlacementHierarchy}</p>
              </div>
              <div className="bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-bold block mb-1">Recommended Dimensions:</span>
                <p className="font-semibold text-slate-900">{selectedSlotModal.recommendedDimensions}</p>
              </div>
              <div className="bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-bold block mb-1">Standard 30-Day Rate:</span>
                <p className="font-extrabold text-emerald-700 text-sm">
                  LKR {selectedSlotModal.priceLKR.toLocaleString()} / ${selectedSlotModal.priceUSD} USD
                </p>
              </div>
              <div className="bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-bold block mb-1">Estimated Audience Reach:</span>
                <p className="font-semibold text-slate-900">{selectedSlotModal.estimatedImpressions}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-sky-50 border border-sky-200 text-sky-900">
                <strong>Accepted Formats:</strong> {selectedSlotModal.allowedFormats.join(', ')} ({selectedSlotModal.supportedFileTypes}, max {selectedSlotModal.maxFileSize})
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900">
                <strong>Audience Profile & Ideal Advertisers:</strong> {selectedSlotModal.idealAdvertisers}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleDownloadPdf}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF Spec</span>
              </button>
              <button
                onClick={() => {
                  if (onSelectSlot) onSelectSlot(selectedSlotModal.slotLocation);
                  setSelectedSlotModal(null);
                }}
                className="bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2 cursor-pointer"
              >
                Book This Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
