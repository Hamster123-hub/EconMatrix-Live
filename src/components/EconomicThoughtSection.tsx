import React, { useState } from 'react';
import { History, BookOpen, Compass, Scale, Brain, Lightbulb, TrendingUp, Sparkles, ChevronRight, Search, Award, Landmark, DollarSign, Layers } from 'lucide-react';

interface EconomicThoughtSectionProps {
  language?: 'en' | 'si' | 'ta';
}

interface SchoolOfThought {
  id: string;
  era: string;
  name: string;
  subTitle: string;
  color: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  badgeText: string;
  keyThinkers: string[];
  foundationalWorks: string[];
  coreTenets: string[];
  historicalContext: string;
  modernRelevance: string;
  quote: {
    text: string;
    author: string;
  };
}

const SCHOOLS_DATA: SchoolOfThought[] = [
  {
    id: 'mercantilism',
    era: '16th - 18th Century',
    name: 'Mercantilism & Physiocracy',
    subTitle: 'Bullionism, Trade Surpluses & Agricultural Wealth',
    color: 'text-amber-500',
    borderColor: 'border-amber-500/60',
    bgColor: 'bg-amber-950/20',
    badgeBg: 'bg-amber-500 text-slate-950',
    badgeText: 'EARLY MODERN',
    keyThinkers: ['Thomas Mun', 'Jean-Baptiste Colbert', 'François Quesnay', 'Sir William Petty'],
    foundationalWorks: [
      'England’s Treasure by Forraign Trade (Thomas Mun, 1664)',
      'Tableau Économique (François Quesnay, 1758)',
    ],
    coreTenets: [
      'National wealth measured by accumulated gold and silver bullion reserves.',
      'High tariffs, protective export subsidies, and colonial trade monopolies.',
      'Physiocrat belief that land and agriculture are the sole true sources of economic net surplus (produit net).',
    ],
    historicalContext:
      'Emerging during the rise of European nation-states and colonial expansion, nation builders sought zero-sum trade advantages to fund state treasuries and royal armies.',
    modernRelevance:
      'Re-emerges in contemporary neo-mercantilist industrial policy, strategic trade tariffs, and national currency manipulation debates.',
    quote: {
      text: 'The ordinary means to increase our wealth and treasure is by Foreign Trade, wherein we must ever observe this rule: to sell more to strangers yearly than we consume of theirs in value.',
      author: 'Thomas Mun (1664)',
    },
  },
  {
    id: 'classical',
    era: '1776 - 1870s',
    name: 'Classical Political Economy',
    subTitle: 'The Invisible Hand, Labour Value & Free Trade',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/60',
    bgColor: 'bg-sky-950/20',
    badgeBg: 'bg-sky-500 text-slate-950',
    badgeText: 'ENLIGHTENMENT FOUNDATIONS',
    keyThinkers: ['Adam Smith', 'David Ricardo', 'Thomas Malthus', 'John Stuart Mill'],
    foundationalWorks: [
      'The Wealth of Nations (Adam Smith, 1776)',
      'Principles of Political Economy and Taxation (David Ricardo, 1817)',
      'Principles of Political Economy (John Stuart Mill, 1848)',
    ],
    coreTenets: [
      'The "Invisible Hand": Self-interested market transactions spontaneously produce social harmony and optimal resource allocation.',
      'Labour Theory of Value: Real value derives from the quantity of embodied labour required for production.',
      'Law of Comparative Advantage: Trade yields mutual gains even if one nation holds an absolute advantage in all goods.',
    ],
    historicalContext:
      'Born out of the Scottish Enlightenment and the Industrial Revolution, dismantling feudal monopolies in favor of competitive market capitalism.',
    modernRelevance:
      'Forms the foundational bedrock for modern international trade agreements, competitive deregulation, and baseline microeconomic equilibrium.',
    quote: {
      text: 'It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.',
      author: 'Adam Smith (1776)',
    },
  },
  {
    id: 'marxian',
    era: '1867 - Present',
    name: 'Marxian & Critical Political Economy',
    subTitle: 'Surplus Value, Class Dynamics & Capital Crisis',
    color: 'text-rose-500',
    borderColor: 'border-rose-500/60',
    bgColor: 'bg-rose-950/20',
    badgeBg: 'bg-rose-500 text-[#FAF7F2]',
    badgeText: 'CRITICAL THEORY',
    keyThinkers: ['Karl Marx', 'Friedrich Engels', 'Rosa Luxemburg', 'Paul Sweezy'],
    foundationalWorks: [
      'Das Kapital: Critique of Political Economy (Karl Marx, 1867)',
      'The Communist Manifesto (Marx & Engels, 1848)',
      'The Accumulation of Capital (Rosa Luxemburg, 1913)',
    ],
    coreTenets: [
      'Surplus Value: Profit originates from uncompensated surplus labor extracted from workers (bourgeoisie vs. proletariat).',
      'Tendency of the Rate of Profit to Fall: Capital intensification leads to structural overproduction and systemic economic crises.',
      'Alienation: Workers become detached from the products of their labor, fellow workers, and human potential.',
    ],
    historicalContext:
      'Critique formulated during the height of 19th-century industrial factory exploitation, urbanization, and intense social stratification in Western Europe.',
    modernRelevance:
      'Pivotal for analyzing global supply chain labor exploitation, wealth inequality indices (Piketty), and structural financial crisis recurring cycles.',
    quote: {
      text: 'Capital is dead labor, which, vampire-like, lives only by sucking living labor, and lives the more, the more labor it sucks.',
      author: 'Karl Marx (1867)',
    },
  },
  {
    id: 'neoclassical',
    era: '1870s - 1930s',
    name: 'Neoclassical & Marginalist Revolution',
    subTitle: 'Marginal Utility, Supply/Demand Curves & Optimization',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/60',
    bgColor: 'bg-emerald-950/20',
    badgeBg: 'bg-emerald-400 text-slate-950',
    badgeText: 'MICROEQUILIBRIUM',
    keyThinkers: ['Carl Menger', 'Léon Walras', 'William Stanley Jevons', 'Alfred Marshall'],
    foundationalWorks: [
      'Principles of Economics (Carl Menger, 1871)',
      'Elements of Pure Economics (Léon Walras, 1874)',
      'Principles of Economics (Alfred Marshall, 1890)',
    ],
    coreTenets: [
      'Marginal Revolution: Value is subjective and depends on the incremental satisfaction (marginal utility) of the last unit consumed.',
      'General & Partial Equilibrium: Market price is determined by the intersection of marginal cost supply and marginal utility demand curves.',
      'Rational Actor Model: Consumers and firms mathematically maximize utility and profit subject to budget constraints.',
    ],
    historicalContext:
      'Rigorous mathematical modeling introduced to economics during the late 19th century, transforming political economy into a formal quantitative science.',
    modernRelevance:
      'Underpins virtually all undergraduate microeconomic textbooks, pricing models, supply-demand geometry, and econometrics.',
    quote: {
      text: 'Value does not exist outside the consciousness of men... it is a judgment which economizing men make on the importance of goods.',
      author: 'Carl Menger (1871)',
    },
  },
  {
    id: 'keynesian',
    era: '1936 - Present',
    name: 'Keynesian Economics',
    subTitle: 'Aggregate Demand, Fiscal Policy & Liquidity Traps',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/60',
    bgColor: 'bg-indigo-950/20',
    badgeBg: 'bg-indigo-500 text-white',
    badgeText: 'MACRO REVOLUTION',
    keyThinkers: ['John Maynard Keynes', 'Paul Samuelson', 'Joan Robinson', 'Hyman Minsky'],
    foundationalWorks: [
      'The General Theory of Employment, Interest and Money (J.M. Keynes, 1936)',
      'Economics: An Introductory Analysis (Paul Samuelson, 1948)',
      'Stabilizing an Unstable Economy (Hyman Minsky, 1986)',
    ],
    coreTenets: [
      'Aggregate Demand Shortfall: Free markets can remain in prolonged underemployment equilibrium due to deficient total demand.',
      'Sticky Wages & Prices: Market prices do not immediately adjust downward to clear labor markets during downturns.',
      'Active Fiscal Counter-Cyclical Policy: Governments must run deficits in recessions to boost investment and consumer spending.',
    ],
    historicalContext:
      'Developed during the devastating Great Depression of the 1930s, proving that automatic classical market adjustments were dangerously inadequate.',
    modernRelevance:
      'The core blueprint for central bank quantitative easing, government stimulus checks, and emergency relief packages during global recessions.',
    quote: {
      text: 'The long run is a misleading guide to current affairs. In the long run we are all dead. Economists set themselves too easy, too useless a task if in tempestuous seasons they can only tell us that when the storm is past the ocean is flat again.',
      author: 'John Maynard Keynes (1923)',
    },
  },
  {
    id: 'austrian',
    era: '1870s - Present',
    name: 'Austrian School of Economics',
    subTitle: 'Subjective Value, Economic Calculation & Sound Money',
    color: 'text-amber-400',
    borderColor: 'border-amber-400/70',
    bgColor: 'bg-amber-900/20',
    badgeBg: 'bg-amber-400 text-slate-950',
    badgeText: 'FREE MARKET & MONEY',
    keyThinkers: ['Ludwig von Mises', 'Friedrich A. Hayek', 'Eugen von Böhm-Bawerk', 'Murray Rothbard'],
    foundationalWorks: [
      'Human Action: A Treatise on Economics (Ludwig von Mises, 1949)',
      'The Road to Serfdom & The Use of Knowledge in Society (F.A. Hayek, 1944)',
      'Capital and Interest (Eugen von Böhm-Bawerk, 1884)',
    ],
    coreTenets: [
      'Socialist Calculation Problem: Without free market prices, central planners cannot efficiently allocate capital or compute opportunity costs.',
      'Austrian Business Cycle Theory (ABCT): Artificial interest rate suppression by central banks causes unsustainable malinvestment booms.',
      'Methodological Individualism & Praxeology: Economic science must derive from logical analysis of purposeful human action.',
    ],
    historicalContext:
      'Formulated in Vienna and refined through mid-20th-century debates against central socialist planning and state monetary intervention.',
    modernRelevance:
      'Highly influential in sound money discourse, cryptocurrency macro theory, anti-inflation policy, and critique of unbacked fiat credit expansion.',
    quote: {
      text: 'The curious task of economics is to demonstrate to men how little they really know about what they imagine they can design.',
      author: 'Friedrich A. Hayek (1988)',
    },
  },
  {
    id: 'monetarism',
    era: '1950s - Present',
    name: 'Monetarism & The Chicago School',
    subTitle: 'Quantity Theory of Money, Inflation Control & Deregulation',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/60',
    bgColor: 'bg-purple-950/20',
    badgeBg: 'bg-purple-500 text-white',
    badgeText: 'MONEY SUPPLY & DEREGULATION',
    keyThinkers: ['Milton Friedman', 'George Stigler', 'Robert Lucas Jr.', 'Eugene Fama'],
    foundationalWorks: [
      'A Monetary History of the United States, 1867-1960 (Friedman & Schwartz, 1963)',
      'Capitalism and Freedom (Milton Friedman, 1962)',
      'Efficient Capital Markets (Eugene Fama, 1970)',
    ],
    coreTenets: [
      'Quantity Theory of Money: "Inflation is always and everywhere a monetary phenomenon"—caused by money supply growing faster than output.',
      'Constant Money Growth Rule: Central banks should target steady money supply growth rather than discretionary interest rate manipulation.',
      'Regulatory Capture & Efficient Markets: Free financial markets reflect all public information, making government price controls counterproductive.',
    ],
    historicalContext:
      'Gained prominence during the 1970s stagflation crisis, disproving simple Keynesian Phillips curve trade-offs between inflation and unemployment.',
    modernRelevance:
      'Established independent central banking inflation targeting frameworks (such as the CBSL 4-6% inflation target) worldwide.',
    quote: {
      text: 'Inflation is always and everywhere a monetary phenomenon in the sense that it is and can be produced only by a more rapid increase in the quantity of money than in output.',
      author: 'Milton Friedman (1963)',
    },
  },
  {
    id: 'behavioural',
    era: '1990s - Present',
    name: 'Behavioural & Modern Complexity Economics',
    subTitle: 'Bounded Rationality, Heuristics, Nudges & Animal Spirits',
    color: 'text-teal-300',
    borderColor: 'border-teal-500/60',
    bgColor: 'bg-teal-950/20',
    badgeBg: 'bg-teal-400 text-slate-950',
    badgeText: 'MODERN SYNTHESIS',
    keyThinkers: ['Daniel Kahneman', 'Amos Tversky', 'Richard Thaler', 'Robert J. Shiller'],
    foundationalWorks: [
      'Thinking, Fast and Slow (Daniel Kahneman, 2011)',
      'Nudge: Improving Decisions About Health, Wealth, and Happiness (Thaler & Sunstein, 2008)',
      'Irrational Exuberance (Robert Shiller, 2000)',
    ],
    coreTenets: [
      'Bounded Rationality: Humans suffer from cognitive biases, loss aversion, status-quo bias, and framing effects in decision making.',
      'Nudge Theory: Subtle architectural choices can guide human behavior toward superior long-term savings and policy outcomes without coercion.',
      'Market Irrationally & Financial Bubbles: Market prices deviate systematically from fundamentals due to psychological herd behavior.',
    ],
    historicalContext:
      'Incorporated empirical psychology and behavioral experiments into economic theory to explain real-world stock market crashes and non-rational consumer habits.',
    modernRelevance:
      'Extensively applied in designing retirement auto-enrollment plans, public health nudge campaigns, and financial market volatility risk models.',
    quote: {
      text: 'We are prone to overestimate how much we understand about the world and to underestimate the role of chance in events.',
      author: 'Daniel Kahneman (2011)',
    },
  },
];

export const EconomicThoughtSection: React.FC<EconomicThoughtSectionProps> = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('classical');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSchool = SCHOOLS_DATA.find((s) => s.id === selectedSchoolId) || SCHOOLS_DATA[1];

  const filteredSchools = SCHOOLS_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keyThinkers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.era.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B1E36] via-[#091527] to-[#1a1c2e] text-white p-6 sm:p-8 rounded-xs border-2 border-amber-500/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-xs flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-slate-950" />
              <span>ACADEMIC CURRICULUM</span>
            </span>
            <span className="text-amber-300 text-xs font-mono font-bold">
              16th Century to Modern Era
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-black text-amber-300 tracking-tight">
            Evolution of Economic Thought
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            Trace the chronological trajectory of economic theory from early Mercantilist trade surpluses and Classical Enlightenment free markets to Keynesian macroeconomics, Austrian monetary theory, and modern Behavioral Insights.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by thinker (e.g. Adam Smith, Keynes, Mises)..."
                className="w-full bg-slate-950/90 text-white placeholder-slate-400 text-xs pl-9 pr-3 py-2.5 border border-slate-700 focus:border-amber-400 focus:outline-hidden rounded-xs font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Layout: Timeline Navigation Grid + Deep Dive Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Timeline List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-sans font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Schools of Thought ({filteredSchools.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Select to explore</span>
          </div>

          <div className="space-y-2.5">
            {filteredSchools.map((school) => {
              const isSelected = selectedSchoolId === school.id;
              return (
                <button
                  key={school.id}
                  onClick={() => setSelectedSchoolId(school.id)}
                  className={`w-full text-left p-4 rounded-xs border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                    isSelected
                      ? `${school.bgColor} ${school.borderColor} shadow-md ring-1 ring-amber-400/40`
                      : 'bg-white border-slate-800 hover:border-slate-900 hover:bg-[#FAF9F6]'
                  }`}
                >
                  {/* Left Active Color Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      isSelected ? 'bg-amber-400' : 'bg-slate-300 group-hover:bg-amber-500'
                    }`}
                  />

                  <div className="pl-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-xs ${school.badgeBg}`}>
                        {school.badgeText}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 font-bold">
                        {school.era}
                      </span>
                    </div>

                    <h4
                      className={`font-serif font-bold text-base leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {school.name}
                    </h4>

                    <p
                      className={`text-xs line-clamp-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {school.subTitle}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {school.keyThinkers.slice(0, 3).map((thinker, i) => (
                        <span
                          key={i}
                          className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded-xs ${
                            isSelected
                              ? 'bg-slate-800/80 text-amber-200 border border-slate-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {thinker}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Dive Academic Details (7 cols) */}
        <div className="lg:col-span-7 bg-[#091527] text-white p-6 sm:p-8 rounded-xs border-2 border-slate-800 shadow-2xl space-y-6 relative">
          
          {/* Header Bar */}
          <div className="border-b border-slate-800 pb-5 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-xs ${selectedSchool.badgeBg}`}>
                {selectedSchool.badgeText}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                {selectedSchool.era}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-black text-amber-300 tracking-tight leading-tight">
              {selectedSchool.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans italic">
              {selectedSchool.subTitle}
            </p>
          </div>

          {/* Quote Banner */}
          <div className="bg-[#07111E] border-l-4 border-amber-400 p-4 rounded-r-xs space-y-1.5 shadow-inner">
            <p className="font-serif text-xs sm:text-sm italic text-amber-100 leading-relaxed">
              "{selectedSchool.quote.text}"
            </p>
            <p className="text-[11px] font-mono text-amber-400 font-bold text-right">
              — {selectedSchool.quote.author}
            </p>
          </div>

          {/* Core Economic Doctrines */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Core Economic Doctrines & Principles</span>
            </h4>
            <div className="space-y-2">
              {selectedSchool.coreTenets.map((tenet, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {tenet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Thinkers & Foundational Literature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xs space-y-2">
              <h5 className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-sky-400" />
                <span>Pioneering Thinkers</span>
              </h5>
              <ul className="space-y-1 text-xs text-slate-200">
                {selectedSchool.keyThinkers.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xs space-y-2">
              <h5 className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Foundational Works</span>
              </h5>
              <ul className="space-y-1 text-xs text-slate-200">
                {selectedSchool.foundationalWorks.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="italic text-[11px] leading-tight">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical Context vs Modern Policy Relevance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xs space-y-1.5">
              <h5 className="font-sans text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Historical Catalyst & Context
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedSchool.historicalContext}
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xs space-y-1.5">
              <h5 className="font-sans text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                Modern Macro Policy Relevance
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedSchool.modernRelevance}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
