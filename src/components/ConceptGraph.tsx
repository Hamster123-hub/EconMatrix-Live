import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Activity, DollarSign, ShieldAlert, BarChart3, Layers, Layers3 } from 'lucide-react';

interface ConceptGraphProps {
  chapterNumber: number;
}

export const ConceptGraph: React.FC<ConceptGraphProps> = ({ chapterNumber }) => {
  const [sliderValue, setSliderValue] = useState<number>(50);

  // CHAPTER 1: THREE VISIONS OF MONEY
  if (chapterNumber === 1) {
    return (
      <div className="bg-slate-900 text-white p-5 border-2 border-slate-900 space-y-4 rounded-xs shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers3 className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif font-extrabold text-sm uppercase text-amber-300 tracking-wider">
              Visual Concept: The Three Visions of Money Architecture
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
            CHAPTER 1 DIAGRAM
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          In economic history, money is interpreted in three distinct ways. Click each vision to see how it views central bank money creation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Classical */}
          <div className="bg-slate-950 p-4 border border-slate-800 hover:border-sky-500 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase">1. Classical Vision</span>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 font-mono">Hume & Smith</span>
            </div>
            <p className="text-xs font-serif font-bold text-white">"Money is a Veil / Lubricant"</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              Money only facilitates trades. Printing excess money does not create real goods—it simply increases prices proportionally (Inflation).
            </p>
            <div className="bg-slate-900 p-2 text-[10px] font-mono text-sky-300 border-l-2 border-sky-400">
              Money Growth → Direct Price Level Increase
            </div>
          </div>

          {/* Marxist */}
          <div className="bg-slate-950 p-4 border border-slate-800 hover:border-amber-500 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">2. Marxist Vision</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 font-mono">Karl Marx</span>
            </div>
            <p className="text-xs font-serif font-bold text-white">"Universal Equivalent"</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              Money splits sale and purchase. When people hold money instead of buying goods, goods remain unsold, causing overproduction crises.
            </p>
            <div className="bg-slate-900 p-2 text-[10px] font-mono text-amber-300 border-l-2 border-amber-400">
              Commodity → Money → Hoarding → Economic Crisis
            </div>
          </div>

          {/* Keynesian */}
          <div className="bg-slate-950 p-4 border border-slate-800 hover:border-emerald-500 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">3. Keynesian Vision</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 font-mono">J.M. Keynes</span>
            </div>
            <p className="text-xs font-serif font-bold text-white">"Uncertainty Shield"</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              In uncertain times, people hoard money for safety. Central banks lower interest rates to encourage borrowing and investment.
            </p>
            <div className="bg-slate-900 p-2 text-[10px] font-mono text-emerald-300 border-l-2 border-emerald-400">
              Uncertainty → Hoarding Cash → High Liquidity Demand
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CHAPTER 2: STANDING RATE CORRIDOR & MONEY PRINTING
  if (chapterNumber === 2) {
    const isHighInjection = sliderValue > 60;
    const marketRate = isHighInjection ? 7.8 : 9.5;

    return (
      <div className="bg-slate-900 text-white p-5 border-2 border-slate-900 space-y-4 rounded-xs shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif font-extrabold text-sm uppercase text-amber-300 tracking-wider">
              Interactive Graph: Standing Interest Rate Corridor & Money Printing
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
            CHAPTER 2 GRAPH
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The Central Bank sets a corridor between the Floor Rate (SDFR) and Ceiling Rate (SLFR). Drag the slider to see how Central Bank money printing pulls market interest rates down to the floor:
        </p>

        {/* Slider Control */}
        <div className="bg-slate-950 p-3 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300">Central Bank Money Injection (Reverse Repos):</span>
            <span className={`font-bold ${isHighInjection ? 'text-red-400' : 'text-emerald-400'}`}>
              {sliderValue > 60 ? 'HIGH (MASSIVE MONEY PRINTING)' : 'NORMAL / STERILIZED'}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Visual SVG Corridor Graph */}
        <div className="bg-slate-950 p-4 border border-slate-800">
          <svg viewBox="0 0 500 200" className="w-full h-auto">
            {/* Background Grid */}
            <line x1="50" y1="30" x2="480" y2="30" stroke="#334155" strokeDasharray="4" />
            <line x1="50" y1="100" x2="480" y2="100" stroke="#334155" strokeDasharray="4" />
            <line x1="50" y1="170" x2="480" y2="170" stroke="#334155" strokeDasharray="4" />

            {/* Ceiling Rate Line (SLFR) */}
            <line x1="50" y1="30" x2="480" y2="30" stroke="#ef4444" strokeWidth="3" />
            <text x="55" y="24" fill="#ef4444" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              SLFR CEILING RATE (10.0%) - Maximum Borrowing Rate
            </text>

            {/* Policy Target Rate Line (OPR) */}
            <line x1="50" y1="100" x2="480" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6" />
            <text x="55" y="94" fill="#f59e0b" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              POLICY TARGET RATE (OPR) - 9.0%
            </text>

            {/* Floor Rate Line (SDFR) */}
            <line x1="50" y1="170" x2="480" y2="170" stroke="#38bdf8" strokeWidth="3" />
            <text x="55" y="164" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              SDFR FLOOR RATE (8.0%) - Minimum Deposit Rate
            </text>

            {/* Dynamic Market Interest Rate Path */}
            <path
              d={
                isHighInjection
                  ? "M 50,100 C 150,110 250,165 480,165"
                  : "M 50,100 C 150,98 250,102 480,100"
              }
              fill="none"
              stroke={isHighInjection ? '#f43f5e' : '#10b981'}
              strokeWidth="4"
            />

            {/* Market Rate Marker Point */}
            <circle
              cx="480"
              cy={isHighInjection ? 165 : 100}
              r="7"
              fill={isHighInjection ? '#f43f5e' : '#10b981'}
            />
            <text
              x="360"
              y={isHighInjection ? 150 : 88}
              fill={isHighInjection ? '#f43f5e' : '#10b981'}
              fontSize="12"
              fontFamily="sans-serif"
              fontWeight="extrabold"
            >
              Market Rate: {marketRate}%
            </text>
          </svg>
        </div>

        {/* Explanation Box */}
        <div className={`p-3 text-xs border ${
          isHighInjection
            ? 'bg-red-950/80 border-red-500/50 text-red-200'
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          {isHighInjection ? (
            <p>
              <strong>Policy Trap Warning:</strong> When the Central Bank prints massive amounts of money (injects liquidity via reverse repos), commercial banks become flooded with excess rupees. Banks no longer need to borrow from each other, crashing market interest rates right down to the SDFR Floor rate. This artificial suppression of interest rates stimulates cheap import loans and causes currency depreciation!
            </p>
          ) : (
            <p>
              <strong>Balanced Monetary Stance:</strong> Without artificial money injections, the overnight interbank market rate remains stable near the Central Bank's Target Rate. Commercial banks price credit accurately based on genuine market savings.
            </p>
          )}
        </div>
      </div>
    );
  }

  // CHAPTER 3: TWIN DEFICITS PIPELINE
  if (chapterNumber === 3) {
    return (
      <div className="bg-slate-900 text-white p-5 border-2 border-slate-900 space-y-4 rounded-xs shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif font-extrabold text-sm uppercase text-amber-300 tracking-wider">
              Visual Diagram: The Twin Deficits Pipeline
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
            CHAPTER 3 DIAGRAM
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          How a government budget shortfall directly creates a foreign currency crisis:
        </p>

        {/* Flow Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center">
          {/* Step 1 */}
          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">STEP 1</span>
            <p className="text-xs font-bold text-white">Government Budget Deficit</p>
            <p className="text-[10px] text-slate-400">Government spends far more than it collects in taxes.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase">STEP 2</span>
            <p className="text-xs font-bold text-white">Central Bank Money Printing</p>
            <p className="text-[10px] text-slate-400">Central Bank buys Treasury bonds to fund the gap.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">STEP 3</span>
            <p className="text-xs font-bold text-white">Import Spending Surge</p>
            <p className="text-[10px] text-slate-400">Excess rupees in economy flow into buying imported goods.</p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">STEP 4</span>
            <p className="text-xs font-bold text-white">Current Account Deficit</p>
            <p className="text-[10px] text-slate-400">Nation's foreign currency outflow exceeds inflow.</p>
          </div>
        </div>

        <div className="bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong>Core Lesson:</strong> A current account deficit (trade imbalance) is NOT caused by lazy exporters or greedy importers. It is mathematically caused when national investment exceeds national savings—primarily driven by public government borrowing and money printing!
        </div>
      </div>
    );
  }

  // CHAPTER 4: THE IMPOSSIBLE TRINITY
  if (chapterNumber === 4) {
    return (
      <div className="bg-slate-900 text-white p-5 border-2 border-slate-900 space-y-4 rounded-xs shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif font-extrabold text-sm uppercase text-amber-300 tracking-wider">
              Visual Diagram: The Impossible Trinity (Trilemma)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
            CHAPTER 4 DIAGRAM
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          A country can pick ONLY TWO of the three policy options below. Trying to pick all three causes economic collapse:
        </p>

        {/* SVG Triangle Diagram */}
        <div className="bg-slate-950 p-4 border border-slate-800">
          <svg viewBox="0 0 500 220" className="w-full h-auto">
            {/* Triangle Lines */}
            <polygon points="250,30 80,180 420,180" fill="none" stroke="#f59e0b" strokeWidth="3" />

            {/* Corner 1: Top - Fixed Exchange Rate */}
            <circle cx="250" cy="30" r="16" fill="#0284c7" />
            <text x="250" y="34" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">1</text>
            <text x="250" y="10" fill="#38bdf8" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              Fixed Exchange Rate (Pegged Rupee)
            </text>

            {/* Corner 2: Bottom Left - Free Capital Movement */}
            <circle cx="80" cy="180" r="16" fill="#10b981" />
            <text x="80" y="184" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">2</text>
            <text x="80" y="210" fill="#34d399" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              Free Capital Mobility
            </text>

            {/* Corner 3: Bottom Right - Independent Monetary Policy */}
            <circle cx="420" cy="180" r="16" fill="#ef4444" />
            <text x="420" y="184" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">3</text>
            <text x="420" y="210" fill="#f87171" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              Independent Interest Rates
            </text>

            {/* Center Trap Warning */}
            <rect x="170" y="95" width="160" height="40" fill="#7f1d1d" rx="4" stroke="#ef4444" />
            <text x="250" y="112" fill="#fca5a5" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              SRI LANKA'S SOFT-PEG TRAP
            </text>
            <text x="250" y="126" fill="#ffffff" fontSize="9" fontFamily="sans-serif" textAnchor="middle">
              Trying to pick all 3 drains FX reserves!
            </text>
          </svg>
        </div>

        <div className="bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong>The "Soft-Peg" Trap:</strong> When the Central Bank tries to keep interest rates artificially low AND defend the rupee exchange rate at the same time, investors sell rupees for dollars. The Central Bank loses all its foreign reserves trying to defend the currency, leading directly to import shortages.
        </div>
      </div>
    );
  }

  // CHAPTER 5: SEPTEMBER 2024 DEBACLE
  if (chapterNumber === 5) {
    return (
      <div className="bg-slate-900 text-white p-5 border-2 border-slate-900 space-y-4 rounded-xs shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h4 className="font-serif font-extrabold text-sm uppercase text-amber-300 tracking-wider">
              Historical Case Study: September 2024 Money Printing Debacle
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
            CHAPTER 5 CASE STUDY
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In late 2024, the Central Bank injected huge sums of cheap money below its penalty rate:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">MONEY INJECTED</span>
            <p className="text-base font-extrabold font-mono text-amber-300">LKR 133.6 Billion</p>
            <p className="text-[10px] text-slate-400">Injected via reverse repos in Sept 2024</p>
          </div>

          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase">CHEAP INJECTION RATE</span>
            <p className="text-base font-extrabold font-mono text-red-400">8.26% - 8.63%</p>
            <p className="text-[10px] text-slate-400">Injected far below the 9.25% penalty rate</p>
          </div>

          <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">DIRECT RESULT</span>
            <p className="text-base font-extrabold font-mono text-sky-300">Currency Collapse</p>
            <p className="text-[10px] text-slate-400">Rupee weakened sharply by Dec 2024</p>
          </div>
        </div>

        <div className="bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong>Key Policy Failure:</strong> By injecting cheap money below the penalty rate, the Central Bank artificially suppressed commercial interest rates. Cheap credit fueled a massive surge in imports, draining dollar reserves and weakening the Sri Lankan Rupee.
        </div>
      </div>
    );
  }

  // CHAPTER 6: JOHN EXTER LAW & UNSTERILIZED RESERVES
  return (
    <div className="bg-slate-900 text-white p-5 border-2 border-slate-900 space-y-4 rounded-xs shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          <h4 className="font-serif font-extrabold text-sm uppercase text-amber-300 tracking-wider">
            Visual Concept: The Rupee Boomerang (John Exter Law)
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 border border-slate-800">
          CHAPTER 6 DIAGRAM
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Why buying dollars to build reserves can accidentally cause currency depreciation if not sterilized:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">1. BUYING DOLLARS</span>
          <p className="text-xs font-bold text-white">Central Bank Buys USD</p>
          <p className="text-[10px] text-slate-400">Central Bank issues newly printed Rupees to buy dollars from market.</p>
        </div>

        <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">2. RUPEE FLOOD</span>
          <p className="text-xs font-bold text-white">Unsterilized Surplus</p>
          <p className="text-[10px] text-slate-400">If Central Bank doesn't absorb excess rupees back, banks flood with cash.</p>
        </div>

        <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-red-400 font-bold uppercase">3. IMPORT BOOMERANG</span>
          <p className="text-xs font-bold text-white">Rupee Weakens</p>
          <p className="text-[10px] text-slate-400">Excess rupees buy imported goods, pushing dollar demand back up!</p>
        </div>
      </div>

      <div className="bg-slate-950 p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <strong>John Exter Law:</strong> "When a central bank issues domestic currency to acquire foreign exchange assets, the newly issued domestic currency must be sterilized (mopped up by selling bonds). Otherwise, the excess domestic currency will turn around and demand foreign exchange right back, depreciating the currency."
      </div>
    </div>
  );
};
