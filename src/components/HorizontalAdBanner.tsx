import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../utils/translations';
import { AdCampaign, AdSlotLocation } from '../types';

interface HorizontalAdBannerProps {
  language?: Language;
  onNavigateToAdCenter?: () => void;
  slotLocation?: AdSlotLocation;
  slotId?: string;
  ad?: AdCampaign;
  initialFormat?: 'card' | 'banner';
  className?: string;
}

const DEFAULT_COMBANK_AD: AdCampaign = {
  id: 'AD-APP-COMBANK-HORIZONTAL-01',
  advertiserName: 'Commercial Bank Corporate Desk',
  advertiserEmail: 'treasury@combank.lk',
  companyName: 'Commercial Bank of Ceylon PLC',
  title: 'Commercial Bank of Ceylon — High-Yield Forex Business Accounts & Import L/C Solutions',
  tagline: 'Guaranteed USD & LKR trade settlement desk with competitive central bank treasury yields for exporters.',
  businessDescription: 'Premier trade finance, offshore banking units, and foreign currency accounts for corporate exporters and importers in Sri Lanka.',
  slotLocation: 'feed_inline_1',
  category: 'CORPORATE BANKING',
  targetUrl: 'https://www.combank.lk',
  imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1400&q=80',
  adFormat: 'card',
  isFullBanner: false,
  phoneNumber: '0112 353 353',
  badgeText: 'VERIFIED FINANCIAL PARTNER',
  durationDays: 30,
  amountPaid: 85000,
  currency: 'LKR',
  impressionsCount: 38400,
  clicksCount: 2190,
  status: 'active',
  created_at: new Date().toISOString(),
};

const DEFAULT_PRIME_AD: AdCampaign = {
  id: 'AD-APP-PRIME-HORIZONTAL-02',
  advertiserName: 'Prime Residencies Executive Sales',
  advertiserEmail: 'info@primeresidencies.lk',
  companyName: 'Prime Residencies PLC',
  title: 'Mon Viè Thalawathugoda Gardens • Ultra-Luxury Condominiums',
  tagline: 'Live It Beautifully Now • Floating Sky Restaurant & Cantilevered Viewing Deck',
  businessDescription: 'Colombo 05 premier residential suites with private infinity pools and dedicated helipad access.',
  slotLocation: 'feed_inline_2',
  category: 'LUXURY REAL ESTATE',
  targetUrl: 'https://primeresidencies.lk',
  imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
  adFormat: 'banner',
  isFullBanner: true,
  phoneNumber: '0702 777 777',
  badgeText: 'EXCLUSIVE RESIDENCES',
  durationDays: 30,
  amountPaid: 95000,
  currency: 'LKR',
  impressionsCount: 41200,
  clicksCount: 2840,
  status: 'active',
  created_at: new Date().toISOString(),
};

export const HorizontalAdBanner: React.FC<HorizontalAdBannerProps> = ({
  language = 'en',
  onNavigateToAdCenter,
  slotLocation = 'feed_inline_1',
  slotId,
  ad: propAd,
  initialFormat,
  className = '',
}) => {
  const getDefaultAdForSlot = (loc?: string): AdCampaign => {
    if (loc === 'feed_inline_2') return DEFAULT_PRIME_AD;
    return DEFAULT_COMBANK_AD;
  };

  const defaultAd = getDefaultAdForSlot(slotLocation);
  const [ad, setAd] = useState<AdCampaign>(propAd || defaultAd);
  const [currentFormat, setCurrentFormat] = useState<'card' | 'banner'>(
    initialFormat || (propAd?.adFormat ? propAd.adFormat : (defaultAd.adFormat || 'card'))
  );

  // Sync prop changes
  useEffect(() => {
    if (propAd) {
      setAd(propAd);
      if (propAd.adFormat) setCurrentFormat(propAd.adFormat);
    }
  }, [propAd]);

  // Fetch active ads from server if no propAd is provided
  useEffect(() => {
    if (propAd) return;

    let isMounted = true;
    const fetchSlotAd = async () => {
      try {
        const res = await fetch('/api/ads');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.ads)) {
            // Strictly match ad assigned to this exact slotLocation
            const matchingAd = data.ads.find((a: AdCampaign) => {
              const isSlotMatch =
                slotLocation === 'feed_inline_1' || slotLocation === 'feed_inline'
                  ? a.slotLocation === 'feed_inline_1' || a.slotLocation === 'feed_inline'
                  : a.slotLocation === slotLocation;
              return isSlotMatch && (a.status === 'active' || !a.status);
            });

            if (matchingAd && isMounted) {
              setAd(matchingAd);
              if (matchingAd.adFormat) {
                setCurrentFormat(matchingAd.adFormat);
              }
            } else if (isMounted) {
              const fallback = getDefaultAdForSlot(slotLocation);
              setAd(fallback);
              setCurrentFormat(fallback.adFormat || 'card');
            }
          }
        }
      } catch (err) {
        // Fallback default is retained
      }
    };

    fetchSlotAd();
    return () => {
      isMounted = false;
    };
  }, [propAd, slotLocation]);

  // Handle ad click tracking
  const handleAdClick = async (e?: React.MouseEvent) => {
    try {
      if (ad.id) {
        await fetch('/api/ads/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: ad.id }),
        });
      }
    } catch {}

    const destination = ad.targetUrl || 'https://www.combank.lk';
    if (destination) {
      window.open(destination, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`w-full my-5 flex flex-col items-center justify-center ${className}`}>
      {/* Label above the MPU slot */}
      <div className="w-[300px] max-w-full flex items-center justify-between pb-1 text-[9.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest px-0.5">
        <span className="flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          ADVERTISEMENT • MPU 300×250
        </span>
        {onNavigateToAdCenter && (
          <button
            onClick={onNavigateToAdCenter}
            className="text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer underline flex items-center gap-0.5"
          >
            <span>Ad Specs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MEDIUM RECTANGLE (MPU) 300 × 250 px (6:5 ASPECT RATIO) CONTAINER         */}
      {/* ========================================================================= */}
      <div className="w-[300px] max-w-full h-[250px] max-h-[250px] aspect-[6/5] relative rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-shadow">
        {/* 1. DIRECT BANNER CREATIVE FORMAT (300 × 250 px MPU) */}
        {currentFormat === 'banner' ? (
          <div
            onClick={handleAdClick}
            className="w-full h-full border border-slate-300 dark:border-slate-700 bg-[#060D17] text-white relative overflow-hidden cursor-pointer group flex items-center justify-center rounded-xs"
          >
            <img
              src={
                ad.imageUrl ||
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
              }
              alt={ad.title || 'Advertisement'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
            />

            {/* Subtle Sponsored Badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none z-10">
              <span className="bg-black/85 backdrop-blur-xs text-amber-300 border border-amber-500/60 text-[8.5px] font-mono font-black uppercase px-2 py-0.5 tracking-widest rounded-xs shadow-sm">
                SPONSORED
              </span>
              {ad.badgeText && (
                <span className="bg-slate-900/85 backdrop-blur-xs text-slate-200 border border-slate-700 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-xs shadow-sm truncate max-w-[140px]">
                  {ad.badgeText}
                </span>
              )}
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
              <div className="bg-[#D97706] text-[#0F172A] px-3.5 py-1.5 text-xs font-serif font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <span>EXPLORE OFFER</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. STRUCTURED EDITORIAL CARD FORMAT (300 × 250 px MPU)                    */
          /* ========================================================================= */
          <div className="w-full h-full bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] border-2 border-[#D97706] text-white p-3.5 shadow-sm relative overflow-hidden rounded-xs flex flex-col justify-between">
            {/* Background Subtle Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Top Header: Badge & Category */}
            <div className="relative z-10 flex items-center justify-between gap-1 border-b border-slate-700/80 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="shrink-0 bg-[#D97706] text-[#0F172A] p-1 font-black flex items-center justify-center">
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
                <span className="bg-[#D97706] text-[#0F172A] text-[8.5px] font-mono font-black uppercase px-1.5 py-0.5 tracking-wider">
                  SPONSORED
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-amber-300 flex items-center gap-1 truncate">
                <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{ad.badgeText || 'Verified Partner'}</span>
              </span>
            </div>

            {/* Middle Body: Advertiser, Title & Tagline */}
            <div className="relative z-10 space-y-1 my-auto">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider truncate">
                {ad.companyName || ad.advertiserName || 'Corporate Partner'}
              </div>

              <h4 className="font-serif font-bold text-xs sm:text-sm text-white leading-snug line-clamp-2">
                {ad.title || 'Commercial Bank of Ceylon — High-Yield Forex Business Accounts'}
              </h4>

              <p className="text-[11px] text-slate-300 font-sans line-clamp-2 leading-relaxed">
                {ad.tagline ||
                  'Guaranteed USD & LKR trade settlement desk with competitive treasury yields.'}
              </p>
            </div>

            {/* Bottom Actions: CTA & Ad Center */}
            <div className="relative z-10 flex items-center justify-between gap-2 border-t border-slate-700/80 pt-2">
              <button
                onClick={handleAdClick}
                className="bg-[#D97706] hover:bg-amber-500 text-[#0F172A] font-serif font-black text-[11px] uppercase tracking-wider px-3 py-1.5 transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>EXPLORE</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              {onNavigateToAdCenter && (
                <button
                  onClick={onNavigateToAdCenter}
                  className="text-slate-400 hover:text-amber-300 font-mono text-[9px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                  title="Advertise on LankaEcon Editorial Portal"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>Ad Center</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
