export interface TreasuryYieldData {
  tenor: string;
  code: string;
  yieldPercent: number;
  changeBps: number;
  auctionDate: string;
}

export interface ForexRateData {
  currency: string;
  code: string;
  openingRate: number;
  closingRate: number;
  changePercent: number;
  updatedAt: string;
}

export interface EconomyNextMarketData {
  source: string;
  updatedAt: string;
  treasuryYields: TreasuryYieldData[];
  forexRates: ForexRateData[];
  policyRates: {
    sdfr: number;
    slfr: number;
    srr: number;
  };
}

export interface Author {
  author_id: number;
  first_name: string;
  last_name: string;
  slug: string;
  email: string;
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface TuitionReceipt {
  receiptNumber: string;
  enrollmentId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  instructorName: string;
  tuitionFeeLKR: number;
  instructorShareLKR: number;
  platformShareLKR: number;
  paymentMethod: string;
  issuedAt: string;
  status: string;
  certificateCode: string;
}

export interface ArticleTranslation {
  title: string;
  deck: string;
  body: string;
  primary_category: string;
}

export interface ArticleTranslations {
  si?: ArticleTranslation;
  ta?: ArticleTranslation;
}

export interface StoryInlineImage {
  type: 'single' | 'side-by-side';
  url?: string;
  caption?: string;
  alt?: string;
  image1?: { url: string; caption?: string; alt?: string };
  image2?: { url: string; caption?: string; alt?: string };
  overallCaption?: string;
  position?: number;
}

export interface Article {
  article_id: number;
  title: string;
  slug: string;
  deck: string;
  body: string;
  primary_category: string;
  translations?: ArticleTranslations;
  status: string;
  is_lead_story?: boolean;
  is_breaking?: boolean;
  is_featured?: boolean;
  featured_image_url?: string;
  image_caption?: string;
  reading_time_minutes: number;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  published_at: string;
  created_at: string;
  authors: Author[];
  is_subscription_only?: boolean;
  is_premium?: boolean;
  likes_count?: number;
  placement?: 'standard' | 'notable' | 'spotlight' | 'lead';
  notable_position?: 'left' | 'right' | 'none';
  is_notable?: boolean;
  is_spotlight?: boolean;
  inline_images?: StoryInlineImage[];
  gallery?: string[];
  last_edited_by?: string;
  last_edited_at?: string;
}

export interface StockTicker {
  ticker_id: number;
  symbol: string;
  company_name: string;
  exchange: string;
  last_price: number;
  price_change: number;
  percentage_change: number;
  day_high?: number;
  day_low?: number;
  volume: number;
  is_active: boolean;
  last_updated: string;
  category?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: string;
  caption?: string;
  alt_text?: string;
  tags: string[];
  dimensions?: string;
  file_size?: string;
  uploaded_at: string;
  source?: string;
  data_url?: string;
  is_uploaded?: boolean;
}

export interface ScholarWriter {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  bio: string;
  avatarUrl: string;
  topics: string[];
  publishedArticlesCount: number;
  email?: string;
  websiteUrl?: string;
}

export interface EconMediaContent {
  id: string;
  title: string;
  type: 'podcast' | 'short' | 'lecture' | 'webinar';
  category: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  speaker: string;
  duration: string;
  viewsCount: number;
  description: string;
  created_at: string;
}

export interface BookPage {
  pageNumber: number;
  chapterTitle: string;
  content: string;
  partTitle?: string;
  keyFormula?: string;
  diagramTitle?: string;
  diagramUrl?: string;
  diagramCaption?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
    caption?: string;
  };
}

export interface EconBook {
  id: string;
  title: string;
  author: string;
  publishedYear: string;
  category: string;
  coverUrl: string;
  downloadUrl: string;
  readOnlineUrl: string;
  flipHtml5Url?: string;
  googleDocUrl?: string;
  description: string;
  pagesCount: number;
  fileFormat: string;
  isFeatured?: boolean;
  priceLKR?: number;
  isPaidBook?: boolean;
  allowDownload?: boolean;
  pages?: BookPage[];
  fullRawText?: string;
}

export interface EconScholarArticle {
  id: string;
  title: string;
  authorName: string;
  authorTitle: string;
  authorAffiliation: string;
  authorAvatar: string;
  category: string;
  summary: string;
  content: string;
  googleDocUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  readingTimeMinutes: number;
  publishedAt: string;
  keyTakeaways: string[];
  viewsCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  embedUrl: string;
  googleDocUrl?: string;
  description: string;
}

export interface EconCourse {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  affiliation: string;
  category: string;
  level: string;
  thumbnailUrl: string;
  googleDocUrl?: string;
  description: string;
  lessons: Lesson[];
  created_at: string;
}

export type AdSlotLocation =
  | 'hero_top_updates'
  | 'feed_inline'
  | 'feed_inline_1'
  | 'feed_inline_2'
  | 'sidebar_widget'
  | 'sidebar_top'
  | 'sidebar_bottom'
  | 'header_banner';

export type AdStatus =
  | 'pending_review'
  | 'pending_approval'
  | 'approved_pending_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'active'
  | 'rejected';

export type AdFormatType = 'banner' | 'card';

export interface AdCampaign {
  id: string;
  advertiserName: string;
  advertiserEmail: string;
  companyName: string;
  businessDescription?: string;
  slotLocation: AdSlotLocation;
  title: string;
  tagline: string;
  category: string;
  targetUrl: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  adFormat?: AdFormatType; // 'banner' for full company ad poster/graphic, 'card' for structured layout
  isFullBanner?: boolean;
  phoneNumber?: string; // e.g. 0702 777 777
  badgeText?: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  impressionsCount: number;
  clicksCount: number;
  status: AdStatus;
  amountPaid: number;
  currency: 'LKR' | 'USD';
  paymentGateway?: string;
  transactionRef?: string;
  created_at: string;
  approved_at?: string;
  paid_at?: string;
  adminNotes?: string;
  rejectionReason?: string;
  // Editorial Review & Employee Workflow Fields
  reviewedByStaffId?: string;
  reviewedByStaffName?: string;
  staffFeedback?: string;
  approvedAt?: string;
  paymentMethod?: string;
  bankTxRef?: string;
  bankDepositSlipUrl?: string;
  isBankPaymentFlagged?: boolean;
  bankDepositAccount?: string;
  bankVerifiedByStaff?: string;
  bankVerifiedAt?: string;
  publishedByStaff?: string;
  publishedAt?: string;
}

export interface AdSlotPricing {
  slotLocation: AdSlotLocation;
  title: string;
  description: string;
  priceLKR: number;
  priceUSD: number;
  durationDays: number;
  estimatedImpressions: string;
  format: string;
}

export interface AdEmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  subject: string;
  emailType: 'intent_received' | 'approval_notice' | 'payment_received' | 'campaign_live' | 'campaign_rejected';
  bodyText: string;
  applicationId: string;
  dispatchedAt: string;
  status: string;
  deliveryNote: string;
}

export interface LankaInkCreation {
  id: string;
  title: string;
  authorName: string;
  authorBio?: string;
  category: 'story' | 'poem' | 'essay' | 'book' | 'craft';
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedDate: string;
  likes: number;
  location: string;
  price?: number;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  isFeatured?: boolean;
  artisanDetails?: {
    materialUsed?: string;
    craftTechnique?: string;
    stockAvailable?: number;
  };
  bookDetails?: {
    publisher?: string;
    isbn?: string;
    pages?: number;
  };
}

export interface LankaInkArtisan {
  id: string;
  name: string;
  craftOrTitle: string;
  district: string;
  bio: string;
  avatarUrl: string;
  contactEmail?: string;
  contactPhone?: string;
  portfolioItemsCount: number;
  isMasterArtisan: boolean;
}

export interface LankaInkInterview {
  id: string;
  title: string;
  artisanOrAuthorName: string;
  category: string;
  interviewer: string;
  readTime: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedDate: string;
}

export interface LankaInkOrder {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  itemTitle: string;
  itemCategory: string;
  itemPriceLKR: number;
  shippingAddress: string;
  orderDate: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentGateway: string;
}

export interface WhatsAppGroup {
  id: string;
  groupName: string;
  groupId: string;
  webhookUrl: string;
  targetAudience: string;
  status: 'active' | 'paused';
  totalPushesCount: number;
  connectedAt: string;
}

export interface WhatsAppPushLog {
  id: string;
  articleId: number;
  articleTitle: string;
  articleSlug: string;
  targetGroupsCount: number;
  targetGroupsNames: string[];
  messageExcerpt: string;
  status: string;
  pushedAt: string;
  isSubscriptionOnly: boolean;
}

export interface EmployeeRecord {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'owner' | 'editor' | 'analyst';
  department: string;
  employeeIdNumber: string;
  status: 'authorized' | 'pending' | 'revoked';
  registeredAt: string;
  accessibleSites?: ('lanka_econ' | 'econ_academy' | 'lanka_ink')[];
  age?: number;
  nicNumber?: string;
  tinNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branchName: string;
  };
}

export type PublisherCategory = 'masterclass' | 'course' | 'book' | 'lecture' | 'podcast' | 'poem' | 'ink_poetry' | 'essay' | 'craft' | 'treatise' | 'scholar_treatise' | 'art_collection';

export type PackageTier = 'basic' | 'pro' | 'royal';

export interface PublisherSubmission {
  id: string;
  trackingId: string;
  creatorName: string;
  creatorEmail: string;
  creatorPhone?: string;
  affiliation?: string;
  category: PublisherCategory;
  platformTarget: 'econ_academy' | 'lanka_ink';
  title: string;
  topicDescription: string;
  videoSubmissionType?: 'youtube' | 'drive_link' | 'email_attachment';
  sampleVideoUrl?: string;
  sampleDocumentUrl?: string;
  sampleText?: string;
  emailFileNotice?: string;
  packageTier: PackageTier;
  packagePriceLKR: number;
  creatorSharePercentage: number;
  proposedPriceLKR: number;
  status: 'pending_vetting' | 'sample_approved' | 'paid_approved' | 'full_uploaded_pending_final_publish' | 'full_published' | 'rejected';
  staffFeedback?: string;
  approvedByStaffId?: string;
  approvedAt?: string;
  isPaid?: boolean;
  paymentTxRef?: string;
  paidAt?: string;
  emailNotificationSent: boolean;
  legalAccepted: boolean;
  fullContent?: {
    modules?: { id: string; title: string; videoUrl: string; duration: string; description: string }[];
    bookPdfUrl?: string;
    googleDocUrl?: string;
    fullText?: string;
    publishedPriceLKR?: number;
  };
  salesCount: number;
  totalRevenueLKR: number;
  creatorEarnedLKR: number;
  remittedLKR: number;
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  submissionId: string;
  creatorName: string;
  creatorEmail: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  amountLKR: number;
  platformFeeLKR: number;
  transactionRef: string;
  paymentGateway: string;
  status: 'REMITTED_SUCCESS' | 'PENDING_BANK';
  remittedAt: string;
  remittedByStaffName: string;
}

export interface TaxInvoice {
  id?: string;
  invoiceNumber: string;
  issueDate?: string;
  invoiceDate?: string;
  dueDate: string;
  clientName?: string;
  clientEmail?: string;
  clientTin?: string;
  clientAddress?: string;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
  serviceDescription?: string;
  description?: string;
  businessUnit?: 'LankaEcon News' | 'Econ Academy' | 'Ink & Canvas' | 'Corporate Ad Sales' | string;
  netAmountLKR: number;
  ssclTaxLKR: number; // 2.5% Social Security Contribution Levy
  vatTaxLKR: number;  // 18% Value Added Tax Sri Lanka
  grossTotalLKR?: number;
  amountLKR?: number;
  currency?: string;
  status?: string;
  paymentStatus?: 'paid' | 'unpaid' | 'cancelled' | string;
  paymentMethod?: string;
  bankDepositAccount?: string;
  companyTin?: string;
  trnNumber?: string;
  vatRegistrationNumber?: string;
  svatRegNo?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPriceLKR: number;
    totalLKR: number;
  }>;
  created_at?: string;
  notes?: string;
  adId?: string;
  generatedBy?: string;
}

export interface PayrollRecord {
  payrollId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  nicNumber: string;
  tinNumber?: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  monthYear: string;
  basicSalaryLKR: number;
  allowancesLKR: number;
  epfEmployeeDeductionLKR: number; // 8%
  epfEmployerContributionLKR: number; // 12%
  etfEmployerContributionLKR: number; // 3%
  apitTaxDeductionLKR: number; // Advance Personal Income Tax
  netSalaryLKR: number;
  paymentStatus: 'processed' | 'remitted_to_bank';
  remittanceRef?: string;
}

export interface ErpApiConfig {
  apiKey: string;
  enabledServices: ('accounting' | 'hr_payroll' | 'tax_ird' | 'bank_slips')[];
  webhookUrl?: string;
  lastSyncAt?: string;
  systemName: string;
}

export interface CbslMonthlyIndicator {
  monthId: string; // e.g. '2026-05'
  monthLabel: string; // e.g. 'May 2026'
  bulletinDate: string; // e.g. 'May 2026 CBSL Monthly Economic Indicators (MEI) Official Bulletin'
  cbslSourceRef: string; // e.g. 'CBSL Statistics > Statistical Tables > Monthly Economic Indicators (MEI)'
  cbslReportPath: string; // Exact official web path e.g. 'https://www.cbsl.gov.lk/en/statistics/statistical-tables/monthly-economic-indicators'
  
  // 1. CBSL Policy Corridors & Bank Benchmarks (Month-End Status)
  sdfrPercent: number; // Standing Deposit Facility Rate (%)
  slfrPercent: number; // Standing Lending Facility Rate (%)
  srrPercent: number;  // Statutory Reserve Ratio (%)
  policyStance: 'Neutral' | 'Easing' | 'Tightening' | 'Hold';
  awprPercent: number; // Monthly Average Weighted Prime Lending Rate (%)
  awerPercent: number; // Monthly Average Weighted Deposit Rate (%)

  // 2. CBSL Balance Sheet & Money Supply (Month-End Balance Sheet)
  cbslTbillHoldingsLKRBillion: number; // CBSL Domestic Assets / Printed Money held (LKR Bn)
  reserveMoneyM0LKRBillion: number;   // Monetary Base Reserve Money M0 (LKR Bn)
  broadMoneyM2bLKRBillion: number;     // Month-End Broad Money Supply M2b Level (LKR Bn)
  broadMoneyM2bYoYPercent: number;    // Broad Money M2b YoY Growth Rate (%)

  // 3. External Sector & Central Bank Balance Sheet Swaps
  grossOfficialReservesUSDBillion: number; // Month-End Gross Official Foreign Reserves ($ Bn)
  cbslCommercialBankSwapsUSDMillion: number; // Month-End Outstanding CBSL FX Swaps with Domestic Commercial Banks ($ Mn)
  cbslNetFxPurchaseUSDMillion: number; // Cumulative Monthly CBSL Net FX Purchase (+) or Sale (-) in Foreign Exchange Market ($ Mn)
  workersRemittancesUSDMillion: number; // Monthly Total Workers' Remittances ($ Mn)
  touristEarningsUSDMillion: number;   // Monthly Total Tourism Revenues ($ Mn)
  merchandiseExportsUSDMillion: number; // Monthly Total Merchandise Exports ($ Mn)
  merchandiseImportsUSDMillion: number; // Monthly Total Merchandise Imports ($ Mn)
  tradeDeficitUSDMillion: number;      // Monthly Merchandise Trade Deficit ($ Mn)

  // 4. Inflation & Banking Sector Credit
  ccpiHeadlineInflationPercent: number; // CCPI YoY Headline Inflation (%)
  ccpiCoreInflationPercent: number;     // CCPI Core Inflation (%)
  ncpiInflationPercent: number;         // NCPI YoY National Inflation (%)
  privateCreditYoYPercent: number;      // Commercial Bank Credit to Private Sector YoY (%)
  governmentCreditLKRBillion: number;   // Net Credit Extended to Government by Banking System (LKR Bn)

  // 5. CALCULATED DERIVED METRICS (100% Math Derived from MEI Bulletin)
  cleanReservesUSDBillion: number; // Calculated: Gross Official Reserves ($ Bn) - (FX Swaps ($ Mn) / 1000)
  cbslSwapsNetChangeUSDMillion: number; // Calculated MoM Change in FX Swaps ($ Mn)
  netExternalFxBufferUSDMillion: number; // Calculated: (Remittances + Tourism) - Trade Deficit ($ Mn)
  realSdfrPercent: number; // Calculated: SDFR (%) - CCPI Headline Inflation (%)

  // Bellwether Analytical Synthesis
  bellwetherHeadline: string;
  bellwetherAnalysisPoints: string[];
  macroRiskRating: 'Low Risk' | 'Moderate' | 'High Vigilance';
  lastUpdated: string;
}

export interface AccountingLedgerEntry {
  id: string;
  date: string;
  category: string;
  description: string;
  accountType: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
  debitLKR: number;
  creditLKR: number;
  amountLKR: number;
  businessUnit: string;
  reference: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
}

export interface CustomAccountingEntry {
  id: string;
  type: 'income' | 'expense' | 'asset' | 'liability' | 'equity' | 'revenue' | 'journal_entry';
  title: string;
  amountLKR: number;
  category: string;
  assetType?: 'current' | 'fixed' | 'equipment' | 'deposit' | 'intangible';
  liabilityType?: 'current' | 'long_term' | 'loan' | 'advance' | 'payable';
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year?: number;
  date: string;
  notes?: string;
  supplierOrParty?: string;
  created_at?: string;
}

export interface PaymentGatewayConfig {
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalMode: 'sandbox' | 'live';
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeMode: 'test' | 'live';
  payhereEnabled: boolean;
  payhereMerchantId: string;
  webhookUrl: string;
  autoIssueInvoice: boolean;
  autoPostToLedger: boolean;
}

export interface SubscriberNotificationLog {
  id: string;
  articleId: number | string;
  articleTitle: string;
  articleSlug: string;
  articleCategory: string;
  recipientEmail: string;
  recipientName: string;
  recipientPlan: string;
  subject: string;
  emailHtmlExcerpt: string;
  sentAt: string;
  status: 'DELIVERED' | 'QUEUED' | 'FAILED';
  deliveryType: 'SUBSCRIBER_EXCLUSIVE_ALERT';
}

export interface SubscriberRecord {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  planId?: string;
  planName?: string;
  amountLKR?: number;
  paymentStatus?: string;
  subscribedAt?: string;
  date?: string;
  // Subscriber Email Alert Preferences:
  notifySubscriberArticles: boolean; // Opt-in / Opt-out for subscriber-only / exclusive article alerts (default: true)
  notifyWeeklyDigest?: boolean;
  notifyBreakingNews?: boolean;
  status?: 'active' | 'cancelled' | 'paused';
}


