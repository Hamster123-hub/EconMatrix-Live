import React from 'react';
import { StockTicker } from '../types';
import { RefreshCw, TrendingUp, TrendingDown, Radio } from 'lucide-react';

interface TickerBarProps {
  tickers: StockTicker[];
  marketOverview: any;
  onRefreshLive: () => void;
  isLoadingLive: boolean;
}

export const TickerBar: React.FC<TickerBarProps> = ({
  tickers,
  marketOverview,
  onRefreshLive,
  isLoadingLive,
}) => {
  const isMarketOpen = marketOverview?.status?.toLowerCase().includes('open');

  return (
    <div className="bg-[#0B1E36] text-[#F8FAFC] border-b border-[#1E293B] overflow-hidden py-1.5 px-3 sm:px-6 font-mono text-[11px] shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Market Source & Status Badge */}
        <div className="flex items-center gap-2 shrink-0 pr-2 border-r border-slate-700/60">
          <span className="flex items-center gap-1 bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider">
            <Radio className="w-2.5 h-2.5 text-[#38BDF8] animate-pulse" />
            <span>CSE &amp; CBSL LIVE</span>
          </span>

          <span
            className={`hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
              isMarketOpen
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-700/50'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                isMarketOpen ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'
              }`}
            />
            {marketOverview?.status || 'MARKET STATUS'}
          </span>
        </div>

        {/* Marquee or Scrolling Ticker Items */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-5 py-0.5">
          {/* Key ASPI Index Badge */}
          {marketOverview?.aspi && (
            <div className="flex items-center space-x-1.5 bg-[#0F2847] px-2.5 py-0.5 border border-[#1E3A5F] shrink-0">
              <span className="font-extrabold text-[#38BDF8] uppercase tracking-wider">ASPI:</span>
              <span className="font-bold text-white">
                {Number(marketOverview.aspi.last_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center text-[10px] font-extrabold ${
                  marketOverview.aspi.price_change >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {marketOverview.aspi.price_change >= 0 ? '+' : ''}
                {marketOverview.aspi.price_change.toFixed(2)} (
                {marketOverview.aspi.percentage_change >= 0 ? '+' : ''}
                {marketOverview.aspi.percentage_change.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* Key S&P SL20 Index Badge */}
          {marketOverview?.sp_sl20 && (
            <div className="flex items-center space-x-1.5 bg-[#0F2847] px-2.5 py-0.5 border border-[#1E3A5F] shrink-0">
              <span className="font-extrabold text-amber-300 uppercase tracking-wider">S&amp;P SL20:</span>
              <span className="font-bold text-white">
                {Number(marketOverview.sp_sl20.last_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center text-[10px] font-extrabold ${
                  marketOverview.sp_sl20.price_change >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {marketOverview.sp_sl20.price_change >= 0 ? '+' : ''}
                {marketOverview.sp_sl20.price_change.toFixed(2)} (
                {marketOverview.sp_sl20.percentage_change >= 0 ? '+' : ''}
                {marketOverview.sp_sl20.percentage_change.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* Individual Stock & Forex Tickers */}
          {tickers.map((t) => {
            const isPositive = t.price_change >= 0;
            const isForex = t.category === 'CURRENCY' || t.symbol.includes('LKR');
            return (
              <div
                key={t.symbol}
                className="flex items-center space-x-1.5 shrink-0 hover:bg-slate-800/40 px-1.5 py-0.5 rounded transition"
              >
                <span className={`font-bold tracking-wider uppercase ${isForex ? 'text-amber-400' : 'text-slate-300'}`}>
                  {t.symbol}:
                </span>
                <span className="font-mono font-semibold text-white">
                  {t.last_price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center text-[10px] font-bold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  )}
                  {isPositive ? '+' : ''}
                  {t.price_change.toFixed(2)} ({isPositive ? '+' : ''}{t.percentage_change.toFixed(2)}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Refresh Button */}
        <div className="flex items-center space-x-2 shrink-0 pl-2 border-l border-slate-700/60">
          <button
            onClick={onRefreshLive}
            disabled={isLoadingLive}
            className="shrink-0 flex items-center gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] active:bg-[#075985] text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
            title="Fetch live real-time quotes directly from Colombo Stock Exchange (CSE) and Central Bank of Sri Lanka (CBSL)"
          >
            <RefreshCw
              className={`w-3 h-3 text-white ${
                isLoadingLive ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">
              {isLoadingLive ? 'Syncing Feeds...' : 'Sync Live Data'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
