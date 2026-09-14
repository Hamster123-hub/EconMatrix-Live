import React, { useState, useEffect } from 'react';
import { MessageCircle, Bell, Users, ShieldCheck, Send, ExternalLink, Sparkles } from 'lucide-react';
import { Language } from '../utils/translations';

interface WhatsAppLiveAdBannerProps {
  language?: Language;
  onOpenWhatsAppModal?: () => void;
}

export const WhatsAppLiveAdBanner: React.FC<WhatsAppLiveAdBannerProps> = ({
  language = 'en',
  onOpenWhatsAppModal,
}) => {
  const [activeNotificationIndex, setActiveNotificationIndex] = useState(0);

  const notifications = [
    { title: '⚡ BREAKING NEWS', text: 'Central Bank keeps policy rates corridor stable at 8.25%', time: '1m ago' },
    { title: '📈 CSE MARKET DISPATCH', text: 'ASPI surges +54.2 pts led by Banking & Exporters', time: '3m ago' },
    { title: '💵 FOREX & TREASURY', text: 'USD/LKR Treasury buying rate closes at 298.20', time: '8m ago' },
    { title: '📊 IMF GOVERNANCE REVIEW', text: 'Revenue target benchmark surpassed by 12.4%', time: '12m ago' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNotificationIndex((prev) => (prev + 1) % notifications.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const handleAction = () => {
    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal();
    } else {
      window.open('https://chat.whatsapp.com/EconMatrixDailyMarketDispatch', '_blank');
    }
  };

  return (
    <div className="w-full my-4 font-sans">
      {/* Outer Card Container: Thin & Long Sidebar Ad Unit */}
      <div className="bg-gradient-to-b from-[#FAFDFB] via-[#F0F7F4] to-[#E2EFE9] border-2 border-[#0B1E36] hover:border-[#25D366] shadow-lg rounded-xl overflow-hidden relative group transition-all duration-300">
        
        {/* Top Header & Copy Section */}
        <div className="p-5 text-center flex flex-col items-center space-y-3 relative z-10 bg-white/60 backdrop-blur-xs border-b border-emerald-900/10">
          
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#0B1E36] text-white px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WHATSAPP DISPATCH</span>
          </div>

          {/* Main Headline & Slogan matching reference image */}
          <div className="space-y-0.5 pt-1">
            <h3 className="font-serif font-black text-3xl sm:text-4xl text-[#0B1E36] tracking-tight leading-none">
              EconMatrix
            </h3>
            <p className="font-sans font-medium text-xs sm:text-sm text-slate-700 tracking-wide">
              brings the numbers to you!
            </p>
          </div>

          {/* Primary Pill Button matching reference image style */}
          <div className="pt-1 space-y-1.5 w-full flex flex-col items-center">
            <button
              onClick={handleAction}
              className="w-full bg-[#0B1E36] hover:bg-[#25D366] text-white hover:text-[#0B1E36] font-sans font-black text-xs sm:text-sm py-3 px-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-2 border-[#0B1E36]"
            >
              <div className="w-5 h-5 rounded-full bg-[#25D366] text-[#0B1E36] group-hover:bg-[#0B1E36] group-hover:text-[#25D366] flex items-center justify-center transition-colors shrink-0">
                <Send className="w-3 h-3 fill-current" />
              </div>
              <span className="truncate">Follow our WhatsApp Channel</span>
            </button>

            <p className="text-[10px] font-sans font-semibold text-slate-600">
              Get our latest updates on WhatsApp!
            </p>
          </div>
        </div>

        {/* Dynamic Animated Popping 3D Phone Mockup Container */}
        <div 
          onClick={handleAction}
          className="relative pt-6 pb-2 flex justify-center items-end min-h-[290px] cursor-pointer bg-gradient-to-b from-slate-200/40 via-emerald-100/30 to-slate-300/60 overflow-hidden"
        >
          {/* Background Arch Curved Shape (Matches reference visual layout) */}
          <div className="absolute bottom-0 w-52 h-52 sm:w-56 sm:h-56 rounded-t-full bg-[#8EA8BD]/30 border-t border-x border-slate-400/40 z-0" />

          {/* Floating Popping Phone Chassis */}
          <div 
            className="relative z-10 transform transition-all duration-500 hover:scale-108 hover:-translate-y-3 cursor-pointer"
            style={{
              animation: 'phonePopFloat 3.8s ease-in-out infinite',
            }}
          >
            {/* Phone Outer Shell */}
            <div className="w-48 sm:w-52 h-[260px] sm:h-[280px] bg-[#0A111E] rounded-t-[32px] p-2.5 border-4 border-slate-800 shadow-2xl relative flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Camera Notch */}
              <div className="w-16 h-3.5 bg-black rounded-full mx-auto mb-1.5 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              {/* Phone Display Canvas */}
              <div className="flex-1 bg-gradient-to-b from-[#0B2545] via-[#0D2E57] to-[#0A192F] rounded-t-[20px] p-3 text-white flex flex-col justify-between border border-slate-700/60 relative overflow-hidden">
                
                {/* Phone Header */}
                <div className="flex items-center justify-between text-[9px] text-slate-300 font-mono border-b border-slate-700/60 pb-1.5">
                  <div className="flex items-center gap-1 text-[#25D366]">
                    <MessageCircle className="w-3 h-3 fill-current" />
                    <span className="font-bold">WhatsApp</span>
                  </div>
                  <span className="bg-[#25D366] text-black text-[7px] font-black uppercase px-1 py-0.2 rounded-xs">
                    VERIFIED
                  </span>
                </div>

                {/* Center "EM" Brand Circle Badge matching EconMatrix brand */}
                <div className="my-auto text-center space-y-2 py-1">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#1A2638] border-2 border-[#25D366] flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition duration-300 relative">
                    <span className="font-serif font-black text-2xl text-white tracking-tighter italic">
                      EM
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 bg-[#25D366] text-black w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">EconMatrix</h4>
                    <p className="text-[9px] font-mono text-emerald-400">@econmatrix_official</p>
                  </div>
                </div>

                {/* Animated Pop-Up Live Broadcast Message Card */}
                <div className="bg-[#0B132B]/95 border border-emerald-400/80 p-2 rounded-md shadow-lg text-left space-y-0.5 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-[8px] font-mono text-emerald-400">
                    <span className="font-bold flex items-center gap-1">
                      <Bell className="w-2.5 h-2.5" />
                      {notifications[activeNotificationIndex].title}
                    </span>
                    <span className="text-slate-400">{notifications[activeNotificationIndex].time}</span>
                  </div>
                  <p className="text-[9px] font-sans font-medium text-slate-200 leading-tight line-clamp-2">
                    {notifications[activeNotificationIndex].text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats & Verified Badge */}
        <div className="p-3 bg-white/80 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
          <span className="flex items-center gap-1 font-bold">
            <Users className="w-3 h-3 text-[#0284C7]" />
            14.2k+ Members
          </span>
          <span className="flex items-center gap-1 text-[#25D366] font-bold">
            <ShieldCheck className="w-3 h-3" />
            Official Channel
          </span>
        </div>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes phonePopFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-1.5deg);
          }
        }
      `}</style>
    </div>
  );
};
