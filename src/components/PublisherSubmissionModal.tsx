import React, { useState } from 'react';
import { PublisherCategory, PackageTier, PublisherSubmission } from '../types';
import { processPasteData } from '../utils/wordPasteHandler';
import { X, Award, CheckCircle2, Shield, Upload, FileText, Video, AlertCircle, ArrowRight, Lock, Send, Mail, CreditCard } from 'lucide-react';

interface PublisherSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: PublisherCategory;
  defaultPlatform?: 'econ_academy' | 'lanka_ink';
}

const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

export const PublisherSubmissionModal: React.FC<PublisherSubmissionModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'masterclass',
  defaultPlatform = 'econ_academy',
}) => {
  const [activeStep, setActiveStep] = useState<'packages' | 'sample_submit' | 'track_and_upload'>('packages');

  // Form State
  const [platformTarget, setPlatformTarget] = useState<'econ_academy' | 'lanka_ink'>(defaultPlatform);
  const [category, setCategory] = useState<PublisherCategory>(defaultCategory);
  const [packageTier, setPackageTier] = useState<PackageTier>('pro');

  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorPhone, setCreatorPhone] = useState('');
  const [affiliation, setAffiliation] = useState('');

  const [title, setTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  
  // Video & Sample options
  const [videoSubmissionType, setVideoSubmissionType] = useState<'youtube' | 'drive_link' | 'email_attachment'>('youtube');
  const [sampleVideoUrl, setSampleVideoUrl] = useState('');
  const [sampleDocumentUrl, setSampleDocumentUrl] = useState('');
  const [sampleGoogleDocUrl, setSampleGoogleDocUrl] = useState('');
  const [sampleText, setSampleText] = useState('');
  const [emailFileNotice, setEmailFileNotice] = useState('');

  const [proposedPriceLKR, setProposedPriceLKR] = useState('5000');

  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<PublisherSubmission | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Status Lookup state
  const [lookupTrackingId, setLookupTrackingId] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [foundSubmission, setFoundSubmission] = useState<PublisherSubmission | null>(null);
  const [lookupError, setLookupError] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'slips' | 'koko'>('card');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessTxRef, setPaymentSuccessTxRef] = useState('');

  // Step 2 Full Upload state
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleVideoUrl, setModuleVideoUrl] = useState('');
  const [moduleDuration, setModuleDuration] = useState('25 mins');
  const [moduleDesc, setModuleDesc] = useState('');
  const [modulesList, setModulesList] = useState<{ id: string; title: string; videoUrl: string; duration: string; description: string }[]>([]);
  
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [fullGoogleDocUrl, setFullGoogleDocUrl] = useState('');
  const [fullManuscriptText, setFullManuscriptText] = useState('');
  const [isUploadingFull, setIsUploadingFull] = useState(false);
  const [fullUploadSuccess, setFullUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const getPackageDetails = (tier: PackageTier) => {
    switch (tier) {
      case 'basic':
        return {
          title: 'Basic Independent Creator',
          priceLKR: 0,
          priceUSD: 0,
          sharePercent: 70,
          tagline: 'Ideal for independent scholars, poets, and guest lecturers starting out.',
          features: [
            '70% Tuition & Book Sales Payout',
            'Standard Staff Vetting (24-48 hours)',
            'Listing on Econ Academy / Lanka Ink catalog',
            'Monthly automated bank remittance',
          ],
          badgeColor: 'bg-slate-800 text-slate-100',
        };
      case 'pro':
        return {
          title: 'Pro Masterclass Partner',
          priceLKR: 10000,
          priceUSD: 35,
          sharePercent: 80,
          tagline: 'Recommended for university faculty, certified economists, and established authors.',
          features: [
            '80% Tuition & Book Sales Payout',
            'Priority Fast-Track Vetting (6 hours)',
            'Featured placement on Masterclass / Book hero section',
            'Dedicated Press Release dispatch to 42,000+ LankaEcon readers',
            'Direct Bank Wire / SLIPS Payout Guarantee',
          ],
          badgeColor: 'bg-amber-500 text-slate-950 font-extrabold',
        };
      case 'royal':
      default:
        return {
          title: 'Royal Fellow Commission',
          priceLKR: 25000,
          priceUSD: 85,
          sharePercent: 85,
          tagline: 'For former Central Bank governors, senior policy directors & celebrated literary masters.',
          features: [
            '85% Maximum Revenue Share Payout',
            'VIP Immediate Executive Vetting',
            'Full Instagram Story Blast (@lankaecon.lk live spotlight)',
            'Econ Academy Certified Diploma branding',
            'Instant 24-hour Payout Remittance Desk access',
          ],
          badgeColor: 'bg-rose-600 text-white font-extrabold',
        };
    }
  };

  const handleSampleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalAccepted) {
      setErrorMsg('You must review and accept the Binding Intellectual Property & Revenue Share Contract to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const details = getPackageDetails(packageTier);

    const body = {
      creatorName,
      creatorEmail,
      creatorPhone,
      affiliation,
      category,
      platformTarget,
      title,
      topicDescription,
      videoSubmissionType,
      sampleVideoUrl,
      sampleDocumentUrl: sampleGoogleDocUrl || sampleDocumentUrl,
      sampleGoogleDocUrl,
      sampleText,
      emailFileNotice,
      packageTier,
      packagePriceLKR: details.priceLKR,
      creatorSharePercentage: details.sharePercent,
      proposedPriceLKR: Number(proposedPriceLKR) || 0,
      legalAccepted: true,
    };

    try {
      const res = await fetch('/api/publishing/submit-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.submission) {
        setSubmissionResult(data.submission);
      } else {
        setErrorMsg(data.message || 'Failed to submit proposal.');
      }
    } catch {
      setErrorMsg('Network error submitting sample proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setFoundSubmission(null);

    try {
      const res = await fetch('/api/publishing/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: lookupTrackingId, email: lookupEmail }),
      });
      const data = await res.json();
      if (data.success && data.submission) {
        setFoundSubmission(data.submission);
        if (data.submission.fullContent?.modules) {
          setModulesList(data.submission.fullContent.modules);
        }
        if (data.submission.fullContent?.bookPdfUrl) {
          setBookPdfUrl(data.submission.fullContent.bookPdfUrl);
        }
      } else {
        setLookupError(data.message || 'No submission found matching those credentials.');
      }
    } catch {
      setLookupError('Network error checking status.');
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundSubmission) return;

    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/publishing/process-package-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: foundSubmission.id,
          paymentMethod,
          cardHolder: cardHolder || creatorName,
          cardNumber: cardNumber || '**** **** **** 8821',
        }),
      });
      const data = await res.json();
      if (data.success && data.submission) {
        setFoundSubmission(data.submission);
        setPaymentSuccessTxRef(data.txRef);
      } else {
        alert(data.message || 'Payment processing failed.');
      }
    } catch {
      alert('Error processing payment.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleAddModule = () => {
    if (!moduleTitle.trim()) return;
    const newMod = {
      id: `MOD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: moduleTitle,
      videoUrl: moduleVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: moduleDuration,
      description: moduleDesc,
    };
    setModulesList([...modulesList, newMod]);
    setModuleTitle('');
    setModuleVideoUrl('');
    setModuleDesc('');
  };

  const handleUploadFullContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundSubmission) return;

    setIsUploadingFull(true);
    try {
      const res = await fetch('/api/publishing/upload-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: foundSubmission.id,
          trackingId: foundSubmission.trackingId,
          modules: modulesList,
          bookPdfUrl,
          googleDocUrl: fullGoogleDocUrl,
          fullManuscriptText,
          publishedPriceLKR: Number(proposedPriceLKR) || foundSubmission.proposedPriceLKR,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFullUploadSuccess(true);
      }
    } catch {
      alert('Error uploading full work content.');
    } finally {
      setIsUploadingFull(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0B1E36] text-white w-full max-w-4xl border-2 border-[#0284C7] shadow-2xl rounded-lg my-4 sm:my-6 overflow-hidden relative flex flex-col max-h-[88vh] sm:max-h-[90vh]">
        
        {/* Header Bar with Clear Exit Button */}
        <div className="bg-[#071322] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#0284C7] text-white flex items-center justify-center font-extrabold shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="bg-[#DC2626] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-widest inline-block">
                GLOBAL PUBLISHER WORKSPACE
              </span>
              <h3 className="font-sans font-extrabold text-lg uppercase tracking-tight text-white">
                Submit Your Masterclass, Books & Literary Works
              </h3>
            </div>
          </div>

          {/* Explicit Exit / Close Button */}
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-red-700 text-slate-200 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Exit Popup Modal"
          >
            <span>Exit / Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="bg-[#0e2542] border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono font-bold shrink-0">
          <button
            onClick={() => setActiveStep('packages')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-2 ${
              activeStep === 'packages' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Packages & Category</span>
          </button>

          <span className="text-slate-600">→</span>

          <button
            onClick={() => setActiveStep('sample_submit')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-2 ${
              activeStep === 'sample_submit' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2. Sample & Topic Submission</span>
          </button>

          <span className="text-slate-600">→</span>

          <button
            onClick={() => setActiveStep('track_and_upload')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-2 ${
              activeStep === 'track_and_upload' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Check Status & Upload Full Work</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs leading-relaxed">
          
          {/* STEP 1: PACKAGES & CATEGORIES */}
          {activeStep === 'packages' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                <h4 className="font-bold text-sm text-amber-300 uppercase tracking-wide flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Choose Your Target Publishing Platform & Category</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Portal Platform</label>
                    <select
                      value={platformTarget}
                      onChange={(e) => setPlatformTarget(e.target.value as 'econ_academy' | 'lanka_ink')}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden font-bold"
                    >
                      <option value="econ_academy">Econ Academy (Courses, Masterclasses, Lectures)</option>
                      <option value="lanka_ink">Lanka Ink (Scholar Treatises, Literature, Poetry)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Content Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PublisherCategory)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden font-bold"
                    >
                      <option value="masterclass">🎓 Video Masterclass Series</option>
                      <option value="scholar_treatise">📜 Scholar Treatise / Academic Monograph</option>
                      <option value="lecture">🎙️ Guest Lecture & Policy Podcast</option>
                      <option value="book">📚 Published Book / Digital Volume</option>
                      <option value="ink_poetry">✍️ Lanka Ink Poetry / Essay / Literary Piece</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Package Tier Selection Cards */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Select Revenue & Promotion Package</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['basic', 'pro', 'royal'] as PackageTier[]).map((tier) => {
                    const info = getPackageDetails(tier);
                    const isSelected = packageTier === tier;
                    return (
                      <div
                        key={tier}
                        onClick={() => setPackageTier(tier)}
                        className={`border-2 p-4 cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0284C7] bg-[#0c2b4d]'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 ${info.badgeColor}`}>
                              {tier.toUpperCase()} TIER
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                            )}
                          </div>

                          <h5 className="font-bold text-sm text-white">{info.title}</h5>
                          <p className="text-[11px] text-slate-300">{info.tagline}</p>

                          <div className="py-2 border-y border-slate-800">
                            <div className="text-xl font-extrabold text-amber-300 font-mono">
                              {info.priceLKR === 0 ? 'FREE' : `LKR ${info.priceLKR.toLocaleString()}`}
                              <span className="text-xs text-slate-400 font-normal"> / one-time fee</span>
                            </div>
                            <div className="text-xs font-bold text-emerald-400 mt-0.5">
                              {info.sharePercent}% Revenue Share to You
                            </div>
                          </div>

                          <ul className="space-y-1.5 text-[11px] text-slate-300">
                            {info.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-sky-400 font-bold">•</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800">
                          <button
                            type="button"
                            className={`w-full py-2 font-bold uppercase text-xs text-center transition ${
                              isSelected ? 'bg-[#0284C7] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ Selected Package' : 'Select Package'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('sample_submit')}
                  className="bg-[#0284C7] hover:bg-sky-500 text-white font-extrabold text-xs px-6 py-3 uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Proceed to Sample Submission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: SAMPLE SUBMISSION FORM */}
          {activeStep === 'sample_submit' && (
            <div>
              {submissionResult ? (
                <div className="bg-emerald-950/80 border-2 border-emerald-500 p-6 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-lg uppercase text-white">Sample Submission Received & Logged!</h4>
                      <p className="text-xs text-emerald-200">
                        Your topic proposal and sample video have been recorded in our backend Staff Vetting Queue.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/60 p-4 border border-emerald-800 space-y-2 font-mono text-xs">
                    <div className="flex justify-between border-b border-emerald-900 pb-1">
                      <span className="text-emerald-400 font-bold">YOUR UNIQUE TRACKING CODE:</span>
                      <span className="text-amber-300 font-extrabold text-sm">{submissionResult.trackingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Creator Email:</span>
                      <span className="text-white">{submissionResult.creatorEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="text-white uppercase">{submissionResult.category} ({submissionResult.platformTarget})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Package Tier:</span>
                      <span className="text-amber-400 uppercase font-bold">{submissionResult.packageTier} ({submissionResult.creatorSharePercentage}% Creator Share)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Status:</span>
                      <span className="bg-amber-500 text-black px-2 py-0.5 font-extrabold text-[10px] uppercase">
                        PENDING STAFF VETTING
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 border border-slate-800 space-y-2">
                    <h5 className="font-bold text-amber-300 uppercase text-xs">What Happens Next?</h5>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                      <li>Our Editorial & Faculty employees will review your sample video/draft.</li>
                      <li>An automatic notification will be recorded under your tracking code <strong>{submissionResult.trackingId}</strong>.</li>
                      <li>Once approved, return to this pop-up modal, select Step 3, enter tracking code <strong>{submissionResult.trackingId}</strong>, complete payment if applicable, and upload full masterclass lessons or full book manuscripts!</li>
                    </ol>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setSubmissionResult(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 text-xs font-bold uppercase"
                    >
                      Submit Another Work
                    </button>

                    <button
                      onClick={() => setActiveStep('track_and_upload')}
                      className="bg-[#0284C7] hover:bg-sky-500 text-white px-5 py-2 text-xs font-extrabold uppercase flex items-center gap-2"
                    >
                      <span>Check Status & Upload Full Work</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSampleSubmit} className="space-y-5">
                  
                  <div className="bg-slate-900 p-4 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold uppercase text-xs">Selected Package:</span>
                      <h4 className="text-white font-extrabold text-sm">
                        {getPackageDetails(packageTier).title} ({getPackageDetails(packageTier).sharePercent}% Creator Share)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStep('packages')}
                      className="text-xs text-[#0284C7] hover:underline font-bold"
                    >
                      Change Package ✎
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-950 border border-red-600 text-red-200 p-3 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Creator Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Full Name / Faculty Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Howard Marks, CFA"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. h.marks@university.lk"
                        value={creatorEmail}
                        onChange={(e) => setCreatorEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Phone / WhatsApp Contact</label>
                      <input
                        type="text"
                        placeholder="+94 77 123 4567"
                        value={creatorPhone}
                        onChange={(e) => setCreatorPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">University / Corporate Affiliation</label>
                      <input
                        type="text"
                        placeholder="e.g. University of Colombo / Central Bank Fellow"
                        value={affiliation}
                        onChange={(e) => setAffiliation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs"
                      />
                    </div>
                  </div>

                  {/* Work Topic & Sample Info */}
                  <div className="space-y-4 border-t border-slate-800 pt-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Masterclass / Book Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Masterclass: Advanced Econometrics & Central Banking Yield Curves"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Topic Description & Learning Objectives *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detailed outline of what you will teach or publish, target audience, and key economic takeaways..."
                        value={topicDescription}
                        onChange={(e) => setTopicDescription(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs"
                      />
                    </div>

                    {/* Video Vetting & Sample Submission Section */}
                    <div className="bg-slate-900 p-4 border border-slate-800 space-y-4">
                      <div>
                        <label className="block text-amber-300 font-extrabold text-xs uppercase mb-2">
                          Choose Video Submission Method for Staff Vetting *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setVideoSubmissionType('youtube')}
                            className={`p-3 border rounded text-left flex items-center gap-2 transition cursor-pointer ${
                              videoSubmissionType === 'youtube'
                                ? 'bg-[#0284C7] text-white border-sky-400'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <Video className="w-4 h-4 text-red-400 shrink-0" />
                            <div>
                              <div>YouTube Video Link</div>
                              <div className="text-[10px] font-normal opacity-80">Public or Unlisted URL</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setVideoSubmissionType('drive_link')}
                            className={`p-3 border rounded text-left flex items-center gap-2 transition cursor-pointer ${
                              videoSubmissionType === 'drive_link'
                                ? 'bg-[#0284C7] text-white border-sky-400'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <div>Cloud Storage Link</div>
                              <div className="text-[10px] font-normal opacity-80">Google Drive / Dropbox</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setVideoSubmissionType('email_attachment')}
                            className={`p-3 border rounded text-left flex items-center gap-2 transition cursor-pointer ${
                              videoSubmissionType === 'email_attachment'
                                ? 'bg-[#0284C7] text-white border-sky-400'
                                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <div>Email File Attachment</div>
                              <div className="text-[10px] font-normal opacity-80">Direct to Vetting Desk</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {videoSubmissionType === 'youtube' && (
                        <div className="space-y-2">
                          <label className="block text-slate-300 font-bold text-xs flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-red-500" />
                            <span>YouTube Video / Lesson Preview Link (Public or Unlisted) *</span>
                          </label>
                          <input
                            type="url"
                            required={category === 'masterclass' || category === 'lecture'}
                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                            value={sampleVideoUrl}
                            onChange={(e) => setSampleVideoUrl(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs font-mono"
                          />

                          {sampleVideoUrl && (sampleVideoUrl.includes('youtube') || sampleVideoUrl.includes('youtu.be')) && (
                            <div className="bg-slate-950 p-2 border border-slate-800 space-y-1">
                              <span className="text-[10px] text-amber-400 font-bold uppercase">Video Player Preview Test:</span>
                              <div className="aspect-video w-full max-w-sm rounded overflow-hidden border border-slate-700">
                                <iframe
                                  src={getYouTubeEmbedUrl(sampleVideoUrl)}
                                  title="YouTube Video Vetting Preview"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {videoSubmissionType === 'drive_link' && (
                        <div className="space-y-2">
                          <label className="block text-slate-300 font-bold text-xs">
                            Google Drive / Dropbox / WeTransfer Video Link *
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="e.g. https://drive.google.com/file/d/1ABC.../view"
                            value={sampleVideoUrl}
                            onChange={(e) => setSampleVideoUrl(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs font-mono"
                          />
                        </div>
                      )}

                      {videoSubmissionType === 'email_attachment' && (
                        <div className="bg-amber-950/60 border border-amber-600/80 p-3 space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-amber-300 font-bold">
                            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Vetting Desk Direct Email Dispatch Mode</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            If your video is unpublished or not hosted online, send your video file or manuscript draft directly via email to our editorial team at{' '}
                            <strong className="text-amber-300 font-mono">vetting@lankaecon.lk</strong>.
                          </p>
                          <textarea
                            rows={2}
                            placeholder="Optional: Note email subject line or attachment file name (e.g. Sent via email from h.marks@colombo.lk on Friday)"
                            value={emailFileNotice}
                            onChange={(e) => setEmailFileNotice(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs"
                          />
                          <a
                            href={`mailto:vetting@lankaecon.lk?subject=${encodeURIComponent(`Publishing Vetting Draft: ${title}`)}&body=${encodeURIComponent(`Dear LankaEcon Vetting Desk,\n\nPlease find attached my video lesson draft for "${title}".\n\nCreator: ${creatorName}\nEmail: ${creatorEmail}\nPhone: ${creatorPhone}`)}`}
                            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] px-3 py-1.5 uppercase transition"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Open Mail App to Send File Attachment</span>
                          </a>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1 text-xs">
                            <FileText className="w-3.5 h-3.5 text-sky-400" />
                            <span>Google Doc URL (Live Embedded Document)</span>
                          </label>
                          <input
                            type="url"
                            placeholder="e.g. https://docs.google.com/document/d/.../edit"
                            value={sampleGoogleDocUrl}
                            onChange={(e) => setSampleGoogleDocUrl(e.target.value)}
                            className="w-full bg-slate-950 border border-emerald-500/80 p-2.5 text-white focus:border-emerald-400 outline-hidden text-xs"
                          />
                          <p className="text-[10px] text-emerald-400 mt-1">✨ Connect your Google Doc to preserve 100% of tables, equations, bold/italics, and live formatting!</p>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1 text-xs">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Sample PDF / Drive Link</span>
                          </label>
                          <input
                            type="url"
                            placeholder="e.g. https://drive.google.com/file/d/..."
                            value={sampleDocumentUrl}
                            onChange={(e) => setSampleDocumentUrl(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-slate-300 font-bold mb-1 text-xs">Proposed Tuition Fee per Student (LKR) *</label>
                        <input
                          type="number"
                          required
                          placeholder="5000"
                          value={proposedPriceLKR}
                          onChange={(e) => setProposedPriceLKR(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs font-mono"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-slate-300 font-bold text-xs">
                            Sample Text / Executive Abstract Excerpt
                          </label>
                          <span className="text-[10px] text-sky-400 font-mono">📋 Word / Docs Paste Supported</span>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Paste introductory chapter excerpt or lecture transcript excerpt directly from MS Word or Google Docs..."
                          value={sampleText}
                          onPaste={(e) => {
                            const res = processPasteData(e.clipboardData);
                            if (res && res.formattedContent) {
                              e.preventDefault();
                              setSampleText(res.formattedContent);
                            }
                          }}
                          onChange={(e) => setSampleText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs font-serif"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">💡 Copying directly from Word or Google Docs automatically converts and preserves tables, headings, and bullet points.</p>
                      </div>
                    </div>

                    {/* BINDING LEGAL CONTRACT AGREEMENT */}
                    <div className="bg-slate-950 border-2 border-amber-500/60 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <Lock className="w-4 h-4" />
                        <span>BINDING INTELLECTUAL PROPERTY & REMITTANCE AGREEMENT</span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        By submitting your work to LankaEcon / Econ Academy, you affirm that:
                        <br />
                        1. You are the sole author/creator of this material and retain copyright.
                        <br />
                        2. You grant LankaEcon a non-exclusive license to market and distribute this course/book.
                        <br />
                        3. Tuition and book earnings will be remitted to your bank account via SLIPS/Bank Wire under the agreed {getPackageDetails(packageTier).sharePercent}% Creator Share ratio.
                      </p>

                      <label className="flex items-start gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={legalAccepted}
                          onChange={(e) => setLegalAccepted(e.target.checked)}
                          className="mt-0.5 accent-[#0284C7]"
                        />
                        <span className="text-xs font-bold text-white">
                          I have read, understood, and accept these binding legal publishing terms.
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep('packages')}
                        className="bg-slate-800 text-slate-300 px-4 py-2 text-xs font-bold uppercase"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#0284C7] hover:bg-sky-500 text-white font-extrabold text-xs px-6 py-3 uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Submitting Proposal...' : 'Submit Sample & Proposal for Employee Vetting'}</span>
                      </button>
                    </div>

                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 3: CHECK STATUS & UPLOAD FULL WORK */}
          {activeStep === 'track_and_upload' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-4 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-amber-300 uppercase">
                  Check Submission Vetting Status
                </h4>
                <p className="text-slate-300 text-xs">
                  Enter your unique Tracking Code (e.g. <code>PUB-2026-XXXX</code>) or Email address to inspect employee feedback or upload full masterclass lessons once approved.
                </p>

                <form onSubmit={handleLookupStatus} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Tracking Code (PUB-2026-...) or Email"
                    value={lookupTrackingId || lookupEmail}
                    onChange={(e) => {
                      setLookupTrackingId(e.target.value);
                      setLookupEmail(e.target.value);
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-[#0284C7] outline-hidden text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-[#0284C7] hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 uppercase tracking-wider transition shrink-0"
                  >
                    Check Status
                  </button>
                </form>

                {lookupError && (
                  <p className="text-red-400 font-bold text-xs">{lookupError}</p>
                )}
              </div>

              {/* Found Submission Card */}
              {foundSubmission && (
                <div className="bg-slate-900 border-2 border-[#0284C7] p-5 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Tracking Code: {foundSubmission.trackingId}</span>
                      <h4 className="font-serif font-bold text-base text-white">{foundSubmission.title}</h4>
                      <p className="text-xs text-slate-300">Creator: {foundSubmission.creatorName} ({foundSubmission.creatorEmail})</p>
                    </div>

                    <div>
                      {foundSubmission.status === 'pending_vetting' && (
                        <span className="bg-amber-500 text-black px-3 py-1 font-extrabold text-xs uppercase flex items-center gap-1">
                          <span>🔒 PENDING EMPLOYEE VETTING</span>
                        </span>
                      )}
                      {(foundSubmission.status === 'sample_approved' || foundSubmission.status === 'paid_approved') && (
                        <span className="bg-emerald-500 text-black px-3 py-1 font-extrabold text-xs uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PROPOSAL VETTED & APPROVED</span>
                        </span>
                      )}
                      {foundSubmission.status === 'full_published' && (
                        <span className="bg-sky-500 text-white px-3 py-1 font-extrabold text-xs uppercase">
                          🎉 LIVE PUBLISHED ON SITE
                        </span>
                      )}
                      {foundSubmission.status === 'rejected' && (
                        <span className="bg-red-600 text-white px-3 py-1 font-extrabold text-xs uppercase">
                          SUBMISSION REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  {foundSubmission.staffFeedback && (
                    <div className="bg-emerald-950/80 border-l-4 border-emerald-500 p-3 text-xs text-emerald-200">
                      <strong>Editorial Vetting Feedback:</strong> {foundSubmission.staffFeedback}
                    </div>
                  )}

                  {/* PACKAGE PAYMENT CHECKOUT (If approved, has fee, and not paid yet) */}
                  {(foundSubmission.status === 'sample_approved' || foundSubmission.status === 'paid_approved') && foundSubmission.packagePriceLKR > 0 && !foundSubmission.isPaid && (
                    <div className="bg-slate-950 border-2 border-amber-500 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase">
                          <CreditCard className="w-5 h-5 text-amber-400" />
                          <span>Package Activation Payment Required</span>
                        </div>
                        <span className="bg-amber-500 text-black font-extrabold text-xs px-2.5 py-0.5 uppercase font-mono">
                          LKR {foundSubmission.packagePriceLKR.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">
                        Your sample has been approved! Complete your {foundSubmission.packageTier.toUpperCase()} Package registration payment to unlock full video lesson uploads and priority editorial publishing.
                      </p>

                      <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Select Payment Method</label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('card')}
                              className={`p-2 border rounded font-bold transition text-center cursor-pointer ${
                                paymentMethod === 'card' ? 'bg-[#0284C7] text-white border-sky-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                              }`}
                            >
                              Credit / Debit Card
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('slips')}
                              className={`p-2 border rounded font-bold transition text-center cursor-pointer ${
                                paymentMethod === 'slips' ? 'bg-[#0284C7] text-white border-sky-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                              }`}
                            >
                              Bank SLIPS Wire
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('koko')}
                              className={`p-2 border rounded font-bold transition text-center cursor-pointer ${
                                paymentMethod === 'koko' ? 'bg-[#0284C7] text-white border-sky-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                              }`}
                            >
                              Koko Pay in 3
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Cardholder / Account Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="Name on card / bank account"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 p-2 text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Card / Account Ref Number *</label>
                            <input
                              type="text"
                              required
                              placeholder="4532 **** **** 8821"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 p-2 text-white font-mono text-xs"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isProcessingPayment}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs py-3 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{isProcessingPayment ? 'Processing Payment Gateway...' : `Pay LKR ${foundSubmission.packagePriceLKR.toLocaleString()} & Unlock Full Upload Portal`}</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {paymentSuccessTxRef && (
                    <div className="bg-emerald-950 border border-emerald-500 p-3 text-emerald-200 text-xs font-mono font-bold flex items-center justify-between">
                      <span>✓ Package Activation Payment Verified!</span>
                      <span className="text-amber-300">TxRef: {paymentSuccessTxRef}</span>
                    </div>
                  )}

                  {/* If Sample Approved or Paid, Show Full Work Upload Interface */}
                  {(foundSubmission.status === 'sample_approved' || foundSubmission.status === 'paid_approved') && (foundSubmission.packagePriceLKR === 0 || foundSubmission.isPaid) && (
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
                        <Upload className="w-5 h-5" />
                        <span>Step 2: Upload Full Masterclass Lessons / Full Book Content</span>
                      </div>

                      {fullUploadSuccess ? (
                        <div className="bg-emerald-950 border border-emerald-500 p-4 text-emerald-200 font-bold text-xs space-y-2">
                          <p>🎉 Full Masterclass / Book work has been uploaded and successfully published live on the website!</p>
                          <p className="text-[11px] text-slate-300">Students and readers can now enroll and access your work.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleUploadFullContent} className="space-y-4">
                          
                          {foundSubmission.category === 'masterclass' || foundSubmission.category === 'lecture' ? (
                            <div className="space-y-3">
                              <h5 className="font-bold text-xs text-amber-300 uppercase">Masterclass Modules & Lessons:</h5>
                              
                              <div className="bg-slate-900 p-3 border border-slate-800 space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Lesson Title (e.g. Module 1: CBSL Monetary Operations)"
                                    value={moduleTitle}
                                    onChange={(e) => setModuleTitle(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 p-2 text-white text-xs"
                                  />
                                  <input
                                    type="url"
                                    placeholder="Video Embed / YouTube URL"
                                    value={moduleVideoUrl}
                                    onChange={(e) => setModuleVideoUrl(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 p-2 text-white text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Duration (e.g. 35 mins)"
                                    value={moduleDuration}
                                    onChange={(e) => setModuleDuration(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 p-2 text-white text-xs"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Short Module Summary"
                                    value={moduleDesc}
                                    onChange={(e) => setModuleDesc(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 p-2 text-white text-xs"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddModule}
                                  className="bg-amber-600 hover:bg-amber-700 text-black font-extrabold text-xs px-3 py-1.5 uppercase transition cursor-pointer"
                                >
                                  + Add Module to Lesson List
                                </button>
                              </div>

                              {modulesList.length > 0 && (
                                <div className="space-y-1">
                                  <span className="font-bold text-xs text-slate-300">Added Modules ({modulesList.length}):</span>
                                  {modulesList.map((m, idx) => (
                                    <div key={m.id} className="bg-slate-900 p-2 text-xs flex justify-between items-center border border-slate-800">
                                      <span className="text-white font-bold">{idx + 1}. {m.title} ({m.duration})</span>
                                      <span className="text-slate-400 font-mono text-[10px] truncate max-w-xs">{m.videoUrl}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-emerald-300 font-bold mb-1 flex items-center gap-1 text-xs">
                                  <FileText className="w-4 h-4 text-emerald-400" />
                                  <span>Google Doc URL (Live Embedded Document)</span>
                                </label>
                                <input
                                  type="url"
                                  placeholder="e.g. https://docs.google.com/document/d/.../edit"
                                  value={fullGoogleDocUrl}
                                  onChange={(e) => setFullGoogleDocUrl(e.target.value)}
                                  className="w-full bg-slate-950 border border-emerald-500 p-2 text-white text-xs outline-none"
                                />
                                <p className="text-[10px] text-emerald-400 mt-1">✨ Connect your Google Doc to publish live with all tables, equations, formatting, and images preserved!</p>
                              </div>

                              <div>
                                <label className="block text-slate-300 font-bold mb-1">Full Book / Treatise PDF Download Link</label>
                                <input
                                  type="url"
                                  placeholder="e.g. https://drive.google.com/file/d/.../view"
                                  value={bookPdfUrl}
                                  onChange={(e) => setBookPdfUrl(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="block text-slate-300 font-bold">Full Manuscript / Poem / Essay Text</label>
                                  <span className="text-[10px] text-sky-400 font-mono">📋 Word / Docs Paste Supported</span>
                                </div>
                                <textarea
                                  rows={8}
                                  placeholder="Paste complete manuscript here. Copying directly from MS Word or Google Docs automatically converts and preserves tables, headings, and bullet lists..."
                                  value={fullManuscriptText}
                                  onPaste={(e) => {
                                    const res = processPasteData(e.clipboardData);
                                    if (res && res.formattedContent) {
                                      e.preventDefault();
                                      setFullManuscriptText(res.formattedContent);
                                    }
                                  }}
                                  onChange={(e) => setFullManuscriptText(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 p-2.5 text-white text-xs font-serif leading-relaxed"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">💡 Copying directly from Word or Google Docs automatically converts and preserves tables, headings, and bullet points.</p>
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isUploadingFull}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 uppercase tracking-wider transition cursor-pointer shadow-md"
                          >
                            {isUploadingFull ? 'Publishing Live...' : 'Publish Full Work Live to Website'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer with Secondary Exit Button */}
        <div className="bg-[#071322] border-t border-slate-800 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Platform | Central Bank & Copyright Compliant</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 uppercase transition cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
