// src/utils/translations.ts
// Comprehensive Translation Dictionary and Instant Translation Engine for LankaEcon / EconMatrix (English, Sinhala, Tamil)

import { translateFinancialArticle } from './financialTranslator';

export type Language = 'en' | 'si' | 'ta';

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Branding
    siteName: "ECON MATRIX",
    tagline: "Sri Lanka's Premier Financial & Macroeconomic Intelligence Desk",
    officialDispatchChannels: "OFFICIAL DISPATCH CHANNELS:",
    joinWhatsapp: "Join WhatsApp Groups",
    aiAnalyst: "AI Analyst",
    searchPlaceholder: "Search stories, tickers, CSE indices...",
    liveCseDesk: "LIVE CSE & CBSL DESK",
    
    // Category Tabs
    tabHome: "HOME",
    tabAllStories: "All Stories",
    tabMarkets: "MARKETS",
    tabFinance: "FINANCE",
    tabServices: "SERVICES",
    tabIndustry: "INDUSTRY",
    tabGovernance: "GOVERNANCE",
    tabOpinion: "OPINION",
    tabWorld: "WORLD",
    tabEconAcademy: "ECON ACADEMY",
    tabLankaInk: "INK & CANVAS",
    tabEconomy: "Economy",
    tabPolicy: "Policy",
    tabTrade: "Trade",
    tabAdCenter: "Advertise",
    tabContacts: "Contact",
    tabStaffPortal: "Staff CMS",
    
    // Category Descriptions
    descMarkets: "Colombo Stock Exchange (CSE), Equity, Forex & Sovereign Bonds",
    descFinance: "Commercial Banking, Interest Rates & Capital Markets",
    descServices: "IT Services, Tourism, Logistics & Telecommunications",
    descIndustry: "Manufacturing, Apparel, Exports & Energy Sector",
    descGovernance: "Public Policy, Fiscal Reforms & Legislative Frameworks",
    descOpinion: "Executive Commentary, Editorials & Macro Thought Leadership",
    descWorld: "Global Markets, IMF, Federal Reserve & International Trade",

    // Page Titles & Section Headers
    titleAllStories: "All Market & Macro Dispatches",
    titleEconomy: "Economy & Macroeconomic Dispatches",
    titleMarkets: "Markets & Colombo Stock Exchange Dispatches",
    titleFinance: "Finance, Banking & Capital Markets Intelligence",
    titleServices: "Services, Technology & Tourism Dispatches",
    titleIndustry: "Industry, Manufacturing & Energy Intelligence",
    titleGovernance: "Governance, Public Policy & Legal Dispatches",
    titleOpinion: "Opinion, Editorials & Expert Commentary",
    titleWorld: "World & Global Economic Intelligence",
    titlePolicy: "Opinion, Policy & Governance Analyses",
    titleTrade: "Finance, Banking & Trade Intelligence",
    titleEconAcademy: "Econ Academy Financial Education",
    titleLankaInk: "Ink & Canvas Cultural Dispatches",
    titleHomeLead: "Lead Dispatches & Strategic Intelligence",
    
    // Home Page Subheadings
    leadStoryDispatch: "★ LEAD STORY DISPATCH",
    breakingNews: "🚨 BREAKING NEWS",
    editorialSpotlight: "Curated Editorial Spotlight",
    newestDispatches: "NEWEST DISPATCHES",
    liveBackendSync: "Live Backend Sync",
    mostRecent5Stories: "Most Recent 5 Stories",
    mostRecentDesc: "Automatically displaying the 5 newest news reports uploaded to the LankaEcon backend desk",
    newestStoriesCount: "Newest Stories",
    clickForAllStories: "CLICK FOR ALL STORIES",
    categorizedNewsDesk: "Categorized News Desk",
    categoryHighlights: "Category Highlights",
    categorizedDesc: "Curated economic insights, financial markets, policy analyses, and business dispatches across Sri Lanka",
    exploreCategoryPrefix: "Explore",
    clickForMorePrefix: "Click for more",
    newsSuffix: "news",
    editorialDispatches: "EDITORIAL DISPATCHES & COVERAGE",
    fullWidthStream: "Full Width Stream",
    featuredSponsor: "FEATURED SPONSOR",
    visit: "Visit",
    macroDeskHeader: "Macroeconomic Desk & Treasury Yields",
    bottomSummaryBox: "Bottom Summary Box",
    dispatchesCount: "Dispatches",
    sponsoredBriefing: "SPONSORED BRIEFING",
    exploreSolution: "Explore Solution",
    desk: "LankaEcon Intelligence Desk",
    bondsAndForexDesk: "BONDS, FOREX & TREASURY DESK",
    marketIntelligence: "MARKET INTELLIGENCE",
    
    // Ticker & Badges
    breakingDispatch: "BREAKING DISPATCH",
    leadDispatch: "LEAD DISPATCH",
    subscribersOnly: "SUBSCRIBERS EXCLUSIVE",
    proExclusive: "PRO EXCLUSIVE",
    readTime: "min read",
    edgeCached: "EDGE CACHED (CMB-1)",
    liveGrounding: "Live Grounding",
    syncingCse: "Syncing CSE...",
    
    // Buttons & Actions
    readFullDispatch: "Read Full Dispatch",
    readArticle: "Read Article",
    readStory: "Read Story",
    listenAudio: "Listen Audio",
    stopAudio: "Stop Audio",
    aiKeyPoints: "AI Key Points",
    shareStory: "Share",
    bookmarkStory: "Bookmark",
    likeStory: "Like",
    viewIgStory: "View Visual Brief",
    backToStories: "Back to All Stories",
    backToFeed: "Back to Newsfeed",
    subscribe: "SUBSCRIBE",
    advertise: "ADVERTISE",
    
    // Reader & Controls
    readingProgress: "Reading Progress",
    fontSize: "Font Size",
    nightReader: "Night Mode",
    dayReader: "Day Mode",
    copiedToClipboard: "Link copied to clipboard!",
    addComment: "Add Executive Comment",
    submitComment: "Post Comment",
    commentsHeading: "Executive Comments & Market Reactions",
    relatedStories: "Related Dispatches & Financial Reports",
    
    // Pagination & Navigation
    page: "Page",
    of: "of",
    showingStories: "Showing stories",
    to: "to",
    prevPage: "Prev",
    nextPage: "Next",
    firstPage: "First",
    lastPage: "Last",
    
    // Sidebar
    lkrRates: "LKR Exchange Rates (CBSL / Interbank)",
    buyRate: "Buy",
    sellRate: "Sell",
    topMarketStories: "Top CSE & Macro Stories",
    subscribePrompt: "LankaEcon Intelligence Pro",
    subscribeDesc: "Unlock daily institutional macroeconomic reports, tariff yield models, and CSE stock deep dives.",
    subscribeBtn: "Subscribe Now ($15/mo)",
    adCenter: "Advertise with LankaEcon",
    
    // Econ Academy & Lanka Ink
    econAcademyTitle: "Academic Economics & University Research Hub",
    econAcademyDesc: "Free open-access lectures, peer-reviewed macro treatises, university textbooks, and video masterclasses.",
    lankaInkTitle: "Ink & Canvas — Sri Lanka Cultural & Literary Dispatches",
    lankaInkDesc: "Stories, poetry, artisan mastercrafts, and cultural essays from across Sri Lanka.",
    
    // Footer
    aboutLankaEcon: "LankaEcon is Sri Lanka's leading independent financial, macroeconomic, and Colombo Stock Exchange dispatch platform.",
    quickLinks: "Quick Navigation",
    rightsReserved: "All Rights Reserved. Verified Financial Journalism.",
    termsPrivacy: "Privacy Policy | Terms of Service | Editorial Ethics",

    // Market & Live Widget UI
    colomboStockExchange: "Colombo Stock Exchange (CSE)",
    aspiIndex: "ASPI Index",
    snpIndex: "S&P SL20 Index",
    turnover: "Turnover",
    trades: "Trades",
    marketClosed: "Market Closed",
    marketOpen: "Market Open",
    refreshCseData: "Refresh CSE Data",
    shareOnWhatsApp: "Share on WhatsApp",
    copyLink: "Copy Link",
    copiedLink: "Copied Link",
    proAccess: "PRO ACCESS",
    subscribeFullDispatches: "Subscribe for Full Unrestricted LankaEcon Dispatches",
    getCompleteAccess: "Get complete access to paywalled analysis, breaking CSE market reports, and daily WhatsApp dispatches.",
  },

  si: {
    // Top Bar & Branding
    siteName: "ඊකොන් මැට්‍රික්ස්",
    tagline: "ශ්‍රී ලංකාවේ අංක 1 මූල්‍ය හා සාර්ව ආර්ථික විශ්ලේෂණ පුවත් සේවය",
    officialDispatchChannels: "නිල පුවත් නාලිකා:",
    joinWhatsapp: "WhatsApp සමූහයට එක්වන්න",
    aiAnalyst: "AI විශ්ලේෂක",
    searchPlaceholder: "පුවත්, කොටස් වෙළඳපොළ, CSE තොරතුරු සොයන්න...",
    liveCseDesk: "සජීවී කොටස් වෙළඳපොළ සහ මහ බැංකු තොරතුරු",
    
    // Category Tabs
    tabHome: "මුල් පිටුව",
    tabAllStories: "සියලු පුවත්",
    tabMarkets: "කොටස් වෙළඳපොළ",
    tabFinance: "මූල්‍ය",
    tabServices: "සේවා",
    tabIndustry: "කර්මාන්ත",
    tabGovernance: "පාලනය & රාජ්‍ය",
    tabOpinion: "මත සහ විශ්ලේෂණ",
    tabWorld: "ලෝක පුවත්",
    tabEconAcademy: "ඊකොන් ඇකඩමිය",
    tabLankaInk: "ඉන්ක් සහ කැන්වස්",
    tabEconomy: "ආර්ථිකය",
    tabPolicy: "රාජ්‍ය ප්‍රතිපත්ති",
    tabTrade: "වෙළඳාම",
    tabAdCenter: "දැන්වීම් පළ කරන්න",
    tabContacts: "සබඳතා",
    tabStaffPortal: "මාධ්‍ය පද්ධතිය",

    // Category Descriptions
    descMarkets: "කොළඹ කොටස් වෙළෙඳපොළ (CSE), කොටස්, විදේශ විනිමය සහ රාජ්‍ය බැඳුම්කර",
    descFinance: "වාණිජ බැංකුකරණය, පොලී අනුපාත සහ ප්‍රාග්ධන වෙළෙඳපොළ",
    descServices: "තොරතුරු තාක්ෂණ සේවා, සංචාරක, ලොජිස්ටික්ස් සහ සන්නිවේදන",
    descIndustry: "නිෂ්පාදන, ඇඟලුම්, අපනයන සහ බලශක්ති ක්ෂේත්‍රය",
    descGovernance: "රාජ්‍ය ප්‍රතිපත්ති, මූල්‍ය ප්‍රතිසංස්කරණ සහ නීතිමය රාමුව",
    descOpinion: "කර්තෘ වාක්‍ය, විද්වත් මත සහ සාර්ව ආර්ථික විශ්ලේෂණ",
    descWorld: "ගෝලීය වෙළෙඳපොළ, IMF, ෆෙඩරල් රිසර්ව් සහ ජාත්‍යන්තර වෙළඳාම",
    
    // Page Titles & Section Headers
    titleAllStories: "සියලුම ආර්ථික හා මූල්‍ය පුවත් වාර්තා",
    titleEconomy: "සාර්ව ආර්ථික පුවත් සහ පර්යේෂණ",
    titleMarkets: "කොළඹ කොටස් වෙළෙඳපොළ සහ මූල්‍ය පුවත්",
    titleFinance: "මූල්‍ය හා බැංකු ක්ෂේත්‍රයේ විශ්ලේෂණ",
    titleServices: "සේවා, තාක්ෂණ සහ සංචාරක පුවත්",
    titleIndustry: "කර්මාන්ත, නිෂ්පාදන හා බලශක්ති පුවත්",
    titleGovernance: "පාලනය, රාජ්‍ය ප්‍රතිපත්ති හා නීතිමය පුවත්",
    titleOpinion: "මත, කර්තෘ වාක්‍ය හා විද්වත් විශ්ලේෂණ",
    titleWorld: "ලෝක හා ජාත්‍යන්තර ආර්ථික පුවත්",
    titlePolicy: "රාජ්‍ය ප්‍රතිපත්ති සහ පාලන විශ්ලේෂණ",
    titleTrade: "මුදල්, බැංකු සහ ජාත්‍යන්තර වෙළඳ පුවත්",
    titleEconAcademy: "ඊකොන් ඇකඩමිය මුල්‍ය අධ්‍යාපන පාඨමාලා",
    titleLankaInk: "ඉන්ක් සහ කැන්වස් සංස්කෘතික පුවත්",
    titleHomeLead: "ප්‍රධාන පුවත් සහ උපායමාර්ගික විශ්ලේෂණ",
    
    // Home Page Subheadings
    leadStoryDispatch: "★ ප්‍රධාන පුවත් වාර්තාව",
    breakingNews: "🚨 උණුසුම් පුවත්",
    editorialSpotlight: "කර්තෘ මණ්ඩල විශේෂ විශ්ලේෂණය",
    newestDispatches: "නවතම පුවත් වාර්තා",
    liveBackendSync: "සජීවී යාවත්කාලීන කිරීම්",
    mostRecent5Stories: "නවතම පුවත් 5",
    mostRecentDesc: "ලංකාඊකොන් පුවත් පද්ධතියට එක් කරන ලද නවතම ආර්ථික වාර්තා 5 මෙහි දැක්වේ",
    newestStoriesCount: "නවතම පුවත්",
    clickForAllStories: "සියලුම පුවත් බලන්න",
    categorizedNewsDesk: "වර්ගීකරණය කළ පුවත් අංශය",
    categoryHighlights: "විශේෂ අංශ",
    categorizedDesc: "ශ්‍රී ලංකාවේ ආර්ථික, කොටස් වෙළඳපොළ, රාජ්‍ය ප්‍රතිපත්ති සහ වෙළඳ පුවත් පර්යේෂණ",
    exploreCategoryPrefix: "වැඩිදුර තොරතුරු",
    clickForMorePrefix: "තවත්",
    newsSuffix: "පුවත් කියවන්න",
    editorialDispatches: "කර්තෘ මණ්ඩල පුවත් අංශය",
    fullWidthStream: "සම්පූර්ණ පුවත් ප්‍රවාහය",
    featuredSponsor: "විශේෂිත අනුග්‍රාහකයා",
    visit: "වෙබ් අඩවියට යන්න",
    macroDeskHeader: "සාර්ව ආර්ථික පුවත් පීඨය සහ භාණ්ඩාගාර ඵලදායිතා",
    bottomSummaryBox: "ප්‍රධාන සාරාංශය",
    dispatchesCount: "පුවත් වාර්තා",
    sponsoredBriefing: "අනුග්‍රාහක පුවත් සාරාංශය",
    exploreSolution: "වැඩිදුර බලන්න",
    desk: "ලංකාඊකොන් පුවත් අංශය",
    bondsAndForexDesk: "බැඳුම්කර, විදේශ විනිමය සහ භාණ්ඩාගාර අංශය",
    marketIntelligence: "වෙළෙඳපොළ තොරතුරු",
    
    // Ticker & Badges
    breakingDispatch: "උණුසුම් පුවත්",
    leadDispatch: "ප්‍රධාන පුවත",
    subscribersOnly: "ග්‍රාහකයින්ට පමණි",
    proExclusive: "විශේෂිත ග්‍රාහක පුවත",
    readTime: "මිනිත්තු කියවීම",
    edgeCached: "සක්ෂම සම්බන්ධතාවය (CMB-1)",
    liveGrounding: "සජීවී යාවත්කාලීන",
    syncingCse: "CSE දත්ත ලබා ගනිමින්...",
    
    // Buttons & Actions
    readFullDispatch: "සම්පූර්ණ පුවත කියවන්න",
    readArticle: "පුවත කියවන්න",
    readStory: "පුවත කියවන්න",
    listenAudio: "සවන් දෙන්න",
    stopAudio: "නතර කරන්න",
    aiKeyPoints: "AI ප්‍රධාන කරුණු",
    shareStory: "බෙදාගන්න",
    bookmarkStory: "සුරකින්න",
    likeStory: "කැමැත්ත",
    viewIgStory: "දෘශ්‍ය විස්තරය",
    backToStories: "සියලු පුවත් වෙත ආපසු",
    backToFeed: "ප්‍රධාන පුවත් ප්‍රවාහය වෙත",
    subscribe: "ලියාපදිංචි වන්න",
    advertise: "දැන්වීම්",
    
    // Reader & Controls
    readingProgress: "කියවීමේ ප්‍රගතිය",
    fontSize: "අකුරු ප්‍රමාණය",
    nightReader: "රාත්‍රී මාදිලිය",
    dayReader: "දවාල මාදිලිය",
    copiedToClipboard: "සබැඳිය පිටපත් කරගන්නා ලදී!",
    addComment: "ඔබේ අදහස එක් කරන්න",
    submitComment: "අදහස පළ කරන්න",
    commentsHeading: "පාඨක අදහස් සහ ආර්ථික විශ්ලේෂණ",
    relatedStories: "ආශ්‍රිත පුවත් සහ මූල්‍ය වාර්තා",
    
    // Pagination & Navigation
    page: "පිටුව",
    of: "අතුරින්",
    showingStories: "පෙන්වන පුවත්",
    to: "සිට",
    prevPage: "පෙර පිටුව",
    nextPage: "ඊළඟ පිටුව",
    firstPage: "මුල්ම පිටුව",
    lastPage: "අවසාන පිටුව",
    
    // Sidebar
    lkrRates: "ශ්‍රී ලංකා රුපියල් විදේශ විනිමය අනුපාත (CBSL)",
    buyRate: "ගැනුම්",
    sellRate: "විකුණුම්",
    topMarketStories: "ප්‍රධාන කොටස් වෙළඳපොළ පුවත්",
    subscribePrompt: "ලංකාඊකොන් ප්‍රෝ සේවාව",
    subscribeDesc: "ආයතනික සාර්ව ආර්ථික වාර්තා, බදු ආකෘති සහ CSE පර්යේෂණ සඳහා ලියාපදිංචි වන්න.",
    subscribeBtn: "දැන් ග්‍රාහක වන්න ($15/මස)",
    adCenter: "ලංකාඊකොන් හි දැන්වීම් පළ කරන්න",
    
    // Econ Academy & Lanka Ink
    econAcademyTitle: "විශ්වවිද්‍යාල ආර්ථික විද්‍යා සහ පර්යේෂණ පීඨය",
    econAcademyDesc: "නොමිලේ ලබාගත හැකි දේශන, පර්යේෂණ පත්‍රිකා, අධ්‍යයන පොත්පත් සහ වීඩියෝ පාඨමාලා.",
    lankaInkTitle: "ඉන්ක් සහ කැන්වස් — ශ්‍රී ලාංකේය සංස්කෘතික හා සාහිත්‍ය පුවත්",
    lankaInkDesc: "කෙටිකතා, කවි, හස්ත කර්මාන්ත සහ සංස්කෘතික ලිපි එකතුව.",
    
    // Footer
    aboutLankaEcon: "ලංකාඊකොන් යනු ශ්‍රී ලංකාවේ ප්‍රමුඛතම ස්වාධීන මූල්‍ය, සාර්ව ආර්ථික හා කොටස් වෙළඳපොළ පුවත් සේවයයි.",
    quickLinks: "ක්‍රියාකාරී සබැඳි",
    rightsReserved: "සියලුම හිමිකම් ඇවිරිණි. තහවුරු කළ මූල්‍ය පුවත් කලාව.",
    termsPrivacy: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය | සේවා කොන්දේසි | කර්තෘ නිවේදන",

    // Market & Live Widget UI
    colomboStockExchange: "කොළඹ කොටස් වෙළෙඳපොළ (CSE)",
    aspiIndex: "සියලු කොටස් මිල දර්ශකය (ASPI)",
    snpIndex: "S&P ශ්‍රී ලංකා 20 දර්ශකය (SL20)",
    turnover: "දෛනික පිරිවැටුම",
    trades: "ගනුදෙනු සංඛ්‍යාව",
    marketClosed: "වෙළෙඳපොළ වසා ඇත",
    marketOpen: "වෙළෙඳපොළ විවෘතයි",
    refreshCseData: "CSE දත්ත යාවත්කාලීන කරන්න",
    shareOnWhatsApp: "WhatsApp ඔස්සේ බෙදාගන්න",
    copyLink: "සබැඳිය පිටපත් කරන්න",
    copiedLink: "පිටපත් කරන ලදී",
    proAccess: "ප්‍රෝ ප්‍රවේශය",
    subscribeFullDispatches: "සම්පූර්ණ පුවත් කියවීම සඳහා ලියාපදිංචි වන්න",
    getCompleteAccess: "සියලු සුවිශේෂී පුවත්, වෙළෙඳපොළ වාර්තා සහ දිනපතා WhatsApp පුවත් සේවාව වෙත ප්‍රවේශය ලබා ගන්න.",
  },

  ta: {
    // Top Bar & Branding
    siteName: "ஈகோன் மேட்ரிக்ஸ்",
    tagline: "இலங்கையின் முன்னணி நிதி மற்றும் மேக்ரோ பொருளாதார செய்திகள்",
    officialDispatchChannels: "அதிகாரப்பூர்வ தகவல் சேனல்கள்:",
    joinWhatsapp: "WhatsApp குழுவில் இணையுங்கள்",
    aiAnalyst: "AI பகுப்பாய்வாளர்",
    searchPlaceholder: "செய்திகள், பங்குகள், CSE தகவல்களைத் தேடுங்கள்...",
    liveCseDesk: "நேரலை பங்குச் சந்தை மற்றும் மத்திய வங்கி தரவு",
    
    // Category Tabs
    tabHome: "முகப்பு",
    tabAllStories: "அனைத்து செய்திகள்",
    tabMarkets: "சந்தைகள்",
    tabFinance: "நிதி",
    tabServices: "சேவைகள்",
    tabIndustry: "தொழில்துறை",
    tabGovernance: "ஆளுமை",
    tabOpinion: "கருத்து",
    tabWorld: "உலகம்",
    tabEconAcademy: "ஈகோன் அகாடமி",
    tabLankaInk: "இங்க் & கேன்வாஸ்",
    tabEconomy: "பொருளாதாரம்",
    tabPolicy: "கொள்கை",
    tabTrade: "வர்த்தகம்",
    tabAdCenter: "விளம்பரம்",
    tabContacts: "தொடர்பு",
    tabStaffPortal: "ஊடக அமைப்பு",

    // Category Descriptions
    descMarkets: "கொழும்பு பங்குச் சந்தை (CSE), பங்குகள், அந்நிய செலாவணி & பிணையங்கள்",
    descFinance: "வர்த்தக வங்கி, வட்டி விகிதங்கள் & மூலதன சந்தைகள்",
    descServices: "தகவல் தொழில்நுட்ப சேவைகள், சுற்றுலா, தளவாடங்கள் & தொலைத்தொடர்பு",
    descIndustry: "உற்பத்தி, ஆடை, ஏற்றுமதி & எரிசக்தி துறை",
    descGovernance: "பொதுக் கொள்கை, நிதிச் சீர்திருத்தங்கள் & சட்டக் கட்டமைப்பு",
    descOpinion: "நிர்வாகக் கருத்துகள், ஆசிரிய தலையங்கங்கள் & மேக்ரோ ஆய்வுகள்",
    descWorld: "உலகளாவிய சந்தைகள், IMF, பெடரல் ரிசர்வ் & சர்வதேச வர்த்தகம்",
    
    // Page Titles & Section Headers
    titleAllStories: "அனைத்து நிதி மற்றும் பொருளாதார செய்திகள்",
    titleEconomy: "மேக்ரோ பொருளாதார செய்திகள் மற்றும் ஆய்வுகள்",
    titleMarkets: "கொழும்பு பங்குச் சந்தை மற்றும் நிதிச் செய்திகள்",
    titleFinance: "நிதி மற்றும் வங்கித்துறை செய்திகள்",
    titleServices: "சேவைகள் மற்றும் தொழில்நுட்ப செய்திகள்",
    titleIndustry: "தொழில்துறை மற்றும் உற்பத்தி செய்திகள்",
    titleGovernance: "ஆளுமை மற்றும் கொள்கை ஆய்வுகள்",
    titleOpinion: "கருத்துக்கள் மற்றும் கட்டுரைகள்",
    titleWorld: "உலகளாவிய பொருளாதார செய்திகள்",
    titlePolicy: "அரசாங்கக் கொள்கை மற்றும் ஆளுமை ஆய்வுகள்",
    titleTrade: "நிதி, வங்கி மற்றும் வர்த்தக செய்திகள்",
    titleEconAcademy: "ஈகோன் அகாடமி நிதி கல்வி படிப்புகள்",
    titleLankaInk: "இங்க் & கேன்வாஸ் கலாச்சார செய்திகள்",
    titleHomeLead: "முதன்மை செய்திகள் மற்றும் மூலோபாய ஆய்வுகள்",
    
    // Home Page Subheadings
    leadStoryDispatch: "★ முதன்மை செய்தி அறிக்கை",
    breakingNews: "🚨 முக்கிய செய்தி",
    editorialSpotlight: "சிறப்பு ஆசிரியர் தேர்வு",
    newestDispatches: "சமீபத்திய செய்திகள்",
    liveBackendSync: "நேரலை புதுப்பிப்புகள்",
    mostRecent5Stories: "சமீபத்திய 5 செய்திகள்",
    mostRecentDesc: "லங்காஈகோன் செய்தி அமைப்பில் சேர்க்கப்பட்ட சமீபத்திய 5 பொருளாதார அறிக்கைகள்",
    newestStoriesCount: "புதிய செய்திகள்",
    clickForAllStories: "அனைத்து செய்திகளையும் காண்க",
    categorizedNewsDesk: "வகைப்படுத்தப்பட்ட செய்தி பிரிவு",
    categoryHighlights: "சிறப்பு பிரிவுகள்",
    categorizedDesc: "இலங்கையின் பொருளாதாரம், பங்குச் சந்தை, கொள்கை மற்றும் வர்த்தக ஆய்வுகள்",
    exploreCategoryPrefix: "மேலும் அறிய",
    clickForMorePrefix: "மேலும்",
    newsSuffix: "செய்திகள்",
    editorialDispatches: "ஆசிரியர் செய்திப் பிரிவு",
    fullWidthStream: "முழு செய்தி ஓட்டம்",
    featuredSponsor: "சிறப்பு அனுசரணையாளர்",
    visit: "இணையதளத்தை பார்வையிடுங்கள்",
    macroDeskHeader: "மேக்ரோ பொருளாதாரம் & பொக்கிஷ உண்டியல் வட்டி விகிதங்கள்",
    bottomSummaryBox: "முக்கிய சுருக்கம்",
    dispatchesCount: "செய்தி அறிக்கைகள்",
    sponsoredBriefing: "அனுசரணை செய்திச் சுருக்கம்",
    exploreSolution: "மேலும் அறிய",
    desk: "லங்காஈகோன் செய்திப் பிரிவு",
    bondsAndForexDesk: "பிணையங்கள், அந்நிய செலாவணி & பொக்கிஷ உண்டியல் பிரிவு",
    marketIntelligence: "சந்தை நுண்ணறிவு",
    
    // Ticker & Badges
    breakingDispatch: "முக்கிய செய்தி",
    leadDispatch: "முதன்மை செய்தி",
    subscribersOnly: "சந்தாதாரர்களுக்கு மட்டும்",
    proExclusive: "சிறப்பு செய்தி",
    readTime: "நிமிட வாசிப்பு",
    edgeCached: "பாதுகாப்பான இணைப்பு (CMB-1)",
    liveGrounding: "நேரலை புதுப்பிப்பு",
    syncingCse: "CSE தகவல்கள் பெறப்படுகின்றன...",
    
    // Buttons & Actions
    readFullDispatch: "முழு செய்தியையும் படிக்கவும்",
    readArticle: "செய்தியை படிக்க",
    readStory: "செய்தியை படிக்க",
    listenAudio: "ஒலியைக் கேட்க",
    stopAudio: "நிறுத்து",
    aiKeyPoints: "AI முக்கிய குறிப்புகள்",
    shareStory: "பகிரவும்",
    bookmarkStory: "சேமிக்கவும்",
    likeStory: "விருப்பம்",
    viewIgStory: "காட்சி சுருக்கம்",
    backToStories: "அனைத்து செய்திகளுக்கும் திரும்பவும்",
    backToFeed: "செய்தி ஊட்டம் செல்லவும்",
    subscribe: "சந்தாதாரராகவும்",
    advertise: "விளம்பரம்",
    
    // Reader & Controls
    readingProgress: "வாசிப்பு முன்னேற்றம்",
    fontSize: "எழுத்து அளவு",
    nightReader: "இரவு முறை",
    dayReader: "பகல் முறை",
    copiedToClipboard: "இணைப்பு நகலெடுக்கப்பட்டது!",
    addComment: "உங்கள் கருத்தைப் பதிவுசெய்யவும்",
    submitComment: "கருத்தைப் பதிவிடுங்கள்",
    commentsHeading: "வாசகர் கருத்துகள் மற்றும் பொருளாதார ஆய்வுகள்",
    relatedStories: "தொடர்புடைய செய்திகள் மற்றும் நிதி அறிக்கைகள்",
    
    // Pagination & Navigation
    page: "பக்கம்",
    of: "இல்",
    showingStories: "காண்பிக்கப்படும் செய்திகள்",
    to: "முதல்",
    prevPage: "முந்தைய பக்கம்",
    nextPage: "அடுத்த பக்கம்",
    firstPage: "முதல் பக்கம்",
    lastPage: "கடைசி பக்கம்",
    
    // Sidebar
    lkrRates: "இலங்கை ரூபாய் அந்நிய செலாவணி விகிதங்கள் (CBSL)",
    buyRate: "கொள்முதல்",
    sellRate: "விற்பனை",
    topMarketStories: "முக்கிய பங்குச் சந்தை செய்திகள்",
    subscribePrompt: "லங்காஈகோன் புரோ சேவை",
    subscribeDesc: "தினசரி நிறுவன மேக்ரோ பொருளாதார அறிக்கைகள் மற்றும் CSE பங்கு ஆய்வுகளைப் பெற சந்தாதாரராகுங்கள்.",
    subscribeBtn: "இப்போதே சந்தாதாரராகுங்கள் ($15/மாதம்)",
    adCenter: "லங்காஈகோனில் விளம்பரம் செய்யுங்கள்",
    
    // Econ Academy & Lanka Ink
    econAcademyTitle: "பல்கலைக்கழக பொருளாதார மற்றும் ஆராய்ச்சி மையம்",
    econAcademyDesc: "இலவச விரிவுரைகள், ஆராய்ச்சி கட்டுரைகள், பல்கலைக்கழக புத்தகங்கள் மற்றும் வீடியோ பாடங்கள்.",
    lankaInkTitle: "இங்க் & கேன்வாஸ் — இலங்கை கலாச்சார மற்றும் இலக்கிய செய்திகள்",
    lankaInkDesc: "சிறுகதைகள், கவிதைகள், கைவினைப்பொருட்கள் மற்றும் கலாச்சார கட்டுரைகளின் தொகுப்பு.",
    
    // Footer
    aboutLankaEcon: "லங்காஈகோன் இலங்கையின் முன்னணி சுயாதீன நிதி, மேக்ரோ பொருளாதாரம் மற்றும் கொழும்பு பங்குச் சந்தை செய்தித் தளமாகும்.",
    quickLinks: "விரைவு இணைப்புகள்",
    rightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. சரிபார்க்கப்பட்ட நிதி பத்திரிகை.",
    termsPrivacy: "தனியுரிமைக் கொள்கை | சேவை விதிமுறைகள் | ஆசிரியர் ஆலோசனைகள்",

    // Market & Live Widget UI
    colomboStockExchange: "கொழும்பு பங்குச் சந்தை (CSE)",
    aspiIndex: "அனைத்து பங்கு விலைச்சுட்டி (ASPI)",
    snpIndex: "S&P இலங்கை 20 குறியீடு (SL20)",
    turnover: "பரிவர்த்தனை",
    trades: "வர்த்தகங்கள்",
    marketClosed: "சந்தை மூடப்பட்டுள்ளது",
    marketOpen: "சந்தை திறந்துள்ளது",
    refreshCseData: "CSE தரவைப் புதுப்பிக்கவும்",
    shareOnWhatsApp: "WhatsApp இல் பகிரவும்",
    copyLink: "இணைப்பை நகலெடு",
    copiedLink: "நகலெடுக்கப்பட்டது",
    proAccess: "ப்ரோ அணுகல்",
    subscribeFullDispatches: "முழு செய்திகளையும் படிக்க சந்தாதாரராகுங்கள்",
    getCompleteAccess: "அனைத்து பிரத்யேக செய்திகள், சந்தை அறிக்கைகள் மற்றும் தினசரி WhatsApp செய்தி சேவைக்கான அணுகலைப் பெறுங்கள்.",
  }
};

// Helper function to get UI string safely
export function getUIText(key: string, lang: string = 'en'): string {
  const safeLang = (lang === 'si' || lang === 'ta') ? (lang as Language) : 'en';
  return UI_TRANSLATIONS[safeLang]?.[key] || UI_TRANSLATIONS.en[key] || key;
}

// Category Translation Helper
export function translateCategory(cat: string = '', lang: string = 'en'): string {
  if (lang === 'en' || !cat) return cat;
  const upperCat = cat.toUpperCase();
  const catMapSI: Record<string, string> = {
    'ECONOMY': 'ආර්ථිකය',
    'MARKETS': 'කොටස් වෙළඳපොළ',
    'FINANCE': 'මූල්‍ය',
    'SERVICES': 'සේවා',
    'INDUSTRY': 'කර්මාන්ත',
    'GOVERNANCE': 'පාලනය',
    'OPINION': 'මත සහ විශ්ලේෂණ',
    'WORLD': 'ලෝක පුවත්',
    'POLICY': 'රාජ්‍ය ප්‍රතිපත්ති',
    'TRADE': 'වෙළඳාම',
    'BANKING': 'බැංකුකරණය',
    'ECON ACADEMY': 'ඊකොන් ඇකඩමිය',
    'INK & CANVAS': 'ඉන්ක් සහ කැන්වස්',
    'ALL STORIES': 'සියලු පුවත්',
  };
  const catMapTA: Record<string, string> = {
    'ECONOMY': 'பொருளாதாரம்',
    'MARKETS': 'சந்தைகள்',
    'FINANCE': 'நிதி',
    'SERVICES': 'சேவைகள்',
    'INDUSTRY': 'தொழில்துறை',
    'GOVERNANCE': 'ஆளுமை',
    'OPINION': 'கருத்து',
    'WORLD': 'உலகம்',
    'POLICY': 'கொள்கை',
    'TRADE': 'வர்த்தகம்',
    'BANKING': 'வங்கி',
    'ECON ACADEMY': 'ஈகோன் அகாடமி',
    'INK & CANVAS': 'இங்க் & கேன்வாஸ்',
    'ALL STORIES': 'அனைத்து செய்திகள்',
  };
  if (lang === 'si') return catMapSI[upperCat] || cat;
  if (lang === 'ta') return catMapTA[upperCat] || cat;
  return cat;
}

// Full Article Dictionary in Sinhala (SI) with Complete Translated Bodies
const articleDictSI: Record<string | number, { title: string; deck: string; body: string; category: string }> = {
  1791095288704: {
    title: "හම්බන්තොට ජාත්‍යන්තර වරාය බහාලුම් මිලියනයේ සීමාව පසුකරයි; මෙහෙයුම් ධාරිතාව 45% කින් ඉහළට",
    deck: "හම්බන්තොට ජාත්‍යන්තර වරාය (HIP) 2026 වසරේ මුල් මාස අට තුළ විසි අඩි බහාලුම් (TEU) 1,002,232 කට අධික ප්‍රමාණයක් හසුරුවමින් ශ්‍රී ලංකාවේ ප්‍රතිනැව්ගත කිරීමේ තරඟකාරීත්වයේ ඓතිහාසික සන්ධිස්ථානයක් සනිටුහන් කරයි.",
    category: "සේවා",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — හම්බන්තොට ජාත්‍යන්තර වරාය (HIP) 2026 වසරේ මුල් මාස අට තුළ විසි අඩි බහාලුම් 1,002,232 ක ප්‍රමාණයක් සාර්ථකව හසුරුවමින් සිය ඉතිහාසයේ ප්‍රථම වරට වසරක් තුළ බහාලුම් මිලියනයේ සීමාව පසුකිරීමේ ඓතිහාසික සන්ධිස්ථානයක් සනිටුහන් කර ඇත.

පසුගිය වසරේ අනුරූප කාලසීමාවට සාපේක්ෂව මෙය 45% ක සුවිශේෂී වර්ධනයක් වන අතර, ඉන්දියන් සාගර කලාපයේ ප්‍රධාන නාවික මාර්ගයේ පිහිටි උපායමාර්ගික බහාලුම් ප්‍රතිනැව්ගත කිරීමේ කේන්ද්‍රස්ථානයක් ලෙස හම්බන්තොට වරායේ කාර්යක්ෂමතාව සහ තරඟකාරීත්වය මෙමගින් මනාව තහවුරු වේ.

හම්බන්තොට ජාත්‍යන්තර වරාය සමූහයේ ප්‍රධාන විධායක නිලධාරීවරයා ප්‍රකාශ කළේ ලොව ප්‍රමුඛතම බහාලුම් නැව් සමාගම් වන MSC සහ CMA CGM හම්බන්තොට වරාය සිය නිත්‍ය ප්‍රතිනැව්ගත කිරීමේ මධ්‍යස්ථානයක් ලෙස තෝරා ගැනීම මෙම දැවැන්ත වර්ධනයට මූලික හේතුව වූ බවයි. වරාය අධිකාරිය විසින් ස්ථාපනය කරන ලද නවීන ගැන්ට්‍රි දොඹකර සහ ඩිජිටල් මෙහෙයුම් පද්ධති හරහා බහාලුම් හැසිරවීමේ වේගය ජාත්‍යන්තර ප්‍රමිතීන්ට අනුව ඉහළ නංවා ඇත.`
  },
  "hambantota-port-surpasses-one-million-container-milestone": {
    title: "හම්බන්තොට ජාත්‍යන්තර වරාය බහාලුම් මිලියනයේ සීමාව පසුකරයි; මෙහෙයුම් ධාරිතාව 45% කින් ඉහළට",
    deck: "හම්බන්තොට ජාත්‍යන්තර වරාය (HIP) 2026 වසරේ මුල් මාස අට තුළ විසි අඩි බහාලුම් (TEU) 1,002,232 කට අධික ප්‍රමාණයක් හසුරුවමින් ශ්‍රී ලංකාවේ ප්‍රතිනැව්ගත කිරීමේ තරඟකාරීත්වයේ ඓතිහාසික සන්ධිස්ථානයක් සනිටුහන් කරයි.",
    category: "සේවා",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — හම්බන්තොට ජාත්‍යන්තර වරාය (HIP) 2026 වසරේ මුල් මාස අට තුළ විසි අඩි බහාලුම් 1,002,232 ක ප්‍රමාණයක් සාර්ථකව හසුරුවමින් සිය ඉතිහාසයේ ප්‍රථම වරට වසරක් තුළ බහාලුම් මිලියනයේ සීමාව පසුකිරීමේ ඓතිහාසික සන්ධිස්ථානයක් සනිටුහන් කර ඇත.

පසුගිය වසරේ අනුරූප කාලසීමාවට සාපේක්ෂව මෙය 45% ක සුවිශේෂී වර්ධනයක් වන අතර, ඉන්දියන් සාගර කලාපයේ ප්‍රධාන නාවික මාර්ගයේ පිහිටි උපායමාර්ගික බහාලුම් ප්‍රතිනැව්ගත කිරීමේ කේන්ද්‍රස්ථානයක් ලෙස හම්බන්තොට වරායේ කාර්යක්ෂමතාව සහ තරඟකාරීත්වය මෙමගින් මනාව තහවුරු වේ.`
  },
  1791093001511: {
    title: "ඉදිරි සමාලෝචනයට පෙර ශ්‍රී ලංකාව IMF ඉලක්කවලින් 85% ක් සපුරා ගනී; ප්‍රතිසංස්කරණ වැඩසටහන නිසි මගෙහි බවට ජාත්‍යන්තර මූල්‍ය අරමුදල තහවුරු කරයි",
    deck: "දිවයිනට පැමිණි ජාත්‍යන්තර මූල්‍ය අරමුදලේ නියෝජිත පිරිස රාජ්‍ය මූල්‍ය විනය සහ රාජ්‍ය ආදායම් අතිරික්තය අගය කරන අතර බලශක්ති මිලකරණය සහ පාලන ව්‍යුහයන්ගේ ප්‍රතිසංස්කරණ කඩිනම් කරන ලෙස ඉල්ලා සිටියි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජාත්‍යන්තර මූල්‍ය අරමුදලේ (IMF) විස්තීර්ණ ණය පහසුකම් (EFF) වැඩසටහන යටතේ නියමිත ඉලක්කවලින් 85% කට අධික ප්‍රමාණයක් ශ්‍රී ලංකාව සාර්ථකව සපුරා ඇති බව නිල සමාලෝචන දූත මණ්ඩලය ප්‍රකාශ කර තිබේ.

රාජ්‍ය ආදායම් එකතු කිරීමේ ක්‍රියාවලිය ශක්තිමත් වීම, ප්‍රාථමික අයවැය අතිරික්තයක් පවත්වා ගැනීම සහ විදේශ විනිමය සංචිත අඛණ්ඩව ගොඩනැගීම සම්බන්ධයෙන් IMF නියෝජිතයින් සිය ප්‍රසාදය පළ කර ඇත.

නමුත්, රාජ්‍ය ව්‍යවසාය (SOE) ප්‍රතිව්‍යුහගත කිරීම, විදුලිබල හා බලශක්ති පිරිවැය පරාවර්තක මිල සූත්‍ර ක්‍රියාත්මක කිරීම සහ දූෂණ විරෝධී පාලන නිර්දේශ කඩිනමින් සම්පූර්ණ කිරීම ඉදිරි සමාලෝචනය සාර්ථකව අවසන් කිරීම සඳහා අත්‍යවශ්‍ය බව දූත මණ්ඩලය අවධාරණය කළේය.`
  },
  "imf-affirms-sri-lanka-reform-program-on-track-as-85-of-targets-met": {
    title: "ඉදිරි සමාලෝචනයට පෙර ශ්‍රී ලංකාව IMF ඉලක්කවලින් 85% ක් සපුරා ගනී; ප්‍රතිසංස්කරණ වැඩසටහන නිසි මගෙහි බවට ජාත්‍යන්තර මූල්‍ය අරමුදල තහවුරු කරයි",
    deck: "දිවයිනට පැමිණි ජාත්‍යන්තර මූල්‍ය අරමුදලේ නියෝජිත පිරිස රාජ්‍ය මූල්‍ය විනය සහ රාජ්‍ය ආදායම් අතිරික්තය අගය කරන අතර බලශක්ති මිලකරණය සහ පාලන ව්‍යුහයන්ගේ ප්‍රතිසංස්කරණ කඩිනම් කරන ලෙස ඉල්ලා සිටියි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජාත්‍යන්තර මූල්‍ය අරමුදලේ (IMF) විස්තීර්ණ ණය පහසුකම් (EFF) වැඩසටහන යටතේ නියමිත ඉලක්කවලින් 85% කට අධික ප්‍රමාණයක් ශ්‍රී ලංකාව සාර්ථකව සපුරා ඇති බව නිල සමාලෝචන දූත මණ්ඩලය ප්‍රකාශ කර තිබේ.`
  },
  1791172245428: {
    title: "ශ්‍රී ලංකාව සමඟ විස්තීර්ණ ණය පහසුකම (EFF) යටතේ හත්වන සමාලෝචනය සඳහා IMF කාර්ය මණ්ඩල මට්ටමේ එකඟතාවයකට එළඹෙයි",
    deck: "තිරසාර බදු ආදායම් එකතු කිරීම සහ උද්ධමනය පාලනය කිරීම හේතුවෙන් ඩොලර් මිලියන 345 ක සෘජු ගෙවුම් ශේෂ මූල්‍යකරණයක් නිදහස් කර ගැනීමට මෙම එකඟතාව මග පාදයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ ආර්ථික ප්‍රතිසංස්කරණ වැඩසටහනට අදාළ විස්තීර්ණ ණය පහසුකම (EFF) යටතේ හත්වන සමාලෝචනය වෙනුවෙන් කාර්ය මණ්ඩල මට්ටමේ එකඟතාවයකට (Staff-Level Agreement) එළඹුණු බව ජාත්‍යන්තර මූල්‍ය අරමුදල නිල වශයෙන් නිවේදනය කළේය.

මෙම එකඟතාවය IMF විධායක මණ්ඩලයේ අනුමැතියට යටත්ව ක්‍රියාත්මක වන අතර, එමගින් ශ්‍රී ලංකාවට ඇමරිකානු ඩොලර් මිලියන 345 ක (විශේෂ ගැනුම් හිමිකම් - SDR මිලියන 254 ක) මූල්‍ය වාරිකයක් නිදහස් කර ගැනීමට අවස්ථාව හිමිවනු ඇත.

රාජ්‍ය මූල්‍ය විනය ආරක්ෂා කර ගනිමින් බදු ජාලය පුළුල් කිරීම, මහ බැංකුවේ ස්වාධීනත්වය සුරකිමින් උද්ධමනය 5% සීමාවේ පවත්වා ගැනීම සහ විදේශ සංචිත ඩොලර් බිලියන 6 ඉක්මවා වර්ධනය කර ගැනීම සම්බන්ධයෙන් IMF සිය සතුට පළ කර තිබේ.`
  },
  301: {
    title: "මන්නාරම සහ කාවේරි ද්‍රෝණිවල තෙල් සහ ගෑස් ගවේෂණය සඳහා ශ්‍රී ලංකාවෙන් නව මුහුදු කලාප හතරක් ජාත්‍යන්තර ලංසු තැබීමට",
    deck: "ඛනිජ තෙල් සංවර්ධන අධිකාරිය ජාත්‍යන්තර බලශක්ති සමාගම් ආකර්ෂණය කර ගැනීම සඳහා යාවත්කාලීන භූ කම්පන දත්ත පැකේජ සහිත ගෝලීය ලංසු වටයක් ආරම්භ කරයි.",
    category: "කර්මාන්ත",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — මන්නාරම සහ කාවේරි ද්‍රෝණිවල පිහිටි තෙල් සහ ස්වාභාවික වායු ගවේෂණ මුහුදු කලාප (offshore blocks) හතරක් සඳහා ජාත්‍යන්තර බලශක්ති සමාගම් වෙතින් ලංසු කැඳවීමට ශ්‍රී ලංකා ඛනිජ තෙල් සංවර්ධන අධිකාරිය (PDASL) තීරණය කර ඇත.

යාවත්කාලීන කරන ලද ත්‍රිමාණ භූ කම්පන දත්ත (3D seismic data) මත පදනම්ව මෙම ගවේෂණ කලාප සකස් කර ඇති අතර, වාණිජමය වශයෙන් ඵලදායී ස්වාභාවික වායු නිධි පවතින බවට තහවුරු කර ඇති M2 බ්ලොක් එක ද මීට ඇතුළත් වේ. ආසියානු සහ මැදපෙරදිග ප්‍රමුඛතම බලශක්ති දැවැන්තයින් කිහිප දෙනෙකු දැනටමත් මේ සඳහා උනන්දුව පළ කර ඇත.`
  },
  "sri-lanka-offers-four-offshore-oil-blocks-exploration": {
    title: "මන්නාරම සහ කාවේරි ද්‍රෝණිවල තෙල් සහ ගෑස් ගවේෂණය සඳහා ශ්‍රී ලංකාවෙන් නව මුහුදු කලාප හතරක් ජාත්‍යන්තර ලංසු තැබීමට",
    deck: "ඛනිජ තෙල් සංවර්ධන අධිකාරිය ජාත්‍යන්තර බලශක්ති සමාගම් ආකර්ෂණය කර ගැනීම සඳහා යාවත්කාලීන භූ කම්පන දත්ත පැකේජ සහිත ගෝලීය ලංසු වටයක් ආරම්භ කරයි.",
    category: "කර්මාන්ත",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — මන්නාරම සහ කාවේරි ද්‍රෝණිවල පිහිටි තෙල් සහ ස්වාභාවික වායු ගවේෂණ මුහුදු කලාප හතරක් සඳහා ජාත්‍යන්තර බලශක්ති සමාගම් වෙතින් ලංසු කැඳවීමට ශ්‍රී ලංකාව තීරණය කර ඇත.`
  },
  1789115985835: {
    title: "ඕෂන් වොයේජර් ඉන්ටර්නැෂනල් ශ්‍රී ලංකාවෙන් ප්‍රථම උභයජීවී යාත්‍රාව යුරෝපයට අපනයනය කරයි",
    deck: "කොග්ගල පිහිටි ඕෂන් වොයේජර් ඉන්ටර්නැෂනල් සමාගම ශ්‍රී ලංකාවේ නිපදවන ලද ප්‍රථම උභයජීවී යාත්‍රාව යුරෝපයට අපනයනය කළ බව කර්මාන්ත අමාත්‍යාංශය පවසයි.",
    category: "ආර්ථිකය",
    body: `ශ්‍රී ලංකාවේ කොග්ගල පිහිටි සුඛෝපභෝගී යාත්‍රා නිෂ්පාදන සමාගමක් වන ඕෂන් වොයේජර් ඉන්ටර්නැෂනල් (Ocean Voyager International Pvt Ltd) විසින් සිය ප්‍රථම උභයජීවී යාත්‍රාව (amphibious craft) යුරෝපයට අපනයනය කර ඇති බව කර්මාන්ත අමාත්‍යාංශය නිකුත් කළ නිවේදනයක දැක්වේ.

ඕෂන් වොයේජර් සමාගම සුඛෝපභෝගී කැටමරන් යාත්‍රා නිෂ්පාදනය සඳහා ප්‍රසිද්ධය. පසුව මයිකල් (Michelin) සමාගම විසින් අත්පත් කර ගන්නා ලද ශ්‍රී ලංකාවේ විශාලතම ඝන ටයර් නිෂ්පාදන සමාගම ආරම්භ කළ බෙල්ජියම් ජාතික පියරේ ප්‍රින්ජියර්ස් (Pierre Pringiers) මහතා විසින් මෙම සමාගම පිහිටුවන ලදී.

මෙම උභයජීවී යාත්‍රාවේ තනි බඳෙහි දෙපසම මෝටර් බලයෙන් ක්‍රියාත්මක වන ඇදගත හැකි දම්වැල් ධාවන පද්ධතියක් (retractable motorized track system) සවිකර ඇති අතර, ඒ මගින් ජලයෙන් ගොඩබිමට පැමිණ ඝන පොළොව මත ධාවනය වීමේ හැකියාව පවතී.

යාත්‍රාංගනය නිරීක්ෂණය කිරීම සඳහා පැමිණි කර්මාන්ත අමාත්‍ය සුනිල් හඳුන්නෙත්ති මහතා ප්‍රකාශ කළේ ශ්‍රී ලංකාව බෝට්ටු හා යාත්‍රා නිෂ්පාදන කේන්ද්‍රස්ථානයක් බවට පත් කිරීම සඳහා රජය අවශ්‍ය සියලු සහාය ලබා දෙන බවයි.

ශ්‍රී ලංකා විනෝදාත්මක යාත්‍රා සංගමයේ සභාපතිවරයා ද වන ප්‍රින්ජියර්ස් මහතා, මුහුදෙන් වටවී තිබුණද යාත්‍රා පැදවීමේ සක්‍රීය සම්ප්‍රදායක් නොමැති දිවයිනක මෙම ක්ෂේත්‍රය ප්‍රවර්ධනය කිරීමට අඛණ්ඩව උත්සාහ කරමින් සිටී. ශ්‍රී ලංකාවේ සාගර ආර්ථිකය එහි සැබෑ විභවයට වඩා බෙහෙවින් පහළ මට්ටමක පවතින බව විශ්ලේෂකයෝ පෙන්වා දෙති. (කොළඹ/සැප්11/2026)`
  },
  "ocean-voyager-international-exports-first-amphibious-craft-from-sri-lanka": {
    title: "ඕෂන් වොයේජර් ඉන්ටර්නැෂනල් ශ්‍රී ලංකාවෙන් ප්‍රථම උභයජීවී යාත්‍රාව යුරෝපයට අපනයනය කරයි",
    deck: "කොග්ගල පිහිටි ඕෂන් වොයේජර් ඉන්ටර්නැෂනල් සමාගම ශ්‍රී ලංකාවේ නිපදවන ලද ප්‍රථම උභයජීවී යාත්‍රාව යුරෝපයට අපනයනය කළ බව කර්මාන්ත අමාත්‍යාංශය පවසයි.",
    category: "ආර්ථිකය",
    body: `ශ්‍රී ලංකාවේ කොග්ගල පිහිටි සුඛෝපභෝගී යාත්‍රා නිෂ්පාදන සමාගමක් වන ඕෂන් වොයේජර් ඉන්ටර්නැෂනල් (Ocean Voyager International Pvt Ltd) විසින් සිය ප්‍රථම උභයජීවී යාත්‍රාව (amphibious craft) යුරෝපයට අපනයනය කර ඇති බව කර්මාන්ත අමාත්‍යාංශය නිකුත් කළ නිවේදනයක දැක්වේ.

ඕෂන් වොයේජර් සමාගම සුඛෝපභෝගී කැටමරන් යාත්‍රා නිෂ්පාදනය සඳහා ප්‍රසිද්ධය. පසුව මයිකල් (Michelin) සමාගම විසින් අත්පත් කර ගන්නා ලද ශ්‍රී ලංකාවේ විශාලතම ඝන ටයර් නිෂ්පාදන සමාගම ආරම්භ කළ බෙල්ජියම් ජාතික පියරේ ප්‍රින්ජියර්ස් (Pierre Pringiers) මහතා විසින් මෙම සමාගම පිහිටුවන ලදී.

මෙම උභයජීවී යාත්‍රාවේ තනි බඳෙහි දෙපසම මෝටර් බලයෙන් ක්‍රියාත්මක වන ඇදගත හැකි දම්වැල් ධාවන පද්ධතියක් (retractable motorized track system) සවිකර ඇති අතර, ඒ මගින් ජලයෙන් ගොඩබිමට පැමිණ ඝන පොළොව මත ධාවනය වීමේ හැකියාව පවතී.

යාත්‍රාංගනය නිරීක්ෂණය කිරීම සඳහා පැමිණි කර්මාන්ත අමාත්‍ය සුනිල් හඳුන්නෙත්ති මහතා ප්‍රකාශ කළේ ශ්‍රී ලංකාව බෝට්ටු හා යාත්‍රා නිෂ්පාදන කේන්ද්‍රස්ථානයක් බවට පත් කිරීම සඳහා රජය අවශ්‍ය සියලු සහාය ලබා දෙන බවයි.

ශ්‍රී ලංකා විනෝදාත්මක යාත්‍රා සංගමයේ සභාපතිවරයා ද වන ප්‍රින්ජියර්ස් මහතා, මුහුදෙන් වටවී තිබුණද යාත්‍රා පැදවීමේ සක්‍රීය සම්ප්‍රදායක් නොමැති දිවයිනක මෙම ක්ෂේත්‍රය ප්‍රවර්ධනය කිරීමට අඛණ්ඩව උත්සාහ කරමින් සිටී. ශ්‍රී ලංකාවේ සාගර ආර්ථිකය එහි සැබෑ විභවයට වඩා බෙහෙවින් පහළ මට්ටමක පවතින බව විශ්ලේෂකයෝ පෙන්වා දෙති. (කොළඹ/සැප්11/2026)`
  },
  1789115913690: {
    title: "ශ්‍රී ලංකාවේ රාජ්‍ය බැංකුවල ප්‍රධාන අක්‍රිය ණය රුපියල් බිලියන 200 ඉක්මවයි; රහස්‍යතා නීති යටතේ ණයගැතියන්ගේ නම් හෙළි නොකෙරේ",
    deck: "ලංකා බැංකුව සහ මහජන බැංකුව ඇතුළු ප්‍රධාන රාජ්‍ය බැංකු පහේ විශාලතම අක්‍රිය ණය ප්‍රමාණය රුපියල් බිලියන 200 ඉක්මවා ඇති බවත්, බැංකු පනතේ රහස්‍යතා විධිවිධාන හේතුවෙන් ණයගැතියන්ගේ නම් හෙළි කළ නොහැකි බවත් පාර්ලිමේන්තුවට දැනුම් දෙයි.",
    category: "ආර්ථිකය",
    body: `ඉකොනොමැට්‍රික්ස් — ශ්‍රී ලංකාවේ ප්‍රමුඛ රාජ්‍ය බැංකු වන ලංකා බැංකුව සහ මහජන බැංකුව යන බැංකු දෙකෙහි විශාලතම අක්‍රිය ණය (non-performing loans) ගිණුම් 20 හි වටිනාකම රුපියල් බිලියන 202 ඉක්මවන නමුත්, ව්‍යවස්ථාපිත රහස්‍යතා නීති යටතේ එම ණයගැතියන්ගේ අනන්‍යතාව හෙළිදරව් කළ නොහැකි බව පාර්ලිමේන්තුවට දැනුම් දී ඇත.

කම්කරු අමාත්‍ය සහ මුදල් හා ක්‍රමසම්පාදන නියෝජ්‍ය අමාත්‍ය අනිල් ජයන්ත මහතා රාජ්‍ය බැංකු පහක විශාලතම අක්‍රිය ණය ගිණුම් 20 පිළිබඳ තොරතුරු සභාගත කළේය. ඒ අනුව ලංකා බැංකුව රුපියල් මිලියන 150,704.96 ක අක්‍රිය ණය වාර්තා කරමින් ඉදිරියෙන්ම සිටින අතර, මහජන බැංකුව රුපියල් මිලියන 51,314.01 ක අක්‍රිය ණය වාර්තා කර ඇත.

සෙසු ආයතන අතර, ජාතික ඉතිරි කිරීමේ බැංකුව (NSB) තම ප්‍රධාන පැහැර හරින ලද ගිණුම් 20 තුළ රුපියල් මිලියන 3,450.92 ක්ද, ප්‍රාදේශීය සංවර්ධන බැංකුව (RDB) රුපියල් මිලියන 1,214.33 ක්ද, රාජ්‍ය උකස් හා ආයෝජන බැංකුව (SMIB) රුපියල් මිලියන 425.8 ක්ද වාර්තා කර ඇත.

තනි පුද්ගල හා ආයතනික ණය පැහැර හරින්නන් හෙළිදරව් කරන ලෙස කරන ලද ඉල්ලීම්වලට පිළිතුරු දෙමින් ජයන්ත මහතා කියා සිටියේ මූල්‍ය ආයතන දැඩි ව්‍යවස්ථාපිත රහස්‍යතා බැඳීම්වලට යටත්ව ඇති බවයි.

"බැංකු පනතේ 77 වැනි වගන්තිය සහ පුද්ගලික දත්ත ආරක්ෂණ පනත යටතේ අධ්‍යක්ෂ මණ්ඩල සහ සේවකයින් යන දෙපාර්ශවයම ගනුදෙනුකරුවන්ගේ රහස්‍යභාවය සුරැකීමට නීතියෙන්ම බැඳී සිටින බැවින් තනි පුද්ගල ගනුදෙනුකරුවන්ගේ නම් අනාවරණය කර නොමැත," ජයන්ත මහතා පැවසීය.

පසුගිය වසර 15 තුළ රාජ්‍ය ආයතන පහ තුළ අකර්මන්‍ය ණය හෝ නොගෙවූ පොලී ලෙස කපා හරින ලද රුපියල් බිලියනය ඉක්මවන විශාලතම ණය පිළිබඳ තොරතුරු ද පාර්ලිමේන්තුවට ඉදිරිපත් කෙරිණි. ණය ප්‍රතිව්‍යුහගත කිරීමේ සැලසුම් යටතේ, ලංකා බැංකුවේ ප්‍රධාන කපාහැරීම් අතරට ලංකා විදුලිබල මණ්ඩලය (CEB) ප්‍රතිව්‍යුහගත කිරීමට අදාළ රුපියල් බිලියන 61 ක් සහ 2017 දී නිශ්චල දේපල උකස් සඳහා කපා හරින ලද රුපියල් බිලියන 15 ක් ඇතුළත් වේ.

ණයගැතියන්ගේ අනන්‍යතාවය නීතියෙන් ආරක්ෂා කර ඇති නමුත්, සම්පූර්ණ සංඛ්‍යාලේඛන සහ අයකර ගැනීමේ ක්‍රියාමාර්ග පාර්ලිමේන්තු සමාලෝචනය සඳහා ඉදිරිපත් කර ඇති බව ජයන්ත මහතා වැඩිදුරටත් සඳහන් කළේය. (කොළඹ/සැප්11/2026)`
  },
  "sri-lanka-state-banks-top-bad-loans-exceed-rs200-bn-borrower-names-withheld-under-secrecy-laws": {
    title: "ශ්‍රී ලංකාවේ රාජ්‍ය බැංකුවල ප්‍රධාන අක්‍රිය ණය රුපියල් බිලියන 200 ඉක්මවයි; රහස්‍යතා නීති යටතේ ණයගැතියන්ගේ නම් හෙළි නොකෙරේ",
    deck: "ලංකා බැංකුව සහ මහජන බැංකුව ඇතුළු ප්‍රධාන රාජ්‍ය බැංකු පහේ විශාලතම අක්‍රිය ණය ප්‍රමාණය රුපියල් බිලියන 200 ඉක්මවා ඇති බවත්, බැංකු පනතේ රහස්‍යතා විධිවිධාන හේතුවෙන් ණයගැතියන්ගේ නම් හෙළි කළ නොහැකි බවත් පාර්ලිමේන්තුවට දැනුම් දෙයි.",
    category: "ආර්ථිකය",
    body: `ඉකොනොමැට්‍රික්ස් — ශ්‍රී ලංකාවේ ප්‍රමුඛ රාජ්‍ය බැංකු වන ලංකා බැංකුව සහ මහජන බැංකුව යන බැංකු දෙකෙහි විශාලතම අක්‍රිය ණය (non-performing loans) ගිණුම් 20 හි වටිනාකම රුපියල් බිලියන 202 ඉක්මවන නමුත්, ව්‍යවස්ථාපිත රහස්‍යතා නීති යටතේ එම ණයගැතියන්ගේ අනන්‍යතාව හෙළිදරව් කළ නොහැකි බව පාර්ලිමේන්තුවට දැනුම් දී ඇත.

කම්කරු අමාත්‍ය සහ මුදල් හා ක්‍රමසම්පාදන නියෝජ්‍ය අමාත්‍ය අනිල් ජයන්ත මහතා රාජ්‍ය බැංකු පහක විශාලතම අක්‍රිය ණය ගිණුම් 20 පිළිබඳ තොරතුරු සභාගත කළේය. ඒ අනුව ලංකා බැංකුව රුපියල් මිලියන 150,704.96 ක අක්‍රිය ණය වාර්තා කරමින් ඉදිරියෙන්ම සිටින අතර, මහජන බැංකුව රුපියල් මිලියන 51,314.01 ක අක්‍රිය ණය වාර්තා කර ඇත.

සෙසු ආයතන අතර, ජාතික ඉතිරි කිරීමේ බැංකුව (NSB) තම ප්‍රධාන පැහැර හරින ලද ගිණුම් 20 තුළ රුපියල් මිලියන 3,450.92 ක්ද, ප්‍රාදේශීය සංවර්ධන බැංකුව (RDB) රුපියල් මිලියන 1,214.33 ක්ද, රාජ්‍ය උකස් හා ආයෝජන බැංකුව (SMIB) රුපියල් මිලියන 425.8 ක්ද වාර්තා කර ඇත.

තනි පුද්ගල හා ආයතනික ණය පැහැර හරින්නන් හෙළිදරව් කරන ලෙස කරන ලද ඉල්ලීම්වලට පිළිතුරු දෙමින් ජයන්ත මහතා කියා සිටියේ මූල්‍ය ආයතන දැඩි ව්‍යවස්ථාපිත රහස්‍යතා බැඳීම්වලට යටත්ව ඇති බවයි.

"බැංකු පනතේ 77 වැනි වගන්තිය සහ පුද්ගලික දත්ත ආරක්ෂණ පනත යටතේ අධ්‍යක්ෂ මණ්ඩල සහ සේවකයින් යන දෙපාර්ශවයම ගනුදෙනුකරුවන්ගේ රහස්‍යභාවය සුරැකීමට නීතියෙන්ම බැඳී සිටින බැවින් තනි පුද්ගල ගනුදෙනුකරුවන්ගේ නම් අනාවරණය කර නොමැත," ජයන්ත මහතා පැවසීය.

පසුගිය වසර 15 තුළ රාජ්‍ය ආයතන පහ තුළ අකර්මන්‍ය ණය හෝ නොගෙවූ පොලී ලෙස කපා හරින ලද රුපියල් බිලියනය ඉක්මවන විශාලතම ණය පිළිබඳ තොරතුරු ද පාර්ලිමේන්තුවට ඉදිරිපත් කෙරිණි. ණය ප්‍රතිව්‍යුහගත කිරීමේ සැලසුම් යටතේ, ලංකා බැංකුවේ ප්‍රධාන කපාහැරීම් අතරට ලංකා විදුලිබල මණ්ඩලය (CEB) ප්‍රතිව්‍යුහගත කිරීමට අදාළ රුපියල් බිලියන 61 ක් සහ 2017 දී නිශ්චල දේපල උකස් සඳහා කපා හරින ලද රුපියල් බිලියන 15 ක් ඇතුළත් වේ.

ණයගැතියන්ගේ අනන්‍යතාවය නීතියෙන් ආරක්ෂා කර ඇති නමුත්, සම්පූර්ණ සංඛ්‍යාලේඛන සහ අයකර ගැනීමේ ක්‍රියාමාර්ග පාර්ලිමේන්තු සමාලෝචනය සඳහා ඉදිරිපත් කර ඇති බව ජයන්ත මහතා වැඩිදුරටත් සඳහන් කළේය. (කොළඹ/සැප්11/2026)`
  },
  50: {
    title: "රුපියල අවප්‍රමාණවීමේ යාන්ත්‍රණය: වන්ධ්‍යාකරණය නොකළ ඩොලර් මිලදී ගැනීම් මගින් ශ්‍රී ලංකා ආර්ථිකයට සිදුවන බලපෑම",
    deck: "මහ බැංකුව විසින් සිදුකළ ඩොලර් මිලදී ගැනීම් හේතුවෙන් දේශීය රුපියල් ද්‍රවශීලතාව ඉහළ ගිය අතර, එය ආනයන ඉල්ලුම ලෙස නැවත හැරී ඒමෙන් රුපියල ඩොලරයට සාපේක්ෂව 285 සිට 309 දක්වා අවප්‍රමාණ විය.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — ලංකාඊකොන් පුවත් අංශය

2025 පළමු අර්ධය තුළ ශ්‍රී ලංකා මහ බැංකුව (CBSL) දේශීය විදේශ විනිමය වෙළඳපොළෙන් ඇමරිකානු ඩොලර් බිලියන 1.625 කට අධික ප්‍රමාණයක් මිලදී ගත්තේය. නිල මාධ්‍ය නිවේදන මගින් මෙම ජයග්‍රහණය බාහිර අංශයේ යථා තත්ත්වයට පත්වීම සහ සංචිත රැස්කිරීමේ සාක්ෂියක් ලෙස ඇගයීමට ලක් කළේය. නමුත්, මෙම ප්‍රධාන සංචිත සංඛ්‍යාව පිටුපස මූලික මුදල්මය ප්‍රහේලිකාවක් පවතී: මෙම කාල පරිච්ඡේදය තුළදීම ශ්‍රී ලංකා රුපියල ඩොලරයට සාපේක්ෂව රුපියල් 285 සිට 309 ඉක්මවා අවප්‍රමාණ විය.

මහ බැංකුවක් විශාල වශයෙන් ඩොලර් මිලදී ගන්නා අතරතුර එහි ජාතික මුදල අඛණ්ඩව ක්ෂය වන්නේ කෙසේද?

ඊට පිළිතුර පවතින්නේ වන්ධ්‍යාකරණය නොකළ මුදල් ප්‍රසාරණ යාන්ත්‍රණය තුළය. 1949 දී මහ බැංකු නිර්මාතෘ ජෝන් එක්ස්ටර් විසින් මුල්වරට මෙම සංසිද්ධිය විශ්ලේෂණය කරන ලදී. මහ බැංකුව වාණිජ බැංකුවලින් ඩොලර් බිලියන 1.6ක් මිලදී ගන්නා විට, එය පවත්නා අරමුදල්වලින් ගෙවීම් නොකරයි. එය කිසිදු පිටුපස රක්ෂිතයක් නොමැතිව අලුතින් රුපියල් මවා වාණිජ බැංකුවල පියවීම් ගිණුම්වලට බැර කරයි.

මහ බැංකුව විසින් භාණ්ඩාගාර බිල්පත් අලෙවි කිරීමෙන් මෙම ද්‍රවශීලතාව වහාම "වන්ධ්‍යාකරණය" නොකරන්නේ නම්, මෙම අලුත් මුදල් සැඩ පහර මගින් කෘතිම අන්තර් බැංකු ද්‍රවශීලතා අතිරික්තයක් නිර්මාණය වේ. වාණිජ බැංකු තම අතිරික්ත සංචිත මත පදනම්ව, ණය දීමේ ප්‍රමිතීන් ලිහිල් කර ආනයනකරුවන්ට ණය ප්‍රසාරණය කරයි. සති කිහිපයක් ඇතුළත, අලුතින් නිර්මාණය කරන ලද එම රුපියල් ආනයනික භාණ්ඩ මිලදී ගැනීම සඳහා විදේශ විනිමය වෙළඳපොළට පැමිණෙන අතර, ඩොලර් ඉල්ලුම ඉහළ නංවමින් රුපියල පහත හෙළයි.`
  },
  51: {
    title: "මෘදු විනිමය අනුපාත උගුල: ස්ථාවර ණය පහසුකම් මගින් නොහැකි ත්‍රිත්වය උල්ලංඝනය වන ආකාරය",
    deck: "අඩු පොලී අනුපාත යටතේ වාණිජ බැංකුවලට ද්‍රවශීලතාව සැපයීම මගින් ණය ප්‍රසාරණය උත්තේජනය වන අතර මහ බැංකු සංචිත ක්ෂය වීමට හේතු වේ.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — ලංකාඊකොන් පුවත් අංශය

සංවර්ධනය වෙමින් පවතින රටවල මහ බැංකු ඉතිහාසය "මෘදු විනිමය අනුපාත උගුලේ" (Soft-Peg Trap) අහිතකර ප්‍රතිඵලවලින් පිරී පවතී. මෘදු විනිමය අනුපාතයක් යනු මුදල් අධිකාරියක් විනිමය අනුපාත ඉලක්කයක් පවත්වා ගැනීමට උත්සාහ කරන අතරම වෙළඳපොළට අත්තනෝමතික ලෙස මැදිහත් වෙමින් දේශීය පොලී අනුපාත පාලනය කිරීමට ක්‍රියා කරන අවස්ථාවකි.

ආර්ථික විද්‍යාවේදී නොහැකි ත්‍රිත්වය (Mundell-Fleming ආකෘතිය) මගින් ඔප්පු කරන්නේ කිසිදු මහ බැංකුවකට එකවර පහත සඳහන් කොන්දේසි තුනම පවත්වා ගත නොහැකි බවයි:
1. ස්ථාවර හෝ කළමනාකරණය කළ විනිමය අනුපාතයක්
2. ජාත්‍යන්තර ප්‍රාග්ධනයේ නිදහස් සංචලනය
3. ස්වාධීන දේශීය මුදල් ප්‍රතිපත්තියක්

ශ්‍රී ලංකා මහ බැංකුව වාණිජ බැංකුවලට 9.25% ක ස්ථාවර ණය පහසුකම් (SLF) දණ්ඩන අනුපාතිකයට වඩා බෙහෙවින් අඩු 8.26% ක සහනදායී පොලියට රුපියල් බිලියන 133.6 ක් එන්නත් කළ විට, එය අන්තර් බැංකු පොලී අනුපාතික කෘතිමව යටපත් කිරීමට උත්සාහ කළේය. වාණිජ බැංකු පාරිභෝගික තැන්පතු ආකර්ෂණය කර ගැනීම වෙනුවට මෙම ලාභ මුදල් වෙළඳ ණය සැපයීමට යොදා ගත්තේය.

මෙහි ප්‍රතිඵලය කඩිනමින් සිදු විය: ලාභ රුපියල් ණය ඩොලර් ඉල්ලුමක් බවට පත් වූ අතර, විනිමය අනුපාතිකය ආරක්ෂා කර ගැනීම සඳහා තම වටිනා විදේශ විනිමය සංචිත අලෙවි කිරීමට මහ බැංකුවට බල කෙරුණි.`
  },
  52: {
    title: "ආනයන සීමා කිරීම් මගින් ජංගම ගිණුම් හිඟය විසඳිය නොහැක්කේ මන්ද: ජාතික ඉතිරිකිරීම් සහ ආයෝජන විශ්ලේෂණය",
    deck: "වාහන සහ ප්‍රාග්ධන භාණ්ඩ තහනම් කිරීම මගින් රෝග ලක්ෂණයට පමණක් ප්‍රතිකාර කරන අතර, රාජ්‍ය අයවැය හිඟය මගින් ඇතිවන අතිරික්ත රුපියල් ඉල්ලුම වෙළඳ හිඟයට හේතු වේ.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — ලංකාඊකොන් පුවත් අංශය

දශක ගණනාවක් තිස්සේ ශ්‍රී ලංකාවේ ප්‍රතිපත්ති සම්පාදකයින් විදේශ විනිමය හිඟයට මුහුණ දීම සඳහා මෝටර් රථ, පාරිභෝගික භාණ්ඩ සහ කෘෂිකාර්මික ආනයන තහනම් කිරීමේ පිළිවෙතක් අනුගමනය කර ඇත. මෙම වෙළඳවාදී (mercantilist) ප්‍රවේශය පදනම් වී ඇත්තේ වෙළඳ හිඟය ඇති වන්නේ පාරිභෝගිකයින්ගේ අනවශ්‍ය විදේශ භාණ්ඩ පරිභෝජනය නිසා යැයි යන ජනප්‍රිය මිත්‍යාව මතය.

සාර්ව ආර්ථික ගිණුම්කරණය මගින් ජාතික ඉතිරිකිරීම්-ආයෝජන අනන්‍යතාවය (National Savings-Investment Identity) ඔස්සේ මූලික සත්‍යයක් හෙළි කරයි:

ජංගම ගිණුම් ශේෂය = ජාතික ඉතිරිකිරීම් අඩු කිරීම ආයෝජන

රජය මහ බැංකුව හරහා මුදල් අච්චු ගසමින් විශාල අයවැය හිඟයක් පවත්වා ගන්නා විට, එය රාජ්‍ය අංශයේ "ඍණ-ඉතිරිකිරීමක්" (dis-saving) ඇති කරයි. රජය විසින් වියදම් කරන මෙම අතිරික්ත මුදල් ජනතාව අතට පත්වන අතර, සැබෑ නිෂ්පාදනයකින් තොර මිලදී ගැනීමේ ශක්තියක් නිර්මාණය වේ. පාරිභෝගිකයින් ස්වභාවිකවම මෙම අතිරික්ත මුදල් දේශීය හා ආනයනික භාණ්ඩ සඳහා වැය කරයි.

රජය ආනයනික මෝටර් රථ තහනම් කළහොත්, පාරිභෝගිකයින් එම රුපියල් ඉතිරි නොකරයි. ඒ වෙනුවට, ඔවුන් එම අතිරික්ත ද්‍රවශීලතාව ආනයනික ඉලෙක්ට්‍රොනික භාණ්ඩ, රෙදිපිළි හෝ ආහාර ද්‍රව්‍ය මිලදී ගැනීමට යොමු කරයි. කිසියම් නිශ්චිත භාණ්ඩයක් තහනම් කිරීම මගින් සිදුවන්නේ සමස්ත වෙළඳ හිඟය වෙනස් කිරීම නොව එක් ක්ෂේත්‍රයකින් තවත් ක්ෂේත්‍රයකට විදේශ විනිමය පීඩනය මාරු කිරීම පමණි.`
  },
  53: {
    title: "ශ්‍රී ලංකා මහ බැංකුව ප්‍රතිසංස්කරණය කිරීම: අත්තනෝමතික මුදල් සැපයුමේ සිට මුදල් මණ්ඩල රීති දක්වා",
    deck: "ඩේවිඩ් රිකාඩෝගේ 1816 ඉන්ගොට් සැලැස්ම සහ ජෝන් එක්ස්ටර්ගේ 1949 අනතුරු ඇඟවීම් මගින් දිගුකාලීන මුදල් ස්ථාවරත්වය සඳහා පැහැදිලි ආකෘතියක් ලබා දෙයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — රනුල් සෙනෙවිරත්න විසිනි

1949 මුදල් නීති පනත ස්ථාපිත කළ දා සිට ශ්‍රී ලංකාවේ ඉතිහාසය ගෙවුම් ශේෂ අර්බුද, අධි උද්ධමනය සහ විනිමය අනුපාත කඩා වැටීම්වලින් පිරී ගියේය. මෙයට ප්‍රධාන හේතුව වූයේ අත්තනෝමතික මහ බැංකුකරණයයි — එනම් රජයේ ණය පියවීම හෝ අර්බුදයට පත් වාණිජ බැංකු ගලවා ගැනීම සඳහා මුදල් අධිකාරියට හිතුමනාපයේ මුදල් නිර්මාණය කිරීමට තිබූ බලයයි.

මෙම විනාශකාරී චක්‍රයෙන් මිදීමට ශ්‍රී ලංකාවට ව්‍යුහාත්මක මූල්‍ය ප්‍රතිසංස්කරණයක් අවශ්‍ය වේ. ඩේවිඩ් රිකාඩෝගේ 1816 ඉන්ගොට් සැලැස්ම (Ingot Plan) මගින් පෙන්වා දුන්නේ මුදල් නෝට්ටු අධික ලෙස නිකුත් කිරීම වැළැක්වීම සඳහා දැඩි පරිවර්තන නීතිවලට යටත් විය යුතු බවයි.

නූතන මුදල් මණ්ඩලයක් (Currency Board) හෝ නීති මත පදනම් වූ මුදල් පද්ධතියක් මූලික මූලධර්ම දෙකක් ක්‍රියාත්මක කරයි:
1. **100% ක විදේශ සංචිත ආරක්ෂාව**: නිකුත් කරන සෑම රුපියලක් සඳහාම 100% ක විදේශ විනිමය සංචිත පැවතිය යුතුය.
2. **ශුන්‍ය හිඟ මුදල්කරණය**: රජයේ භාණ්ඩාගාර බිල්පත් මිලදී ගැනීම හෝ වාණිජ බැංකුවලට මුදල් ණයට දීම මුදල් අධිකාරියට නීතියෙන්ම තහනම් වේ.

එවැනි ක්‍රමයක් යටතේ උද්ධමනය ගෝලීය මට්ටමට පහත වැටෙන අතර විනිමය අනුපාත අස්ථාවරත්වය මුළුමනින්ම නැති වේ.`
  },
  54: {
    title: "මුදල් පිළිබඳ ප්‍රධාන සංකල්ප තුන: නූතන ශ්‍රී ලංකාව සඳහා සම්භාව්‍ය, මාක්ස්වාදී සහ කේන්සියානු ආකෘති",
    deck: "ඩේවිඩ් හියුම්, කාල් මාක්ස් සහ ජෝන් මේනාඩ් කේන්ස්ගේ ආකෘති මගින් මුදල් අච්චු ගැසීම සැබෑ ජාතික නිෂ්පාදනයට විකල්පයක් විය නොහැකි බව පැහැදිලි කරයි.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — රනුල් සෙනෙවිරත්න විසිනි

ආර්ථික ඉතිහාසය තුළ මුදල්වල ස්වභාවය සහ කාර්යභාරය පිළිබඳ ප්‍රධාන සංකල්ප තුනක් හඳුනාගත හැකිය:

1. **සම්භාව්‍ය ආකෘතිය (හියුම්, ස්මිත්, රිකාඩෝ)**: මුදල් යනු වෙළඳාමට පහසුකම් සලසන උදාසීන මාධ්‍යයකි. මුදල් අච්චු ගැසීමෙන් සැබෑ ධනය හෝ නිෂ්පාදන බිහි නොවේ; එය මිලදී ගැනීමේ ශක්තිය නැවත බෙදාහැර මිල මට්ටම් ඉහළ නැංවීම පමණක් සිදු කරයි.

2. **මාක්ස්වාදී ආකෘතිය (කාල් මාක්ස්)**: මුදල් යනු ශ්‍රමය තහවුරු කරන විශ්වීය සමානකයයි. විකිණීමේ ක්‍රියාව මිලදී ගැනීමේ ක්‍රියාවෙන් වෙන් කිරීම මගින් මුදල් ගොඩගසා ගැනීම, ද්‍රවශීලතා මනාපය සහ ව්‍යුහාත්මක ආර්ථික අර්බුද සඳහා ඉඩකඩ විවර කරයි.

3. **කේන්සියානු ආකෘතිය (ජෝන් මේනාඩ් කේන්ස්)**: මුදල් යනු අනාගත අවිනිශ්චිතතාවයට මුහුණ දීමේ වටිනාකම් ගබඩාවකි. කෙටි කාලීනව මිල ගණන් සහ වැටුප් ක්ෂණිකව වෙනස් නොවන (sticky prices) බැවින් මූල්‍ය කම්පන මගින් සැබෑ නිෂ්පාදනයට හා රැකියා අවස්ථාවලට බලපෑම් කළ හැකිය.

නූතන සාර්ව ආර්ථික විද්‍යාව වටහා ගැනීමට නම් කේන්සියානු මිල අක්‍රමිකතා කෙටි කාලීනව ක්‍රියාත්මක වන නමුත් සම්භාව්‍ය දිගුකාලීන මූල්‍ය මධ්‍යස්ථභාවය අවසානයේ ජයගන්නා බව පිළිගත යුතුය. රාජ්‍ය වියදම් පියවීමට රුපියල් මුද්‍රණය කිරීම කෙටි කාලයකට කම්පනය සමනය කළද අවසානයේ උද්ධමනය සහ මුදල් අවප්‍රමාණ වීම පමණක් උරුම කර දෙයි.`
  },
  55: {
    title: "තැන්පතු නොමැතිව ණය ප්‍රසාරණය: අන්තර් බැංකු ද්‍රවශීලතා පහසුකම් මගින් වාණිජ බැංකුකරණයට වන හානිය",
    deck: "වාණිජ බැංකු පාරිභෝගික තැන්පතු වෙනුවට මහ බැංකුවේ අඩු පොලී ද්‍රවශීලතා පහසුකම් මත යැපෙන විට, ණය ප්‍රසාරණය සැබෑ ඉතිරිකිරීම් අභිබවා යයි.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — රනුල් සෙනෙවිරත්න විසිනි

සෞඛ්‍ය සම්පන්න බැංකු පද්ධතියක් දිගුකාලීන ණය ලබාදීම සඳහා ගෘහස්ථ සහ ආයතනික සැබෑ තැන්පතු මත පදනම් විය යුතුය. කෙසේ වෙතත්, මහ බැංකුව විසින් ලාභ රාත්‍රී ද්‍රවශීලතා කවුළු ලබා දෙන විට වාණිජ බැංකු තැන්පතු නොමැතිව ණය දීමේ (Overtrading) පුරුද්දට ඇබ්බැහි වේ.

Overtrading යනු වාණිජ බැංකු මුලින්ම ආක්‍රමණශීලී ලෙස ණය ලබා දී පසුව තම දෛනික පියවීම් ශේෂයන් පවත්වා ගැනීමට මහ බැංකුවේ සහනදායී ද්‍රවශීලතා කවුළු මත යැපීමයි.

මෙම මෙහෙයුම් විකෘතිය මූල්‍ය ස්ථාවරත්වයට ආකාර දෙකකින් හානි කරයි:
1. **සදාචාරාත්මක අවදානම (Moral Hazard)**: මහ බැංකුවේ ලාභ ද්‍රවශීලතාවය පහසුවෙන් ලබාගත හැකි බැවින් දිගුකාලීන පාරිභෝගික තැන්පතු ආකර්ෂණය කර ගැනීමට වාණිජ බැංකු උනන්දු නොවේ.
2. **කෘතිම ණය චක්‍ර**: ණය ප්‍රසාරණය සැබෑ ජාතික ඉතිරිකිරීම් අභිබවා ගොස් වත්කම් බුබුලු නිර්මාණය වන අතර මහ බැංකුව මුදල් සැපයුම සීමා කළ වහාම ණය හැකිලීමක් සිදුවේ.

ප්‍රතිපත්ති සම්පාදකයින් විසින් ස්ථාවර ණය පහසුකම් සඳහා දැඩි දණ්ඩන පොලී අනුපාත පැනවිය යුතු අතර මහ බැංකු ද්‍රවශීලතාවය ලාභ ණය ප්‍රභවයක් නොව "අවසාන ණය හිමියා" (Lender of Last Resort) ලෙස පමණක් ක්‍රියාත්මක විය යුතුය.`
  },
  1: {
    title: "මහ බැංකුව නිල ප්‍රතිපත්ති පොලී අනුපාතික වෙනස් නොකර තබා ගනී",
    deck: "උද්ධමන ඉලක්ක සපුරා ගනිමින් පෞද්ගලික අංශයේ ණය ප්‍රසාරණය ශක්තිමත් කිරීම සඳහා වත්මන් පොලී අනුපාතිකය සුදුසු බව මහ බැංකුව පවසයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකා මහ බැංකුව (CBSL) සිය ස්ථාවර තැන්පතු පහසුකම් අනුපාතිකය (SDFR) 8.25% ක් ලෙසත්, ස්ථාවර ණය පහසුකම් අනුපාතිකය (SLFR) 9.25% ක් ලෙසත් දැනට පවතින මට්ටමේම නොවෙනස්ව පවත්වා ගැනීමට තීරණය කර ඇත.

දේශීය හා ගෝලීය සාර්ව ආර්ථික වර්ධනයන් පිළිබඳ සවිස්තරාත්මක සමාලෝචනයකින් අනතුරුව මුදල් ප්‍රතිපත්ති මණ්ඩල රැස්වීමේදී මෙම තීරණයට එළඹිණි. මධ්‍ය කාලීනව 5% ක ඉලක්කගත උද්ධමන පරාසය තුළ උද්ධමනය පවත්වා ගැනීම සඳහා වත්මන් මුදල් ප්‍රතිපත්ති ස්ථාවරය අඛණ්ඩව යෝග්‍ය බව මණ්ඩලය නිරීක්ෂණය කළේය.

"කෘෂිකාර්මික, නිෂ්පාදන සහ සේවා අංශ හරහා පෞද්ගලික අංශයේ ණය ප්‍රසාරණය දිරිගන්වනසුලු ප්‍රගතියක් පෙන්නුම් කර ඇත," යැයි නිල ප්‍රතිපත්ති නිවේදනය නිකුත් කරමින් මහ බැංකු අධිපතිවරයා ප්‍රකාශ කළේය. "දේශීය මුදල් වෙළෙඳපොළේ ද්‍රවශීලතා තත්ත්වයන් යහපත් මට්ටමක පවතින අතර වාණිජ බැංකු නාලිකා ඔස්සේ පොලී අනුපාත සම්ප්‍රේෂණය බාධාවකින් තොරව සිදු වේ."

විදේශගත ශ්‍රමික ප්‍රේෂණ, සංචාරක ආදායම් සහ ජාත්‍යන්තර මූල්‍ය අරමුදලේ විස්තීර්ණ අරමුදල් පහසුකම (EFF) යටතේ ලැබුණු මූල්‍ය ලැබීම් හේතුවෙන් පසුගිය මාසය අවසන් වන විට නිල සංචිත ප්‍රමාණය ඇමරිකානු ඩොලර් බිලියන 6.1 දක්වා වර්ධනය විය.

කොළඹ කොටස් වෙළෙඳපොළේ (CSE) ආයෝජකයින් මෙම නිවේදනය කෙරෙහි යහපත් ප්‍රතිචාරයක් දැක්වූ අතර, බැංකු ක්ෂේත්‍රයේ කොටස් මිල ගණන් ඉහළ යාමක් පෙන්නුම් කළේය.`
  },
  2: {
    title: "ජාත්‍යන්තර මූල්‍ය අරමුදල (IMF) ශ්‍රී ලංකාවේ ආදායම් සහ යහපාලන ප්‍රගතිය අගය කරයි",
    deck: "බදු පරිපාලනය සහ රාජ්‍ය ව්‍යවසාය ප්‍රතිසංස්කරණවල කැපී පෙනෙන වර්ධනයක් දක්නට ලැබෙන බව ජාත්‍යන්තර මූල්‍ය අරමුදලේ නියෝජිත පිරිස පවසති.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජාත්‍යන්තර මූල්‍ය අරමුදලේ (IMF) නියෝජිත පිරිස කොළඹදී පැවති තාක්ෂණික සාකච්ඡා සාර්ථකව නිමා කළ අතර, ශ්‍රී ලංකාවේ රාජ්‍ය ආදායම් රැස්කිරීමේ කාර්යක්ෂමතාව සහ රාජ්‍ය ව්‍යවසාය (SOE) ප්‍රතිසංස්කරණ ක්‍රියාවලිය ඇගයීමට ලක් කළහ.

දේශීය ආදායම් දෙපාර්තමේන්තුවේ (IRD) ඩිජිටල් බදු ගොනුකිරීමේ පද්ධති සහ ශක්තිමත් කළ රේගු බදු එකතු කිරීම් හේතුවෙන් ප්‍රාථමික මූල්‍ය ශේෂයන් ඉලක්කගත මට්ටමට ළඟා වී ඇති බව නියෝජිත පිරිස අවධාරණය කළහ.

"ශ්‍රී ලංකාවේ ආර්ථික පුනරුදය ව්‍යුහාත්මක යහපාලන ප්‍රතිසංස්කරණ සඳහා වූ කැපවීම මත පදනම්ව ඇත," යැයි ජාත්‍යන්තර මූල්‍ය අරමුදලේ දූත මණ්ඩල ප්‍රධානියා කොළඹදී මාධ්‍ය අමතමින් ප්‍රකාශ කළේය. "අස්වැසුම වැනි සමාජ ආරක්ෂණ ජාලයන් සුරක්ෂිත කරන අතරම මූල්‍ය විනය පවත්වා ගැනීම දිගුකාලීන තිරසාර වර්ධනයට අත්‍යවශ්‍ය වේ."

මෙම සාධනීය සමාලෝචනය හේතුවෙන් ජාත්‍යන්තර වෙළඳපොළේ ශ්‍රී ලංකා ස්වෛරී ඩොලර් බැඳුම්කරවල මිල ගණන් සැලකිය යුතු ලෙස ඉහළ ගියේය.`
  },
  3: {
    title: "කොළඹ කොටස් වෙළෙඳපොළ (CSE) සියලු කොටස් මිල දර්ශකය 12,800 සීමාව ඉක්මවයි",
    deck: "ජෝන් කීල්ස්, කොමර්ෂල් බැංකුව සහ සම්පත් බැංකුව ප්‍රමුඛ කොටස් සඳහා විදේශීය ආයෝජන ගැලීම් ඉහළ යයි.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ප්‍රමුඛ පෙළේ සමාගම් සහ වාණිජ බැංකු කොටස් වෙත විදේශීය ආයෝජන ගලා ඒම හේතුවෙන් කොළඹ කොටස් වෙළෙඳපොළේ සියලු කොටස් මිල දර්ශකය (ASPI) අද දින ඒකක 12,800 සීමාව ඉක්මවා ඉහළ ගියේය.

දෛනික පිරිවැටුම රුපියල් බිලියන 2.45 ක් වූ අතර විදේශීය ආයෝජකයින් රුපියල් මිලියන 320 ක ශුද්ධ ගැනුම් තත්ත්වයක් වාර්තා කළහ. සමාගම්වල ලාභදායීතාවය, ස්ථාවර දේශීය පොලී අනුපාත සහ ආකර්ෂණීය මිල-ඉපැයුම් අනුපාත (P/E) මෙම ඉහළ යාමට හේතු වූ බව විශ්ලේෂකයෝ පවසති.

"ගුණාත්මක ශ්‍රී ලාංකේය වත්කම්වල සැබෑ අගය ජාත්‍යන්තර ආයෝජකයින් හඳුනා ගනිමින් සිටී," යැයි ලංකාඊකොන් කොටස් වෙළෙඳපොළ පර්යේෂණ ප්‍රධානියා සඳහන් කළේය.`
  },
  4: {
    title: "ලංකා තේ අපනයන ආදායම ඩොලර් බිලියන 1.4 සීමාවට ළඟා වෙයි",
    deck: "මැදපෙරදිග වෙළඳපොළෙන් ඕතඩොක්ස් තේ සඳහා පවතින ඉහළ ඉල්ලුම හේතුවෙන් කොළඹ තේ වෙන්දේසියේ මිල ගණන් ඉහළ යයි.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ඉරාකය, එක්සත් අරාබි එමීර් රාජ්‍යය සහ සෞදි අරාබිය ඇතුළු මැදපෙරදිග වෙළඳපොළෙන් උසස් තත්ත්වයේ ඕතඩොක්ස් තේ සඳහා පවතින ඉහළ ඉල්ලුම හේතුවෙන් ශ්‍රී ලංකාවේ තේ අපනයන ආදායම ඇමරිකානු ඩොලර් බිලියන 1.4 දක්වා ඉහළ ගොස් ඇත.

කොළඹ තේ වෙන්දේසියේදී බස්නාහිර සහ නුවරඑළිය උසස් තේ සඳහා දැඩි තරඟකාරී ඉල්ලුමක් වාර්තා වූ අතර විශේෂිත වතු තේ සඳහා ඉතිහාසයේ ඉහළම මිල ගණන් හිමි විය.

වැවිලි සමාගම් සූර්ය බලශක්ති සැකසුම් ඒකක වෙත යොමුවීම හේතුවෙන් මෙහෙයුම් පිරිවැය අවම කර ලාභදායීත්වය ඉහළ නංවා ගැනීමට හැකි වී තිබේ.`
  },
  5: {
    title: "කෘෂිකාර්මික ආනයන සඳහා නව බදු ව්‍යුහයක් පාර්ලිමේන්තු කාරක සභාව විසින් අනුමත කරයි",
    deck: "ග්‍රාහකයින්ට පමණයි: දේශීය ගොවීන් ආරක්ෂා කිරීම සහ ආහාර උද්ධමනය පාලනය කිරීම පිළිබඳ පුළුල් විශ්ලේෂණය.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් ග්‍රාහක විශේෂ වාර්තාව) — බඩඉරිඟු, සහල් සහ ආහාරයට ගත හැකි තෙල් ඇතුළු ප්‍රධාන කෘෂිකාර්මික ආනයන සඳහා වූ නවීකරණය කරන ලද වාරික තීරුබදු ප්‍රතිපත්තිය රජයේ මුදල් පිළිබඳ පාර්ලිමේන්තු කාරක සභාව (COPF) විසින් අනුමත කර ඇත.

අස්වනු නෙළන කාලසීමාවලදී දේශීය ගොවීන්ගේ නිෂ්පාදන සඳහා ස්ථාවර මිලක් සහතික කිරීම සහ නාගරික පාරිභෝගිකයින් සඳහා ආහාර උද්ධමනය පාලනය කිරීම අතර සමතුලිතතාවක් ඇති කිරීම මෙම ප්‍රතිපත්තියේ අරමුණයි.`
  },
  6: {
    title: "දෙවන කාර්තුවේදී වාණිජ බැංකු ක්ෂේත්‍රයේ ශුද්ධ ලාභය 24% කින් ඉහළ යයි",
    deck: "කොමර්ෂල් බැංකුව, හැටන් නැෂනල් බැංකුව සහ සම්පත් බැංකුව ප්‍රමුඛව ශුද්ධ පොලී ආදායම් වර්ධනයක් වාර්තා කරයි.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ බලපත්‍රලාභී වාණිජ බැංකු ක්ෂේත්‍රය දෙවන කාර්තුව සඳහා සිය ශුද්ධ ලාභයේ 24% ක වාර්ෂික වර්ධනයක් වාර්තා කර ඇත. භාණ්ඩාගාර බිල්පත් මත අඩු වූ හානිපූරණ ගාස්තු සහ පෞද්ගලික ණය ඉල්ලුම පුළුල් වීම මෙයට ප්‍රධාන වශයෙන් හේතු විය.`
  },
  7: {
    title: "ඇඟලුම් අපනයන යථා තත්ත්වයට: ඇමරිකානු සහ යුරෝපා වෙළඳපොළෙන් ඩොලර් මිලියන 450ක ඇණවුම්",
    deck: "ඇමරිකා එක්සත් ජනපද සහ යුරෝපීය ප්‍රමුඛ වෙළඳ නාම සඳහා උසස් තත්ත්වයේ ඇඟලුම් නිෂ්පාදනය කරන ආයතනවල ධාරිතාව උපරිම වේ.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — උතුරු ඇමරිකානු සහ යුරෝපීය ප්‍රමුඛ සිල්ලර වෙළඳ ජාලයන් වෙතින් ලැබුණු උසස් තත්ත්වයේ ඇඟලුම් ඇණවුම් හේතුවෙන් මාසික ඇඟලුම් නැව්ගත කිරීම් 12% කින් වර්ධනය වී ඇති බව ඒකාබද්ධ ඇඟලුම් සංගම් සංසදය (JAAF) නිවේදනය කළේය.`
  },
  8: {
    title: "පුනර්ජනනීය බලශක්ති සැලැස්ම: 2028 වන විට මෙගාවොට් 2,000 ක සූර්ය සහ සුළං බලශක්ති පද්ධතියට එක් කිරීමට ඉලක්ක කරයි",
    deck: "විදුලිබල හා බලශක්ති අමාත්‍යාංශය මන්නාරම සහ පූනරීන් ප්‍රදේශවල බැටරි ගබඩා සංකීර්ණ සඳහා ටෙන්ඩර් කැඳවයි.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ ජාතික විදුලිබල පද්ධතියේ 70% ක් පිරිසිදු පුනර්ජනනීය බලශක්තියෙන් සපුරා ගැනීමේ ඉලක්කය පෙරදැරි කරගනිමින් මෙගාවොට් 2,000 ක පුනර්ජනනීය විදුලි උත්පාදන ටෙන්ඩර් පත්‍රිකා ලංකා විදුලිබල මණ්ඩලය (CEB) විසින් අවසන් කර ඇත.`
  },
  9: {
    title: "කොළඹ පෝට් සිටි ආර්ථික කලාපය: තාක්ෂණ සහ නාවික ක්ෂේත්‍රවල ඩොලර් මිලියන 120ක ආයෝජන ආකර්ෂණය කරයි",
    deck: "තනි කවුළු ආයෝජන පහසුකම් සැලසීමේ ආයතනය විසින් ජාත්‍යන්තර මෘදුකාංග සහ නාවික ලොජිස්ටික්ස් ආයතන තුනකට බලපත්‍ර නිකුත් කරයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — කොළඹ වරාය නගර ආර්ථික කොමිෂන් සභාව විසින් ගෝලීය තොරතුරු තාක්ෂණ සහ සමුද්‍රීය ලොජිස්ටික්ස් සමාගම් තුනක් සඳහා මෙහෙයුම් බලපත්‍ර නිකුත් කර ඇති අතර මූල්‍ය කලාපයේ කැපවූ සෘජු විදේශ ආයෝජන ප්‍රමාණය ඩොලර් බිලියන 1.2 ඉක්මවා ඇත.`
  },
  10: {
    title: "සංචාරක ආදායම ඩොලර් බිලියන 1.8 සීමාවට: යුරෝපීය සංචාරකයින්ගේ පැමිණීම ඉහළ යාම හේතුවෙන්",
    deck: "ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරිය (SLTDA) වසරේ මුල් මාස 7 තුළ සංචාරකයින් මිලියන 1.2 කට අධික ප්‍රමාණයක් පැමිණ ඇති බව නිවේදනය කරයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — වසරේ මුල් මාස හත තුළ සංචාරක ඉපැයීම් ඇමරිකානු ඩොලර් බිලියන 1.8 දක්වා ළඟා වී ඇති අතර එක්සත් රාජධානිය, ජර්මනිය සහ ඉන්දියාව ප්‍රමුඛව සංචාරකයින් මිලියන 1.2 කට අධික පිරිසක් ශ්‍රී ලංකාවට පැමිණ ඇත.`
  },
  11: {
    title: "භාණ්ඩාගාර බිල්පත් වෙන්දේසියේදී දේශීය ආයෝජන ඉල්ලුම ඉහළ යාම හේතුවෙන් ඵලදායීතා අනුපාත ස්ථාවර වේ",
    deck: "දින 364 භාණ්ඩාගාර බිල්පත් ඵලදායීතාව 9.42% මට්ටමේ ස්ථාවර වන අතර රාජ්‍ය ණය සඳහා පවතින ඉල්ලුම ඉහළ යයි.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — රාජ්‍ය ණය කළමනාකරණ දෙපාර්තමේන්තුව විසින් පවත්වන ලද දින 91, 182 සහ 364 භාණ්ඩාගාර බිල්පත් වෙන්දේසිවලදී පිරිනැමූ ප්‍රමාණය ඉක්මවා ලංසු ලැබුණු අතර ආයෝජකයින්ගේ ඉහළ විශ්වාසය හේතුවෙන් ඵලදායීතා අනුපාත 9.42% මට්ටමේ ස්ථාවර විය.`
  },
  12: {
    title: "අපනයන සංවර්ධන මණ්ඩලය (EDB) 2030 වන විට ඩොලර් බිලියන 25 ක ජාතික අපනයන සැලැස්ම එළිදක්වයි",
    deck: "ඉලෙක්ට්‍රොනික නිෂ්පාදන, සකසන ලද කුළුබඩු, සාගර නිෂ්පාදන සහ ඩිජිටල් තොරතුරු තාක්ෂණ සේවා ප්‍රධාන ක්ෂේත්‍ර ලෙස හඳුනා ගනී.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — අපනයන සංවර්ධන මණ්ඩලයේ සභාපතිවරයා විසින් 2030 ජාතික අපනයන ව්‍යාප්ති උපායමාර්ගය කොළඹදී එළිදක්වන ලද අතර ඉලෙක්ට්‍රොනික උපාංග, කුළුබඩු, ධීවර නිෂ්පාදන සහ මෘදුකාංග සේවා ප්‍රධාන අපනයන ක්ෂේත්‍ර ලෙස නම් කරන ලදී.`
  },

  // Additional Initial Articles in Sinhala
  302: {
    title: "මූඩීස් (Moody's) ශ්‍රී ලංකාවේ Caa1 ස්වෛරී ණය ශ්‍රේණිගත කිරීම ස්ථාවර දැක්මක් සහිතව යළි තහවුරු කරයි",
    deck: "ණය ප්‍රතිව්‍යුහගත කිරීමේ ක්‍රියාදාමය සහ රාජ්‍ය මූල්‍ය ඒකාබද්ධතාවය හේතුවෙන් ශ්‍රී ලංකා රජයේ දිගුකාලීන නිකුතු ශ්‍රේණිගත කිරීම් ස්ථාවර මට්ටමක පවතින බව මූඩීස් ආයතනය පවසයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජාත්‍යන්තර ණය ශ්‍රේණිගත කිරීමේ ආයතනයක් වන මූඩීස් (Moody's Ratings) ශ්‍රී ලංකා රජයේ දිගුකාලීන විදේශ මුදල් සහ දේශීය මුදල් නිකුතු ශ්‍රේණිගත කිරීම් Caa1 මට්ටමේ පවත්වා ගැනීමට තීරණය කර ඇති අතර එහි ඉදිරි දැක්ම ස්ථාවර (Stable) මට්ටමක තබා ඇත.

ද්විපාර්ශ්වික ණය හිමියන් සහ ජාත්‍යන්තර ස්වෛරී බැඳුම්කර (ISB) හිමියන් සමඟ ණය ප්‍රතිව්‍යුහගත කිරීමේ ගිවිසුම් ක්‍රියාත්මක කිරීම සහ ජාත්‍යන්තර මූල්‍ය අරමුදලේ (IMF) වැඩසටහන යටතේ රජය අත්කර ගෙන ඇති මූල්‍ය ඒකාබද්ධතාවය මෙම තීරණයට ප්‍රධාන හේතු ලෙස මූඩීස් ආයතනය පෙන්වා දෙයි.`
  },
  "sri-lanka-caa1-sovereign-rating-confirmed-moodys": {
    title: "මූඩීස් (Moody's) ශ්‍රී ලංකාවේ Caa1 ස්වෛරී ණය ශ්‍රේණිගත කිරීම ස්ථාවර දැක්මක් සහිතව යළි තහවුරු කරයි",
    deck: "ණය ප්‍රතිව්‍යුහගත කිරීමේ ක්‍රියාදාමය සහ රාජ්‍ය මූල්‍ය ඒකාබද්ධතාවය හේතුවෙන් ශ්‍රී ලංකා රජයේ දිගුකාලීන නිකුතු ශ්‍රේණිගත කිරීම් ස්ථාවර මට්ටමක පවතින බව මූඩීස් ආයතනය පවසයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජාත්‍යන්තර ණය ශ්‍රේණිගත කිරීමේ ආයතනයක් වන මූඩීස් (Moody's Ratings) ශ්‍රී ලංකා රජයේ දිගුකාලීන විදේශ මුදල් සහ දේශීය මුදල් නිකුතු ශ්‍රේණිගත කිරීම් Caa1 මට්ටමේ පවත්වා ගැනීමට තීරණය කර ඇත.`
  },
  303: {
    title: "ශ්‍රී ලංකාවේ නව ඇමරිකානු තානාපති ලෙස නම් කළ එරික් මේයර් දිවයිනට පැමිණෙයි",
    deck: "ද්විපාර්ශ්වික වෙළඳාම, සෘජු ආයෝජන සහ කලාපීය සමුද්‍රීය ආරක්ෂාව පිළිබඳ අවධානය යොමු කරමින් ජ්‍යෙෂ්ඨ රාජ්‍ය තාන්ත්‍රික නිලධාරී එරික් මේයර් මහතා සිය රාජකාරි ආරම්භ කිරීමට කොළඹට පැමිණෙයි.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ සහ මාලදිවයිනේ නව එක්සත් ජනපද තානාපතිවරයා ලෙස නම් කරන ලද ජ්‍යෙෂ්ඨ රාජ්‍ය තාන්ත්‍රික නිලධාරී එරික් මේයර් (Eric Meyer) මහතා සිය ධුරයේ රාජකාරි භාර ගැනීම සඳහා කොළඹට පැමිණ තිබේ.

දෙරට අතර ද්විපාර්ශ්වික වෙළඳ සබඳතා ශක්තිමත් කිරීම, ඇමරිකානු පෞද්ගලික අංශයේ සෘජු විදේශ ආයෝජන ප්‍රවර්ධනය කිරීම සහ ඉන්දු-පැසිෆික් කලාපීය සමුද්‍රීය ආරක්ෂණ සහයෝගීතාවය පුළුල් කිරීම සිය ප්‍රමුඛතාවය බව තානාපති කාර්යාලය නිකුත් කළ නිවේදනයක දැක්වේ.`
  },
  "us-ambassador-designate-eric-meyer-arrives-sri-lanka": {
    title: "ශ්‍රී ලංකාවේ නව ඇමරිකානු තානාපති ලෙස නම් කළ එරික් මේයර් දිවයිනට පැමිණෙයි",
    deck: "ද්විපාර්ශ්වික වෙළඳාම, සෘජු ආයෝජන සහ කලාපීය සමුද්‍රීය ආරක්ෂාව පිළිබඳ අවධානය යොමු කරමින් ජ්‍යෙෂ්ඨ රාජ්‍ය තාන්ත්‍රික නිලධාරී එරික් මේයර් මහතා සිය රාජකාරි ආරම්භ කිරීමට කොළඹට පැමිණෙයි.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ නව එක්සත් ජනපද තානාපතිවරයා ලෙස නම් කරන ලද ජ්‍යෙෂ්ඨ රාජ්‍ය තාන්ත්‍රික නිලධාරී එරික් මේයර් මහතා සිය ධුරයේ රාජකාරි භාර ගැනීම සඳහා කොළඹට පැමිණ තිබේ.`
  },
  304: {
    title: "බැටරි බලශක්ති ගබඩා සහිත සූර්ය බලශක්ති පද්ධති සඳහා මහජන උපයෝගිතා කොමිසම නව ගාස්තු ක්‍රමවේදයක් ප්‍රකාශයට පත් කරයි",
    deck: "බැටරි බලශක්ති ගබඩා පද්ධති (BESS) සහිත වාණිජ සූර්ය බලශක්ති ජනන ව්‍යාපෘති සඳහා නව පෝෂණ ගාස්තු (FITs) මහජන උපයෝගිතා කොමිෂන් සභාව (PUCSL) විසින් ගැසට් මගින් ප්‍රකාශයට පත් කර ඇත.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — බැටරි බලශක්ති ගබඩා පද්ධති (Battery Energy Storage Systems - BESS) සහිත මහා පරිමාණ වාණිජ සූර්ය බලශක්ති ව්‍යාපෘති වෙනුවෙන් නව පෝෂණ ගාස්තු ක්‍රමවේදයක් (Feed-in Tariff) ශ්‍රී ලංකා මහජන උපයෝගිතා කොමිෂන් සභාව (PUCSL) විසින් නිල වශයෙන් ගැසට් මඟින් ප්‍රකාශයට පත් කර ඇත.

ජාතික විදුලිබල පද්ධතියේ ස්ථායීතාවය සුරකිමින් උපරිම ඉල්ලුම පවතින රාත්‍රී කාලයේදී විදුලිය සැපයීම සඳහා පෞද්ගලික පුනර්ජනනීය බලශක්ති ආයෝජකයින් දිරිමත් කිරීම මෙහි මූලික අරමුණයි.`
  },
  "sri-lanka-regulator-sets-battery-solar-tariff-new-renewable-fits": {
    title: "බැටරි බලශක්ති ගබඩා සහිත සූර්ය බලශක්ති පද්ධති සඳහා මහජන උපයෝගිතා කොමිසම නව ගාස්තු ක්‍රමවේදයක් ප්‍රකාශයට පත් කරයි",
    deck: "බැටරි බලශක්ති ගබඩා පද්ධති (BESS) සහිත වාණිජ සූර්ය බලශක්ති ජනන ව්‍යාපෘති සඳහා නව පෝෂණ ගාස්තු (FITs) මහජන උපයෝගිතා කොමිෂන් සභාව (PUCSL) විසින් ගැසට් මගින් ප්‍රකාශයට පත් කර ඇත.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — බැටරි බලශක්ති ගබඩා පද්ධති සහිත වාණිජ සූර්ය බලශක්ති ව්‍යාපෘති සඳහා නව ගාස්තු ක්‍රමවේදයක් ප්‍රකාශයට පත් කර ඇත.`
  },
  305: {
    title: "ප්‍රවීණ ව්‍යාපාරික රංජිත් පේජ් CT Holdings PLC සමාගමේ සිය සමස්ත කොටස් හිමිකාරිත්වය විකුණා දමයි",
    deck: "ආහාර හා සිල්ලර වෙළඳ ක්ෂේත්‍රයේ දැවැන්තයෙකු වන CT Holdings PLC සමාගමේ සියලුම කොටස් හිමිකාරිත්වය ප්‍රවීණ ආයතනික විධායක රංජිත් පේජ් මහතා විසින් බැහැර කරනු ලැබ ඇත.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ ප්‍රමුඛතම ආහාර සහ සිල්ලර වෙළඳ සමූහ ව්‍යාපාරයක් වන CT Holdings PLC හි නියෝජ්‍ය සභාපති සහ ප්‍රධාන විධායක නිලධාරී රංජිත් පේජ් මහතා එම සමාගමේ තමන් සතු සම්පූර්ණ කොටස් ප්‍රමාණය කොළඹ කොටස් වෙළෙඳපොළ (CSE) හරහා අලෙවි කර තිබේ.`
  },
  "ranjith-page-sells-out-sri-lanka-ct-holdings": {
    title: "ප්‍රවීණ ව්‍යාපාරික රංජිත් පේජ් CT Holdings PLC සමාගමේ සිය සමස්ත කොටස් හිමිකාරිත්වය විකුණා දමයි",
    deck: "ආහාර හා සිල්ලර වෙළඳ ක්ෂේත්‍රයේ දැවැන්තයෙකු වන CT Holdings PLC සමාගමේ සියලුම කොටස් හිමිකාරිත්වය ප්‍රවීණ ආයතනික විධායක රංජිත් පේජ් මහතා විසින් බැහැර කරනු ලැබ ඇත.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ප්‍රවීණ ව්‍යාපාරික රංජිත් පේජ් මහතා CT Holdings සමාගමේ තමන් සතු සියලු කොටස් අලෙවි කර ඇත.`
  },
  306: {
    title: "ශ්‍රී ලංකාවේ ප්‍රාග්ධන වියදම්වල ප්‍රායෝගික භෞතික ප්‍රගතිය අයවැය ගිණුම් සංඛ්‍යාවලට වඩා ඉදිරියෙන්: අමාත්‍යවරයා පවසයි",
    deck: "ප්‍රවාහන හා වාරිමාර්ග ව්‍යාපෘති හරහා රාජ්‍ය යටිතල පහසුකම් ප්‍රාග්ධන වියදම් (Capex) ක්‍රියාත්මක කිරීම අයවැය මුදල් වෙන්කිරීම්වලට වඩා වේගවත් ප්‍රගතියක් අත්කරගෙන ඇත.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ප්‍රවාහන, මහාමාර්ග සහ වාරිමාර්ග ක්ෂේත්‍රයන්හි ප්‍රධාන යටිතල පහසුකම් ව්‍යාපෘති රැසක භෞතික ඉදිකිරීම් කටයුතු අයවැය ලේඛනයේ දැක්වෙන ගිණුම්කරණ ප්‍රතිපාදනවලට වඩා ඉහළ වේගයකින් සිදුවන බව මහාභාණ්ඩාගාර නිලධාරීන් තහවුරු කර ඇත.`
  },
  "sri-lanka-capex-physical-progress-usually-ahead-budget-numbers": {
    title: "ශ්‍රී ලංකාවේ ප්‍රාග්ධන වියදම්වල ප්‍රායෝගික භෞතික ප්‍රගතිය අයවැය ගිණුම් සංඛ්‍යාවලට වඩා ඉදිරියෙන්: අමාත්‍යවරයා පවසයි",
    deck: "ප්‍රවාහන හා වාරිමාර්ග ව්‍යාපෘති හරහා රාජ්‍ය යටිතල පහසුකම් ප්‍රාග්ධන වියදම් (Capex) ක්‍රියාත්මක කිරීම අයවැය මුදල් වෙන්කිරීම්වලට වඩා වේගවත් ප්‍රගතියක් අත්කරගෙන ඇත.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ප්‍රාග්ධන ව්‍යාපෘතිවල භෞතික ප්‍රගතිය සාර්ථක මට්ටමක පවතින බව රජය පවසයි.`
  },
  307: {
    title: "අන්තර් බැංකු අතිරික්ත මුදල් සංචිත පහත වැටේ; පෞද්ගලික අංශයේ ණය වර්ධනය ඉහළ යාම හේතුවෙන්",
    deck: "පෞද්ගලික අංශයේ වාණිජ ණය ඉල්ලුම වේගවත් වීම සහ මහ බැංකුව විසින් වෙළඳපල අතිරික්තය වන්ධ්‍යාකරණය (sterilization) කිරීම නිසා වාණිජ බැංකු ද්‍රවශීලතා ශේෂයන් සාමාන්‍යකරණය වේ.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — දේශීය වාණිජ බැංකු පද්ධතිය සතු අතිරික්ත රුපියල් ද්‍රවශීලතාවය (Excess Liquidity) රුපියල් බිලියන 95 දක්වා පහත වැටී ඇති අතර පෞද්ගලික අංශය වෙත ලබා දෙන බැංකු ණය ප්‍රසාරණය වීම මීට ප්‍රධාන හේතුව බව මහ බැංකු වාර්තා පෙන්වා දෙයි.`
  },
  "sri-lanka-interbank-excess-reserves-down": {
    title: "අන්තර් බැංකු අතිරික්ත මුදල් සංචිත පහත වැටේ; පෞද්ගලික අංශයේ ණය වර්ධනය ඉහළ යාම හේතුවෙන්",
    deck: "පෞද්ගලික අංශයේ වාණිජ ණය ඉල්ලුම වේගවත් වීම සහ මහ බැංකුව විසින් වෙළඳපල අතිරික්තය වන්ධ්‍යාකරණය (sterilization) කිරීම නිසා වාණිජ බැංකු ද්‍රවශීලතා ශේෂයන් සාමාන්‍යකරණය වේ.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — බැංකු පද්ධතියේ අතිරික්ත ද්‍රවශීලතාවය පහත වැටී ඇති බව මහ බැංකුව පවසයි.`
  },
  308: {
    title: "විදේශීය ආයෝජකයින් දේශීය බැඳුම්කර මිලදී ගැනීමත් සමඟ රුපියල සුළු වශයෙන් අතිප්‍රමාණය වීමට මහ බැංකුව ඉඩහරියි",
    deck: "විදේශීය ආයෝජන අරමුදල් ශ්‍රී ලංකා භාණ්ඩාගාර බිල්පත් සහ බැඳුම්කර මිලදී ගැනීම හේතුවෙන් ඇමරිකානු ඩොලරයට සාපේක්ෂව රුපියලේ ක්ෂණික විනිමය අනුපාතිකය රු. 298.40 දක්වා ශක්තිමත් වේ.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — විදේශීය ආයෝජකයින් විසින් දේශීය භාණ්ඩාගාර බිල්පත් සහ බැඳුම්කර විශාල වශයෙන් මිලදී ගැනීමත් සමඟ විදේශ විනිමය වෙළඳපොළට ඩොලර් ගලා ඒම ඉහළ යාමෙන් රුපියලේ අගය ඇමරිකානු ඩොලරයකට රු. 298.40 මට්ටමට ශක්තිමත් වීමට ශ්‍රී ලංකා මහ බැංකුව ඉඩ ලබා දී ඇත.`
  },
  "sri-lanka-cb-allows-small-rupee-appreciation-foreigners-buy-bonds": {
    title: "විදේශීය ආයෝජකයින් දේශීය බැඳුම්කර මිලදී ගැනීමත් සමඟ රුපියල සුළු වශයෙන් අතිප්‍රමාණය වීමට මහ බැංකුව ඉඩහරියි",
    deck: "විදේශීය ආයෝජන අරමුදල් ශ්‍රී ලංකා භාණ්ඩාගාර බිල්පත් සහ බැඳුම්කර මිලදී ගැනීම හේතුවෙන් ඇමරිකානු ඩොලරයට සාපේක්ෂව රුපියලේ ක්ෂණික විනිමය අනුපාතිකය රු. 298.40 දක්වා ශක්තිමත් වේ.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — රුපියලේ අගය ස්ථාවර මට්ටමක පවතින බව විදේශ විනිමය වෙළඳපොළ ආරංචි මාර්ග තහවුරු කරයි.`
  },
  201: {
    title: "දේශීය ණය ප්‍රශස්තකරණයෙන් (DDO) අනතුරුව වාණිජ බැංකුවල ප්‍රාග්ධන ප්‍රමාණාත්මක අනුපාත අතිරික්තයක් සටහන් කරයි",
    deck: "ස්වෛරී බැඳුම්කර ප්‍රතිව්‍යුහගත කිරීමේ අවිනිශ්චිතතාවයන් පහව යාම සහ පෞද්ගලික අංශයේ ණය ඉල්ලුම යථා තත්ත්වයට පත්වීමත් සමඟ පළමු පෙළ ප්‍රාග්ධන අනුපාතය (Tier-1 Capital) 14.8% ඉක්මවයි.",
    category: "බැංකු",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — දේශීය ණය ප්‍රශස්තකරණ (DDO) වැඩසටහන සාර්ථකව නිමාවට පත්වීමත් සමඟ ශ්‍රී ලංකාවේ ප්‍රමුඛ වාණිජ බැංකුවල මූල්‍ය ශක්තිය සහ ප්‍රාග්ධන ප්‍රමාණාත්මක අනුපාතයන් (CAR) නියාමන අවම අවශ්‍යතාවලට වඩා බෙහෙවින් ඉහළ මට්ටමකට ළඟා වී ඇති බව වාර්ෂික මූල්‍ය ප්‍රකාශන තහවුරු කරයි.`
  },
  "commercial-banks-record-capital-adequacy-surplus-ddo": {
    title: "දේශීය ණය ප්‍රශස්තකරණයෙන් (DDO) අනතුරුව වාණිජ බැංකුවල ප්‍රාග්ධන ප්‍රමාණාත්මක අනුපාත අතිරික්තයක් සටහන් කරයි",
    deck: "ස්වෛරී බැඳුම්කර ප්‍රතිව්‍යුහගත කිරීමේ අවිනිශ්චිතතාවයන් පහව යාම සහ පෞද්ගලික අංශයේ ණය ඉල්ලුම යථා තත්ත්වයට පත්වීමත් සමඟ පළමු පෙළ ප්‍රාග්ධන අනුපාතය (Tier-1 Capital) 14.8% ඉක්මවයි.",
    category: "බැංකු",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — වාණිජ බැංකුවල ප්‍රාග්ධන ප්‍රමාණාත්මක අනුපාත ශක්තිමත් මට්ටමක පවතින බව වාර්තා වේ.`
  },
  202: {
    title: "මැදපෙරදිග වෙළඳපල ඉල්ලුම ඉහළ යාමත් සමඟ සිලෝන් තේ අපනයන ආදායම ඩොලර් බිලියන 1.4 ඉක්මවයි",
    deck: "කොළඹ තේ වෙන්දේසියේදී ඕතඩොක්ස් කළු තේ කිලෝග්‍රෑමයක සාමාන්‍ය මිල ඩොලර් 3.80 ඉක්මවමින් වාර්තාගත ඉහළ මිලක් අඛණ්ඩව රඳවා ගනී.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ලෝක ප්‍රකට සිලෝන් තේ සඳහා ඉරාකය, තුර්කිය, එක්සත් අරාබි එමීර් රාජ්‍යය සහ සෞදි අරාබිය ඇතුළු මැදපෙරදිග රටවලින් ලැබෙන ඉහළ ඉල්ලුම හේතුවෙන් වාර්ෂික තේ අපනයන ආදායම ඇමරිකානු ඩොලර් බිලියන 1.4 ක සීමාව ඉක්මවා ගොස් ඇති බව තේ මණ්ඩලය පවසයි.`
  },
  "ceylon-tea-export-revenue-crosses-1-4-billion": {
    title: "මැදපෙරදිග වෙළඳපල ඉල්ලුම ඉහළ යාමත් සමඟ සිලෝන් තේ අපනයන ආදායම ඩොලර් බිලියන 1.4 ඉක්මවයි",
    deck: "කොළඹ තේ වෙන්දේසියේදී ඕතඩොක්ස් කළු තේ කිලෝග්‍රෑමයක සාමාන්‍ය මිල ඩොලර් 3.80 ඉක්මවමින් වාර්තාගත ඉහළ මිලක් අඛණ්ඩව රඳවා ගනී.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — සිලෝන් තේ අපනයන ආදායම ඩොලර් බිලියන 1.4 ඉක්මවයි.`
  },
  203: {
    title: "විස්තීර්ණ ණය පහසුකම (EFF) යටතේ හතරවන සමාලෝචනය IMF සාර්ථකව අවසන් කරයි; රාජ්‍ය ආදායම් ඉලක්ක අගයයි",
    deck: "ප්‍රාථමික මූල්‍ය අතිරික්තය දළ දේශීය නිෂ්පාදිතයෙන් 2.3% දක්වා ළඟා වීමත් සමඟ ඩොලර් මිලියන 336 ක මූල්‍ය වාරිකය නිදහස් කිරීමට විධායක මණ්ඩලය අනුමැතිය ලබා දෙයි.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ ආර්ථික ප්‍රතිසංස්කරණ වැඩසටහනේ හතරවන සමාලෝචනය ජාත්‍යන්තර මූල්‍ය අරමුදලේ විධායක මණ්ඩලය විසින් නිල වශයෙන් අනුමත කර ඇති අතර එමගින් ඩොලර් මිලියන 336 ක ණය වාරිකය නිදහස් කර ඇත.`
  },
  "imf-completes-fourth-review-eff-program": {
    title: "විස්තීර්ණ ණය පහසුකම (EFF) යටතේ හතරවන සමාලෝචනය IMF සාර්ථකව අවසන් කරයි; රාජ්‍ය ආදායම් ඉලක්ක අගයයි",
    deck: "ප්‍රාථමික මූල්‍ය අතිරික්තය දළ දේශීය නිෂ්පාදිතයෙන් 2.3% දක්වා ළඟා වීමත් සමඟ ඩොලර් මිලියන 336 ක මූල්‍ය වාරිකය නිදහස් කිරීමට විධායක මණ්ඩලය අනුමැතිය ලබා දෙයි.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — IMF හතරවන සමාලෝචනය සාර්ථකව අවසන් වී ඇත.`
  },
  204: {
    title: "විදේශීය ආයෝජන ගලා ඒම හේතුවෙන් කොළඹ කොටස් වෙළඳපොළ ASPI දර්ශකය ඒකක 13,000 සීමාව පසුකරයි",
    deck: "දෛනික වෙළඳපල පිරිවැටුම රුපියල් බිලියන 3.8 ක් ලෙස වාර්තා වෙද්දී බැංකු සහ නිෂ්පාදන ක්ෂේත්‍රයේ ප්‍රමුඛ පෙළේ සමාගම් කොටස් මිල ඉහළ යාමට මූලිකත්වය ගනී.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — කොළඹ කොටස් වෙළෙඳපොළේ සියලු කොටස් මිල දර්ශකය (ASPI) අද දිනයේදී ඒකක 13,000 සීමාව පසුකරමින් වසර දෙකක වාර්තාගත ඉහළම අගය සනිටුහන් කළේය.`
  },
  "colombo-stock-exchange-aspi-crosses-13000-milestone": {
    title: "විදේශීය ආයෝජන ගලා ඒම හේතුවෙන් කොළඹ කොටස් වෙළඳපොළ ASPI දර්ශකය ඒකක 13,000 සීමාව පසුකරයි",
    deck: "දෛනික වෙළඳපල පිරිවැටුම රුපියල් බිලියන 3.8 ක් ලෙස වාර්තා වෙද්දී බැංකු සහ නිෂ්පාදන ක්ෂේත්‍රයේ ප්‍රමුඛ පෙළේ සමාගම් කොටස් මිල ඉහළ යාමට මූලිකත්වය ගනී.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ASPI දර්ශකය ඒකක 13,000 සීමාව ඉක්මවා ඇත.`
  },
  205: {
    title: "ද්විත්ව විනිමය අනුපාතවල මිථ්‍යාව: ශ්‍රී ලංකාවේ මුදල් බැඳීම් අත්හදා බැලීම්වලින් උගත් පාඩම්",
    deck: "අත්තනෝමතික විනිමය පාලනයන් සහ කෘතිම අනුපාත කළුකඩ වෙළඳපල නිර්මාණය කරමින් අපනයන මිල යාන්ත්‍රණය විනාශ කළේ කෙසේද යන්න පිළිබඳ ගැඹුරු විශ්ලේෂණයක්.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ ඓතිහාසික ආර්ථික අර්බුදයන්ට මූලික හේතුවක් වූ කෘතිම ද්විත්ව විනිමය අනුපාත ක්‍රමවේදයන් සහ විනිමය පාලන රෙගුලාසි මඟින් වෙළඳපල ආර්ථිකයට සිදු වූ බරපතල හානිය මෙම ලිපියෙන් විමසා බලයි.`
  },
  "fallacy-of-dual-exchange-rates-lessons-pegging": {
    title: "ද්විත්ව විනිමය අනුපාතවල මිථ්‍යාව: ශ්‍රී ලංකාවේ මුදල් බැඳීම් අත්හදා බැලීම්වලින් උගත් පාඩම්",
    deck: "අත්තනෝමතික විනිමය පාලනයන් සහ කෘතිම අනුපාත කළුකඩ වෙළඳපල නිර්මාණය කරමින් අපනයන මිල යාන්ත්‍රණය විනාශ කළේ කෙසේද යන්න පිළිබඳ ගැඹුරු විශ්ලේෂණයක්.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — විනිමය අනුපාත පිළිබඳ ආර්ථික විශ්ලේෂණය.`
  },
  206: {
    title: "විදේශ ප්‍රේෂණ ඉහළ යාමත් සමඟ ශ්‍රී ලංකාවේ නිල විදේශ සංචිත ඩොලර් බිලියන 6.5 ඉක්මවයි",
    deck: "නිල බැංකු පද්ධතිය හරහා විදේශගත ශ්‍රමිකයින්ගේ ප්‍රේෂණ මාසිකව ඩොලර් මිලියන 580 ක සාමාන්‍යයක් කරා ළඟා වෙමින් ගෙවුම් ශේෂය තවදුරටත් ශක්තිමත් කරයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ නිල විදේශ විනිමය සංචිත ප්‍රමාණය (Gross Official Reserves) ඇමරිකානු ඩොලර් බිලියන 6.5 ඉක්මවා ගොස් ඇති බව ශ්‍රී ලංකා මහ බැංකුව තහවුරු කරයි.`
  },
  "gross-official-reserves-surpass-6-5-billion": {
    title: "විදේශ ප්‍රේෂණ ඉහළ යාමත් සමඟ ශ්‍රී ලංකාවේ නිල විදේශ සංචිත ඩොලර් බිලියන 6.5 ඉක්මවයි",
    deck: "නිල බැංකු පද්ධතිය හරහා විදේශගත ශ්‍රමිකයින්ගේ ප්‍රේෂණ මාසිකව ඩොලර් මිලියන 580 ක සාමාන්‍යයක් කරා ළඟා වෙමින් ගෙවුම් ශේෂය තවදුරටත් ශක්තිමත් කරයි.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — විදේශ සංචිත ඩොලර් බිලියන 6.5 ඉක්මවයි.`
  },
  "why-classical-currency-boards-eliminate-bop-crises": {
    title: "සම්භාව්‍ය මුදල් මණ්ඩල ක්‍රමයක් මඟින් ගෙවුම් ශේෂ අර්බුද තුරන් කරන්නේ ඇයි: 1884 මුදල් ආඥාපනත පිළිබඳ විග්‍රහයක්",
    deck: "1950 ට පෙර දශක හතක් පුරා ලංකා රුපියලේ ස්ථාවරත්වය සහ විශ්වසනීයත්වය ආරක්ෂා කළ ස්වයංක්‍රීය 100% විදේශ සංචිත පිටුබලය සහිත ක්‍රමවේදය පිළිබඳ විශ්ලේෂණයක්.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — 1884 මුදල් ආඥාපනත යටතේ ස්ථාපනය කරන ලද ලංකාවේ මුල් මුදල් මණ්ඩලය (Currency Board) මඟින් කිසිදු ගෙවුම් ශේෂ අර්බුදයකින් තොරව රුපියලේ අගය ආරක්ෂා කළ ආකාරය පිළිබඳ ඓතිහාසික ආර්ථික විශ්ලේෂණයකි.`
  },
  "it-bpm-sector-hits-1-7-billion-milestone": {
    title: "AI සහ ක්ලවුඩ් තාක්ෂණ අපනයන වර්ධනයත් සමඟ ශ්‍රී ලංකාවේ තොරතුරු තාක්ෂණ හා BPM ක්ෂේත්‍රය ඩොලර් බිලියන 1.7 සීමාවට",
    deck: "ගෝලීය මූල්‍ය කේන්ද්‍රස්ථාන සිය මෘදුකාංග ඉංජිනේරු මධ්‍යස්ථාන කොළඹ පිහිටුවීමත් සමඟ ඉහළ ආදායම් ලබන ඩිජිටල් රැකියා 200,000 ක ඉලක්කයක් කරා SLASSCOM ගමන් කරයි.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ තොරතුරු තාක්ෂණ හා ව්‍යාපාර ක්‍රියාවලි කළමනාකරණ (IT/BPM) ක්ෂේත්‍රයේ වාර්ෂික අපනයන ආදායම ඇමරිකානු ඩොලර් බිලියන 1.7 ක සන්ධිස්ථානය පසුකර ඇති බව ශ්‍රී ලංකා මෘදුකාංග හා සේවා සමාගම් සංගමය (SLASSCOM) නිවේදනය කරයි.`
  },
  "colombo-port-ect-phase-1-commissioned": {
    title: "කොළඹ වරායේ නැගෙනහිර බහාලුම් පර්යන්තයේ (ECT) පළමු අදියර විවෘත වේ: ගැඹුරු මුහුදු ධාරිතාවට TEU මිලියන 1.2 ක් එක්වෙයි",
    deck: "ප්‍රතිනැව්ගත කිරීමේ පරිමාව 11% කින් පුළුල් වෙද්දී අතිවිශාල බහාලුම් නෞකා (ULCV) සඳහා කොළඹ දකුණු වරාය සිය නවීන පහසුකම් සලසයි.",
    category: "වෙළඳාම",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — කොළඹ වරායේ නැගෙනහිර බහාලුම් පර්යන්තයේ (East Container Terminal - ECT) පළමු අදියර නිල වශයෙන් මෙහෙයුම් කටයුතු සඳහා විවෘත කර ඇති අතර එමගින් වරායේ වාර්ෂික හැසිරවීමේ ධාරිතාවට තවත් බහාලුම් මිලියන 1.2 ක් එකතු වේ.`
  },
  "cbsl-act-2023-institutional-review-fiscal-dominance": {
    title: "2023 අංක 16 දරන ශ්‍රී ලංකා මහ බැංකු පනත: මූල්‍ය ආධිපත්‍යයේ සීමාවන් පිළිබඳ ආයතනික සමාලෝචනයක්",
    deck: "භාණ්ඩාගාර අයවැය හිඟය මුදල් අච්චු ගැසීමෙන් පියවීමට පැනවූ ව්‍යවස්ථාපිත තහනම මඟින් ශ්‍රී ලංකාවේ උද්ධමන ඉලක්කගත තන්ත්‍රය පරිවර්තනය කළ අයුරු.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — 2023 අංක 16 දරන නව ශ්‍රී ලංකා මහ බැංකු පනත මඟින් රාජ්‍ය මූල්‍ය ආධිපත්‍යය (Fiscal Dominance) සීමා කරමින් රටේ මිල ස්ථායීතාවය සහ මූල්‍ය පද්ධතියේ ආරක්ෂාව තහවුරු කළ ආකාරය මෙහිදී සමාලෝචනය කෙරේ.`
  },
  "inflation-tumbles-from-peak-to-target-range": {
    title: "මූල්‍ය ප්‍රතිපත්ති ස්ථාවරත්වය හේතුවෙන් උද්ධමනය 70% ක උපරිමයේ සිට 2.4% දක්වා පහත වැටේ",
    deck: "දැඩි මුදල් ප්‍රතිපත්තිය සහ විනිමය අනුපාත ස්ථාවර වීම මඟින් මිල පීඩන නිවා දමද්දී කොළඹ පාරිභෝගික මිල දර්ශකය (CCPI) සාමාන්‍ය තත්ත්වයට පත්වේ.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ උද්ධමන අනුපාතිකය 70% ක ඓතිහාසික උපරිම අගයේ සිට 2.4% දක්වා පහත වැටී ඇති බව ජනලේඛන හා සංඛ්‍යාලේඛන දෙපාර්තමේන්තුව නිවේදනය කර ඇත.`
  },
  401: {
    title: "ස්වෛරී ණය විසඳුම් ප්‍රතිෂ්ඨාපනය කිරීම සඳහා පාර්ලිමේන්තුව දේශීය ණය ප්‍රශස්තකරණ (DDO) යෝජනාව සම්මත කරයි",
    deck: "සිව්දින විශේෂ ව්‍යවස්ථාදායක සැසියකින් අනතුරුව විශ්‍රාම වැටුප් අරමුදල් සහ භාණ්ඩාගාර බැඳුම්කර ප්‍රතිව්‍යුහගත කිරීම සඳහා අනුමැතිය හිමිවේ.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාවේ ණය තිරසාරභාවය නැවත අත්පත් කර ගැනීම සඳහා රජය ඉදිරිපත් කළ දේශීය ණය ප්‍රශස්තකරණ (DDO) වැඩපිළිවෙල වැඩි ඡන්දයෙන් පාර්ලිමේන්තුවේදී සම්මත විය.`
  },
  "parliament-passes-domestic-debt-optimization-ddo": {
    title: "ස්වෛරී ණය විසඳුම් ප්‍රතිෂ්ඨාපනය කිරීම සඳහා පාර්ලිමේන්තුව දේශීය ණය ප්‍රශස්තකරණ (DDO) යෝජනාව සම්මත කරයි",
    deck: "සිව්දින විශේෂ ව්‍යවස්ථාදායක සැසියකින් අනතුරුව විශ්‍රාම වැටුප් අරමුදල් සහ භාණ්ඩාගාර බැඳුම්කර ප්‍රතිව්‍යුහගත කිරීම සඳහා අනුමැතිය හිමිවේ.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — දේශීය ණය ප්‍රශස්තකරණ යෝජනාව පාර්ලිමේන්තුවේදී සම්මත විය.`
  },
  402: {
    title: "ජෝන් එක්ස්ටර්ගේ අනතුරු ඇඟවීම තේරුම් ගැනීම: විවෘත වෙළඳපල මුදල් එන්නත් සහ ඩොලර් පිටතට ගලා යාමේ යාන්ත්‍රණය",
    deck: "අභිමතානුසාරී මහ බැංකු මුදල් මුද්‍රණය නිදන්ගත මුදල් අස්ථාවරත්වයකට තුඩු දෙන බවට ශ්‍රී ලංකා මහ බැංකුවේ නිර්මාතෘවරයා 1949 දී අනතුරු ඇඟවූ ආකාරය පිළිබඳ විග්‍රහයක්.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකා මහ බැංකුවේ ප්‍රථම අධිපතිවරයා වූ ජෝන් එක්ස්ටර් මහතා විසින් 1949 දී ඉදිරිපත් කළ අනතුරු ඇඟවීම් සහ විවෘත වෙළඳපල මෙහෙයුම් හරහා කෘතිමව පොලී අනුපාත පාලනය කිරීමෙන් විදේශ සංචිත හිඳී යන ආකාරය පිළිබඳ න්‍යායාත්මක ආර්ථික විවරණයකි.`
  },
  "understanding-john-exter-warning-mechanics-injections": {
    title: "ජෝන් එක්ස්ටර්ගේ අනතුරු ඇඟවීම තේරුම් ගැනීම: විවෘත වෙළඳපල මුදල් එන්නත් සහ ඩොලර් පිටතට ගලා යාමේ යාන්ත්‍රණය",
    deck: "අභිමතානුසාරී මහ බැංකු මුදල් මුද්‍රණය නිදන්ගත මුදල් අස්ථාවරත්වයකට තුඩු දෙන බවට ශ්‍රී ලංකා මහ බැංකුවේ නිර්මාතෘවරයා 1949 දී අනතුරු ඇඟවූ ආකාරය පිළිබඳ විග්‍රහයක්.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජෝන් එක්ස්ටර්ගේ මුදල් න්‍යාය පිළිබඳ විග්‍රහයකි.`
  },
  403: {
    title: "ශ්‍රී ලංකාව සඳහා ඩොලර් බිලියන 3.0 ක මාස 48 ක විස්තීර්ණ ණය පහසුකම (EFF) IMF විධායක මණ්ඩලය අනුමත කරයි",
    deck: "ඩොලර් මිලියන 333 ක ක්ෂණික මුදල් නිදහස් කිරීමත් සමඟ ලෝක බැංකුව සහ ආසියානු සංවර්ධන බැංකුව වෙතින් බහුපාර්ශ්වික මූල්‍ය පහසුකම් ලබා ගැනීමට මග පෑදේ.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ශ්‍රී ලංකාව වෙනුවෙන් ඩොලර් බිලියන 3.0 ක විස්තීර්ණ ණය පහසුකම් වැඩසටහන (EFF) ජාත්‍යන්තර මූල්‍ය අරමුදලේ විධායක මණ්ඩලය විසින් නිල වශයෙන් අනුමත කළේය.`
  },
  "imf-approves-3-billion-eff-program-sri-lanka": {
    title: "ශ්‍රී ලංකාව සඳහා ඩොලර් බිලියන 3.0 ක මාස 48 ක විස්තීර්ණ ණය පහසුකම (EFF) IMF විධායක මණ්ඩලය අනුමත කරයි",
    deck: "ඩොලර් මිලියන 333 ක ක්ෂණික මුදල් නිදහස් කිරීමත් සමඟ ලෝක බැංකුව සහ ආසියානු සංවර්ධන බැංකුව වෙතින් බහුපාර්ශ්වික මූල්‍ය පහසුකම් ලබා ගැනීමට මග පෑදේ.",
    category: "රාජ්‍ය ප්‍රතිපත්ති",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — IMF ඩොලර් බිලියන 3 ක ණය වැඩසටහන අනුමත කරයි.`
  },
  404: {
    title: "IMF මණ්ඩල අනුමැතියෙන් පසු භාණ්ඩාගාර බිල්පත් ඵලදායිතා 32% ක උපරිමයේ සිට 20% දක්වා පදනම් අංක 1,200 කින් පහත වැටේ",
    deck: "ප්‍රාථමික අලෙවිකරුවන්ගේ ද්‍රවශීලතාවය සාමාන්‍යකරණය වීමත් සමඟ කෙටි හා මධ්‍යකාලීන භාණ්ඩාගාර බැඳුම්කර වෙළඳපොලේ දැවැන්ත පිබිදීමක් ඇතිවේ.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — ජාත්‍යන්තර මූල්‍ය අරමුදලේ මූල්‍ය පැකේජය ලැබීමත් සමඟ රටේ පැවති අවදානම් සහගත තත්ත්වය පහව ගොස් භාණ්ඩාගාර බිල්පත් ඵලදායිතා අනුපාතිකයන් සීඝ්‍රයෙන් පහත වැටී ඇති බව වාර්තා වේ.`
  },
  "treasury-yields-drop-1200-bps-imf-approval": {
    title: "IMF මණ්ඩල අනුමැතියෙන් පසු භාණ්ඩාගාර බිල්පත් ඵලදායිතා 32% ක උපරිමයේ සිට 20% දක්වා පදනම් අංක 1,200 කින් පහත වැටේ",
    deck: "ප්‍රාථමික අලෙවිකරුවන්ගේ ද්‍රවශීලතාවය සාමාන්‍යකරණය වීමත් සමඟ කෙටි හා මධ්‍යකාලීන භාණ්ඩාගාර බැඳුම්කර වෙළඳපොලේ දැවැන්ත පිබිදීමක් ඇතිවේ.",
    category: "කොටස් වෙළඳපොළ",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — භාණ්ඩාගාර බිල්පත් ඵලදායිතා පහත වැටී ඇත.`
  },
  405: {
    title: "රාජ්‍ය ව්‍යවසාය (SOE) පිරිවැය පරාවර්තක මිල සූත්‍ර මඟින් ජාතික මුදල ආරක්ෂා කරන්නේ ඇයි",
    deck: "විදුලිය සහ ඉන්ධන සඳහා පිරිවැය පරාවර්තක මිලකරණය මඟින් ඓතිහාසිකව මුදල් අච්චු ගැසීමට හේතු වූ අර්ධ මූල්‍ය බැංකු ණය ගැනීම් නතර කරන්නේ කෙසේද යන්න පිළිබඳ විග්‍රහයක්.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — විදුලිබල මණ්ඩලය සහ ඛනිජ තෙල් නීතිගත සංස්ථාව පාඩු ලැබීම වැළැක්වීම සඳහා හඳුන්වා දුන් පිරිවැය පරාවර්තක මිල සූත්‍ර මඟින් රුපියලේ අගය රැක ගැනීමට දායක වූ අයුරු මෙහිදී සාකච්ඡා කෙරේ.`
  },
  "why-soe-price-formulas-protect-national-currency": {
    title: "රාජ්‍ය ව්‍යවසාය (SOE) පිරිවැය පරාවර්තක මිල සූත්‍ර මඟින් ජාතික මුදල ආරක්ෂා කරන්නේ ඇයි",
    deck: "විදුලිය සහ ඉන්ධන සඳහා පිරිවැය පරාවර්තක මිලකරණය මඟින් ඓතිහාසිකව මුදල් අච්චු ගැසීමට හේතු වූ අර්ධ මූල්‍ය බැංකු ණය ගැනීම් නතර කරන්නේ කෙසේද යන්න පිළිබඳ විග්‍රහයක්.",
    category: "ආර්ථිකය",
    body: `කොළඹ (ලංකාඊකොන් පුවත් සේවය) — රාජ්‍ය ව්‍යවසාය පිරිවැය මිල සූත්‍ර පිළිබඳ ආර්ථික විශ්ලේෂණය.`
  },

};

// Full Article Dictionary in Tamil (TA) with Complete Translated Bodies
const articleDictTA: Record<string | number, { title: string; deck: string; body: string; category: string }> = {
  1791095288704: {
    title: "ஹம்பாந்தோட்டை சர்வதேச துறைமுகம் ஒரு மில்லியன் கொள்கலன் மைல்கல்லைத் தாண்டியது; செயல்பாட்டு அளவு 45% அதிகரிப்பு",
    deck: "ஹம்பாந்தோட்டை சர்வதேச துறைமுகம் (HIP) 2026 ஆம் ஆண்டின் முதல் எட்டு மாதங்களில் 1,002,232 TEU கொள்கலன்களைக் கையாண்டு, இலங்கையின் மறுஏற்றுமதி வர்த்தகத்தில் புதிய வரலாற்றுச் சாதனையைப் படைத்துள்ளது.",
    category: "சேவைகள்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஹம்பாந்தோட்டை சர்வதேச துறைமுகம் (HIP) 2026 ஆம் ஆண்டின் முதல் எட்டு மாதங்களில் 1,002,232 இருபது அடி சமமான கொள்கலன் அலகுகளை (TEU) வெற்றிகரமாகக் கையாண்டு, தனது வரலாற்றில் முதன்முறையாக ஒரு ஆண்டில் ஒரு மில்லியன் கொள்கலன் மைல்கல்லைத் தாண்டி வரலாற்று சாதனையை எட்டியுள்ளது.

கடந்த ஆண்டின் இதே காலப்பகுதியுடன் ஒப்பிடுகையில் இது 45% குறிப்பிடத்தக்க வளர்ச்சியாகும். இந்தியப் பெருங்கடல் பிராந்தியத்தின் முக்கிய கடல் வர்த்தகப் பாதையில் அமைந்துள்ள ஒரு மூலோபாய கொள்கலன் மறுஏற்றுமதி மையமாக ஹம்பாந்தோட்டை துறைமுகத்தின் செயல்திறன் மற்றும் போட்டித்தன்மையை இது நிரூபிக்கிறது.

ஹம்பாந்தோட்டை சர்வதேச துறைமுகக் குழுமத்தின் பிரதம நிறைவேற்று அதிகாரி கருத்துத் தெரிவிக்கையில், உலகின் முன்னணி கப்பல் நிறுவனங்களான MSC மற்றும் CMA CGM ஆகியவை ஹம்பாந்தோட்டை துறைமுகத்தை தங்களின் வழக்கமான மறுஏற்றுமதி மையமாகத் தேர்ந்தெடுத்ததே இந்த மிகப்பெரிய வளர்ச்சிக்கு முக்கியக் காரணமாகும் எனத் தெரிவித்தார்.`
  },
  "hambantota-port-surpasses-one-million-container-milestone": {
    title: "ஹம்பாந்தோட்டை சர்வதேச துறைமுகம் ஒரு மில்லியன் கொள்கலன் மைல்கல்லைத் தாண்டியது; செயல்பாட்டு அளவு 45% அதிகரிப்பு",
    deck: "ஹம்பாந்தோட்டை சர்வதேச துறைமுகம் (HIP) 2026 ஆம் ஆண்டின் முதல் எட்டு மாதங்களில் 1,002,232 TEU கொள்கலன்களைக் கையாண்டு, இலங்கையின் மறுஏற்றுமதி வர்த்தகத்தில் புதிய வரலாற்றுச் சாதனையைப் படைத்துள்ளது.",
    category: "சேவைகள்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஹம்பாந்தோட்டை சர்வதேச துறைமுகம் (HIP) 2026 ஆம் ஆண்டின் முதல் எட்டு மாதங்களில் 1,002,232 இருபது அடி சமமான கொள்கலன் அலகுகளை (TEU) வெற்றிகரமாகக் கையாண்டு, தனது வரலாற்றில் முதன்முறையாக ஒரு ஆண்டில் ஒரு மில்லியன் கொள்கலன் மைல்கல்லைத் தாண்டி வரலாற்று சாதனையை எட்டியுள்ளது.`
  },
  1791093001511: {
    title: "அடுத்த மதிப்பாய்வுக்கு முன்னதாக இலங்கை 85% இலக்குகளை எட்டியுள்ளதாக சர்வதேச நாணய நிதியம் (IMF) உறுதிப்படுத்தியுள்ளது",
    deck: "இலங்கைக்கு வருகை தந்த சர்வதேச நாணய நிதியத்தின் பிரதிநிதிகள் குழு நிதி ஒழுக்கம் மற்றும் அரச வருவாய் உபரியைப் பாராட்டியுள்ளதுடன், எரிசக்தி விலை நிர்ணயம் மற்றும் நிர்வாக சீர்திருத்தங்களை விரைவுபடுத்துமாறு வலியுறுத்தியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — சர்வதேச நாணய நிதியத்தின் (IMF) விரிவுபடுத்தப்பட்ட நிதி வசதி (EFF) திட்டத்தின் கீழ் நிர்ணயிக்கப்பட்ட இலக்குகளில் 85% க்கும் அதிகமானவற்றை இலங்கை வெற்றிகரமாக எட்டியுள்ளதாக அதிகாரப்பூர்வ மதிப்பாய்வுக் குழு அறிவித்துள்ளது.

அரச வருவாய் திரட்டும் நடைமுறைகளை வலுப்படுத்துதல், முதன்மை வரவு செலவுத் திட்ட உபரியைப் பேணுதல் மற்றும் வெளிநாட்டு கையிருப்புகளைத் தொடர்ந்து கட்டியெழுப்புதல் ஆகியவற்றில் ஏற்பட்டுள்ள முன்னேற்றத்திற்கு IMF பிரதிநிதிகள் பாராட்டு தெரிவித்துள்ளனர்.

எனினும், அரச தொழில்முயற்சிகளை (SOE) மறுசீரமைத்தல், மின்சாரம் மற்றும் எரிசக்தி செலவுப் பிரதிபலிப்பு விலை சூத்திரங்களை நடைமுறைப்படுத்துதல் மற்றும் ஊழல் எதிர்ப்பு நிர்வாகப் பரிந்துரைகளை துரிதமாக நிறைவேற்றுவது அடுத்த மதிப்பாய்வை வெற்றிகரமாக முடிப்பதற்கு இன்றியமையாதது என அக்குழு வலியுறுத்தியுள்ளது.`
  },
  "imf-affirms-sri-lanka-reform-program-on-track-as-85-of-targets-met": {
    title: "அடுத்த மதிப்பாய்வுக்கு முன்னதாக இலங்கை 85% இலக்குகளை எட்டியுள்ளதாக சர்வதேச நாணய நிதியம் (IMF) உறுதிப்படுத்தியுள்ளது",
    deck: "இலங்கைக்கு வருகை தந்த சர்வதேச நாணய நிதியத்தின் பிரதிநிதிகள் குழு நிதி ஒழுக்கம் மற்றும் அரச வருவாய் உபரியைப் பாராட்டியுள்ளதுடன், எரிசக்தி விலை நிர்ணயம் மற்றும் நிர்வாக சீர்திருத்தங்களை விரைவுபடுத்துமாறு வலியுறுத்தியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — சர்வதேச நாணய நிதியத்தின் (IMF) விரிவுபடுத்தப்பட்ட நிதி வசதி (EFF) திட்டத்தின் கீழ் நிர்ணயிக்கப்பட்ட இலக்குகளில் 85% க்கும் அதிகமானவற்றை இலங்கை வெற்றிகரமாக எட்டியுள்ளதாக அதிகாரப்பூர்வ மதிப்பாய்வுக் குழு அறிவித்துள்ளது.`
  },
  1791172245428: {
    title: "இலங்கையுடனான விரிவுபடுத்தப்பட்ட நிதி வசதியின் (EFF) ஏழாவது மதிப்பாய்வுக்கான பணியாளர் மட்ட உடன்பாட்டை சர்வதேச நாணய நிதியம் எட்டியுள்ளது",
    deck: "நிலையான வரி வருவாய் திரட்டல் மற்றும் பணவீக்கக் கட்டுப்பாட்டைத் தொடர்ந்து சுமார் $345 மில்லியன் நேரடி நிதி விடுவிப்பிற்கு இந்த உடன்பாடு வழிவகுக்கிறது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் பொருளாதார மீட்சித் திட்டத்திற்கான விரிவுபடுத்தப்பட்ட நிதி வசதியின் (EFF) ஏழாவது மதிப்பாய்வுக்கான பணியாளர் மட்ட உடன்பாட்டை (Staff-Level Agreement) எட்டியுள்ளதாக சர்வதேச நாணய நிதியம் உத்தியோகபூர்வமாக அறிவித்துள்ளது.

இந்த உடன்பாடு IMF நிர்வாகக் குழுவின் ஒப்புதலுக்கு உட்பட்டதுடன், இதன் மூலம் இலங்கைக்கு சுமார் $345 மில்லியன் (254 மில்லியன் SDR) நேரடி நிதி உதவி விடுவிக்கப்படவுள்ளது.

நிதி ஒழுக்கத்தைப் பேணுதல், வரி வலையமைப்பை விரிவுபடுத்துதல், மத்திய வங்கியின் சுதந்திரத்தைப் பாதுகாத்து பணவீக்கத்தை 5% வரம்பிற்குள் கட்டுப்படுத்துதல் மற்றும் வெளிநாட்டு கையிருப்புகளை 6 பில்லியன் டாலர்களுக்கு மேல் உயர்த்தியமை ஆகியவற்றை IMF பாராட்டியுள்ளது.`
  },
  301: {
    title: "மன்னார் மற்றும் காவேரி படுகைகளில் எண்ணெய் மற்றும் எரிவாயு ஆய்வுகளுக்காக இலங்கை நான்கு கடற்பரப்பு பகுதிகளை வழங்குகிறது",
    deck: "சர்வதேச எரிசக்தி நிறுவனங்களை ஈர்க்கும் வகையில் பெட்ரோலிய மேம்பாட்டு அதிகார சபை புதிய நில அதிர்வு தரவு தொகுப்புகளுடன் உலகளாவிய ஏலச் சுற்றைத் தொடங்கியுள்ளது.",
    category: "தொழில்துறை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மன்னார் மற்றும் காவேரி படுகைகளில் அமைந்துள்ள நான்கு எண்ணெய் மற்றும் இயற்கை எரிவாயு ஆய்வு கடற்பரப்பு பகுதிகளுக்கு (offshore blocks) சர்வதேச எரிசக்தி நிறுவனங்களிடமிருந்து ஏலங்களை கோருவதற்கு இலங்கை பெட்ரோலிய மேம்பாட்டு அதிகார சபை (PDASL) தீர்மானித்துள்ளது.

நவீன 3D நில அதிர்வு தரவுகளின் அடிப்படையில் இந்த ஆய்வுப் பகுதிகள் வரையறுக்கப்பட்டுள்ளதுடன், வர்த்தக ரீதியான இயற்கை எரிவாயு படிவுகள் உறுதிப்படுத்தப்பட்ட M2 பிளாக்கும் இதில் அடங்கும். முன்னணி சர்வதேச எரிசக்தி நிறுவனங்கள் ஏற்கனவே இதில் ஆர்வம் காட்டியுள்ளன.`
  },
  "sri-lanka-offers-four-offshore-oil-blocks-exploration": {
    title: "மன்னார் மற்றும் காவேரி படுகைகளில் எண்ணெய் மற்றும் எரிவாயு ஆய்வுகளுக்காக இலங்கை நான்கு கடற்பரப்பு பகுதிகளை வழங்குகிறது",
    deck: "சர்வதேச எரிசக்தி நிறுவனங்களை ஈர்க்கும் வகையில் பெட்ரோலிய மேம்பாட்டு அதிகார சபை புதிய நில அதிர்வு தரவு தொகுப்புகளுடன் உலகளாவிய ஏலச் சுற்றைத் தொடங்கியுள்ளது.",
    category: "தொழில்துறை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மன்னார் மற்றும் காவேரி படுகைகளில் அமைந்துள்ள நான்கு எண்ணெய் மற்றும் இயற்கை எரிவாயு ஆய்வு கடற்பரப்பு பகுதிகளுக்கு சர்வதேச நிறுவனங்களிடமிருந்து ஏலங்களை கோருவதற்கு இலங்கை முன்வந்துள்ளது.`
  },
  1789115985835: {
    title: "ஓஷன் வோயேஜர் இன்டர்நேஷனல் இலங்கையிலிருந்து தனது முதலாவது நீர்நில வாழ் ஊர்தியை ஐரோப்பாவிற்கு ஏற்றுமதி செய்கிறது",
    deck: "கொக்கலையில் உள்ள படகு தயாரிப்பு நிறுவனமான ஓஷன் வோயேஜர் இன்டர்நேஷனல், தனது முதலாவது நீர்நில வாழ் ஊர்தியை ஐரோப்பாவிற்கு ஏற்றுமதி செய்துள்ளதாக கைத்தொழில் அமைச்சு தெரிவித்துள்ளது.",
    category: "பொருளாதாரம்",
    body: `இலங்கையின் கொக்கலையை தளமாகக் கொண்ட படகு தயாரிப்பு நிறுவனமான ஓஷன் வோயேஜர் இன்டர்நேஷனல் (Ocean Voyager International Pvt Ltd), தனது முதலாவது நீர்நில வாழ் ஊர்தியை (amphibious craft) ஐரோப்பாவிற்கு ஏற்றுமதி செய்துள்ளதாக கைத்தொழில் அமைச்சின் அறிக்கை ஒன்று தெரிவித்துள்ளது.

ஓஷன் வோயேஜர் நிறுவனம் சொகுசு கேடமரன் படகுகளை தயாரிப்பதில் புகழ்பெற்றதாகும். பின்னர் மிச்செலின் (Michelin) நிறுவனத்தால் வாங்கப்பட்ட இலங்கையின் மிகப்பெரிய திட டயர் உற்பத்தி நிறுவனத்தை அமைத்த பெல்ஜிய நாட்டைச் சேர்ந்த பியர் பிரிங்கியர்ஸ் (Pierre Pringiers) என்பவரால் இந்நிறுவனம் நிறுவப்பட்டது.

இந்த நீர்நில வாழ் ஊர்தியானது அதன் மேலோட்டின் இருபுறமும் உள்ளிழுக்கக்கூடிய மோட்டார் பொருத்தப்பட்ட ட்ராக் அமைப்புகளைக் கொண்டுள்ளது, இதன் மூலம் நீரிலிருந்து வெளியேறி தரைப்பரப்பில் செல்ல முடியும்.

தளத்தை பார்வையிடச் சென்ற கைத்தொழில் அமைச்சர் சுனில் ஹந்துன்நெத்தி, இலங்கையை படகு கட்டும் மையமாக மாற்றுவதற்கு தேவையான ஆதரவை அரசாங்கம் வழங்கும் என்று தெரிவித்தார்.

இலங்கை பொழுதுபோக்கு படகு சவாரிக் குழுவின் தலைவராகவும் உள்ள பிரிங்கியர்ஸ், கடலால் சூழப்பட்ட போதிலும் படகோட்டம் பற்றிய பாரம்பரியம் இல்லாத இந்த தீவில் இத்துறையை மேம்படுத்த முயற்சித்து வருகிறார். இலங்கையின் கடல்சார் பொருளாதாரம் அதன் சாத்தியக்கூறுகளை விட குறைவாக உள்ளதாக ஆய்வாளர்கள் சுட்டிக்காட்டுகின்றனர். (கொழும்பு/செப்11/2026)`
  },
  "ocean-voyager-international-exports-first-amphibious-craft-from-sri-lanka": {
    title: "ஓஷன் வோயேஜர் இன்டர்நேஷனல் இலங்கையிலிருந்து தனது முதலாவது நீர்நில வாழ் ஊர்தியை ஐரோப்பாவிற்கு ஏற்றுமதி செய்கிறது",
    deck: "கொக்கலையில் உள்ள படகு தயாரிப்பு நிறுவனமான ஓஷன் வோயேஜர் இன்டர்நேஷனல், தனது முதலாவது நீர்நில வாழ் ஊர்தியை ஐரோப்பாவிற்கு ஏற்றுமதி செய்துள்ளதாக கைத்தொழில் அமைச்சு தெரிவித்துள்ளது.",
    category: "பொருளாதாரம்",
    body: `இலங்கையின் கொக்கலையை தளமாகக் கொண்ட படகு தயாரிப்பு நிறுவனமான ஓஷன் வோயேஜர் இன்டர்நேஷனல் (Ocean Voyager International Pvt Ltd), தனது முதலாவது நீர்நில வாழ் ஊர்தியை (amphibious craft) ஐரோப்பாவிற்கு ஏற்றுமதி செய்துள்ளதாக கைத்தொழில் அமைச்சின் அறிக்கை ஒன்று தெரிவித்துள்ளது.

ஓஷன் வோயேஜர் நிறுவனம் சொகுசு கேடமரன் படகுகளை தயாரிப்பதில் புகழ்பெற்றதாகும். பின்னர் மிச்செலின் (Michelin) நிறுவனத்தால் வாங்கப்பட்ட இலங்கையின் மிகப்பெரிய திட டயர் உற்பத்தி நிறுவனத்தை அமைத்த பெல்ஜிய நாட்டைச் சேர்ந்த பியர் பிரிங்கியர்ஸ் (Pierre Pringiers) என்பவரால் இந்நிறுவனம் நிறுவப்பட்டது.

இந்த நீர்நில வாழ் ஊர்தியானது அதன் மேலோட்டின் இருபுறமும் உள்ளிழுக்கக்கூடிய மோட்டார் பொருத்தப்பட்ட ட்ராக் அமைப்புகளைக் கொண்டுள்ளது, இதன் மூலம் நீரிலிருந்து வெளியேறி தரைப்பரப்பில் செல்ல முடியும்.

தளத்தை பார்வையிடச் சென்ற கைத்தொழில் அமைச்சர் சுனில் ஹந்துன்நெத்தி, இலங்கையை படகு கட்டும் மையமாக மாற்றுவதற்கு தேவையான ஆதரவை அரசாங்கம் வழங்கும் என்று தெரிவித்தார்.

இலங்கை பொழுதுபோக்கு படகு சவாரிக் குழுவின் தலைவராகவும் உள்ள பிரிங்கியர்ஸ், கடலால் சூழப்பட்ட போதிலும் படகோட்டம் பற்றிய பாரம்பரியம் இல்லாத இந்த தீவில் இத்துறையை மேம்படுத்த முயற்சித்து வருகிறார். இலங்கையின் கடல்சார் பொருளாதாரம் அதன் சாத்தியக்கூறுகளை விட குறைவாக உள்ளதாக ஆய்வாளர்கள் சுட்டிக்காட்டுகின்றனர். (கொழும்பு/செப்11/2026)`
  },
  1789115913690: {
    title: "இலங்கை அரச வங்கிகளின் முக்கிய வாராக்கடன்கள் ரூ.200 பில்லியனை தாண்டியது; இரகசியத்தன்மை சட்டத்தின் கீழ் கடன் பெற்றவர்களின் பெயர்கள் மறைப்பு",
    deck: "இலங்கை வங்கி மற்றும் மக்கள் வங்கி ஆகியவற்றின் முதல் 20 வாராக்கடன் கணக்குகள் ரூ.202 பில்லியனுக்கும் அதிகமாக உள்ள போதிலும், சட்டப்பூர்வ இரகசிய விதிகளின் கீழ் கடன் பெற்றவர்களின் பெயர்களை வெளியிட முடியாது என நாடாளுமன்றத்தில் தெரிவிக்கப்பட்டுள்ளது.",
    category: "பொருளாதாரம்",
    body: `இக்கொனோமேட்ரிக்ஸ் — இலங்கையின் அரசுக்கு சொந்தமான இலங்கை வங்கி (BOC) மற்றும் மக்கள் வங்கி (People's Bank) ஆகியவற்றின் முதல் 20 வாராக்கடன் கணக்குகள் 202 பில்லியன் ரூபாய்க்கும் அதிகமான தொகையைக் கொண்டுள்ளன, ஆனால் சட்டப்பூர்வ இரகசிய விதிகளின் கீழ் கடன் பெற்றவர்களின் அடையாளங்களை பகிரங்கப்படுத்த முடியாது என்று நாடாளுமன்றத்தில் தெரிவிக்கப்பட்டது.

தொழில் அமைச்சரும் நிதி மற்றும் திட்டமிடல் பிரதி அமைச்சருமான அனில் ஜயந்த, ஐந்து அரச வங்கிகளில் உள்ள 20 மிகப்பெரிய வாராக்கடன் (NPL) கணக்குகள் பற்றிய விவரங்களை சமர்ப்பித்தார். இதில் இலங்கை வங்கி மொத்தம் 150,704.96 மில்லியன் ரூபாய் வாராக்கடன்களுடன் முன்னணியில் உள்ளது, அதைத் தொடர்ந்து மக்கள் வங்கி 51,314.01 மில்லியன் ரூபாயுடன் உள்ளது.

மீதமுள்ள நிறுவனங்களில், தேசிய சேமிப்பு வங்கி (NSB) அதன் முதல் 20 கடனாளிகள் கணக்குகளில் 3,450.92 மில்லியன் ரூபாயையும், பிராந்திய அபிவிருத்தி வங்கி (RDB) 1,214.33 மில்லியன் ரூபாயையும், அரச அடமான மற்றும் முதலீட்டு வங்கி (SMIB) 425.8 மில்லியன் ரூபாயையும் பதிவு செய்துள்ளன.

தனிநபர் மற்றும் நிறுவன கடனாளிகளை அடையாளம் காணுமாறு விடுக்கப்பட்ட கோரிக்கைகளுக்கு பதிலளித்த ஜயந்த, நிதி நிறுவனங்கள் கடுமையான சட்டரீதியான இரகசியத்தன்மை கடப்பாடுகளுக்கு உட்பட்டுள்ளன என்று கூறினார்.

"வங்கிச் சட்டத்தின் 77வது பிரிவு மற்றும் தனிப்பட்ட தரவுப் பாதுகாப்புச் சட்டத்தின் கீழ், வாடிக்கையாளர் இரகசியத்தன்மையைப் பேண பணிப்பாளர் சபைகளும் ஊழியர்களும் சட்டப்பூர்வமாக கட்டுப்பட்டுள்ளனர், எனவே தனிப்பட்ட வாடிக்கையாளர் பெயர்கள் வெளியிடப்படவில்லை" என்று ஜயந்த கூறினார்.

கடந்த 15 ஆண்டுகளில் ஐந்து அரச நிறுவனங்களில் வாராக்கடன்கள் அல்லது செலுத்தப்படாத வட்டியாக தள்ளுபடி செய்யப்பட்ட மிகப்பெரிய கடன்கள் பற்றிய விவரங்களும் நாடாளுமன்றத்திற்கு வழங்கப்பட்டன. கடன் மறுசீரமைப்பு அட்டவணைகளின் கீழ், இலங்கை மின்சார சபை (CEB) மறுசீரமைப்புடன் தொடர்புடைய 61 பில்லியன் ரூபாய் மற்றும் 2017 இல் தள்ளுபடி செய்யப்பட்ட 15 பில்லியன் ரூபாய் ரியல் எஸ்டேட் அடமானங்கள் ஆகியவை இலங்கை வங்கியின் முக்கிய தள்ளுபடிகளில் அடங்கும்.

கடன் பெற்றவர்களின் அடையாளங்கள் சட்டத்தால் பாதுகாக்கப்பட்டுள்ள போதிலும், முழுமையான புள்ளிவிவரங்கள் மற்றும் மீட்பு நடவடிக்கைகள் நாடாளுமன்ற ஆய்வுக்கு வைக்கப்பட்டுள்ளதாக ஜயந்த குறிப்பிட்டார். (கொழும்பு/செப்11/2026)`
  },
  "sri-lanka-state-banks-top-bad-loans-exceed-rs200-bn-borrower-names-withheld-under-secrecy-laws": {
    title: "இலங்கை அரச வங்கிகளின் முக்கிய வாராக்கடன்கள் ரூ.200 பில்லியனை தாண்டியது; இரகசியத்தன்மை சட்டத்தின் கீழ் கடன் பெற்றவர்களின் பெயர்கள் மறைப்பு",
    deck: "இலங்கை வங்கி மற்றும் மக்கள் வங்கி ஆகியவற்றின் முதல் 20 வாராக்கடன் கணக்குகள் ரூ.202 பில்லியனுக்கும் அதிகமாக உள்ள போதிலும், சட்டப்பூர்வ இரகசிய விதிகளின் கீழ் கடன் பெற்றவர்களின் பெயர்களை வெளியிட முடியாது என நாடாளுமன்றத்தில் தெரிவிக்கப்பட்டுள்ளது.",
    category: "பொருளாதாரம்",
    body: `இக்கொனோமேட்ரிக்ஸ் — இலங்கையின் அரசுக்கு சொந்தமான இலங்கை வங்கி (BOC) மற்றும் மக்கள் வங்கி (People's Bank) ஆகியவற்றின் முதல் 20 வாராக்கடன் கணக்குகள் 202 பில்லியன் ரூபாய்க்கும் அதிகமான தொகையைக் கொண்டுள்ளன, ஆனால் சட்டப்பூர்வ இரகசிய விதிகளின் கீழ் கடன் பெற்றவர்களின் அடையாளங்களை பகிரங்கப்படுத்த முடியாது என்று நாடாளுமன்றத்தில் தெரிவிக்கப்பட்டது.

தொழில் அமைச்சரும் நிதி மற்றும் திட்டமிடல் பிரதி அமைச்சருமான அனில் ஜயந்த, ஐந்து அரச வங்கிகளில் உள்ள 20 மிகப்பெரிய வாராக்கடன் (NPL) கணக்குகள் பற்றிய விவரங்களை சமர்ப்பித்தார். இதில் இலங்கை வங்கி மொத்தம் 150,704.96 மில்லியன் ரூபாய் வாராக்கடன்களுடன் முன்னணியில் உள்ளது, அதைத் தொடர்ந்து மக்கள் வங்கி 51,314.01 மில்லியன் ரூபாயுடன் உள்ளது.

மீதமுள்ள நிறுவனங்களில், தேசிய சேமிப்பு வங்கி (NSB) அதன் முதல் 20 கடனாளிகள் கணக்குகளில் 3,450.92 மில்லியன் ரூபாயையும், பிராந்திய அபிவிருத்தி வங்கி (RDB) 1,214.33 மில்லியன் ரூபாயையும், அரச அடமான மற்றும் முதலீட்டு வங்கி (SMIB) 425.8 மில்லியன் ரூபாயையும் பதிவு செய்துள்ளன.

தனிநபர் மற்றும் நிறுவன கடனாளிகளை அடையாளம் காணுமாறு விடுக்கப்பட்ட கோரிக்கைகளுக்கு பதிலளித்த ஜயந்த, நிதி நிறுவனங்கள் கடுமையான சட்டரீதியான இரகசியத்தன்மை கடப்பாடுகளுக்கு உட்பட்டுள்ளன என்று கூறினார்.

"வங்கிச் சட்டத்தின் 77வது பிரிவு மற்றும் தனிப்பட்ட தரவுப் பாதுகாப்புச் சட்டத்தின் கீழ், வாடிக்கையாளர் இரகசியத்தன்மையைப் பேண பணிப்பாளர் சபைகளும் ஊழியர்களும் சட்டப்பூர்වமாக கட்டுப்பட்டுள்ளனர், எனவே தனிப்பட்ட வாடிக்கையாளர் பெயர்கள் வெளியிடப்படவில்லை" என்று ஜயந்த கூறினார்.

கடந்த 15 ஆண்டுகளில் ஐந்து அரச நிறுவனங்களில் வாராக்கடன்கள் அல்லது செலுத்தப்படாத வட்டியாக தள்ளுபடி செய்யப்பட்ட மிகப்பெரிய கடன்கள் பற்றிய விவரங்களும் நாடாளுமன்றத்திற்கு வழங்கப்பட்டன. கடன் மறுசீரமைப்பு அட்டவணைகளின் கீழ், இலங்கை மின்சார சபை (CEB) மறுசீரமைப்புடன் தொடர்புடைய 61 பில்லியன் ரூபாய் மற்றும் 2017 இல் தள்ளுபடி செய்யப்பட்ட 15 பில்லியன் ரூபாய் ரியல் எஸ்டேட் அடமானங்கள் ஆகியவை இலங்கை வங்கியின் முக்கிய தள்ளுபடிகளில் அடங்கும்.

கடன் பெற்றவர்களின் அடையாளங்கள் சட்டத்தால் பாதுகாக்கப்பட்டுள்ள போதிலும், முழுமையான புள்ளிவிவரங்கள் மற்றும் மீட்பு நடவடிக்கைகள் நாடாளுமன்ற ஆய்வுக்கு வைக்கப்பட்டுள்ளதாக ஜயந்த குறிப்பிட்டார். (கொழும்பு/செப்11/2026)`
  },
  50: {
    title: "ரூபாய் மதிப்பிழப்பின் இயக்கவியல்: ஏன் மலடாக்கப்படாத டாலர் கொள்முதல் இலங்கையின் பொருளாதாரத்தை வடிகட்டுகிறது",
    deck: "மத்திய வங்கியின் டாலர் கொள்முதல் உள்நாட்டு ரூபாய் பணப்புழக்கத்தை உருவாக்கியது, அது இறக்குமதி கோரிக்கையாக மாறி ரூபாயை 285 லிருந்து 309 ஆக பலவீனப்படுத்தியது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — லங்காஈகோன் செய்திப் பிரிவு

2025 ஆம் ஆண்டின் முதல் பாதியில், இலங்கை மத்திய வங்கி (CBSL) உள்நாட்டு வெளிநாட்டு நாணயச் சந்தையிலிருந்து 1.625 பில்லியன் அமெரிக்க டாலர்களுக்கும் அதிகமாகக் கொள்முதல் செய்தது. அதிகாரப்பூர்வ ஊடக அறிக்கைகள் இந்த சாதனையை வெளிநாட்டுத் துறை மீட்சி மற்றும் கையிருப்பு குவிப்பின் சான்றாகப் பாராட்டின. ஆயினும், இந்த பிரதான கையிருப்பு புள்ளிவிவரத்தின் பின்னால் ஒரு அடிப்படை பணவியல் புதிர் உள்ளது: இதே காலகட்டத்தில், இலங்கை ரூபாய் டாலருக்கு நிகராக 285 இலிருந்து 309 ரூபாய்க்கும் மேலாக சரிந்தது.

ஒரு மத்திய வங்கி பெருமளவில் டாலர்களை வாங்கும் போது அதன் தேசிய நாணயம் எவ்வாறு தொடர்ந்து மதிப்பிழக்க முடியும்?

இதற்கான விடை மலடாக்கப்படாத (Unsterilized) பண விரிவாக்க இயக்கவியலில் உள்ளது. 1949 இல் மத்திய வங்கியின் வடிவமைப்பாளர் ஜான் எக்ஸ்டர் முதன்முதலில் இந்த நிகழ்வை ஆய்வு செய்தார். மத்திய வங்கி வணிக வங்கிகளிடமிருந்து 1.6 பில்லியன் டாலர்களை வாங்கும் போது, அது ஏற்கனவே உள்ள நிதியிலிருந்து பணம் செலுத்துவதில்லை. அது எந்தவொரு பின்தாங்குதலும் இல்லாமல் புதிய ரூபாய்களை உருவாக்கி வணிக வங்கிகளின் கணக்குகளில் வரவு வைக்கிறது.

மத்திய வங்கி பொக்கிஷ உண்டியல்களை விற்று இந்த பணப்புழக்கத்தை உடனடியாக "மலடாக்க" (Sterilize) செய்யாவிட்டால், இந்த புதிய பண வெள்ளம் ஒரு செயற்கையான இடைவங்கி பணப்புழக்க உபரியை உருவாக்குகிறது. வணிக வங்கிகள் தங்கள் உபரி கையிருப்பின் அடிப்படையில் கடன் வழங்கும் தரங்களைத் தளர்த்தி இறக்குமதியாளர்களுக்கு கடன்களை விரிவுபடுத்துகின்றன. சில வாரங்களுக்குள், புதிதாக உருவாக்கப்பட்ட அந்த ரூபாய்கள் இறக்குமதி செய்யப்பட்ட பொருட்களை வாங்க அந்நிய செலாவணி சந்தைக்கு வருகின்றன, இது டாலர் தேவையை அதிகரித்து ரூபாயை வீழ்ச்சியடையச் செய்கிறது.`
  },
  51: {
    title: "மென்மையான மாற்று விகித பொறி: ஸ்டாண்டிங் கடன் வழங்கள் எவ்வாறு சாத்தியமற்ற முக்கோணத்தை மீறுகிறது",
    deck: "குறைந்த வட்டி விகிதத்தில் வணிக வங்கிகளுக்கு பணப்புழக்கத்தை வழங்குவது கடன் விரிவாக்கத்திற்கு வழிவகுத்து மத்திய வங்கி கையிருப்பைக் குறைக்கிறது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — லங்காஈகோன் செய்திப் பிரிவு

வளரும் நாடுகளின் மத்திய வங்கி வரலாற்றில் "மென்மையான மாற்று விகித பொறி" (Soft-Peg Trap) பல நிதி நெருக்கடிகளுக்கு காரணமாக இருந்துள்ளது. ஒரு நாணய அதிகாரம் ஒரே நேரத்தில் மாற்று விகித இலக்கை பராமரிக்கவும், சந்தை தலையீடுகள் மூலம் உள்நாட்டு வட்டி விகிதங்களை நிர்வகிக்கவும் முயற்சிக்கும் போது இந்த பொறி ஏற்படுகிறது.

பொருளாதார அறிவியலில், சாத்தியமற்ற முக்கோணம் (Mundell-Fleming மாதிரி) எந்தவொரு மத்திய வங்கியும் ஒரே நேரத்தில் மூன்று நிபந்தனைகளை பராமரிக்க முடியாது என்பதை நிரூபிக்கிறது:
1. நிலையான அல்லது நிர்வகிக்கப்படும் மாற்று விகிதம்
2. சர்வதேச மூலதனத்தின் சுதந்திரமான நகர்வு
3. சுதந்திரமான உள்நாட்டு பணவியல் கொள்கை

இலங்கை மத்திய வங்கி 9.25% நிலையான கடன் வசதி (SLF) தண்டனை விகிதத்தை விடக் குறைவாக 8.26% வட்டிக்கு வணிக வங்கிகளுக்கு 133.6 பில்லியன் ரூபாயை வழங்கிய போது, அது இடைவங்கி வட்டி விகிதங்களை செயற்கையாகக் குறைக்க முயன்றது. வணிக வங்கிகள் நிலையான வைப்புகளை ஈர்ப்பதற்குப் பதிலாக இந்த மலிவான நிதியைப் பயன்படுத்தி வர்த்தகக் கடன்களை விரிவுபடுத்தின.

இதன் விளைவு விரைவாக உருவானது: மலிவான ரூபாய் கடன் டாலர் மாற்றுக் கோரிக்கையாக மாறியது, மாற்று விகிதத்தைப் பாதுகாக்க மத்திய வங்கி தனது விலைமதிப்பற்ற அந்நிய செலாவணி கையிருப்புகளை விற்க வேண்டிய கட்டாயம் ஏற்பட்டது.`
  },
  52: {
    title: "ஏன் இறக்குமதி கட்டுப்பாடுகள் நடப்புக் கணக்கு பற்றாக்குறையை சரிசெய்ய முடியாது: தேசிய சேமிப்பு-முதலீட்டு பகுப்பாய்வு",
    deck: "வாகனங்கள் மற்றும் மூலதனப் பொருட்களைத் தடை செய்வது அறிகுறிகளுக்கு மட்டுமே சிகிச்சையளிக்கிறது, அதே நேரத்தில் அரசாங்க வரவுசெலவுத் திட்ட பற்றாக்குறை அதிகப்படியான ரூபாய் தேவையை உருவாக்குகிறது.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — லங்காஈகோன் செய்திப் பிரிவு

பல தசாப்தங்களாக, இலங்கை கொள்கை வகுப்பாளர்கள் அந்நிய செலாவணி பற்றாக்குறைக்கு மோட்டார் வாகனங்கள், நுகர்வோர் பொருட்கள் மற்றும் விவசாய இறக்குமதிகளுக்கு தடைகளை விதிப்பதன் மூலம் பதிலளித்துள்ளனர். இந்த வர்த்தகவாத அணுகுமுறை நுகர்வோரின் பேராசையினால் தான் வர்த்தக பற்றாக்குறை ஏற்படுகிறது என்ற தவறான நம்பிக்கையை அடிப்படையாகக் கொண்டது.

தேசிய சேமிப்பு-முதலீட்டு சமன்பாட்டின் மூலம் மேக்ரோ பொருளாதார கணக்கியல் ஒரு அடிப்படை உண்மையை வெளிப்படுத்துகிறது:

நடப்புக் கணக்கு இருப்பு = தேசிய சேமிப்பு மைனஸ் முதலீடு

அரசாங்கம் மத்திய வங்கி மூலம் பணத்தை அச்சிட்டு பாரிய வரவுசெலவுத் திட்ட பற்றாக்குறையை இயக்கும் போது, அது பொதுத்துறையில் "சேமிப்பின்மையை" உருவாக்குகிறது. அரசாங்கத்தால் செலவிடப்படும் இந்த அதிகப்படியான பணம் நுகர்வோர் கைக்குச் சென்று உண்மையான உற்பத்தி இல்லாத வாங்கும் சக்தியை உருவாக்குகிறது. நுகர்வோர் இயல்பாகவே இந்த கூடுதல் பணத்தை உள்நாட்டு மற்றும் இறக்குமதி செய்யப்பட்ட பொருட்களுக்கு செலவிடுகிறார்கள்.

அரசாங்கம் இறக்குமதி செய்யப்பட்ட கார்களைத் தடை செய்தால், நுகர்வோர் அந்த ரூபாய்களை சேமிப்பதில்லை. மாறாக, அவர்கள் அந்த உபரி பணத்தை இறக்குமதி செய்யப்பட்ட மின்னணுவியல், ஜவுளி அல்லது உணவுப் பொருட்களை வாங்க திருப்புகிறார்கள். குறிப்பிட்ட பொருட்களைத் தடை செய்வது நிகர வர்த்தக இருப்பை மாற்றாமல் அந்நிய செலாவணி அழுத்தத்தை ஒரு துறையிலிருந்து மற்றொரு துறைக்கு மாற்ற மட்டுமே செய்கிறது.`
  },
  53: {
    title: "இலங்கை மத்திய வங்கியை சீர்திருத்துதல்: தன்னாதிக்க பண உருவாக்கத்திலிருந்து நாணய வாரிய விதிகள் வரை",
    deck: "டேவிட் ரிகார்டோவின் 1816 இங்காட் திட்டம் மற்றும் ஜான் எக்ஸ்டரின் 1949 எச்சரிக்கைகள் நீண்டகால பணவியல் ஸ்திரத்தன்மைக்கான திட்டவட்டமான வழிகாட்டலை வழங்குகின்றன.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — ரனுல் செனவிரத்ன

1949 ஆம் ஆண்டின் நாணயச் சட்டத்தை நிறுவியதிலிருந்து இலங்கையின் வரலாறு செலுத்துகை நிலுவை நெருக்கடிகள், பணவீக்க உயர்வுகள் மற்றும் நாணய மதிப்பிழப்புகளால் குறிக்கப்பட்டுள்ளது. இதற்கு மூலக் காரணம் தன்னாதிக்க மத்திய வங்கியாகும் — அதாவது அரசாங்கக் கடனை பணமாக்கவோ அல்லது வங்கிகளை மீட்கவோ நாணய அதிகாரிகளுக்கு தன்னிச்சையாக பணத்தை உருவாக்கும் அதிகாரம் இருந்தது.

இந்த சுழற்சியை உடைக்க இலங்கைக்கு கட்டமைப்பு ரீதியான பணவியல் சீர்திருத்தம் தேவை. நாணயத் தாள்கள் அதிகமாக வெளியிடப்படுவதைத் தடுக்க கடுமையான மாற்றத்தக்க விதிகளுக்கு உட்படுத்தப்பட வேண்டும் என்று டேவிட் ரிகார்டோவின் 1816 இங்காட் திட்டம் (Ingot Plan) நிறுவியது.

நவீன நாணய வாரியம் (Currency Board) இரண்டு கட்டாயக் கொள்கைகளை நடைமுறைப்படுத்துகிறது:
1. **100% அந்நிய செலாவணி கையிருப்பு ஆதரவு**: வெளியிடப்படும் ஒவ்வொரு ரூபாயும் 100% வெளிநாட்டு நாணய கையிருப்புகளால் பாதுகாக்கப்பட வேண்டும்.
2. **பூஜ்ஜிய கடன் பணமாக்கல்**: அரசாங்க பொக்கிஷ உண்டியல்களை வாங்குவதற்கோ அல்லது வணிக வங்கிகளுக்கு கடன் வழங்குவதற்கோ நாணய அதிகாரத்திற்கு சட்டப்பூர்வமாக தடை விதிக்கப்படுகிறது.

இத்தகைய கட்டமைப்பின் கீழ் பணவீக்கம் உலகளாவிய நிலைக்குக் குறைகிறது மற்றும் மாற்று விகித ஏற்ற இறக்கங்கள் முழுமையாக மறைந்துவிடும்.`
  },
  54: {
    title: "பணம் பற்றிய மூன்று முக்கிய பார்வைகள்: நவீன இலங்கைக்கு கிளாசிக்கல், மார்க்சிஸ்ட் மற்றும் கேயின்சியன் பாடங்கள்",
    deck: "டேவிட் ஹியூம், காரல் மார்க்ஸ் மற்றும் ஜான் மேனார்ட் கேயின்ஸ் ஆகியோரின் மாதிரிகள் பண அச்சிடுதல் உண்மையான தேசிய உற்பத்திக்கு மாற்றாக முடியாது என்பதை விளக்குகின்றன.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — ரனுல் செனவிரத்ன

மனித சமுதாயத்தில் பணத்தின் தன்மை மற்றும் பங்கு குறித்து பொருளாதார வரலாற்றில் மூன்று தனித்துவமான கோட்பாடுகள் உள்ளன:

1. **கிளாசிக்கல் பார்வை (ஹியூம், ஸ்மித், ரிகார்டோ)**: பணம் என்பது வர்த்தகத்தை எளிதாக்கும் ஒரு நடுநிலையான ஊடகம் மட்டுமே. பணத்தை அச்சிடுவது உண்மையான செல்வத்தையோ உண்மையான பொருட்களையோ உருவாக்காது; இது வாங்கும் சக்தியை மறுபங்கீடு செய்து விலை மட்டங்களை மட்டுமே உயர்த்துகிறது.

2. **மார்க்சிய பார்வை (காரல் மார்க்ஸ்)**: பணம் என்பது உழைப்பை உறுதிப்படுத்தும் உலகளாவிய சமமானதாகும். விற்பனைச் செயலை கொள்முதல் செயலிலிருந்து பிரிப்பதன் மூலம் பணம் பதுக்கல், பணப்புழக்க விருப்பம் மற்றும் கட்டமைப்பு பொருளாதார நெருக்கடிகளுக்கான சாத்தியத்தை உருவாக்குகிறது.

3. **கேயின்சிய பார்வை (ஜான் மேனார்ட் கேயின்ஸ்)**: பணம் என்பது நிச்சயமற்ற தன்மையை எதிர்கொள்ளும் ஒரு மதிப்பு சேமிப்பாகும். குறுகிய காலத்தில் விலைகளும் ஊதியங்களும் உடனடியாக மாறாததால் (Sticky prices), பணவியல் அதிர்ச்சிகள் உண்மையான உற்பத்தி மற்றும் வேலைவாய்ப்பை பாதிக்கலாம்.

நவீன மேக்ரோ பொருளாதாரத்தைப் புரிந்துகொள்வதற்கு, கேயின்சிய கோட்பாடுகள் குறுகிய காலத்தில் செயல்படுகின்றன, ஆனால் கிளாசிக்கல் நீண்டகால பணவியல் நடுநிலைமை இறுதியில் வெற்றி பெறுகிறது என்பதை அங்கீகரிக்க வேண்டும். அரசாங்க செலவினங்களுக்கு நிதியளிக்க ரூபாய்களை அச்சிடுவது குறுகிய காலத்திற்கு அதிர்ச்சியைத் தணிக்கலாம், ஆனால் காலப்போக்கில் பணவீக்கம் மற்றும் நாணய வீழ்ச்சியை மட்டுமே தரும்.`
  },
  55: {
    title: "வைப்புகள் இன்றி கடன் விரிவாக்கம்: வர்த்தக வங்கிகளை பாதிக்கும் இடைவங்கி பணப்புழக்க சன்னல்கள்",
    deck: "வர்த்தக வங்கிகள் வாடிக்கையாளர் வைப்புகளுக்குப் பதிலாக மத்திய வங்கியின் மலிவான பணப்புழக்க வசதிகளை நம்பியிருக்கும் போது, கடன் விரிவாக்கம் உண்மையான சேமிப்பை விட அதிகமாகிறது.",
    category: "சந்தைகள்",
    body: `கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — ரனுல் செனவிரத்ன

ஆரோக்கியமான வங்கித் துறையானது நீண்டகால கடன்களுக்கு நிதியளிக்க வாடிக்கையாளர்களின் நிலையான சேமிப்பு வைப்புகளை நம்பியுள்ளது. இருப்பினும், மத்திய வங்கிகள் மலிவான பணப்புழக்க சாளரங்களை வழங்கும் போது வணிக வங்கிகள் வைப்புகள் இன்றி கடன் வழங்கும் (Overtrading) பழக்கத்திற்கு அடிமையாகின்றன.

Overtrading என்பது வணிக வங்கிகள் வாடிக்கையாளர் வைப்புகளைத் திரட்டுவதற்கு முன்பே ஆக்ரோஷமாக கடன்களை வழங்கி, பின்னர் தங்கள் தினசரி தீர்வு கணக்குகளை சமநிலைப்படுத்த மத்திய வங்கியின் மலிவான பணப்புழக்க சாளரங்களை நம்பியிருப்பதாகும்.

இந்த செயல்பாட்டு சிதைவு இரண்டு வழிகளில் நிதி ஸ்திரத்தன்மையை குறைமதிப்பிற்கு உட்படுத்துகிறது:
1. **ஒழுக்கக்கேடு (Moral Hazard)**: மலிவான மத்திய வங்கி பணப்புழக்கம் எப்போதும் கிடைப்பதால் வணிக வங்கிகள் நீண்டகால வாடிக்கையாளர் வைப்புகளுக்கு தீவிரமாக போட்டியிடுவதை நிறுத்துகின்றன.
2. **செயற்கை கடன் சுழற்சிகள்**: கடன் விரிவாக்கம் உண்மையான தேசிய சேமிப்பை விட அதிகமாகி சொத்து குமிழ்களை உருவாக்குகிறது மற்றும் மத்திய வங்கி தலையீடுகளை திரும்பப் பெறும் போது கடன் சுருக்கம் ஏற்படுகிறது.

முறையான ஒழுங்குமுறைகள் கடன் வசதி பயன்பாட்டின் மீது கடுமையான தண்டனைகளை அமல்படுத்த வேண்டும், இது இடைவங்கி பணப்புழக்கத்தை மலிவான கடன் ஆதாரமாக இல்லாமல் உண்மையான "கடைசி கடன் வழங்குநராக" (Lender of Last Resort) மட்டுமே செயல்பட வைக்கிறது.`
  },
  1: {
    title: "இலங்கை மத்திய வங்கி வட்டி விகிதங்களில் மாற்றமில்லை என அறிவிப்பு",
    deck: "பணவீக்க இலக்குகளை அடைவதற்கும் தனியார் துறை கடன்களை ஊக்குவிப்பதற்கும் தற்போதைய வட்டி விகிதங்கள் பொருத்தமானவை என மத்திய வங்கி தெரிவித்துள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கை மத்திய வங்கி (CBSL) தனது நிலையான வைப்பு வசதி விகிதத்தை (SDFR) 8.25% ஆகவும், நிலையான கடன் வசதி விகிதத்தை (SLFR) 9.25% ஆகவும் தற்போதைய அளவிலேயே மாற்றமின்றி பராமரிக்க முடிவு செய்துள்ளது.

உள்நாட்டு மற்றும் உலகளாவிய மேக்ரோ பொருளாதார முன்னேற்றங்கள் பற்றிய விரிவான ஆய்வுக்குப் பின்னர் நாணயக் கொள்கை வாரியக் கூட்டத்தில் இந்த முடிவு எடுக்கப்பட்டது. நடுத்தர காலத்தில் 5% இலக்கு வரம்பிற்குள் பணவீக்கத்தை பராமரிக்க தற்போதைய நாணயக் கொள்கை நிலைப்பாடு தொடர்ந்து பொருத்தமானது என்று வாரியம் குறிப்பிட்டது.

"விவசாயம், உற்பத்தி மற்றும் சேவைத் துறைகளில் தனியார் துறை கடன் விரிவாக்கம் ஊக்கமளிக்கும் வேகத்தை வெளிப்படுத்தியுள்ளது," என்று உத்தியோகபூர்வ கொள்கை அறிவிப்பில் மத்திய வங்கி ஆளுநர் தெரிவித்தார். "உள்நாட்டு பணச் சந்தையில் பணப்புழக்க நிலைமைகள் வசதியாக நேர்மறையாக உள்ளன, இது வணிக வங்கிகள் மூலம் தடையற்ற வட்டி விகித பரவலை உறுதி செய்கிறது."

புலம்பெயர் தொழிலாளர் பணப்பரிமாற்றம், சுற்றுலா வருவாய் மற்றும் சர்வதேச நாணய நிதியத்தின் (EFF) நிதி வழங்கல்கள் காரணமாக கடந்த மாத இறுதியில் மொத்த உத்தியோகபூர்வ கையிருப்பு $6.1 பில்லியனை எட்டியது.

கொழும்பு பங்குச் சந்தையில் (CSE) முதலீட்டாளர்கள் இந்த அறிவிப்புக்கு சாதகமாக பதிலளித்தனர், வர்த்தகத்தின் ஆரம்பத்தில் வங்கித் துறை பங்குகள் உயர்ந்தன.`
  },
  2: {
    title: "சர்வதேச நாணய நிதியம் (IMF) இலங்கையின் வருவாய் மற்றும் ஆளுகை முன்னேற்றத்தைப் பாராட்டியுள்ளது",
    deck: "வரி நிர்வாகம் மற்றும் பொதுத்துறை நிறுவனங்களின் சீர்திருத்தங்களில் குறிப்பிடத்தக்க முன்னேற்றம் ஏற்பட்டுள்ளதாக சர்வதேச நாணய நிதியம் சுட்டிக்காட்டியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — சர்வதேச நாணய நிதியத்தின் (IMF) பிரதிநிதிகள் குழு கொழும்பில் தனது தொழில்நுட்ப ஆலோசனைகளை வெற்றிகரமாக நிறைவு செய்ததுடன், இலங்கையின் அரச வருவாய் சேகரிப்பு மற்றும் அரச நிறுவன (SOE) மறுசீரமைப்பு செயல்முறையைப் பாராட்டியுள்ளது.

உள்நாட்டு இறைவரித் திணைக்களத்தின் (IRD) டிஜிட்டல் வரி தாக்கல் அமைப்புகள் மற்றும் மேம்படுத்தப்பட்ட சுங்க வரி வசூலிப்பு காரணமாக முதன்மை நிதி இருப்புக்கள் இலக்குகளை எட்டியுள்ளதாக குழுவினர் சுட்டிக்காட்டினர்.

"இலங்கையின் பொருளாதார மீட்சி கட்டமைப்பு ரீதியான நல்லாட்சி சீர்திருத்தங்களுக்கான அர்ப்பணிப்பில் வேரூன்றியுள்ளது," என்று சர்வதேச நாணய நிதியத்தின் தூதுக்குழு தலைவர் கொழும்பில் செய்தியாளர்களிடம் தெரிவித்தார். "அஸ்வெசும போன்ற சமூக பாதுகாப்பு வலைகளைப் பாதுகாக்கும் அதே வேளையில் நிதி ஒழுக்கத்தைப் பேணுவது நீண்டகால நிலையான வளர்ச்சிக்கு இன்றியமையாதது."

சர்வதேச சந்தைகளில் இலங்கை இறையாண்மை டாலர் பத்திரங்களின் விலைகள் இந்த மதிப்பீட்டின் பின்னர் கணிசமாக உயர்ந்தன.`
  },
  3: {
    title: "கொழும்பு பங்குச் சந்தை (CSE) அனைத்து பங்கு விலைச்சுட்டி 12,800 புள்ளிகளைக் கடந்தது",
    deck: "ஜான் கீல்ஸ், கொமர்ஷல் வங்கி மற்றும் சம்பத் வங்கி ஆகியவற்றின் பங்குகளில் வெளிநாட்டு முதலீடுகள் அதிகரிப்பு.",
    category: "சந்தைகள்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — முன்னணி நிறுவனங்கள் மற்றும் வணிக வங்கிப் பங்குகளில் வெளிநாட்டு நிறுவனங்களின் முதலீடுகள் அதிகரித்ததன் காரணமாக கொழும்பு பங்குச் சந்தையின் அனைத்து பங்கு விலைச்சுட்டி (ASPI) இன்று 12,800 புள்ளிகளைக் கடந்து உயர்ந்தது.

தினசரி விற்றுமுதல் 2.45 பில்லியன் ரூபாயாக பதிவானதுடன், வெளிநாட்டு முதலீட்டாளர்கள் 320 மில்லியன் ரூபாய் நிகர கொள்முதல் நிலையை பதிவு செய்தனர். நிறுவனங்களின் உறுதியான லாபத்தன்மை, நிலையான உள்நாட்டு வட்டி விகிதங்கள் மற்றும் கவர்ச்சிகரமான விலை-வருவாய் விகிதங்கள் (P/E) இந்த உயர்வுக்கு முக்கிய காரணங்களாக அமைந்தன.`
  },
  4: {
    title: "இலங்கை தேயிலை ஏற்றுமதி வருவாய் $1.4 பில்லியனை எட்டியது",
    deck: "மத்திய கிழக்கு சந்தைகளில் இலங்கை தேயிலைக்கான அதிக தேவை காரணமாக கொழும்பு தேயிலை ஏலத்தில் சாதனை விலைகள்.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஈராக், ஐக்கிய அரபு எமிரேட்ஸ் மற்றும் சவுதி அரேபியா உள்ளிட்ட பாரம்பரிய மத்திய கிழக்கு சந்தைகளில் உயர்தர ஆர்தடாக்ஸ் தேயிலைக்கான தொடர்ச்சியான தேவை காரணமாக இலங்கையின் தேயிலை ஏற்றுமதி வருவாய் $1.4 பில்லியனை எட்டியுள்ளது.

கொழும்பு தேயிலை ஏலத்தில் மேற்கு மற்றும் நுவரெலியா தேயிலைகளுக்கு தீவிர கேள்வி காணப்பட்டதுடன், சிறப்பு தோட்ட தேயிலைகள் வரலாற்று உச்ச விலைகளைப் பெற்றன.`
  },
  5: {
    title: "விவசாய இறக்குமதிக்கான புதிய வரி அமைப்பிற்கு நாடாளுமன்றக் குழு ஒப்புதல்",
    deck: "சந்தாதாரர்களுக்கு மட்டும்: உள்நாட்டு விவசாயிகளைப் பாதுகாத்தல் மற்றும் உணவுப் பணவீக்கத்தைக் கட்டுப்படுத்துதல் பற்றிய விரிவான ஆய்வு.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் சந்தாதாரர் சிறப்பு அறிக்கை) — சோளம், அரிசி மற்றும் சமையல் எண்ணெய்கள் உள்ளிட்ட முக்கிய விவசாய இறக்குமதிகளுக்கான மறுசீரமைக்கப்பட்ட பருவகால வரி கொள்கைக்கு பொது நிதி பற்றிய நாடாளுமன்றக் குழு (COPF) ஒப்புதல் அளித்துள்ளது.

அறுவடை காலங்களில் உள்நாட்டு விவசாயிகளுக்கு நிலையான விலையை உறுதி செய்வதற்கும் நகர்ப்புற நுகர்வோருக்கு உணவுப் பணவீக்கத்தைக் கட்டுப்படுத்துவதற்கும் இடையே ஒரு சமநிலையை உருவாக்குவதே இக்கொள்கையின் நோக்கமாகும்.`
  },
  6: {
    title: "இரண்டாம் காலாண்டில் வர்த்தக வங்கித் துறையின் நிகர லாபம் 24% அதிகரிப்பு",
    deck: "கொமர்ஷல் வங்கி, ஹட்டன் நெஷனல் வங்கி மற்றும் சம்பத் வங்கி ஆகியவை வலுவான நிகர வட்டி வருவாயைப் பதிவு செய்துள்ளன.",
    category: "சந்தைகள்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் உரிமம் பெற்ற வணிக வங்கிகள் இரண்டாம் காலாண்டில் தங்களது நிகர லாபத்தில் 24% வருடாந்த அதிகரிப்பைப் பதிவு செய்துள்ளன. பொக்கிஷ உண்டியல்கள் மீதான குறைக்கப்பட்ட இழப்பீட்டுக் கட்டணங்கள் மற்றும் தனியார் கடன் தேவை விரிவாக்கம் இதற்கு முக்கியக் காரணமாக அமைந்தன.`
  },
  7: {
    title: "ஆடை ஏற்றுமதி மீட்சி: அமெரிக்க மற்றும் ஐரோப்பிய பிராண்டுகளிடமிருந்து $450 மில்லியன் ஆர்டர்கள்",
    deck: "அமெரிக்க மற்றும் ஐரோப்பிய சில்லறை விற்பனை நெட்வொர்க்குகளுக்கு உயர் மதிப்புள்ள ஆடைகளை உற்பத்தி செய்யும் நிறுவனங்கள் அதிகபட்ச உற்பத்தியைப் பதிவு செய்கின்றன.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — வட அமெரிக்க மற்றும் ஐரோப்பிய முன்னணி சில்லறை வர்த்தக நெட்வொர்க்குகளிடமிருந்து கிடைத்த உயர்தர ஆடை ஆர்டர்கள் காரணமாக மாதாந்திர ஆடை ஏற்றுமதி 12% மீட்சியடைந்துள்ளது என கூட்டு ஆடை சங்க மன்றம் (JAAF) அறிவித்துள்ளது.`
  },
  8: {
    title: "புதுப்பிக்கத்தக்க எரிசக்தி திட்டம்: 2028 ஆம் ஆண்டிற்குள் 2,000 மெகாவாட் சூரிய மற்றும் காற்று மின்சாரம் இணைக்க இலக்கு",
    deck: "மின்சாரம் மற்றும் எரிசக்தி அமைச்சு மன்னார் மற்றும் பூநகரியில் பேட்டரி சேமிப்பு வசதிகளுக்கான டெண்டர்களைக் கோருகிறது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் தேசிய மின் கட்டமைப்பு திறனில் 70% ஐ தூய புதுப்பிக்கத்தக்க ஆற்றலாக மாற்றுவதை விரைவுபடுத்தும் வகையில் 2,000 மெகாவாட் மின் உற்பத்தி டெண்டர் ஆவணங்களை இலங்கை மின்சார சபை (CEB) இறுதி செய்துள்ளது.`
  },
  9: {
    title: "கொழும்பு போர்ட் சிட்டி: தொழில்நுட்பம் மற்றும் தளவாடங்களில் $120 மில்லியன் முதலீடுகளை ஈர்க்கிறது",
    deck: "கொழும்பு துறைமுக நகர பொருளாதார ஆணைக்குழு மூன்று சர்வதேச தொழில்நுட்ப மற்றும் கடல்சார் தளவாட நிறுவனங்களுக்கு செயல்பாட்டு உரிமங்களை வழங்கியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — கொழும்பு துறைமுக நகர பொருளாதார ஆணைக்குழு மூன்று சர்வதேச தகவல் தொழில்நுட்பம் மற்றும் கடல்சார் தளவாட நிறுவனங்களுக்கு செயல்பாட்டு உரிமங்களை வழங்கியுள்ளது, நிதி வலயத்தில் மொத்த உறுதியளிக்கப்பட்ட நேரடி வெளிநாட்டு முதலீடு $1.2 பில்லியனைத் தாண்டியுள்ளது.`
  },
  10: {
    title: "சுற்றுலா வருவாய் $1.8 பில்லியனை எட்டியது: ஐரோப்பிய குளிர்கால முன்பதிவுகள் அதிகரிப்பு",
    deck: "இலங்கை சுற்றுலா அபிவிருத்தி சபை (SLTDA) ஆண்டின் முதல் ஏழு மாதங்களில் 1.2 மில்லியனுக்கும் அதிகமான சுற்றுலாப் பயணிகளின் வருகையைப் பதிவு செய்துள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஆண்டின் முதல் ஏழு மாதங்களில் சுற்றுலா வருவாய் 1.8 பில்லியன் டாலர்களை எட்டியுள்ளது, இங்கிலாந்து, ஜெர்மனி மற்றும் இந்தியா ஆகிய நாடுகளிலிருந்து 1.2 மில்லியனுக்கும் அதிகமான சுற்றுலாப் பயணிகள் இலங்கைக்கு வருகை தந்துள்ளனர்.`
  },
  11: {
    title: "பொக்கிஷ உண்டியல் ஏலத்தில் உள்நாட்டு முதலீட்டாளர்களின் அதிக தேவை காரணமாக வட்டி விகிதங்கள் ஸ்திரத்தன்மை அடைந்தன",
    deck: "364 நாட்கள் கொண்ட பொக்கிஷ உண்டியல் வட்டி விகிதங்கள் 9.42% ஆக ஸ்திரத்தன்மை அடைந்துள்ளன.",
    category: "சந்தைகள்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — அரசாங்க கடன் முகாமைத்துவ திணைக்களத்தினால் நடத்தப்பட்ட 91, 182 மற்றும் 364 நாட்கள் கொண்ட பொக்கிஷ உண்டியல் ஏலங்களில் கோரப்பட்ட தொகையை விட அதிக ஏலங்கள் பெறப்பட்டதுடன் வட்டி விகிதங்கள் 9.42% அளவில் ஸ்திரத்தன்மை அடைந்தன.`
  },
  12: {
    title: "ஏற்றுமதி அபிவிருத்தி சபை (EDB) 2030 ஆம் ஆண்டிற்குள் $25 பில்லியன் தேசிய ஏற்றுமதி திட்டத்தை வெளியிட்டது",
    deck: "மின்னணு உற்பத்தி, பதப்படுத்தப்பட்ட நறுமணப் பொருட்கள், கடல் பொருட்கள் மற்றும் டிஜிட்டல் தொழில்நுட்ப சேவைகள் முக்கிய துறைகளாக அடையாளம் காணப்பட்டுள்ளன.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஏற்றுமதி அபிவிருத்தி சபையின் தலைவர் 2030 தேசிய ஏற்றுமதி விரிவாக்க மூலோபாயத்தை கொழும்பில் வெளியிட்டார், மின்னணு பாகங்கள், நறுமணப் பொருட்கள், கடல் பொருட்கள் மற்றும் மென்பொருள் சேவைகள் முக்கிய ஏற்றுமதித் துறைகளாக அறிவிக்கப்பட்டன.`
  },

  // Additional Initial Articles in Tamil
  302: {
    title: "மூடிஸ் (Moody's) இலங்கையின் Caa1 இறையாண்மை கடன் மதிப்பீட்டை நிலையான கண்ணோட்டத்துடன் மீண்டும் உறுதிப்படுத்தியது",
    deck: "கடன் மறுசீரமைப்பு செயல்பாடுகள் மற்றும் நிதி ஒருங்கிணைப்பு ஆகியவற்றைக் குறிப்பிட்டு, இலங்கை அரசாங்கத்தின் நீண்டகால கடன் மதிப்பீடுகளை மூடிஸ் உறுதிப்படுத்தியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — சர்வதேச கடன் மதிப்பீட்டு நிறுவனமான மூடிஸ் (Moody's Ratings), இலங்கை அரசாங்கத்தின் நீண்டகால வெளிநாட்டு மற்றும் உள்ளூர் நாணய கடன் மதிப்பீடுகளை Caa1 மட்டத்தில் பராமரிக்க முடிவு செய்துள்ளதுடன், அதன் எதிர்கால கண்ணோட்டத்தை நிலையானதாக (Stable) உறுதிப்படுத்தியுள்ளது.`
  },
  "sri-lanka-caa1-sovereign-rating-confirmed-moodys": {
    title: "மூடிஸ் (Moody's) இலங்கையின் Caa1 இறையாண்மை கடன் மதிப்பீட்டை நிலையான கண்ணோட்டத்துடன் மீண்டும் உறுதிப்படுத்தியது",
    deck: "கடன் மறுசீரமைப்பு செயல்பாடுகள் மற்றும் நிதி ஒருங்கிணைப்பு ஆகியவற்றைக் குறிப்பிட்டு, இலங்கை அரசாங்கத்தின் நீண்டகால கடன் மதிப்பீடுகளை மூடிஸ் உறுதிப்படுத்தியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மூடிஸ் நிறுவனம் இலங்கையின் இறையாண்மை கடன் மதிப்பீட்டை உறுதிப்படுத்தியுள்ளது.`
  },
  303: {
    title: "இலங்கைக்கான புதிய அமெரிக்க தூதுவராக நியமிக்கப்பட்டுள்ள எரிக் மேயர் கொழும்பு வந்தடைந்தார்",
    deck: "இருதரப்பு வர்த்தகம் மற்றும் பிராந்திய கடல்சார் பாதுகாப்பை மையமாகக் கொண்டு தனது பணிகளைத் தொடங்குவதற்காக மூத்த தூதரக அதிகாரி எரிக் மேயர் இலங்கை வந்தடைந்தார்.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கை மற்றும் மாலைத்தீவுகளுக்கான புதிய அமெரிக்க தூதுவராக நியமிக்கப்பட்ட மூத்த தூதரக அதிகாரி எரிக் மேயர் (Eric Meyer), தனது கடமைகளைப் பொறுப்பேற்பதற்காக கொழும்பு வந்தடைந்துள்ளார்.`
  },
  "us-ambassador-designate-eric-meyer-arrives-sri-lanka": {
    title: "இலங்கைக்கான புதிய அமெரிக்க தூதுவராக நியமிக்கப்பட்டுள்ள எரிக் மேயர் கொழும்பு வந்தடைந்தார்",
    deck: "இருதரப்பு வர்த்தகம் மற்றும் பிராந்திய கடல்சார் பாதுகாப்பை மையமாகக் கொண்டு தனது பணிகளைத் தொடங்குவதற்காக மூத்த தூதரக அதிகாரி எரிக் மேயர் இலங்கை வந்தடைந்தார்.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — புதிய அமெரிக்க தூதுவர் எரிக் மேயர் இலங்கை வந்தடைந்துள்ளார்.`
  },
  304: {
    title: "மின்கல சேமிப்புடன் கூடிய சூரிய சக்தி மின்சாரத்திற்கு புதிய கட்டணங்களை பொதுப் பயன்பாடுகள் ஆணைக்குழு அறிவித்துள்ளது",
    deck: "மின்கல ஆற்றல் சேமிப்பு அமைப்புகளுடன் (BESS) இணைக்கப்பட்ட வணிக சூரிய சக்தி அமைப்புகளுக்கான புதிய கட்டண அட்டவணையை பொதுப் பயன்பாடுகள் ஆணைக்குழு வர்த்தமானியில் வெளியிட்டுள்ளது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மின்கல ஆற்றல் சேமிப்பு அமைப்புகளுடன் (BESS) இணைக்கப்பட்ட பெரிய அளவிலான சூரிய சக்தி மின் உற்பத்தி திட்டங்களுக்கான புதிய கட்டண முறையை இலங்கை பொதுப் பயன்பாடுகள் ஆணைக்குழு (PUCSL) உத்தியோகபூர்வமாக அறிவித்துள்ளது.`
  },
  "sri-lanka-regulator-sets-battery-solar-tariff-new-renewable-fits": {
    title: "மின்கல சேமிப்புடன் கூடிய சூரிய சக்தி மின்சாரத்திற்கு புதிய கட்டணங்களை பொதுப் பயன்பாடுகள் ஆணைக்குழு அறிவித்துள்ளது",
    deck: "மின்கல ஆற்றல் சேமிப்பு அமைப்புகளுடன் (BESS) இணைக்கப்பட்ட வணிக சூரிய சக்தி அமைப்புகளுக்கான புதிய கட்டண அட்டவணையை பொதுப் பயன்பாடுகள் ஆணைக்குழு வர்த்தமானியில் வெளியிட்டுள்ளது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — சூரிய சக்தி மின்சாரத்திற்கு புதிய கட்டணங்கள் அறிவிக்கப்பட்டுள்ளன.`
  },
  305: {
    title: "மூத்த வணிகர் ரஞ்சித் பேஜ் CT Holdings PLC நிறுவனத்தில் உள்ள தனது அனைத்துப் பங்குகளையும் விற்று வெளியேறினார்",
    deck: "பன்முகப்படுத்தப்பட்ட உணவு மற்றும் சில்லறை வர்த்தக நிறுவனமான CT Holdings PLC இல் உள்ள தனது முழுப் பங்குகளையும் மூத்த நிர்வாகி ரஞ்சித் பேஜ் விற்பனை செய்துள்ளார்.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் முன்னணி உணவு மற்றும் சில்லறை வர்த்தக நிறுவனமான CT Holdings PLC இன் துணைத் தலைவரும் தலைமை நிர்வாக அதிகாரியுமான ரஞ்சித் பேஜ், இந்நிறுவனத்தில் தனக்குச் சொந்தமான அனைத்து பங்குகளையும் கொழும்பு பங்குச் சந்தை (CSE) ஊடாக விற்பனை செய்துள்ளார்.`
  },
  "ranjith-page-sells-out-sri-lanka-ct-holdings": {
    title: "மூத்த வணிகர் ரஞ்சித் பேஜ் CT Holdings PLC நிறுவனத்தில் உள்ள தனது அனைத்துப் பங்குகளையும் விற்று வெளியேறினார்",
    deck: "பன்முகப்படுத்தப்பட்ட உணவு மற்றும் சில்லறை வர்த்தக நிறுவனமான CT Holdings PLC இல் உள்ள தனது முழுப் பங்குகளையும் மூத்த நிர்வாகி ரஞ்சித் பேஜ் விற்பனை செய்துள்ளார்.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ரஞ்சித் பேஜ் தனது பங்குகளை விற்பனை செய்துள்ளார்.`
  },
  306: {
    title: "இலங்கையின் மூலதனச் செலவினங்களின் நேரடி முன்னேற்றம் வரவுசெலவுத் திட்ட எண்களை விட முன்னிலையில் உள்ளது: அமைச்சர்",
    deck: "போக்குவரத்து மற்றும் நீர்ப்பாசனத் திட்டங்களின் மூலதனச் செலவினங்கள் (Capex) வரவுசெலவுத் திட்ட ஒதுக்கீடுகளை விட வேகமாக முன்னேறி வருவதாக அமைச்சர் தெரிவித்துள்ளார்.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — போக்குவரத்து மற்றும் நீர்ப்பாசன உட்கட்டமைப்பு திட்டங்களின் களப்பணி முன்னேற்றம் வரவுசெலவுத் திட்ட கணக்கு ஒதுக்கீடுகளை விட வேகமாக நடைபெற்று வருவதாக நிதியமைச்சு தெரிவித்துள்ளது.`
  },
  "sri-lanka-capex-physical-progress-usually-ahead-budget-numbers": {
    title: "இலங்கையின் மூலதனச் செலவினங்களின் நேரடி முன்னேற்றம் வரவுசெலவுத் திட்ட எண்களை விட முன்னிலையில் உள்ளது: அமைச்சர்",
    deck: "போக்குவரத்து மற்றும் நீர்ப்பாசனத் திட்டங்களின் மூலதனச் செலவினங்கள் (Capex) வரவுசெலவுத் திட்ட ஒதுக்கீடுகளை விட வேகமாக முன்னேறி வருவதாக அமைச்சர் தெரிவித்துள்ளார்.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மூலதன திட்டங்கள் சிறந்த முறையில் முன்னேறி வருகின்றன.`
  },
  307: {
    title: "இலங்கை வங்கிகளுக்கிடையேயான உபரி இருப்பு குறைவடைந்துள்ளது",
    deck: "தனியார் துறை கடன் வளர்ச்சி துரிதமடைவதாலும், மத்திய வங்கி சந்தை உபரியை நிவர்த்தி செய்வதாலும் வணிக வங்கிகளின் பணப்புழக்க இருப்புக்கள் சீரடைந்துள்ளன.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — வணிக வங்கிகளிடம் காணப்படும் உபரி பணப்புழக்கம் ரூ. 95 பில்லியனாகக் குறைவடைந்துள்ளதுடன், தனியார் துறைக்கான கடன் விரிவாக்கமே இதற்கு முக்கிய காரணமாகும் என மத்திய வங்கி தெரிவித்துள்ளது.`
  },
  "sri-lanka-interbank-excess-reserves-down": {
    title: "இலங்கை வங்கிகளுக்கிடையேயான உபரி இருப்பு குறைவடைந்துள்ளது",
    deck: "தனியார் துறை கடன் வளர்ச்சி துரிதமடைவதாலும், மத்திய வங்கி சந்தை உபரியை நிவர்த்தி செய்வதாலும் வணிக வங்கிகளின் பணப்புழக்க இருப்புக்கள் சீரடைந்துள்ளன.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — வங்கிகளின் உபரி இருப்பு குறைவடைந்துள்ளது.`
  },
  308: {
    title: "வெளிநாட்டினர் உள்ளூர் பிணையங்களை வாங்குவதால் இலங்கை மத்திய வங்கி சிறிய ரூபாய் மதிப்புயர்வை அனுமதிக்கிறது",
    deck: "வெளிநாட்டு முதலீட்டு நிதிகள் திறைசேரி உண்டியல்கள் மற்றும் பிணையங்களை வாங்குவதால் அமெரிக்க டாலருக்கு எதிரான ரூபாயின் உடனடி மாற்று விகிதம் 298.40 ஆக வலுவடைந்துள்ளது.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — வெளிநாட்டு முதலீட்டாளர்கள் உள்ளூர் திறைசேரி உண்டியல்கள் மற்றும் பிணையங்களை வாங்குவது அதிகரித்துள்ளதால், ரூபாயின் மதிப்பு டாலருக்கு எதிராக 298.40 ஆக வலுவடைவதை இலங்கை மத்திய வங்கி அனுமதித்துள்ளது.`
  },
  "sri-lanka-cb-allows-small-rupee-appreciation-foreigners-buy-bonds": {
    title: "வெளிநாட்டினர் உள்ளூர் பிணையங்களை வாங்குவதால் இலங்கை மத்திய வங்கி சிறிய ரூபாய் மதிப்புயர்வை அனுமதிக்கிறது",
    deck: "வெளிநாட்டு முதலீட்டு நிதிகள் திறைசேரி உண்டியல்கள் மற்றும் பிணையங்களை வாங்குவதால் அமெரிக்க டாலருக்கு எதிரான ரூபாயின் உடனடி மாற்று விகிதம் 298.40 ஆக வலுவடைந்துள்ளது.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ரூபாயின் மதிப்பு வலுவடைந்து வருகிறது.`
  },
  201: {
    title: "உள்நாட்டு கடன் மேம்படுத்தலைத் (DDO) தொடர்ந்து வர்த்தக வங்கிகள் மூலதனப் போதுமை உபரியைப் பதிவு செய்துள்ளன",
    deck: "இறையாண்மை பிணைய மறுசீரமைப்பு நிச்சயமற்ற தன்மைகள் நீங்குவதாலும், தனியார் துறை கடன் தேவை மீள்வதாலும் முதல் அடுக்கு மூலதன விகிதங்கள் (Tier-1) 14.8% ஐ தாண்டியுள்ளது.",
    category: "வங்கி",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — உள்நாட்டு கடன் மேம்படுத்தல் (DDO) திட்டம் வெற்றிகரமாக நிறைவடைந்ததைத் தொடர்ந்து, இலங்கையின் முன்னணி வணிக வங்கிகளின் மூலதனப் போதுமை விகிதங்கள் (CAR) தேவையான அளவை விட கணிசமாக உயர்ந்துள்ளன.`
  },
  "commercial-banks-record-capital-adequacy-surplus-ddo": {
    title: "உள்நாட்டு கடன் மேம்படுத்தலைத் (DDO) தொடர்ந்து வர்த்தக வங்கிகள் மூலதனப் போதுமை உபரியைப் பதிவு செய்துள்ளன",
    deck: "இறையாண்மை பிணைய மறுசீரமைப்பு நிச்சயமற்ற தன்மைகள் நீங்குவதாலும், தனியார் துறை கடன் தேவை மீள்வதாலும் முதல் அடுக்கு மூலதன விகிதங்கள் (Tier-1) 14.8% ஐ தாண்டியுள்ளது.",
    category: "வங்கி",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — வர்த்தக வங்கிகள் மூலதனப் போதுமை உபரியைப் பதிவு செய்துள்ளன.`
  },
  202: {
    title: "மத்திய கிழக்கு சந்தை தேவை அதிகரிப்பால் இலங்கை தேயிலை ஏற்றுமதி வருவாய் $1.4 பில்லியனைத் தாண்டியது",
    deck: "கொழும்பு தேயிலை ஏலத்தில் பாரம்பரிய கறுப்புத் தேயிலை ஒரு கிலோகிராம் சராசரியாக 3.80 டாலருக்கும் அதிகமான பிரீமியம் விலையைப் பேணுகிறது.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மத்திய கிழக்கு நாடுகளில் சிலோன் தேயிலைக்கான கேள்வி அதிகரித்துள்ளதால், வருடாந்த தேயிலை ஏற்றுமதி வருவாய் $1.4 பில்லியன் மைல்கல்லைத் தாண்டியுள்ளது என தேயிலை சபை தெரிவித்துள்ளது.`
  },
  "ceylon-tea-export-revenue-crosses-1-4-billion": {
    title: "மத்திய கிழக்கு சந்தை தேவை அதிகரிப்பால் இலங்கை தேயிலை ஏற்றுமதி வருவாய் $1.4 பில்லியனைத் தாண்டியது",
    deck: "கொழும்பு தேயிலை ஏலத்தில் பாரம்பரிய கறுப்புத் தேயிலை ஒரு கிலோகிராம் சராசரியாக 3.80 டாலருக்கும் அதிகமான பிரீமியம் விலையைப் பேணுகிறது.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — தேயிலை ஏற்றுமதி வருவாய் $1.4 பில்லியனைத் தாண்டியுள்ளது.`
  },
  203: {
    title: "EFF திட்டத்தின் கீழ் நான்காவது மதிப்பாய்வை IMF நிறைவு செய்தது; வருவாய் திரட்டல் மைல்கற்களுக்கு பாராட்டு",
    deck: "முதன்மை நிதி உபரி மொத்த உள்நாட்டு உற்பத்தியில் 2.3% ஐ எட்டியுள்ள நிலையில், $336 மில்லியன் நிதி விடுவிப்பிற்கு நிறைவேற்று குழு ஒப்புதல் அளித்துள்ளது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் பொருளாதார மீட்சித் திட்டத்தின் நான்காவது மதிப்பாய்வை சர்வதேச நாணய நிதியத்தின் நிர்வாகக் குழு உத்தியோகபூர்வமாக அங்கீகரித்துள்ளது.`
  },
  "imf-completes-fourth-review-eff-program": {
    title: "EFF திட்டத்தின் கீழ் நான்காவது மதிப்பாய்வை IMF நிறைவு செய்தது; வருவாய் திரட்டல் மைல்கற்களுக்கு பாராட்டு",
    deck: "முதன்மை நிதி உபரி மொத்த உள்நாட்டு உற்பத்தியில் 2.3% ஐ எட்டியுள்ள நிலையில், $336 மில்லியன் நிதி விடுவிப்பிற்கு நிறைவேற்று குழு ஒப்புதல் அளித்துள்ளது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — IMF நான்காவது மதிப்பாய்வை நிறைவு செய்துள்ளது.`
  },
  204: {
    title: "வலுவான வெளிநாட்டு நிகர முதலீடுகளால் கொழும்பு பங்குச் சந்தை ASPI குறியீடு 13,000 மைல்கல்லைத் தாண்டியது",
    deck: "வங்கி மற்றும் உற்பத்தித் துறை நிறுவனங்களின் பங்குகள் எழுச்சியடைய, தினசரி சந்தை புரள்வு சராசரியாக 3.8 பில்லியன் ரூபாயாகப் பதிவாகியுள்ளது.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — கொழும்பு பங்குச் சந்தையின் அனைத்து பங்கு விலைச் சுட்டி (ASPI) இன்று 13,000 புள்ளிகளைத் தாண்டி இரண்டு ஆண்டுகளில் இல்லாத புதிய உச்சத்தைப் பதிவு செய்துள்ளது.`
  },
  "colombo-stock-exchange-aspi-crosses-13000-milestone": {
    title: "வலுவான வெளிநாட்டு நிகர முதலீடுகளால் கொழும்பு பங்குச் சந்தை ASPI குறியீடு 13,000 மைல்கல்லைத் தாண்டியது",
    deck: "வங்கி மற்றும் உற்பத்தித் துறை நிறுவனங்களின் பங்குகள் எழுச்சியடைய, தினசரி சந்தை புரள்வு சராசரியாக 3.8 பில்லியன் ரூபாயாகப் பதிவாகியுள்ளது.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ASPI குறியீடு 13,000 புள்ளிகளைத் தாண்டியது.`
  },
  205: {
    title: "இரட்டை மாற்று விகிதங்களின் தவறான கருத்து: இலங்கையின் நாணய நிர்ணய சோதனைகளிலிருந்து படிப்பினைகள்",
    deck: "தன்னிச்சையான மாற்று விகிதக் கட்டுப்பாடுகள் எவ்வாறு கறுப்புச் சந்தைகளை உருவாக்கி ஏற்றுமதி விலை நிர்ணயத்தை சீர்குலைக்கின்றன என்பதற்கான ஆய்வு.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — செயற்கையான இரட்டை மாற்று விகிதக் கட்டுப்பாடுகள் மற்றும் இறக்குமதி வரம்புகள் எவ்வாறு சந்தைப் பொருளாதாரத்தை சீர்குலைத்தன என்பதை இந்நிகழ்வு ஆய்வு செய்கிறது.`
  },
  "fallacy-of-dual-exchange-rates-lessons-pegging": {
    title: "இரட்டை மாற்று விகிதங்களின் தவறான கருத்து: இலங்கையின் நாணய நிர்ணய சோதனைகளிலிருந்து படிப்பினைகள்",
    deck: "தன்னிச்சையான மாற்று விகிதக் கட்டுப்பாடுகள் எவ்வாறு கறுப்புச் சந்தைகளை உருவாக்கி ஏற்றுமதி விலை நிர்ணயத்தை சீர்குலைக்கின்றன என்பதற்கான ஆய்வு.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மாற்று விகிதங்கள் தொடர்பான விரிவான பார்வை.`
  },
  206: {
    title: "தொழிலாளர்களின் பணப்பரிமாற்றம் அதிகரிப்பால் மொத்த உத்தியோகபூர்வ வெளிநாட்டு கையிருப்பு $6.5 பில்லியனைத் தாண்டியது",
    deck: "முறையான வங்கி வழிகள் ஊடான தொழிலாளர்களின் பணப்பரிமாற்றம் மாதாந்தம் சராசரியாக $580 மில்லியனை எட்டி கொடுப்பனவு சமநிலையை வலுப்படுத்தியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் உத்தியோகபூர்வ வெளிநாட்டு கையிருப்பு (Gross Official Reserves) $6.5 பில்லியனைத் தாண்டியுள்ளது என மத்திய வங்கி உறுதிப்படுத்தியுள்ளது.`
  },
  "gross-official-reserves-surpass-6-5-billion": {
    title: "தொழிலாளர்களின் பணப்பரிமாற்றம் அதிகரிப்பால் மொத்த உத்தியோகபூர்வ வெளிநாட்டு கையிருப்பு $6.5 பில்லியனைத் தாண்டியது",
    deck: "முறையான வங்கி வழிகள் ஊடான தொழிலாளர்களின் பணப்பரிமாற்றம் மாதாந்தம் சராசரியாக $580 மில்லியனை எட்டி கொடுப்பனவு சமநிலையை வலுப்படுத்தியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — வெளிநாட்டு கையிருப்பு $6.5 பில்லியனைத் தாண்டியது.`
  },
  "why-classical-currency-boards-eliminate-bop-crises": {
    title: "பாரம்பரிய நாணய வாரியங்கள் ஏன் கொடுப்பனவு சமநிலை நெருக்கடிகளை ஒழிக்கின்றன: 1884 நாணய கட்டளைச் சட்டத்தின் ஆய்வு",
    deck: "1950 க்கு முன்னர் ஏழு தசாப்தங்களாக இலங்கை ரூபாயை நிலையாக வைத்திருந்த தானியங்கி இருப்பு ஆதரவு பொறிமுறையை ஆராய்கிறது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — 1884 நாணய கட்டளைச் சட்டத்தின் கீழ் நிறுவப்பட்ட இலங்கையின் நாணய வாரியம், கொடுப்பனவு சமநிலை நெருக்கடிகள் இன்றி நாணயத்தை எவ்வாறு பாதுகாத்தது என்பதற்கான வரலாற்று ஆய்வு.`
  },
  "it-bpm-sector-hits-1-7-billion-milestone": {
    title: "AI மற்றும் கிளவுட் தொழில்நுட்ப ஏற்றுமதி வளர்ச்சியுடன் இலங்கையின் IT & BPM துறை $1.7 பில்லியன் மைல்கல்லை எட்டியுள்ளது",
    deck: "உலகளாவிய நிதி மையங்கள் கொழும்பிற்கு பொறியியல் மையங்களை அமைப்பதால், SLASSCOM 200,000 உயர் வருமான டிஜிட்டல் தொழில்நுட்ப வேலைகளை இலக்காகக் கொண்டுள்ளது.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் IT & BPM துறையின் ஏற்றுமதி வருவாய் $1.7 பில்லியன் மைல்கல்லை எட்டியுள்ளது என SLASSCOM அறிவித்துள்ளது.`
  },
  "colombo-port-ect-phase-1-commissioned": {
    title: "கொழும்பு துறைமுக கிழக்கு கொள்கலன் முனையத்தின் முதல் கட்டம் திறக்கப்பட்டது: 1.2M TEU ஆழ்கடல் கொள்ளளவு சேர்க்கப்பட்டுள்ளது",
    deck: "மறுஏற்றுமதி அளவு 11% விரிவடைவதால் மிக பெரிய கொள்கலன் கப்பல்கள் (ULCV) கொழும்பு தெற்கு துறைமுகத்தில் நங்கூரமிடுகின்றன.",
    category: "வர்த்தகம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — கொழும்பு துறைமுகத்தின் கிழக்கு கொள்கலன் முனையத்தின் (ECT) முதல் கட்டம் உத்தியோகபூர்வமாக செயல்பாட்டுக்கு வந்துள்ளது.`
  },
  "cbsl-act-2023-institutional-review-fiscal-dominance": {
    title: "2023 ஆம் ஆண்டின் 16 ஆம் இலக்க இலங்கை மத்திய வங்கி சட்டம்: நிதி ஆதிக்கக் கட்டுப்பாடுகளின் நிறுவன மதிப்பாய்வு",
    deck: "திறைசேரி பற்றாக்குறைக்கு பண அச்சிடலை தடை செய்தமை எவ்வாறு இலங்கையின் பணவீக்க இலக்கு ஆட்சியை மாற்றியமைத்தது என்பது பற்றிய ஆய்வு.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — 2023 ஆம் ஆண்டின் 16 ஆம் இலக்க புதிய மத்திய வங்கி சட்டம் நிதி ஆதிக்கத்தை எவ்வாறு கட்டுப்படுத்தியது என்பதற்கான நிறுவன மதிப்பாய்வு.`
  },
  "inflation-tumbles-from-peak-to-target-range": {
    title: "பணவீக்கம் 70% உச்சத்திலிருந்து 2.4% இலக்கு வரம்பிற்கு சரிந்துள்ளது",
    deck: "கடுமையான நாணயக் கொள்கை மற்றும் நாணய உறுதிப்படுத்தல் விலை அழுத்தங்களை தணித்ததால் கொழும்பு நுகர்வோர் விலைக் குறியீடு (CCPI) இயல்பு நிலைக்குத் திரும்பியுள்ளது.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கையின் பணவீக்கம் 70% இலிருந்து 2.4% ஆக சரிவடைந்துள்ளது என தொகைமதிப்பு புள்ளிவிபரத் திணைக்களம் அறிவித்துள்ளது.`
  },
  401: {
    title: "இறையாண்மை கடன் தீர்வை மீட்டெடுக்க உள்நாட்டு கடன் மேம்படுத்தல் (DDO) தீர்மானத்தை பாராளுமன்றம் நிறைவேற்றியது",
    deck: "நான்கு நாள் விசேட சட்டப் பேரவை அமர்வைத் தொடர்ந்து ஓய்வூதிய நிதிகள் மற்றும் திறைசேரி பிணை மறுசீரமைப்பு அங்கீகரிக்கப்பட்டது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — கடன் நிலைத்தன்மையை மீட்டெடுப்பதற்காக அரசாங்கம் முன்வைத்த உள்நாட்டு கடன் மேம்படுத்தல் (DDO) திட்டம் பாராளுமன்றத்தில் நிறைவேற்றப்பட்டது.`
  },
  "parliament-passes-domestic-debt-optimization-ddo": {
    title: "இறையாண்மை கடன் தீர்வை மீட்டெடுக்க உள்நாட்டு கடன் மேம்படுத்தல் (DDO) தீர்மானத்தை பாராளுமன்றம் நிறைவேற்றியது",
    deck: "நான்கு நாள் விசேட சட்டப் பேரவை அமர்வைத் தொடர்ந்து ஓய்வூதிய நிதிகள் மற்றும் திறைசேரி பிணை மறுசீரமைப்பு அங்கீகரிக்கப்பட்டது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — DDO திட்டம் பாராளுமன்றத்தில் நிறைவேற்றப்பட்டது.`
  },
  402: {
    title: "ஜான் எக்ஸ்டரின் எச்சரிக்கையைப் புரிந்துகொள்வது: திறந்த சந்தை பண உட்செலுத்தல்கள் மற்றும் டாலர் வெளியேற்றங்களின் பொறிமுறை",
    deck: "விருப்பப்படி பணத்தை அச்சிடுவது நாணய உறுதியற்ற தன்மையைத் தூண்டும் என்று இலங்கை மத்திய வங்கியின் ஸ்தாபகர் 1949 இல் எச்சரித்தமை பற்றிய பார்வை.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கை மத்திய வங்கியின் முதல் ஆளுநர் ஜான் எக்ஸ்டர் 1949 இல் முன்வைத்த எச்சரிக்கைகள் மற்றும் சந்தை தலையீடுகள் பற்றிய பொருளாதார பார்வை.`
  },
  "understanding-john-exter-warning-mechanics-injections": {
    title: "ஜான் எக்ஸ்டரின் எச்சரிக்கையைப் புரிந்துகொள்வது: திறந்த சந்தை பண உட்செலுத்தல்கள் மற்றும் டாலர் வெளியேற்றங்களின் பொறிமுறை",
    deck: "விருப்பப்படி பணத்தை அச்சிடுவது நாணய உறுதியற்ற தன்மையைத் தூண்டும் என்று இலங்கை மத்திய வங்கியின் ஸ்தாபகர் 1949 இல் எச்சரித்தமை பற்றிய பார்வை.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — ஜான் எக்ஸ்டரின் நாணயக் கோட்பாடு பற்றிய பார்வை.`
  },
  403: {
    title: "இலங்கைக்கான $3.0 பில்லியன் 48 மாத விரிவுபடுத்தப்பட்ட நிதி வசதியை (EFF) சர்வதேச நாணய நிதியம் அங்கீகரித்தது",
    deck: "$333 மில்லியன் உடனடி விடுவிப்பு உலக வங்கி மற்றும் ஆசிய அபிவிருத்தி வங்கியின் பலதரப்பு நிதியுதவியை திறந்து விடுகிறது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — இலங்கைக்கான $3.0 பில்லியன் விரிவுபடுத்தப்பட்ட நிதி வசதியை (EFF) சர்வதேச நாணய நிதியத்தின் நிறைவேற்று குழு உத்தியோகபூர்வமாக அங்கீகரித்துள்ளது.`
  },
  "imf-approves-3-billion-eff-program-sri-lanka": {
    title: "இலங்கைக்கான $3.0 பில்லியன் 48 மாத விரிவுபடுத்தப்பட்ட நிதி வசதியை (EFF) சர்வதேச நாணய நிதியம் அங்கீகரித்தது",
    deck: "$333 மில்லியன் உடனடி விடுவிப்பு உலக வங்கி மற்றும் ஆசிய அபிவிருத்தி வங்கியின் பலதரப்பு நிதியுதவியை திறந்து விடுகிறது.",
    category: "கொள்கை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — IMF கடன் வசதிக்கு ஒப்புதல் அளித்துள்ளது.`
  },
  404: {
    title: "IMF ஒப்புதலைத் தொடர்ந்து திறைசேரி உண்டியல் வருவாய் 32% உச்சத்திலிருந்து 20% ஆக 1,200 அடிப்படை புள்ளிகள் குறைந்தது",
    deck: "முதன்மை விற்பனையாளர்களின் பணப்புழக்கம் சீரடைந்ததைத் தொடர்ந்து குறுகிய மற்றும் நடுத்தர கால பிணை சந்தையில் பாரிய எழுச்சி ஏற்பட்டுள்ளது.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — சர்வதேச நாணய நிதியத்தின் நிதி தொகுப்பு கிடைத்ததைத் தொடர்ந்து நாட்டின் இடர் குறைவடைந்து, திறைசேரி உண்டியல் வருமான விகிதங்கள் 1,200 அடிப்படை புள்ளிகளால் வீழ்ச்சியடைந்துள்ளன.`
  },
  "treasury-yields-drop-1200-bps-imf-approval": {
    title: "IMF ஒப்புதலைத் தொடர்ந்து திறைசேரி உண்டியல் வருவாய் 32% உச்சத்திலிருந்து 20% ஆக 1,200 அடிப்படை புள்ளிகள் குறைந்தது",
    deck: "முதன்மை விற்பனையாளர்களின் பணப்புழக்கம் சீரடைந்ததைத் தொடர்ந்து குறுகிய மற்றும் நடுத்தர கால பிணை சந்தையில் பாரிய எழுச்சி ஏற்பட்டுள்ளது.",
    category: "சந்தை",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — திறைசேரி உண்டியல் வருவாய் குறைந்துள்ளது.`
  },
  405: {
    title: "அரசுக்குச் சொந்தமான நிறுவனங்களின் (SOE) விலை சூத்திரங்கள் ஏன் தேசிய நாணயத்தைப் பாதுகாக்கின்றன",
    deck: "மின்சாரம் மற்றும் எரிபொருளுக்கான செலவுப் பிரதிபலிப்பு விலை நிர்ணயம் எவ்வாறு வரலாற்று ரீதியாக நாணய விரிவாக்கத்திற்கு வழிவகுத்த வங்கி கடன் வாங்குதலை நிறுத்துகிறது என்பதற்கான விளக்கம்.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — மின்சார சபை மற்றும் பெட்ரோலிய கூட்டுத்தாபனத்தின் இழப்புகளைத் தடுப்பதற்காக அறிமுகப்படுத்தப்பட்ட செலவுப் பிரதிபலிப்பு விலை சூத்திரங்கள் எவ்வாறு ரூபாயின் மதிப்பைப் பாதுகாக்கின்றன என்பதை இந்த ஆய்வுக் கட்டுரை விளக்குகிறது.`
  },
  "why-soe-price-formulas-protect-national-currency": {
    title: "அரசுக்குச் சொந்தமான நிறுவனங்களின் (SOE) விலை சூத்திரங்கள் ஏன் தேசிய நாணயத்தைப் பாதுகாக்கின்றன",
    deck: "மின்சாரம் மற்றும் எரிபொருளுக்கான செலவுப் பிரதிபலிப்பு விலை நிர்ணயம் எவ்வாறு வரலாற்று ரீதியாக நாணய விரிவாக்கத்திற்கு வழிவகுத்த வங்கி கடன் வாங்குதலை நிறுத்துகிறது என்பதற்கான விளக்கம்.",
    category: "பொருளாதாரம்",
    body: `கொழும்பு (லங்காஈகோன் செய்தி சேவை) — SOE விலை சூத்திரங்கள் பற்றிய பொருளாதார பார்வை.`
  },

};

// Automatic Real-Time Heuristic Body & Text Translator for Dynamic or Unmatched Stories
export function translateBodyText(text: string, lang: 'si' | 'ta'): string {
  if (!text) return '';
  if (lang !== 'si' && lang !== 'ta') return text;

  // Replacements dictionary for financial and economic terms, headings, prefixes
  const glossarySI: [RegExp, string][] = [
    [/COLOMBO \(LankaEcon Special Dispatch\) — LankaEcon News Desk/gi, 'කොළඹ (ලංකාඊකොන් විශේෂ වාර්තාව) — ලංකාඊකොන් පුවත් අංශය'],
    [/COLOMBO \(LankaEcon Subscriber Exclusive\) —/gi, 'කොළඹ (ලංකාඊකොන් ග්‍රාහක විශේෂ වාර්තාව) —'],
    [/COLOMBO \(LankaEcon\) —/gi, 'කොළඹ (ලංකාඊකොන් පුවත් සේවය) —'],
    [/By Disnaka/gi, 'දිස්නක විසිනි'],
    [/Central Bank of Sri Lanka/gi, 'ශ්‍රී ලංකා මහ බැංකුව'],
    [/Colombo Stock Exchange/gi, 'කොළඹ කොටස් වෙළෙඳපොළ'],
    [/Treasury bills/gi, 'භාණ්ඩාගාර බිල්පත්'],
    [/Treasury bill/gi, 'භාණ්ඩාගාර බිල්පත්'],
    [/foreign exchange/gi, 'විදේශ විනිමය'],
    [/interest rates/gi, 'පොලී අනුපාත'],
    [/interest rate/gi, 'පොලී අනුපාතිකය'],
    [/monetary policy/gi, 'මුදල් ප්‍රතිපත්තිය'],
    [/commercial banks/gi, 'වාණිජ බැංකු'],
    [/commercial bank/gi, 'වාණිජ බැංකුව'],
    [/private sector credit/gi, 'පෞද්ගලික අංශයේ ණය'],
    [/gross official reserves/gi, 'දළ නිල සංචිත'],
    [/reserves/gi, 'සංචිත'],
    [/inflation/gi, 'උද්ධමනය'],
    [/depreciation/gi, 'අවප්‍රමාණ වීම'],
    [/appreciation/gi, 'අධිප්‍රමාණ වීම'],
    [/liquidity/gi, 'ද්‍රවශීලතාව'],
    [/Standing Deposit Facility Rate \(SDFR\)/gi, 'ස්ථාවර තැන්පතු පහසුකම් අනුපාතිකය (SDFR)'],
    [/Standing Lending Facility Rate \(SLFR\)/gi, 'ස්ථාවර ණය පහසුකම් අනුපාතිකය (SLFR)'],
    [/International Monetary Fund/gi, 'ජාත්‍යන්තර මූල්‍ය අරමුදල'],
    [/All Share Price Index \(ASPI\)/gi, 'සියලු කොටස් මිල දර්ශකය (ASPI)'],
    [/Ceylon Tea/gi, 'ලංකා තේ'],
    [/Key Policy Takeaways/gi, 'ප්‍රධාන ප්‍රතිපත්තිමය කරුණු'],
    [/Why the Soft Peg Fails/gi, 'මෘදු විනිමය අනුපාතය අසාර්ථක වීමට හේතු'],
    [/Mercantilist Fallacy vs Macro Realities/gi, 'වෙළඳවාදී මිත්‍යාව සහ සාර්ව යථාර්ථය'],
    [/Comparative Framework/gi, 'සංසන්දනාත්මක විශ්ලේෂණය'],
    [/Synthesis for Policy Reformers/gi, 'ප්‍රතිපත්ති සම්පාදකයින් සඳහා පාඩම්'],
    [/Financial Sector Implications/gi, 'මූල්‍ය අංශයේ ප්‍රතිවිපාක'],
    [/Reserves and Exchange Rate Stability/gi, 'විදේශ සංචිත සහ විනිමය අනුපාත ස්ථාවරත්වය'],
    [/Key macroeconomic takeaways:/gi, 'ප්‍රධාන සාර්ව ආර්ථික දර්ශක:'],
  ];

  const glossaryTA: [RegExp, string][] = [
    [/COLOMBO \(LankaEcon Special Dispatch\) — LankaEcon News Desk/gi, 'கொழும்பு (லங்காஈகோன் சிறப்பு அறிக்கை) — லங்காஈகோன் செய்திப் பிரிவு'],
    [/COLOMBO \(LankaEcon Subscriber Exclusive\) —/gi, 'கொழும்பு (லங்காஈகோன் சந்தாதாரர் சிறப்பு அறிக்கை) —'],
    [/COLOMBO \(LankaEcon\) —/gi, 'கொழும்பு (லங்காஈகோன் செய்தி சேவை) —'],
    [/By Disnaka/gi, 'திஸ்னக'],
    [/Central Bank of Sri Lanka/gi, 'இலங்கை மத்திய வங்கி'],
    [/Colombo Stock Exchange/gi, 'கொழும்பு பங்குச் சந்தை'],
    [/Treasury bills/gi, 'பொக்கிஷ உண்டியல்கள்'],
    [/Treasury bill/gi, 'பொக்கிஷ உண்டியல்'],
    [/foreign exchange/gi, 'அந்நிய செலாவணி'],
    [/interest rates/gi, 'வட்டி விகிதங்கள்'],
    [/interest rate/gi, 'வட்டி விகிதம்'],
    [/monetary policy/gi, 'பணவியல் கொள்கை'],
    [/commercial banks/gi, 'வணிக வங்கிகள்'],
    [/commercial bank/gi, 'வணிக வங்கி'],
    [/private sector credit/gi, 'தனியார் துறை கடன்'],
    [/gross official reserves/gi, 'மொத்த உத்தியோகபூர்வ கையிருப்பு'],
    [/reserves/gi, 'கையிருப்புகள்'],
    [/inflation/gi, 'பணவீக்கம்'],
    [/depreciation/gi, 'மதிப்பிழப்பு'],
    [/appreciation/gi, 'மதிப்புயர்வு'],
    [/liquidity/gi, 'பணப்புழக்கம்'],
    [/Standing Deposit Facility Rate \(SDFR\)/gi, 'நிலையான வைப்பு வசதி விகிதம் (SDFR)'],
    [/Standing Lending Facility Rate \(SLFR\)/gi, 'நிலையான கடன் வசதி விகிதம் (SLFR)'],
    [/International Monetary Fund/gi, 'சர்வதேச நாணய நிதியம்'],
    [/All Share Price Index \(ASPI\)/gi, 'அனைத்து பங்கு விலைச்சுட்டி (ASPI)'],
    [/Ceylon Tea/gi, 'இலங்கை தேயிலை'],
    [/Key Policy Takeaways/gi, 'முக்கிய கொள்கை படிப்பினைகள்'],
    [/Why the Soft Peg Fails/gi, 'மென்மையான மாற்று விகிதம் ஏன் தோல்வியடைகிறது'],
    [/Mercantilist Fallacy vs Macro Realities/gi, 'வர்த்தகவாத மாயை மற்றும் மேக்ரோ யதார்த்தங்கள்'],
    [/Comparative Framework/gi, 'ஒப்பீட்டு கட்டமைப்பு'],
    [/Synthesis for Policy Reformers/gi, 'கொள்கை வகுப்பாளர்களுக்கான படிப்பினைகள்'],
    [/Financial Sector Implications/gi, 'நிதித்துறை தாக்கங்கள்'],
    [/Reserves and Exchange Rate Stability/gi, 'கையிருப்புகள் மற்றும் மாற்று விகித ஸ்திரத்தன்மை'],
    [/Key macroeconomic takeaways:/gi, 'முக்கிய மேக்ரோ பொருளாதார குறிகாட்டிகள்:'],
  ];

  const glossary = lang === 'si' ? glossarySI : glossaryTA;
  let translated = text;
  for (const [pattern, replacement] of glossary) {
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}

/**
 * Formats date stamps into authentic Sinhala or Tamil script, or uppercase English
 */
export function formatDateInLanguage(
  dateInput: string | number | Date | undefined,
  lang: 'en' | 'si' | 'ta' = 'en'
): string {
  if (!dateInput) {
    if (lang === 'si') return '2026 අගෝස්තු 21';
    if (lang === 'ta') return '2026 ஆகஸ்ட் 21';
    return 'AUGUST 21, 2026';
  }
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    if (lang === 'si') return '2026 අගෝස්තු 21';
    if (lang === 'ta') return '2026 ஆகஸ்ட் 21';
    return 'AUGUST 21, 2026';
  }

  const year = date.getFullYear();
  const day = date.getDate();
  const monthIdx = date.getMonth();

  if (lang === 'si') {
    const siMonths = [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
      'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
    ];
    return `${year} ${siMonths[monthIdx]} ${day}`;
  }

  if (lang === 'ta') {
    const taMonths = [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];
    return `${year} ${taMonths[monthIdx]} ${day}`;
  }

  const enMonths = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  return `${enMonths[monthIdx]} ${day}, ${year}`;
}

// In-memory runtime translation cache to avoid repetitive network calls
const runtimeTranslationCache: Record<string, { title: string; deck: string; body: string; primary_category: string }> = {};
const pendingTranslations = new Set<string>();

/**
 * Triggers background translation via server AI if an article lacks native translation
 */
export async function fetchArticleAiTranslation(article: any, lang: 'si' | 'ta'): Promise<void> {
  if (typeof window === 'undefined' || !article || !article.article_id) return;
  const cacheKey = `${article.article_id}_${lang}`;
  if (runtimeTranslationCache[cacheKey] || pendingTranslations.has(cacheKey)) return;

  // Check local storage first
  try {
    const stored = localStorage.getItem(`econmatrix_tr_${cacheKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.title) {
        runtimeTranslationCache[cacheKey] = parsed;
        return;
      }
    }
  } catch {}

  pendingTranslations.add(cacheKey);

  try {
    const res = await fetch('/api/translate-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: article.article_id,
        title: article.title,
        deck: article.deck,
        body: article.body,
        category: article.primary_category,
        targetLang: lang,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.translation) {
        runtimeTranslationCache[cacheKey] = data.translation;
        try {
          localStorage.setItem(`econmatrix_tr_${cacheKey}`, JSON.stringify(data.translation));
        } catch {}
        // Notify components that a refined translation is available
        window.dispatchEvent(
          new CustomEvent('econmatrix-article-translated', {
            detail: { article_id: article.article_id, lang, translation: data.translation },
          })
        );
      }
    }
  } catch {
    // Graceful fallback to dynamic translator
  } finally {
    pendingTranslations.delete(cacheKey);
  }
}

/**
 * High-performance deterministic Sri Lankan financial translation engine.
 * Converts ANY English headline, deck, or body into natural Sinhala or Tamil instantly (0ms latency).
 */
export function translateDynamicArticle(article: any, lang: 'si' | 'ta'): { title: string; deck: string; body: string; primary_category: string } {
  if (!article) {
    return { title: '', deck: '', body: '', primary_category: '' };
  }

  const siRules: [RegExp, string][] = [
    // Entities & Institutions
    [/\bCentral Bank of Sri Lanka\b/gi, 'ශ්‍රී ලංකා මහ බැංකුව'],
    [/\bCentral Bank\b/gi, 'මහ බැංකුව'],
    [/\bCBSL\b/g, 'මහ බැංකුව'],
    [/\bColombo Stock Exchange\b/gi, 'කොළඹ කොටස් වෙළෙඳපොළ'],
    [/\bCSE\b/g, 'කොළඹ කොටස් වෙළෙඳපොළ'],
    [/\bAll Share Price Index\b/gi, 'සියලු කොටස් මිල දර්ශකය'],
    [/\bASPI\b/g, 'සියලු කොටස් මිල දර්ශකය'],
    [/\bInternational Monetary Fund\b/gi, 'ජාත්‍යන්තර මූල්‍ය අරමුදල'],
    [/\bIMF\b/g, 'ජාත්‍යන්තර මූල්‍ය අරමුදල (IMF)'],
    [/\bWorld Bank\b/gi, 'ලෝක බැංකුව'],
    [/\bAsian Development Bank\b/gi, 'ආසියානු සංවර්ධන බැංකුව'],
    [/\bExport Development Board\b/gi, 'අපනයන සංවර්ධන මණ්ඩලය'],
    [/\bEDB\b/g, 'අපනයන සංවර්ධන මණ්ඩලය'],
    [/\bBoard of Investment\b/gi, 'ආයෝජන මණ්ඩලය'],
    [/\bBOI\b/g, 'ආයෝජන මණ්ඩලය'],
    [/\bMinistry of Finance\b/gi, 'මුදල් අමාත්‍යාංශය'],
    [/\bMinistry of Power and Energy\b/gi, 'විදුලිබල හා බලශක්ති අමාත්‍යාංශය'],
    [/\bCeylon Electricity Board\b/gi, 'ලංකා විදුලිබල මණ්ඩලය'],
    [/\bCEB\b/g, 'ලංකා විදුලිබල මණ්ඩලය'],
    [/\bCeylon Petroleum Corporation\b/gi, 'ලංකා ඛනිජ තෙල් නීතිගත සංස්ථාව'],
    [/\bCPC\b/g, 'ලංකා ඛනිජ තෙල් සංස්ථාව'],
    [/\bSri Lanka Telecom\b/gi, 'ශ්‍රී ලංකා ටෙලිකොම්'],
    [/\bHambantota International Port\b/gi, 'හම්බන්තොට ජාත්‍යන්තර වරාය'],
    [/\bPort City Colombo\b/gi, 'කොළඹ පෝට් සිටි'],
    [/\bColombo Port\b/gi, 'කොළඹ වරාය'],
    [/\bState Banks\b/gi, 'රාජ්‍ය බැංකු'],
    [/\bCommercial Banks\b/gi, 'වාණිජ බැංකු'],
    [/\bBank of Ceylon\b/gi, 'ලංකා බැංකුව'],
    [/\bPeople's Bank\b/gi, 'මහජන බැංකුව'],
    [/\bCommercial Bank\b/gi, 'කොමර්ෂල් බැංකුව'],
    [/\bHatton National Bank\b/gi, 'හැටන් නැෂනල් බැංකුව'],
    [/\bSampath Bank\b/gi, 'සම්පත් බැංකුව'],

    // Economic & Financial Concepts
    [/\bStaff-Level Agreement\b/gi, 'කාර්ය මණ්ඩල මට්ටමේ එකඟතාවය'],
    [/\bExtended Fund Facility\b/gi, 'විස්තීර්ණ ණය පහසුකම'],
    [/\bEFF\b/g, 'විස්තීර්ණ ණය පහසුකම'],
    [/\bPolicy Rates\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාත'],
    [/\bInterest Rates\b/gi, 'පොලී අනුපාත'],
    [/\bInterest Rate\b/gi, 'පොලී අනුපාතිකය'],
    [/\bTreasury Bills\b/gi, 'භාණ්ඩාගාර බිල්පත්'],
    [/\bTreasury Bill\b/gi, 'භාණ්ඩාගාර බිල්පත්'],
    [/\bTreasury Bonds\b/gi, 'භාණ්ඩාගාර බැඳුම්කර'],
    [/\bSovereign Bonds\b/gi, 'රාජ්‍ය ස්වෛරී බැඳුම්කර'],
    [/\bForeign Reserves\b/gi, 'විදේශ විනිමය සංචිත'],
    [/\bGross Official Reserves\b/gi, 'දළ නිල සංචිත'],
    [/\bInflation\b/gi, 'උද්ධමනය'],
    [/\bDeflation\b/gi, 'අවධමනය'],
    [/\bRupee Depreciation\b/gi, 'රුපියල අවප්‍රමාණ වීම'],
    [/\bRupee Appreciation\b/gi, 'රුපියල ශක්තිමත් වීම'],
    [/\bExchange Rate\b/gi, 'විනිමය අනුපාතිකය'],
    [/\bNon-Performing Loans\b/gi, 'අක්‍රිය ණය'],
    [/\bBad Loans\b/gi, 'අක්‍රිය ණය'],
    [/\bPrivate Sector Credit\b/gi, 'පෞද්ගලික අංශයේ ණය'],
    [/\bFiscal Deficit\b/gi, 'රාජ්‍ය මූල්‍ය හිඟය'],
    [/\bTrade Deficit\b/gi, 'වෙළඳ හිඟය'],
    [/\bPrimary Surplus\b/gi, 'ප්‍රාථමික අයවැය අතිරික්තය'],
    [/\bEconomic Growth\b/gi, 'ආර්ථික වර්ධනය'],
    [/\bDebt Restructuring\b/gi, 'ණය ප්‍රතිව්‍යුහගතකරණය'],
    [/\bTax Revenue\b/gi, 'බදු ආදායම'],
    [/\bRevenue Mobilization\b/gi, 'රාජ්‍ය ආදායම් එකතු කිරීම'],
    [/\bTourist Arrivals\b/gi, 'සංචාරක පැමිණීම්'],
    [/\bTourism Earnings\b/gi, 'සංචාරක ආදායම'],
    [/\bTea Exports\b/gi, 'තේ අපනයන'],
    [/\bApparel Exports\b/gi, 'ඇඟලුම් අපනයන'],
    [/\bRemittances\b/gi, 'විදේශ ප්‍රේෂණ'],
    [/\bWorker Remittances\b/gi, 'විදේශ රැකියා නියුක්තිකයින්ගේ ප්‍රේෂණ'],
    [/\bContainer Milestone\b/gi, 'බහාලුම් සන්ධිස්ථානය'],
    [/\bOffshore Oil Blocks\b/gi, 'මුහුදු තෙල් ගවේෂණ කලාප'],
    [/\bExploration\b/gi, 'ගවේෂණය'],
    [/\bRenewable Energy\b/gi, 'පුනර්ජනනීය බලශක්තිය'],

    // Common Headline Verbs & Terms
    [/\bSurpasses\b/gi, 'පසුකරයි'],
    [/\bCrosses\b/gi, 'ඉක්මවයි'],
    [/\bExceeds\b/gi, 'ඉක්මවා යයි'],
    [/\bJumps\b/gi, 'ඉහළ පනියි'],
    [/\bSurges\b/gi, 'ශීඝ්‍රයෙන් ඉහළ යයි'],
    [/\bReaches\b/gi, 'ළඟා වෙයි'],
    [/\bTouches\b/gi, 'ස්පර්ශ කරයි'],
    [/\bHits\b/gi, 'ළඟා වෙයි'],
    [/\bApproves\b/gi, 'අනුමත කරයි'],
    [/\bUnveils\b/gi, 'එළිදක්වයි'],
    [/\bLaunches\b/gi, 'ආරම්භ කරයි'],
    [/\bIntroduces\b/gi, 'හඳුන්වා දෙයි'],
    [/\bAffirms\b/gi, 'තහවුරු කරයි'],
    [/\bConfirms\b/gi, 'තහවුරු කරයි'],
    [/\bHolds\b/gi, 'නොවෙනස්ව තබා ගනී'],
    [/\bKeeps\b/gi, 'පවත්වාගෙන යයි'],
    [/\bDrops\b/gi, 'පහත වැටේ'],
    [/\bDeclines\b/gi, 'අඩු වේ'],
    [/\bSlows\b/gi, 'මන්දගාමී වේ'],
    [/\bEases\b/gi, 'පහළ යයි'],
    [/\bRecovers\b/gi, 'යථා තත්ත්වයට පත්වෙයි'],
    [/\bGains\b/gi, 'වර්ධනයක් ලබයි'],
    [/\bExpands\b/gi, 'පුළුල් වෙයි'],
    [/\bAhead of\b/gi, 'ඉදිරියේදී'],
    [/\bOn Track\b/gi, 'නිසි මගෙහි'],
    [/\bMilestone\b/gi, 'ඓතිහාසික සන්ධිස්ථානයක්'],
    [/\bBreakthrough\b/gi, 'සුවිශේෂී ඉදිරි පියවරක්'],
    [/\bReform Program\b/gi, 'ප්‍රතිසංස්කරණ වැඩසටහන'],
    [/\bTargets Met\b/gi, 'ඉලක්ක සපුරා ගනී'],
    [/\bSeventh Review\b/gi, 'හත්වන සමාලෝචනය'],
    [/\bSixth Review\b/gi, 'හයවන සමාලෝචනය'],
    [/\bFifth Review\b/gi, 'පස්වන සමාලෝචනය'],
    [/\bBillion\b/gi, 'බිලියන'],
    [/\bMillion\b/gi, 'මිලියන'],
    [/\bTrillion\b/gi, 'ට්‍රිලියන'],
    [/\bPercent\b/gi, 'ප්‍රතිශතයක්'],
    [/\bYoY\b/gi, 'වාර්ෂිකව'],
    [/\bMoM\b/gi, 'මාසිකව'],
  ];

  const taRules: [RegExp, string][] = [
    // Entities & Institutions
    [/\bCentral Bank of Sri Lanka\b/gi, 'இலங்கை மத்திய வங்கி'],
    [/\bCentral Bank\b/gi, 'மத்திய வங்கி'],
    [/\bCBSL\b/g, 'மத்திய வங்கி'],
    [/\bColombo Stock Exchange\b/gi, 'கொழும்பு பங்குச் சந்தை'],
    [/\bCSE\b/g, 'கொழும்பு பங்குச் சந்தை'],
    [/\bAll Share Price Index\b/gi, 'அனைத்து பங்கு விலைச்சுட்டி'],
    [/\bASPI\b/g, 'அனைத்து பங்கு விலைச்சுட்டி'],
    [/\bInternational Monetary Fund\b/gi, 'சர்வதேச நாணய நிதியம்'],
    [/\bIMF\b/g, 'சர்வதேச நாணய நிதியம் (IMF)'],
    [/\bWorld Bank\b/gi, 'உலக வங்கி'],
    [/\bAsian Development Bank\b/gi, 'ஆசிய வளர்ச்சி வங்கி'],
    [/\bExport Development Board\b/gi, 'ஏற்றுமதி அபிவிருத்தி சபை'],
    [/\bMinistry of Finance\b/gi, 'நிதி அமைச்சு'],
    [/\bMinistry of Power and Energy\b/gi, 'மின்சக்தி மற்றும் எரிசக்தி அமைச்சு'],
    [/\bCeylon Electricity Board\b/gi, 'இலங்கை மின்சார சபை'],
    [/\bCeylon Petroleum Corporation\b/gi, 'இலங்கை பெட்ரோலிய கூட்டுத்தாபனம்'],
    [/\bHambantota International Port\b/gi, 'ஹம்பாந்தோட்டை சர்வதேச துறைமுகம்'],
    [/\bPort City Colombo\b/gi, 'கொழும்பு போர்ட் சிட்டி'],
    [/\bColombo Port\b/gi, 'கொழும்பு துறைமுகம்'],
    [/\bState Banks\b/gi, 'அரசு வங்கிகள்'],
    [/\bCommercial Banks\b/gi, 'வணிக வங்கிகள்'],
    [/\bBank of Ceylon\b/gi, 'இலங்கை வங்கி'],
    [/\bPeople's Bank\b/gi, 'மக்கள் வங்கி'],
    [/\bCommercial Bank\b/gi, 'கொமர்ஷல் வங்கி'],
    [/\bHatton National Bank\b/gi, 'ஹட்டன் நெஷனல் வங்கி'],
    [/\bSampath Bank\b/gi, 'சம்பத் வங்கி'],

    // Economic & Financial Concepts
    [/\bStaff-Level Agreement\b/gi, 'பணியாளர் மட்ட உடன்பாடு'],
    [/\bExtended Fund Facility\b/gi, 'விரிவுபடுத்தப்பட்ட நிதி வசதி'],
    [/\bPolicy Rates\b/gi, 'கொள்கை வட்டி விகிதங்கள்'],
    [/\bInterest Rates\b/gi, 'வட்டி விகிதங்கள்'],
    [/\bTreasury Bills\b/gi, 'பொக்கிஷ உண்டியல்கள்'],
    [/\bTreasury Bonds\b/gi, 'இறையாண்மை பிணையங்கள்'],
    [/\bForeign Reserves\b/gi, 'வெளிநாட்டு கையிருப்பு'],
    [/\bGross Official Reserves\b/gi, 'மொத்த உத்தியோகபூர்வ கையிருப்பு'],
    [/\bInflation\b/gi, 'பணவீக்கம்'],
    [/\bRupee Depreciation\b/gi, 'ரூபாய் மதிப்பிழப்பு'],
    [/\bRupee Appreciation\b/gi, 'ரூபாய் மதிப்புயர்வு'],
    [/\bExchange Rate\b/gi, 'மாற்று விகிதம்'],
    [/\bNon-Performing Loans\b/gi, 'வாராக்கடன்கள்'],
    [/\bBad Loans\b/gi, 'வாராக்கடன்கள்'],
    [/\bPrivate Sector Credit\b/gi, 'தனியார் துறை கடன்'],
    [/\bFiscal Deficit\b/gi, 'நிதிப் பற்றாக்குறை'],
    [/\bTrade Deficit\b/gi, 'வர்த்தகப் பற்றாக்குறை'],
    [/\bPrimary Surplus\b/gi, 'முதன்மை உபரி'],
    [/\bEconomic Growth\b/gi, 'பொருளாதார வளர்ச்சி'],
    [/\bDebt Restructuring\b/gi, 'கடன் மறுசீரமைப்பு'],
    [/\bTax Revenue\b/gi, 'வரி வருவாய்'],
    [/\bTourist Arrivals\b/gi, 'சுற்றுலாப் பயணிகளின் வருகை'],
    [/\bTourism Earnings\b/gi, 'சுற்றுலா வருவாய்'],
    [/\bTea Exports\b/gi, 'தேயிலை ஏற்றுமதி'],
    [/\bApparel Exports\b/gi, 'ஆடை ஏற்றுமதி'],
    [/\bOffshore Oil Blocks\b/gi, 'கடல்சார் எண்ணெய் ஆய்வுப் பகுதிகள்'],
    [/\bRenewable Energy\b/gi, 'புதுப்பிக்கத்தக்க எரிசக்தி'],

    // Verbs & Numbers
    [/\bSurpasses\b/gi, 'தாண்டியது'],
    [/\bCrosses\b/gi, 'கடந்தது'],
    [/\bExceeds\b/gi, 'அதிகரித்தது'],
    [/\bSurges\b/gi, 'பாய்ச்சல் அடைந்தது'],
    [/\bReaches\b/gi, 'எட்டியது'],
    [/\bTouches\b/gi, 'தொட்டது'],
    [/\bApproves\b/gi, 'ஒப்புதல் அளித்தது'],
    [/\bUnveils\b/gi, 'வெளியிட்டது'],
    [/\bLaunches\b/gi, 'தொடங்கியது'],
    [/\bAffirms\b/gi, 'உறுதிப்படுத்தியது'],
    [/\bKeeps\b/gi, 'மாற்றமின்றி பராமரிக்கிறது'],
    [/\bDrops\b/gi, 'குறைந்தது'],
    [/\bRecovers\b/gi, 'மீட்சியடைந்தது'],
    [/\bMilestone\b/gi, 'மைல்கல்'],
    [/\bTargets Met\b/gi, 'இலக்குகளை எட்டியுள்ளது'],
    [/\bSeventh Review\b/gi, 'ஏழாவது மதிப்பாய்வு'],
    [/\bBillion\b/gi, 'பில்லியன்'],
    [/\bMillion\b/gi, 'மில்லியன்'],
    [/\bPercent\b/gi, 'சதவீதம்'],
  ];

  // High-performance deterministic Sri Lankan financial translation engine
  return translateFinancialArticle(article, lang);
}

// Master Article Translation Function: Guarantees title, deck, body, and category translation
export function translateArticleData(article: any, lang: string = 'en') {
  if (lang === 'en' || !article) return article;

  const targetLang = (lang === 'si' || lang === 'ta') ? lang : 'en';
  if (targetLang === 'en') return article;

  // 1. Direct dictionary match with comprehensive human-authored journalism body
  const dict = targetLang === 'si' ? articleDictSI : articleDictTA;
  let match = dict[article.article_id] || dict[String(article.article_id)];
  if (!match && article.slug) {
    match = dict[article.slug];
  }
  if (!match && article.title) {
    const tLower = article.title.toLowerCase();
    if (tLower.includes('ocean voyager')) {
      match = dict[1789115985835];
    } else if (tLower.includes('bad loans') || tLower.includes('state banks')) {
      match = dict[1789115913690];
    } else if (tLower.includes('hambantota') && (tLower.includes('container') || tLower.includes('milestone') || tLower.includes('million'))) {
      match = dict[1791095288704];
    } else if (tLower.includes('imf') && tLower.includes('85')) {
      match = dict[1791093001511];
    } else if (tLower.includes('imf') && (tLower.includes('seventh') || tLower.includes('staff-level'))) {
      match = dict[1791172245428];
    } else if (tLower.includes('oil blocks') || tLower.includes('mannar')) {
      match = dict[301];
    }
  }

  if (match) {
    return {
      ...article,
      title: match.title,
      deck: match.deck,
      body: match.body,
      primary_category: match.category ? match.category : translateCategory(article.primary_category, targetLang),
    };
  }

  // 2. Pre-existing article translations object on the model
  if (article.translations?.[targetLang]) {
    const tr = article.translations[targetLang];
    if (tr.title && tr.body) {
      return {
        ...article,
        title: tr.title,
        deck: tr.deck || tr.title,
        body: tr.body,
        primary_category: tr.primary_category ? tr.primary_category : translateCategory(article.primary_category, targetLang),
      };
    }
  }

  // 3. Runtime in-memory or localStorage cached AI translation
  const cacheKey = `${article.article_id}_${targetLang}`;
  if (runtimeTranslationCache[cacheKey]) {
    const cached = runtimeTranslationCache[cacheKey];
    return {
      ...article,
      title: cached.title,
      deck: cached.deck || cached.title,
      body: cached.body,
      primary_category: cached.primary_category ? cached.primary_category : translateCategory(article.primary_category, targetLang),
    };
  }

  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`econmatrix_tr_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.title) {
          runtimeTranslationCache[cacheKey] = parsed;
          return {
            ...article,
            title: parsed.title,
            deck: parsed.deck || parsed.title,
            body: parsed.body,
            primary_category: parsed.primary_category ? parsed.primary_category : translateCategory(article.primary_category, targetLang),
          };
        }
      }
    }
  } catch {}

  // 4. Trigger background translation enhancement
  fetchArticleAiTranslation(article, targetLang);

  // 5. Instantly return high-accuracy deterministic translated version (never raw English!)
  const dynamic = translateDynamicArticle(article, targetLang);
  return {
    ...article,
    title: dynamic.title || article.title,
    deck: dynamic.deck || article.deck,
    body: dynamic.body || article.body,
    primary_category: dynamic.primary_category,
  };
}