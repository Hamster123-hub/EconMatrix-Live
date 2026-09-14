import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  DollarSign,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Feather,
  Sparkles,
  Newspaper,
  Clock,
  Globe,
  Mail,
  Phone,
  LayoutTemplate,
  Layers,
  UploadCloud,
  Clipboard,
  Trash2,
  MonitorUp,
} from 'lucide-react';
import { StockTicker, AdCampaign, Article } from '../types';
import { ThemeStyle } from './Header';
import { getUIText, translateArticleData } from '../utils/translations';
import { WhatsAppLiveAdBanner } from './WhatsAppLiveAdBanner';
import { BondsForexSidebar } from './BondsForexSidebar';

interface RightSidebarProps {
  onOpenSubscribeModal?: () => void;
  onNavigateToAdCenter?: (pastedImg?: string) => void;
  onNavigateToInkCanvas?: () => void;
  onOpenWhatsAppModal?: () => void;
  marketStories?: Article[];
  articles?: Article[];
  onSelectArticle?: (art: Article) => void;
  themeStyle?: ThemeStyle;
  language?: 'en' | 'si' | 'ta';
}

interface ForexRate {
  currency: string;
  code: string;
  flag: string;
  indicativeRate?: number;
  buyRate: number;
  sellRate: number;
  changePct: number;
  publishedDate?: string;
}

const DEFAULT_FOREX: ForexRate[] = [
  { currency: 'US Dollar', code: 'USD', flag: '🇺🇸', indicativeRate: 328.36, buyRate: 326.40, sellRate: 334.30, changePct: -0.07, publishedDate: '2026-09-04' },
  { currency: 'Euro', code: 'EUR', flag: '🇪🇺', indicativeRate: 381.85, buyRate: 376.50, sellRate: 389.20, changePct: 0.27, publishedDate: '2026-09-04' },
  { currency: 'Pound Sterling', code: 'GBP', flag: '🇬🇧', indicativeRate: 444.39, buyRate: 438.10, sellRate: 453.00, changePct: 0.28, publishedDate: '2026-09-04' },
  { currency: 'Australian Dollar', code: 'AUD', flag: '🇦🇺', indicativeRate: 236.73, buyRate: 232.40, sellRate: 242.10, changePct: 0.54, publishedDate: '2026-09-04' },
  { currency: 'Japanese Yen (100)', code: 'JPY', flag: '🇯🇵', indicativeRate: 210.43, buyRate: 206.93, sellRate: 215.63, changePct: 1.24, publishedDate: '2026-09-04' },
  { currency: 'Singapore Dollar', code: 'SGD', flag: '🇸🇬', indicativeRate: 251.20, buyRate: 249.40, sellRate: 255.40, changePct: 0.08, publishedDate: '2026-09-04' },
  { currency: 'Indian Rupee', code: 'INR', flag: '🇮🇳', indicativeRate: 3.86, buyRate: 3.81, sellRate: 3.96, changePct: 0.02, publishedDate: '2026-09-04' },
  { currency: 'Canadian Dollar', code: 'CAD', flag: '🇨🇦', indicativeRate: 241.35, buyRate: 238.85, sellRate: 245.45, changePct: 0.10, publishedDate: '2026-09-04' },
];

const DEFAULT_STOCKS: StockTicker[] = [
  { ticker_id: 1, symbol: 'JKH.N0000', company_name: 'John Keells Holdings PLC', exchange: 'CSE', last_price: 19.60, price_change: 0.10, percentage_change: 0.51, volume: 964580, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 2, symbol: 'COMB.N0000', company_name: 'Commercial Bank of Ceylon', exchange: 'CSE', last_price: 205.00, price_change: 1.00, percentage_change: 0.49, volume: 890450, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 3, symbol: 'HNB.N0000', company_name: 'Hatton National Bank PLC', exchange: 'CSE', last_price: 380.00, price_change: 2.75, percentage_change: 0.73, volume: 312000, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 4, symbol: 'SAMP.N0000', company_name: 'Sampath Bank PLC', exchange: 'CSE', last_price: 139.75, price_change: 1.00, percentage_change: 0.72, volume: 654300, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 5, symbol: 'DIST.N0000', company_name: 'Distilleries Company of Sri Lanka', exchange: 'CSE', last_price: 38.20, price_change: 0.30, percentage_change: 0.79, volume: 1250000, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 6, symbol: 'LOLC.N0000', company_name: 'LOLC Holdings PLC', exchange: 'CSE', last_price: 470.00, price_change: 4.50, percentage_change: 0.97, volume: 145200, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 7, symbol: 'HAYL.N0000', company_name: 'Hayleys PLC', exchange: 'CSE', last_price: 238.00, price_change: 7.00, percentage_change: 3.03, volume: 410000, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
  { ticker_id: 8, symbol: 'DIAL.N0000', company_name: 'Dialog Axiata PLC', exchange: 'CSE', last_price: 48.50, price_change: 2.00, percentage_change: 4.30, volume: 2150000, is_active: true, last_updated: '2026-09-05T05:00:00Z' },
];

const DEFAULT_SIDE_ADS: AdCampaign[] = [
  {
    id: 'AD-APP-PRIME-01',
    advertiserName: 'Prime Group Marketing',
    advertiserEmail: 'info@primeresidencies.lk',
    companyName: 'Prime Residencies PLC',
    title: 'Mon Viè Thalawathugoda Gardens • Colombo 05',
    tagline: 'Live It Beautifully Now • Floating Sky Restaurant & Cantilevered Viewing Deck',
    businessDescription: 'Ultra-luxury residential suites in Colombo 05. Features Sri Lanka’s first ever rooftop floating sky restaurant.',
    slotLocation: 'sidebar_top',
    category: 'LUXURY REAL ESTATE',
    targetUrl: 'https://primeresidencies.lk',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    adFormat: 'banner', // FULL COMPANY AD BANNER
    phoneNumber: '0702 777 777',
    badgeText: 'COLOMBO 05 EXCLUSIVE RESIDENCES',
    durationDays: 30,
    amountPaid: 95000,
    currency: 'LKR',
    impressionsCount: 48900,
    clicksCount: 3210,
    status: 'active',
    created_at: '2026-08-01T00:00:00.000Z',
  },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onOpenSubscribeModal,
  onNavigateToAdCenter,
  onNavigateToInkCanvas,
  onOpenWhatsAppModal,
  marketStories = [],
  articles = [],
  onSelectArticle,
  themeStyle = 'modern_pro',
  language = 'en',
}) => {
  const [stocks, setStocks] = useState<StockTicker[]>(DEFAULT_STOCKS);
  const [forex, setForex] = useState<ForexRate[]>(DEFAULT_FOREX);
  const [forexViewMode, setForexViewMode] = useState<'indicative' | 'commercial'>('indicative');
  const [forexAsOfDate, setForexAsOfDate] = useState<string>('04 Sep 2026');
  const [stocksFilter, setStocksFilter] = useState<'active' | 'bluechips'>('active');
  const [marketTurnoverText, setMarketTurnoverText] = useState<string>('LKR 2.68 Bn');
  const [marketTradesCount, setMarketTradesCount] = useState<number>(21806);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Live');

  const [aspiData, setAspiData] = useState<{
    last_price: number;
    price_change: number;
    percentage_change: number;
  }>({
    last_price: 21620.44,
    price_change: 225.33,
    percentage_change: 1.05,
  });
  const [snpData, setSnpData] = useState<{
    last_price: number;
    price_change: number;
    percentage_change: number;
  }>({
    last_price: 6058.92,
    price_change: 63.67,
    percentage_change: 1.06,
  });
  const [marketStatus, setMarketStatus] = useState<string>('Market Closed');
  const [sideAds, setSideAds] = useState<AdCampaign[]>(DEFAULT_SIDE_ADS);
  const [loading, setLoading] = useState(false);

  const isVibrant = false;
  const isModern = themeStyle === 'modern_pro';

  useEffect(() => {
    fetchData(false);
    // Auto-refresh every 60 seconds to maintain real-time updates for active site visitors
    const interval = setInterval(() => {
      fetchData(false);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isManual = false) => {
    setLoading(true);
    try {
      if (isManual) {
        fetch('/api/market/sync', { method: 'POST' }).catch(() => {});
      }

      // 1. Fetch Stocks & Market Indices (CSE Live)
      try {
        const stockRes = await fetch(isManual ? '/api/market/stocks?refresh=true' : '/api/market/stocks');
        if (stockRes.ok) {
          const stockData = await stockRes.json();
          if (stockData.success) {
            if (Array.isArray(stockData.stocks) && stockData.stocks.length > 0) {
              setStocks(stockData.stocks);
            }
            if (stockData.aspi) {
              setAspiData({
                last_price: Number(stockData.aspi.last_price || 21620.44),
                price_change: Number(stockData.aspi.price_change || 225.33),
                percentage_change: Number(stockData.aspi.percentage_change || 1.05),
              });
            }
            if (stockData.sp_sl20 || stockData.snp) {
              const snp = stockData.sp_sl20 || stockData.snp;
              setSnpData({
                last_price: Number(snp.last_price || 6058.92),
                price_change: Number(snp.price_change || 63.67),
                percentage_change: Number(snp.percentage_change || 1.06),
              });
            }
            if (stockData.status) {
              setMarketStatus(stockData.status);
            }
            if (stockData.marketOverview) {
              if (stockData.marketOverview.turnover_lkr) {
                const bn = (stockData.marketOverview.turnover_lkr / 1000000000).toFixed(2);
                setMarketTurnoverText(`LKR ${bn} Bn`);
              }
              if (stockData.marketOverview.number_of_trades) {
                setMarketTradesCount(Number(stockData.marketOverview.number_of_trades));
              }
            }
          }
        }
      } catch (e) {
        // use default stocks fallback
      }

      // 2. Fetch Forex (CBSL Indicative Live)
      try {
        const forexRes = await fetch(isManual ? '/api/market/forex?refresh=true' : '/api/market/forex');
        if (forexRes.ok) {
          const forexData = await forexRes.json();
          if (forexData.success && Array.isArray(forexData.rates) && forexData.rates.length > 0) {
            setForex(forexData.rates);
            if (forexData.asOfDate) {
              setForexAsOfDate(forexData.asOfDate);
            } else if (forexData.rates[0]?.publishedDate) {
              setForexAsOfDate(forexData.rates[0].publishedDate);
            }
          }
        }
      } catch (e) {
        // use default forex fallback
      }

      // 3. Fetch Ads
      try {
        const adsRes = await fetch('/api/ads');
        if (adsRes.ok) {
          const adsData = await adsRes.json();
          if (adsData.success && Array.isArray(adsData.ads) && adsData.ads.length > 0) {
            setSideAds(adsData.ads);
          }
        }
      } catch (e) {
        // use default ads fallback
      }

      setLastSyncedTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      // safe fallback maintained
    } finally {
      setLoading(false);
    }
  };

  const [sidebarPastedBanner, setSidebarPastedBanner] = useState<string | null>(null);
  const [sidebarPastedName, setSidebarPastedName] = useState<string | null>(null);
  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const [showQuickDropTester, setShowQuickDropTester] = useState(false);
  const sidebarFileInputRef = useRef<HTMLInputElement>(null);

  const processSidebarImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select or paste an image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        setSidebarPastedBanner(res);
        setSidebarPastedName(file.name || 'Desktop Banner Creative');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSidebarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSidebarDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSidebarImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSidebarPasteFromClipboard = async () => {
    try {
      if (navigator.clipboard?.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], 'sidebar-pasted-banner.png', { type: imageType });
            processSidebarImageFile(file);
            return;
          }
        }
      }
      alert('To paste an ad banner, open the Advertise Center or drag-and-drop your image file directly onto this sidebar ad slot.');
    } catch {
      alert('To paste an ad banner, open the Advertise Center or drag-and-drop your image file directly onto this sidebar ad slot.');
    }
  };

  const handleToggleAdFormat = async (adId: string) => {
    setSideAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const newFmt = ad.adFormat === 'banner' ? 'card' : 'banner';
          return { ...ad, adFormat: newFmt, isFullBanner: newFmt === 'banner' };
        }
        return ad;
      })
    );

    try {
      await fetch('/api/ads/toggle-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adId }),
      });
    } catch {}
  };

  const handleAdClick = async (adId: string, url: string) => {
    try {
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adId }),
      });
    } catch {}
    if (url) window.open(url, '_blank');
  };

  // Top ad determination: strictly isolated to sidebar_top
  const topAd =
    sideAds.find((a) => a.slotLocation === 'sidebar_top' && (a.status === 'active' || !a.status)) ||
    DEFAULT_SIDE_ADS.find((a) => a.slotLocation === 'sidebar_top') ||
    DEFAULT_SIDE_ADS[0];

  // Lower sidebar widget determination: strictly isolated to sidebar_widget or sidebar_bottom
  const displayBottomAds = sideAds.filter(
    (a) =>
      a.id !== topAd?.id &&
      (a.slotLocation === 'sidebar_widget' || a.slotLocation === 'sidebar_bottom') &&
      (a.status === 'active' || !a.status)
  );

  return (
    <aside className="w-full md:w-72 lg:w-80 shrink-0 space-y-6 font-sans">
      
      {/* TOP FEATURED SPONSOR ADVERTISEMENT (SUPPORTS FULL BANNER CREATIVE & STRUCTURED CARD FORMATS) */}
      {topAd && (
        <div className="relative group">
          {topAd.adFormat === 'banner' ? (
            /* FULL BANNER CREATIVE FORMAT - CLEAN EDGE-TO-EDGE GRAPHIC POSTER */
            <div
              onClick={() => handleAdClick(topAd.id, topAd.targetUrl)}
              className="border-2 border-[#0B1E36] hover:border-[#0284C7] shadow-lg transition cursor-pointer rounded-lg overflow-hidden relative group/banner bg-slate-900"
            >
              {/* Full Graphic Ad Banner Image */}
              <div className="w-full relative overflow-hidden bg-slate-900">
                <img
                  src={topAd.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                  alt={topAd.title}
                  className="w-full h-auto min-h-[180px] max-h-[420px] object-cover group-hover/banner:scale-[1.01] transition duration-500 block"
                />
                {topAd.badgeText && (
                  <span className="absolute top-2 left-2 bg-black/85 backdrop-blur-xs text-amber-300 border border-amber-500/60 text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs shadow-md">
                    {topAd.badgeText}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* STANDARD STRUCTURED CARD FORMAT */
            <div
              onClick={() => handleAdClick(topAd.id, topAd.targetUrl)}
              className="bg-white border-2 border-[#0B1E36] hover:border-[#0284C7] p-3.5 shadow-md transition cursor-pointer group space-y-2 rounded-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="bg-[#DC2626] text-white text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs flex items-center gap-1">
                  <Megaphone className="w-3 h-3" />
                  {getUIText('featuredSponsor', language)}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{topAd.companyName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAdFormat(topAd.id);
                    }}
                    title="Switch format to Full Creative Banner"
                    className="text-[9px] font-semibold text-slate-600 hover:text-blue-700 px-1 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-xs border border-slate-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Layers className="w-2.5 h-2.5" />
                    <span>Banner</span>
                  </button>
                </div>
              </div>

              {topAd.imageUrl && (
                <div className="w-full h-36 bg-slate-100 overflow-hidden relative border border-slate-200 rounded-xs">
                  <img
                    src={topAd.imageUrl}
                    alt={topAd.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                    {topAd.category || 'EXPORTS'}
                  </span>
                </div>
              )}

              <div>
                <h4 className="font-extrabold text-xs text-[#0B1E36] group-hover:text-[#0284C7] transition leading-snug">
                  {topAd.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 font-medium">
                  {topAd.tagline || topAd.businessDescription}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-extrabold text-[#0284C7] pt-1.5 border-t border-slate-100">
                {topAd.phoneNumber ? (
                  <span className="text-slate-700 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {topAd.phoneNumber}
                  </span>
                ) : (
                  <span className="uppercase tracking-wider">{getUIText('visit', language)} {topAd.companyName}</span>
                )}
                <span className="flex items-center gap-1 uppercase tracking-wider">
                  <span>Visit</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. LIVE LKR FOREIGN EXCHANGE RATES TABLE (PROMINENT RIGHT SIDEBAR) */}
      <div className={`p-4 space-y-3 transition shadow-2xs rounded-lg ${
        isVibrant 
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-400 text-white' 
          : isModern
          ? 'bg-white border border-slate-200 text-slate-900'
          : 'bg-white border-2 border-[#0B1E36] text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex justify-between items-center border-b pb-2 ${isVibrant ? 'border-cyan-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-1.5">
            <DollarSign className={`w-4 h-4 ${isVibrant ? 'text-cyan-300' : 'text-[#0284C7]'}`} />
            <div>
              <h3 className={`font-extrabold text-xs uppercase tracking-wider ${isVibrant ? 'text-cyan-200' : 'text-[#0B1E36]'}`}>
                {getUIText('lkrRates', language)}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
              CBSL
            </span>
            <button
              onClick={() => fetchData(true)}
              disabled={loading}
              className={`${isVibrant ? 'text-cyan-400 hover:text-white' : 'text-slate-400 hover:text-[#0284C7]'} transition cursor-pointer p-1 rounded-xs hover:bg-slate-100`}
              title="Refresh Central Bank Exchange Rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0284C7]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mode Selector & As-Of Date */}
        <div className="flex items-center justify-between gap-1 text-[10px]">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xs border border-slate-200">
            <button
              onClick={() => setForexViewMode('indicative')}
              className={`px-2 py-0.5 font-bold rounded-2xs transition cursor-pointer ${
                forexViewMode === 'indicative'
                  ? 'bg-white text-[#0B1E36] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Indicative Spot
            </button>
            <button
              onClick={() => setForexViewMode('commercial')}
              className={`px-2 py-0.5 font-bold rounded-2xs transition cursor-pointer ${
                forexViewMode === 'commercial'
                  ? 'bg-white text-[#0B1E36] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bank Buy/Sell
            </button>
          </div>
          <span className="text-[9px] font-mono text-slate-400">
            {forexAsOfDate}
          </span>
        </div>

        {/* Forex Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`uppercase font-bold text-[10px] border-b ${
                isVibrant 
                  ? 'bg-slate-800/80 text-cyan-200 border-cyan-900' 
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                <th className="py-1.5 px-2">{language === 'si' ? 'මුදල් වර්ගය' : language === 'ta' ? 'நாணயம்' : 'Currency'}</th>
                {forexViewMode === 'indicative' ? (
                  <>
                    <th className="py-1.5 px-1 text-right">CBSL Spot (LKR)</th>
                    <th className="py-1.5 px-1 text-right">24h Chg</th>
                  </>
                ) : (
                  <>
                    <th className="py-1.5 px-1 text-right">{getUIText('buyRate', language)}</th>
                    <th className="py-1.5 px-1 text-right">{getUIText('sellRate', language)}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${isVibrant ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {forex.map((fx) => {
                const indicative = fx.indicativeRate ?? Number(((fx.buyRate + fx.sellRate) / 2).toFixed(2));
                const isUp = (fx.changePct || 0) >= 0;
                return (
                  <tr key={fx.code} className={`transition ${isVibrant ? 'hover:bg-cyan-950/40' : 'hover:bg-slate-50'}`}>
                    <td className={`py-1.5 px-2 font-bold font-sans flex items-center gap-1.5 ${isVibrant ? 'text-white' : 'text-slate-900'}`}>
                      <span>{fx.flag}</span>
                      <span>{fx.code}</span>
                    </td>
                    {forexViewMode === 'indicative' ? (
                      <>
                        <td className={`py-1.5 px-1 text-right font-bold ${isVibrant ? 'text-white' : 'text-slate-900'}`}>
                          {indicative.toFixed(2)}
                        </td>
                        <td className={`py-1.5 px-1 text-right font-bold text-[10px] ${
                          isUp ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {isUp ? '+' : ''}{(fx.changePct || 0).toFixed(2)}%
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={`py-1.5 px-1 text-right font-bold ${isVibrant ? 'text-slate-200' : 'text-slate-800'}`}>
                          {fx.buyRate.toFixed(2)}
                        </td>
                        <td className={`py-1.5 px-1 text-right font-bold ${isVibrant ? 'text-cyan-300' : 'text-[#0284C7]'}`}>
                          {fx.sellRate.toFixed(2)}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={`text-[9px] font-mono text-center ${isVibrant ? 'text-cyan-300/70' : 'text-slate-500'}`}>
          Direct CBSL feed • Official Daily Exchange Rates
        </p>
      </div>

      {/* 3. SUBSCRIBER BANNER CALLOUT */}
      <div className="bg-gradient-to-br from-[#0B1E36] to-[#0284C7] text-white p-5 border border-slate-800 shadow-2xs space-y-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="bg-[#DC2626] text-white font-black text-[9px] uppercase px-2 py-0.5 tracking-widest rounded-xs">
            PRO ACCESS
          </span>
          <span className="text-amber-300 font-mono text-[10px]">LKR 1,500/MO</span>
        </div>
        <h4 className="font-extrabold text-base leading-snug">
          Subscribe for Full Unrestricted LankaEcon Dispatches
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed">
          Get complete access to paywalled analysis, breaking CSE market reports, and daily WhatsApp dispatches.
        </p>
        <button
          onClick={onOpenSubscribeModal}
          className="w-full bg-white hover:bg-slate-100 text-[#0B1E36] font-extrabold py-2.5 text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md rounded-xs"
        >
          <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          <span>Subscribe Now</span>
        </button>
      </div>

      {/* 4. COLOMBO STOCK EXCHANGE (CSE) LIVE WIDGET */}
      <div className={`p-4 space-y-3 transition shadow-2xs rounded-lg ${
        isVibrant 
          ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-2 border-emerald-500/60 text-white' 
          : isModern
          ? 'bg-white border border-slate-200 text-slate-900'
          : 'bg-white border-2 border-[#0B1E36] text-slate-900'
      }`}>
        <div className={`flex justify-between items-center border-b pb-2 ${isVibrant ? 'border-emerald-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-1.5">
            <TrendingUp className={`w-4 h-4 ${isVibrant ? 'text-emerald-400' : 'text-[#0284C7]'}`} />
            <h3 className={`font-extrabold text-xs uppercase tracking-wider ${isVibrant ? 'text-emerald-300' : 'text-[#0B1E36]'}`}>
              Colombo Stock Exchange (CSE)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-xs border ${
                marketStatus?.toLowerCase().includes('open')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  marketStatus?.toLowerCase().includes('open') ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              {marketStatus || 'Market Closed'}
            </span>
            <button
              onClick={() => fetchData(true)}
              disabled={loading}
              className={`${isVibrant ? 'text-emerald-400 hover:text-white' : 'text-slate-400 hover:text-[#0284C7]'} transition cursor-pointer p-1 rounded-xs hover:bg-slate-100`}
              title="Refresh CSE Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0284C7]' : ''}`} />
            </button>
          </div>
        </div>

        {/* CSE Main Indices Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className={`p-2 border rounded-xs ${isVibrant ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[10px] font-sans font-bold uppercase block ${isVibrant ? 'text-slate-400' : 'text-slate-500'}`}>ASPI Index</span>
            <span className={`text-sm font-extrabold ${isVibrant ? 'text-white' : 'text-slate-900'}`}>
              {aspiData.last_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[10px] font-bold block ${aspiData.percentage_change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {aspiData.percentage_change >= 0 ? '+' : ''}{aspiData.percentage_change.toFixed(2)}% ({aspiData.price_change >= 0 ? '+' : ''}{aspiData.price_change.toFixed(2)} pts)
            </span>
          </div>

          <div className={`p-2 border rounded-xs ${isVibrant ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[10px] font-sans font-bold uppercase block ${isVibrant ? 'text-slate-400' : 'text-slate-500'}`}>S&P SL20</span>
            <span className={`text-sm font-extrabold ${isVibrant ? 'text-white' : 'text-slate-900'}`}>
              {snpData.last_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[10px] font-bold block ${snpData.percentage_change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {snpData.percentage_change >= 0 ? '+' : ''}{snpData.percentage_change.toFixed(2)}% ({snpData.price_change >= 0 ? '+' : ''}{snpData.price_change.toFixed(2)} pts)
            </span>
          </div>
        </div>

        {/* CSE Turnover Strip */}
        <div className="flex items-center justify-between text-[10px] font-mono bg-slate-50 px-2 py-1.5 border border-slate-200 rounded-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">Turnover:</span>
            <span className="font-bold text-slate-800">{marketTurnoverText}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">Trades:</span>
            <span className="font-bold text-slate-800">{marketTradesCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Stocks Filter Selector */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-1 pt-0.5">
          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={() => setStocksFilter('active')}
              className={`px-2 py-0.5 font-bold rounded-2xs transition cursor-pointer ${
                stocksFilter === 'active'
                  ? 'bg-[#0B1E36] text-white'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Top Active Traded
            </button>
            <button
              onClick={() => setStocksFilter('bluechips')}
              className={`px-2 py-0.5 font-bold rounded-2xs transition cursor-pointer ${
                stocksFilter === 'bluechips'
                  ? 'bg-[#0B1E36] text-white'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Blue Chips
            </button>
          </div>
          <span className="text-[9px] font-mono text-slate-400">
            {stocks.length} equities
          </span>
        </div>

        {/* Stock Equities List */}
        <div className="space-y-1.5 pt-1">
          {(stocksFilter === 'bluechips' ? DEFAULT_STOCKS : stocks).slice(0, 8).map((stock) => {
            const isUp = stock.price_change >= 0;
            return (
              <div
                key={stock.symbol}
                className={`flex items-center justify-between p-2 border transition text-xs font-mono rounded-xs ${
                  isVibrant
                    ? 'bg-slate-950/80 border-slate-800 hover:bg-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div>
                  <span className={`font-bold font-sans block ${isVibrant ? 'text-white' : 'text-[#0B1E36]'}`}>{stock.symbol}</span>
                  <span className={`text-[9px] font-sans truncate max-w-[120px] block ${isVibrant ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stock.company_name}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`font-bold block ${isVibrant ? 'text-white' : 'text-slate-900'}`}>LKR {stock.last_price.toFixed(2)}</span>
                  <span
                    className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                      isUp ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isUp ? '+' : ''}{stock.percentage_change.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. INK & CANVAS LITERARY ATELIER ADVERTISEMENT BANNER HIDDEN FOR NOW
      <div className="bg-gradient-to-br from-[#2A1810] via-[#4A2612] to-[#0B1E36] text-amber-100 p-5 border-2 border-[#D4A373] shadow-md space-y-3 relative overflow-hidden rounded-lg">
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
          <span className="bg-[#991B1B] text-amber-100 font-extrabold text-[9px] uppercase tracking-widest px-2 py-0.5 border border-amber-400/40 flex items-center gap-1 rounded-xs">
            <Feather className="w-3 h-3 text-amber-300" />
            FEATURED CULTURAL ATELIER
          </span>
          <span className="text-amber-300 text-[10px] font-serif italic">Sri Lankan Fine Arts</span>
        </div>

        <div className="space-y-1">
          <h4 className="font-serif font-bold text-base text-[#FAF7F2] leading-snug">
            Discover Lanka Ink & Canvas
          </h4>
          <p className="text-xs text-amber-100/90 font-serif leading-relaxed">
            Explore rare Sri Lankan books, poetry anthologies, video podcasts, and critical essays by master Sri Lankan creators.
          </p>
        </div>

        <button
          onClick={onNavigateToInkCanvas}
          className="w-full bg-[#D4A373] hover:bg-amber-500 text-slate-950 font-serif font-bold py-2.5 text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border border-amber-200 rounded-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore Ink & Canvas Atelier</span>
        </button>
      </div>
      */}

      {/* 6. LIVE WHATSAPP BROADCAST CHANNEL AD (THIN & TALL SIDEBAR UNIT WITH DRAMATIC POPPING PHONE) */}
      <WhatsAppLiveAdBanner language={language} onOpenWhatsAppModal={onOpenWhatsAppModal} />

      {/* 7. RIGHT-HAND SIDE ADVERTISING SPACE (Econ Matrix & Sponsored Ads) */}
      <div className="space-y-4">
        {/* ECON MATRIX STAY INFORMED BANNER */}
        <div className="bg-gradient-to-b from-[#F0F5FA] via-[#E4EFF8] to-[#0A2540] border-2 border-[#0A2540] rounded-xl overflow-hidden shadow-lg p-5 text-center space-y-3 relative group">
          <div className="flex items-center justify-center gap-1.5 font-sans font-black text-2xl tracking-tight text-[#0284C7]">
            <span>ECON</span>
            <span className="text-[#0A2540]">MATRIX</span>
          </div>

          <div className="space-y-1">
            <h4 className="font-sans font-extrabold text-lg sm:text-xl text-[#0A2540] leading-tight">
              Stay informed. Stay ahead.
            </h4>
            <div className="w-8 h-1 bg-amber-400 mx-auto rounded-full my-1.5" />
            <p className="text-xs font-bold text-slate-700">
              Share your email and we'll share the latest news
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Exclusive economic intelligence, political and business coverage
            </p>
          </div>

          {/* Feature Badges Icons */}
          <div className="flex justify-center items-center gap-4 py-1 text-[#0A2540]">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
              <Globe className="w-4 h-4 text-[#0284C7]" />
            </div>
          </div>

          {/* REAL LAPTOP & MOBILE PHONE MULTI-DEVICE EMAIL SHOWCASE */}
          <div className="relative py-2 px-1 flex justify-center items-center select-none">
            <div className="relative w-full max-w-[290px] h-[160px] flex items-center justify-center">
              
              {/* LAPTOP (Desktop Morning Email Dispatch) */}
              <div className="absolute left-1 top-0 w-[205px] sm:w-[215px] transition-transform duration-300 group-hover:scale-102 z-0">
                {/* Laptop Display Lid & Bezel */}
                <div className="bg-[#0F172A] rounded-t-lg p-1.5 pb-2 shadow-2xl border border-slate-700">
                  {/* Laptop Camera dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mx-auto mb-1 border border-slate-700/80" />
                  
                  {/* Laptop Screen Area: Real Email Newsletter Interface */}
                  <div className="bg-white rounded-xs overflow-hidden h-[98px] flex flex-col text-left border border-slate-200 shadow-inner">
                    {/* Email App Header Bar */}
                    <div className="bg-[#0B1E36] px-2 py-1 flex items-center justify-between text-[7.5px] text-white">
                      <div className="flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5 text-amber-400" />
                        <span className="font-bold font-sans tracking-wide">LankaEcon Dispatch</span>
                      </div>
                      <span className="text-[6.5px] bg-[#0284C7] px-1 py-0.2 rounded-xs font-mono font-bold">INBOX</span>
                    </div>

                    {/* Email Body Preview */}
                    <div className="p-1.5 space-y-1 bg-[#F8FAFC] flex-1 overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                        <div>
                          <p className="text-[7.5px] font-black text-slate-900 leading-tight">Morning Intelligence Brief</p>
                          <p className="text-[6px] text-slate-500 font-mono">From: briefing@lankaecon.com</p>
                        </div>
                        <span className="text-[6px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded-xs">7:00 AM</span>
                      </div>
                      <div className="space-y-0.5 text-[6.5px] text-slate-700 leading-tight">
                        <p className="font-bold text-[#0284C7]">• Central Bank policy corridor rates</p>
                        <p className="line-clamp-2 text-slate-500 text-[6px]">ASPI +54.2 pts, Treasury yields ease as trade volume surges...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Keyboard Base & Hinge */}
                <div className="relative bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 h-2.5 rounded-b-md shadow-md flex items-center justify-center border-t border-slate-300">
                  <div className="w-10 h-0.5 bg-slate-500 rounded-full" />
                </div>
              </div>

              {/* SMARTPHONE (Mobile Email Inbox View - Overlapping on the right) */}
              <div className="absolute right-0 bottom-0 w-[84px] transition-transform duration-300 group-hover:scale-106 group-hover:-translate-y-1 z-10">
                <div className="bg-[#0B132B] rounded-[14px] p-1 shadow-2xl border-2 border-slate-600 flex flex-col">
                  {/* Dynamic Island Notch */}
                  <div className="w-5 h-1 bg-black rounded-full mx-auto mb-0.5" />
                  
                  {/* Mobile Screen Display */}
                  <div className="bg-gradient-to-b from-white to-slate-50 rounded-[10px] p-1 h-[112px] flex flex-col justify-between overflow-hidden border border-slate-200 text-left">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-[5.5px] font-bold text-slate-700 px-0.5">
                      <span>9:41</span>
                      <span>5G 100%</span>
                    </div>

                    {/* Mobile Incoming Email Notification Card */}
                    <div className="bg-sky-50 p-1 rounded-xs border border-[#0284C7]/40 shadow-xs space-y-0.5">
                      <div className="flex items-center gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7] flex items-center justify-center">
                          <Mail className="w-1.5 h-1.5 text-white" />
                        </div>
                        <span className="text-[5.5px] font-extrabold text-[#0B1E36]">LANKAECON</span>
                      </div>
                      <p className="text-[5.5px] font-black text-slate-900 leading-tight">Daily Morning Brief</p>
                      <p className="text-[5px] text-slate-500 leading-tight">Market moves & key rates</p>
                    </div>

                    {/* Mini Market Bar */}
                    <div className="bg-[#0B1E36] text-white px-1 py-0.5 rounded-xs text-[5px] font-mono flex items-center justify-between">
                      <span>ASPI</span>
                      <span className="text-emerald-400 font-bold">+0.84%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Delivery Callout Banner */}
          <div className="bg-[#0284C7] text-white py-1.5 px-3 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow-xs inline-flex items-center gap-1.5">
            <span>DELIVERED STRAIGHT TO YOUR INBOX</span>
          </div>

          {/* Subscribe CTA Button */}
          <div className="pt-1">
            <button
              onClick={onOpenSubscribeModal}
              className="w-full bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-full shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 border border-sky-300"
            >
              <span>SUBSCRIBE NOW</span>
              <span className="w-4 h-4 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px]">→</span>
            </button>
          </div>
        </div>

        {/* SPONSORED ADVERTISEMENTS CONTAINER (SUPPORTS FULL BANNER CREATIVE & STRUCTURED CARD FORMATS) */}
        <div className={`p-4 text-slate-900 space-y-4 rounded-lg border-2 border-dashed ${
          isVibrant ? 'bg-slate-950/80 border-indigo-900 text-white' : 'bg-slate-50 border-slate-300'
        }`}>
          {/* Top of Sponsored Ads Header with Quick Desktop Drop Tester Toggle */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-[#DC2626]" />
              <h3 className={`font-extrabold text-xs uppercase tracking-wider ${isVibrant ? 'text-amber-300' : 'text-[#0B1E36]'}`}>
                Sponsored Advertisements
              </h3>
            </div>
            <button
              onClick={() => setShowQuickDropTester(!showQuickDropTester)}
              title="Test pasting or dropping your desktop image banner on the live sidebar"
              className="text-[9px] text-[#0284C7] hover:text-sky-800 font-bold uppercase flex items-center gap-1 cursor-pointer bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200"
            >
              <UploadCloud className="w-2.5 h-2.5" />
              <span>{showQuickDropTester ? 'Close Tester' : 'Paste / Drop Ad'}</span>
            </button>
          </div>

          {/* Quick Drop & Paste Banner Tester Area */}
          {showQuickDropTester && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsSidebarDragging(true);
              }}
              onDragLeave={() => setIsSidebarDragging(false)}
              onDrop={handleSidebarDrop}
              className={`p-3 rounded-lg border-2 border-dashed text-center space-y-2 transition ${
                isSidebarDragging ? 'border-sky-500 bg-sky-100/80' : 'border-slate-300 bg-white'
              }`}
            >
              <input
                type="file"
                ref={sidebarFileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    processSidebarImageFile(e.target.files[0]);
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-1">
                <MonitorUp className="w-5 h-5 text-[#0284C7]" />
                <p className="text-[11px] font-bold text-slate-800">
                  Drop an image banner from desktop here to preview live
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleSidebarPasteFromClipboard}
                    className="bg-[#0B1E36] hover:bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Clipboard className="w-2.5 h-2.5 text-amber-400" />
                    <span>Paste (Ctrl+V)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sidebarFileInputRef.current?.click()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[9px] font-bold px-2 py-1 rounded border border-slate-300 cursor-pointer"
                  >
                    Browse File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If user dropped/pasted a test banner, show live banner preview right on sidebar without black bars */}
          {sidebarPastedBanner && (
            <div className="border-2 border-amber-500 rounded-lg overflow-hidden shadow-lg space-y-0 relative animate-fadeIn group/testbanner bg-slate-900">
              <div className="w-full relative overflow-hidden bg-slate-900 max-h-[340px]">
                <img
                  src={sidebarPastedBanner}
                  alt="Pasted desktop banner preview"
                  className="w-full h-auto min-h-[140px] max-h-[340px] object-cover block"
                />
                <button
                  onClick={() => setSidebarPastedBanner(null)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer transition shadow-md"
                  title="Remove test preview"
                >
                  ✕
                </button>
                <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-90 group-hover/testbanner:opacity-100 transition">
                  <span className="bg-black/80 backdrop-blur-xs text-amber-300 text-[8px] font-mono font-bold px-2 py-0.5 rounded-xs truncate max-w-[150px]">
                    {sidebarPastedName || 'Desktop Asset'}
                  </span>
                  <button
                    onClick={() => {
                      if (onNavigateToAdCenter) onNavigateToAdCenter(sidebarPastedBanner);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] px-2.5 py-1 uppercase rounded-xs cursor-pointer shadow-md"
                  >
                    Publish Ad →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display Side Ads */}
          {displayBottomAds.length > 0 ? (
            <div className="space-y-4">
              {displayBottomAds.map((ad) => (
                <div key={ad.id} className="relative group">
                  {ad.adFormat === 'banner' ? (
                    /* FULL BANNER FORMAT FOR BOTTOM AD - CLEAN EDGE-TO-EDGE GRAPHIC POSTER */
                    <div
                      onClick={() => handleAdClick(ad.id, ad.targetUrl)}
                      className="border border-slate-300 hover:border-[#0284C7] shadow-md transition cursor-pointer rounded-lg overflow-hidden relative group/bcard bg-slate-900"
                    >
                      <div className="w-full relative overflow-hidden bg-slate-900">
                        <img
                          src={ad.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                          alt={ad.title}
                          className="w-full h-auto min-h-[160px] max-h-[380px] object-cover group-hover/bcard:scale-[1.01] transition duration-500 block"
                        />
                        {ad.badgeText && (
                          <span className="absolute top-1.5 left-1.5 bg-black/85 text-amber-300 text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider rounded-xs shadow-xs">
                            {ad.badgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* STRUCTURED CARD FORMAT FOR BOTTOM AD */
                    <div
                      onClick={() => handleAdClick(ad.id, ad.targetUrl)}
                      className="bg-white border border-slate-200 hover:border-[#0284C7] p-3 shadow-xs transition cursor-pointer group space-y-2 rounded-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="bg-[#DC2626] text-white text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                          {ad.category || 'FEATURED AD'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{ad.companyName}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAdFormat(ad.id);
                            }}
                            title="Switch format to Banner View"
                            className="text-[8px] font-semibold text-slate-600 hover:text-blue-700 px-1 py-0.2 bg-slate-100 rounded-xs border border-slate-300 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Layers className="w-2 h-2" />
                            <span>Banner</span>
                          </button>
                        </div>
                      </div>

                      {ad.imageUrl && (
                        <div className="w-full h-32 bg-slate-100 overflow-hidden relative border border-slate-200 rounded-xs">
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-[#0B1E36] group-hover:text-[#0284C7] transition leading-snug">
                          {ad.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                          {ad.tagline || ad.businessDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-[#0284C7] pt-1 border-t border-slate-100">
                        {ad.phoneNumber ? (
                          <span className="text-slate-700 flex items-center gap-1 font-mono text-[9px]">
                            <Phone className="w-2.5 h-2.5 text-emerald-600" />
                            {ad.phoneNumber}
                          </span>
                        ) : (
                          <span>Visit {ad.companyName}</span>
                        )}
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 text-center border border-slate-200 space-y-2 rounded-xs">
              <p className="text-xs font-bold text-slate-800">Promote Your Enterprise Here</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Reach over 250,000 corporate leaders, economists, and investors across Sri Lanka.
              </p>
            </div>
          )}

          {/* Advertise Call to Action Button */}
          <button
            onClick={onNavigateToAdCenter}
            className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-extrabold py-2.5 text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs rounded-xs"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Advertise On LankaEcon</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
