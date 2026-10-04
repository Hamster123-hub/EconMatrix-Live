import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Globe, 
  Shield, 
  BookOpen, 
  Feather, 
  Megaphone, 
  Lock, 
  Newspaper, 
  Instagram, 
  Twitter, 
  Facebook,
  PhoneCall,
  MessageCircle,
  User,
  ArrowRight
} from 'lucide-react';
import { getUIText, Language } from '../utils/translations';

interface FooterProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenSubscriberPreferences?: (tab?: 'preferences' | 'history' | 'unsubscribe') => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenSubscriberPreferences,
  language = 'en' 
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const mainTiles = [
    { id: 'all_stories', label: getUIText('tabAllStories', language), icon: Newspaper },
    { id: 'MARKETS', label: getUIText('tabMarkets', language), icon: Shield },
    { id: 'FINANCE', label: getUIText('tabFinance', language), icon: Globe },
    { id: 'SERVICES', label: getUIText('tabServices', language), icon: Globe },
    { id: 'INDUSTRY', label: getUIText('tabIndustry', language), icon: Globe },
    { id: 'GOVERNANCE', label: getUIText('tabGovernance', language), icon: Feather },
    { id: 'OPINION', label: getUIText('tabOpinion', language), icon: Feather },
    { id: 'WORLD', label: getUIText('tabWorld', language), icon: Globe },
    { id: 'econ_academy', label: getUIText('tabEconAcademy', language), icon: BookOpen },
    /* { id: 'lanka_ink', label: getUIText('tabLankaInk', language), icon: Feather }, - hidden for now */
    { id: 'ad_center', label: getUIText('tabAdCenter', language), icon: Megaphone },
    { id: 'contacts', label: getUIText('tabContacts', language), icon: PhoneCall },
    { id: 'staff_portal', label: getUIText('tabStaffPortal', language), icon: Lock },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
          name: newsletterName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubSuccess(true);
        setNewsletterEmail('');
        setNewsletterName('');
      }
    } catch {
      setSubSuccess(true);
    }
  };

  return (
    <footer className="bg-[#0B1E36] text-[#FDFBF7] border-t-4 border-[#0284C7] mt-16 pt-10 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Top Header Row with Company Logo & Tagline */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-700 pb-8">
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-3xl tracking-tight uppercase">
              <span className="text-white">ECON</span>
              <span className="text-[#0284C7]">MATRIX</span>
            </h2>
            <span className="bg-[#DC2626] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
              DISPATCHES
            </span>
          </div>

          <div className="flex flex-col md:items-end items-center gap-3">
            <p className="text-xs text-slate-300 font-sans text-center md:text-right max-w-lg leading-relaxed">
              Sri Lanka’s Premier Financial & Macroeconomic Journal • Colombo • Kandy • Galle • Jaffna
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Official Channel:</span>
              <a
                href="https://www.instagram.com/lankaecon.lk/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-slate-900 hover:bg-slate-800 text-[#E4405F] hover:text-pink-400 border border-slate-700 text-xs font-mono transition shadow-2xs"
                title="Official Instagram (@lankaecon.lk)"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="text-slate-200 font-sans text-[11px] font-bold">@lankaecon.lk</span>
              </a>
              <a
                href="https://x.com/econlanka"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition shadow-2xs"
                title="Twitter / X (@econlanka)"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://facebook.com/econlanka"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700 transition shadow-2xs"
                title="Facebook (@econlanka)"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Section Tiles Matching the Top Bar */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black uppercase text-[#0284C7] tracking-widest">
            Main Editorial & Platform Sections
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {mainTiles.map((tile) => {
              const Icon = tile.icon;
              const isActive = activeTab === tile.id;
              return (
                <button
                  key={tile.id}
                  onClick={() => onSelectTab && onSelectTab(tile.id)}
                  className={`p-3 text-left transition border cursor-pointer flex flex-col justify-between space-y-2 ${
                    isActive
                      ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                      : 'bg-[#132A4A] text-slate-200 border-slate-700 hover:border-[#0284C7] hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0284C7]'}`} />
                  <span className="font-extrabold text-xs uppercase tracking-wider block">
                    {tile.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Newsletter Dispatch Form */}
        <div className="bg-[#132A4A] border border-slate-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-amber-400 font-extrabold text-[10px] uppercase tracking-widest">
              ECON MATRIX MORNING DISPATCH
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Receive Daily Market & Policy Intelligence at 07:30 AM
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              CSE stock tables, Central Bank exchange rates, and IMF policy reports delivered to your corporate email.
            </p>
          </div>

          {subSuccess ? (
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs bg-[#0B1E36] p-3 border border-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <span>Subscribed successfully to Morning Dispatch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="YOUR NAME"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="bg-[#0B1E36] border border-slate-600 text-white text-xs px-3 py-2 font-mono uppercase focus:outline-hidden"
              />
              <input
                type="email"
                required
                placeholder="CORPORATE EMAIL"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-[#0B1E36] border border-slate-600 text-white text-xs px-3 py-2 font-mono uppercase focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold text-xs px-6 py-2 uppercase tracking-wider transition whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Direct Editorial & Leadership Contact Card - Requested by User */}
        <div className="bg-gradient-to-r from-[#091527] to-[#132A4A] border-2 border-sky-500/40 p-5 sm:p-6 rounded-xs shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <User className="w-3 h-3 text-sky-400" />
                  Direct Contact & Communication
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Channel
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  Disnaka
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Direct Line:{' '}
                  <a 
                    href="tel:+94771774033" 
                    className="text-amber-400 hover:text-amber-300 font-mono font-bold text-base sm:text-lg underline ml-1"
                  >
                    0771774033
                  </a>
                </p>
              </div>

              {/* Explicit WhatsApp Statement */}
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm pt-1">
                <MessageCircle className="w-4 h-4 fill-emerald-500/20 text-emerald-400 shrink-0" />
                <span>
                  I am available on WhatsApp on this number (<strong>0771774033</strong>).
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <a
                href="https://wa.me/94771774033"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xs transition shadow-md cursor-pointer"
                title="Chat with Disnaka on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp (0771774033)</span>
              </a>

              {onSelectTab && (
                <button
                  type="button"
                  onClick={() => onSelectTab('contacts')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs uppercase tracking-wider rounded-xs transition cursor-pointer"
                  title="Open Dedicated Contacts Page"
                >
                  <span>Contacts Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright & Legal Note */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-800 gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>© 2026 Econ Matrix Publishing Company. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-300">
              Direct Contact: <strong className="text-white">Disnaka</strong> (<a href="tel:+94771774033" className="text-amber-400 hover:underline">0771774033</a> • WhatsApp Available)
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            {onOpenSubscriberPreferences && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenSubscriberPreferences('preferences')}
                  className="text-slate-300 hover:text-white transition font-sans text-[11px] underline cursor-pointer"
                >
                  Notification Preferences
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => onOpenSubscriberPreferences('unsubscribe')}
                  className="text-red-400 hover:text-red-300 transition font-sans text-[11px] underline cursor-pointer font-bold"
                >
                  Unsubscribe / Cancel Pass
                </button>
                <span className="text-slate-600">•</span>
              </>
            )}
            <span className="text-amber-400 font-bold font-mono text-[10px]">ECON MATRIX NETWORK</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
