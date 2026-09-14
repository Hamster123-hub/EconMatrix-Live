export interface BookEquation {
  id: string;
  name: string;
  bookPageRef: string;
  chapterRef: string;
  displayFormula: string;
  latexFormula: string;
  variableDefinitions: { symbol: string; label: string; meaning: string }[];
  economicInsight: string;
}

export const BOOK_EQUATIONS: BookEquation[] = [
  {
    id: 'eq1',
    name: 'Quantity Theory of Money & Circulation Identity',
    bookPageRef: 'Chapter 3 (Page 22)',
    chapterRef: 'Ch 3: How Much Money Is Needed?',
    displayFormula: 'Money Stock × Velocity = Price Level × Volume of Transactions',
    latexFormula: 'M × V = P × T',
    variableDefinitions: [
      { symbol: 'M', label: 'Money Stock', meaning: 'Total quantity of active currency in circulation' },
      { symbol: 'V', label: 'Velocity of Circulation', meaning: 'Average number of times each rupee unit changes hands per year' },
      { symbol: 'P', label: 'Price Level', meaning: 'Average price level of all commodities and services' },
      { symbol: 'T', label: 'Transactions Volume', meaning: 'Total volume of real physical transactions in the economy' }
    ],
    economicInsight: 'In the long run, money is neutral. If the central bank doubles money supply M while real transactions T stay fixed, velocity V stabilizes and prices P simply double.'
  },
  {
    id: 'eq2',
    name: 'Master Balance of Payments Identity',
    bookPageRef: 'Chapter 11 (Page 71)',
    chapterRef: 'Ch 11: Balance of Payments & Twin Deficits',
    displayFormula: 'BP = CA + KA + FA + Errors & Omissions = 0',
    latexFormula: 'BP = CA + KA + FA + E&O = 0',
    variableDefinitions: [
      { symbol: 'BP', label: 'Balance of Payments', meaning: 'Overall international accounting ledger (must sum to zero)' },
      { symbol: 'CA', label: 'Current Account', meaning: 'Net exports of goods & services plus net foreign income and worker remittances' },
      { symbol: 'KA', label: 'Capital Account', meaning: 'Capital transfers and non-produced non-financial asset transactions' },
      { symbol: 'FA', label: 'Financial Account', meaning: 'Direct investment (FDI), portfolio flows, debt borrowing, and foreign reserves' },
      { symbol: 'E&O', label: 'Errors & Omissions', meaning: 'Statistical discrepancy balancing item' }
    ],
    economicInsight: 'A deficit on the Current Account (CA < 0) MUST be mathematically balanced by either net foreign borrowing/investment (FA > 0) or by burning Central Bank foreign reserves.'
  },
  {
    id: 'eq3',
    name: 'Current Account Structural Decomposition',
    bookPageRef: 'Chapter 11 (Page 72)',
    chapterRef: 'Ch 11: Balance of Payments & Twin Deficits',
    displayFormula: 'Current Account = Net Exports + Net Primary Income + Net Secondary Income',
    latexFormula: 'CA = NX + NY + NCT',
    variableDefinitions: [
      { symbol: 'CA', label: 'Current Account', meaning: 'Total net flow of current resources across borders' },
      { symbol: 'NX', label: 'Net Exports (Trade Balance)', meaning: 'Exports of goods and services minus Imports (X - M)' },
      { symbol: 'NY', label: 'Net Primary Income', meaning: 'Interest payments, dividends, and profits earned vs paid overseas' },
      { symbol: 'NCT', label: 'Net Current Transfers', meaning: 'Workers remittances sent home by Sri Lankan expatriates' }
    ],
    economicInsight: 'For Sri Lanka, heavy trade deficits (NX < 0) have historically been partially offset by worker remittances (NCT), but remain vulnerable whenever imports surge.'
  },
  {
    id: 'eq4',
    name: 'Net Exports & Import Propensity Function',
    bookPageRef: 'Chapter 11 (Page 74-75)',
    chapterRef: 'Ch 11: Balance of Payments & Twin Deficits',
    displayFormula: 'Net Exports = Exports - (Autonomous Imports + Marginal Propensity × National Income)',
    latexFormula: 'NX = X - (m₀ + m₁ × Y)',
    variableDefinitions: [
      { symbol: 'NX', label: 'Net Exports', meaning: 'Net trade surplus or deficit' },
      { symbol: 'X', label: 'Total Exports', meaning: 'Value of exported tea, garments, spices, and IT services' },
      { symbol: 'm₀', label: 'Autonomous Imports', meaning: 'Baseline essential imports (fuel, essential food, medicine) required regardless of income' },
      { symbol: 'm₁', label: 'Marginal Propensity to Import (MPI)', meaning: 'Fraction of additional national income spent on foreign imports (ΔM / ΔY)' },
      { symbol: 'Y', label: 'National Income (GDP)', meaning: 'Aggregate national income and economic activity' }
    ],
    economicInsight: 'When the central bank prints rupees to artificially boost national expenditure Y, imports surge rapidly via m₁ × Y, worsening the trade deficit.'
  },
  {
    id: 'eq5',
    name: 'Balance of Payments & Foreign Interest Differential',
    bookPageRef: 'Chapter 11 (Page 77-78)',
    chapterRef: 'Ch 11: Balance of Payments & Twin Deficits',
    displayFormula: 'BP = Trade Balance(Income) + Capital Flows(Domestic Rate - Foreign Rate) = 0',
    latexFormula: 'BP = [(X - m₀ - m₁ × Y) + NY + NCT] + CF(i - i_foreign) = 0',
    variableDefinitions: [
      { symbol: 'i', label: 'Domestic Policy Interest Rate', meaning: 'Sri Lanka Central Bank interest rate' },
      { symbol: 'i_foreign', label: 'Foreign Benchmark Rate', meaning: 'Foreign interest rate (e.g. US Federal Reserve Funds Rate)' },
      { symbol: '(i - i_foreign)', label: 'Interest Rate Differential', meaning: 'Yield gap determining short-term international capital flows' },
      { symbol: 'CF', label: 'Capital Flows Function', meaning: 'Net flow of foreign capital seeking interest rate yields' }
    ],
    economicInsight: 'Note clean notation without star symbols: (i - i_foreign). Suppressing domestic interest rate i below foreign rate i_foreign causes rapid capital flight and currency collapse.'
  },
  {
    id: 'eq6',
    name: 'The Fundamental Savings-Investment Macroeconomic Identity',
    bookPageRef: 'Chapter 11 & 18 (Page 81)',
    chapterRef: 'Ch 11 & Ch 18: Twin Deficits & Sound Money',
    displayFormula: 'Current Account Balance = National Savings - Domestic Investment',
    latexFormula: 'CA = S - I = (S_private - I) + (T - G)',
    variableDefinitions: [
      { symbol: 'CA', label: 'Current Account Balance', meaning: 'External balance of goods, services, and net income' },
      { symbol: 'S', label: 'Total National Savings', meaning: 'Private sector savings plus public government savings' },
      { symbol: 'I', label: 'Domestic Investment', meaning: 'Capital expenditure on machinery, infrastructure, and housing' },
      { symbol: 'T - G', label: 'Fiscal Balance', meaning: 'Government revenue (Taxes T) minus Government Spending G' }
    ],
    economicInsight: 'This identity proves that a current account deficit is NOT caused by car imports or foreign trade cheats—it is the direct macroeconomic result of government fiscal deficits (G > T) destroying national savings.'
  },
  {
    id: 'eq7',
    name: 'Standing Rate Corridor & Interbank Target Bounds',
    bookPageRef: 'Chapter 13 & 14 (Page 92, 120)',
    chapterRef: 'Ch 13 & 14: Monetary Architecture & Thermostat',
    displayFormula: 'Standing Deposit Rate (SDFR) ≤ Overnight Call Rate (AWCMR) ≤ Standing Lending Rate (SLFR)',
    latexFormula: 'SDFR ≤ AWCMR ≤ SLFR',
    variableDefinitions: [
      { symbol: 'SDFR', label: 'Standing Deposit Facility Rate', meaning: 'Corridor floor rate paid to commercial banks for excess cash' },
      { symbol: 'SLFR', label: 'Standing Lending Facility Rate', meaning: 'Corridor ceiling penalty rate charged to banks borrowing overnight emergency cash' },
      { symbol: 'AWCMR', label: 'Average Weighted Call Money Rate', meaning: 'Interbank operating target rate representing liquidity scarcity' },
      { symbol: 'OPR', label: 'Overnight Policy Rate', meaning: 'Single policy signal rate introduced in November 2024' }
    ],
    economicInsight: 'In September 2024, CBSL broke this corridor rule by injecting LKR 133.6 Billion at 8.26%—far below the 9.25% SLFR penalty ceiling—artificially lowering borrowing costs.'
  },
  {
    id: 'eq8',
    name: 'Imported Inflation & Nominal Exchange Rate Pass-Through',
    bookPageRef: 'Chapter 14 (Page 106)',
    chapterRef: 'Ch 14: The New Architecture',
    displayFormula: 'Domestic Inflation = Foreign Inflation + Pass Through Coefficient × Exchange Rate Depreciation',
    latexFormula: 'π_t = π_foreign + α × ΔNEER',
    variableDefinitions: [
      { symbol: 'π_t', label: 'Domestic Inflation Rate', meaning: 'Year-on-year consumer price inflation in Sri Lanka' },
      { symbol: 'π_foreign', label: 'Foreign Inflation Rate', meaning: 'Global commodity and trade partner inflation' },
      { symbol: 'α', label: 'Pass-Through Coefficient', meaning: 'Sensitivity of domestic prices to exchange rate changes' },
      { symbol: 'ΔNEER', label: 'Change in Nominal Effective Exchange Rate', meaning: 'Percentage depreciation or appreciation of the Rupee' }
    ],
    economicInsight: 'Because Sri Lanka relies heavily on imported food, fuel, and raw materials, rupee depreciation passes through directly into domestic consumer prices.'
  },
  {
    id: 'eq9',
    name: 'John Exter Money Creation & Sterilization Identity',
    bookPageRef: 'Chapter 17 (Page 142)',
    chapterRef: 'Ch 17: Reserve Accumulation Paradox',
    displayFormula: 'Printed Rupee Influx = USD Purchases × Exchange Rate × (1 - Sterilization Rate)',
    latexFormula: 'ΔM_rupees = USD_Purchased × FX_Rate × (1 - Sterilization_Pct)',
    variableDefinitions: [
      { symbol: 'ΔM_rupees', label: 'New Rupee Supply', meaning: 'Fresh Rupee liquidity created in commercial bank accounts' },
      { symbol: 'USD_Purchased', label: 'Foreign Exchange Purchases', meaning: 'Dollars bought by the Central Bank to build reserves' },
      { symbol: 'Sterilization_Pct', label: 'Sterilization Percentage', meaning: 'Percentage of bond holdings sold by Central Bank to mop up new rupees' }
    ],
    economicInsight: 'Explains the 2025 Rupee Paradox: When Central Bank bought $1.6 Billion without 100% sterilization, the created rupees flooded commercial banks, fueling import loans and weakening the Rupee from 285 to 309 LKR per USD!'
  }
];

export interface Chapter {
  id: string;
  chapterNumber: number;
  part: 'Part I: Theoretical Framework' | 'Part II: Operational Reality';
  title: string;
  subtitle: string;
  keyConcepts: string[];
  summaryMarkdown: string;
  keyFormulas?: { name: string; formula: string; description: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  samplePrompts: string[];
}

export const BOOK_METADATA = {
  title: "THE STORY BEHIND SRI LANKA'S TRAGIC MIS-FORTUNE",
  subtitle: "A Nation Held at Ransom by Its Own Central Bank",
  author: "",
  location: "Colombo, Sri Lanka",
  description: "A comprehensive treatise bridging classical political economy (Hume, Smith, Ricardo, Marx, Keynes) with 21st-century central banking mechanics in Sri Lanka.",
  stats: {
    partsCount: 2,
    chaptersCount: 18,
    formulasCount: 6,
    historicalCasesCount: 7,
  }
};

export const BOOK_CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    chapterNumber: 1,
    part: 'Part I: Theoretical Framework',
    title: 'The Surface of Circulation (Marx vs Classical Predecessors)',
    subtitle: 'Watching Money Move: The Metamorphosis of Commodities',
    keyConcepts: ['C-M-C Circuit', 'Means of Purchase', 'Metamorphosis of Commodities', 'The Money Veil'],
    summaryMarkdown: `### The Life Story of Goods vs Money: The Surface of Circulation

In everyday economic life, market transactions appear as a continuous, endless stream of buying and selling. Karl Marx opens *Capital (1867)* by meticulously dissecting this visible surface of circulation to contrast his findings with classical predecessors like David Hume (1752), Adam Smith (1776), and David Ricardo (1810).

- **The Commodity Circuit & Use-Value Exit**: In the primary circulation path of commodities, a producer sells a physical commodity for money, and subsequently spends that money to acquire another commodity needed for survival or production. The crucial insight is that physical commodities enter the market sphere only temporarily. Once purchased, wheat, textiles, or iron leave circulation permanently to be consumed as use-values. Their life story within the market ends at the point of consumption.

- **The Endless Movement of Money**: Unlike physical commodities which vanish into consumption, money never leaves the sphere of circulation. Currency notes and coin tokens continuously pass from hand to hand, moving endlessly from buyer to seller. Because money remains perpetually active while physical goods enter and disappear, an optical illusion is created in market societies: money appears to be the primary, self-generating engine that drives production and commerce.

- **The Classical Money Veil Fallacy**: Classical economists viewed money merely as a neutral "veil" or technical convenience designed to bypass the physical friction of direct barter. They argued that money has no independent effect on real output, which depends entirely on physical capital, labor productivity, and thrift. Marx demonstrated that while money mediates exchange, its perpetual presence creates structural contradictions between selling and buying, laying the theoretical groundwork for monetary crises.`,
    quiz: [
      {
        question: "In Marx's C-M-C circuit, what happens to the commodity after the final exchange?",
        options: [
          "It remains in circulation forever",
          "It leaves circulation to be consumed",
          "It turns into central bank reserves",
          "It gets converted into paper tokens"
        ],
        correctIndex: 1,
        explanation: "Commodities enter circulation once, are sold, and then leave circulation into consumption (use-value), whereas money continues circulating endlessly."
      },
      {
        question: "How did Classical economists (Hume, Smith, Ricardo) view money relative to real economic output?",
        options: [
          "As the primary source of real wealth creation",
          "As a social relation of class exploitation",
          "As a 'veil' or instrument facilitating underlying real exchanges",
          "As a tool to permanently lower unemployment"
        ],
        correctIndex: 2,
        explanation: "Classical economists viewed money as a veil over real transactions, believing real output depends on productivity, capital, and thrift."
      }
    ],
    samplePrompts: [
      "Explain Marx's C-M-C formula versus classical money veil theory.",
      "Why does money appear to drive the economy when goods vanish?"
    ]
  },
  {
    id: 'ch2',
    chapterNumber: 2,
    part: 'Part I: Theoretical Framework',
    title: 'Money as Social Movement in the Form of a Thing',
    subtitle: 'Validation of Social Labor and Commodity Fetishism',
    keyConcepts: ['Universal Equivalent', 'Socially Necessary Labor Time', 'Commodity Fetishism', 'Use-Value of Money'],
    summaryMarkdown: `### Validation of Private Labor & The Fetishism of Money

In a decentralized market economy characterized by private ownership, individual producers—farmers, weavers, miners, and craftsmen—work independently without central coordination or prior agreement. Chapter 2 analyzes how private labor performed in isolation transforms into socially recognized labor.

- **Social Validation Through Market Exchange**: Private labor is not automatically recognized as useful to society simply because a producer spent hours executing it. Private effort is only validated as socially useful labor when the finished product is successfully exchanged in the market for money. The act of sale is the ultimate social test: if no buyer offers currency for the item, the labor expended remains private, unvalidated, and wasted.

- **Gold as the Universal Equivalent**: Historically, precious metals like gold evolved into the universal equivalent because gold embodied abstract social labor time. A specific weight of gold represented a specific duration of socially necessary labor time required for its mining and refinement. Gold thus functioned as the objective measure against which all other commodities expressed their relative value.

- **Commodity Fetishism & Relations Between Things**: In a market system, social relations between human beings—the intricate social division of labor connecting millions of workers—appear outwardly as objective relations between physical objects and price tags. People do not see the cooperative human labor underlying production; instead, they observe physical commodities interacting with coins. This inverted perception, termed commodity fetishism, masks human social relations behind financial things.

- **The Unique Use-Value of Money**: For standard commodities, usefulness stems from physical consumption (eating bread, wearing a coat). In contrast, the unique use-value of money lies strictly in its capacity to endlessly mediate social exchanges, acting as the universal claim on all human labor.`,
    quiz: [
      {
        question: "According to Marx, when is an individual producer's private labor socially validated?",
        options: [
          "When the government issues a manufacturing license",
          "When the product is successfully sold in the market for money",
          "When raw materials are purchased",
          "When gold is mined"
        ],
        correctIndex: 1,
        explanation: "The sale is the social test: if the product sells for money, its labor is validated as part of total social labor."
      }
    ],
    samplePrompts: [
      "What is the Marxian concept of 'Money as Social Movement'?",
      "Why does Marx say relations between people appear as relations between things?"
    ]
  },
  {
    id: 'ch3',
    chapterNumber: 3,
    part: 'Part I: Theoretical Framework',
    title: 'How Much Money Is Needed? Quantity and Velocity',
    subtitle: 'The Mechanics of Circulation and Price Dynamics',
    keyConcepts: ['Quantity of Money', 'Velocity of Circulation', 'Price Sum Equation', 'Labor Value of Specie'],
    summaryMarkdown: `### The Arithmetic of Circulation & Velocity Mechanics

Chapter 3 investigates a fundamental question in monetary economics: exactly how much currency does a nation's economy require to smoothly circulate its annual production of goods and services?

- **The Sum of Prices & Velocity**: The total volume of currency required during any period is determined by the total sum of prices of all commodities offered for sale, divided by the velocity of circulation. Velocity represents the average number of times a single unit of currency changes hands to complete transactions within a given year. If economic confidence is high and currency turns over rapidly, a relatively small stock of money is sufficient to clear a massive volume of commerce.

- **Price Adjustments to Excess Currency**: If the total sum of prices across all goods remains constant while money turns over faster, the physical quantity of currency required actually contracts. Conversely, if a central bank issues excessive paper note tokens beyond transaction needs while velocity remains steady, the overall price level inevitably rises to absorb the surplus paper units. Paper tokens cannot store intrinsic value like gold; when over-issued, each paper note simply loses purchasing power.

- **The Labor Value of Specie vs Paper Tokens**: Under a gold standard, the value of money was anchored by the labor time required to mine and refine precious metals. If technological improvements made gold mining easier, gold lost intrinsic value, causing general commodity prices to rise. Under modern unbacked paper money systems, currency value is no longer anchored by physical mining labor, making currency stability entirely dependent on central bank operational discipline.`,
    quiz: [
      {
        question: "If velocity increases while the sum of prices remains constant, what happens to required money supply?",
        options: [
          "It must increase proportionally",
          "It decreases",
          "It stays exactly the same",
          "It causes hyperinflation"
        ],
        correctIndex: 1,
        explanation: "Since money stock equals total prices divided by velocity, a higher velocity means less money stock is required to clear the same volume of transactions."
      }
    ],
    samplePrompts: [
      "Walk me through the relationship between money stock, velocity, and price sum.",
      "How does velocity impact the central bank's money printing requirement?"
    ]
  },
  {
    id: 'ch4',
    chapterNumber: 4,
    part: 'Part I: Theoretical Framework',
    title: 'David Hume (c. 1752): Quantity Theory & Price-Specie-Flow',
    subtitle: 'Long-Run Neutrality and the Danger of Short-Run Stimulus',
    keyConcepts: ['Price-Specie-Flow Mechanism', 'Neutrality of Money', 'Hume\'s Intermediate Interval', 'Short-Run High vs Long-Run Inflation'],
    summaryMarkdown: `### David Hume\'s Monetary Foundations & The Price-Specie-Flow Mechanism

David Hume laid the cornerstone of classical monetary theory in his 1752 political essays, introducing concepts that remain essential for understanding central bank interventions in developing island economies today.

- **The Overnight Doubling Thought Experiment**: Hume presented a famous mental exercise: suppose that by a miracle, every citizen in Great Britain awoke to find five gold sovereigns secretly placed in their pocket, doubling overnight the national stock of specie. Hume demonstrated that national wealth—factories, farms, ships, and food—would not increase by a single iota. Instead, as citizens attempted to spend their doubled cash reserves, merchants would double commodity prices, leaving real economic output unchanged. In the long run, money is purely neutral.

- **The Self-Correcting Price-Specie-Flow Mechanism**: Hume introduced the Price-Specie-Flow mechanism to explain international trade balance. If a nation inflates its domestic money supply, domestic prices rise above international levels. High domestic prices make exports uncompetitive abroad while making foreign imports irresistibly cheap. As domestic citizens buy imported goods, gold specie flows out of the country to settle trade deficits. This gold drain automatically shrinks the domestic money supply, forcing domestic prices down until international trade equilibrium is restored.

- **The Siren Song of Hume\'s Intermediate Interval**: Hume made a vital nuance observation: when fresh money first enters an economy, it does not raise all prices instantaneously. Before prices rise, merchants receiving the new money experience heightened optimism, hiring additional workers and expanding production. This temporary surge in activity is "Hume\'s Intermediate Interval." Hume explicitly warned that this temporary high is an illusion. Modern central banks routinely fall into the trap of continuously printing money to prolong this short-run high, inevitably driving their nations into long-run inflation, currency devaluation, and foreign reserve collapse.`,
    quiz: [
      {
        question: "What is Hume's 'Price-Specie-Flow Mechanism'?",
        options: [
          "An automatic self-correcting international trade mechanism where gold flows out during inflation, reducing domestic money and prices",
          "A method for central banks to fix interest rates forever",
          "A tax levied on foreign gold imports",
          "A Keynesian multiplier for government spending"
        ],
        correctIndex: 0,
        explanation: "Hume showed that excess domestic money causes higher prices, creating a trade deficit. Gold leaves the country to pay for imports, reducing domestic money and restoring price balance."
      }
    ],
    samplePrompts: [
      "What was David Hume's thought experiment on money doubling overnight?",
      "Why do central banks fall into 'Hume's Interval' trap?"
    ]
  },
  {
    id: 'ch5',
    chapterNumber: 5,
    part: 'Part I: Theoretical Framework',
    title: 'Ricardo, Say\'s Law, and the Question of Crisis (1810–1821)',
    subtitle: 'Depreciation of Banknotes, Say\'s Law, and the Ingot Plan',
    keyConcepts: ['Say\'s Law', 'Depreciation of Notes', 'The Ingot Plan', 'Bullion Band Arbitrage'],
    summaryMarkdown: `### David Ricardo, Say\'s Law & Rules-Based Monetary Anchors

David Ricardo analyzed the severe monetary turbulence in Britain during the Napoleonic Wars, when the Bank Restriction Act of 1797 suspended the Bank of England's obligation to convert paper banknotes into gold coins on demand.

- **The High Price of Bullion & Banknote Depreciation**: With convertibility suspended, the Bank of England issued paper banknotes aggressively to fund wartime government borrowing. Consequently, the paper price of gold bullion soared well above the official mint price. Ricardo proved that the premium on gold bullion was indisputable empirical proof that paper banknotes had depreciated due to excessive issuance, refuting bank directors who claimed paper money had not lost value.

- **Say\'s Law of Markets & Crisis Dynamics**: Ricardo embraced Say\'s Law—the classical principle formulated by Jean-Baptiste Say asserting that supply creates its own demand. According to this doctrine, the total value of commodities produced generates an equivalent sum of factor incomes (wages, profits, rents) used to purchase those goods. Therefore, general overproduction gluts across the entire economy are impossible under free market price adjustments; economic crises stem from structural sectoral imbalances or monetary distortions rather than deficient aggregate demand.

- **The Ingot Plan of 1816**: To enforce strict monetary discipline while eliminating the expensive wear and tear of circulating gold coins, Ricardo proposed his revolutionary Ingot Plan. Under this scheme, the central bank was mandated to issue paper currency backed by an absolute obligation to redeem paper notes on demand for heavy, sixty-ounce gold ingots. Because ordinary citizens could not afford 60-ounce ingots, gold remained in bank vaults for international trade settlement, while commercial bullion dealers provided an automatic arbitrage check against over-issuing banknotes. This plan pioneered modern rules-based currency board frameworks.`,
    quiz: [
      {
        question: "What was the purpose of David Ricardo's 'Ingot Plan'?",
        options: [
          "To force citizens to carry heavy gold coins everywhere",
          "To enforce strict monetary discipline by requiring the central bank to redeem paper notes for 60oz gold ingots on demand",
          "To allow unlimited money printing without inflation",
          "To ban imports of luxury goods"
        ],
        correctIndex: 1,
        explanation: "Ricardo's Ingot Plan anchored paper money to gold ingots, creating an automatic arbitrage check against over-issuing banknotes."
      }
    ],
    samplePrompts: [
      "Explain Ricardo's Ingot Plan and how it prevented money printing.",
      "What is Say's Law and why did Ricardo believe general gluts were impossible?"
    ]
  },
  {
    id: 'ch6',
    chapterNumber: 6,
    part: 'Part I: Theoretical Framework',
    title: 'Marx (1859): Attacking Hume & Ricardo\'s Monetary Theory',
    subtitle: 'Credit Money vs Token Money & The Paleontologist Analogy',
    keyConcepts: ['Token Money', 'Credit Money', 'Threadneedle Street vs American Mines', 'Paleontologists & The Flood'],
    summaryMarkdown: `### Karl Marx\'s Critique of Classical Monetary Abstraction

In his 1859 work *A Contribution to the Critique of Political Economy*, Karl Marx launched a sharp methodological critique against David Ricardo\'s monetary formulations, exposing the conceptual errors resulting from treating paper credit money as a simple token of gold.

- **Credit Money vs Token Money**: Marx accused Ricardo of conflating two fundamentally different financial instruments: state-issued Token Money (fiat paper symbols representing value in circulation) and commercial Credit Money (private bills of exchange, bank promises, and debt claims generated within trade). Commercial credit money originates from deferred payments between merchants; it expands and contracts naturally with business activity rather than by central bank fiat.

- **Threadneedle Street vs American Gold Mines**: Marx observed that Ricardo made a flawed theoretical jump by treating the paper banknote press at the Bank of England on Threadneedle Street as if it were identical to David Hume\'s influx of gold from South American mines. Gold possesses intrinsic labor value mined from the earth, whereas paper banknotes are credit liabilities. Treating banknotes as mere physical tokens obscured the true commercial credit dynamics driving economic booms and busts.

- **The Paleontologist Analogy**: In a famous passage, Marx compared classical monetary economists to early eighteenth-century paleontologists. Just as early fossil hunters attempted to force newly discovered dinosaur bones into biblical flood stories, classical economists tried to force complex modern credit systems into outdated mercantilist assumptions about gold circulation. Marx demonstrated that monetary instability cannot be understood without analyzing how private commercial debt transforms into central bank credit.`,
    quiz: [
      {
        question: "What distinction did Marx accuse Ricardo of confusing?",
        options: [
          "The distinction between Credit Money (bank claims) and Token Money (state value symbols)",
          "The distinction between GDP and GNP",
          "The difference between interest rates and exchange rates",
          "The difference between taxes and tariffs"
        ],
        correctIndex: 0,
        explanation: "Marx argued Ricardo mixed up commercial credit money (claims on private banks) with simple tokens of value issued by the state."
      }
    ],
    samplePrompts: [
      "Explain Marx's analogy comparing classical economists to early paleontologists.",
      "How did Marx critique Ricardo's view of paper money as a token?"
    ]
  },
  {
    id: 'ch7',
    chapterNumber: 7,
    part: 'Part I: Theoretical Framework',
    title: 'Classical View: Interest, Money and Capital (Smith & Ricardo)',
    subtitle: 'The Great Wheel, Loanable Funds, and the Classical Dichotomy',
    keyConcepts: ['Great Wheel of Circulation', 'Real Capital vs Paper Money', 'Loanable Funds Theory', 'Classical Dichotomy'],
    summaryMarkdown: `### Money vs Real Capital & The Loanable Funds Theory

Chapter 7 explores the classical foundation governing interest rate determination, highlighting the fundamental distinction between paper money and productive capital established by Adam Smith and David Ricardo.

- **Adam Smith\'s "Great Wheel of Circulation"**: In *The Wealth of Nations (1776)*, Adam Smith formulated a brilliant metaphor: money is the "Great Wheel of Circulation." Just as a wooden wagon moves grain from farms to cities without being grain itself, money is economic infrastructure that moves wealth, but is not wealth itself. Real national wealth consists of annual agricultural and industrial output, machinery, infrastructure, and skilled labor.

- **The Classical Dichotomy**: Classical political economy established the Classical Dichotomy—the principle that real economic variables (real wages, employment, capital equipment, and physical output) are determined by real productive forces (technology, natural resources, work ethic, and thrift), whereas nominal variables (money supply and general price levels) are determined by monetary policy. In the long run, changes in the money supply alter nominal prices proportionally without increasing physical productive capacity.

- **The Loanable Funds Theory of Interest**: Smith and Ricardo dismantled the mercantilist delusion that central banks can permanently lower interest rates by printing money. Under the Loanable Funds Theory, the real equilibrium rate of interest is determined by real structural forces: the supply of real national savings (accumulated through public and private frugality) and the demand for real loanable capital (driven by business productivity and investment opportunities). If a central bank prints paper money to artificially suppress interbank interest rates below natural market levels, it does not create real savings or machinery; it merely fuels artificial credit expansion, triggering price inflation until real interest rates re-align with market fundamentals.`,
    quiz: [
      {
        question: "In Classical economics, what determines the real long-run interest rate?",
        options: [
          "The central bank's money printing press",
          "The supply of real savings (thrift) and demand for real investment (productivity)",
          "Government statutory reserve requirements",
          "Foreign exchange reserves held in vaults"
        ],
        correctIndex: 1,
        explanation: "Under the Loanable Funds Theory, interest rates are determined by real savings and investment, not by central bank liquidity injections."
      }
    ],
    samplePrompts: [
      "Explain Adam Smith's metaphor of money as the 'Great Wheel'.",
      "Why cannot central banks permanently lower interest rates by printing money?"
    ]
  },
  {
    id: 'ch8',
    chapterNumber: 8,
    part: 'Part I: Theoretical Framework',
    title: 'The Keynesian Revolution: Money and Uncertainty (1936)',
    subtitle: 'Radical Uncertainty, Liquidity Preference, and the Liquidity Trap',
    keyConcepts: ['Radical Uncertainty', 'Liquidity Preference', 'Three Motives (Transactions, Precautionary, Speculative)', 'Liquidity Trap'],
    summaryMarkdown: `### John Maynard Keynes, Radical Uncertainty & The Liquidity Trap

John Maynard Keynes revolutionized economic thought in *The General Theory of Employment, Interest and Money (1936)* by challenging classical long-run equilibrium assumptions during periods of severe economic breakdown.

- **Radical Uncertainty vs Mathematical Risk**: Keynes highlighted a crucial distinction between quantifiable risk (calculable probabilities like rolling dice) and radical uncertainty—future economic events where information is fundamentally absent and probabilities cannot be calculated. In an uncertain world where business owners and households cannot foresee future demand, holding liquid currency becomes a rational defense mechanism against fear and paralysis.

- **The Three Motives for Liquidity Preference**: Keynes identified three distinct reasons why individuals choose to hold liquid money rather than investing in income-earning financial assets:
  1. *Transactions Motive*: Holding cash to bridge the time gap between receiving income and paying routine living expenses.
  2. *Precautionary Motive*: Retaining cash buffers to meet unforeseen emergencies, illnesses, or business disruptions.
  3. *Speculative Motive*: Keynes's key breakthrough—holding uninvested cash when bond yields are extremely low and asset prices are expected to drop, allowing investors to avoid capital losses.

- **The Liquidity Trap Mechanics**: During deep economic crises characterized by severe loss of confidence, the economy can fall into a Liquidity Trap. Interest rates drop to near-zero levels, yet households and investors hoard every fresh unit of money injected by the central bank into cash balances rather than lending or spending it. In a liquidity trap, velocity collapses, and central bank money creation fails to stimulate real private investment or generate employment.`,
    quiz: [
      {
        question: "Which motive for holding money was Keynes's breakthrough concept?",
        options: [
          "Transactions Motive",
          "Precautionary Motive",
          "Speculative Motive",
          "Mercantilist Motive"
        ],
        correctIndex: 2,
        explanation: "Keynes introduced the Speculative Motive, showing investors hold liquid cash when they anticipate rising interest rates and falling bond prices."
      }
    ],
    samplePrompts: [
      "What is Keynes's concept of Radical Uncertainty vs Risk?",
      "How does a Liquidity Trap break the monetary transmission mechanism?"
    ]
  },
  {
    id: 'ch9',
    chapterNumber: 9,
    part: 'Part I: Theoretical Framework',
    title: 'Three Visions of Money and Capitalism (Synthesis)',
    subtitle: 'Comparing Classical, Marxist, and Keynesian Doctrines',
    keyConcepts: ['Classical Long-Run Neutrality', 'Marxist Social Contradictions', 'Keynesian Short-Run Volatility', 'New Neoclassical Synthesis'],
    summaryMarkdown: `### Comprehensive Synthesis: The Three Master Monetary Visions

Chapter 9 synthesizes the three master doctrines of monetary economics—Classical, Marxist, and Keynesian—providing a unified framework to evaluate modern central bank policies and empirical evidence.

- **Classical Vision (Long-Run Truth)**: Hume, Smith, and Ricardo established that money is neutral in the long run. Printing money cannot build real factories, increase crop yields, or lower long-run unemployment. Money supply growth determines the long-run rate of inflation, while real economic growth depends entirely on productivity, capital accumulation, and fiscal solvency.

- **Marxist Vision (Structural Contradictions)**: Marx demonstrated that money is an objective social relation validating private labor. Money splits commodity exchange into two separate acts—selling and buying—creating the inherent possibility of commercial crises whenever money is hoarded as a store of value rather than re-circulated as a medium of purchase.

- **Keynesian Vision (Short-Run Price Stickiness)**: Keynes showed that in the short run, prices and wages are sticky. Fluctuations in consumer confidence, investment sentiment, and liquidity preference cause aggregate demand shocks, justifying tactical stabilization measures during acute crises.

- **Empirical Validation (McCandless & Weber 1995)**: Modern macroeconomics merges these insights into the New Neoclassical Synthesis: Keynesian models explain short-run fluctuations, while Classical principles govern long-run realities. Landmark empirical studies analyzing data from over one hundred countries across thirty-year periods confirm that long-run money growth correlates almost perfectly with consumer price inflation, but displays zero correlation with real output growth. Attempting to print wealth is a proven macroeconomic failure.`,
    quiz: [
      {
        question: "What did McCandless and Weber's (1995) study of 110 countries confirm?",
        options: [
          "Money supply growth has a nearly 1.0 correlation with long-run inflation, but ZERO correlation with real output growth",
          "Money printing permanently increases real GDP growth",
          "Keynesian stimulus works continuously over 30-year periods",
          "Currency pegs never collapse"
        ],
        correctIndex: 0,
        explanation: "Empirical data across 110 nations over 30 years validated the Classical view: money growth equals long-run inflation, not real wealth growth."
      }
    ],
    samplePrompts: [
      "Summarize the Three Visions of Money in economics.",
      "Why does the Classical view win in the long run according to empirical data?"
    ]
  },
  {
    id: 'ch10',
    chapterNumber: 10,
    part: 'Part II: Operational Reality',
    title: 'Delineating Economic Policy: Monetary vs. Fiscal Operations',
    subtitle: 'The Central Banker\'s Toolkit & The Great Divergence',
    keyConcepts: ['Monetary vs Fiscal Policy', 'Open Market Operations (OMOs)', 'Statutory Reserve Requirement (SRR)', 'Interest Rate Corridor (SDFR / SLFR)'],
    summaryMarkdown: `### The Operational Boundary: Fiscal Policy vs Central Banking

Chapter 10 transitions from theoretical foundations to operational reality, establishing the strict boundary between Treasury fiscal policy and Central Bank monetary operations.

- **Fiscal Operations (Ministry of Finance)**: Fiscal policy governs government taxation, public expenditure, and national budget management. When government spending exceeds tax revenue, the Treasury incurs a fiscal deficit. To fund this deficit legally, the Treasury issues Treasury bills and bonds to borrow existing funds from private investors, commercial banks, and pension funds.

- **Monetary Operations (Central Bank)**: Monetary policy manages systemic liquidity, commercial bank credit growth, and price stability. The central bank utilizes three primary operational instruments:
  1. *Statutory Reserve Requirement*: Mandating the percentage of customer deposits commercial banks must keep locked at the central bank.
  2. *Open Market Operations*: Buying or selling government securities in secondary financial markets to alter commercial bank liquidity.
  3. *Standing Rate Corridors*: Setting floor deposit rates and ceiling lending rates to guide interbank settlement costs.

- **The CBSL Terminology Inversion**: A critical trap for analysts in Sri Lanka is the operational terminology inversion used by the Central Bank of Sri Lanka (CBSL) compared to the United States Federal Reserve. In US Fed terminology, a "Repo" injects liquidity while a "Reverse Repo" absorbs cash. In CBSL terminology, the definitions are inverted: a CBSL "Repo" absorbs excess commercial bank liquidity (selling bills to suck out cash), whereas a CBSL "Reverse Repo" injects fresh central bank liquidity (buying securities to print fresh rupees into bank settlement accounts). Confounding Treasury debt borrowing with Central Bank money creation leads directly to fiscal dominance, destroying monetary stability.`,
    quiz: [
      {
        question: "In Central Bank of Sri Lanka (CBSL) terminology, what is a 'Reverse Repo' auction?",
        options: [
          "A liquidity-absorbing operation that removes rupees from banks",
          "A liquidity-injecting operation where CBSL buys securities and adds new cash into the banking system",
          "A tax paid by commercial banks to the Treasury",
          "A foreign exchange swap with the US Federal Reserve"
        ],
        correctIndex: 1,
        explanation: "CBSL terminology is inverted relative to the US Fed: a CBSL Reverse Repo injects fresh liquidity (printed money) into commercial banks."
      }
    ],
    samplePrompts: [
      "Explain the terminology inversion between CBSL Repos and US Fed Repos.",
      "What is Fiscal Dominance and why does it undermine central bank independence?"
    ]
  },
  {
    id: 'ch11',
    chapterNumber: 11,
    part: 'Part II: Operational Reality',
    title: 'The Ledger of Nations: Balance of Payments & Twin Deficits',
    subtitle: 'The Savings-Investment Identity ($CA = S - I$) and Why Nations Go Broke',
    keyConcepts: ['Balance of Payments ($BP=0$)', 'Savings-Investment Identity', 'Twin Deficits', 'Good vs Bad Capital Inflows'],
    keyFormulas: [
      {
        name: 'Master Balance of Payments Identity',
        formula: 'BP = CA + KA + FA + E\\&O = 0',
        description: 'Current Account + Capital Account + Financial Account = 0'
      },
      {
        name: 'Savings-Investment Identity',
        formula: 'CA = S - I',
        description: 'Current Account Balance = National Savings minus Domestic Investment'
      }
    ],
    summaryMarkdown: `### The Master Ledger of Nations & The Twin Deficits

Chapter 11 analyzes the Balance of Payments—the national accounting ledger recording every financial and commercial transaction between residents of a country and the rest of the world.

- **The Current Account & National Savings**: The Balance of Payments separates current account transactions (trade in physical goods, service exports, overseas worker remittances, and net foreign interest payments) from capital and financial account flows. The fundamental macroeconomic identity establishes that a nation's Current Account balance is strictly equal to total National Savings minus total Domestic Investment. A current account deficit signals that domestic investment exceeds domestic savings, requiring the nation to borrow capital or burn foreign reserves.

- **The Twin Deficits Phenomenon**: Total national savings consists of private sector savings plus government fiscal savings. When the government runs persistent budget deficits, public dis-saving directly reduces national savings below investment needs. This creates the infamous "Twin Deficits"—a government budget deficit driving a parallel current account trade deficit. Popular political narratives blaming trade deficits on car imports or foreign trade cheating are macroeconomic fallacies; external trade deficits are caused by public sector fiscal overspending outstripping domestic savings.

- **Good vs Bad Capital Inflows**: External deficits must be financed through the financial account. Long-term Foreign Direct Investment (FDI) that builds export factories and infrastructure represents productive financing. In contrast, relying on short-term volatile foreign portfolio flows ("hot money") or foreign currency debt swaps to fund budget deficits creates debt traps, leaving the nation vulnerable to sudden capital flight and currency collapse.`,
    quiz: [
      {
        question: "What does the fundamental identity CA = S - I reveal about a persistent current account deficit?",
        options: [
          "It is purely caused by unfair foreign trade tariffs",
          "It is a macroeconomic signal that national investment exceeds national savings, often driven by government budget deficits",
          "It means the country has too much gold in its vault",
          "It proves that import bans will permanently restore currency strength"
        ],
        correctIndex: 1,
        explanation: "CA = S - I shows that external deficits stem from domestic savings shortages, frequently caused by government fiscal deficits (public dis-saving)."
      }
    ],
    samplePrompts: [
      "Explain the savings-investment identity and its implications for Sri Lanka.",
      "What is the difference between 'Good' FDI capital inflows and 'Bad' Hot Money?"
    ]
  },
  {
    id: 'ch12',
    chapterNumber: 12,
    part: 'Part II: Operational Reality',
    title: 'Exchange Rate Regimes and the Impossible Trinity',
    subtitle: 'The Policy Trilemma and the Sterilization Trap',
    keyConcepts: ['Impossible Trinity (Trilemma)', 'Sterilized Intervention Trap', 'Inflation Target vs FX Anchor', 'Soft Peg Regimes'],
    summaryMarkdown: `### The Impossible Trinity & The Sterilization Intervention Trap

Chapter 12 explores the iron law of international macroeconomics: the Impossible Trinity, or Monetary Policy Trilemma, formulated by Robert Mundell and Marcus Fleming.

- **The Three Incompatible Pillars**: The Impossible Trinity dictates that no country can simultaneously maintain all three of the following conditions:
  1. A fixed or soft-pegged foreign exchange rate.
  2. Free international capital mobility.
  3. An independent domestic monetary policy (setting interest rates).
  A central bank can choose any two pillars, but must abandon the third. If a country permits open capital movements and pegs its currency, it loses control over domestic interest rates.

- **The Soft-Peg Trap**: Soft-pegged exchange rate regimes—where the central bank attempts to defend a target currency band while simultaneously manipulating domestic interest rates—are inherently unstable. When the central bank suppresses interest rates to stimulate domestic growth, capital flees overseas, and import demand accelerates.

- **The Sterilization Trap**: To stop the currency from collapsing under soft-peg pressure, the central bank intervenes in foreign exchange markets, selling US dollar reserves to buy domestic currency. However, selling dollars removes domestic currency from commercial banks, causing interbank interest rates to rise. If the central bank succumbs to political pressure and engages in "sterilization"—injecting newly printed domestic currency back into commercial banks to suppress interest rates—it completely neutralizes its own currency defense. Dollar reserves bleed to zero, culminating in a violent currency crash and economic default.`,
    quiz: [
      {
        question: "According to the Impossible Trinity, which 3 conditions CANNOT exist at the same time?",
        options: [
          "High taxes, low inflation, and high growth",
          "Fixed exchange rate, free capital flows, and independent monetary policy",
          "Commercial banks, central banks, and foreign trade",
          "Exports, imports, and remittances"
        ],
        correctIndex: 1,
        explanation: "The Trilemma dictates a central bank can only choose 2 of the 3: Fixed FX, Free Capital Mobility, and Independent Monetary Policy."
      }
    ],
    samplePrompts: [
      "Walk me through the step-by-step logic of the Sterilization Trap.",
      "Why do soft pegs inevitably lead to balance of payments crises?"
    ]
  },
  {
    id: 'ch13',
    chapterNumber: 13,
    part: 'Part II: Operational Reality',
    title: 'Sri Lanka\'s New Monetary Regime (The 2024 Monetary Law Act)',
    subtitle: 'Dual-Rate Corridor vs Single OPR & The September 2024 Debacle',
    keyConcepts: ['Dual-Rate Corridor (Pre-Nov 2024)', 'Overnight Policy Rate (OPR)', 'Inflationary OMOs', 'September 2024 Case Study'],
    summaryMarkdown: `### The 2024 Central Bank Reform & The September 2024 Liquidity Injection Case Study

Chapter 13 examines Sri Lanka's structural monetary policy reforms under the Central Bank of Sri Lanka Act No. 16 of 2023, analyzing the shift from a dual-rate corridor to a single policy rate and reviewing a real-world case study.

- **Flaws of the Dual-Rate Corridor**: Prior to late 2024, the Central Bank operated a dual-rate corridor comprising a floor Standing Deposit Facility Rate and a ceiling Standing Lending Facility Rate. This wide corridor allowed monetary authorities to conduct opaque open market operations, injecting cheap liquidity mid-corridor while leaving official policy rate bounds unchanged, misleading financial markets regarding true monetary stance.

- **Transition to the Single Overnight Policy Rate (OPR)**: On November 27, 2024, the monetary authority introduced a single Overnight Policy Rate to improve policy signaling transparency. Under this framework, the single policy rate serves as the primary benchmark target for the interbank money market, bounded symmetrically by standing deposit and lending facilities.

- **Case Study: The September 2024 Liquidity Injection Debacle**: In September 2024, while the official emergency borrowing ceiling rate stood at nine and a quarter percent, the central bank injected over one hundred thirty-three billion rupees into commercial banks through reverse repo auctions at discounted rates between eight point two six percent and eight point six three percent. This massive injection of cash below penalty borrowing costs subsidized cheap commercial bank credit expansion. Commercial banks funneled these cheap funds into import financing, triggering a surge in foreign exchange demand that caused significant rupee depreciation by December 2024.`,
    quiz: [
      {
        question: "What occurred during the September 2024 CBSL liquidity injections case study?",
        options: [
          "CBSL absorbed LKR 500 Billion to stop inflation",
          "CBSL injected over LKR 133 Billion at rates (8.26%-8.63%) far below the 9.25% penalty rate, fueling cheap import credit",
          "CBSL raised interest rates to 25%",
          "CBSL transitioned to a gold standard"
        ],
        correctIndex: 1,
        explanation: "CBSL suppressed interest rates by supplying LKR 133.6B below the SLFR penalty ceiling, flooding commercial banks with cheap cash that fueled import demand."
      }
    ],
    samplePrompts: [
      "Detail the September 2024 Sri Lanka liquidity injection debacle.",
      "How did below-penalty injections convert into import demand?"
    ]
  },
  {
    id: 'ch14',
    chapterNumber: 14,
    part: 'Part II: Operational Reality',
    title: 'The Continuation of Problem 1 – The New Architecture',
    subtitle: 'OPR, AWCMR, and the Thermostat Analogy',
    keyConcepts: ['OPR Signal', 'AWCMR Operating Target', 'Standing Corridor (SDFR/SLFR)', 'Interbank Thermostat'],
    summaryMarkdown: `### The Interbank Thermostat & Operational Reality under the New Architecture

Chapter 14 evaluates whether institutional reforms establishing a single policy rate structure are sufficient to guarantee monetary stability without strict operational self-discipline.

- **The Interbank Call Money Rate as System Thermostat**: The operational target of Sri Lankan monetary policy is the Average Weighted Call Money Rate—the interest rate commercial banks charge each other for overnight uncollateralized rupee loans. The interbank rate functions as the financial system\'s thermostat. When liquidity or foreign exchange reserves become scarce, the interbank rate must be allowed to rise naturally. Higher interbank borrowing costs signal commercial banks to raise loan interest rates, curbing credit expansion and cooling import demand.

- **The Illusion of Architectural Fixes**: Introducing a single Overnight Policy Rate improves graphic presentation and communications, but cannot alter underlying economic laws. If central bank officials continue intervening in interbank markets to suppress rates whenever liquidity tightens, the new policy architecture will replicate the exact inflationary failures of the old system.

- **Operational Discipline over Policy Ambiguity**: True monetary stability depends on central bank operational discipline. The central bank must allow interbank interest rates to reflect real market liquidity scarcity rather than pumping fresh paper rupees into commercial bank settlement accounts whenever borrowing demand rises.`,
    quiz: [
      {
        question: "Why is the interbank overnight rate (AWCMR) called the 'thermostat' of the monetary system?",
        options: [
          "Because it regulates temperature in central bank vaults",
          "Because it registers reserve scarcity/abundance and transmits pricing signals to cool credit when dollars are short",
          "Because it is fixed permanently by law",
          "Because it only applies to foreign tourists"
        ],
        correctIndex: 1,
        explanation: "Like a thermostat, a free interbank rate rises when cash/dollars are scarce, naturally raising borrowing costs and slowing import demand."
      }
    ],
    samplePrompts: [
      "Explain the Thermostat Analogy for interbank call money rates.",
      "Why is a single policy rate insufficient without operational discipline?"
    ]
  },
  {
    id: 'ch15',
    chapterNumber: 15,
    part: 'Part II: Operational Reality',
    title: 'The Dangers of "Flexible" Terminology & The Soft-Peg Trap',
    subtitle: 'Overtrading Without Deposits, IR-FX Ping-Pong & B.R. Shenoy\'s Warning',
    keyConcepts: ['Overtrading Without Deposits', 'Interest Rate - FX Ping-Pong', 'B.R. Shenoy Mercantilist Fallacy', 'Real-World Soft Peg Crises'],
    summaryMarkdown: `### Overtrading Without Deposits, Interest Rate-FX Ping-Pong & Comparative Crises

Chapter 15 dissects the operational mechanics through which central bank liquidity injections destabilize commercial banking behaviors and trigger repeated currency crises.

- **Commercial Bank "Overtrading Without Deposits"**: When the central bank routinely offers cheap liquidity injection auctions at low interbank interest rates, commercial banks alter their fundamental business model. Instead of competing aggressively to attract sticky, long-term customer savings deposits, commercial banks expand risky loan portfolios first and rely on central bank overnight liquidity injections to settle daily interbank clearing deficits. This practice, termed "overtrading without deposits," decouples credit growth from national savings.

- **The Destructive Interest Rate-Exchange Rate Ping-Pong**: This operational habit triggers a continuous vicious cycle:
  1. Central bank injects cheap liquidity to keep interbank borrowing costs artificially low.
  2. Commercial banks expand cheap import credit, causing import demand to surge.
  3. Increased import demand weakens the domestic currency exchange rate.
  4. Central bank sells foreign exchange reserves to halt currency depreciation.
  5. Foreign exchange sales suck domestic currency out of bank accounts, causing interbank rates to tighten.
  6. Central bank panics and injects cheap liquidity again, restarting the cycle until foreign reserves hit zero.

- **B.R. Shenoy\'s Mercantilist Fallacy Warning**: Renowned Indian economist B.R. Shenoy exposed the fundamental flaw of import control policies: banning imported motor vehicles or consumer goods merely attacks the symptom while ignoring the underlying disease—excess currency creation by the central bank. Banning specific imports does not eliminate excess purchasing power; the excess printed rupees simply spill over into domestic inflation or illegal capital flight.

- **Comparative Global Case Studies**: International evidence from Thailand during the 1997 Asian Financial Crisis, Turkey between 2019 and 2021, and recent defaults in Egypt, Pakistan, and Ghana confirms that soft-pegged currencies backed by discretionary central bank liquidity injections end in inevitable balance of payments collapse.`,
    quiz: [
      {
        question: "What is B.R. Shenoy's 'Mercantilist Fallacy' warning regarding import bans?",
        options: [
          "Import bans cure inflation instantly",
          "Import bans treat the symptom (imports) while ignoring the true disease (excess money creation by the central bank)",
          "Importing luxury cars strengthens foreign reserves",
          "Floating exchange rates require import bans"
        ],
        correctIndex: 1,
        explanation: "B.R. Shenoy proved that blocking imports does not remove excess purchasing power—the excess printed rupees will simply spill into local inflation or illegal capital flight."
      }
    ],
    samplePrompts: [
      "Explain the Interest Rate-FX Ping-Pong dynamic.",
      "How does providing cheap reverse repos encourage banks to 'overtrade without deposits'?"
    ]
  },
  {
    id: 'ch16',
    chapterNumber: 16,
    part: 'Part II: Operational Reality',
    title: 'Western Models vs. The Sri Lankan Reality',
    subtitle: 'The Floor System (Bank of England / Fed) vs Scarce Reserves',
    keyConcepts: ['Western Floor System', 'Ample Reserves & Quantitative Easing (QE)', 'SONIA / Bank Rate', 'Scarce Reserve Active Intervention'],
    summaryMarkdown: `### Western Floor Systems vs Sri Lanka\'s Scarce Reserve Reality

Chapter 16 compares Western central banking operational frameworks with the structural realities of developing island economies, warning against the uncritical copying of foreign monetary models.

- **Western "Ample Reserve Floor Systems" (Fed, BoE, ECB)**: Following massive Quantitative Easing asset purchases during the 2008 global financial crisis and 2020 pandemic, Western central banks flooded commercial banking systems with overwhelming excess liquidity. In an ample reserve environment, commercial banks hold trillions in excess reserves. The central bank pays interest on excess reserves at its official deposit rate, creating a passive interest rate floor. Interbank rates naturally hug this floor without requiring daily central bank open market interventions, and foreign exchange rates float freely.

- **Sri Lanka\'s Scarce Reserve & Structural Deficit Reality**: In stark contrast to Western financial systems, Sri Lanka operates in a scarce reserve environment characterized by low foreign exchange reserves, high public debt, and structural liquidity deficits. In a scarce reserve system, interbank rates are highly sensitive to daily cash flows.

- **The Danger of Misapplying Western Models**: Attempting to implement Western floor-system interest rate targeting in a scarce reserve environment forces the monetary authority into relentless, active daily market interventions. Whenever liquidity tightens, the central bank is forced to print fresh domestic currency to suppress interbank rates. This unsterilized liquidity creation fuels import demand, drains foreign reserves, and destabilizes the exchange rate. Western models work because reserves are abundant and currencies float freely; applying them in a scarce reserve soft-peg system guarantees monetary instability.`,
    quiz: [
      {
        question: "Why is a Western 'Floor System' (e.g., Bank of England) passive compared to Sri Lanka's central bank?",
        options: [
          "Western central banks do not use computers",
          "Western banks hold ample reserves from QE, so overnight market rates naturally sit on the deposit floor without daily injections",
          "Sri Lanka has more foreign reserves than the UK",
          "Floor systems do not allow interest rates"
        ],
        correctIndex: 1,
        explanation: "In Western ample reserve floor systems, liquidity is abundant so market rates naturally hug the central bank's deposit rate floor without needing daily cash injections."
      }
    ],
    samplePrompts: [
      "Contrast Western Floor Systems with Sri Lanka's Scarce Reserve Middle Corridor.",
      "How did Bank of England's SONIA benchmark behave under Quantitative Easing?"
    ]
  },
  {
    id: 'ch17',
    chapterNumber: 17,
    part: 'Part II: Operational Reality',
    title: 'Continuous Reserve Accumulation & Partial Convertibility',
    subtitle: 'Why the Rupee Depreciated in 2025 Amidst Record Surpluses',
    keyConcepts: ['2025 Rupee Paradox', 'Monetization of BoP', 'Unsterilized Dollar Purchasing', 'Selective Convertibility', '1797 Bank of England Restriction'],
    summaryMarkdown: `### The 2025 Rupee Depreciation Paradox & John Exter\'s Reserve Law

Chapter 17 analyzes a complex macroeconomic puzzle occurring in Sri Lanka throughout 2025: despite recording strong current account surpluses, the domestic currency experienced significant depreciation, falling from two hundred eighty-five to over three hundred nine rupees per US dollar.

- **John Exter\'s Reserve Law & Monetary Identity**: Monetary scholar John Exter formulated a vital operational principle: a central bank is inherently unqualified to build foreign reserves through market purchases because whenever a central bank buys foreign currency dollars from commercial banks, it creates and injects newly printed domestic rupees into commercial bank settlement accounts.

- **The Unsterilized Reserve Accumulation Mechanism**: In 2025, the monetary authority purchased over one and a half billion US dollars from commercial banks to rebuild official foreign exchange reserves. However, the central bank failed to "sterilize" these dollar purchases—it did not sell down an equivalent amount of its domestic treasury bill holdings to mop up the newly created rupees. Consequently, commercial banks were flooded with excess rupee liquidity. Commercial banks used these surplus rupees to fund aggressive import loans, increasing foreign currency demand and driving the rupee down.

- **Selective Convertibility & The 1797 Bank Restriction Echo**: To manage foreign exchange scarcity, authorities granted full currency convertibility to government external debt service while restricting domestic citizens\' access to foreign exchange. This selective denial of convertibility echoes the infamous 1797 Bank of England Restriction Period caricature ("Political Ravishment of Currency"), eroding public trust in national currency and driving transactions into informal channels.`,
    quiz: [
      {
        question: "Why did the Sri Lankan Rupee depreciate in 2025 despite record Current Account surpluses?",
        options: [
          "Because foreign tourists stopped visiting Sri Lanka",
          "Because CBSL bought $1.6B USD without sterilizing the newly printed Rupees, creating excess liquidity that boomeranged into import demand",
          "Because the Treasury ran a massive budget surplus",
          "Because gold prices collapsed globally"
        ],
        correctIndex: 1,
        explanation: "When CBSL buys dollars to build reserves, it creates new rupees. Without selling down bond holdings to mop up those rupees (sterilization), the excess cash turns into import credit and currency depreciation."
      }
    ],
    samplePrompts: [
      "Explain John Exter's insight on central banks buying dollars.",
      "What was the 1797 'Political Ravishment of Currency' caricature and how does it relate to Sri Lanka 2025?"
    ]
  },
  {
    id: 'ch18',
    chapterNumber: 18,
    part: 'Part II: Operational Reality',
    title: 'Final Reflections: The Discipline of Prosperity',
    subtitle: 'Sound Money, Free Trade, and National Sovereignty',
    keyConcepts: ['Sound Money as a Human Right', 'Free Trade & Realistic FX', 'Sovereignty Through Solvency', 'Final Verdict'],
    summaryMarkdown: `### Final Reflections: The Discipline of Prosperity

Chapter 18 concludes this treatise by synthesizing the core economic principles necessary to achieve permanent monetary stability, national solvency, and genuine economic prosperity.

- **Monetary Plumbing Matters**: National economic well-being depends directly on operational central bank plumbing. Misunderstanding the difference between liquidity absorption and money creation leads to policy blunders that destroy domestic savings, ignite price inflation, and bankrupt nations.

- **Sound Money as a Human Right**: Inflation is a hidden, regressive tax that steals purchasing power from daily wage earners, pensioners, and thrifty savers to subsidize government overspending. Preserving sound money—a stable currency whose supply cannot be arbitrarily expanded by central bankers—is a fundamental protection for human dignity and economic freedom.

- **Sovereignty Through Fiscal Solvency**: True national sovereignty is not achieved through defensive speeches, import bans, or emergency currency swaps. True sovereignty is built on fiscal solvency: matching government expenditures with tax revenues, maintaining market-clearing interest rates, generating real national savings, and attracting productive Foreign Direct Investment.

- **The Final Verdict**: National prosperity requires strict, rules-based operational discipline over discretionary monetary ambiguity. Central banks must abandon short-term interest rate suppression and soft-peg intervention traps, holding themselves accountable to public transparency and long-run price stability.`,
    quiz: [
      {
        question: "What is the ultimate conclusion of 'The Story Behind Sri Lanka's Tragic Mis-Fortune'?",
        options: [
          "Nations can print money indefinitely without consequences",
          "Economic stability requires strict operational discipline and adherence to rules over discretionary ambiguity",
          "Import bans are the only way to protect currency value",
          "Central banks should abolish commercial banks"
        ],
        correctIndex: 1,
        explanation: "The book proves that long-term prosperity depends on sound money, rules-based operational discipline, and eliminating soft-peg ambiguity."
      }
    ],
    samplePrompts: [
      "What are the 3 pillars of 'The Discipline of Prosperity'?",
      "Summarize the final verdict of the book for economics students and policymakers."
    ]
  }
];

export interface ScenarioState {
  policyRateOPR: number; // e.g. 8.0%
  cbslUsdPurchase: number; // e.g. $100M purchased
  sterilizationRate: number; // 0% to 100% bond selloff
  fiscalDeficitPct: number; // e.g. 8% of GDP
}

export function calculatePolicySimulation(state: ScenarioState) {
  const { policyRateOPR, cbslUsdPurchase, sterilizationRate, fiscalDeficitPct } = state;
  
  // Base Rupee Exchange Rate (LKR/USD)
  let baseLkrUsd = 300.0;
  
  // Unsterilized money creation factor
  const unsterilizedUsd = cbslUsdPurchase * (1 - sterilizationRate / 100);
  const excessRupeesPrinted = unsterilizedUsd * 300; // in LKR Millions
  
  // Rate suppression impact (if OPR < 9%)
  const rateSuppressionPressure = Math.max(0, 9.0 - policyRateOPR) * 2.5;
  
  // Fiscal deficit pressure
  const fiscalPressure = fiscalDeficitPct * 1.8;
  
  // Net Depreciation Pressure
  const netDepreciationPct = (unsterilizedUsd * 0.015) + rateSuppressionPressure + fiscalPressure;
  const projectedExchangeRate = baseLkrUsd * (1 + netDepreciationPct / 100);
  
  // Foreign reserves change
  const reserveGainUSD = cbslUsdPurchase;
  
  // Inflation forecast
  const projectedInflationPct = 2.0 + (netDepreciationPct * 0.6) + (excessRupeesPrinted / 10000);

  // Status diagnosis
  let statusSeverity: 'SUCCESS' | 'WARNING' | 'CRISIS' = 'SUCCESS';
  let statusMessage = 'Stable monetary conditions. Inflation within target band and exchange rate market-clearing.';
  
  if (netDepreciationPct > 6.0 || projectedExchangeRate > 320) {
    statusSeverity = 'CRISIS';
    statusMessage = '🚨 SOFT-PEG TRAP / BOP CRISIS: Unsterilized liquidity and low rates fueled import credit, draining reserves & causing currency slide!';
  } else if (netDepreciationPct > 2.5) {
    statusSeverity = 'WARNING';
    statusMessage = '⚠️ MODERATE FX PRESSURE: Partial convertibility leakage observed. Increase sterilization bond sales to mop up excess rupees.';
  }

  return {
    projectedExchangeRate: Number(projectedExchangeRate.toFixed(2)),
    depreciationPct: Number(netDepreciationPct.toFixed(2)),
    reserveGainUSD,
    excessRupeesPrintedLkrBillion: Number((excessRupeesPrinted / 1000).toFixed(1)),
    projectedInflationPct: Number(projectedInflationPct.toFixed(1)),
    statusSeverity,
    statusMessage,
  };
}
