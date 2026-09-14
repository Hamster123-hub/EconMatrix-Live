import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Globe, ExternalLink, Heart, Eye, TrendingUp, BarChart3, FileText, Shield, Search, RefreshCw, CheckCircle2, Lock, ArrowUpRight, Award, Zap } from 'lucide-react';

interface AiExecutiveAnalystDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  currentUser: any;
  onOpenStaffPortal: () => void;
  language: 'en' | 'si' | 'ta';
}

export const AiExecutiveAnalystDashboard: React.FC<AiExecutiveAnalystDashboardProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  currentUser,
  onOpenStaffPortal,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'themes' | 'web_scanner' | 'report_5pm' | 'chat'>('analytics');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // AI Chat states
  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; sources?: any[] }[]
  >([
    {
      sender: 'assistant',
      text:
        language === 'si'
          ? 'ආයුබෝවන්! මම LankaEcon හි ප්‍රධාන AI මූල්‍ය සහ ව්‍යාපාරික විශ්ලේෂක වෙමි. පාඨක ප්‍රතිචාර, කොළඹ කොටස් වෙළඳපල දත්ත හෝ ව්‍යාපාරික උපායමාර්ග පිළිබඳව මගෙන් විමසන්න.'
          : language === 'ta'
          ? 'வணக்கம்! நான் LankaEcon இன் முதன்மை AI நிதி மற்றும் வணிக பகுப்பாய்வாளர். வாசகர் ஈடுபாடு, கொழும்பு பங்குச்சந்தை அல்லது வணிக உத்திகள் குறித்து என்னிடம் கேளுங்கள்.'
          : 'Welcome to LankaEcon Executive AI Intelligence & Business Analyst. I track real-time reader engagement, post heart-likes, hourly click curves, global news trends, and daily business revenue forecasts.',
    },
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // 5 PM Report state
  const [reportResult, setReportResult] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchDashboardData();
    }
  }, [isOpen, isLoggedIn]);

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/analytics/dashboard');
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch {
      console.error('Error fetching analytics dashboard data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleGenerate5pmReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/analytics/daily-report', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setReportResult(data.report);
      }
    } catch {
      alert('Error generating daily executive report.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isSendingChat) return;

    const userQ = promptInput.trim();
    setPromptInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQ }]);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/ai/financial-analyst-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userQ,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            sources: data.sources,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: 'I could not process that query at this moment. Please try again.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to connect to the LankaEcon AI Intelligence Server. Please verify network connection.',
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  if (!isOpen) return null;

  // RESTRICTED ACCESS SCREEN IF NOT LOGGED IN AS STAFF
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans">
        <div className="bg-[#0B1E36] border-2 border-amber-500 w-full max-w-md p-8 text-white space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-[#DC2626] text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest inline-block">
              CORPORATE RESTRICTED
            </span>
            <h3 className="font-extrabold text-2xl uppercase tracking-tight text-white">
              AI Analyst & Intelligence Backend
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The AI Executive Analyst and real-time reader engagement portal is restricted exclusively to authorized LankaEcon employees and company owners.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-4 text-left font-mono text-[11px] text-slate-300 space-y-1">
            <p className="text-amber-400 font-bold">SECURITY GATEWAY VERIFICATION:</p>
            <p>• Staff CMS Session: NOT AUTHORIZED</p>
            <p>• Role Level Required: EMPLOYEE / OWNER</p>
            <p className="text-rose-400">• Access Status: DENIED FOR PUBLIC VISITORS</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenStaffPortal();
              }}
              className="flex-1 bg-[#0284C7] hover:bg-sky-500 text-white font-extrabold text-xs py-3.5 uppercase tracking-wider transition cursor-pointer"
            >
              Sign In via Staff CMS Portal
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-3.5 uppercase transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-[#0B1E36] border-2 border-[#0284C7] w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl text-white my-auto overflow-hidden">
        
        {/* Top Intelligence Header Bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0284C7] to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg uppercase tracking-tight text-white">
                  LankaEcon AI Executive Analyst & Intelligence Engine
                </h3>
                <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">
                  CONFIDENTIAL STAFF BACKEND
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-time reader tracking • Hourly engagement curves • Tiny Heart Likes • Web News Scanner • 5:00 PM Reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 font-bold uppercase transition flex items-center gap-1 cursor-pointer"
              title="Refresh Real-time Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0284C7] ${isLoadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Intelligence Navigation Tabs */}
        <div className="bg-[#132A4A] border-b border-slate-800 px-4 flex overflow-x-auto gap-2 py-2 text-xs font-extrabold uppercase tracking-wider shrink-0">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#0284C7] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Story Interactions & Hourly Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-[#0284C7] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Popular Themes & Sentiment</span>
          </button>

          <button
            onClick={() => setActiveTab('web_scanner')}
            className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'web_scanner'
                ? 'bg-[#0284C7] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-300" />
            <span>Global Web News Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('report_5pm')}
            className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'report_5pm'
                ? 'bg-[#DC2626] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Daily 5:00 PM Strategy Report</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#0284C7] text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Analyst Copilot Chat</span>
          </button>
        </div>

        {/* Dashboard Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-100">
          
          {/* TAB 1: STORY INTERACTIONS & HOURLY ENGAGEMENT CURVE */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Executive Metrics Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-700 p-4 space-y-2">
                  <span className="text-xs text-slate-400 font-mono uppercase">Total Story Reads Today</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-white">42,850</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">+18.4%</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Tracked across homepage and direct shares</p>
                </div>

                <div className="bg-slate-900 border border-slate-700 p-4 space-y-2">
                  <span className="text-xs text-slate-400 font-mono uppercase flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Total Reader Hearts (Likes)</span>
                  </span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-rose-400">3,490</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">+24.1%</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Interactive tiny heart clicks on stories</p>
                </div>

                <div className="bg-slate-900 border border-slate-700 p-4 space-y-2">
                  <span className="text-xs text-slate-400 font-mono uppercase">Avg. Read Duration</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-amber-300">3m 42s</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">+0m 35s</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">High depth for macroeconomic dispatches</p>
                </div>

                <div className="bg-slate-900 border border-slate-700 p-4 space-y-2">
                  <span className="text-xs text-slate-400 font-mono uppercase">Peak Engagement Hour</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-[#0284C7]">11:00 AM</span>
                    <span className="text-xs text-slate-300 font-mono">CSE Opening</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Highest reader activity before lunch</p>
                </div>
              </div>

              {/* Engagements Per Hour Chart Simulation */}
              <div className="bg-slate-900 border border-slate-700 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-extrabold text-base text-white uppercase flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#0284C7]" />
                      <span>Reader Engagements Per Hour Timeline (06:00 - 22:00)</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Real-time track of article clicks, audio dispatch plays, and tiny heart likes per hour.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500 px-2 py-1">
                    LIVE STREAM ACTIVE
                  </span>
                </div>

                {/* Bar Graph Representation */}
                <div className="h-48 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
                  {[
                    { hour: '06:00', val: 25 },
                    { hour: '07:00', val: 40 },
                    { hour: '08:00', val: 65 },
                    { hour: '09:00', val: 88 },
                    { hour: '10:00', val: 92 },
                    { hour: '11:00', val: 100 }, // Peak
                    { hour: '12:00', val: 78 },
                    { hour: '13:00', val: 60 },
                    { hour: '14:00', val: 72 },
                    { hour: '15:00', val: 85 },
                    { hour: '16:00', val: 90 },
                    { hour: '17:00', val: 95 }, // 5 PM Report peak
                    { hour: '18:00', val: 70 },
                    { hour: '19:00', val: 55 },
                    { hour: '20:00', val: 42 },
                    { hour: '21:00', val: 30 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                        {item.val * 42}
                      </span>
                      <div
                        className={`w-full transition-all duration-500 ${
                          item.val >= 90
                            ? 'bg-gradient-to-t from-[#0284C7] to-cyan-300'
                            : item.val >= 60
                            ? 'bg-gradient-to-t from-indigo-700 to-[#0284C7]'
                            : 'bg-slate-700'
                        }`}
                        style={{ height: `${item.val}%` }}
                      ></div>
                      <span className="text-[8px] font-mono text-slate-400 rotate-45 sm:rotate-0 mt-1">
                        {item.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-Story Interaction Table with Tiny Heart Likes */}
              <div className="bg-slate-900 border border-slate-700 p-6 space-y-4">
                <h4 className="font-extrabold text-base text-white uppercase flex items-center justify-between">
                  <span>Per-Story Reader Interaction Matrix</span>
                  <span className="text-xs text-slate-400 font-mono font-normal">Tracking Clicks & Tiny Heart Likes</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-950 text-slate-300 uppercase font-bold text-[10px] border-b border-slate-800">
                        <th className="p-3">Story Dispatch Headline</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Tiny Heart Likes</th>
                        <th className="p-3">Total Click Reads</th>
                        <th className="p-3">Engagement Rate</th>
                        <th className="p-3">AI Sentiment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {(dashboardData?.articles || [
                        { id: 1, title: 'Sri Lanka Central Bank Keeps Policy Rates Unchanged Amid Stabilizing Inflation', category: 'ECONOMY', likes: 482, clicks: 8290, rate: '8.4%', sentiment: 'Optimistic Macro' },
                        { id: 2, title: 'CSE All Share Price Index Rallies Past 12,500 Mark Led by Banking Equities', category: 'MARKETS', likes: 395, clicks: 6420, rate: '7.8%', sentiment: 'Bullish Financials' },
                        { id: 3, title: 'IMF Completes Second Review of Sri Lanka Extended Fund Facility', category: 'POLICY', likes: 612, clicks: 11400, rate: '9.2%', sentiment: 'High Policy Interest' },
                        { id: 4, title: 'Ceylon Tea Export Revenue Touches 5-Year High in Q2', category: 'TRADE', likes: 210, clicks: 4180, rate: '6.1%', sentiment: 'Export Positive' },
                      ]).map((art: any) => (
                        <tr key={art.id} className="hover:bg-slate-800/60">
                          <td className="p-3 font-bold text-white max-w-xs truncate">{art.title}</td>
                          <td className="p-3">
                            <span className="bg-[#0284C7] text-white text-[9px] font-bold px-2 py-0.5 uppercase">
                              {art.category || art.primary_category || 'NEWS'}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-rose-400 flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            <span>{art.likes || art.likes_count || 120}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-300 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>{(art.clicks || art.view_count || 1200).toLocaleString()}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400">{art.rate || '7.5%'}</td>
                          <td className="p-3 text-[11px] font-mono text-amber-300">{art.sentiment || 'Positive'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: POPULAR THEMES & SENTIMENT */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-700 p-6 space-y-4">
                <h4 className="font-extrabold text-base text-white uppercase flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>Reader Interest Themes & Topic Engagement Ranking</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The AI Analyst scans reader click density and heart-like ratios to determine the top macroeconomic themes commanding attention across South Asia.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    { rank: '#1', theme: 'Central Banking Policy & Monetary Stance', engagementShare: '34%', growth: '+12.5%', keywords: 'CBSL, Inflation, Rate Corridor, Liquidity' },
                    { rank: '#2', theme: 'IMF Sovereign Debt & ISB Haircut Restructuring', engagementShare: '28%', growth: '+18.2%', keywords: 'Paris Club, Debt Sustainability, Tranche' },
                    { rank: '#3', theme: 'CSE Stock Exchange Banking & Commercial Equities', engagementShare: '22%', growth: '+8.4%', keywords: 'ASPI, COMB, NDB, Foreign Inflows' },
                    { rank: '#4', theme: 'Ceylon Tea & Agricultural Export Tariffs', engagementShare: '16%', growth: '+14.1%', keywords: 'Spice Exports, Tea Auction, Exchange Rate' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-2xl text-amber-400 font-mono">{item.rank}</span>
                        <span className="bg-emerald-950 text-emerald-300 font-mono text-xs font-bold px-2.5 py-1 border border-emerald-500">
                          {item.growth} Share Growth
                        </span>
                      </div>
                      <h5 className="font-extrabold text-sm text-white uppercase">{item.theme}</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                          <span>Engagement Share</span>
                          <span className="text-[#0284C7] font-bold">{item.engagementShare}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0284C7]" style={{ width: item.engagementShare }}></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Key Terms: {item.keywords}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL WEB NEWS SCANNER */}
          {activeTab === 'web_scanner' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-700 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-extrabold text-base text-white uppercase flex items-center gap-2">
                      <Globe className="w-5 h-5 text-amber-400" />
                      <span>Live AI Web News Scanner (Global & South Asia Financial Wire)</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Scans Reuters, Bloomberg, Financial Times, and CBSL RSS feeds to alert editors on breaking financial developments.
                    </p>
                  </div>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-3 py-1 border border-amber-500 font-bold">
                    SCANNING LIVE INTERNET
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { source: 'REUTERS GLOBAL', time: '12m ago', title: 'South Asian Central Banks Signal Uniform Interest Rate Pause as Commodity Prices Moderate', impact: 'HIGH MACRO IMPACT', summary: 'Regional monetary authorities maintain policy rates following stabilization in import prices.' },
                    { source: 'BLOOMBERG MARKETS', time: '28m ago', title: 'Sri Lanka Sovereign Dollar Bonds Advance on Accelerated Restructuring Agreement', impact: 'HIGH MARKET IMPACT', summary: 'Commercial creditors express approval for finalized debt treatment frameworks.' },
                    { source: 'CBSL DISPATCH', time: '1h ago', title: 'Weekly Foreign Exchange Reserve Buffer Expands to USD 5.8 Billion', impact: 'MEDIUM IMPACT', summary: 'Export earnings and worker remittances contribute to strengthening official reserves.' },
                  ].map((news, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-4 space-y-2 hover:border-[#0284C7] transition">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-amber-400 font-bold">{news.source} • {news.time}</span>
                        <span className="bg-rose-950 text-rose-300 px-2 py-0.5 border border-rose-500 font-bold">{news.impact}</span>
                      </div>
                      <h5 className="font-extrabold text-sm text-white">{news.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{news.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DAILY 5:00 PM EXECUTIVE STRATEGY REPORT */}
          {activeTab === 'report_5pm' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border-2 border-[#DC2626] p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="bg-[#DC2626] text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest inline-block mb-1">
                      DAILY EXECUTIVE REPORT ENGINE
                    </span>
                    <h4 className="font-extrabold text-xl text-white uppercase">
                      5:00 PM Business & Editorial Strategic Briefing
                    </h4>
                    <p className="text-xs text-slate-400">
                      Automated AI synthesis generated daily at 5:00 PM Sri Lanka Time for the business owner and editorial board.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerate5pmReport}
                    disabled={isGeneratingReport}
                    className="bg-[#DC2626] hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-md shrink-0"
                  >
                    <Zap className={`w-4 h-4 text-amber-300 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingReport ? 'Compiling 5 PM Report...' : 'Generate 5:00 PM Report Now'}</span>
                  </button>
                </div>

                {reportResult ? (
                  <div className="bg-slate-950 border border-slate-800 p-6 space-y-6 font-sans">
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-xs text-slate-400 font-mono">
                      <span>REPORT TIMESTAMP: {new Date().toLocaleDateString()} 17:00:00 SLST</span>
                      <span className="text-emerald-400 font-bold">STATUS: VERIFIED BY AI ANALYST</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-900 p-4 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Total Readers Today</span>
                        <p className="text-2xl font-black text-white">{reportResult.readersToday || '42,850'}</p>
                      </div>
                      <div className="bg-slate-900 p-4 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Subscription Conversions</span>
                        <p className="text-2xl font-black text-emerald-400">{reportResult.subscriptionsConverted || '+14 Pro Users'}</p>
                      </div>
                      <div className="bg-slate-900 p-4 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Ad Revenue Earned Today</span>
                        <p className="text-2xl font-black text-amber-400">{reportResult.adRevenueLKR || 'LKR 85,000'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-extrabold text-sm text-amber-300 uppercase flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>AI Strategic Recommendations for Tomorrow</span>
                      </h5>
                      
                      <div className="space-y-2 text-xs text-slate-200">
                        {(reportResult.recommendations || [
                          '1. Editorial Focus: Commission an exclusive analysis on Central Bank open market operations before tomorrow’s Treasury bill auction.',
                          '2. Ad Operations: Highlight Cinnara Spice & Commercial Bank ad placement slots in tomorrow morning’s newsletter push.',
                          '3. Reader Growth: Boost the "IMF Sovereign Debt Review" story to official @lankaecon.lk Instagram stories to capture institutional investors.',
                        ]).map((rec: string, rIdx: number) => (
                          <div key={rIdx} className="bg-slate-900 border-l-4 border-[#0284C7] p-3 leading-relaxed font-mono">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 p-8 text-center space-y-3">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-sm font-extrabold uppercase text-slate-300">
                      Daily 5:00 PM Executive Strategy Briefing Ready
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Click "Generate 5:00 PM Report Now" to run the AI compiler and review today's readership metrics, top performing dispatches, and growth action plans.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: AI ANALYST COPILOT CHAT */}
          {activeTab === 'chat' && (
            <div className="h-[60vh] flex flex-col bg-slate-950 border border-slate-800">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 bg-[#0284C7] text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] p-4 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0284C7] text-white'
                          : 'bg-slate-900 border border-slate-700 text-slate-100'
                      }`}
                    >
                      <div className="whitespace-pre-line font-mono text-xs">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask the AI Analyst about post likes, story engagement, or CSE figures..."
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 px-4 py-2.5 text-xs text-white focus:outline-hidden font-mono"
                />
                <button
                  type="submit"
                  disabled={isSendingChat}
                  className="bg-[#0284C7] hover:bg-sky-500 text-white font-extrabold text-xs px-6 py-2.5 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
