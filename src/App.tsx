import React, { useState, useEffect } from 'react';
import { Article, StockTicker, AdCampaign, EmployeeRecord } from './types';
import { Header, ThemeStyle } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ArticleCard } from './components/ArticleCard';
import { FullArticleView } from './components/FullArticleView';
import { FinancialAnalystChat } from './components/FinancialAnalystChat';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { SummaryStoryPage } from './components/SummaryStoryPage';
import { AiExecutiveAnalystDashboard } from './components/AiExecutiveAnalystDashboard';
import { EconAcademySection } from './components/EconAcademySection';
import { LankaInkSection } from './components/LankaInkSection';
import { AdCenterSection } from './components/AdCenterSection';
import { StaffPortalSection } from './components/StaffPortalSection';
import { ContactsPage } from './components/ContactsPage';
import { EconomyNextMarketRatesWidget } from './components/EconomyNextMarketRatesWidget';
import { DiscoverLankaInkBanner } from './components/DiscoverLankaInkBanner';
import { InitialStoriesHero } from './components/InitialStoriesHero';
import { EditorialNewsGrid, RectangularStoryCard } from './components/EditorialNewsGrid';
import { HorizontalAdBanner } from './components/HorizontalAdBanner';
import { BondsForexSidebar } from './components/BondsForexSidebar';
import { RightSidebar } from './components/RightSidebar';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SubscriberPreferencesModal } from './components/SubscriberPreferencesModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { PaginationBar } from './components/PaginationBar';
import { safeSetStorage, safeGetStorage } from './utils/safeStorage';
import { TrendingUp, ExternalLink, ChevronLeft, ChevronRight, ArrowRight, BookOpen, Feather, BarChart2, MessageSquare, Briefcase, Newspaper, Clock } from 'lucide-react';
import { INITIAL_ARTICLES, INITIAL_TICKERS, INITIAL_ADS } from './data/mockData';
import { getUIText, translateArticleData, translateCategory } from './utils/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState<'en' | 'si' | 'ta'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('modern_pro');

  const [articles, setArticles] = useState<Article[]>(() => {
    const cached = safeGetStorage<Article[]>('econmatrix_cached_articles_v2', null);
    if (Array.isArray(cached) && cached.length > 0) {
      const cachedTime = new Date(cached[0]?.published_at || cached[0]?.created_at || 0).getTime() || Number(cached[0]?.article_id) || 0;
      const initialTime = new Date(INITIAL_ARTICLES[0]?.published_at || INITIAL_ARTICLES[0]?.created_at || 0).getTime() || Number(INITIAL_ARTICLES[0]?.article_id) || 0;
      if (cachedTime >= initialTime) {
        return cached;
      }
    }
    return INITIAL_ARTICLES;
  });
  const [tickers, setTickers] = useState<StockTicker[]>(() => INITIAL_TICKERS);
  const [marketOverview, setMarketOverview] = useState<any>(null);
  const [ads, setAds] = useState<AdCampaign[]>(() => INITIAL_ADS);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when switching tabs or typing search
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedIgStoryArticle, setSelectedIgStoryArticle] = useState<Article | null>(null);
  const [selectedSummaryStoryArticle, setSelectedSummaryStoryArticle] = useState<Article | null>(null);
  const [igStoryInitialMode, setIgStoryInitialMode] = useState<'entire_story' | 'summary'>('entire_story');
  const [isAnalystChatOpen, setIsAnalystChatOpen] = useState(false);
  const [isExecutiveAnalystOpen, setIsExecutiveAnalystOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSubscriberPreferencesOpen, setIsSubscriberPreferencesOpen] = useState(false);
  const [subscriberPreferencesTab, setSubscriberPreferencesTab] = useState<'preferences' | 'history' | 'unsubscribe'>('preferences');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  const openSubscriberPreferences = (tab: 'preferences' | 'history' | 'unsubscribe' = 'preferences') => {
    setSubscriberPreferencesTab(tab);
    setIsSubscriberPreferencesOpen(true);
  };

  // Metered Paywall & Bookmarks State
  const [readArticlesCount, setReadArticlesCount] = useState<number>(() => {
    const saved = safeGetStorage<string | null>('lankaecon_read_count', null);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isMeteredPaywallTriggered, setIsMeteredPaywallTriggered] = useState(false);

  // Staff User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<EmployeeRecord | null>(null);

  // Subscriber Status State (Tracks whether current reader is subscribed)
  const [isSubscriber, setIsSubscriber] = useState<boolean>(() => {
    const isSub = safeGetStorage<string>('lankaecon_is_subscriber', '');
    const email = safeGetStorage<string>('lankaecon_subscriber_email', '');
    return isSub === 'true' || Boolean(email);
  });
  const [lockedArticleTitle, setLockedArticleTitle] = useState<string | null>(null);
  const [pastedAdBannerImage, setPastedAdBannerImage] = useState<string | undefined>(undefined);

  const handleNavigateToAdCenter = (pastedImg?: string) => {
    if (pastedImg) {
      setPastedAdBannerImage(pastedImg);
    }
    setActiveTab('ad_center');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (art: Article) => {
    const isSubscriberArticle = Boolean(art.is_subscription_only || art.is_premium);

    // CRITICAL: The subscription modal ONLY pops up if an unsubscribed reader clicks a "Subscribed tagged story"
    if (isSubscriberArticle && !isSubscriber && !isLoggedIn) {
      setLockedArticleTitle(art.title);
      setIsMeteredPaywallTriggered(false);
      setIsSubscriptionModalOpen(true);
      return;
    }

    // Free stories or authenticated subscribers open directly with NO modal popup
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenIgStory = (art: Article, mode: 'entire_story' | 'summary' = 'entire_story') => {
    if (mode === 'summary') {
      setSelectedSummaryStoryArticle(art);
      setActiveTab('summary_story');
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIgStoryInitialMode(mode);
      setSelectedIgStoryArticle(art);
    }
  };

  const handleOpenSummaryStoryPage = (art?: Article | null) => {
    setSelectedSummaryStoryArticle(art || null);
    setActiveTab('summary_story');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper background styling
  const getAppBgClass = () => {
    if (themeStyle === 'modern_pro') {
      return 'bg-[#F3F5F8] text-slate-900 font-sans';
    }
    switch (themeStyle) {
      case 'economynext':
      default:
        return 'bg-[#F8FAFC] text-[#0F172A] font-sans';
    }
  };

  // Initial Fetch Data & Live Market Feed polling
  useEffect(() => {
    fetchArticles();
    fetchMarketData(false); // Fast immediate response without blocking on remote external scraping
    fetchAds();

    const intervalId = setInterval(() => {
      fetchMarketData(false);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchArticles = async (retryCount = 0) => {
    try {
      const res = await fetch(`/api/articles?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          safeSetStorage('econmatrix_cached_articles_v2', data.articles);
        }
      } else if (retryCount < 2) {
        setTimeout(() => fetchArticles(retryCount + 1), 2000);
      }
    } catch {
      if (retryCount < 2) {
        setTimeout(() => fetchArticles(retryCount + 1), 2000);
      }
    }
  };

  const fetchMarketData = async (isLive = false, retryCount = 0) => {
    setIsLoadingLive(true);
    try {
      const url = isLive ? '/api/market-data?live=true' : '/api/market-data';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            setTickers(data.data);
          }
          if (data.marketOverview) {
            setMarketOverview(data.marketOverview);
          }
        }
      } else if (retryCount < 2 && !isLive) {
        setTimeout(() => fetchMarketData(false, retryCount + 1), 2000);
      }
    } catch {
      if (retryCount < 2 && !isLive) {
        setTimeout(() => fetchMarketData(false, retryCount + 1), 2000);
      }
    } finally {
      setIsLoadingLive(false);
    }
  };

  const fetchAds = async (retryCount = 0) => {
    try {
      const res = await fetch('/api/ads');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.ads) && data.ads.length > 0) {
          setAds(data.ads);
        }
      } else if (retryCount < 2) {
        setTimeout(() => fetchAds(retryCount + 1), 2000);
      }
    } catch {
      if (retryCount < 2) {
        setTimeout(() => fetchAds(retryCount + 1), 2000);
      }
    }
  };

  // Filter articles based on activeTab and searchQuery
  const filteredArticles = articles.filter((art) => {
    // Check if article is published from backend
    const isPublished = art.status === 'published';

    // Check if article is from Econ Academy
    const isEconAcademy =
      art.primary_category?.toLowerCase() === 'econ_academy' ||
      art.primary_category?.toLowerCase() === 'academy' ||
      art.primary_category?.toLowerCase() === 'scholar_article';

    // Check if article is from Ink & Canvas
    const isInkCanvas =
      art.primary_category?.toLowerCase() === 'lanka_ink' ||
      art.primary_category?.toLowerCase() === 'ink_canvas' ||
      art.primary_category?.toLowerCase() === 'artisan' ||
      art.primary_category?.toLowerCase() === 'creations';

    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.deck?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.body.toLowerCase().includes(searchQuery.toLowerCase());

    // For news tabs, exclude Econ Academy, Ink & Canvas, and unpublished articles
    if (
      activeTab === 'home' ||
      activeTab === 'all_stories' ||
      ['ECONOMY', 'MARKETS', 'FINANCE', 'SERVICES', 'INDUSTRY', 'GOVERNANCE', 'OPINION', 'WORLD', 'POLICY', 'TRADE', 'BANKING'].includes(activeTab.toUpperCase())
    ) {
      if (isEconAcademy || isInkCanvas || !isPublished) return false;
    }

    if (
      activeTab === 'home' ||
      activeTab === 'all_stories' ||
      activeTab === 'econ_academy' ||
      activeTab === 'lanka_ink' ||
      activeTab === 'ad_center' ||
      activeTab === 'staff_portal'
    ) {
      return matchesSearch;
    }

    const artCat = (art.primary_category || '').toLowerCase();
    const tabCat = activeTab.toLowerCase();

    const matchesCategory =
      artCat === tabCat ||
      (tabCat === 'economy' && (artCat === 'economy' || artCat === 'macro' || artCat === 'cbsl' || artCat === 'imf' || artCat === 'gdp' || artCat === 'inflation' || artCat === 'monetary' || artCat === 'economic crisis')) ||
      (tabCat === 'markets' && (artCat === 'markets' || artCat === 'cse' || artCat === 'stocks' || artCat === 'forex' || artCat === 'bonds')) ||
      (tabCat === 'finance' && (artCat === 'trade' || artCat === 'banking' || artCat === 'finance')) ||
      (tabCat === 'banking' && (artCat === 'banking' || artCat === 'finance' || artCat === 'trade')) ||
      (tabCat === 'trade' && (artCat === 'trade' || artCat === 'finance' || artCat === 'banking' || artCat === 'exports' || artCat === 'imports')) ||
      (tabCat === 'policy' && (artCat === 'policy' || artCat === 'governance' || artCat === 'politics' || artCat === 'legal')) ||
      (tabCat === 'governance' && (artCat === 'policy' || artCat === 'governance' || artCat === 'politics' || artCat === 'legal')) ||
      (tabCat === 'opinion' && (artCat === 'opinion' || artCat === 'editorial' || artCat === 'analysis')) ||
      (tabCat === 'services' && (artCat === 'services' || artCat === 'tech' || artCat === 'tourism' || artCat === 'telecom')) ||
      (tabCat === 'industry' && (artCat === 'industry' || artCat === 'manufacturing' || artCat === 'energy' || artCat === 'apparel' || artCat === 'construction' || artCat === 'real estate')) ||
      (tabCat === 'world' && (artCat === 'world' || artCat === 'international' || artCat === 'global' || artCat === 'asia'));

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const timeA = new Date(a.published_at || a.created_at || 0).getTime() || Number(a.article_id) || 0;
    const timeB = new Date(b.published_at || b.created_at || 0).getTime() || Number(b.article_id) || 0;
    return timeB - timeA;
  });

  const heroArticle = articles.find((a) => a.is_featured) || articles[0];
  const gridArticles = filteredArticles.filter((a) => a.article_id !== heroArticle?.article_id);

  // Find sponsored ads for slots
  const heroTopAd = ads.find((a) => a.slotLocation === 'hero_top_updates');
  const feedInlineAd = ads.find((a) => a.slotLocation === 'feed_inline');

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${getAppBgClass()}`}>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }}
        language={language}
        setLanguage={setLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAnalystChat={() => setIsExecutiveAnalystOpen(true)}
        onOpenSubscribeModal={() => {
          setIsMeteredPaywallTriggered(false);
          setIsSubscriptionModalOpen(true);
        }}
        onOpenSubscriberPreferencesModal={() => openSubscriberPreferences('preferences')}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        themeStyle={themeStyle}
        setThemeStyle={setThemeStyle}
        isReadingArticle={Boolean(selectedArticle)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-6 flex-1 w-full space-y-8">
        
        {/* RENDER FULL ARTICLE VIEW SMOOTHLY ON WHITE BACKGROUND WHEN SELECTED */}
        {selectedArticle ? (
          <FullArticleView
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            language={language}
            setLanguage={setLanguage}
            isLoggedIn={isLoggedIn}
            isSubscriber={isSubscriber}
            onOpenSubscribeModal={() => {
              setLockedArticleTitle(selectedArticle?.title || null);
              setIsMeteredPaywallTriggered(false);
              setIsSubscriptionModalOpen(true);
            }}
            relatedArticles={articles.filter((a) => a.article_id !== selectedArticle.article_id)}
            onSelectArticle={handleSelectArticle}
          />
        ) : activeTab === 'econ_academy' ? (
          <EconAcademySection language={language} />
        ) : activeTab === 'lanka_ink' ? (
          <LankaInkSection language={language} />
        ) : activeTab === 'ad_center' ? (
          <AdCenterSection language={language} initialPastedImage={pastedAdBannerImage} />
        ) : activeTab === 'contacts' || activeTab === 'contact' ? (
          <ContactsPage
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
          />
        ) : activeTab === 'staff_portal' ? (
          <StaffPortalSection
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onRefreshArticles={fetchArticles}
            onOpenAnalystChat={() => setIsExecutiveAnalystOpen(true)}
            onOpenAnalystCopilot={() => setIsAnalystChatOpen(true)}
            onOpenIgStory={handleOpenIgStory}
            onOpenSummaryStoryPage={handleOpenSummaryStoryPage}
          />
        ) : activeTab === 'summary_story' ? (
          <SummaryStoryPage
            initialArticle={selectedSummaryStoryArticle}
            onBack={() => {
              setActiveTab(isLoggedIn ? 'staff_portal' : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
          />
        ) : activeTab === 'home' ? (
          /* HOME PAGE: 2-Column Grid (Main Editorial Area + Right Sidebar) */
          <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-start w-full">
            <div className="flex-1 w-full min-w-0 space-y-8">
              {/* 1. TOP INITIAL STORIES HERO (Matches Screenshot 1) */}
              {(() => {
                // Strict Sort Hierarchy:
                // 1. Breaking news stories ALWAYS on top
                // 2. Newest articles always lead the homepage; lead-story flag acts as tie-breaker for same-day articles
                const sortedArticles = [...filteredArticles].sort((a, b) => {
                  if (a.is_breaking && !b.is_breaking) return -1;
                  if (!a.is_breaking && b.is_breaking) return 1;
                  
                  const timeA = new Date(a.published_at || a.created_at || 0).getTime() || Number(a.article_id) || 0;
                  const timeB = new Date(b.published_at || b.created_at || 0).getTime() || Number(b.article_id) || 0;
                  
                  const hoursDiff = Math.abs(timeA - timeB) / (1000 * 60 * 60);
                  if (hoursDiff < 24) {
                    if (a.is_lead_story && !b.is_lead_story) return -1;
                    if (!a.is_lead_story && b.is_lead_story) return 1;
                  }
                  
                  return timeB - timeA;
                });

                const leadArticle = sortedArticles[0];
                if (!leadArticle) return null;

                const subLeadArticle = sortedArticles[1];
                const secondaryStory1 = sortedArticles[2];
                const secondaryStory2 = sortedArticles[3];
                const feedArticles = sortedArticles.slice(4);

                return (
                  <div className="space-y-6">
                    {/* Top Hero: Lead Headline -> Big Image -> Blue Sub-Lead Bar on Left | 2 Stacked Stories on Right */}
                    <InitialStoriesHero
                      leadStory={leadArticle}
                      subLeadStory={subLeadArticle}
                      secondaryStory1={secondaryStory1}
                      secondaryStory2={secondaryStory2}
                      onSelectArticle={handleSelectArticle}
                      language={language}
                      onSelectCategory={(cat) => {
                        setActiveTab(cat.toUpperCase());
                        setSelectedArticle(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />

                    {/* 2. LOWER SECTION: BONDS & FOREX COLUMN (LEFT) + NEWS STREAM (RIGHT) (Matches Screenshot 2) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left Column: Bonds & Forex Column (Hidden on mobile so it only displays at bottom of page on mobile) */}
                      <div className="hidden lg:flex w-full lg:col-span-4 flex-col space-y-4">
                        <BondsForexSidebar
                          articles={filteredArticles}
                          onSelectArticle={handleSelectArticle}
                          language={language}
                        />
                      </div>

                      {/* Right Column: Editorial News Stream (Headline Left, Thumbnail Right) */}
                      <div className="w-full lg:col-span-8 flex flex-col space-y-4">
                        <EditorialNewsGrid
                          articles={feedArticles}
                          onSelectArticle={handleSelectArticle}
                          language={language}
                          onSelectCategory={(cat) => {
                            setActiveTab(cat.toUpperCase());
                            setSelectedArticle(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onNavigateToAdCenter={() => {
                            setActiveTab('ad_center');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onNavigateToAllStories={() => {
                            setActiveTab('all_stories');
                            setCurrentPage(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 4. Categorized Story Groups of Three (Economy, Markets, Policy, Trade) */}
              <div className="space-y-10 mt-12 sm:mt-16 pt-8 sm:pt-10 border-t-2 border-slate-200 w-full max-w-full overflow-hidden">
                <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 w-full">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-slate-900 break-words">
                      {getUIText('categorizedNewsDesk', language)}
                    </h2>
                    <p className="text-xs text-slate-500 font-sans mt-0.5 break-words">
                      {getUIText('categorizedDesc', language)}
                    </p>
                  </div>
                  <span className="bg-[#0284C7] text-white text-[11px] sm:text-xs font-mono font-extrabold px-3 py-1 rounded-xs uppercase shrink-0 whitespace-nowrap self-start sm:self-auto">
                    {getUIText('categoryHighlights', language)}
                  </span>
                </div>

                {[
                  { id: 'MARKETS', name: getUIText('tabMarkets', language), icon: BarChart2, color: 'text-emerald-600', desc: getUIText('descMarkets', language) },
                  { id: 'FINANCE', name: getUIText('tabFinance', language), icon: Briefcase, color: 'text-indigo-600', desc: getUIText('descFinance', language) },
                  { id: 'SERVICES', name: getUIText('tabServices', language), icon: TrendingUp, color: 'text-sky-600', desc: getUIText('descServices', language) },
                  { id: 'INDUSTRY', name: getUIText('tabIndustry', language), icon: BarChart2, color: 'text-teal-600', desc: getUIText('descIndustry', language) },
                  { id: 'GOVERNANCE', name: getUIText('tabGovernance', language), icon: MessageSquare, color: 'text-amber-600', desc: getUIText('descGovernance', language) },
                  { id: 'OPINION', name: getUIText('tabOpinion', language), icon: MessageSquare, color: 'text-rose-600', desc: getUIText('descOpinion', language) },
                  { id: 'WORLD', name: getUIText('tabWorld', language), icon: Newspaper, color: 'text-[#0284C7]', desc: getUIText('descWorld', language) },
                ].map((cat) => {
                  const CatIcon = cat.icon;
                  const catStories = filteredArticles
                    .filter((a) => {
                      const c = (a.primary_category || '').toLowerCase();
                      const target = cat.id.toLowerCase();
                      return c === target ||
                        (target === 'finance' && (c === 'trade' || c === 'banking' || c === 'finance')) ||
                        (target === 'governance' && (c === 'policy' || c === 'governance')) ||
                        (target === 'opinion' && (c === 'opinion' || c === 'editorial' || c === 'analysis')) ||
                        (target === 'services' && (c === 'services' || c === 'tech' || c === 'tourism')) ||
                        (target === 'industry' && (c === 'industry' || c === 'manufacturing')) ||
                        (target === 'world' && (c === 'world' || c === 'international' || c === 'global'));
                    })
                    .slice(0, 4);

                  if (catStories.length === 0) return null;

                  return (
                    <div key={cat.id} className="bg-white p-3.5 sm:p-6 border border-slate-200 shadow-2xs space-y-5 rounded-xs w-full max-w-full overflow-hidden">
                      {/* Category Section Header */}
                      <div className="flex items-center justify-between border-b pb-3 border-slate-200 gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <CatIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.color} shrink-0`} />
                          <div className="min-w-0">
                            <h3 className="font-sans font-extrabold text-lg sm:text-xl uppercase tracking-tight text-slate-900 truncate">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-slate-500 truncate max-w-md">{cat.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab(cat.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-[#0284C7] hover:text-sky-800 uppercase tracking-wider transition cursor-pointer shrink-0 whitespace-nowrap"
                        >
                          <span>{getUIText('exploreCategoryPrefix', language)} {cat.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 2 by 2 Grid on Desktop (4 stories), 1-Column Stack on Mobile */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full">
                        {catStories.map((story) => {
                          const trStory = translateArticleData(story, language);
                          const authorName =
                            story.authors && story.authors.length > 0
                              ? story.authors.map((a) => `${a.first_name || ''} ${a.last_name || ''}`.trim()).filter(Boolean).join(', ')
                              : null;

                          const formattedDate = story.published_at
                            ? new Date(story.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                            : 'AUG 21, 2026';

                          return (
                            <div
                              key={story.article_id}
                              onClick={() => handleSelectArticle(story)}
                              className="group bg-white border border-slate-200 hover:border-[#0284C7] p-2.5 sm:p-3.5 transition cursor-pointer flex flex-row gap-3 sm:gap-3.5 items-start shadow-2xs hover:shadow-md rounded-xs h-full w-full min-w-0 overflow-hidden"
                            >
                              {story.featured_image_url && (
                                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-28 overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group-hover:border-sky-300 transition">
                                  <img
                                    src={story.featured_image_url}
                                    alt={trStory.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0 space-y-1 flex flex-col justify-between h-full overflow-hidden">
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="bg-sky-100 text-[#0284C7] text-[8.5px] sm:text-[9.5px] font-mono font-extrabold px-1.5 py-0.5 uppercase tracking-wider inline-block truncate max-w-[120px]">
                                      {translateCategory(story.primary_category, language)}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono shrink-0">
                                      {story.published_at ? new Date(story.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TODAY'}
                                    </span>
                                  </div>
                                  <h4 className="font-sans font-bold text-[14.5px] sm:text-[15px] md:text-[15.5px] leading-[1.25] tracking-[-0.01em] text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2 break-words">
                                    {trStory.title}
                                  </h4>
                                  <div className="text-[8.5px] sm:text-[9.5px] text-slate-500 font-mono uppercase tracking-wide truncate">
                                    ON: {formattedDate}
                                  </div>
                                  <p className="hidden sm:block text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-editorial-body break-words">
                                    {trStory.deck}
                                  </p>
                                </div>

                                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px] sm:text-[10.5px] text-slate-500 font-sans mt-2 gap-1 w-full overflow-hidden">
                                  <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                                    <span className="font-semibold text-slate-600 flex items-center gap-1 shrink-0">
                                      <Clock className="w-2.5 h-2.5 text-[#0284C7]" />
                                      {story.reading_time_minutes || 3}m
                                    </span>
                                    {authorName && (
                                      <>
                                        <span className="text-slate-300 shrink-0">•</span>
                                        <span className="text-slate-600 font-medium truncate max-w-[70px] sm:max-w-[110px]">
                                          {authorName}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <span className="text-[#0284C7] font-mono font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                                    {getUIText('readStory', language)} →
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Button at bottom of category group */}
                      <div className="flex justify-center pt-2 w-full px-2">
                        <button
                          onClick={() => {
                            setActiveTab(cat.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full sm:w-auto text-center justify-center flex items-center gap-2 bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xs transition shadow-2xs cursor-pointer max-w-full"
                        >
                          <span className="truncate max-w-[280px] sm:max-w-md">{getUIText('clickForMorePrefix', language)} {cat.name} {getUIText('newsSuffix', language)}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 5. MOBILE & TABLET ONLY: Bonds, Forex & Treasury Bills at the bottom of the page */}
              <div className="block lg:hidden pt-6">
                <BondsForexSidebar
                  articles={filteredArticles}
                  onSelectArticle={handleSelectArticle}
                  language={language}
                />
              </div>
            </div>

            {/* Right Side Column */}
            <RightSidebar
              articles={articles}
              marketStories={articles}
              onSelectArticle={handleSelectArticle}
              themeStyle={themeStyle}
              language={language}
              onOpenSubscribeModal={() => setIsSubscriptionModalOpen(true)}
              onNavigateToAdCenter={handleNavigateToAdCenter}
              onNavigateToInkCanvas={() => {
                setActiveTab('lanka_ink');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
            />
          </div>
        ) : activeTab === 'all_stories' ? (
          /* ALL STORIES TAB: Complete Cloud Dispatch Stream with Page Number Pagination & Arrow Flip Buttons */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-1 w-full space-y-6">
                {/* All Stories Title Banner */}
                <div className="flex items-center justify-between border-b-2 border-[#0284C7] pb-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-3xl uppercase tracking-tight text-slate-900">
                      {getUIText('titleAllStories', language)}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      Curated economic insights, financial markets, policy analyses, and business dispatches across Sri Lanka
                    </p>
                  </div>
                  <span className="text-xs font-mono font-extrabold bg-[#0284C7] text-white px-3 py-1.5 rounded-xs uppercase whitespace-nowrap">
                    {filteredArticles.length} Dispatches
                  </span>
                </div>

                {/* Paginated Stories Feed */}
                {(() => {
                  const ITEMS_PER_PAGE = 15;
                  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
                  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                  return (
                    <div className="space-y-6">
                      {paginatedArticles.length > 0 ? (
                        paginatedArticles.map((article, idx) => (
                          <React.Fragment key={article.article_id}>
                            <ArticleCard
                              article={article}
                              onSelectArticle={handleSelectArticle}
                              language={language}
                              isLoggedIn={isLoggedIn}
                              themeStyle={themeStyle}
                              onSelectCategory={(cat) => {
                                setActiveTab(cat.toUpperCase());
                                setSelectedArticle(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            />

                            {/* Inject Inline Partner Spotlight after 2nd story on first page */}
                            {idx === 1 && currentPage === 1 && (
                              <HorizontalAdBanner
                                language={language}
                                onNavigateToAdCenter={() => setActiveTab('ad_center')}
                                slotLocation="feed_inline_1"
                                slotId="all_stories_inline_1"
                              />
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="bg-white p-8 text-center border border-slate-200 my-4 text-slate-600 text-sm">
                          No stories published yet.
                        </div>
                      )}

                      {/* PAGINATION BAR MATCHING SPECIFIED SPECIFICATION */}
                      <PaginationBar
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        showingText={`${getUIText('showingStories', language)} ${startIndex + 1} ${getUIText('to', language)} ${Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)} ${getUIText('of', language)} ${filteredArticles.length}`}
                      />
                    </div>
                  );
                })()}
              </div>

              {/* Right Side Column */}
              <RightSidebar
                articles={articles}
                marketStories={articles}
                onSelectArticle={handleSelectArticle}
                themeStyle={themeStyle}
                language={language}
                onOpenSubscribeModal={() => setIsSubscriptionModalOpen(true)}
                onNavigateToAdCenter={handleNavigateToAdCenter}
                onNavigateToInkCanvas={() => {
                  setActiveTab('lanka_ink');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
              />
            </div>
          </div>
        ) : (
          /* CATEGORY TABS (Economy, Markets, Opinion & Policy, Finance & Trade): Clean List without Hero Lead Banner, with Pagination System */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-1 w-full space-y-6">
                {/* Category Page Title */}
                <div className="flex items-center justify-between border-b-2 border-[#0284C7] pb-2">
                  <h3 className="font-sans font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                    {activeTab === 'MARKETS'
                      ? getUIText('titleMarkets', language)
                      : activeTab === 'FINANCE'
                      ? getUIText('titleFinance', language)
                      : activeTab === 'SERVICES'
                      ? getUIText('titleServices', language)
                      : activeTab === 'INDUSTRY'
                      ? getUIText('titleIndustry', language)
                      : activeTab === 'GOVERNANCE'
                      ? getUIText('titleGovernance', language)
                      : activeTab === 'OPINION'
                      ? getUIText('titleOpinion', language)
                      : activeTab === 'WORLD'
                      ? getUIText('titleWorld', language)
                      : activeTab === 'ECONOMY'
                      ? getUIText('titleEconomy', language)
                      : activeTab === 'POLICY'
                      ? getUIText('titlePolicy', language)
                      : activeTab === 'TRADE'
                      ? getUIText('titleTrade', language)
                      : activeTab === 'BANKING'
                      ? getUIText('titleFinance', language)
                      : activeTab === 'econ_academy'
                      ? getUIText('titleEconAcademy', language)
                      : activeTab === 'lanka_ink'
                      ? getUIText('titleLankaInk', language)
                      : `${activeTab} Dispatches & Analysis`}
                  </h3>
                  <span className="text-xs font-mono font-extrabold bg-sky-100 text-[#0284C7] px-2.5 py-1 rounded-xs uppercase">
                    {filteredArticles.length} Stories Available
                  </span>
                </div>

                {/* Stories List (Paginated) */}
                {(() => {
                  const ITEMS_PER_PAGE = 15;
                  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
                  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                  return (
                    <div className="space-y-6">
                      {paginatedArticles.length > 0 ? (
                        paginatedArticles.map((article, idx) => (
                          <React.Fragment key={article.article_id}>
                            <ArticleCard
                              article={article}
                              onSelectArticle={handleSelectArticle}
                              language={language}
                              isLoggedIn={isLoggedIn}
                              themeStyle={themeStyle}
                              onSelectCategory={(cat) => {
                                setActiveTab(cat.toUpperCase());
                                setSelectedArticle(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            />

                            {/* Inject Inline Partner Spotlight after 2nd story on first page */}
                            {idx === 1 && currentPage === 1 && (
                              <HorizontalAdBanner
                                language={language}
                                onNavigateToAdCenter={() => setActiveTab('ad_center')}
                                slotLocation="feed_inline_1"
                                slotId="category_feed_inline_1"
                              />
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="bg-white p-8 text-center border border-slate-200 my-4 text-slate-600 text-sm">
                          No dispatches found under <strong>{activeTab}</strong>.
                        </div>
                      )}

                      {/* PAGINATION BAR MATCHING SPECIFIED SPECIFICATION */}
                      <PaginationBar
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 200, behavior: 'smooth' });
                        }}
                        showingText={`${getUIText('showingStories', language)} ${startIndex + 1} ${getUIText('to', language)} ${Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)} ${getUIText('of', language)} ${filteredArticles.length}`}
                      />
                    </div>
                  );
                })()}
              </div>

              {/* Right Side Column */}
              <RightSidebar
                onOpenSubscribeModal={() => setIsSubscriptionModalOpen(true)}
                onNavigateToAdCenter={handleNavigateToAdCenter}
                onNavigateToInkCanvas={() => setActiveTab('lanka_ink')}
                marketStories={articles}
                onSelectArticle={handleSelectArticle}
                themeStyle={themeStyle}
                language={language}
              />
            </div>
          </div>
        )}
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          setIsSubscriptionModalOpen(false);
          setLockedArticleTitle(null);
        }}
        isMeteredTriggered={isMeteredPaywallTriggered}
        articlesReadCount={readArticlesCount}
        lockedArticleTitle={lockedArticleTitle}
        onOpenSubscriberPreferences={openSubscriberPreferences}
        onSubscriptionSuccess={(sub) => {
          setIsSubscriber(true);
          safeSetStorage('lankaecon_is_subscriber', 'true');
        }}
      />

      {/* Subscriber Email Alerts Notification Preferences Modal */}
      <SubscriberPreferencesModal
        isOpen={isSubscriberPreferencesOpen}
        onClose={() => setIsSubscriberPreferencesOpen(false)}
        initialTab={subscriberPreferencesTab}
        onOpenSubscriptionModal={() => {
          setIsSubscriberPreferencesOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
      />

      {/* WhatsApp Broadcast Channel Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Staff Instagram Story Generator Modal */}
      <InstagramStoryModal
        article={selectedIgStoryArticle}
        isOpen={Boolean(selectedIgStoryArticle)}
        initialMode={igStoryInitialMode}
        onClose={() => setSelectedIgStoryArticle(null)}
        onOpenSummaryStoryPage={(art) => {
          setSelectedIgStoryArticle(null);
          handleOpenSummaryStoryPage(art);
        }}
      />

      {/* Staff & Executive AI Analyst Dashboard */}
      <AiExecutiveAnalystDashboard
        isOpen={isExecutiveAnalystOpen}
        onClose={() => setIsExecutiveAnalystOpen(false)}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onOpenStaffPortal={() => setActiveTab('staff_portal')}
        language={language}
      />

      {/* AI Financial Analyst RAG Chat Drawer */}
      <FinancialAnalystChat
        isOpen={isAnalystChatOpen}
        onClose={() => setIsAnalystChatOpen(false)}
        language={language}
      />

      {/* Broadsheet Footer */}
      <Footer
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubscriberPreferences={openSubscriberPreferences}
        language={language}
      />

      {/* Floating Scroll to Top Up-Arrow Button */}
      <ScrollToTopButton />
    </div>
  );
}
