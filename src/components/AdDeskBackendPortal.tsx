import React, { useState, useEffect } from 'react';
import { AdCampaign, AdStatus, AdEmailLog, EmployeeRecord, AdSlotLocation } from '../types';
import { LANKAECON_AD_SLOTS } from '../data/adSlotsData';
import { downloadAdSpecPdf } from '../utils/adSpecPdfGenerator';
import { VisualAdSlotMap } from './VisualAdSlotMap';
import {
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Search,
  ExternalLink,
  Phone,
  Landmark,
  ShieldCheck,
  Send,
  Eye,
  Mail,
  AlertTriangle,
  RefreshCw,
  Building2,
  FileCheck,
  CreditCard,
  Layers,
  Sparkles,
  Trash2,
  FileDown,
  LayoutTemplate,
  Edit3,
  RotateCcw,
  ArrowUpDown,
  FileText,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

interface AdDeskBackendPortalProps {
  currentUser: EmployeeRecord | null;
  onRefreshLiveAds?: () => void;
}

export const AdDeskBackendPortal: React.FC<AdDeskBackendPortalProps> = ({
  currentUser,
  onRefreshLiveAds,
}) => {
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [emailLogs, setEmailLogs] = useState<AdEmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [slotFilter, setSlotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdForAction, setSelectedAdForAction] = useState<AdCampaign | null>(null);

  // Modals & Panels
  const [showVisualMapModal, setShowVisualMapModal] = useState(false);
  const [showEmailLogsModal, setShowEmailLogsModal] = useState(false);
  const [editingAd, setEditingAd] = useState<AdCampaign | null>(null);
  const [reassigningSlotAd, setReassigningSlotAd] = useState<AdCampaign | null>(null);
  const [newTargetSlot, setNewTargetSlot] = useState<AdSlotLocation>('sidebar_top');
  const [republishingAd, setRepublishingAd] = useState<AdCampaign | null>(null);
  const [republishDays, setRepublishDays] = useState<number>(30);
  const [viewingTaxInvoiceAd, setViewingTaxInvoiceAd] = useState<AdCampaign | null>(null);

  // Ad Deletion & Accounting Reconciliation Modal State
  const [adToDeleteModal, setAdToDeleteModal] = useState<AdCampaign | null>(null);
  const [deleteAccountingAction, setDeleteAccountingAction] = useState<'void_and_reconcile' | 'full_expunge' | 'record_refund'>('void_and_reconcile');
  const [deleteAuditReason, setDeleteAuditReason] = useState<string>('Client Requested Cancellation');
  const [customAuditReason, setCustomAuditReason] = useState<string>('');
  const [isDeletingWithAccounting, setIsDeletingWithAccounting] = useState<boolean>(false);

  // Review & Approval Action Form state
  const [staffFeedback, setStaffFeedback] = useState('');
  const [quoteAdjustmentLKR, setQuoteAdjustmentLKR] = useState<string>('');
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  // Bank Account Flagging Form state
  const [selectedCompanyBankAccount, setSelectedCompanyBankAccount] = useState('Commercial Bank Corporate A/C #8810293019');
  const [bankAuditNote, setBankAuditNote] = useState('');
  const [isProcessingBankFlag, setIsProcessingBankFlag] = useState(false);

  // Publish Live state
  const [isPublishingLive, setIsPublishingLive] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Edit Ad Form State
  const [editTitle, setEditTitle] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editTargetUrl, setEditTargetUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editFormat, setEditFormat] = useState<'banner' | 'card'>('banner');
  const [editBadgeText, setEditBadgeText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ads/all');
      const data = await res.json();
      if (data.success && data.ads) {
        setAds(data.ads);
        if (data.emailLogs) {
          setEmailLogs(data.emailLogs);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ad campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleApproveAd = async (ad: AdCampaign) => {
    setIsProcessingApproval(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch('/api/ads/staff-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ad.id,
          staffId: currentUser?.id || 'emp-staff-01',
          staffName: currentUser?.name || 'Editorial Commercial Desk',
          feedback: staffFeedback || 'Ad creative verified and approved by LankaEcon Editorial Board.',
          quotedAmount: quoteAdjustmentLKR ? Number(quoteAdjustmentLKR) : ad.amountPaid,
          quotedCurrency: ad.currency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`✅ Ad ${ad.id} APPROVED! Automated invoice & corporate bank details email dispatched to ${ad.advertiserEmail}.`);
        setStaffFeedback('');
        setQuoteAdjustmentLKR('');
        setSelectedAdForAction(null);
        fetchAds();
        if (onRefreshLiveAds) onRefreshLiveAds();
      } else {
        alert(data.error || 'Failed to approve ad.');
      }
    } catch {
      alert('Error approving advertisement.');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleRejectAd = async (ad: AdCampaign) => {
    if (!staffFeedback.trim()) {
      alert('Please provide feedback or reason for rejecting the advertisement.');
      return;
    }
    setIsProcessingApproval(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch('/api/ads/staff-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ad.id,
          staffId: currentUser?.id || 'emp-staff-01',
          staffName: currentUser?.name || 'Editorial Commercial Desk',
          feedback: staffFeedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`Ad ${ad.id} marked as rejected and notification email sent to ${ad.advertiserEmail}.`);
        setStaffFeedback('');
        setSelectedAdForAction(null);
        fetchAds();
      } else {
        alert(data.error || 'Failed to reject ad.');
      }
    } catch {
      alert('Error updating ad status.');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleFlagBankPayment = async (ad: AdCampaign) => {
    setIsProcessingBankFlag(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch('/api/ads/flag-bank-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ad.id,
          staffId: currentUser?.id || 'emp-finance-01',
          staffName: currentUser?.name || 'Finance Verification Desk',
          bankDepositAccount: selectedCompanyBankAccount,
          auditNote: bankAuditNote || `Deposit reconciled in ${selectedCompanyBankAccount} on ${new Date().toLocaleDateString()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`💰 Bank deposit verified and FLAGGED in "${selectedCompanyBankAccount}"! Official IRD Tax Invoice generated and General Ledger synced.`);
        setBankAuditNote('');
        setSelectedAdForAction(null);
        fetchAds();
      } else {
        alert(data.error || 'Failed to flag payment.');
      }
    } catch {
      alert('Error verifying bank deposit.');
    } finally {
      setIsProcessingBankFlag(false);
    }
  };

  const handlePublishLive = async (ad: AdCampaign) => {
    setIsPublishingLive(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch('/api/ads/publish-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ad.id,
          staffId: currentUser?.id || 'emp-ops-01',
          staffName: currentUser?.name || 'Ad Operations Desk',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`🚀 Campaign ${ad.id} is now LIVE on LankaEcon! Live broadcast confirmation email dispatched to ${ad.advertiserEmail}.`);
        setSelectedAdForAction(null);
        fetchAds();
        if (onRefreshLiveAds) onRefreshLiveAds();
      } else {
        alert(data.error || 'Failed to publish ad.');
      }
    } catch {
      alert('Error publishing campaign.');
    } finally {
      setIsPublishingLive(false);
    }
  };

  const handleRepublishAd = async () => {
    if (!republishingAd) return;
    try {
      const res = await fetch('/api/ads/republish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: republishingAd.id,
          staffName: currentUser?.name || 'Commercial Publishing Desk',
          durationDays: republishDays,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`🔁 Ad "${republishingAd.title}" (Ref: ${republishingAd.id}) re-published live for ${republishDays} days!`);
        setRepublishingAd(null);
        fetchAds();
        if (onRefreshLiveAds) onRefreshLiveAds();
      } else {
        alert(data.error || 'Failed to re-publish ad.');
      }
    } catch {
      alert('Error re-publishing advertisement.');
    }
  };

  const handleReassignSlot = async () => {
    if (!reassigningSlotAd) return;
    try {
      const res = await fetch('/api/ads/reassign-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reassigningSlotAd.id,
          newSlotLocation: newTargetSlot,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`📍 Ad "${reassigningSlotAd.title}" reassigned to slot "${newTargetSlot}". Slot isolation is strictly preserved.`);
        setReassigningSlotAd(null);
        fetchAds();
        if (onRefreshLiveAds) onRefreshLiveAds();
      } else {
        alert(data.error || 'Failed to reassign slot.');
      }
    } catch {
      alert('Error reassigning slot.');
    }
  };

  const handleOpenEdit = (ad: AdCampaign) => {
    setEditingAd(ad);
    setEditTitle(ad.title || '');
    setEditTagline(ad.tagline || ad.businessDescription || '');
    setEditTargetUrl(ad.targetUrl || '');
    setEditImageUrl(ad.imageUrl || '');
    setEditPhoneNumber(ad.phoneNumber || '');
    setEditFormat(ad.adFormat === 'banner' ? 'banner' : 'card');
    setEditBadgeText(ad.badgeText || '');
  };

  const handleSaveEdit = async () => {
    if (!editingAd) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/ads/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAd.id,
          title: editTitle,
          tagline: editTagline,
          targetUrl: editTargetUrl,
          imageUrl: editImageUrl,
          phoneNumber: editPhoneNumber,
          adFormat: editFormat,
          badgeText: editBadgeText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`✏️ Ad "${editingAd.title}" (Ref: ${editingAd.id}) updated successfully!`);
        setEditingAd(null);
        fetchAds();
        if (onRefreshLiveAds) onRefreshLiveAds();
      } else {
        alert(data.error || 'Failed to save changes.');
      }
    } catch {
      alert('Error updating advertisement.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteAd = (ad: AdCampaign) => {
    setAdToDeleteModal(ad);
    setDeleteAccountingAction('void_and_reconcile');
    setDeleteAuditReason('Client Requested Cancellation');
    setCustomAuditReason('');
  };

  const executeDeleteAdWithAccounting = async () => {
    if (!adToDeleteModal) return;

    const ad = adToDeleteModal;
    const finalReason = customAuditReason.trim() || deleteAuditReason;
    const staffName = currentUser?.fullName || 'Editorial Ad Desk';

    setIsDeletingWithAccounting(true);
    setIsDeletingId(ad.id);
    setActionSuccessMsg('');

    try {
      const res = await fetch('/api/ads/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ad.id,
          accountingAction: deleteAccountingAction,
          auditReason: finalReason,
          staffName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const recon = data.accountingReconciliation;
        let reconMsg = `🗑️ Ad Banner "${ad.title}" (Ref: ${ad.id}) was permanently removed. Slot "${ad.slotLocation}" is now open.`;
        if (recon) {
          if (recon.action === 'void_and_reconcile') {
            reconMsg += ` ⚖️ General Ledger Reconciled: IRD Invoices marked VOID, Output Taxes (VAT 18% & SSCL 2.5%) reversed (-Rs. ${(recon.vatTaxLKR + recon.ssclTaxLKR).toLocaleString()}).`;
          } else if (recon.action === 'record_refund') {
            reconMsg += ` 💳 Client Refund Registered in Cashbook (-Rs. ${recon.amountLKR.toLocaleString()}).`;
          } else {
            reconMsg += ` 🧹 Database and draft tax records expunged cleanly.`;
          }
        }
        setActionSuccessMsg(reconMsg);
        setAdToDeleteModal(null);
        if (selectedAdForAction?.id === ad.id) {
          setSelectedAdForAction(null);
        }
        await fetchAds();
        if (onRefreshLiveAds) onRefreshLiveAds();
      } else {
        alert(data.error || 'Failed to delete advertisement banner.');
      }
    } catch {
      alert('Network error while deleting advertisement.');
    } finally {
      setIsDeletingWithAccounting(false);
      setIsDeletingId(null);
    }
  };

  const filteredAds = ads.filter((ad) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? ad.status === 'pending_review' || ad.status === 'pending_approval'
        : statusFilter === 'approved'
        ? ad.status === 'approved_pending_payment'
        : statusFilter === 'payment_submitted'
        ? ad.status === 'payment_submitted'
        : statusFilter === 'payment_verified'
        ? ad.status === 'payment_verified'
        : statusFilter === 'active'
        ? ad.status === 'active'
        : statusFilter === 'rejected'
        ? ad.status === 'rejected'
        : true;

    const matchesSlot =
      slotFilter === 'all'
        ? true
        : slotFilter === 'feed_inline_1'
        ? ad.slotLocation === 'feed_inline_1' || ad.slotLocation === 'feed_inline'
        : ad.slotLocation === slotFilter;

    const matchesSearch =
      searchQuery === '' ||
      ad.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.advertiserEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.phoneNumber && ad.phoneNumber.includes(searchQuery));

    return matchesStatus && matchesSlot && matchesSearch;
  });

  // Pipeline counts
  const pendingReviewCount = ads.filter((a) => a.status === 'pending_review' || a.status === 'pending_approval').length;
  const approvedAwaitingPaymentCount = ads.filter((a) => a.status === 'approved_pending_payment').length;
  const paymentSubmittedCount = ads.filter((a) => a.status === 'payment_submitted').length;
  const paymentVerifiedCount = ads.filter((a) => a.status === 'payment_verified').length;
  const activeCount = ads.filter((a) => a.status === 'active').length;

  // Financial calculations
  const totalVerifiedRevenueLKR = ads
    .filter((a) => a.status === 'payment_verified' || a.status === 'active')
    .reduce((sum, a) => sum + (a.currency === 'LKR' ? a.amountPaid : a.amountPaid * 300), 0);

  const pendingReceivablesLKR = ads
    .filter((a) => a.status === 'approved_pending_payment' || a.status === 'payment_submitted')
    .reduce((sum, a) => sum + (a.currency === 'LKR' ? a.amountPaid : a.amountPaid * 300), 0);

  const totalGrossBillingsLKR = totalVerifiedRevenueLKR + pendingReceivablesLKR;
  const accruedVatTaxLKR = Math.round(totalVerifiedRevenueLKR * 0.18 / (1 + 0.18 + 0.025));
  const accruedSsclTaxLKR = Math.round(totalVerifiedRevenueLKR * 0.025 / (1 + 0.18 + 0.025));

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Metrics */}
      <div className="bg-[#0B1E36] text-white p-6 border-b-4 border-amber-500 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest rounded-xs">
                COMMERCIAL DESK & CENTRAL DATABASE
              </span>
              <span className="text-xs text-amber-300 font-bold">
                Logged in as: {currentUser?.name || 'Staff Member'} ({currentUser?.role?.toUpperCase() || 'EDITOR'})
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-amber-400" />
              <span>Commercial Ads Master Database & Financials</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              End-to-end management of all commercial advertisements: vetting, strict slot isolation, bank account reconciliations, IRD tax invoicing, and general ledger synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Visual Map Button */}
            <button
              onClick={() => setShowVisualMapModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Visual Ad Map</span>
            </button>

            {/* Download Official PDF */}
            <button
              onClick={() => downloadAdSpecPdf()}
              className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-600 text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Ad Spec PDF</span>
            </button>

            <button
              onClick={() => setShowEmailLogsModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Emails ({emailLogs.length})</span>
            </button>

            <button
              onClick={fetchAds}
              className="bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Financial & Pipeline Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-4 border-t border-slate-800">
          <div
            onClick={() => setStatusFilter('pending')}
            className={`p-3 rounded-xs border cursor-pointer transition ${
              statusFilter === 'pending'
                ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-between">
              <span>Pending Review</span>
              <Clock className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{pendingReviewCount}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Needs Team Approval</div>
          </div>

          <div
            onClick={() => setStatusFilter('approved')}
            className={`p-3 rounded-xs border cursor-pointer transition ${
              statusFilter === 'approved'
                ? 'bg-blue-950/70 border-blue-400 text-blue-200'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center justify-between">
              <span>Awaiting Payment</span>
              <Mail className="w-3 h-3 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{approvedAwaitingPaymentCount}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Invoice Dispatched</div>
          </div>

          <div
            onClick={() => setStatusFilter('payment_submitted')}
            className={`p-3 rounded-xs border cursor-pointer transition ${
              statusFilter === 'payment_submitted'
                ? 'bg-orange-950/70 border-orange-400 text-orange-200 ring-2 ring-orange-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-orange-400 flex items-center justify-between">
              <span>Needs Bank Flag</span>
              <Landmark className="w-3 h-3 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{paymentSubmittedCount}</div>
            <div className="text-[9px] text-orange-300 font-bold mt-0.5">Verify in Bank A/C</div>
          </div>

          <div
            onClick={() => setStatusFilter('payment_verified')}
            className={`p-3 rounded-xs border cursor-pointer transition ${
              statusFilter === 'payment_verified'
                ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-between">
              <span>Ready to Publish</span>
              <FileCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{paymentVerifiedCount}</div>
            <div className="text-[9px] text-emerald-300 mt-0.5">Funds Confirmed</div>
          </div>

          <div
            onClick={() => setStatusFilter('active')}
            className={`p-3 rounded-xs border cursor-pointer transition ${
              statusFilter === 'active'
                ? 'bg-green-950/70 border-green-400 text-green-200'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-green-400 flex items-center justify-between">
              <span>Live on Site</span>
              <CheckCircle2 className="w-3 h-3 text-green-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{activeCount}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Active Broadcasts</div>
          </div>

          <div className="p-3 rounded-xs bg-slate-900/90 border border-emerald-500/40">
            <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-between">
              <span>Bank Cash Inflow</span>
              <DollarSign className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-white mt-1">
              LKR {Math.round(totalVerifiedRevenueLKR).toLocaleString()}
            </div>
            <div className="text-[9px] text-emerald-300/80 mt-0.5">100% Ledger Synced</div>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-xs text-emerald-900 flex items-start gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm">{actionSuccessMsg}</p>
          </div>
          <button
            onClick={() => setActionSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Financial Accounting & IRD Tax Sync Banner */}
      <div className="bg-slate-900 text-white p-4 border-l-4 border-emerald-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-black uppercase tracking-wider text-emerald-400">
              Commercial Accounting & IRD VAT/SSCL Reconciliation Ledger
            </span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Double-Entry General Ledger: <strong>Account #4200 (Ad Sales Revenue - Credit)</strong> • <strong>Account #1010 (Commercial Bank Cash - Debit)</strong> • <strong>Account #2120 (IRD Tax Payable)</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Accrued VAT 18%:</span>
            <span className="font-mono font-bold text-sky-300">LKR {accruedVatTaxLKR.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Accrued SSCL 2.5%:</span>
            <span className="font-mono font-bold text-amber-300">LKR {accruedSsclTaxLKR.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Gross Invoiced:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">LKR {totalGrossBillingsLKR.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-4 border border-slate-300 shadow-xs">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `All Ads (${ads.length})` },
            { id: 'active', label: `Live (${activeCount})` },
            { id: 'payment_verified', label: `Ready (${paymentVerifiedCount})` },
            { id: 'payment_submitted', label: `Bank Check (${paymentSubmittedCount})` },
            { id: 'approved', label: `Awaiting Pay (${approvedAwaitingPaymentCount})` },
            { id: 'pending', label: `Review (${pendingReviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded-xs transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#0B1E36] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Slot Filter & Search Input */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 px-2 py-1 rounded-xs">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Slot:</span>
            <select
              value={slotFilter}
              onChange={(e) => setSlotFilter(e.target.value)}
              className="text-xs bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Placement Slots</option>
              <option value="header_banner">header_banner (Masthead 970x90)</option>
              <option value="hero_top_updates">hero_top_updates (Hero 728x90)</option>
              <option value="sidebar_top">sidebar_top (Top Sidebar 300x250)</option>
              <option value="feed_inline_1">feed_inline_1 (Mid-Feed Box #1)</option>
              <option value="feed_inline_2">feed_inline_2 (Bottom-Feed Box #2)</option>
              <option value="sidebar_widget">sidebar_widget (Lower Sidebar)</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, company, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-xs focus:ring-1 focus:ring-[#0B1E36] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Ads Master Database View */}
      {isLoading ? (
        <div className="text-center py-12 bg-white border border-slate-300">
          <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Loading commercial advertising database...
          </p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-300 space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">No advertisements found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No campaigns matched your current status filter &quot;{statusFilter}&quot; or slot filter &quot;{slotFilter}&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAds.map((ad) => {
            const isSelected = selectedAdForAction?.id === ad.id;
            const isPending = ad.status === 'pending_review' || ad.status === 'pending_approval';
            const isApprovedAwaitingPay = ad.status === 'approved_pending_payment';
            const isPaymentSubmitted = ad.status === 'payment_submitted';
            const isPaymentVerified = ad.status === 'payment_verified';
            const isActive = ad.status === 'active';

            const slotSpec = LANKAECON_AD_SLOTS.find((s) => s.slotLocation === ad.slotLocation);

            return (
              <div
                key={ad.id}
                className={`bg-white border-2 transition rounded-none shadow-xs overflow-hidden ${
                  isActive
                    ? 'border-green-600'
                    : isPaymentVerified
                    ? 'border-emerald-500'
                    : isPaymentSubmitted
                    ? 'border-orange-500 ring-1 ring-orange-400'
                    : isApprovedAwaitingPay
                    ? 'border-blue-400'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
                  
                  {/* Left Column: Creative Thumbnail & Formatting */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="w-full h-36 bg-slate-900 border border-slate-300 relative overflow-hidden flex items-center justify-center group">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 uppercase font-bold">No Creative Asset</span>
                      )}
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-amber-300 text-[8px] font-black uppercase px-2 py-0.5 rounded-xs">
                        {ad.adFormat === 'banner' ? 'Creative Banner' : 'Editorial Card'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                      <span className="font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 border border-sky-200">
                        {ad.slotLocation}
                      </span>
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline flex items-center gap-0.5 text-[10px]"
                      >
                        <span>Target Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Center Column: Ad Details & Contact Info */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-300">
                        {ad.id}
                      </span>

                      {/* Status Badges */}
                      {isActive && (
                        <span className="bg-green-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> LIVE ON SITE
                        </span>
                      )}
                      {isPaymentVerified && (
                        <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <Check className="w-3 h-3" /> PAYMENT VERIFIED
                        </span>
                      )}
                      {isPaymentSubmitted && (
                        <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" /> BANK CHECK REQUIRED
                        </span>
                      )}
                      {isApprovedAwaitingPay && (
                        <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs">
                          AWAITING PAYMENT
                        </span>
                      )}
                      {isPending && (
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-xs">
                          PENDING REVIEW
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{ad.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{ad.tagline || ad.businessDescription}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Company:</span>
                        <span className="font-extrabold text-slate-800">{ad.companyName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Contact:</span>
                        <span className="text-slate-700">{ad.advertiserEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Billing Amount:</span>
                        <span className="font-black text-emerald-700 font-mono">
                          {ad.currency} {ad.amountPaid?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Slot Placement:</span>
                        <span className="font-bold text-slate-800">{slotSpec?.displayName || ad.slotLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Workflow Actions Suite */}
                  <div className="lg:col-span-4 bg-slate-50 p-3.5 border border-slate-200 rounded-none space-y-2.5 flex flex-col justify-between">
                    
                    {/* STAGE 1: Staff Editorial Review */}
                    {isPending && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                          <span>Stage 1: Editorial Vetting</span>
                          <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 text-amber-900">Inbound Application</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Adjust Quote LKR..."
                            value={isSelected ? quoteAdjustmentLKR : ''}
                            onChange={(e) => {
                              setSelectedAdForAction(ad);
                              setQuoteAdjustmentLKR(e.target.value);
                            }}
                            className="w-1/2 text-xs p-1.5 border border-slate-300 rounded-xs bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-500 font-bold">Standard: LKR {ad.amountPaid?.toLocaleString()}</span>
                        </div>

                        <textarea
                          placeholder="Editorial feedback or invoice note..."
                          value={isSelected ? staffFeedback : ''}
                          onChange={(e) => {
                            setSelectedAdForAction(ad);
                            setStaffFeedback(e.target.value);
                          }}
                          className="w-full text-xs p-2 border border-slate-300 rounded-xs h-14 bg-white outline-none focus:ring-1 focus:ring-[#0B1E36]"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveAd(ad)}
                            disabled={isProcessingApproval}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 px-3 uppercase rounded-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Send Invoice</span>
                          </button>

                          <button
                            onClick={() => handleRejectAd(ad)}
                            disabled={isProcessingApproval}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 px-2.5 uppercase rounded-xs cursor-pointer shadow-xs transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STAGE 2: Approved, Awaiting Payment */}
                    {isApprovedAwaitingPay && (
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-sky-50 border border-sky-200 rounded-xs text-sky-900">
                          <p className="font-bold">Invoice Dispatched to Client</p>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Awaiting advertiser deposit of {ad.currency} {ad.amountPaid?.toLocaleString()} to corporate accounts.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedAdForAction(ad);
                            handleFlagBankPayment(ad);
                          }}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 px-3 uppercase rounded-xs cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Direct Staff Bank Override</span>
                        </button>
                      </div>
                    )}

                    {/* STAGE 3: Bank Reconciliation & Flagging */}
                    {isPaymentSubmitted && (
                      <div className="space-y-2">
                        <div className="p-2 bg-orange-100 border border-orange-300 rounded-xs text-orange-950 text-xs">
                          <span className="font-black block">⚠️ ACTION REQUIRED:</span>
                          <span>Reconcile deposit in corporate accounts before publishing live.</span>
                          {ad.transactionRef && (
                            <span className="font-mono text-[10px] block mt-0.5">Ref: {ad.transactionRef}</span>
                          )}
                        </div>

                        <select
                          value={selectedCompanyBankAccount}
                          onChange={(e) => setSelectedCompanyBankAccount(e.target.value)}
                          className="w-full text-xs p-1.5 border border-slate-300 rounded-xs bg-white font-semibold"
                        >
                          <option value="Commercial Bank Corporate A/C #8810293019">
                            Commercial Bank Corporate (#8810293019)
                          </option>
                          <option value="Bank of Ceylon Corporate City Office #7029102901">
                            Bank of Ceylon Corporate (#7029102901)
                          </option>
                          <option value="Commercial Bank SLIPS Direct Wire Settlement">
                            Commercial Bank SLIPS Settlement
                          </option>
                        </select>

                        <button
                          onClick={() => handleFlagBankPayment(ad)}
                          disabled={isProcessingBankFlag}
                          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-xs py-2 px-3 uppercase rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
                        >
                          <Landmark className="w-4 h-4" />
                          <span>Confirm Money in Bank A/C</span>
                        </button>
                      </div>
                    )}

                    {/* STAGE 4: Ready to Publish Live */}
                    {isPaymentVerified && (
                      <div className="space-y-2">
                        <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-xs text-emerald-950 text-xs">
                          <span className="font-bold block">Funds Verified in Company A/C!</span>
                          <span className="text-[11px] text-emerald-800">
                            Deposited to: {ad.bankDepositAccount || 'Commercial Bank A/C'}
                          </span>
                        </div>

                        <button
                          onClick={() => handlePublishLive(ad)}
                          disabled={isPublishingLive}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 px-3 uppercase rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition animate-pulse"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>🚀 Publish Live to Newspaper</span>
                        </button>
                      </div>
                    )}

                    {/* ACTIVE LIVE AD CONTROLS */}
                    {isActive && (
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-green-50 border border-green-200 rounded-xs text-green-900">
                          <p className="font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            <span>Broadcasting Live</span>
                          </p>
                          <div className="flex justify-between mt-1 text-[10px] font-mono text-slate-700">
                            <span>Views: {ad.impressionsCount?.toLocaleString()}</span>
                            <span>Clicks: {ad.clicksCount?.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => {
                              setRepublishingAd(ad);
                              setRepublishDays(ad.durationDays || 30);
                            }}
                            className="bg-sky-700 hover:bg-sky-600 text-white font-bold text-[10px] uppercase py-1.5 px-2 rounded-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Renew / Extend</span>
                          </button>

                          <button
                            onClick={() => {
                              setReassigningSlotAd(ad);
                              setNewTargetSlot(ad.slotLocation);
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-[10px] uppercase py-1.5 px-2 rounded-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>Move Slot</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* UTILITY ACTIONS ROW */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                      {/* Edit Details */}
                      <button
                        onClick={() => handleOpenEdit(ad)}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[10px] uppercase py-1.5 px-2 rounded-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {/* Tax Invoice */}
                      <button
                        onClick={() => setViewingTaxInvoiceAd(ad)}
                        title="View Official IRD Tax Invoice"
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[10px] uppercase py-1.5 px-2 rounded-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-emerald-600" />
                        <span>Invoice</span>
                      </button>

                      {/* Delete Banner */}
                      <button
                        onClick={() => handleDeleteAd(ad)}
                        disabled={isDeletingId === ad.id}
                        title="Delete only this ad banner. The ad slot on the newspaper remains active."
                        className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-300 hover:border-red-600 font-bold text-[10px] uppercase py-1.5 px-2 rounded-xs flex items-center justify-center gap-1 cursor-pointer transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISUAL AD SLOT MAP MODAL */}
      {showVisualMapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col rounded-none overflow-hidden">
            <div className="bg-[#0B1E36] text-white p-4 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base uppercase">LankaEcon Ad Placement Architecture Blueprint</h3>
              </div>
              <button
                onClick={() => setShowVisualMapModal(false)}
                className="text-slate-300 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <VisualAdSlotMap activeAds={ads} />
            </div>
          </div>
        </div>
      )}

      {/* EDIT AD MODAL */}
      {editingAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-xl shadow-2xl p-6 space-y-4 rounded-none">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5">
                  Ref: {editingAd.id}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Edit Ad Creative & Details</h3>
              </div>
              <button
                onClick={() => setEditingAd(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Headline / Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tagline / Description:</label>
                <textarea
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Landing URL:</label>
                  <input
                    type="url"
                    value={editTargetUrl}
                    onChange={(e) => setEditTargetUrl(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Phone / Hotline:</label>
                  <input
                    type="text"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Creative Image URL:</label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Display Format:</label>
                  <select
                    value={editFormat}
                    onChange={(e) => setEditFormat(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs font-semibold"
                  >
                    <option value="banner">Full Graphic Banner Poster</option>
                    <option value="card">Structured Editorial Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Badge Text (Optional):</label>
                  <input
                    type="text"
                    value={editBadgeText}
                    onChange={(e) => setEditBadgeText(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingAd(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2 cursor-pointer shadow-xs"
              >
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RE-ASSIGN SLOT MODAL */}
      {reassigningSlotAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-md shadow-2xl p-6 space-y-4 rounded-none">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Reassign Placement Slot</h3>
              <button
                onClick={() => setReassigningSlotAd(null)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Move <strong>&quot;{reassigningSlotAd.title}&quot;</strong> to another designated ad slot. Slot isolation will be automatically updated.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select New Target Slot:</label>
                <select
                  value={newTargetSlot}
                  onChange={(e) => setNewTargetSlot(e.target.value as AdSlotLocation)}
                  className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs font-bold"
                >
                  <option value="sidebar_top">Slot 3: Top Sidebar Billboard (sidebar_top)</option>
                  <option value="hero_top_updates">Slot 2: Top Hero Financial Banner (hero_top_updates)</option>
                  <option value="feed_inline_1">Slot 4: Newsroom Feed Inline Box #1 (feed_inline_1)</option>
                  <option value="feed_inline_2">Slot 5: Newsroom Feed Inline Box #2 (feed_inline_2)</option>
                  <option value="sidebar_widget">Slot 6: Lower Sidebar Intelligence Widget (sidebar_widget)</option>
                  <option value="header_banner">Slot 1: Masthead Super Leaderboard (header_banner)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setReassigningSlotAd(null)}
                className="bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReassignSlot}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2 cursor-pointer shadow-xs"
              >
                Confirm Slot Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENEW / EXTEND DURATION MODAL */}
      {republishingAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-md shadow-2xl p-6 space-y-4 rounded-none">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">Renew & Extend Campaign</h3>
              <button
                onClick={() => setRepublishingAd(null)}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Extend active live broadcast for <strong>&quot;{republishingAd.title}&quot;</strong> on slot <strong>{republishingAd.slotLocation}</strong>.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Active Duration (Days):</label>
                <select
                  value={republishDays}
                  onChange={(e) => setRepublishDays(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs font-bold"
                >
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days (Standard 1 Month)</option>
                  <option value={60}>60 Days (2 Months)</option>
                  <option value={90}>90 Days (Quarterly Campaign)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setRepublishingAd(null)}
                className="bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRepublishAd}
                className="bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2 cursor-pointer shadow-xs"
              >
                Renew Live Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAX INVOICE DETAILS MODAL */}
      {viewingTaxInvoiceAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-2xl shadow-2xl p-6 space-y-4 rounded-none font-sans">
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5">
                  OFFICIAL IRD COMPLIANT TAX INVOICE
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  INVOICE REF: INV-AD-{viewingTaxInvoiceAd.id}-2026
                </h3>
              </div>
              <button
                onClick={() => setViewingTaxInvoiceAd(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Issued To:</span>
                <p className="font-extrabold text-slate-900">{viewingTaxInvoiceAd.companyName}</p>
                <p className="text-slate-600">{viewingTaxInvoiceAd.advertiserEmail}</p>
                <p className="text-slate-500">TRN: TRN-10928374-8000</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 space-y-1 text-right">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Publisher Details:</span>
                <p className="font-extrabold text-slate-900">LankaEcon Media Network Ltd</p>
                <p className="text-slate-600">VAT Reg: VAT-77291029-7000</p>
                <p className="text-emerald-700 font-bold">STATUS: PAID & RECONCILED</p>
              </div>
            </div>

            {/* Line items table */}
            <table className="w-full text-xs border-collapse border border-slate-200">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2 text-left border border-slate-200">Item Description</th>
                  <th className="p-2 text-center border border-slate-200">Slot</th>
                  <th className="p-2 text-right border border-slate-200">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-200">
                    Commercial Advertisement: {viewingTaxInvoiceAd.title} (30 Days)
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-mono font-bold">
                    {viewingTaxInvoiceAd.slotLocation}
                  </td>
                  <td className="p-2 border border-slate-200 text-right font-mono font-bold">
                    LKR {(viewingTaxInvoiceAd.currency === 'USD' ? viewingTaxInvoiceAd.amountPaid * 300 : viewingTaxInvoiceAd.amountPaid).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tax Breakdown */}
            {(() => {
              const totalLKR = viewingTaxInvoiceAd.currency === 'USD' ? viewingTaxInvoiceAd.amountPaid * 300 : viewingTaxInvoiceAd.amountPaid;
              const netLKR = Math.round(totalLKR / (1 + 0.18 + 0.025));
              const vatLKR = Math.round(netLKR * 0.18);
              const ssclLKR = Math.round(netLKR * 0.025);

              return (
                <div className="bg-slate-50 p-3 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Net Commercial Fee (Pre-tax):</span>
                    <span className="font-mono">LKR {netLKR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Inland Revenue VAT (18.0%):</span>
                    <span className="font-mono text-sky-700">+ LKR {vatLKR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Social Security Contribution Levy (SSCL 2.5%):</span>
                    <span className="font-mono text-amber-700">+ LKR {ssclLKR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-300">
                    <span>Total Invoiced & Reconciled:</span>
                    <span className="font-mono text-emerald-700">LKR {totalLKR.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setViewingTaxInvoiceAd(null)}
                className="bg-[#0B1E36] hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 cursor-pointer"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT AD REMOVAL & ACCOUNTING RECONCILIATION MODAL */}
      {adToDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-800 w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col rounded-none overflow-hidden">
            {/* Modal Header */}
            <div className="bg-red-900 text-white p-4 flex justify-between items-center border-b border-red-950">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-200" />
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Permanently Remove Ad & Reconcile Accounting Ledger
                  </h3>
                  <p className="text-[11px] text-red-200">
                    SLFRS 15 / IFRS Revenue Derecognition • IRD Sri Lanka Tax Adjustment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdToDeleteModal(null)}
                disabled={isDeletingWithAccounting}
                className="text-red-200 hover:text-white font-black text-sm cursor-pointer disabled:opacity-50"
              >
                ✕ CANCEL
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Campaign Identification Banner */}
              <div className="bg-slate-50 border border-slate-300 p-3.5 rounded-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-[#0B1E36] text-white font-mono px-1.5 py-0.5 rounded-xs mr-2 font-bold">
                      REF: {adToDeleteModal.id}
                    </span>
                    <span className="text-xs font-black text-slate-900">{adToDeleteModal.title}</span>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 uppercase tracking-wider border border-red-200">
                    Removal Target
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Advertiser / Company:</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {adToDeleteModal.companyName || adToDeleteModal.advertiserName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Assigned Slot:</span>
                    <span className="font-bold text-slate-800 font-mono block">
                      {adToDeleteModal.slotLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Booked Amount:</span>
                    <span className="font-extrabold text-emerald-700 block">
                      {adToDeleteModal.currency} {adToDeleteModal.amountPaid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slot Release Impact Note */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 space-y-1">
                  <span className="font-black block uppercase tracking-wide">
                    1. Newspaper Ad Inventory Release:
                  </span>
                  <p>
                    Deleting this banner immediately removes it from public display across the LankaEcon newspaper. Slot <strong className="font-mono text-amber-950">"{adToDeleteModal.slotLocation}"</strong> will immediately open and become available for new paying advertisers or editorial fallback units.
                  </p>
                </div>
              </div>

              {/* Accounting & Tax Breakdown */}
              {(() => {
                const totalLKR = adToDeleteModal.currency === 'USD' ? adToDeleteModal.amountPaid * 300 : adToDeleteModal.amountPaid;
                const netLKR = Math.round(totalLKR / (1 + 0.18 + 0.025));
                const vatLKR = Math.round(netLKR * 0.18);
                const ssclLKR = Math.round(netLKR * 0.025);

                return (
                  <div className="bg-slate-50 border border-slate-300 p-3.5 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-emerald-700" />
                        2. Financial & IRD Tax Derecognition Impact:
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">IRD VAT 18% • SSCL 2.5%</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
                      <div className="bg-white p-2 border border-slate-200 rounded-xs">
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">Gross Invoiced</span>
                        <span className="text-xs font-black text-slate-800 font-mono">
                          -Rs. {totalLKR.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-2 border border-slate-200 rounded-xs">
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">Net Revenue Reversal</span>
                        <span className="text-xs font-black text-sky-800 font-mono">
                          -Rs. {netLKR.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-2 border border-slate-200 rounded-xs">
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">VAT 18% Liability</span>
                        <span className="text-xs font-black text-amber-700 font-mono">
                          -Rs. {vatLKR.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-2 border border-slate-200 rounded-xs">
                        <span className="text-[9px] text-slate-500 uppercase block font-bold">SSCL 2.5% Liability</span>
                        <span className="text-xs font-black text-purple-700 font-mono">
                          -Rs. {ssclLKR.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Accounting Action Selector */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px] block">
                  3. Select Global Best Practice Accounting Action:
                </label>

                <div className="space-y-2">
                  <label
                    onClick={() => setDeleteAccountingAction('void_and_reconcile')}
                    className={`flex items-start gap-3 p-3 border cursor-pointer transition rounded-xs ${
                      deleteAccountingAction === 'void_and_reconcile'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deleteAccountingAction"
                      checked={deleteAccountingAction === 'void_and_reconcile'}
                      onChange={() => setDeleteAccountingAction('void_and_reconcile')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                        <span>Void & Reconcile General Ledger (Recommended Standard)</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-xs font-bold">
                          SLFRS / IRD COMPLIANT
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Marks linked IRD Tax Invoice as <strong>VOID</strong>, derecognizes output VAT & SSCL tax liabilities, reverses revenue in the Double-Entry General Ledger, and posts an official audit trail note.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeleteAccountingAction('full_expunge')}
                    className={`flex items-start gap-3 p-3 border cursor-pointer transition rounded-xs ${
                      deleteAccountingAction === 'full_expunge'
                        ? 'border-red-600 bg-red-50/60 ring-1 ring-red-500'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deleteAccountingAction"
                      checked={deleteAccountingAction === 'full_expunge'}
                      onChange={() => setDeleteAccountingAction('full_expunge')}
                      className="mt-1 text-red-600 focus:ring-red-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                        <span>Full Database Expunge (Test / Mistake Cleanup)</span>
                        <span className="bg-slate-200 text-slate-800 text-[9px] px-1.5 py-0.2 rounded-xs font-bold">
                          ZERO TRACE PURGE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Permanently deletes the ad campaign record and removes associated draft tax invoices completely. Recommended for draft corrections, mistakes, or test data.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeleteAccountingAction('record_refund')}
                    className={`flex items-start gap-3 p-3 border cursor-pointer transition rounded-xs ${
                      deleteAccountingAction === 'record_refund'
                        ? 'border-sky-600 bg-sky-50/60 ring-1 ring-sky-500'
                        : 'border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deleteAccountingAction"
                      checked={deleteAccountingAction === 'record_refund'}
                      onChange={() => setDeleteAccountingAction('record_refund')}
                      className="mt-1 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                        <span>Record Customer Refund Disbursement</span>
                        <span className="bg-sky-100 text-sky-800 text-[9px] px-1.5 py-0.2 rounded-xs font-bold">
                          CASHBOOK OUTFLOW
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Deletes the ad and registers a contra-revenue customer refund transaction in the cashbook ledger for funds already deposited into corporate bank accounts.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Audit Reason */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px] block">
                  4. Reason for Ad Removal (Audit Trail Note):
                </label>
                <select
                  value={deleteAuditReason}
                  onChange={(e) => setDeleteAuditReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xs px-3 py-2 text-xs font-medium focus:border-red-600"
                >
                  <option value="Client Requested Cancellation">Client Requested Cancellation</option>
                  <option value="Campaign Term Completed / Expired">Campaign Term Completed / Expired</option>
                  <option value="Test Campaign / Sandbox Data Cleanup">Test Campaign / Sandbox Data Cleanup</option>
                  <option value="Editorial & Compliance Policy Violation">Editorial & Compliance Policy Violation</option>
                  <option value="Duplicate Application / Operator Error">Duplicate Application / Operator Error</option>
                  <option value="Non-Payment / Billing Cancellation">Non-Payment / Billing Cancellation</option>
                  <option value="Other">Other (Specify Custom Reason Below)</option>
                </select>

                {deleteAuditReason === 'Other' && (
                  <input
                    type="text"
                    value={customAuditReason}
                    onChange={(e) => setCustomAuditReason(e.target.value)}
                    placeholder="Enter detailed audit reason for ledger records..."
                    className="w-full bg-white border border-slate-300 rounded-xs px-3 py-2 text-xs focus:border-red-600 mt-1"
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authorized by: <strong>{currentUser?.fullName || 'Editorial Ad Desk'}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdToDeleteModal(null)}
                  disabled={isDeletingWithAccounting}
                  className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs px-4 py-2 rounded-xs cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDeleteAdWithAccounting}
                  disabled={isDeletingWithAccounting}
                  className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs px-5 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 transition"
                >
                  {isDeletingWithAccounting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Removal...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Permanent Removal & Reconcile Ledger</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatched Email Logs Modal */}
      {showEmailLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B1E36] w-full max-w-4xl shadow-2xl max-h-[85vh] flex flex-col rounded-none overflow-hidden">
            <div className="bg-[#0B1E36] text-white p-4 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base uppercase">Automated Advertiser Outbox & Email Logs</h3>
              </div>
              <button
                onClick={() => setShowEmailLogsModal(false)}
                className="text-slate-300 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {emailLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No automated emails logged yet in current runtime session.
                </div>
              ) : (
                emailLogs.map((mail) => (
                  <div key={mail.id} className="border border-slate-300 p-3 rounded-xs bg-slate-50 space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-1 text-[11px]">
                      <span className="font-bold text-slate-900">
                        To: {mail.recipientName} ({mail.recipientEmail})
                      </span>
                      <span className="text-[10px] text-slate-500">{new Date(mail.dispatchedAt).toLocaleString()}</span>
                    </div>
                    <p className="font-black text-[#0B1E36]">{mail.subject}</p>
                    <pre className="bg-white p-2 border border-slate-200 rounded-xs text-[10px] text-slate-700 whitespace-pre-wrap font-sans">
                      {mail.bodyText}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
