import { ScholarWriter, EconMediaContent, EconBook, EconScholarArticle, EconCourse } from '../types';
import { getRanulBookFullPages } from './ranulBookFullText';

export const INITIAL_SCHOLAR_WRITERS: ScholarWriter[] = [
  {
    id: 'writer-001',
    name: 'Prof. Sirimal Abeyratne',
    title: 'Professor of Economics & Senior Academic Chair',
    affiliation: 'University of Colombo',
    bio: 'Specialist in South Asian macroeconomic adjustment, international trade policy, and exchange rate dynamics.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    topics: ['International Trade', 'Macroeconomic Policy', 'Debt Restructuring'],
    publishedArticlesCount: 14,
    email: 'sirimal.abeyratne@cmb.ac.lk',
  },
  {
    id: 'writer-002',
    name: 'Dr. Dushni Weerakoon',
    title: 'Executive Director & Lead Macroeconomist',
    affiliation: 'Institute of Policy Studies (IPS)',
    bio: 'Renowned researcher on trade integration, fiscal sustainability, and structural economic reforms in Sri Lanka.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    topics: ['Trade Agreements', 'Fiscal Reform', 'Economic Growth'],
    publishedArticlesCount: 22,
    email: 'dushni@ips.lk',
  },
  {
    id: 'writer-003',
    name: 'Prof. Howard Nicholas',
    title: 'Associate Professor of Economics',
    affiliation: 'International Institute of Social Studies (ISS) / Erasmus',
    bio: 'Expert on global financial cycles, exchange rates, and monetary economics focusing on developing economies.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    topics: ['Monetary Economics', 'Exchange Rates', 'Financial Bubbles'],
    publishedArticlesCount: 18,
  }
];

export const INITIAL_ECON_MEDIA: EconMediaContent[] = [
  {
    id: 'media-001',
    title: 'Deconstructing Interest Rate Transmission in Developing Money Markets',
    type: 'podcast',
    category: 'macro',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80',
    speaker: 'Prof. Howard Nicholas & Dr. Nalin Bandara',
    duration: '28:45',
    viewsCount: 3420,
    description: 'An in-depth dialogue on how central bank policy rate adjustments permeate commercial bank lending yields and real economic activity.',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
  {
    id: 'media-002',
    title: 'The Mechanics of Sovereign Debt Restructuring Explained in 60 Seconds',
    type: 'short',
    category: 'macro',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    speaker: 'Econ Academy Explainer Desk',
    duration: '01:00',
    viewsCount: 12800,
    description: 'Understanding haircuts, net present value (NPV) reductions, and comparability of treatment in international debt negotiations.',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'media-003',
    title: 'Public Debt Dynamics & Fiscal Sustainability Models for Sri Lanka',
    type: 'lecture',
    category: 'policy',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    speaker: 'Dr. Dushni Weerakoon',
    duration: '45:10',
    viewsCount: 2150,
    description: 'University level lecture on primary fiscal surplus requirements, debt-to-GDP trajectories, and inflation dynamics.',
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  }
];

export const INITIAL_ECON_BOOKS: EconBook[] = [
  {
    id: 'book-ranul-001',
    title: "THE STORY BEHIND SRI LANKA'S TRAGIC MIS-FORTUNE",
    author: '',
    publishedYear: '2025',
    category: 'Central Banking & Monetary Policy',
    coverUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.cbsl.gov.lk',
    readOnlineUrl: 'https://www.cbsl.gov.lk',
    description: 'A Nation Held at Ransom by Its Own Central Bank. The full 207-page treatise analyzing central bank plumbing, Open Market Operations, the Impossible Trinity, Balance of Payments, and Sri Lanka\'s transition to the single Overnight Policy Rate (OPR).',
    pagesCount: 207,
    fileFormat: 'PDF',
    isFeatured: true,
    pages: getRanulBookFullPages(),
  },
  {
    id: 'book-class-001',
    title: 'An Inquiry into the Nature and Causes of the Wealth of Nations',
    author: 'Adam Smith',
    publishedYear: '1776',
    category: 'Classical Economics',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.gutenberg.org/ebooks/3300.pdf',
    readOnlineUrl: 'https://www.gutenberg.org/files/3300/3300-h/3300-h.htm',
    description: 'The foundational masterwork of classical economics establishing the division of labor, free market price mechanisms, capital accumulation, and invisible hand market coordination.',
    pagesCount: 950,
    fileFormat: 'PDF',
    isFeatured: true,
  },
  {
    id: 'book-class-002',
    title: 'Lombard Street: A Description of the Money Market',
    author: 'Walter Bagehot',
    publishedYear: '1873',
    category: 'Central Banking',
    coverUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.gutenberg.org/ebooks/2259.pdf',
    readOnlineUrl: 'https://www.gutenberg.org/files/2259/2259-h/2259-h.htm',
    description: 'The definitive classical treatise on Central Banking liquidity operations, establishing Bagehot’s Rule: lending freely at high interest rates against good collateral during financial panics.',
    pagesCount: 320,
    fileFormat: 'PDF',
    isFeatured: true,
  },
  {
    id: 'book-class-003',
    title: 'The General Theory of Employment, Interest and Money',
    author: 'John Maynard Keynes',
    publishedYear: '1936',
    category: 'Macroeconomics',
    coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.gutenberg.org/ebooks/1545.pdf',
    readOnlineUrl: 'https://www.gutenberg.org/files/1545/1545-h/1545-h.htm',
    description: 'The landmark work establishing modern macroeconomics, aggregate demand theory, liquidity preference, multiplier effects, and central bank monetary interventions.',
    pagesCount: 430,
    fileFormat: 'PDF',
    isFeatured: true,
  },
  {
    id: 'book-class-004',
    title: 'Principles of Political Economy and Taxation',
    author: 'David Ricardo',
    publishedYear: '1817',
    category: 'Classical Economics',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.gutenberg.org/ebooks/33310.pdf',
    readOnlineUrl: 'https://www.gutenberg.org/files/33310/33310-h/33310-h.htm',
    description: 'The landmark formulation of the theory of comparative advantage in international trade, differential rent theory, and tariff incidence.',
    pagesCount: 350,
    fileFormat: 'PDF',
    isFeatured: true,
  },
  {
    id: 'book-class-005',
    title: '75 Years of Central Banking & Monetary Stance in Sri Lanka',
    author: 'Central Bank of Sri Lanka (CBSL)',
    publishedYear: '2025',
    category: 'Central Banking',
    coverUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.cbsl.gov.lk',
    readOnlineUrl: 'https://www.cbsl.gov.lk',
    description: 'Official historical treatise detailing the evolution of the Central Bank of Sri Lanka, currency board transitions, inflation targeting frameworks, and exchange rate stabilization.',
    pagesCount: 520,
    fileFormat: 'PDF',
    isFeatured: true,
  },
  {
    id: 'book-001',
    title: 'Principles of Macroeconomics & Monetary Policy in South Asia',
    author: 'Prof. Sirimal Abeyratne',
    publishedYear: '2024',
    category: 'Macroeconomics',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.gutenberg.org',
    readOnlineUrl: 'https://www.gutenberg.org',
    description: 'A comprehensive academic textbook analyzing exchange rate regimes, central bank inflation targeting, and external balance mechanisms in Sri Lanka and regional economies.',
    pagesCount: 380,
    fileFormat: 'PDF',
    isFeatured: false,
  },
  {
    id: 'book-002',
    title: 'An Introduction to International Trade & Tariff Analytics',
    author: 'Dr. Dushni Weerakoon',
    publishedYear: '2023',
    category: 'International Trade',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    downloadUrl: 'https://www.gutenberg.org',
    readOnlineUrl: 'https://www.gutenberg.org',
    description: 'Foundational guide covering comparative advantage, non-tariff barriers, bilateral free trade agreements, and global value chain integration.',
    pagesCount: 290,
    fileFormat: 'PDF',
    isFeatured: false,
  }
];

export const INITIAL_SCHOLAR_ARTICLES: EconScholarArticle[] = [
  {
    id: 'article-schol-001',
    title: 'Exchange Rate Overshooting & The Purchasing Power Parity Paradox in Island Economies',
    authorName: 'Prof. Sirimal Abeyratne',
    authorTitle: 'Senior Macroeconomics Fellow & Professor of Economics',
    authorAffiliation: 'University of Colombo Faculty of Economics',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Monetary Economics & Exchange Rates',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    summary: 'An empirical examination of short-term currency volatility against long-term inflation differentials and central bank market liquidity interventions in small open island economies.',
    content: `Abstract: Short-term exchange rate adjustments in open developing economies frequently deviate from traditional Purchasing Power Parity (PPP) equilibrium models due to sticky price adjustments, capital flow shocks, and central bank foreign exchange reserve interventions.

1. Executive Overview & Theoretical Background
The dynamics of floating exchange rate regimes in South Asia present complex theoretical and policy challenges. When central bank policy interest rates are adjusted, foreign exchange markets absorb capital flow expectations long before domestic goods market price levels adjust.

2. The Dornbusch Overshooting Framework
In the short run, nominal exchange rates move beyond their long-run equilibrium level in response to monetary policy shocks. This overshooting phenomenon explains why currency depreciations in small open island economies often trigger temporary real exchange rate misalignments before equilibrium is re-established.

3. Empirical Findings & Central Bank Liquidity Implications
Data spanning 2015–2025 demonstrates that unhedged commercial bank FX swap positions exacerbate speculative overshooting. When the Standing Deposit Facility Rate (SDFR) is held below market expectations, private sector capital flight accelerates nominal exchange rate depreciation.

4. Policy Recommendations
• Establish automated central bank foreign exchange auction corridors to absorb panic liquidity.
• Maintain market-determined interest rate spreads to anchor inflation expectations.
• Enhance gross official foreign reserve adequacy to at least 4.5 months of import cover.`,
    readingTimeMinutes: 8,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    keyTakeaways: [
      'Short-term currency swings are driven by financial expectations rather than immediate trade balances.',
      'Sticky prices in domestic goods markets create temporary real exchange rate misalignments.',
      'Central bank reserve buffers reduce speculative overshoot volatility.'
    ],
    viewsCount: 1420,
  },
  {
    id: 'article-schol-002',
    title: 'Sovereign Debt Restructuring & Comparability of Treatment: Lessons for Sri Lanka',
    authorName: 'Dr. Dushni Weerakoon',
    authorTitle: 'Executive Director & Lead Macroeconomist',
    authorAffiliation: 'Institute of Policy Studies (IPS) & CBSL Research Advisory',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    category: 'Sovereign Debt & Restructuring',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    summary: 'Analyzing haircut parameters, net present value (NPV) debt reductions, official bilateral creditor coordination, and macro-linked bond mechanisms in sovereign debt workouts.',
    content: `Abstract: Sovereign debt workouts under the G20 Common Framework require delicate alignment between official bilateral creditors (Paris Club and non-Paris Club) and private international bondholders (ISBs).

1. Introduction
Sri Lanka's 2022 sovereign debt default marked a watershed moment for middle-income developing nations navigating complex multi-creditor debt restructuring.

2. Comparability of Treatment (CoT) Mechanism
The principle of Comparability of Treatment ensures no creditor group receives preferential financial terms. Calculating Net Present Value (NPV) reductions across varied debt instruments—such as official bilateral loans, commercial bank credits, and sovereign Eurobonds—requires standardized discount rate benchmarks.

3. Macro-Linked Bonds (MLBs) & State-Contingent Payouts
The inclusion of Macro-Linked Bonds ties debt service obligations directly to real GDP growth trajectories. If real GDP exceeds baseline IMF targets, bondholders receive upside coupon adjustments; conversely, downside economic shocks trigger debt service relief.

4. Conclusion & Fiscal Policy Imperatives
Maintaining primary fiscal surpluses above 2.3% of GDP is indispensable to anchor debt-to-GDP ratios below 95% over the medium term.`,
    readingTimeMinutes: 10,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    keyTakeaways: [
      'Comparability of Treatment prevents free-riding by commercial Eurobond holders.',
      'Macro-Linked Bonds align debt service obligations with national economic growth capacity.',
      'Primary fiscal surplus targets are essential to achieve debt sustainability parameters.'
    ],
    viewsCount: 2180,
  },
  {
    id: 'article-schol-003',
    title: 'Anatomy of Inflation Transmission: Supply-Side Shocks vs Monetary Expansion',
    authorName: 'Prof. Howard Nicholas',
    authorTitle: 'Associate Professor of Monetary Economics',
    authorAffiliation: 'International Institute of Social Studies & LankaEcon Fellow',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    category: 'Monetary Policy & Inflation',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    summary: 'Deconstructing consumer price index surges: distinguishing between cost-push energy import shocks and monetized budget deficit expansion in Sri Lanka.',
    content: `Abstract: Disentangling supply-side import cost shocks from demand-side monetary expansion is critical for central bank policy interest rate calibration.

1. Theoretical Framework
Milton Friedman’s classic dictum that 'inflation is always and everywhere a monetary phenomenon' must be qualified in small open island economies dependent on imported food, fuel, and fertilizer.

2. Monetary Transmission vs Energy Price Spikes
Empirical impulse response functions demonstrate that currency depreciation and global oil price surges account for 60% of short-term CPI inflation spikes, while net domestic assets (NDA) expansion of the central bank fuels sustained medium-term core inflation.

3. Central Bank Independence & Monetary Board Governance
The Central Bank of Sri Lanka (CBSL) Act No. 16 of 2023 legally prohibits direct primary market monetary financing (money printing) for government budget deficits, establishing flexible inflation targeting (FIT) as the sole legal mandate.

4. Policy Recommendations
• Target core inflation within the 3%–5% corridor via the Standing Deposit Facility Rate.
• Strengthen domestic supply chain resilience to buffer external food and energy price shocks.`,
    readingTimeMinutes: 9,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 18).toISOString(),
    keyTakeaways: [
      'Supply shocks trigger immediate price level shifts, whereas monetary expansion drives sustained inflation trends.',
      'Legal prohibition of deficit monetization is pivotal for central bank credibility.',
      'Flexible Inflation Targeting (FIT) anchors long-term inflation expectations.'
    ],
    viewsCount: 1890,
  }
];

export const INITIAL_ECON_COURSES: EconCourse[] = [
  {
    id: 'course-001',
    title: 'Macroeconomic Analysis & Central Banking Masterclass',
    instructor: 'Prof. Sirimal Abeyratne',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    affiliation: 'University of Colombo',
    category: 'macro',
    level: 'Advanced / University Level',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive 4-module video course exploring central banking policy frameworks, inflation targeting, interest rate corridors, and balance of payment accounts.',
    lessons: [
      {
        id: 'lesson-101',
        title: 'Module 1: Money Supply, SDFR/SLFR Policy Corridors & Liquidity',
        duration: '35:20',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Understanding how open market operations (OMO) regulate liquidity and commercial bank lending rates.',
      },
      {
        id: 'lesson-102',
        title: 'Module 2: Balance of Payments (BOP) Accounting & Foreign Reserves',
        duration: '42:10',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'Deconstructing current account, capital account, and financial account flows.',
      }
    ],
    created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
  },
  {
    id: 'course-adam-smith',
    title: 'Adam Smith: Of Money Considered as a Particular Branch of the General Stock of the Society',
    instructor: 'Adam Smith (1723–1790)',
    instructorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    affiliation: 'Wealth of Nations (1776) — Book II, Chapter II',
    category: 'classical_monetary',
    level: 'Classical Masterpiece / Full Unabridged Treatise',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    description: 'The complete, unabridged Chapter 2 from Book II of Wealth of Nations: "Of Money Considered as a Particular Branch of the General Stock of the Society, or of the Expence of Maintaining the National Capital". Explores gold/silver species, paper currency, circulating vs fixed capital, and bank credit.',
    lessons: [
      {
        id: 'smith-full-text',
        title: 'Full Unabridged Chapter: Of Money & Maintenance of National Capital',
        duration: 'Reading Time: ~45 mins',
        videoUrl: '',
        embedUrl: '',
        description: 'Complete original 1776 text by Adam Smith with interactive policy notes.',
      }
    ],
    created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  }
];
