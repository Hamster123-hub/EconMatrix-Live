import React, { useState, useEffect, useRef } from 'react';
import { AdCampaign, AdSlotPricing, AdFormatType } from '../types';
import { VisualAdSlotMap } from './VisualAdSlotMap';
import { downloadAdSpecPdf } from '../utils/adSpecPdfGenerator';
import {
  Megaphone,
  Search,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Sparkles,
  LayoutTemplate,
  Layers,
  Phone,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  Clipboard,
  Trash2,
  MonitorUp,
  FileImage,
  Link as LinkIcon,
  Check,
  Clock,
  Landmark,
  FileDown,
} from 'lucide-react';
import { getUIText, Language } from '../utils/translations';

interface AdCenterSectionProps {
  language?: Language;
  initialPastedImage?: string;
}

export const AdCenterSection: React.FC<AdCenterSectionProps> = ({ language = 'en', initialPastedImage }) => {
  const [subTab, setSubTab] = useState<'apply' | 'lookup' | 'pricing' | 'map'>('apply');
  const [slotPricing, setSlotPricing] = useState<AdSlotPricing[]>([]);
  const [refSearch, setRefSearch] = useState('');
  const [foundCampaigns, setFoundCampaigns] = useState<AdCampaign[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState<any>(null);
  const [isSubmittingIntent, setIsSubmittingIntent] = useState(false);
  const [selectedCampaignForPayment, setSelectedCampaignForPayment] = useState<AdCampaign | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  // Form interactive state
  const [selectedFormat, setSelectedFormat] = useState<AdFormatType>('banner');
  const [formCompanyName, setFormCompanyName] = useState('Prime Residencies PLC');
  const [formAdvertiserName, setFormAdvertiserName] = useState('Nalinda Rajapaksha');
  const [formAdvertiserEmail, setFormAdvertiserEmail] = useState('marketing@primeresidencies.lk');
  const [formTitle, setFormTitle] = useState('Mon Viè Thalawathugoda Gardens • Colombo 05');
  const [formTagline, setFormTagline] = useState('Live It Beautifully Now • Floating Sky Restaurant & Cantilevered Deck');
  const [formCategory, setFormCategory] = useState('LUXURY REAL ESTATE');
  const [formSlotLocation, setFormSlotLocation] = useState('sidebar_top');
  const [formTargetUrl, setFormTargetUrl] = useState('https://primeresidencies.lk');
  const [formImageUrl, setFormImageUrl] = useState(
    initialPastedImage ||
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  );
  const [formPhoneNumber, setFormPhoneNumber] = useState('0702 777 777');
  const [formBadgeText, setFormBadgeText] = useState('COLOMBO 05 EXCLUSIVE RESIDENCES');
  const [formCurrency, setFormCurrency] = useState<'LKR' | 'USD'>('LKR');

  // Desktop File / Clipboard Upload States
  const [imageInputMode, setImageInputMode] = useState<'desktop' | 'url'>('desktop');
  const [isDragging, setIsDragging] = useState(false);
  const [imageFileInfo, setImageFileInfo] = useState<{
    name: string;
    size: string;
    dimensions?: string;
    source: 'pasted_clipboard' | 'desktop_file' | 'url';
  } | null>(
    initialPastedImage
      ? {
          name: 'Pasted Desktop Creative Banner',
          size: 'Direct Paste',
          source: 'pasted_clipboard',
        }
      : null
  );
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/ads')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.slotPricing) {
          setSlotPricing(d.slotPricing);
        }
      });
  }, []);

  // Update initial pasted image if passed dynamically
  useEffect(() => {
    if (initialPastedImage) {
      setFormImageUrl(initialPastedImage);
      setImageFileInfo({
        name: 'Transferred Desktop Creative',
        size: 'Direct Paste',
        source: 'pasted_clipboard',
      });
      setPasteNotice('Desktop banner received and loaded into creative simulator!');
      setTimeout(() => setPasteNotice(null), 5000);
    }
  }, [initialPastedImage]);

  // Process image files (from clipboard paste, file picker, or drag-and-drop)
  const processImageFile = (file: File, source: 'pasted_clipboard' | 'desktop_file') => {
    if (!file.type.startsWith('image/')) {
      alert('Please select or paste an image file (PNG, JPG, JPEG, WEBP, GIF, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormImageUrl(result);

        // Calculate dimensions
        const img = new Image();
        img.onload = () => {
          setImageFileInfo({
            name: file.name || (source === 'pasted_clipboard' ? 'Pasted Clipboard Graphic' : 'Desktop Upload'),
            size: `${(file.size / 1024).toFixed(1)} KB`,
            dimensions: `${img.width} × ${img.height} px`,
            source,
          });
        };
        img.src = result;

        setPasteNotice(
          source === 'pasted_clipboard'
            ? '✨ Image pasted directly from clipboard! Preview updated.'
            : '📁 Image loaded from desktop file! Preview updated.'
        );
        setTimeout(() => setPasteNotice(null), 4500);
      }
    };
    reader.readAsDataURL(file);
  };

  // Global window paste listener when in Advertise section
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing into text inputs, unless clipboard has an image
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file, 'pasted_clipboard');
            return;
          }
        }
      }

      // If pasting an image URL while focused on image section
      if (!isInput && e.clipboardData) {
        const text = e.clipboardData.getData('text');
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          setFormImageUrl(text);
          setImageFileInfo({
            name: 'Pasted URL Asset',
            size: 'Remote Link',
            source: 'url',
          });
          setPasteNotice('🔗 Image URL pasted from clipboard!');
          setTimeout(() => setPasteNotice(null), 4000);
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0], 'desktop_file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0], 'desktop_file');
    }
  };

  const handlePasteFromClipboardAPI = async () => {
    try {
      if (!navigator.clipboard?.read) {
        alert('Press Ctrl+V (or Cmd+V on Mac) anywhere on this page to paste your image directly from your clipboard.');
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard-pasted-banner.png', { type: imageType });
          processImageFile(file, 'pasted_clipboard');
          return;
        }
      }
      alert('No image found in clipboard. Please copy an image from your desktop (Ctrl+C / Cmd+C or Snipping tool), then press Ctrl+V or click Paste.');
    } catch {
      alert('To paste an image from your desktop, simply press Ctrl+V (or Cmd+V on Mac) on this page.');
    }
  };

  const handleApplyPreset = (presetType: 'prime' | 'cinnara' | 'bank') => {
    if (presetType === 'prime') {
      setSelectedFormat('banner');
      setFormCompanyName('Prime Residencies PLC');
      setFormAdvertiserName('Prime Luxury Desk');
      setFormAdvertiserEmail('corporate@primeresidencies.lk');
      setFormTitle('Mon Viè Thalawathugoda Gardens • Colombo 05');
      setFormTagline('Live It Beautifully Now • Floating Sky Restaurant & Cantilevered Viewing Deck');
      setFormCategory('LUXURY REAL ESTATE');
      setFormSlotLocation('sidebar_top');
      setFormTargetUrl('https://primeresidencies.lk');
      setFormImageUrl('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80');
      setFormPhoneNumber('0702 777 777');
      setFormBadgeText('COLOMBO 05 EXCLUSIVE RESIDENCES');
      setFormCurrency('LKR');
    } else if (presetType === 'cinnara') {
      setSelectedFormat('card');
      setFormCompanyName('Cinnara Spice Exports');
      setFormAdvertiserName('Nishantha Silva');
      setFormAdvertiserEmail('exports@cinnara.lk');
      setFormTitle('Cinnara Ultra-Grade Pure Ceylon Cinnamon & Spices');
      setFormTagline('Authentic Organic Alba Grade Ceylon Cinnamon Direct from Southern Estates');
      setFormCategory('EXPORTS');
      setFormSlotLocation('sidebar_bottom');
      setFormTargetUrl('https://cinnara.lk');
      setFormImageUrl('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80');
      setFormPhoneNumber('+94 11 234 5678');
      setFormBadgeText('ORGANIC CERTIFIED');
      setFormCurrency('LKR');
    } else {
      setSelectedFormat('banner');
      setFormCompanyName('Commercial Bank of Ceylon PLC');
      setFormAdvertiserName('Treasury Desk');
      setFormAdvertiserEmail('treasury@combank.lk');
      setFormTitle('High Yield Fixed Income Treasury Deposits 2026');
      setFormTagline('Guaranteed Monthly Dividends for Institutional Investors');
      setFormCategory('BANKING');
      setFormSlotLocation('sidebar_top');
      setFormTargetUrl('https://www.combank.lk');
      setFormImageUrl('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80');
      setFormPhoneNumber('+94 11 248 6000');
      setFormBadgeText('CBSL LICENSED');
      setFormCurrency('LKR');
    }
  };

  const handleApplyIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingIntent(true);

    const body = {
      advertiserName: formAdvertiserName,
      advertiserEmail: formAdvertiserEmail,
      companyName: formCompanyName,
      title: formTitle,
      tagline: formTagline,
      category: formCategory,
      slotLocation: formSlotLocation,
      targetUrl: formTargetUrl,
      imageUrl: formImageUrl,
      currency: formCurrency,
      adFormat: selectedFormat,
      isFullBanner: selectedFormat === 'banner',
      phoneNumber: formPhoneNumber,
      badgeText: formBadgeText,
    };

    try {
      const res = await fetch('/api/ads/apply-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setApplicationSuccess(data);
      } else {
        alert(data.error || 'Failed to submit application.');
      }
    } catch {
      alert('Error connecting to ad server.');
    } finally {
      setIsSubmittingIntent(false);
    }
  };

  const handleLookupRef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refSearch.trim()) return;
    setIsSearching(true);
    setSearchError('');
    setFoundCampaigns([]);

    try {
      const res = await fetch(`/api/ads/lookup-application?ref=${encodeURIComponent(refSearch.trim())}`);
      const data = await res.json();
      if (data.success && data.campaigns) {
        setFoundCampaigns(data.campaigns);
      } else {
        setSearchError(data.error || 'No campaign application found.');
      }
    } catch {
      setSearchError('Server connection error.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePayApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignForPayment) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const body = {
      applicationId: selectedCampaignForPayment.id,
      paymentGateway: formData.get('paymentGateway'),
      cardNumber: formData.get('cardNumber'),
      bankTxRef: formData.get('bankTxRef'),
      currency: selectedCampaignForPayment.currency,
    };

    try {
      const res = await fetch('/api/ads/pay-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSuccess(data);
        setSelectedCampaignForPayment(null);
      } else {
        alert(data.error || 'Payment failed.');
      }
    } catch {
      alert('Payment processing error.');
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Banner */}
      <div className="bg-[#1A1A1A] text-[#FDFBF7] p-8 sm:p-10 rounded-none border-2 border-[#1A1A1A] shadow-none relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="bg-[#991B1B] text-white font-sans font-extrabold text-[9px] uppercase tracking-[0.25em] px-3 py-1">
            LANKAECON ADVERTISING & PARTNER DESK
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#FDFBF7] mt-4 mb-2 leading-tight">
            Reach 180,000+ C-Suite & Financial Decision Makers
          </h2>
          <p className="font-editorial-body text-base text-gray-300 leading-relaxed">
            Position your banking, real estate, export, or corporate brand in front of Sri Lanka's highest net worth investors and institutional audience.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#1A1A1A] overflow-x-auto no-scrollbar gap-2 pb-1">
        {[
          { id: 'apply', label: 'Submit Ad Application', icon: Megaphone },
          { id: 'map', label: 'Visual Placement Map & PDF', icon: LayoutTemplate },
          { id: 'lookup', label: 'Track Application / Pay', icon: Search },
          { id: 'pricing', label: 'Rate Cards & Formats', icon: DollarSign },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-white border-b-2 border-[#991B1B]'
                  : 'bg-white text-[#333333] hover:bg-[#F5F2E9] border border-[#1A1A1A]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#991B1B]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* View: Apply Intent */}
      {subTab === 'apply' && (
        <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
          {applicationSuccess ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                Application Submitted for Team Approval!
              </h3>
              <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xs text-xs text-left space-y-2">
                <p className="font-black text-amber-950 uppercase tracking-wide">Application Tracking Summary:</p>
                <div className="flex justify-between border-b border-amber-200 pb-1">
                  <span className="text-slate-600">Application Ref ID:</span>
                  <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 border border-amber-300 rounded-xs">
                    {applicationSuccess.applicationId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-amber-200 pb-1">
                  <span className="text-slate-600">Company:</span>
                  <span className="font-bold text-slate-800">{applicationSuccess.campaign?.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200 pb-1">
                  <span className="text-slate-600">Placement Slot:</span>
                  <span className="font-bold text-slate-800">{applicationSuccess.campaign?.slotLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimated Quote:</span>
                  <span className="font-black text-amber-900">
                    {applicationSuccess.campaign?.currency} {applicationSuccess.campaign?.amountPaid?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xs text-xs text-blue-950 text-left space-y-1">
                <p className="font-bold">Next Steps:</p>
                <p>1. Our commercial & editorial team will review your creative and headline.</p>
                <p>2. You will receive an approval notification email with payment details.</p>
                <p>3. Once payment is made and verified by our staff, your ad will go LIVE!</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <button
                  onClick={() => {
                    setRefSearch(applicationSuccess.applicationId);
                    setSubTab('lookup');
                    setApplicationSuccess(null);
                  }}
                  className="bg-[#0B1E36] hover:bg-black text-amber-400 font-extrabold text-xs px-6 py-2.5 rounded-xs transition cursor-pointer"
                >
                  Track This Application Now
                </button>
                <button
                  onClick={() => setApplicationSuccess(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xs transition cursor-pointer"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Format Switcher & Quick Demo Presets */}
              <div className="bg-[#FAF9F6] border border-[#E0DDD5] p-4 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0DDD5] pb-2.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#991B1B]">Select Ad Presentation Format</span>
                    <h4 className="font-serif font-bold text-sm text-[#0B1E36]">How would you like your advertisement to display?</h4>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSelectedFormat('banner')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-extrabold transition cursor-pointer ${
                        selectedFormat === 'banner'
                          ? 'bg-[#0B1E36] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Full Company Banner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFormat('card')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-extrabold transition cursor-pointer ${
                        selectedFormat === 'card'
                          ? 'bg-[#0B1E36] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutTemplate className="w-3.5 h-3.5 text-sky-400" />
                      <span>Standard Ad Card</span>
                    </button>
                  </div>
                </div>

                {/* Quick Presets Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Load Sample Creative:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('prime')}
                    className="bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>🏢 Prime Residencies (Full Banner)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('cinnara')}
                    className="bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>🌿 Cinnara Cinnamon (Card)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('bank')}
                    className="bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-300 hover:border-amber-400 px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>🏛️ Commercial Bank (Banner)</span>
                  </button>
                </div>
              </div>

              {/* 2-Column: Form on Left + Live Sidebar Preview on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Column */}
                <form onSubmit={handleApplyIntent} className="lg:col-span-7 space-y-4 text-xs">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-[#E0DDD5] pb-2 flex items-center justify-between">
                    <span>Campaign Parameters & Creative Assets</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      selectedFormat === 'banner' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                    }`}>
                      {selectedFormat === 'banner' ? 'FORMAT: FULL BANNER' : 'FORMAT: STRUCTURED CARD'}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Company / Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={formCompanyName}
                        onChange={(e) => setFormCompanyName(e.target.value)}
                        placeholder="e.g. Prime Residencies PLC"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Corporate Contact Email *</label>
                      <input
                        type="email"
                        required
                        value={formAdvertiserEmail}
                        onChange={(e) => setFormAdvertiserEmail(e.target.value)}
                        placeholder="e.g. marketing@primeresidencies.lk"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Advertiser Full Name / Contact</label>
                      <input
                        type="text"
                        value={formAdvertiserName}
                        onChange={(e) => setFormAdvertiserName(e.target.value)}
                        placeholder="e.g. Nalinda Rajapaksha"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Placement Slot *</label>
                      <select
                        value={formSlotLocation}
                        onChange={(e) => setFormSlotLocation(e.target.value)}
                        required
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 font-medium"
                      >
                        <option value="sidebar_top">⭐ Top of Right Sidebar (Above Exchange Rates) - LKR 50,000/mo</option>
                        <option value="hero_top_updates">🔥 Hero Top Financial Updates Banner - LKR 45,000/mo</option>
                        <option value="feed_inline_1">📰 Newsroom Feed Inline Box #1 (Mid-Feed) - LKR 35,000/mo</option>
                        <option value="feed_inline_2">📰 Newsroom Feed Inline Box #2 (Bottom-Feed) - LKR 35,000/mo</option>
                        <option value="sidebar_widget">📊 Market Intelligence Lower Sidebar Widget - LKR 30,000/mo</option>
                        <option value="header_banner">👑 Leaderboard Masthead Header Banner - LKR 60,000/mo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Ad Headline / Project Name *</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Mon Viè Thalawathugoda Gardens • Colombo 05"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Tagline / Key Highlight</label>
                      <input
                        type="text"
                        value={formTagline}
                        onChange={(e) => setFormTagline(e.target.value)}
                        placeholder="e.g. Live It Beautifully Now • Floating Sky Restaurant"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Category Badge</label>
                      <input
                        type="text"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder="e.g. LUXURY REAL ESTATE"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Hotline / Phone Number</label>
                      <input
                        type="text"
                        value={formPhoneNumber}
                        onChange={(e) => setFormPhoneNumber(e.target.value)}
                        placeholder="e.g. 0702 777 777"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Corner Badge Tag</label>
                      <input
                        type="text"
                        value={formBadgeText}
                        onChange={(e) => setFormBadgeText(e.target.value)}
                        placeholder="e.g. COLOMBO 05 EXCLUSIVE RESIDENCES"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">Target Landing URL *</label>
                      <input
                        type="url"
                        required
                        value={formTargetUrl}
                        onChange={(e) => setFormTargetUrl(e.target.value)}
                        placeholder="https://primeresidencies.lk"
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Billing Currency</label>
                      <select
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value as any)}
                        className="w-full bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 font-medium"
                      >
                        <option value="LKR">Sri Lankan Rupee (LKR)</option>
                        <option value="USD">US Dollar (USD)</option>
                      </select>
                    </div>
                  </div>

                  {/* Interactive Desktop Banner Upload & Clipboard Paste Studio */}
                  <div className="bg-[#FAF9F6] border border-[#E0DDD5] p-3.5 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0DDD5] pb-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0284C7] flex items-center gap-1">
                          <MonitorUp className="w-3 h-3" />
                          Ad Creative / Banner Image Asset
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">
                          {selectedFormat === 'banner' ? 'Upload or Paste Full Graphic Poster Banner' : 'Upload or Paste Card Thumbnail'}
                        </h4>
                      </div>

                      {/* Mode Switcher: Desktop Upload/Paste vs Direct URL */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setImageInputMode('desktop')}
                          className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                            imageInputMode === 'desktop'
                              ? 'bg-[#0B1E36] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>Desktop Upload & Paste</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode('url')}
                          className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                            imageInputMode === 'url'
                              ? 'bg-[#0B1E36] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <LinkIcon className="w-3 h-3" />
                          <span>Direct URL</span>
                        </button>
                      </div>
                    </div>

                    {/* Notification Alert when pasted */}
                    {pasteNotice && (
                      <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between animate-fadeIn">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          {pasteNotice}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPasteNotice(null)}
                          className="text-emerald-700 hover:text-emerald-900 text-[10px] uppercase font-mono cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {imageInputMode === 'desktop' ? (
                      /* DESKTOP UPLOAD, DRAG & DROP, AND CLIPBOARD PASTE ZONE */
                      <div className="space-y-3">
                        {/* Interactive Drop / Paste Target Zone */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer relative overflow-hidden ${
                            isDragging
                              ? 'border-[#0284C7] bg-sky-50 shadow-md scale-[1.01]'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                            accept="image/*"
                            className="hidden"
                          />

                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                              <UploadCloud className="w-6 h-6 text-[#0284C7]" />
                            </div>

                            <div>
                              <p className="font-extrabold text-xs text-slate-900">
                                Drag & drop any image/banner from your desktop here
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Or click to browse local files (PNG, JPG, WEBP, GIF, SVG)
                              </p>
                            </div>

                            {/* Quick Action Buttons inside Dropzone */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePasteFromClipboardAPI();
                                }}
                                className="bg-[#0B1E36] hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              >
                                <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                                <span>Paste from Clipboard (Ctrl+V)</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              >
                                <FileImage className="w-3.5 h-3.5 text-sky-600" />
                                <span>Browse Desktop Files</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Hint note */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <strong>Desktop Copy-Paste:</strong> Copy any image (Ctrl+C / Snipping Tool) and press <strong>Ctrl+V</strong> anywhere.
                          </span>
                          <span className="font-mono text-slate-400">Max 50MB</span>
                        </div>

                        {/* Loaded Image Details Bar */}
                        {formImageUrl && (
                          <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                <img
                                  src={formImageUrl}
                                  alt="Current ad creative"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    {imageFileInfo?.name || 'Active Banner Asset'}
                                  </span>
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs shrink-0">
                                    Ready
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                  {imageFileInfo?.dimensions && <span>{imageFileInfo.dimensions}</span>}
                                  {imageFileInfo?.size && <span>• {imageFileInfo.size}</span>}
                                  <span className="text-slate-400 truncate max-w-[130px]">
                                    {formImageUrl.startsWith('data:') ? 'Base64 Desktop Asset' : formImageUrl}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded transition cursor-pointer"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormImageUrl('');
                                  setImageFileInfo(null);
                                }}
                                className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* DIRECT URL INPUT */
                      <div className="space-y-2">
                        <label className="block text-gray-700 font-bold">
                          {selectedFormat === 'banner' ? 'Full Graphic Ad Banner / Poster Image URL *' : 'Card Thumbnail Image URL *'}
                        </label>
                        <input
                          type="url"
                          required
                          value={formImageUrl}
                          onChange={(e) => {
                            setFormImageUrl(e.target.value);
                            setImageFileInfo({
                              name: 'Remote URL Asset',
                              size: 'External',
                              source: 'url',
                            });
                          }}
                          placeholder="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:border-amber-700 text-xs font-mono"
                        />
                        <p className="text-[10px] text-slate-500">
                          {selectedFormat === 'banner'
                            ? 'For full banner ads, provide a high-resolution vertical or square brand creative/poster.'
                            : 'For standard cards, provide a landscape thumbnail image.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingIntent || !formImageUrl}
                    className="w-full bg-[#991B1B] hover:bg-red-800 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-lg transition text-xs shadow-md mt-4 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>{isSubmittingIntent ? 'Submitting Application...' : 'Submit Ad Campaign for Review & Placement'}</span>
                  </button>
                </form>

                {/* Right Column: Live Interactive Sidebar Preview */}
                <div className="lg:col-span-5 bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0284C7]" />
                      Live Sidebar Slot Preview
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded-xs font-bold uppercase">
                      {formSlotLocation.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    {formSlotLocation.startsWith('feed_inline') || formSlotLocation === 'hero_top_updates' || formSlotLocation === 'header_banner'
                      ? 'Live preview of your horizontal ad banner in the editorial newsroom feed:'
                      : 'This is how your ad will appear to hundreds of thousands of readers in the LankaEcon right-hand column:'}
                  </p>

                  {/* Simulated Ad Output (Adapts to Slot Location) */}
                  {formSlotLocation.startsWith('feed_inline') || formSlotLocation === 'hero_top_updates' || formSlotLocation === 'header_banner' ? (
                    <div className="w-full">
                      {selectedFormat === 'banner' ? (
                        /* WIDE DIRECT BANNER PREVIEW */
                        <div className="border-2 border-[#0B1E36] bg-[#060D17] rounded-lg overflow-hidden shadow-md relative group">
                          <div className="w-full relative overflow-hidden bg-[#060D17] flex items-center justify-center min-h-[70px]">
                            <img
                              src={formImageUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'}
                              alt={formTitle}
                              className="w-full h-auto max-h-[350px] object-contain block"
                            />
                            <span className="absolute top-2 left-2 bg-black/85 text-amber-300 border border-amber-500/60 text-[8.5px] font-mono font-black uppercase px-2 py-0.5 tracking-widest rounded-xs shadow-md">
                              SPONSORED
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* WIDE STRUCTURED CARD PREVIEW */
                        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-2 border-[#D97706] text-white p-4 shadow-md rounded-lg relative overflow-hidden">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#D97706] text-[#0F172A] text-[8.5px] font-mono font-black uppercase px-1.5 py-0.5 tracking-widest">
                                  COMMERCIAL ADVERTISEMENT
                                </span>
                                <span className="text-[9px] font-mono text-amber-300 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                                  {formBadgeText || 'Verified Partner'}
                                </span>
                              </div>
                              <h4 className="font-serif font-extrabold text-sm text-white leading-tight">
                                {formTitle || 'Commercial Bank of Ceylon — Trade & Forex'}
                              </h4>
                              <p className="text-xs text-slate-300 font-sans line-clamp-1">
                                {formTagline || 'Guaranteed USD & LKR trade settlement desk for exporters.'}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <span className="bg-[#D97706] text-[#0F172A] font-serif font-black text-xs uppercase px-3 py-1.5 flex items-center gap-1">
                                <span>EXPLORE OFFER</span>
                                <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-xs mx-auto">
                      {selectedFormat === 'banner' ? (
                        /* FULL BANNER PREVIEW - CLEAN EDGE-TO-EDGE GRAPHIC POSTER */
                        <div className="border-2 border-[#0B1E36] shadow-md rounded-lg overflow-hidden relative bg-slate-900">
                          <div className="w-full relative overflow-hidden bg-slate-900">
                            <img
                              src={formImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                              alt={formTitle}
                              className="w-full h-auto min-h-[180px] max-h-[380px] object-cover block"
                            />
                            {formBadgeText && (
                              <span className="absolute top-2 left-2 bg-black/85 text-amber-300 border border-amber-500/60 text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs shadow-md">
                                {formBadgeText}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* STANDARD CARD PREVIEW */
                        <div className="bg-white border-2 border-[#0B1E36] p-3.5 shadow-md space-y-2 rounded-lg relative overflow-hidden">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span className="bg-[#DC2626] text-white text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                              {formCategory || 'FEATURED SPONSOR'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[120px]">
                              {formCompanyName}
                            </span>
                          </div>

                          {formImageUrl && (
                            <div className="w-full h-32 bg-slate-100 overflow-hidden relative border border-slate-200 rounded-xs">
                              <img
                                src={formImageUrl}
                                alt={formTitle}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div>
                            <h4 className="font-extrabold text-xs text-[#0B1E36] leading-snug">
                              {formTitle || 'Your Headline Here'}
                            </h4>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 font-medium">
                              {formTagline || 'Your marketing description and value proposition will appear here.'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-extrabold text-[#0284C7] pt-1.5 border-t border-slate-100">
                            {formPhoneNumber ? (
                              <span className="text-slate-700 flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {formPhoneNumber}
                              </span>
                            ) : (
                              <span className="uppercase tracking-wider">Visit {formCompanyName}</span>
                            )}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View: Lookup / Pay */}
      {subTab === 'lookup' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 shadow-2xs">
            <form onSubmit={handleLookupRef} className="space-y-3">
              <h3 className="font-serif font-bold text-base text-gray-900">
                Track Application Status & Complete Payment
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Application Ref ID (e.g. AD-APP-1001) or email..."
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                  className="flex-1 bg-[#FAF9F6] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-amber-700"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-[#1A1A1A] hover:bg-black text-amber-400 font-bold text-xs px-5 py-2 rounded-lg transition"
                >
                  {isSearching ? 'Searching...' : 'Lookup'}
                </button>
              </div>
              {searchError && <p className="text-xs text-rose-600 font-bold">{searchError}</p>}
            </form>
          </div>

          {/* Payment Success Card */}
          {paymentSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Payment Complete — Campaign NOW LIVE!</span>
              </div>
              <p className="text-xs text-emerald-950">
                Your advertisement is active and visible immediately across LankaEcon. An automated invoice receipt was dispatched to {paymentSuccess.campaign?.advertiserEmail}.
              </p>
            </div>
          )}

          {/* Results list */}
          {foundCampaigns.map((camp) => {
            const isPending = camp.status === 'pending_review' || camp.status === 'pending_approval';
            const isApproved = camp.status === 'approved_pending_payment';
            const isPaySubmitted = camp.status === 'payment_submitted';
            const isPayVerified = camp.status === 'payment_verified';
            const isLive = camp.status === 'active';
            const isRejected = camp.status === 'rejected';

            return (
              <div key={camp.id} className="bg-white border-2 border-[#1A1A1A] p-6 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-gray-200 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-xs border border-amber-300">
                        REF: {camp.id}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">
                        Slot: {camp.slotLocation}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-xl text-gray-900 mt-1">{camp.title}</h4>
                    <p className="text-xs text-gray-600 font-medium">{camp.companyName} • {camp.category}</p>
                  </div>

                  <div>
                    {isPending && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-400 text-xs font-black px-3 py-1 uppercase rounded-xs flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Stage 1: Pending Editorial Review</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="bg-sky-100 text-sky-900 border border-sky-400 text-xs font-black px-3 py-1 uppercase rounded-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
                        <span>Stage 2: Approved (Invoice Ready)</span>
                      </span>
                    )}
                    {isPaySubmitted && (
                      <span className="bg-orange-100 text-orange-950 border border-orange-400 text-xs font-black px-3 py-1 uppercase rounded-xs flex items-center gap-1.5 animate-pulse">
                        <Landmark className="w-3.5 h-3.5 text-orange-700" />
                        <span>Stage 3: Payment Under Bank Verification</span>
                      </span>
                    )}
                    {isPayVerified && (
                      <span className="bg-emerald-100 text-emerald-950 border border-emerald-400 text-xs font-black px-3 py-1 uppercase rounded-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Stage 4: Bank Funds Verified</span>
                      </span>
                    )}
                    {isLive && (
                      <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 uppercase rounded-xs flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>LIVE ON SITE</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="bg-red-600 text-white text-xs font-black px-3 py-1 uppercase rounded-xs flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Submission Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 4-Step Visual Workflow Stepper */}
                <div className="bg-[#FAF9F6] border border-gray-200 p-4 rounded-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div className={`p-2 rounded-xs border ${isPending ? 'bg-amber-100 border-amber-400 font-bold' : isApproved || isPaySubmitted || isPayVerified || isLive ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">1. Submission</span>
                        {isApproved || isPaySubmitted || isPayVerified || isLive ? <Check className="w-3 h-3 text-emerald-700 ml-auto" /> : null}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5">Under team vetting</p>
                    </div>

                    <div className={`p-2 rounded-xs border ${isApproved ? 'bg-sky-100 border-sky-400 font-bold' : isPaySubmitted || isPayVerified || isLive ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">2. Staff Approval</span>
                        {isPaySubmitted || isPayVerified || isLive ? <Check className="w-3 h-3 text-emerald-700 ml-auto" /> : null}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5">Invoice issued</p>
                    </div>

                    <div className={`p-2 rounded-xs border ${isPaySubmitted ? 'bg-orange-100 border-orange-400 font-bold' : isPayVerified || isLive ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">3. Bank Audit</span>
                        {isPayVerified || isLive ? <Check className="w-3 h-3 text-emerald-700 ml-auto" /> : null}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5">Corporate A/C check</p>
                    </div>

                    <div className={`p-2 rounded-xs border ${isLive ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">4. Live Broadcast</span>
                        {isLive ? <Sparkles className="w-3 h-3 text-amber-300 ml-auto" /> : null}
                      </div>
                      <p className="text-[10px] opacity-80 mt-0.5">Active on newspaper</p>
                    </div>
                  </div>
                </div>

                {/* Campaign Data Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-3.5 border border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Quote Amount</span>
                    <span className="font-extrabold text-amber-900 text-sm">
                      {camp.currency} {camp.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Duration</span>
                    <span className="font-bold text-gray-900">{camp.durationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Placement Slot</span>
                    <span className="font-bold text-gray-900">{camp.slotLocation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Format</span>
                    <span className="font-bold text-sky-800">
                      {camp.adFormat === 'banner' ? 'Full Graphic Banner Creative' : 'Standard Editorial Card'}
                    </span>
                  </div>
                </div>

                {/* State Guidance Messages & Payment Action */}
                {isPending && (
                  <div className="bg-amber-50 border border-amber-300 p-4 text-xs text-amber-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Application is currently being vetted by the LankaEcon Commercial Desk.</span>
                    </p>
                    <p className="text-slate-600">
                      Our editorial team is reviewing your creative for brand compliance. Once approved, you will receive an approval email notification and payment instructions to confirm placement.
                    </p>
                  </div>
                )}

                {isApproved && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border-2 border-emerald-400 p-4 text-xs text-emerald-950 space-y-2">
                      <p className="font-bold text-sm flex items-center gap-1.5 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Congratulations! Your Ad Has Been Approved by the LankaEcon Editorial Board.</span>
                      </p>
                      {camp.staffFeedback && (
                        <p className="text-slate-700 italic bg-white p-2 border border-emerald-200">
                          Review Board Feedback: "{camp.staffFeedback}"
                        </p>
                      )}
                      <p className="text-slate-700">
                        Please submit your payment of <span className="font-extrabold text-amber-900">{camp.currency} {camp.amountPaid.toLocaleString()}</span> to our official company accounts below to enable live publication.
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCampaignForPayment(camp)}
                      className="bg-[#0B1E36] hover:bg-black text-amber-400 font-black text-xs px-6 py-3 uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Pay Invoice / Submit Bank Deposit Proof</span>
                    </button>
                  </div>
                )}

                {isPaySubmitted && (
                  <div className="bg-orange-50 border border-orange-300 p-4 text-xs text-orange-950 space-y-2">
                    <p className="font-bold text-sm flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-orange-700" />
                      <span>Payment Proof Received (Ref: {camp.transactionRef || camp.bankTxRef})</span>
                    </p>
                    <p className="text-slate-700">
                      Our finance desk is currently reconciling your deposit against LankaEcon corporate bank statements. Once flagged and confirmed, your campaign will be published live immediately.
                    </p>
                  </div>
                )}

                {isPayVerified && (
                  <div className="bg-emerald-50 border border-emerald-400 p-4 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold text-sm flex items-center gap-1.5 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Funds Confirmed in Company Accounts!</span>
                    </p>
                    <p className="text-slate-700">
                      Your payment was verified by LankaEcon Finance. Your ad is in the live publishing queue for today's edition.
                    </p>
                  </div>
                )}

                {isLive && (
                  <div className="bg-green-50 border border-green-300 p-4 text-xs text-green-950 space-y-2">
                    <p className="font-bold text-sm flex items-center gap-1.5 text-green-800">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Your Advertisement is LIVE on LankaEcon!</span>
                    </p>
                    <div className="flex flex-wrap gap-4 text-slate-700 font-mono text-[11px]">
                      <span>Live Impressions: {camp.impressionsCount?.toLocaleString()}</span>
                      <span>Total Clicks: {camp.clicksCount?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Payment Modal with Corporate Bank Account Transfer / Card Options */}
          {selectedCampaignForPayment && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border-2 border-[#0B1E36] w-full max-w-lg shadow-2xl p-6 rounded-xs max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-500" />
                    <h3 className="font-extrabold text-base text-[#0B1E36] uppercase">
                      Pay Ad Invoice & Submit Deposit Slip
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCampaignForPayment(null)}
                    className="text-slate-400 hover:text-slate-800 font-black text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handlePayApplication} className="space-y-4 text-xs">
                  <div className="bg-amber-50 p-3.5 border border-amber-300 rounded-xs space-y-1">
                    <p className="font-bold text-slate-900">{selectedCampaignForPayment.title}</p>
                    <p className="text-amber-950 font-black text-sm">
                      Amount Due: {selectedCampaignForPayment.currency} {selectedCampaignForPayment.amountPaid?.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-600">Application Reference: {selectedCampaignForPayment.id}</p>
                  </div>

                  {/* Corporate Bank Account Details Box */}
                  <div className="bg-slate-900 text-white p-4 rounded-xs space-y-2 border border-slate-800">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Official LankaEcon Corporate Bank Accounts</span>
                    </span>
                    <div className="space-y-1 text-[11px] font-mono text-slate-200">
                      <p><span className="text-slate-400">Account Name:</span> LankaEcon Intelligence (Pvt) Ltd</p>
                      <p><span className="text-slate-400">Primary Bank:</span> Commercial Bank of Ceylon PLC</p>
                      <p><span className="text-slate-400">Account Number:</span> <span className="text-amber-300 font-bold">8810 2930 19</span></p>
                      <p><span className="text-slate-400">Branch:</span> Corporate & Foreign Branch, Colombo 01</p>
                      <p><span className="text-slate-400">Swift / CBSL Code:</span> CCBLLKLX</p>
                      <p className="pt-1 text-[10px] text-slate-400 italic">
                        * Please mention your Ref ID <strong>{selectedCampaignForPayment.id}</strong> in your deposit remarks.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Select Payment Mode</label>
                    <select name="paymentGateway" className="w-full bg-slate-50 border border-slate-300 rounded-xs px-3 py-2 font-medium">
                      <option value="Commercial Bank Direct Deposit / SLIPS">
                        Commercial Bank Direct Deposit / SLIPS Transfer (Recommended)
                      </option>
                      <option value="Bank of Ceylon Corporate Transfer">
                        Bank of Ceylon (BOC) Corporate Transfer
                      </option>
                      <option value="Online Credit Card / Debit Card">
                        Online Credit / Debit Card (Visa, Mastercard, LankaPay)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      Bank Transaction Reference / Deposit Slip No.
                    </label>
                    <input
                      type="text"
                      required
                      name="bankTxRef"
                      placeholder="e.g. SLIPS-88291029 or Bank Deposit Ref ID"
                      className="w-full bg-white border border-slate-300 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      Card Number / Alternative Card Reference (If paying online)
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="4000 1234 5678 9010 (Optional if bank transfer)"
                      className="w-full bg-white border border-slate-300 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black py-3 rounded-xs text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Payment Proof for Team Verification</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View: Visual Placement Map & PDF */}
      {subTab === 'map' && (
        <div className="space-y-4">
          <VisualAdSlotMap
            onSelectSlot={(slotLoc) => {
              setFormSlotLocation(slotLoc);
              setSubTab('apply');
            }}
            selectedSlot={formSlotLocation}
          />
        </div>
      )}

      {/* View: Rate Cards */}
      {subTab === 'pricing' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {slotPricing.map((slot) => (
            <div key={slot.slotLocation} className="bg-white border border-[#E5E2DC] rounded-xl p-6 shadow-2xs space-y-3">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                {slot.format}
              </span>
              <h3 className="font-serif font-bold text-lg text-gray-900">{slot.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{slot.description}</p>

              <div className="bg-[#FAF9F6] p-3 rounded-lg border border-[#EAE7DF] flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Monthly Rate</span>
                  <span className="font-extrabold text-amber-900 text-sm">LKR {slot.priceLKR.toLocaleString()}</span>
                  <span className="text-gray-500 text-[10px] ml-1">(/ ${slot.priceUSD})</span>
                </div>
                <span className="text-emerald-700 font-bold text-[11px]">{slot.estimatedImpressions}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
