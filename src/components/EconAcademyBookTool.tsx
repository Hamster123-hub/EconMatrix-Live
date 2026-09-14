import React, { useState } from 'react';
import { BOOK_EQUATIONS, calculatePolicySimulation, ScenarioState } from '../data/bookData';
import { EquationCard } from './EquationCard';
import { FormattedText } from './FormattedText';
import { 
  Sparkles, RefreshCw, Sliders, Award, Calculator, Bot, User, Volume2, VolumeX, 
  Send, Search, CheckCircle, ArrowRight
} from 'lucide-react';

interface Props {
  language?: 'en' | 'si' | 'ta';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  keyTakeaway?: string;
  followUpQuestions?: string[];
  timestamp: string;
}

export const EconAcademyBookTool: React.FC<Props> = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'ai-qa' | 'simulator' | 'concepts' | 'curriculum'>('ai-qa');
  const [equationSearch, setEquationSearch] = useState('');
  const [equationCategory, setEquationCategory] = useState<'ALL' | 'QUANTITY' | 'BOP' | 'RATES' | 'RESERVES'>('ALL');

  // Interactive AI Q&A Assistant State
  const [userQuestion, setUserQuestion] = useState('');
  const [isQaLoading, setIsQaLoading] = useState(false);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `Welcome to the **Interactive AI Economics & Central Banking Assistant**!

I am your interactive AI professor trained in central banking mechanics, monetary policy, and macroeconomic analysis. You can ask me any question about:
- Central banking mechanics & Open Market Operations (OMOs)
- Interest rate corridors (Standing Deposit & Lending Facilities)
- Foreign exchange reserve accumulation & sterilization
- The Current Account & Savings-Investment identity ($CA = S - I$)
- Classical, Marxian, and Keynesian monetary theory
- Exchange rate regimes and the Impossible Trinity

Select any prompt below or ask your own question!`,
      keyTakeaway: "Interactive AI economics analysis grounded in central banking principles and macroeconomic identities.",
      followUpQuestions: [
        "How do central bank Open Market Operations affect interbank interest rates?",
        "Explain John Exter's law on foreign exchange reserve accumulation.",
        "How does the Current Account identity CA = S - I explain twin deficits?",
        "What is the Impossible Trinity in open economy macroeconomics?"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  // Policy Simulator State
  const [simState, setSimState] = useState<ScenarioState>({
    policyRateOPR: 8.5,
    cbslUsdPurchase: 150,
    sterilizationRate: 20,
    fiscalDeficitPct: 7.5,
  });

  const filteredEquations = BOOK_EQUATIONS.filter((eq) => {
    const matchesSearch =
      !equationSearch.trim() ||
      eq.name.toLowerCase().includes(equationSearch.toLowerCase()) ||
      eq.displayFormula.toLowerCase().includes(equationSearch.toLowerCase()) ||
      eq.variableDefinitions.some(
        (v) =>
          v.symbol.toLowerCase().includes(equationSearch.toLowerCase()) ||
          v.label.toLowerCase().includes(equationSearch.toLowerCase()) ||
          v.meaning.toLowerCase().includes(equationSearch.toLowerCase())
      );

    const matchesCat =
      equationCategory === 'ALL' ||
      (equationCategory === 'QUANTITY' && (eq.id === 'eq1' || eq.id === 'eq8')) ||
      (equationCategory === 'BOP' && (eq.id === 'eq2' || eq.id === 'eq3' || eq.id === 'eq4' || eq.id === 'eq6')) ||
      (equationCategory === 'RATES' && (eq.id === 'eq5' || eq.id === 'eq7')) ||
      (equationCategory === 'RESERVES' && (eq.id === 'eq9'));

    return matchesSearch && matchesCat;
  });

  const handleAskBookAi = async (customPrompt?: string) => {
    const promptToUse = customPrompt || userQuestion;
    if (!promptToUse.trim() || isQaLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: promptToUse.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setUserQuestion('');
    setIsQaLoading(true);

    try {
      const res = await fetch('/api/ai/econ-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse.trim(),
          chapterTitle: 'Interactive Economics Scope',
          chapterSubtitle: 'Macroeconomic & Policy Analysis',
          keyConcepts: 'Central Banking, OMOs, Sterilization, BOP, CA=S-I, Soft-Peg, Interest Rates',
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.explanation) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.explanation,
          keyTakeaway: data.keyTakeaway,
          followUpQuestions: data.followUpQuestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: `Analysis for "${promptToUse.trim()}":\n\nCentral banking operations require strict adherence to rules-based operational corridors. When central banks inject unsterilized liquidity via reverse repos or unsterilized currency purchases, commercial banks expand credit, driving import demand and pressure on currency stability.\n\nTo restore balance, open market operations must absorb excess liquidity (sterilization) rather than suppressing interest rates artificially below market equilibrium.`,
        keyTakeaway: "Monetary stability requires transparent rules-based central banking without discretionary interest rate suppression.",
        followUpQuestions: [
          "Explain the difference between a Floor system and a Corridor system.",
          "How do liquidity injections affect commercial bank lending?",
          "Why is the Savings-Investment identity CA = S - I fundamental?"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsQaLoading(false);
    }
  };

  const handlePlayTts = async (msgId: string, textToRead: string) => {
    if (isPlayingAudioId === msgId) {
      setIsPlayingAudioId(null);
      return;
    }

    try {
      setIsPlayingAudioId(msgId);
      const cleanText = textToRead.replace(/[*#_`]/g, '').slice(0, 800);
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryStr = atob(data.audio);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlayingAudioId(null);
        source.start(0);
      } else {
        setIsPlayingAudioId(null);
      }
    } catch {
      setIsPlayingAudioId(null);
    }
  };

  const simResults = calculatePolicySimulation(simState);

  return (
    <div className="bg-[#FAF9F6] text-slate-900 border-2 border-slate-900 rounded-none shadow-none space-y-8 p-4 sm:p-8">
      {/* Hero Header Banner */}
      <div className="bg-[#0F172A] text-slate-100 p-6 sm:p-10 border-b-4 border-[#0284C7] relative overflow-hidden">
        <div className="max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#0284C7] text-white font-mono font-extrabold text-[10px] uppercase tracking-widest px-3 py-1">
              INTERACTIVE AI ECONOMICS TOOL
            </span>
            <span className="bg-amber-500 text-slate-950 font-mono font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Central Banking & Policy Simulator
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold leading-tight text-white tracking-tight">
            Interactive AI Economics & Central Banking Tool
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            Explore interactive central banking policy simulations, query our Gemini-powered AI economics tutor for instant grounded answers, and study core macroeconomic identities and policy frameworks.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('ai-qa')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-extrabold px-5 py-2.5 uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-md"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>Launch AI Economics Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-extrabold px-5 py-2.5 uppercase tracking-wider flex items-center gap-2 cursor-pointer transition border border-sky-400"
            >
              <Sliders className="w-4 h-4 text-white" />
              <span>Open Policy Corridor Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Bar */}
      <div className="flex border-b-2 border-slate-900 gap-2 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ai-qa')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 font-mono text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border-t-2 border-x-2 shrink-0 ${
            activeTab === 'ai-qa'
              ? 'bg-[#0F172A] text-white border-slate-900'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          <Bot className="w-4 h-4 text-sky-400" />
          <span>1. Interactive AI Economics Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 font-mono text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border-t-2 border-x-2 shrink-0 ${
            activeTab === 'simulator'
              ? 'bg-[#0F172A] text-white border-slate-900'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>2. Central Banking Policy Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('concepts')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 font-mono text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border-t-2 border-x-2 shrink-0 ${
            activeTab === 'concepts'
              ? 'bg-[#0F172A] text-white border-slate-900'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>3. Core Economic Concepts ({BOOK_EQUATIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 font-mono text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border-t-2 border-x-2 shrink-0 ${
            activeTab === 'curriculum'
              ? 'bg-[#0F172A] text-white border-slate-900'
              : 'bg-white text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          <Award className="w-4 h-4 text-sky-400" />
          <span>4. Economics Curriculum Roadmap</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE AI ECONOMICS ASSISTANT (Q&A CHAT) */}
      {activeTab === 'ai-qa' && (
        <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-600 text-white font-mono font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 inline-block">
                  GEMINI 3.6 FLASH GROUNDED AI ASSISTANT
                </span>
                <span className="bg-amber-100 text-amber-900 font-mono font-bold text-[10px] uppercase px-2.5 py-1 border border-amber-300">
                  Interactive AI Economics Tutor
                </span>
              </div>
              <h2 className="font-serif text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Ask Anything About Macroeconomics & Central Banking
              </h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                Type any query on central banking, open market operations, inflation, currency depreciation, or monetary policy to receive an intelligent, grounded explanation.
              </p>
            </div>
          </div>

          {/* Quick Preset Questions Chips */}
          <div className="bg-slate-50 border border-slate-300 p-4 space-y-2">
            <span className="text-[11px] font-mono font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Suggested Economics Questions (Click to Ask AI):</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "How do central bank Open Market Operations affect interbank liquidity?",
                "Explain John Exter's law on foreign exchange reserve accumulation.",
                "How does the Current Account identity CA = S - I explain twin deficits?",
                "Why do import bans fail to fix foreign currency shortages?",
                "What is the 'Impossible Trinity' and how does a soft-peg trap work?",
                "Explain the Quantity Theory of Money (MV = PY) in plain terms."
              ].map((qText, i) => (
                <button
                  key={i}
                  onClick={() => handleAskBookAi(qText)}
                  disabled={isQaLoading}
                  className="bg-white hover:bg-sky-50 text-slate-800 text-xs font-sans p-2 border border-slate-300 hover:border-sky-500 transition cursor-pointer text-left rounded-xs disabled:opacity-50"
                >
                  💬 {qText}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="space-y-4 max-h-[550px] overflow-y-auto p-4 bg-slate-950 rounded-xs border-2 border-slate-900">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 border border-sky-400 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-3xl p-4 rounded-xs space-y-3 font-sans text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-sky-900 text-white border border-sky-700'
                      : 'bg-slate-900 text-slate-100 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] font-mono text-slate-400">
                    <span className="font-bold uppercase text-amber-400">
                      {msg.role === 'user' ? '👤 You' : '🤖 AI Economics Tutor'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handlePlayTts(msg.id, msg.text)}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                          title="Listen to audio reading"
                        >
                          {isPlayingAudioId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="whitespace-pre-line leading-relaxed">
                    <FormattedText text={msg.text} />
                  </div>

                  {msg.keyTakeaway && (
                    <div className="bg-amber-950/80 border-l-4 border-amber-500 p-3 text-xs text-amber-200 font-mono space-y-1">
                      <span className="font-extrabold uppercase text-[10px] block text-amber-400">
                        💡 Key Policy Takeaway:
                      </span>
                      <p className="font-sans text-xs text-amber-100">{msg.keyTakeaway}</p>
                    </div>
                  )}

                  {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="border-t border-slate-800 pt-2 space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                        Suggested Follow-Up Questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((fq, i) => (
                          <button
                            key={i}
                            onClick={() => handleAskBookAi(fq)}
                            className="bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-mono px-2.5 py-1 border border-slate-700 cursor-pointer transition text-left"
                          >
                            ↳ {fq}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 border border-amber-300 mt-1 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isQaLoading && (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 text-sky-300 font-mono text-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Consulting macroeconomic identities with Gemini AI...</span>
              </div>
            )}
          </div>

          {/* Q&A Input Form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskBookAi()}
              placeholder="Ask any question about central banking, OMOs, or monetary policy..."
              className="flex-1 bg-slate-50 border-2 border-slate-900 p-3 text-xs sm:text-sm font-sans text-slate-900 focus:outline-none focus:bg-white"
            />
            <button
              onClick={() => handleAskBookAi()}
              disabled={isQaLoading || !userQuestion.trim()}
              className="bg-[#0F172A] hover:bg-slate-800 text-amber-400 font-mono text-xs font-extrabold px-6 py-3 uppercase tracking-wider flex items-center gap-2 cursor-pointer transition disabled:opacity-50 border border-amber-400/50"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CENTRAL BANKING POLICY SANDBOX / SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b-2 border-slate-900 pb-4">
            <span className="bg-[#0284C7] text-white font-mono font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 inline-block mb-1">
              POLICY CORRIDOR SANDBOX
            </span>
            <h2 className="font-serif text-2xl font-extrabold text-slate-900 tracking-tight">
              Macroeconomic Policy & Central Banking Simulator
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Simulate central bank monetary decisions, open market operations, dollar purchases, and fiscal deficits to observe impacts on exchange rates, inflation, and money supply.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sliders Form Column */}
            <div className="lg:col-span-6 space-y-6 bg-slate-50 border-2 border-slate-900 p-6">
              <h3 className="font-serif text-lg font-extrabold text-slate-900 border-b border-slate-300 pb-2 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                <span>Central Bank Policy Parameters</span>
              </h3>

              {/* Policy Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <label className="text-slate-800">Policy Interest Rate (OPR / Repo Rate):</label>
                  <span className="bg-slate-900 text-amber-400 px-2 py-0.5">{simState.policyRateOPR.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="15.0"
                  step="0.25"
                  value={simState.policyRateOPR}
                  onChange={(e) => setSimState({ ...simState, policyRateOPR: parseFloat(e.target.value) })}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-sans">Lowering rates below market equilibrium expands commercial bank credit and drives import demand.</p>
              </div>

              {/* Central Bank USD Purchase Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <label className="text-slate-800">Central Bank USD Purchases (Monthly Reserves):</label>
                  <span className="bg-slate-900 text-amber-400 px-2 py-0.5">${simState.cbslUsdPurchase} Million</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="25"
                  value={simState.cbslUsdPurchase}
                  onChange={(e) => setSimState({ ...simState, cbslUsdPurchase: parseInt(e.target.value) })}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-sans">Buying foreign exchange creates new domestic rupees in the banking system.</p>
              </div>

              {/* Sterilization Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <label className="text-slate-800">Sterilization Rate (OMOs absorbing excess rupees):</label>
                  <span className="bg-slate-900 text-amber-400 px-2 py-0.5">{simState.sterilizationRate}% Sterilized</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={simState.sterilizationRate}
                  onChange={(e) => setSimState({ ...simState, sterilizationRate: parseInt(e.target.value) })}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-sans">Unsterilized rupees expand liquidity and weaken currency stability.</p>
              </div>

              {/* Fiscal Deficit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <label className="text-slate-800">Fiscal Deficit (% of GDP):</label>
                  <span className="bg-slate-900 text-amber-400 px-2 py-0.5">{simState.fiscalDeficitPct.toFixed(1)}% GDP</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="14.0"
                  step="0.5"
                  value={simState.fiscalDeficitPct}
                  onChange={(e) => setSimState({ ...simState, fiscalDeficitPct: parseFloat(e.target.value) })}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-sans">Government borrowing requirements that monetize debt ignite consumer price inflation.</p>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className={`p-6 border-2 border-slate-900 space-y-4 ${
                simResults.statusSeverity === 'CRISIS' ? 'bg-rose-50 border-rose-900' :
                simResults.statusSeverity === 'WARNING' ? 'bg-amber-50 border-amber-900' : 'bg-emerald-50 border-emerald-900'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                  <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    SIMULATED ECONOMIC OUTCOMES
                  </span>
                  <span className={`font-mono text-[10px] font-black px-2.5 py-1 uppercase ${
                    simResults.statusSeverity === 'CRISIS' ? 'bg-rose-600 text-white' :
                    simResults.statusSeverity === 'WARNING' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                  }`}>
                    {simResults.statusSeverity}
                  </span>
                </div>

                <p className="font-serif text-sm font-bold text-slate-900 leading-snug">
                  {simResults.statusMessage}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3.5 border border-slate-300 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Projected Exchange Rate</span>
                    <span className="text-xl font-mono font-extrabold text-slate-900">{simResults.projectedExchangeRate} LKR/USD</span>
                    <span className="text-[10px] text-rose-600 font-mono font-bold block">({simResults.depreciationPct}% change)</span>
                  </div>

                  <div className="bg-white p-3.5 border border-slate-300 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Inflation Forecast</span>
                    <span className="text-xl font-mono font-extrabold text-slate-900">{simResults.projectedInflationPct}%</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Annualized CPI</span>
                  </div>

                  <div className="bg-white p-3.5 border border-slate-300 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Foreign Reserve Gain</span>
                    <span className="text-xl font-mono font-extrabold text-emerald-700">+${simResults.reserveGainUSD}M</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Gross reserves</span>
                  </div>

                  <div className="bg-white p-3.5 border border-slate-300 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Net Excess Liquidity</span>
                    <span className="text-xl font-mono font-extrabold text-amber-700">LKR {simResults.excessRupeesPrintedLkrBillion}B</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Created in bank system</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CORE ECONOMIC CONCEPTS & IDENTITIES */}
      {activeTab === 'concepts' && (
        <div className="space-y-8">
          <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
              <div>
                <span className="bg-[#0284C7] text-white font-mono font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 inline-block mb-1">
                  MACROECONOMIC IDENTITIES
                </span>
                <h2 className="font-serif text-2xl font-extrabold text-slate-900 tracking-tight">
                  Core Macroeconomic Concepts & Policy Identities
                </h2>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  Fundamental equations, definitions, and policy frameworks (Quantity Theory, Current Account identity, Real Rates, Money Multiplier).
                </p>
              </div>

              {/* Equation Search */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={equationSearch}
                  onChange={(e) => setEquationSearch(e.target.value)}
                  placeholder="Search equation or concept..."
                  className="w-full bg-slate-50 border-2 border-slate-900 pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 mr-2">Category:</span>
              {[
                { id: 'ALL', label: 'All Identities (9)' },
                { id: 'QUANTITY', label: 'Quantity & Circulation' },
                { id: 'BOP', label: 'Balance of Payments & Trade' },
                { id: 'RATES', label: 'Interest Rates & Corridors' },
                { id: 'RESERVES', label: 'Reserve Creation & Sterilization' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setEquationCategory(cat.id as any)}
                  className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition cursor-pointer border ${
                    equationCategory === cat.id
                      ? 'bg-[#0F172A] text-white border-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Equations Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEquations.map((eq) => (
                <EquationCard
                  key={eq.id}
                  equation={eq}
                  onAskAi={(prompt) => {
                    setActiveTab('ai-qa');
                    handleAskBookAi(prompt);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CURRICULUM ROADMAP */}
      {activeTab === 'curriculum' && (
        <div className="space-y-8">
          <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-4">
              <Award className="w-8 h-8 text-[#0284C7]" />
              <div>
                <h2 className="font-serif text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                  Curriculum Roadmap: Macroeconomics & Central Banking
                </h2>
                <p className="text-xs text-slate-600 font-sans">
                  Interactive learning path spanning monetary theory, central bank plumbing, and open economy macroeconomics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1 */}
              <div className="bg-slate-50 border-2 border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                  <span className="font-mono text-xs font-extrabold uppercase bg-slate-900 text-white px-2.5 py-1">
                    MODULE 1
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700">Monetary Policy Corridors</span>
                </div>
                <h3 className="font-serif text-lg font-extrabold text-slate-900">
                  Central Bank Operations & Interbank Liquidity
                </h3>
                <ul className="space-y-2 text-xs font-sans text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Standing Facilities:</strong> Standing Deposit Facility (Floor) and Standing Lending Facility (Ceiling).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Open Market Operations:</strong> Repo (absorbing liquidity) vs. Reverse Repo (injecting liquidity).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span><strong>Reserve Requirements:</strong> Statutory Reserve Ratio (SRR) and bank credit expansion.</span>
                  </li>
                </ul>
              </div>

              {/* Box 2 */}
              <div className="bg-slate-50 border-2 border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                  <span className="font-mono text-xs font-extrabold uppercase bg-amber-600 text-slate-950 px-2.5 py-1">
                    MODULE 2
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-800">External Sector & FX</span>
                </div>
                <h3 className="font-serif text-lg font-extrabold text-slate-900">
                  Balance of Payments & Currency Dynamics
                </h3>
                <ul className="space-y-2 text-xs font-sans text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Current Account Identity:</strong> CA = S - I and the link between fiscal deficits and import surges.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>The Impossible Trinity:</strong> Fixed exchange rate, capital mobility, and independent monetary policy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Sterilization Mechanics:</strong> Mopping up domestic currency created during foreign reserve accumulation.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
