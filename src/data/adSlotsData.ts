import { AdSlotLocation, AdSlotPricing } from '../types';

export interface AdSlotSpecification extends AdSlotPricing {
  slotLocation: AdSlotLocation;
  displayName: string;
  pagePositionDescription: string;
  exactPlacementHierarchy: string;
  recommendedDimensions: string;
  aspectRatio: string;
  allowedFormats: string[];
  maxFileSize: string;
  supportedFileTypes: string;
  targetAudience: string;
  idealAdvertisers: string;
  isAvailable: boolean;
  wireframeColor: string;
  wireframeCoordinates: {
    column: 'header' | 'center' | 'right';
    order: number;
  };
}

export const LANKAECON_AD_SLOTS: AdSlotSpecification[] = [
  {
    slotLocation: 'header_banner',
    displayName: 'Masthead Header Super-Leaderboard',
    title: 'Top Header Super-Leaderboard Banner',
    description: 'Topmost banner strip spanning above the publication masthead, navigation bar, and date line. Displays across all pages.',
    pagePositionDescription: 'Fixed at the top of the publication, directly above the LankaEcon masthead and market ticker bar.',
    exactPlacementHierarchy: 'Section 1: Header / Top Navigation Bar (Full Width Top)',
    recommendedDimensions: '970 x 90 px (Desktop) / 728 x 90 px (Tablet) / 320 x 50 px (Mobile)',
    aspectRatio: '10.7 : 1 (Leaderboard Strip)',
    allowedFormats: ['Full Graphic Banner Poster', 'High-Res Creative Strip', 'Responsive HTML5 / GIF'],
    maxFileSize: '5 MB',
    supportedFileTypes: 'PNG, JPG, WebP, SVG, GIF',
    priceLKR: 60000,
    priceUSD: 200,
    durationDays: 30,
    estimatedImpressions: '180,000+ views / month (100% Page Reach)',
    targetAudience: 'Top Executives, Foreign Investors, Policy Makers & Institutional Readers',
    idealAdvertisers: 'Tier-1 Commercial Banks, Blue-Chip Conglomerates, Airlines, National Telecoms',
    format: '970x90 Super Leaderboard / Responsive Banner',
    isAvailable: true,
    wireframeColor: '#0B1E36',
    wireframeCoordinates: {
      column: 'header',
      order: 1,
    },
  },
  {
    slotLocation: 'hero_top_updates',
    displayName: 'Top Hero Macroeconomic Updates Billboard',
    title: 'Top Financial Updates Banner (Below Main Hero)',
    description: 'Prime center headline position located immediately below the primary breaking macroeconomic news alert and above the lead story.',
    pagePositionDescription: 'Homepage centerpiece beneath the Breaking Updates ribbon and above the Lead Editorial story.',
    exactPlacementHierarchy: 'Section 2: Center Column - Upper Tier (Directly Beneath Breaking News Alert)',
    recommendedDimensions: '728 x 90 px (Standard Banner) / 970 x 250 px (Billboard Mode)',
    aspectRatio: '8.1 : 1 (Horizontal Billboard)',
    allowedFormats: ['Full Graphic Banner Poster', 'Structured Editorial Card with CTA Button'],
    maxFileSize: '5 MB',
    supportedFileTypes: 'PNG, JPG, WebP, SVG',
    priceLKR: 45000,
    priceUSD: 150,
    durationDays: 30,
    estimatedImpressions: '120,000+ views / month (High CTR Zone)',
    targetAudience: 'Macroeconomic Analysts, C-Suite Leaders, Treasury Officers',
    idealAdvertisers: 'Asset Management Firms, Mutual Funds, Real Estate Developers, Corporate Banks',
    format: 'Sponsored Card + Headline + Tagline / Graphic Banner',
    isAvailable: true,
    wireframeColor: '#0284C7',
    wireframeCoordinates: {
      column: 'center',
      order: 2,
    },
  },
  {
    slotLocation: 'sidebar_top',
    displayName: 'Top Sidebar Featured Premium Billboard',
    title: 'Top Sidebar Featured Premium Billboard',
    description: 'Prominent right-column upper placement sitting right at eye-level above the live Colombo Stock Exchange (CSE) market tickers.',
    pagePositionDescription: 'Right-hand sidebar topmost slot, positioned above CSE Live Market Indices & Currency Benchmarks.',
    exactPlacementHierarchy: 'Section 3: Right Sidebar - Slot #1 (Top Anchor Position above CSE Market Watch)',
    recommendedDimensions: '300 x 250 px (Standard Rectangle) / 300 x 350 px (Vertical Billboard)',
    aspectRatio: '1.2 : 1 to 1 : 1 (Rectangle / Square)',
    allowedFormats: ['Full Graphic Creative Poster (Edge-to-Edge)', 'Structured Executive Card with Category Badge & Phone CTA'],
    maxFileSize: '5 MB',
    supportedFileTypes: 'PNG, JPG, WebP',
    priceLKR: 50000,
    priceUSD: 170,
    durationDays: 30,
    estimatedImpressions: '110,000+ views / month (Persistent Right Rail)',
    targetAudience: 'Equity Traders, High-Net-Worth Individuals, Fund Managers',
    idealAdvertisers: 'Stock Brokerages, Private Wealth, Investment Banking, Luxury Auto & Watchmakers',
    format: '300x250 Medium Rectangle / 300x350 Poster',
    isAvailable: true,
    wireframeColor: '#DC2626',
    wireframeCoordinates: {
      column: 'right',
      order: 1,
    },
  },
  {
    slotLocation: 'feed_inline_1',
    displayName: 'Newsroom Feed Inline Slot 1 — Medium Rectangle (MPU)',
    title: 'Newsroom Feed Inline Slot 1 (Mid-Stream MPU Box)',
    description: 'Medium Rectangle (MPU) embedded into the editorial news stream between top story clusters. Maximum advertiser demand and multi-column readability.',
    pagePositionDescription: 'Center news grid stream, positioned natively between Article #4 and Article #5 (Mid-Page In-Feed MPU 300 × 250 px).',
    exactPlacementHierarchy: 'Section 4: Center Column - Mid-Feed Tier (In-Feed MPU Placement #1)',
    recommendedDimensions: '300 × 250 px (Medium Rectangle / MPU)',
    aspectRatio: '6 : 5 (Medium Rectangle MPU)',
    allowedFormats: ['Interactive Editorial Sponsor Card with Direct Action CTA', 'Full Graphic Banner (300 × 250 px)'],
    maxFileSize: '5 MB',
    supportedFileTypes: 'PNG, JPG, WebP',
    priceLKR: 35000,
    priceUSD: 120,
    durationDays: 30,
    estimatedImpressions: '95,000+ views / month (Native Article Feed #1)',
    targetAudience: 'Active Newspaper Readers, Business Owners, Corporate Professionals',
    idealAdvertisers: 'Maximum advertiser demand, standard feed cards, multi-column desktop & mobile layouts',
    format: 'Medium Rectangle (MPU) 300 × 250 px (6:5)',
    isAvailable: true,
    wireframeColor: '#059669',
    wireframeCoordinates: {
      column: 'center',
      order: 3,
    },
  },
  {
    slotLocation: 'feed_inline_2',
    displayName: 'Newsroom Feed Inline Slot 2 — Medium Rectangle (MPU)',
    title: 'Newsroom Feed Inline Slot 2 (Bottom-Stream MPU Box)',
    description: 'Medium Rectangle (MPU) embedded natively at the bottom of the news stream above "Click For All Stories", capturing high-intent readers.',
    pagePositionDescription: 'Center news grid stream, positioned natively below Secondary Stories and above "Click For All Stories" (Bottom-Page In-Feed MPU 300 × 250 px).',
    exactPlacementHierarchy: 'Section 5: Center Column - Bottom-Feed Tier (In-Feed MPU Placement #2)',
    recommendedDimensions: '300 × 250 px (Medium Rectangle / MPU)',
    aspectRatio: '6 : 5 (Medium Rectangle MPU)',
    allowedFormats: ['Interactive Editorial Sponsor Card with Direct Action CTA', 'Full Graphic Banner (300 × 250 px)'],
    maxFileSize: '5 MB',
    supportedFileTypes: 'PNG, JPG, WebP',
    priceLKR: 35000,
    priceUSD: 120,
    durationDays: 30,
    estimatedImpressions: '85,000+ views / month (Native Article Feed #2)',
    targetAudience: 'Deep-Reading Executives, Market Analysts, High-Engagement Readers',
    idealAdvertisers: 'Maximum advertiser demand, standard feed cards, multi-column desktop & mobile layouts',
    format: 'Medium Rectangle (MPU) 300 × 250 px (6:5)',
    isAvailable: true,
    wireframeColor: '#0D9488',
    wireframeCoordinates: {
      column: 'center',
      order: 4,
    },
  },
  {
    slotLocation: 'sidebar_widget',
    displayName: 'Market Intelligence Lower Sidebar Widget',
    title: 'Market Intelligence Lower Sidebar Widget',
    description: 'Right-column lower strategic unit positioned beneath the Central Bank Economic Indicators and Market Watch summary.',
    pagePositionDescription: 'Right-hand sidebar lower slot, beneath CBSL Monthly Indicators and Market Indices.',
    exactPlacementHierarchy: 'Section 6: Right Sidebar - Slot #2 (Lower Strategic Position beneath CBSL Data)',
    recommendedDimensions: '300 x 250 px (Standard Box) / 300 x 280 px (Card Unit)',
    aspectRatio: '1.2 : 1 (Card Rectangle)',
    allowedFormats: ['Structured Editorial Card with Phone/WhatsApp CTA', 'Compact Graphic Poster'],
    maxFileSize: '5 MB',
    supportedFileTypes: 'PNG, JPG, WebP',
    priceLKR: 30000,
    priceUSD: 100,
    durationDays: 30,
    estimatedImpressions: '75,000+ views / month',
    targetAudience: 'SME Founders, Trade Specialists, Academic Researchers',
    idealAdvertisers: 'SME Trade Desks, Commodity Brokers, Education & Professional Diplomas, Healthcare',
    format: 'Sidebar Box + Direct Inquire Link',
    isAvailable: true,
    wireframeColor: '#7C3AED',
    wireframeCoordinates: {
      column: 'right',
      order: 2,
    },
  },
];
