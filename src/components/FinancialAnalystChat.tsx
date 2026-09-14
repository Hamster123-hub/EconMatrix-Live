import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Globe, ExternalLink } from 'lucide-react';

interface FinancialAnalystChatProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'si' | 'ta';
}

export const FinancialAnalystChat: React.FC<FinancialAnalystChatProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [chatLang, setChatLang] = useState<'en' | 'si' | 'ta'>(language);

  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; sources?: any[] }[]
  >([
    {
      sender: 'assistant',
      text:
        chatLang === 'si'
          ? 'ආයුබෝවන්! මම LankaEcon හි ප්‍රධාන AI මූල්‍ය සහ ආර්ථික විශ්ලේෂක වෙමි. කොළඹ කොටස් වෙළඳපල (CSE), මහ බැංකු ප්‍රතිපත්ති අනුපාත හෝ මැක්‍රෝ ආර්ථික ප්‍රවණතා පිළිබඳව ඕනෑම දෙයක් අසන්න.'
          : chatLang === 'ta'
          ? 'வணக்கம்! நான் LankaEcon இன் முதன்மை AI நிதி மற்றும் பொருளாதார பகுப்பாய்வாளர். கொழும்பு பங்குச்சந்தை (CSE), மத்திய வங்கி வட்டி விகிதங்கள் அல்லது பொருளாதார போக்குகள் குறித்து என்னிடம் கேளுங்கள்.'
          : 'Welcome to LankaEcon AI Financial Analyst. Ask me anything grounded in Colombo Stock Exchange (CSE) figures, Central Bank interest rate policies, inflation targets, or macroeconomic forecasts.',
    },
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPromptTemplates = [
    "Summarize today's CBSL monetary policy announcement",
    "Compare Q2 earnings between Commercial Bank and CAL",
    "What are the tax implications of the new IMF revenue targets?",
    "Analyze Ceylon Tea export yields & USD exchange rates",
  ];

  const handleSendPrompt = async (userQ: string) => {
    if (!userQ.trim() || isLoading) return;

    setPromptInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQ }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/financial-analyst-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userQ,
          language: chatLang,
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
            text: 'I could not process that request at this moment. Please try again.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to connect to the LankaEcon AI Intelligence Server. Please verify network connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(promptInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
      <div className="bg-[#FDFBF7] border-l-2 border-[#1A1A1A] w-full max-w-lg h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="bg-[#1A1A1A] text-[#FDFBF7] p-4 flex items-center justify-between border-b border-[#333333]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-none bg-[#991B1B] flex items-center justify-center text-white font-extrabold">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FDFBF7] uppercase tracking-wider">
                LankaEcon AI Analyst
              </h3>
              <p className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">
                Grounded in CSE & CBSL Intelligence Desk
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Multi-Language Translation Toggle */}
            <div className="flex items-center bg-[#2A2A2A] p-0.5 border border-[#444444] text-xs">
              <Globe className="w-3 h-3 text-amber-400 mx-1" />
              {(['en', 'si', 'ta'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setChatLang(lang)}
                  className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-none uppercase transition ${
                    chatLang === lang
                      ? 'bg-amber-400 text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  title={`Translate AI responses into ${lang.toUpperCase()}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-none bg-[#991B1B] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-none text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1A1A1A] text-[#FDFBF7] border border-[#1A1A1A]'
                    : 'bg-white border border-[#1A1A1A] text-[#1A1A1A]'
                }`}
              >
                <div className="whitespace-pre-line font-editorial-body text-sm">{msg.text}</div>

                {/* Hyperlinked Sources list if present */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#1A1A1A] text-[10px] text-gray-600 space-y-1">
                    <p className="font-sans font-bold text-[#991B1B] uppercase tracking-widest text-[9px]">
                      Grounded Citations & Source Links:
                    </p>
                    {msg.sources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#0284C7] hover:underline font-mono font-medium truncate"
                      >
                        <ExternalLink className="w-2.5 h-2.5 text-[#991B1B]" />
                        <span>{src.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-none bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[#1A1A1A] italic bg-[#F5F2E9] p-3 border border-[#1A1A1A] font-mono">
              <Sparkles className="w-4 h-4 animate-spin text-[#991B1B]" />
              <span>Retrieving grounded Sri Lanka economic research & synthesizing...</span>
            </div>
          )}
        </div>

        {/* Financial One-Click Prompt Templates */}
        <div className="px-4 py-2 bg-[#F5F2E9] border-t border-[#1A1A1A]">
          <p className="text-[10px] font-bold font-mono text-[#991B1B] uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>One-Click Financial Research Prompts:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPromptTemplates.map((template, tIdx) => (
              <button
                key={tIdx}
                onClick={() => handleSendPrompt(template)}
                disabled={isLoading}
                className="bg-white hover:bg-amber-100 text-[#1A1A1A] border border-slate-300 text-[10px] px-2.5 py-1 text-left font-sans font-semibold transition cursor-pointer leading-tight"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t-2 border-[#1A1A1A] flex gap-2">
          <input
            type="text"
            placeholder="Ask about inflation, CSE earnings, tea exports..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="flex-1 bg-[#FDFBF7] border border-[#1A1A1A] px-3 py-2 text-xs font-mono uppercase tracking-wider focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isLoading || !promptInput.trim()}
            className="bg-[#991B1B] hover:bg-red-800 text-white font-bold px-5 py-2 rounded-none text-xs uppercase tracking-widest transition flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
