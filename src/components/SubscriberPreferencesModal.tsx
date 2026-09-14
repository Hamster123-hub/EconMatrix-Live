import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  UserX,
  ShieldAlert,
  DollarSign,
  FileText,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { safeSetStorage, safeGetStorage } from '../utils/safeStorage';

interface SubscriberPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialTab?: 'preferences' | 'history' | 'unsubscribe';
  onOpenSubscriptionModal?: () => void;
}

export const SubscriberPreferencesModal: React.FC<SubscriberPreferencesModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  initialTab = 'preferences',
  onOpenSubscriptionModal,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [planName, setPlanName] = useState('');
  
  // Notification states
  const [notifySubscriberArticles, setNotifySubscriberArticles] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [notifyBreakingNews, setNotifyBreakingNews] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentDispatches, setRecentDispatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'preferences' | 'history' | 'unsubscribe'>('preferences');

  // Unsubscription state
  const [unsubscribeReason, setUnsubscribeReason] = useState('finished_research');
  const [unsubscribeFeedback, setUnsubscribeFeedback] = useState('');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [unsubscribedResult, setUnsubscribedResult] = useState<any>(null);
  const [showUnsubConfirm, setShowUnsubConfirm] = useState(false);

  // Hydrate email on open
  useEffect(() => {
    if (isOpen) {
      const savedEmail = initialEmail || safeGetStorage<string>('lankaecon_subscriber_email', '') || 'ranulddd@gmail.com';
      setEmail(savedEmail);
      setActiveTab(initialTab);
      setUnsubscribedResult(null);
      setShowUnsubConfirm(false);
      if (savedEmail) {
        fetchPreferences(savedEmail);
      }
    } else {
      setSaveSuccess(false);
      setErrorMessage('');
      setUnsubscribedResult(null);
    }
  }, [isOpen, initialEmail, initialTab]);

  const fetchPreferences = async (emailToFetch: string) => {
    if (!emailToFetch || !emailToFetch.includes('@')) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/subscribers/preferences?email=${encodeURIComponent(emailToFetch.trim())}`);
      const data = await res.json();
      if (data.success && data.subscriber) {
        setName(data.subscriber.name || '');
        const isSub = Boolean(data.subscriber.isSubscriber);
        setIsSubscriber(isSub);
        safeSetStorage('lankaecon_is_subscriber', isSub ? 'true' : 'false');
        setPlanName(data.subscriber.planName || (data.subscriber.isSubscriber ? 'Active Subscriber Pass' : 'Registered Reader'));
        setNotifySubscriberArticles(data.subscriber.notifySubscriberArticles !== false);
        setNotifyWeeklyDigest(data.subscriber.notifyWeeklyDigest !== false);
        setNotifyBreakingNews(data.subscriber.notifyBreakingNews !== false);
        if (Array.isArray(data.recentDispatches)) {
          setRecentDispatches(data.recentDispatches);
        }
      }
    } catch {
      setErrorMessage('Could not load current preferences. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      safeSetStorage('lankaecon_subscriber_email', email.trim());
      fetchPreferences(email.trim());
    }
  };

  const handleSave = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/subscribers/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          notifySubscriberArticles,
          notifyWeeklyDigest,
          notifyBreakingNews,
        }),
      });

      const data = await res.json();
      if (data.success) {
        safeSetStorage('lankaecon_subscriber_email', email.trim());
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || 'Failed to save preferences.');
      }
    } catch {
      setErrorMessage('Network error while saving email alert preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickOptOut = async () => {
    if (!email || !email.includes('@')) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/subscribers/unsubscribe-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifySubscriberArticles(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch {
      setErrorMessage('Failed to opt out. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // FULL MEMBERSHIP UNSUBSCRIPTION & ACCOUNTING LEDGER ADJUSTMENT
  const handleFullUnsubscribe = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('A valid email is required to process unsubscription.');
      return;
    }

    setIsUnsubscribing(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/subscriptions/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          reason: unsubscribeReason,
          notes: unsubscribeFeedback.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUnsubscribedResult(data);
        setIsSubscriber(false);
        safeSetStorage('lankaecon_is_subscriber', 'false');
        setPlanName('Unsubscribed Reader');
        setNotifySubscriberArticles(false);
        setNotifyWeeklyDigest(false);
        setNotifyBreakingNews(false);
      } else {
        setErrorMessage(data.error || 'Failed to complete unsubscription.');
      }
    } catch {
      setErrorMessage('Server communication error during unsubscription.');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#0B1E36] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-sans text-slate-900 rounded-none animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#0B1E36] text-white p-5 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight font-serif flex items-center gap-2">
                Subscriber Account & Notifications
                <span className="text-[10px] bg-sky-500/20 text-sky-300 font-sans px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                  Automated Desk
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage automated alerts, subscriber preferences, or cancel subscription
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 transition-colors cursor-pointer rounded hover:bg-slate-800"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-bold uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'border-[#0284C7] text-[#0284C7] bg-white rounded-t font-extrabold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Notification Toggles
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-[#0284C7] text-[#0284C7] bg-white rounded-t font-extrabold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Recent Dispatches {recentDispatches.length > 0 && `(${recentDispatches.length})`}
          </button>
          <button
            onClick={() => setActiveTab('unsubscribe')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'unsubscribe'
                ? 'border-red-600 text-red-600 bg-white rounded-t font-extrabold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-red-600'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            Cancel / Unsubscribe
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-white">
          
          {/* Email Account Lookup Banner */}
          <form onSubmit={handleLookup} className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Subscriber Email Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-3.5 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-900 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Load Status'}
              </button>
            </div>

            {/* Subscriber Status Badge */}
            {email && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {isSubscriber ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {planName || 'Active Subscriber Pass'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {planName || 'Registered Reader Account'}
                    </span>
                  )}
                </div>
                {!isSubscriber && onOpenSubscriptionModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSubscriptionModal();
                    }}
                    className="text-[#0284C7] hover:underline font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                  >
                    Upgrade to Pro <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </form>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Your notification preferences have been saved successfully!</span>
            </div>
          )}

          {/* TAB 1: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              
              {/* Primary Feature: Exclusive Subscriber-Only Articles Toggle */}
              <div className={`p-4 rounded-lg border-2 transition-all ${
                notifySubscriberArticles 
                  ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-200' 
                  : 'bg-slate-50 border-slate-200 opacity-90'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-sky-600 text-white">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Instant Subscriber-Only Exclusive Article Alerts
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      Automatically receive a formatted email alert <strong>immediately when a paywalled subscriber-only article, investigatory story, or macro report</strong> is published.
                    </p>
                    <div className="pl-6 pt-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        notifySubscriberArticles 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {notifySubscriberArticles ? '● Email Alerts Active' : '○ Alerts Paused'}
                      </span>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={notifySubscriberArticles}
                      onChange={(e) => setNotifySubscriberArticles(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>
              </div>

              {/* Secondary Feature: Weekly Macroeconomic Digest */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">
                      Weekly Sunday Macro & Policy Executive Digest
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Curated executive review of treasury bond auctions, inflation data, and policy rate corridors.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifyWeeklyDigest}
                      onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                  </label>
                </div>
              </div>

              {/* Tertiary Feature: Breaking News Alerts */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">
                      Emergency CSE & Central Bank Flash Bulletins
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Instant notifications for critical monetary policy changes and sovereign debt updates.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifyBreakingNews}
                      onChange={(e) => setNotifyBreakingNews(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                  </label>
                </div>
              </div>

              {/* Informative Note & Unsubscribe Gateway */}
              <div className="bg-slate-50 p-3 rounded text-[11px] text-slate-500 flex items-center justify-between border border-slate-200">
                <span>Alerts sent to <strong>{email || 'your registered address'}</strong></span>
                <div className="flex items-center gap-3">
                  {notifySubscriberArticles && (
                    <button
                      type="button"
                      onClick={handleQuickOptOut}
                      className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      Pause Alerts
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('unsubscribe')}
                    className="text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Cancel / Unsubscribe
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RECENT DISPATCHES */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Recent Exclusive Article Email Alerts Dispatched</span>
                <span className="font-semibold">{recentDispatches.length} alerts on record</span>
              </div>

              {recentDispatches.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded p-6">
                  <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Dispatched Alerts Yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    When a subscriber-only article is published, the automated dispatch record will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  {recentDispatches.map((log, idx) => (
                    <div key={log.id || idx} className="p-3 bg-white hover:bg-slate-50 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {log.articleTitle || log.subject}
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200 shrink-0">
                          {log.status || 'DELIVERED'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Category: {log.articleCategory || 'ECONOMY'}</span>
                        <span>{new Date(log.sentAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CANCEL & UNSUBSCRIBE (STANDARD USER PRACTICE) */}
          {activeTab === 'unsubscribe' && (
            <div className="space-y-4">
              
              {unsubscribedResult ? (
                /* Unsubscription Confirmation Screen */
                <div className="p-6 bg-slate-50 border-2 border-emerald-600 rounded-lg space-y-4 text-center animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-serif">
                      You Have Been Successfully Unsubscribed
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      Your subscription for <strong>{unsubscribedResult.details?.email}</strong> has been cancelled and removed from the active database.
                    </p>
                  </div>

                  {/* Accounting & Database Action Audit Card */}
                  <div className="bg-white border border-slate-200 p-4 rounded text-left text-xs space-y-2.5 font-mono">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-sans">
                      <span className="font-bold text-slate-800">AUTOMATED SYSTEM ACTIONS PERFORMED:</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                        RECONCILED
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Removed from Active Subscriptions Database</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Removed from Automated Email Dispatch Lists</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Accounting Platform Ledger Reconciled: -Rs. {(unsubscribedResult.details?.accountingFinancialsAdjusted?.revenueReversedLKR || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Double-Entry General Ledger & Profit Statements dynamically updated</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition cursor-pointer"
                    >
                      Close Window
                    </button>
                    {onOpenSubscriptionModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenSubscriptionModal();
                        }}
                        className="px-5 py-2 bg-[#0284C7] text-white text-xs font-bold rounded hover:bg-[#0369a1] transition cursor-pointer"
                      >
                        Resubscribe in Future
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Unsubscribe Form */
                <div className="space-y-4">
                  
                  <div className="bg-red-50/70 border border-red-200 p-4 rounded-lg flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-900 space-y-1">
                      <h4 className="font-bold text-sm text-red-950">
                        Standard Membership Unsubscription & Account Cancellation
                      </h4>
                      <p className="leading-relaxed text-red-800">
                        In accordance with standard digital publishing policies, you can cancel your membership at any time. When you unsubscribe:
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5 text-red-700 pt-1">
                        <li>Your account is removed from the subscriber database.</li>
                        <li>Automated alerts for exclusive stories and weekly digests will stop immediately.</li>
                        <li>The accounting platform automatically adjusts ledger revenue records and reflects the unsubscription.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Active Account Overview */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200">
                      <span>Target Account:</span>
                      <strong className="text-slate-900">{email || 'Not specified'}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200">
                      <span>Current Plan:</span>
                      <span className="font-bold text-[#0284C7]">{planName || (isSubscriber ? 'Active Subscription' : 'Registered Reader')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Automated Dispatch Alerts:</span>
                      <span className={notifySubscriberArticles ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                        {notifySubscriberArticles ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>

                  {/* Reason for unsubscription */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Please let us know why you are unsubscribing (Optional):
                    </label>
                    <select
                      value={unsubscribeReason}
                      onChange={(e) => setUnsubscribeReason(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                    >
                      <option value="finished_research">Completed research / project</option>
                      <option value="too_frequent">Too frequent email dispatches</option>
                      <option value="cost_budget">Cost / budget adjustment</option>
                      <option value="switching_service">Switching to another news source</option>
                      <option value="temporary_pause">Temporary pause</option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Additional Feedback (Optional):
                    </label>
                    <textarea
                      value={unsubscribeFeedback}
                      onChange={(e) => setUnsubscribeFeedback(e.target.value)}
                      placeholder="Share any suggestions to help us improve our reporting..."
                      rows={2}
                      className="w-full text-xs p-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {/* Confirmation Step */}
                  {!showUnsubConfirm ? (
                    <div className="pt-2 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('preferences')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Keep My Subscription
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUnsubConfirm(true)}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Proceed to Unsubscribe
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-300 rounded-lg space-y-3 animate-in fade-in">
                      <p className="text-xs font-bold text-red-900">
                        Confirm: Are you sure you want to completely cancel and remove your subscription from LankaEcon?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowUnsubConfirm(false)}
                          className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleFullUnsubscribe}
                          disabled={isUnsubscribing}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isUnsubscribing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Removing Account & Adjusting Financials...
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4" />
                              Confirm Unsubscribe & Remove from Database
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        {activeTab !== 'unsubscribe' && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !email}
              className="px-5 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded shadow hover:bg-[#0369a1] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Notification Preferences
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
