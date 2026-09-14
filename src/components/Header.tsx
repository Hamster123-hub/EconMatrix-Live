import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, BookOpen, Feather, Megaphone, Lock, Sparkles, Search, Globe, Home, Shield, Menu, MessageCircle, Instagram, Twitter, Facebook, Bookmark, ChevronLeft, ChevronRight, Palette, Check, ChevronDown, Newspaper, Bell, PhoneCall } from 'lucide-react';
import { WhatsAppModal } from './WhatsAppModal';
import { getUIText } from '../utils/translations';

export type ThemeStyle = 'modern_pro' | 'economynext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'en' | 'si' | 'ta';
  setLanguage: (lang: 'en' | 'si' | 'ta') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAnalystChat: () => void;
  onOpenSubscribeModal: () => void;
  isLoggedIn: boolean;
  currentUser: any;
  themeStyle: ThemeStyle;
  setThemeStyle: (theme: ThemeStyle) => void;
  bookmarkedCount?: number;
  onOpenBookmarks?: () => void;
  onOpenSubscriberPreferencesModal?: () => void;
  isReadingArticle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  onOpenAnalystChat,
  onOpenSubscribeModal,
  isLoggedIn,
  currentUser,
  themeStyle,
  setThemeStyle,
  bookmarkedCount = 0,
  onOpenBookmarks,
  onOpenSubscriberPreferencesModal,
  isReadingArticle = false,
}) => {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Mouse Drag Scrolling for Category Tab Bar
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navContainerRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - navContainerRef.current.offsetLeft);
    setScrollLeft(navContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !navContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - navContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.8; // Scroll speed multiplier
    navContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navContainerRef.current) return;
    const scrollAmount = 240;
    navContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Collapsible Header System on Scroll - Vanishes completely when scrolling down in article mode
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 25) {
        setIsScrolled(true);
      } else if (currentScrollY <= 8) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all_stories', label: getUIText('tabAllStories', language) },
    { id: 'ECONOMY', label: getUIText('tabEconomy', language) },
    { id: 'MARKETS', label: getUIText('tabMarkets', language) },
    { id: 'FINANCE', label: getUIText('tabFinance', language) },
    { id: 'SERVICES', label: getUIText('tabServices', language) },
    { id: 'INDUSTRY', label: getUIText('tabIndustry', language) },
    { id: 'GOVERNANCE', label: getUIText('tabGovernance', language) },
    { id: 'OPINION', label: getUIText('tabOpinion', language) },
    { id: 'WORLD', label: getUIText('tabWorld', language) },
    { id: 'econ_academy', label: getUIText('tabEconAcademy', language), icon: BookOpen },
    /* { id: 'lanka_ink', label: getUIText('tabLankaInk', language), icon: Feather }, - hidden for now */
    { id: 'ad_center', label: getUIText('tabAdCenter', language), icon: Megaphone },
    { id: 'contacts', label: getUIText('tabContacts', language), icon: PhoneCall },
    { id: 'staff_portal', label: getUIText('tabStaffPortal', language), icon: Shield },
  ];

  const isVibrant = false;
  const isModern = themeStyle === 'modern_pro';

  let firstPart = 'ECON';
  let secondPart = 'MATRIX';
  if (language === 'si') {
    firstPart = 'ඊකොන්';
    secondPart = 'මැට්‍රික්ස්';
  } else if (language === 'ta') {
    firstPart = 'ஈகோன்';
    secondPart = 'மேட்ரிக்ஸ்';
  }

  return (
    <header
      className={`sticky top-0 z-40 shadow-sm font-sans select-none transition-all duration-300 ease-in-out ${
        isReadingArticle && isScrolled
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Collapsible Branding Container - Collapses when scrolling down, expands when scrolled to top */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'max-h-0 opacity-0 overflow-hidden pointer-events-none'
            : 'max-h-[350px] opacity-100'
        }`}
      >
        {/* Top Utility Navy Strip */}
        <div className={`text-slate-200 text-xs py-1.5 px-3 sm:px-8 flex flex-wrap justify-between items-center gap-2 transition-colors ${
          isModern
            ? 'bg-[#091527] border-b border-slate-800'
            : 'bg-[#0B1E36] border-b border-slate-800'
        }`}>
          <div className="flex flex-wrap items-center space-x-2 sm:space-x-3">
            <span className="hidden sm:inline font-extrabold text-white tracking-wide uppercase text-[10px] sm:text-[11px]">
              Econ Matrix Dispatches
            </span>

            {/* Social Media Symbols */}
            <span className="text-slate-600 hidden xs:inline">•</span>
            <div className="flex items-center gap-1.5 ml-0.5">
              <a
                href="https://x.com/econlanka"
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-xs bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-700/80 flex items-center justify-center shadow-2xs"
                title="Twitter / X (@econlanka)"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/lankaecon.lk/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-xs bg-slate-900/90 hover:bg-slate-800 text-[#E4405F] hover:text-pink-400 transition border border-slate-700/80 flex items-center justify-center shadow-2xs"
                title="Instagram (@lankaecon.lk)"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="p-1 rounded-xs bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 transition border border-emerald-700/80 flex items-center justify-center cursor-pointer shadow-2xs"
                title="WhatsApp Channels"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </button>
              <a
                href="https://facebook.com/econlanka"
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-xs bg-slate-900/90 hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition border border-slate-700/80 flex items-center justify-center shadow-2xs"
                title="Facebook (@econlanka)"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
              </a>

              <span className="text-slate-600 hidden md:inline">•</span>
              <button
                onClick={() => setActiveTab('contacts')}
                className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-2 py-0.5 rounded-xs border border-slate-700/80 transition cursor-pointer"
                title="Direct Editorial Contact: Disnaka Seneviratne (0771774033)"
              >
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span>Direct: Disnaka (0771774033)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* LANGUAGE SWITCHER BUTTON GROUP */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xs overflow-hidden p-0.5">
              <Globe className="w-3 h-3 text-sky-400 ml-1 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-extrabold uppercase transition cursor-pointer rounded-xs ${
                  language === 'en'
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-extrabold uppercase transition cursor-pointer rounded-xs ${
                  language === 'si'
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to Sinhala (සිංහල)"
              >
                සිං
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-extrabold uppercase transition cursor-pointer rounded-xs ${
                  language === 'ta'
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to Tamil (தமிழ்)"
              >
                த
              </button>
            </div>

            {/* Subscriber Email Alerts Preference Trigger */}
            {onOpenSubscriberPreferencesModal && (
              <button
                onClick={onOpenSubscriberPreferencesModal}
                className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-sky-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xs transition cursor-pointer shadow-2xs"
                title="Manage Subscriber Exclusive Article Email Alerts"
              >
                <Bell className="w-3 h-3 text-sky-400" />
                <span className="hidden xs:inline">Email Alerts</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Branding Header - Background in Deep Econ Dark Blue (#0B1E36) */}
        <div className="bg-[#0B1E36] text-white py-2 sm:py-3 px-3 sm:px-6 border-b border-slate-800 shadow-xs transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3">
            
            {/* Logo & Mobile Action Buttons */}
            <div className="w-full md:w-auto flex items-start justify-between gap-2">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left group cursor-pointer focus:outline-hidden flex flex-col justify-center"
              >
                <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-black tracking-tight leading-none uppercase flex flex-col items-start transition-transform group-hover:scale-[1.01]">
                  <span className="text-white drop-shadow-sm">{firstPart}</span>
                  <span className="text-[#0284C7] -mt-1 sm:-mt-1.5 drop-shadow-sm">{secondPart}</span>
                </h1>
                
                {/* Horizontal Tagline on Desktop - Only in English */}
                {language === 'en' && (
                  <p className="hidden sm:block text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-300 mt-1 font-mono">
                    {getUIText('tagline', language)}
                  </p>
                )}
              </button>

              {/* Top Right Mobile Action Buttons (SUBSCRIBE & ADVERTISE) */}
              <div className="sm:hidden flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                {/* SUBSCRIBE Button - Light Blue */}
                <button
                  onClick={() => {
                    onOpenSubscribeModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 px-2 py-1 text-[9px] font-black uppercase tracking-wider bg-sky-300 hover:bg-sky-200 text-slate-950 shadow-xs transition cursor-pointer border border-sky-400 rounded-xs"
                >
                  <Lock className="w-3 h-3 text-slate-950" />
                  <span>SUBSCRIBE</span>
                </button>

                {/* ADVERTISE Button - Light Soft Emerald */}
                <button
                  onClick={() => {
                    setActiveTab('ad_center');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 px-2 py-1 text-[9px] font-black uppercase tracking-wider transition cursor-pointer bg-emerald-300 hover:bg-emerald-200 text-slate-950 rounded-xs shadow-xs border border-emerald-400"
                >
                  <Megaphone className="w-3 h-3 text-slate-950" />
                  <span>ADVERTISE</span>
                </button>
              </div>
            </div>

            {/* Top Quick Page Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
              
              {/* ECON ACADEMY BUTTON (JUST ABOVE SEARCH BAR ON MOBILE) */}
              <div className="flex sm:flex-wrap items-center justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
                {/* ECON ACADEMY BUTTON */}
                <button
                  onClick={() => {
                    setActiveTab('econ_academy');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:py-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider transition cursor-pointer bg-white text-[#0284C7] border border-slate-900 hover:bg-sky-50 shadow-2xs rounded-xs ${
                    activeTab === 'econ_academy' ? 'ring-2 ring-amber-300 bg-sky-50' : ''
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Econ Academy</span>
                </button>

                {/* DESKTOP ONLY SUBSCRIBE & ADVERTISE BUTTONS */}
                <button
                  onClick={() => {
                    onOpenSubscribeModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="hidden sm:flex items-center justify-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-sky-300 hover:bg-sky-200 text-slate-950 shadow-xs transition cursor-pointer border border-sky-400 rounded-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>SUBSCRIBE</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('ad_center');
                    setIsMobileMenuOpen(false);
                  }}
                  className="hidden sm:flex items-center justify-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition cursor-pointer bg-emerald-300 hover:bg-emerald-200 text-slate-950 rounded-xs shadow-xs border border-emerald-400"
                >
                  <Megaphone className="w-3.5 h-3.5 text-slate-950" />
                  <span>ADVERTISE</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-44 md:w-52">
                <input
                  type="text"
                  placeholder={getUIText('searchPlaceholder', language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 text-[10px] sm:text-[10.5px] bg-white border border-slate-900 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-xs uppercase tracking-wider font-bold shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#091527] text-white border-b-4 border-amber-400 p-4 space-y-4 animate-fadeIn shadow-2xl">
          {/* Quick Action Banners inside Mobile Menu */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenSubscribeModal();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 bg-sky-300 hover:bg-sky-200 text-slate-950 rounded-xs border border-sky-400 shadow-md flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition"
            >
              <div className="flex items-center gap-1 font-black text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-slate-950" />
                <span>SUBSCRIBE</span>
              </div>
              <span className="text-[9px] font-bold text-slate-900 opacity-90">Unlock Full Intelligence</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ad_center');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xs border border-emerald-300 shadow-md flex flex-col items-center justify-center text-center gap-1 cursor-pointer transition"
            >
              <div className="flex items-center gap-1 font-black text-xs uppercase tracking-wider">
                <Megaphone className="w-4 h-4 text-slate-950" />
                <span>ADVERTISE</span>
              </div>
              <span className="text-[9px] font-bold text-slate-900 opacity-90">Reach Financial Leaders</span>
            </button>
          </div>

          {/* Navigation Categories Grid */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1 mb-2 font-bold">
              Dispatch Desks & Sections
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 text-xs font-extrabold uppercase text-left flex items-center gap-2 rounded-xs border ${
                  activeTab === 'home' ? 'bg-[#0284C7] text-white border-sky-400' : 'bg-slate-800/80 text-slate-200 border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                <Home className="w-4 h-4 text-sky-400" />
                <span>HOME</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 text-xs font-extrabold uppercase text-left truncate rounded-xs border ${
                    activeTab === cat.id ? 'bg-[#0284C7] text-white border-sky-400' : 'bg-slate-800/80 text-slate-200 border-slate-700/60 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar - Dark Blue (#0B1E36) Matching Top Header - Sticky when top collapses */}
      <nav className="bg-[#0B1E36] text-white border-t border-b border-slate-800 relative group/nav transition-colors block shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-8 flex items-center relative">
          
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollNav('left')}
            className="hidden group-hover/nav:flex items-center justify-center w-7 h-7 bg-slate-900/90 text-amber-300 border border-amber-500/50 absolute left-1 z-10 transition cursor-pointer shadow-md hover:bg-slate-800"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mouse Drag Nav Container */}
          <div
            ref={navContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex items-center space-x-1.5 overflow-x-auto py-1.5 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full scroll-smooth touch-pan-x"
          >
            {/* MOBILE MENU DROPDOWN BUTTON - Before HOME button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xs border border-slate-700 shrink-0 mr-1 shadow-2xs transition cursor-pointer"
              aria-label="Toggle Sections Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-black">MENU</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* COLLAPSED LANKAECON MINI BRAND BADGE */}
            {isScrolled && (
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#091527] text-white font-black text-[11px] uppercase tracking-wider rounded-xs border border-amber-400/60 shrink-0 mr-1.5 shadow-sm hover:bg-slate-900 transition cursor-pointer"
                title="Econ Matrix - Scroll to Top & Return Home"
              >
                <span className="text-white font-black">{firstPart}</span>
                <span className="text-[#0284C7] font-black">{secondPart}</span>
              </button>
            )}

            {/* DIRECT HOME BUTTON - Light Blue Button */}
            <button
              onClick={() => setActiveTab('home')}
              className="text-[11px] font-black uppercase px-3.5 py-1.5 flex items-center gap-1.5 transition cursor-pointer shrink-0 rounded-xs bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-xs border border-sky-300"
              title="Home Page - Lead Dispatches & Overview"
            >
              <Home className="w-3.5 h-3.5 text-slate-950" />
              <span>HOME</span>
            </button>

            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'text-amber-300 font-black'
                      : 'text-white hover:text-amber-300 font-extrabold'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-300'}`} />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollNav('right')}
            className="hidden group-hover/nav:flex items-center justify-center w-7 h-7 bg-slate-900/90 text-amber-300 border border-amber-500/50 absolute right-1 z-10 transition cursor-pointer shadow-md hover:bg-slate-800"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </nav>

      <WhatsAppModal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} />
    </header>
  );
};
