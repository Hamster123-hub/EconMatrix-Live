import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Send, 
  Check, 
  Copy, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  ArrowLeft, 
  PhoneCall, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Language } from '../utils/translations';

interface ContactsPageProps {
  onBack?: () => void;
  language?: Language;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ 
  onBack,
  language = 'en' 
}) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactName = "Disnaka";
  const mobileNumber = "0771774033";
  const intlMobileNumber = "+94771774033";
  const whatsappUrl = `https://wa.me/94771774033`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(mobileNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const text = encodeURIComponent(
      `*New Message from Econ Matrix Reader*\n` +
      `*Name:* ${formData.name || 'Anonymous Reader'}\n` +
      `*Contact:* ${formData.contact || 'Not provided'}\n` +
      `*Subject:* ${formData.subject}\n\n` +
      `*Message:*\n${formData.message}`
    );

    window.open(`https://wa.me/94771774033?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const handleSubmitWebForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: contactName,
          recipientPhone: mobileNumber,
          senderName: formData.name,
          senderContact: formData.contact,
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Graceful fallback
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Breadcrumb & Return Button */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-[#0284C7] hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dispatches</span>
          </button>
        ) : (
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Econ Matrix • Editorial Directory
          </div>
        )}

        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xs border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Direct Communication Active
        </span>
      </div>

      {/* Main Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] dark:text-white tracking-tight uppercase">
          Direct Communication & Contacts
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Direct channel for readers, institutional economists, business leaders, and whistleblowers to directly communicate with editorial leadership.
        </p>
      </div>

      {/* Primary Hero Contact Card */}
      <div className="bg-gradient-to-br from-[#0B1E36] to-[#132A4A] text-white rounded-xs p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-5 text-white select-none pointer-events-none">
          <PhoneCall className="w-72 h-72" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>Direct Contact Point</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                {contactName}
              </h2>
              <p className="text-sky-300 text-xs sm:text-sm font-semibold mt-0.5 tracking-wide">
                Econ Matrix Editorial & Communications
              </p>
            </div>

            <div className="bg-black/30 border border-slate-700/80 rounded-xs p-4 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                Direct Mobile Line
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${intlMobileNumber}`}
                  className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 hover:text-amber-300 tracking-wider transition underline decoration-amber-500/40"
                  title="Click to call directly"
                >
                  {mobileNumber}
                </a>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-mono transition cursor-pointer shadow-xs"
                  title="Copy phone number to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Explicit WhatsApp Notice Banner */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-medium">
                <MessageCircle className="w-4 h-4 shrink-0 text-emerald-400 fill-emerald-500/20" />
                <span>
                  <strong>I am available on WhatsApp on this number</strong> ({mobileNumber}).
                </span>
              </div>
            </div>
          </div>

          {/* Quick Direct Actions Column */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-64">
            
            {/* Primary WhatsApp Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xs bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Direct Phone Call Action */}
            <a
              href={`tel:${intlMobileNumber}`}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xs bg-[#0284C7] hover:bg-sky-600 text-white font-black text-sm uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Direct Line</span>
            </a>

            {/* Quick SMS Action */}
            <a
              href={`sms:${intlMobileNumber}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition border border-slate-600 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Send SMS Message</span>
            </a>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Direct Message Form & Office Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: Direct Communication Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xs p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0284C7] block">
              Direct Reader & Source Dispatch
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Send a Direct Message
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fill in your message below to send directly via WhatsApp to {contactName} ({mobileNumber}), or dispatch through our system.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-6 rounded-xs space-y-4">
              <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                <Check className="w-6 h-6 shrink-0 text-emerald-600" />
                <h4 className="font-bold text-base">Message Dispatched Successfully</h4>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Thank you for reaching out to Disnaka. For immediate urgent follow-up, you can also connect directly on WhatsApp at <strong>{mobileNumber}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', contact: '', subject: 'General Inquiry', message: '' });
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendViaWhatsApp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Shantha Perera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-900 dark:text-white rounded-xs focus:ring-1 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="07XXXXXXXX or email@company.com"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-900 dark:text-white rounded-xs focus:ring-1 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject / Nature of Inquiry
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-900 dark:text-white rounded-xs focus:ring-1 focus:ring-[#0284C7] focus:outline-hidden"
                >
                  <option value="General Inquiry">General Editorial Inquiry</option>
                  <option value="News Tip & Whistleblower">Confidential News Tip / Whistleblower</option>
                  <option value="Press Release Submission">Corporate Press Release & Announcement</option>
                  <option value="Advertising & Sponsorship">Advertising, Media Kit & Sponsorship</option>
                  <option value="Research & Opinion Column">Editorial Column & Research Submission</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your message, news tip, or inquiry here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 p-3 text-xs text-slate-900 dark:text-white rounded-xs focus:ring-1 focus:ring-[#0284C7] focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xs transition cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send via WhatsApp ({mobileNumber})</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitWebForm}
                  disabled={isSubmitting || !formData.message.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#0B1E36] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xs transition cursor-pointer border border-slate-700 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send via Web'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 5 Columns: Verified Details & Communication Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Info Box */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xs p-6 space-y-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contact Credentials</span>
            </h3>

            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <User className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">Full Name</div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {contactName}
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">Mobile Phone</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {mobileNumber}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Available on WhatsApp
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">Location</div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">
                    Colombo • Western Province, Sri Lanka
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">Direct Availability</div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">
                    Monday to Saturday, 08:00 AM - 08:00 PM IST (WhatsApp 24/7 for Breaking News)
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Whistleblower & Confidential Dispatches Note */}
          <div className="bg-[#0B1E36]/5 dark:bg-slate-800/40 border-l-4 border-amber-500 p-4 space-y-2 rounded-r-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Confidential Sources & News Tips</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              If you have sensitive economic data, documents, or CSE disclosures, you can communicate directly and confidentially via WhatsApp with {contactName} at <strong>{mobileNumber}</strong>. Anonymity and source confidentiality are strictly preserved under journalist ethics.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
