import React from 'react';
import { BookEquation } from '../data/bookData';
import { BookOpen, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EquationCardProps {
  equation: BookEquation;
  onAskAi?: (prompt: string) => void;
}

export const EquationCard: React.FC<EquationCardProps> = ({ equation, onAskAi }) => {
  return (
    <div className="bg-white border-2 border-slate-900 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Header Banner */}
      <div className="bg-slate-100 border-b-2 border-slate-900 p-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#0284C7] text-white font-mono font-bold text-[10px] uppercase tracking-widest px-2.5 py-1">
            MACRO ECONOMIC IDENTITY
          </span>
          <span className="text-xs font-mono font-semibold text-slate-700">
            {equation.chapterRef.replace(/Chapter \d+ • /, '').replace(/ch \d+/i, 'Core Identity')}
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5">
          Verified Policy Concept
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Title */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {equation.name}
          </h3>
          <p className="font-sans text-xs text-slate-600 mt-1">
            Fundamental macroeconomic relationship and policy framework.
          </p>
        </div>

        {/* Primary Concept Visual Display Box */}
        <div className="bg-[#0F172A] border-2 border-slate-900 p-5 sm:p-6 text-center space-y-3 relative">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-1">
            CORE ECONOMIC IDENTITY & PLAIN LANGUAGE FORMULA
          </span>

          <div className="font-serif text-lg sm:text-xl font-extrabold text-amber-300 tracking-wide py-2 break-words">
            "{equation.displayFormula}"
          </div>
        </div>

        {/* Variable Definitions Table */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
            <span>Variable Breakdown & Symbol Meanings</span>
          </h4>

          <div className="grid grid-cols-1 gap-2">
            {equation.variableDefinitions.map((v, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 text-xs hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center gap-2 min-w-[160px]">
                  <span className="font-serif font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 text-xs">
                    {v.symbol}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {v.label}
                  </span>
                </div>
                <div className="text-slate-700 font-sans text-xs sm:text-right flex-1">
                  {v.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Insight Callout */}
        <div className="bg-amber-50/90 border-l-4 border-amber-700 p-4 text-xs space-y-1.5">
          <span className="font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            Central Banking & Policy Insight:
          </span>
          <p className="font-sans text-slate-800 leading-relaxed italic">
            "{equation.economicInsight}"
          </p>
        </div>
      </div>

      {/* Action Footer */}
      {onAskAi && (
        <div className="bg-slate-50 border-t-2 border-slate-900 p-3 sm:p-4">
          <button
            onClick={() => onAskAi(`Teach me the core economic concept "${equation.name}" (${equation.displayFormula}) in simple plain words with zero equations, explaining its real-world policy impact.`)}
            className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-mono text-xs font-bold py-2.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ask AI Tutor to Teach Concept in Plain Words</span>
            <ArrowRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      )}
    </div>
  );
};
