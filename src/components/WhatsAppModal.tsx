import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, CheckCircle, Users, Bell, Shield } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const [subscribedGroup, setSubscribedGroup] = useState<string | null>(null);

  if (!isOpen) return null;

  const whatsappGroups = [
    {
      id: 'wa-1',
      name: 'Econ Matrix Daily Market Dispatch',
      members: '8,420 / 10,000 members',
      audience: 'Colombo Stock Exchange, CSE Traders & Equity Investors',
      link: 'https://chat.whatsapp.com/EconMatrixDailyMarketDispatch',
      tag: 'MOST POPULAR',
    },
    {
      id: 'wa-2',
      name: 'Econ Matrix Macro Policy & Sovereign Debt Desk',
      members: '5,180 / 10,000 members',
      audience: 'Central Bank (CBSL), IMF Debt Restructuring & Fiscal Policy',
      link: 'https://chat.whatsapp.com/EconMatrixMacroPolicy',
      tag: 'OFFICIAL POLICY',
    },
    {
      id: 'wa-3',
      name: 'Western & Central Province Business Alerts',
      members: '6,310 / 10,000 members',
      audience: 'Real Estate, Port Shipping, Apparel & Agricultural Exporters',
      link: 'https://chat.whatsapp.com/LankaEconProvinceAlerts',
      tag: 'REGIONAL',
    },
    {
      id: 'wa-4',
      name: 'Econ Academy & Scholar Research Network',
      members: '3,890 / 5,000 members',
      audience: 'University Faculty, Economics Scholars & Students',
      link: 'https://chat.whatsapp.com/EconAcademyScholarNetwork',
      tag: 'ACADEMIC',
    },
  ];

  const handleJoin = (groupName: string, link: string) => {
    setSubscribedGroup(groupName);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] border-2 border-[#2563EB] text-[#FDFBF7] w-full max-w-xl rounded-none shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B132B] p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#25D366] text-slate-950 font-black flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-white uppercase tracking-wider">
                EconMatrix WhatsApp Intelligence Network
              </h3>
              <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
                Direct Mobile Broadcasts & Breaking Financial Alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-sans">
          <p className="text-xs text-gray-300 leading-relaxed font-editorial-body">
            Receive verified, instant Sri Lanka market dispatches, Central Bank policy updates, and breaking economic news directly on your phone. Select your preferred WhatsApp dispatch group below:
          </p>

          {subscribedGroup && (
            <div className="bg-emerald-950/80 border border-emerald-500 p-3 text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Redirecting you to join <strong>{subscribedGroup}</strong> on WhatsApp...</span>
            </div>
          )}

          <div className="space-y-3">
            {whatsappGroups.map((group) => (
              <div
                key={group.id}
                className="bg-[#0F172A] border border-slate-700 hover:border-emerald-500 p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#25D366] text-black font-extrabold text-[9px] uppercase px-2 py-0.5 tracking-wider">
                      {group.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-400" />
                      {group.members}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{group.name}</h4>
                  <p className="text-xs text-slate-300 font-editorial-body">{group.audience}</p>
                </div>

                <button
                  onClick={() => handleJoin(group.name, group.link)}
                  className="bg-[#25D366] hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                >
                  <span>Join Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              All EconMatrix WhatsApp channels are strictly admin-only announcement groups to eliminate spam and protect privacy.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0B132B] px-6 py-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2 uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
