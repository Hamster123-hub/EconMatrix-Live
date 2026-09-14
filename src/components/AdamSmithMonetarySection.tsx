import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, Award, Lightbulb, Cpu, FileText, ArrowRight } from 'lucide-react';

interface AdamSmithMonetarySectionProps {
  language?: 'en' | 'si' | 'ta';
}

export const AdamSmithMonetarySection: React.FC<AdamSmithMonetarySectionProps> = () => {
  const [activeTab, setActiveTab] = useState<'simplified_full' | 'full_text_1776' | 'summary_ai' | 'quiz'>('simplified_full');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestions = [
    {
      question: "According to Adam Smith in Book II, Chapter 2, what is the primary distinction between 'Gross Revenue' and 'Net Revenue' of a society?",
      options: [
        "Gross Revenue includes money, whereas Net Revenue consists only of the real goods and services available for consumption.",
        "Gross Revenue is tax income collected by government, while Net Revenue is private business profit.",
        "Gross Revenue is measured in gold coin, while Net Revenue is measured in paper bank notes.",
        "Gross Revenue is foreign export value, while Net Revenue is domestic consumption."
      ],
      correctIndex: 0,
      explanation: "Adam Smith emphasizes that money itself forms no part of the net revenue of society. The gold or paper currency is merely the instrument of circulation; true net revenue consists of the actual consumable goods, food, clothing, and housing produced."
    },
    {
      question: "What is Adam Smith's famous 'Wagon-Way in the Air' analogy regarding paper money?",
      options: [
        "That paper money is imaginary and will inevitably collapse into zero value.",
        "That paper money acts like an aerial highway—replacing physical ground roads (gold coin) so the land can be converted into fertile pasture and crops.",
        "That paper currency allows merchants to trade with foreign nations via ships and aircraft.",
        "That central bank loans fly across boundaries faster than metallic coins."
      ],
      correctIndex: 1,
      explanation: "Smith famously wrote that substituting paper money for gold and silver is like building a highway through the air. By using paper notes instead of heavy gold coins, the capital formerly tied up in gold (the road) is freed to produce real agricultural and industrial wealth (the converted pasture)."
    },
    {
      question: "Why does Adam Smith warn against banks issuing more paper notes than the gold/silver coin that would naturally circulate?",
      options: [
        "Because excess paper notes automatically increase the tax liability of the government.",
        "Because excess notes cannot be absorbed domestically, leading merchants to convert notes to gold and export it abroad (specie outflow) or cause currency collapse.",
        "Because paper notes decay physically over time.",
        "Because international merchants refuse to accept paper money under any circumstances."
      ],
      correctIndex: 1,
      explanation: "Smith explains that the total quantity of paper notes circulating can never exceed the gold/silver coin it replaces. If a bank over-issues notes, the excess immediately returns to the bank to be redeemed for gold, which is then exported, draining bank reserves."
    },
    {
      question: "How does paper banking increase national industry according to Adam Smith?",
      options: [
        "By allowing the central bank to print unlimited money to pay off national debts.",
        "By liberating dead metallic capital (gold/silver) into active productive capital (tools, raw materials, and wages for workers).",
        "By forcing citizens to spend money immediately instead of saving.",
        "By setting interest rates to zero permanently."
      ],
      correctIndex: 1,
      explanation: "When paper money replaces metallic money, the gold and silver previously locked up as currency can be exported to buy foreign raw materials, tools, and pay domestic labor, directly expanding national productive capital."
    },
    {
      question: "What rule of prudent banking ('Real Bills Doctrine') does Adam Smith recommend to prevent bank runs and financial collapse?",
      options: [
        "Banks should only lend on short-term real commercial bills representing actual goods in transit, payable upon delivery.",
        "Banks should lend unconstrained long-term mortgages to all real estate buyers.",
        "Banks should maintain zero gold reserves and rely entirely on government guarantees.",
        "Banks should print double the amount of gold reserves at all times."
      ],
      correctIndex: 0,
      explanation: "Adam Smith argued that banks remain completely secure when they discount only real bills of exchange—short-term loans backed by actual merchandise moving to market—ensuring rapid repayment into bank vaults."
    }
  ];

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  return (
    <div className="bg-[#0B1E36] text-white border-2 border-amber-500/40 p-5 sm:p-8 rounded-xs space-y-8 shadow-2xl relative overflow-hidden mt-8">
      {/* Background Decorative Gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Main Section Header */}
      <div className="space-y-3 border-b border-amber-500/30 pb-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="bg-amber-400 text-slate-950 font-mono font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-xs flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>SPECIAL FEATURE: MONETARY TREATISE</span>
          </span>
          <span className="text-amber-300 font-mono text-xs font-bold bg-amber-950/80 px-2.5 py-1 border border-amber-500/40">
            Adam Smith (1776) • "The Wealth of Nations"
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 leading-tight tracking-tight">
          Learn and understand one of the most profound writtings on Monetary economics and how Centrals Banks work - By Adam Smith
        </h2>

        <p className="font-sans text-sm sm:text-base text-slate-200 max-w-4xl leading-relaxed">
          <strong>Book II, Chapter 2:</strong> <em>"Of Money Considered as a particular Branch of the General Stock of the Society, or of the Expence of Maintaining the National Capital."</em> Read the full unabridged 1776 text on a clean white background, toggle to the paragraph-by-paragraph modern English explanation, or test your understanding with our interactive quiz.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700 pb-3 relative z-10">
        <button
          onClick={() => setActiveTab('simplified_full')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer rounded-xs border ${
            activeTab === 'simplified_full'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Full Plain English Chapter (White Background)</span>
        </button>

        <button
          onClick={() => setActiveTab('full_text_1776')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer rounded-xs border ${
            activeTab === 'full_text_1776'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Original 1776 Archaic Text (White Background)</span>
        </button>

        <button
          onClick={() => setActiveTab('summary_ai')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer rounded-xs border ${
            activeTab === 'summary_ai'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Key Takeaways & Core Lessons</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer rounded-xs border ${
            activeTab === 'quiz'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400/60 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Interactive Mastery Quiz</span>
        </button>
      </div>

      {/* TAB 1: FULL ORIGINAL TEXT OF 1776 (WHITE BACKGROUND) */}
      {activeTab === 'full_text_1776' && (
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-3 rounded-xs border border-slate-700">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono">
              <FileText className="w-4 h-4" />
              <span>UNABRIDGED ORIGINAL TEXT (1776) — ADAM SMITH</span>
            </div>
            <button
              onClick={() => setActiveTab('simplified_full')}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[11px] px-3 py-1 uppercase tracking-wider transition rounded-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Switch to Simplified Full Text</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* WHITE BACKGROUND CONTAINER FOR ORIGINAL TEXT */}
          <div className="bg-white text-slate-900 border-4 border-slate-950 p-6 sm:p-10 rounded-xs shadow-2xl font-serif leading-relaxed text-sm sm:text-base space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar">
            
            <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600">
                An Inquiry into the Nature and Causes of the Wealth of Nations
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-slate-950 tracking-tight">
                BOOK II, CHAPTER II
              </h3>
              <p className="text-sm italic font-medium text-slate-700 max-w-3xl mx-auto">
                Of Money Considered as a particular Branch of the General Stock of the Society, or of the Expence of Maintaining the National Capital
              </p>
            </div>

            <p>
              It has been shown in the first book, that the price of the greater part of commodities resolves itself into three parts, of which one pays the wages of the labour, another the profits of the stock, and a third the rent of the land which had been employed in producing and bringing them to market: that there are, indeed, some commodities of which the price is made up of two of those parts only, the wages of labour, and the profits of stock: and a very few in which it consists altogether in one, the wages of labour: but that the price of every commodity necessarily resolves itself into some one, or other, or all of these three parts; every part of it which goes neither to rent nor to wages, being necessarily profit to somebody.
            </p>

            <p>
              Since this is the case, it has been observed, with regard to every particular commodity, taken separately, it must be so with regard to all the commodities which compose the whole annual produce of the land and labour of every country, taken complexly. The whole price or exchangeable value of that annual produce must resolve itself into the same three parts, and be parcelled out among the different inhabitants of the country, either as the wages of their labour, the profits of their stock, or the rent of their land.
            </p>

            <p>
              But though the whole value of the annual produce of the land and labour of every country is thus divided among and constitutes a revenue to its different inhabitants, yet as in the rent of a private estate we distinguish between the gross rent and the net rent, so may we likewise in the revenue of all the inhabitants of a great country.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 font-sans text-xs text-amber-950 my-4 space-y-1">
              <span className="font-bold uppercase tracking-wider block text-amber-900">📌 Structural Note: Gross vs. Net Revenue</span>
              <p>Here Smith introduces an important and lasting distinction between two types of revenue: gross and net. How do these concepts relate to individual earnings and national income?</p>
            </div>

            <p>
              The gross rent of a private estate comprehends whatever is paid by the farmer; the net rent, what remains free to the landlord, after deducting the expence of management, of repairs, and all other necessary charges; or what, without hurting his estate, he can afford to place in his stock reserved for immediate consumption, or to spend upon his table, equipage, the ornaments of his house and furniture, his private enjoyments and amusements. His real wealth is in proportion, not to his gross, but to his net rent.
            </p>

            <p>
              The gross revenue of all the inhabitants of a great country comprehends the whole annual produce of their land and labour; the net revenue, what remains free to them after deducting the expence of maintaining—first, their fixed, and, secondly, their circulating capital; or what, without encroaching upon their capital, they can place in their stock reserved for immediate consumption, or spend upon their subsistence, conveniencies, and amusements. Their real wealth, too, is in proportion, not to their gross, but to their net revenue.
            </p>

            <p>
              The whole expence of maintaining the fixed capital must evidently be excluded from the net revenue of the society. Neither the materials necessary for supporting their useful machines and instruments of trade, their profitable buildings, &c., nor the produce of the labour necessary for fashioning those materials into the proper form, can ever make any part of it. The price of that labour may indeed make a part of it; as the workmen so employed may place the whole value of their wages in their stock reserved for immediate consumption. But in other sorts of labour, both the price and the produce go to this stock, the price to that of the workmen, the produce to that of other people, whose subsistence, conveniences, and amusements, are augmented by the labour of those workmen.
            </p>

            <p>
              The intention of the fixed capital is to increase the productive powers of labour, or to enable the same number of labourers to perform a much greater quantity of work. In a farm where all the necessary buildings, fences, drains, communications, &c., are in the most perfect good order, the same number of labourers and labouring cattle will raise a much greater produce than in one of equal extent and equally good ground, but not furnished with equal conveniencies. In manufactures the same number of hands, assisted with the best machinery, will work up a much greater quantity of goods than with more imperfect instruments of trade. The expence which is properly laid out upon a fixed capital of any kind, is always repaid with great profit, and increases the annual produce by a much greater value than that of the support which such improvements require.
            </p>

            <div className="bg-[#091527] text-white p-4 font-sans text-xs my-4 space-y-1 rounded-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider block">🔍 Analytical Checkpoint: Role of Fixed Capital</span>
              <p className="text-slate-300">What is the role of "fixed capital" in an economy? Smith demonstrates that machinery and infrastructure increase productive power, but maintaining them consumes resources that must be deducted to find real net wealth.</p>
            </div>

            <p>
              But though the whole expence of maintaining the fixed capital is thus necessarily excluded from the net revenue of the society, it is not the same case with that of maintaining the circulating capital. Of the four parts of which this latter capital is composed—money, provisions, materials, and finished work—the three last, it has already been observed, are regularly withdrawn from it, and placed either in the fixed capital of the society, or in their stock reserved for immediate consumption.
            </p>

            <p>
              Money, therefore, is the only part of the circulating capital of a society, of which the maintenance can occasion any diminution in their net revenue.
            </p>

            <p>
              The fixed capital, and that part of the circulating capital which consists in money, so far as they affect the revenue of the society, bear a very great resemblance to one another.
            </p>

            <p>
              First, as those machines and instruments of trade, &c., require a certain expence, first to erect them, and afterwards to support them, both which expences, though they make a part of the gross, are deductions from the net revenue of the society; so the stock of money which circulates in any country must require a certain expence, first to collect it, and afterwards to support it, both which expences, though they make a part of the gross, are, in the same manner, deductions from the net revenue of the society. A certain quantity of very valuable materials, gold and silver, and of very curious labour, instead of augmenting the stock reserved for immediate consumption, the subsistence, conveniencies, and amusements of individuals, is employed in supporting that great but expensive instrument of commerce, by means of which every individual in the society has his subsistence, conveniencies, and amusements regularly distributed to him in their proper proportions.
            </p>

            <p>
              Secondly, as the machines and instruments of a trade, &c., which compose the fixed capital either of an individual or of a society, make no part either of the gross or of the net revenue of either; so money, by means of which the whole revenue of the society is regularly distributed among all its different members, makes itself no part of that revenue. The great wheel of circulation is altogether different from the goods which are circulated by means of it. The revenue of the society consists altogether in those goods, and not in the wheel which circulates them. In computing either the gross or the net revenue of any society, we must always, from their whole annual circulation of money and goods, deduct the whole value of the money, of which not a single farthing can ever make any part of either.
            </p>

            <p>
              It is the ambiguity of language only which can make this proposition appear either doubtful or paradoxical. When properly explained and understood, it is almost self-evident.
            </p>

            <p>
              When we talk of any particular sum of money, we sometimes mean nothing but the metal pieces of which it is composed; and sometimes we include in our meaning some obscure reference to the goods which can be had in exchange for it, or to the power of purchasing which the possession of it conveys. Thus when we say that the circulating money of England has been computed at eighteen millions, we mean only to express the amount of the metal pieces, which some writers have computed, or rather have supposed to circulate in that country. But when we say that a man is worth fifty or a hundred pounds a year, we mean commonly to express not only the amount of the metal pieces which are annually paid to him, but the value of the goods which he can annually purchase or consume. We mean commonly to ascertain what is or ought to be his way of living, or the quantity and quality of the necessaries and conveniencies of life in which he can with propriety indulge himself.
            </p>

            <p>
              When, by any particular sum of money, we mean not only to express the amount of the metal pieces of which it is composed, but to include in its signification some obscure reference to the goods which can be had in exchange for them, the wealth or revenue which it in this case denotes, is equal only to one of the two values which are thus intimated somewhat ambiguously by the same word, and to the latter more properly than to the former, to the money's worth more properly than to the money.
            </p>

            <p>
              Thus if a guinea be the weekly pension of a particular person, he can in the course of the week purchase with it a certain quantity of subsistence, conveniencies, and amusements. In proportion as this quantity is great or small, so are his real riches, his real weekly revenue. His weekly revenue is certainly not equal both to the guinea, and to what can be purchased with it, but only to one or other of those two equal values; and to the latter more properly than to the former, to the guinea's worth rather than to the guinea.
            </p>

            <p>
              If the pension of such a person was paid to him, not in gold, but in a weekly bill for a guinea, his revenue surely would not so properly consist in the piece of paper, as in what he could get for it. A guinea may be considered as a bill for a certain quantity of necessaries and conveniencies upon all the tradesmen in the neighbourhood. The revenue of the person to whom it is paid, does not so properly consist in the piece of gold, as in what he can get for it, or in what he can exchange it for. If it could be exchanged for nothing, it would, like a bill upon a bankrupt, be of no more value than the most useless piece of paper.
            </p>

            <p>
              Though the weekly or yearly revenue of all the different inhabitants of any country, in the same manner, may be, and in reality frequently is paid to them in money, their real riches, however, the real weekly or yearly revenue of all of them taken together, must always be great or small in proportion to the quantity of consumable goods which they can all of them purchase with this money. The whole revenue of all of them taken together is evidently not equal to both the money and the consumable goods; but only to one or other of those two values, and to the latter more properly than to the former.
            </p>

            <p>
              Though we frequently, therefore, express a person's revenue by the metal pieces which are annually paid to him, it is because the amount of those pieces regulates the extent of his power of purchasing, or the value of the goods which he can annually afford to consume. We still consider his revenue as consisting in this power of purchasing or consuming, and not in the pieces which convey it.
            </p>

            <p>
              But if this is sufficiently evident even with regard to an individual, it is still more so with regard to a society. The amount of the metal pieces which are annually paid to an individual, is often precisely equal to his revenue, and is upon that account the shortest and best expression of its value. But the amount of the metal pieces which circulate in a society can never be equal to the revenue of all its members. As the same guinea which pays the weekly pension of one man to-day, may pay that of another to-morrow, and that of a third the day thereafter, the amount of the metal pieces which annually circulate in any country must always be of much less value than the whole money pensions annually paid with them. But the power of purchasing, or the goods which can successively be bought with the whole of those money pensions as they are successively paid, must always be precisely of the same value with those pensions; as must likewise be the revenue of the different persons to whom they are paid. That revenue, therefore, cannot consist in those metal pieces, of which the amount is so much inferior to its value, but in the power of purchasing, in the goods which can successively be bought with them as they circulate from hand to hand.
            </p>

            <p>
              Money, therefore, the great wheel of circulation, the great instrument of commerce, like all other instruments of trade, though it makes a part and a very valuable part of the capital, makes no part of the revenue of the society to which it belongs; and though the metal pieces of which it is composed, in the course of their annual circulation, distribute to every man the revenue which properly belongs to him, they make themselves no part of that revenue.
            </p>

            <p>
              Thirdly, and lastly, the machines and instruments of trade, &c., which compose the fixed capital, bear this further resemblance to that part of the circulating capital which consists in money; that as every saving in the expence of erecting and supporting those machines, which does not diminish the productive powers of labour, is an improvement of the net revenue of the society, so every saving in the expence of collecting and supporting that part of the circulating capital which consists in money, is an improvement of exactly the same kind.
            </p>

            <p>
              The substitution of paper in the room of gold and silver money, replaces a very expensive instrument of commerce with one much less costly, and sometimes equally convenient. Circulation comes to be carried on by a new wheel, which it costs less both to erect and to maintain than the old one. But in what manner this operation is performed, and in what manner it tends to increase either the gross or the net revenue of the society, is not altogether so obvious, and may therefore require some further explication.
            </p>

            <p>
              There are several different sorts of paper money; but the circulating notes of banks and bankers are the species which is best known, and which seems best adapted for this purpose.
            </p>

            <p>
              When the people of any particular country have such confidence in the fortune, probity, and prudence of a particular banker, as to believe that he is always ready to pay upon demand such of his promissory notes as are likely to be at any time presented to him; those notes come to have the same currency as gold and silver money, from the confidence that such money can at any time be had for them.
            </p>

            <p>
              A particular banker lends among his customers his own promissory notes, to the extent, we shall suppose, of a hundred thousand pounds. As those notes serve all the purposes of money, his debtors pay him the same interest as if he had lent them so much money. This interest is the source of his gain. Though some of those notes are continually coming back upon him for payment, part of them continue to circulate for months and years together. Though he has generally in circulation, therefore, notes to the extent of a hundred thousand pounds, twenty thousand pounds in gold and silver may frequently be a sufficient provision for answering occasional demands. By this operation, therefore, twenty thousand pounds in gold and silver perform all the functions which a hundred thousand could otherwise have performed. The same exchanges may be made, the same quantity of consumable goods may be circulated and distributed to their proper consumers, by means of his promissory notes, to the value of a hundred thousand pounds, as by an equal value of gold and silver money. Eighty thousand pounds of gold and silver, therefore, can, in this manner, be spared from the circulation of the country; and if different operations of the same kind should, at the same time, be carried on by many different banks and bankers, the whole circulation may thus be conducted with a fifth part only of the gold and silver which would otherwise have been requisite.
            </p>

            <p>
              Let us suppose, for example, that the whole circulating money of some particular country amounted, at a particular time, to one million sterling, that sum being then sufficient for circulating the whole annual produce of their land and labour. Let us suppose, too, that some time thereafter, different banks and bankers issued promissory notes, payable to the bearer, to the extent of one million, reserving in their different coffers two hundred thousand pounds for answering occasional demands. There would remain, therefore, in circulation, eight hundred thousand pounds in gold and silver, and a million of bank notes, or eighteen hundred thousand pounds of paper and money together. But the annual produce of the land and labour of the country had before required only one million to circulate and distribute it to its proper consumers, and that annual produce cannot be immediately augmented by those operations of banking. One million, therefore, will be sufficient to circulate it after them. The goods to be bought and sold being precisely the same as before, the same quantity of money will be sufficient for buying and selling them. The channel of circulation, if I may be allowed such an expression, will remain precisely the same as before. One million we have supposed sufficient to fill that channel. Whatever, therefore, is poured into it beyond this sum cannot run in it, but must overflow. One million eight hundred thousand pounds are poured into it. Eight hundred thousand pounds, therefore, must overflow, that sum being over and above what can be employed in the circulation of the country. But though this sum cannot be employed at home, it is too valuable to be allowed to lie idle. It will, therefore, be sent abroad, in order to seek that profitable employment which it cannot find at home. But the paper cannot go abroad; because at a distance from the banks which issue it, and from the country in which payment of it can be exacted by law, it will not be received in common payments. Gold and silver, therefore, to the amount of eight hundred thousand pounds will be sent abroad, and the channel of home circulation will remain filled with a million of paper, instead of the million of those metals which filled it before.
            </p>

            <p>
              But though so great a quantity of gold and silver is thus sent abroad, we must not imagine that it is sent abroad for nothing, or that its proprietors make a present of it to foreign nations. They will exchange it for foreign goods of some kind or another, in order to supply the consumption either of some other foreign country or of their own.
            </p>

            <p>
              If they employ it in purchasing goods in one foreign country in order to supply the consumption of another, or in what is called the carrying trade, whatever profit they make will be an addition to the net revenue of their own country. It is like a new fund, created for carrying on a new trade; domestic business being now transacted by paper, and the gold and silver being converted into a fund for this new trade.
            </p>

            <p>
              If they employ it in purchasing foreign goods for home consumption, they may either, first, purchase such goods as are likely to be consumed by idle people who produce nothing, such as foreign wines, foreign silks, &c.; or, secondly, they may purchase an additional stock of materials, tools, and provisions, in order to maintain and employ an additional number of industrious people, who reproduce, with a profit, the value of their annual consumption.
            </p>

            <p>
              So far as it is employed in the first way, it promotes prodigality, increases expence and consumption without increasing production, or establishing any permanent fund for supporting that expence, and is in every respect hurtful to the society.
            </p>

            <p>
              So far as it is employed in the second way, it promotes industry; and though it increases the consumption of the society, it provides a permanent fund for supporting that consumption, the people who consume reproducing, with a profit, the whole value of their annual consumption. The gross revenue of the society, the annual produce of their land and labour, is increased by the whole value which the labour of those workmen adds to the materials upon which they are employed; and their net revenue by what remains of this value, after deducting what is necessary for supporting the tools and instruments of their trade.
            </p>

            <p>
              When we compute the quantity of industry which the circulating capital of any society can employ, we must always have regard to those parts of it only which consist in provisions, materials, and finished work: the other, which consists in money, and which serves only to circulate those three, must always be deducted. In order to put industry into motion, three things are requisite; materials to work upon, tools to work with, and the wages or recompense for the sake of which the work is done. Money is neither a material to work upon, nor a tool to work with; and though the wages of the workman are commonly paid to him in money, his real revenue, like that of all other men, consists, not in money, but in the money's worth; not in the metal pieces, but in what can be got for them.
            </p>

            <div className="bg-slate-100 border-l-4 border-slate-900 p-4 font-sans text-xs text-slate-800 my-4 space-y-1">
              <span className="font-bold text-slate-950 uppercase tracking-wider block">💡 Famous "Wagon-Way in the Air" Passage:</span>
              <p className="italic">
                "The gold and silver money which circulates in any country may very properly be compared to a highway, which, while it circulates and carries to market all the grass and corn of the country, produces itself not a single pile of either. The judicious operations of banking, by providing, if I may be allowed so violent a metaphor, a sort of waggon-way through the air, enable the country to convert, as it were, a great part of its highways into good pastures and corn-fields..."
              </p>
            </div>

            <p>
              When paper is substituted in the room of gold and silver money, the quantity of the materials, tools, and maintenance, which the whole circulating capital can supply, may be increased by the whole value of gold and silver which used to be employed in purchasing them. The whole value of the great wheel of circulation and distribution is added to the goods which are circulated and distributed by means of it.
            </p>

            <p>
              What is the proportion which the circulating money of any country bears to the whole value of the annual produce circulated by means of it, it is, perhaps, impossible to determine. It has been computed by different authors at a fifth, at a tenth, at a twentieth, and at a thirtieth part of that value. But how small soever the proportion which the circulating money may bear to the whole value of the annual produce, as but a part, and frequently but a small part, of that produce, is ever destined for the maintenance of industry, it must always bear a very considerable proportion to that part.
            </p>

            <p>
              An operation of this kind has, within these five-and-twenty or thirty years, been performed in Scotland, by the erection of new banking companies in almost every considerable town, and even in some country villages. The effects of it have been precisely those above described. The business of the country is almost entirely carried on by means of the paper of those different banking companies, with which purchases and payments of kinds are commonly made. Silver very seldom appears except in the change of a twenty shillings bank note, and gold still seldomer.
            </p>

            <p>
              It is chiefly by discounting bills of exchange, that is, by advancing money upon them before they are due, that the greater part of banks and bankers issue their promissory notes. They deduct always, upon whatever sum they advance, the legal interest till the bill shall become due. The payment of the bill, when it becomes due, replaces to the bank the value of what had been advanced, together with a clear profit of the interest.
            </p>

            <p>
              The commerce of Scotland, which at present is not very great, was still more inconsiderable when the two first banking companies were established... They invented, therefore, another method of issuing their promissory notes; by granting what they called cash accounts...
            </p>

            <p>
              By means of those cash accounts every merchant can, without imprudence, carry on a greater trade than he otherwise could do. If there are two merchants, one in London and the other in Edinburgh, who employ equal stocks in the same branch of trade, the Edinburgh merchant can, without imprudence, carry on a greater trade and give employment to a greater number of people than the London merchant.
            </p>

            <p>
              The whole paper money of every kind which can easily circulate in any country never can exceed the value of the gold and silver, of which it supplies the place, or which (the commerce being supposed the same) would circulate there, if there was no paper money. Should the circulating paper at any time exceed that sum, as the excess could neither be sent abroad nor be employed in the circulation of the country, it must immediately return upon the banks to be exchanged for gold and silver.
            </p>

            <p>
              Over and above the expences which are common to every branch of trade; such as the expence of house-rent, the wages of servants, clerks, accountants, &c.; the expences peculiar to a bank consist chiefly in two articles: first, in the expence of keeping at all times in its coffers, for answering the occasional demands of the holders of its notes, a large sum of money, of which it loses the interest; and, secondly, in the expence of replenishing those coffers as fast as they are emptied by answering such occasional demands.
            </p>

            <p>
              A banking company, which issues more paper than can be employed in the circulation of the country, and of which the excess is continually returning upon them for payment, ought to increase the quantity of gold and silver, which they keep at all times in their coffers, not only in proportion to this excessive increase of their circulation, but in a much greater proportion...
            </p>

            <p>
              By issuing too great a quantity of paper, of which the excess was continually returning, in order to be exchanged for gold and silver, the Bank of England was for many years together obliged to coin gold to the extent of between eight hundred thousand pounds and a million a year... For this great coinage the bank was frequently obliged to purchase gold bullion at the high price of four pounds an ounce, which it soon after issued in coin at 3l. 17s. 10½d. an ounce...
            </p>

            <p>
              The Scotch banks, in consequence of an excess of the same kind, were all obliged to employ constantly agents at London to collect money for them, at an expence which was seldom below one and a half or two per cent. This money was sent down by the waggon, and insured by the carriers...
            </p>

            <p>
              When a bank discounts to a merchant a real bill of exchange drawn by a real creditor upon a real debtor, and which, as soon as it becomes due, is really paid by that debtor, it only advances to him a part of the value which he would otherwise be obliged to keep by him unemployed and in ready money for answering occasional demands. The payment of the bill, when it becomes due, replaces to the bank the value of what it had advanced, together with the interest. The coffers of the bank, so far as its dealings are confined to such customers, resemble a water pond, from which, though a stream is continually running out, yet another is continually running in, fully equal to that which runs out; so that, without any further care or attention, the pond keeps always equally, or very near equally full.
            </p>

            <p>
              The practice of drawing and redrawing is so well known to all men of business... The trader A in Edinburgh, we shall suppose, draws a bill upon B in London, payable two months after date. In reality B in London owes nothing to A in Edinburgh; but he agrees to accept of A's bill, upon condition that before the term of payment he shall redraw upon A in Edinburgh for the same sum...
            </p>

            <p>
              That the industry of Scotland languished for want of money to employ it was the opinion of the famous Mr. Law. By establishing a bank of a particular kind, which he seems to have imagined might issue paper to the amount of the whole value of all the lands in the country, he proposed to remedy this want of money... The idea of the possibility of multiplying paper to almost any extent was the real foundation of what is called the Mississippi scheme, the most extravagant project both of banking and stock-jobbing that, perhaps, the world ever saw.
            </p>

            <p>
              The Bank of England is the greatest bank of circulation in Europe. It was incorporated, in pursuance of an act of Parliament, by a charter under the Great Seal, dated the 27th of July, 1694. It at that time advanced to government the sum of one million two hundred thousand pounds, for an annuity of one hundred thousand pounds... The stability of the Bank of England is equal to that of the British government. All that it has advanced to the public must be lost before its creditors can sustain any loss.
            </p>

            <p>
              To restrain private people, it may be said, from receiving in payment the promissory notes of a banker, for any sum whether great or small, when they themselves are willing to receive them, or to restrain a banker from issuing such notes, when all his neighbours are willing to accept of them, is a manifest violation of that natural liberty which it is the proper business of law not to infringe, but to support. Such regulations may, no doubt, be considered as in some respects a violation of natural liberty. But those exertions of the natural liberty of a few individuals, which might endanger the security of the whole society, are, and ought to be, restrained by the laws of all governments, of the most free as well as of the most despotical. The obligation of building party walls, in order to prevent the communication of fire, is a violation of natural liberty exactly of the same kind with the regulations of the banking trade which are here proposed.
            </p>

            <p>
              A paper money consisting in bank notes, issued by people of undoubted credit, payable upon demand without any condition, and in fact always readily paid as soon as presented, is, in every respect, equal in value to gold and silver money; since gold and silver money can at any time be had for it. Whatever is either bought or sold for such paper must necessarily be bought or sold as cheap as it could have been for gold and silver.
            </p>

            <p>
              If bankers are restrained from issuing any circulating bank notes, or notes payable to the bearer, for less than a certain sum, and if they are subjected to the obligation of an immediate and unconditional payment of such bank notes as soon as presented, their trade may, with safety to the public, be rendered in all other respects perfectly free. The late multiplication of banking companies in both parts of the United Kingdom, an event by which many people have been much alarmed, instead of diminishing, increases the security of the public. Free competition obliges all bankers to be more liberal in their dealings with their customers, lest their rivals should carry them away. In general, if any branch of trade, or any division of labour, be advantageous to the public, the freer and more general the competition, it will always be the more so.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: FULL PLAIN ENGLISH CHAPTER (WHITE BACKGROUND) */}
      {activeTab === 'simplified_full' && (
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-3.5 rounded-xs border border-slate-700">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>FULL UNABRIDGED CHAPTER TRANSLATED INTO PLAIN MODERN ENGLISH WITH MODERN CENTRAL BANKING MAPPINGS</span>
            </div>
            <span className="text-slate-300 text-[11px] font-mono">
              Book II, Chapter 2 • Adam Smith (1776)
            </span>
          </div>

          {/* WHITE BACKGROUND CONTAINER FOR PLAIN ENGLISH TEXT */}
          <div className="bg-white text-slate-900 border-4 border-slate-950 p-6 sm:p-10 rounded-xs shadow-2xl font-serif leading-relaxed text-sm sm:text-base space-y-6 max-h-[780px] overflow-y-auto custom-scrollbar">
            
            <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded border border-amber-300 inline-block">
                Comprehensive Plain English Full Text & Modern Central Bank Bridge
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif leading-tight">
                Adam Smith: Of Money Considered as a Particular Branch of the General Stock of the Society
              </h1>
              <p className="text-xs sm:text-sm font-sans text-slate-600 max-w-3xl mx-auto italic">
                From "An Inquiry into the Nature and Causes of the Wealth of Nations" (Book II, Chapter II). Translated line-by-line into clear, plain English, paired with <em>italicized modern central banking mappings (FX reserves, money printing, currency crises, and exchange rate crashes)</em>.
              </p>
            </div>

            <div className="space-y-8 text-slate-800 font-serif leading-relaxed">
              
              {/* SECTION 1 */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900">
                  1. Gross Revenue, Net Revenue, and the True Cost of Maintaining National Capital
                </h2>
                
                <p>
                  In the previous chapter, we established that every society's entire physical stock of goods is split into three main buckets:
                </p>
                <ol className="list-decimal pl-6 space-y-1 text-slate-800 font-sans text-sm">
                  <li><strong>Consumption Stock:</strong> Goods set aside for immediate survival and living (food in the kitchen, clothes in closets, furniture in homes).</li>
                  <li><strong>Fixed Capital:</strong> Machinery, tools, industrial buildings, land improvements, and the acquired useful talents of citizens that yield a revenue without changing hands.</li>
                  <li><strong>Circulating Capital:</strong> Goods that yield a revenue by circulating or being sold—such as raw materials, agricultural crops waiting for market, finished goods in storehouses, and money.</li>
                </ol>

                <p>
                  When assessing the annual economic output of an entire nation, we must strictly separate <strong>Gross Revenue</strong> from <strong>Net Revenue</strong>.
                </p>

                <p>
                  <strong>Gross Revenue</strong> is the total combined market value of all produce created by the nation's land, labor, and factories in a single year.
                </p>

                <p>
                  <strong>Net Revenue</strong> is what remains free for the inhabitants to spend on their personal consumption, living expenses, and enjoyment <em>after</em> deducting all necessary expenses required to maintain their capital stock (both fixed and circulating).
                </p>

                <p>
                  Think of a factory or farm: if machines break down, roofs leak, or soil nutrients deplete, part of the annual income must be set aside to replace broken gears, rebuild warehouses, and maintain the working stock before any profit can be taken home. Similarly, a nation's real economic wealth is not its gross turnover, but its net revenue—the actual surplus of food, clothing, housing, and amenities available for human well-being.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-amber-800">
                    🏛️ Modern Economics & Central Bank Mapping: Gross Domestic Product (GDP) vs Net National Income
                  </div>
                  <p className="italic text-slate-700">
                    In modern macroeconomics, Smith's <strong>Gross Revenue</strong> maps directly to <strong>Gross Domestic Product (GDP)</strong> or Gross National Income (GNI). Smith's concept of <strong>Net Revenue</strong> corresponds to <strong>Net Domestic Product (NDP)</strong>—which subtracts Capital Consumption Allowance (depreciation of machinery, infrastructure, and equipment) from GDP. Central banks and finance ministries monitor net capital accumulation because a nation that consumes its capital without maintaining infrastructure suffers long-term economic decline regardless of headline GDP numbers.
                  </p>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  2. Why Money Itself is NOT Part of National Net Revenue — The Delivery Truck Metaphor
                </h2>

                <p>
                  Although physical gold and silver coins form part of a nation's circulating capital, <strong>the money supply itself adds zero value to the net revenue of society</strong>.
                </p>

                <p>
                  Money is a tool of commerce—a vehicle of conveyance. Consider a highway or a delivery truck: a heavy highway allows trucks to carry thousands of bushels of wheat and corn from farms to city markets. However, the concrete highway itself grows not a single stalk of corn!
                </p>

                <p>
                  Money functions in the exact same manner. Gold and silver coins are the great wheel of circulation—the machinery by which food, clothing, houses, and services are distributed to households. But metallic gold coins cannot be eaten, worn as clothing, or lived in as shelter.
                </p>

                <p>
                  If a nation possessed $10 billion in pure gold coins but had no grain, cotton, or homes, its population would starve in rags among piles of gold. The real annual income of a country consists of the consumable goods bought and sold—the wheat, clothes, and homes moved by money—not the gold or paper used to facilitate trade.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-sky-800">
                    🏛️ Modern Economics & Central Bank Mapping: Neutrality of Money & Real vs Nominal Values
                  </div>
                  <p className="italic text-slate-700">
                    This directly expresses the fundamental modern macroeconomic concept of the <strong>Neutrality of Money</strong> and the distinction between <em>Nominal GDP</em> and <em>Real GDP</em>. Modern central banks (like the US Federal Reserve, European Central Bank, or Central Bank of Sri Lanka) recognize that simply printing more domestic paper money (increasing M2 money supply) does not create real goods. If a central bank doubles the paper currency in circulation without an increase in real output (goods, services, food, electricity), prices simply double (inflation), while the real net income of society remains unchanged. Money is a medium of exchange, not wealth itself.
                  </p>
                </div>
              </div>

              {/* SECTION 3 */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  3. The Invention of Paper Money and Fractional Reserve Banking
                </h2>

                <p>
                  Maintaining a pure metallic currency system made of gold and silver coins is extraordinarily expensive. Gold must be mined deep out of the earth at immense labor cost, refined in furnaces, minted into coins, and constantly guarded. Furthermore, every time gold coins circulate in markets, physical friction wears the metal away over time.
                </p>

                <p>
                  When trustworthy commercial bankers introduce paper banknotes—promissory notes payable on demand in gold coin—a dramatic economic efficiency occurs. When the public trusts that a bank holds enough gold to honor its paper notes, merchants willingly accept paper notes in daily market trade instead of heavy gold coins.
                </p>

                <p>
                  The banker makes a vital discovery: even if he has <strong>$100,000 worth of paper banknotes</strong> circulating in the community, noteholders rarely return all at once to claim physical gold. On any average week, keeping a fraction—say <strong>$20,000 (20%) in gold reserves</strong> in the bank vault—is completely sufficient to pay off the few people who ask for gold cash withdrawals!
                </p>

                <p>
                  Thus, $20,000 in physical gold reserves allows the bank to safely support $100,000 in active circulating paper notes. This is the origin of fractional reserve banking.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-emerald-800">
                    🏛️ Modern Economics & Central Bank Mapping: Fractional Reserves, Commercial Bank Money Multiplier, and Statutory Reserve Ratios (SRR)
                  </div>
                  <p className="italic text-slate-700">
                    In modern monetary systems, commercial banks operate under this exact fractional reserve principle. Central banks set mandatory <strong>Statutory Reserve Requirements (SRR)</strong>—for instance, requiring commercial banks to hold 5% to 10% of total deposits as liquid reserves at the Central Bank or in vault cash, while lending out the remaining 90%. This creates the <em>Money Multiplier Effect</em> ($1 of central bank reserve money creates $10 of bank credit and deposit money in the economy).
                  </p>
                </div>
              </div>

              {/* SECTION 4 - THE WAGON WAY METAPHOR */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  4. The Famous Metaphor: A "Wagon-Way in the Air" Explained Exactly
                </h2>

                <p>
                  Adam Smith summarizes how paper currency creates national wealth through one of the most celebrated metaphors in the history of economics:
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-600 p-4 my-3 font-sans text-sm text-amber-950 rounded-r shadow-inner">
                  <p className="font-semibold italic">
                    "The judicious operations of banking, by providing a sort of waggon-way through the air, enable the country to convert a great part of its highways into good pastures and corn-fields, and thereby to augment very considerably the annual produce of its land and labour."
                  </p>
                </div>

                <p>
                  <strong>How the Metaphor Works Step-by-Step:</strong>
                </p>

                <p>
                  Imagine a country where 20% of all fertile agricultural land is covered by massive, wide, muddy dirt roads. These dirt roads are necessary because heavy wooden wagons must travel over them to haul wheat, wool, and timber to market. But as long as that land is paved over with dirt tracks, it cannot grow a single stalk of wheat or feed a single sheep.
                </p>

                <p>
                  Now imagine a brilliant engineer builds an <strong>aerial wagon-way floating in the air</strong> (like a sky-cable or flying transport track) that handles all wagon transportation overhead. What can the nation do with the old ground highways?
                </p>

                <p>
                  The nation can plow up the old dirt roads, plant corn and wheat on that fertile soil, graze cattle on the new pastures, and dramatically increase the country's total agricultural harvest!
                </p>

                <p>
                  <strong>The Economic Meaning:</strong><br />
                  Gold and silver coins sitting in cash registers and pockets act like those heavy dirt roads on the ground—they are valuable capital locked up in dead pavement just to carry out trade. When paper money replaces gold coins in daily domestic trade, it acts like the "wagon-way in the air." It frees up 80% of the nation's gold coin reserve. Society can now send that idle gold abroad to buy manufacturing tools, factory equipment, raw iron, and food—turning dead coin metal into active, income-generating productive capital!
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-amber-800">
                    🏛️ Modern Economics & Central Bank Mapping: Dematerialization, Digital Payments (LKP/UPI/SWIFT) & Central Bank Efficiency
                  </div>
                  <p className="italic text-slate-700">
                    In modern central banking, this mapping has evolved even further: moving from physical gold to paper notes was the first "wagon-way in the air." Moving from paper currency to <strong>electronic digital money, instant interbank clearing networks, Real-Time Gross Settlement (RTGS), and Central Bank Digital Currencies (CBDCs)</strong> is the modern equivalent. Printing, securing, transporting, and armored-car guarding of paper currency costs central banks up to 1.5% of GDP per year. Digital payment rails free up that resource capital for productive investment across the nation.
                  </p>
                </div>
              </div>

              {/* SECTION 5 */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  5. How Freed-Up Gold Expands Industry: Capital Imports vs. Wasteful Luxuries
                </h2>

                <p>
                  When paper money replaces $800,000 worth of gold coins inside a country's internal trade, that $800,000 in gold metal becomes redundant at home. Domestic shoppers are happy using paper notes, so merchants send the excess gold coins abroad to trade with foreign countries.
                </p>

                <p>
                  Adam Smith warns that the national impact of this exported gold depends entirely on what the country buys with it:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-slate-800 font-sans text-sm">
                  <li>
                    <strong className="text-emerald-800 font-serif">Productive Capital Goods (The Good Path):</strong> If merchants export gold to import foreign machinery, tools, raw cotton, iron, and timber, they hire industrious workers, construct factories, expand agriculture, and permanently increase future national output and jobs.
                  </li>
                  <li>
                    <strong className="text-rose-800 font-serif">Unproductive Luxury Consumption (The Bad Path):</strong> If merchants export gold to import luxury items for immediate consumption (exotic wines, expensive silks, fine jewelry for wealthy idle elites), the gold leaves the country, the luxuries are consumed, and no permanent economic capacity remains behind.
                  </li>
                </ul>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-purple-800">
                    🏛️ Modern Economics & Central Bank Mapping: Foreign Currency Allocation & Capital Import vs Consumption Import
                  </div>
                  <p className="italic text-slate-700">
                    Today, developing nations and central banks face this exact trade-off when spending their <strong>Foreign Exchange (FX) Reserves (US Dollars, Euros)</strong>. When a country spends its foreign exchange reserves on capital goods (heavy machinery, solar power plants, technology, industrial raw materials), it increases productive capacity and future export earning potential. But when a country burns through FX reserves to subsidize luxury consumer imports or non-essential foreign goods, it triggers trade deficits and balance-of-payments vulnerability.
                  </p>
                </div>
              </div>

              {/* SECTION 6 - OVER ISSUANCE & SPECIE OUTFLOW */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  6. Over-Issuance of Money, Specie Drain, and the Law of Currency Overflow
                </h2>

                <p>
                  Can a government or bank print paper money without limit? Absolutely not.
                </p>

                <p>
                  Smith explains that a nation's domestic market acts like a water pipe or a container of a fixed size. The total amount of paper notes that can safely circulate in a country can never exceed the quantity of gold and silver coins that would naturally circulate if there were no paper money.
                </p>

                <p>
                  If an economy requires exactly <strong>$1 million in total currency</strong> to carry out its daily buying and selling of food, clothes, and tools, and greedy or careless banks print <strong>$1.8 million in paper notes</strong>, the channel of circulation overflows!
                </p>

                <p>
                  What happens to the excess $800,000 in paper notes?
                </p>

                <p>
                  1. The domestic market cannot absorb them because local goods and trade only require $1 million.<br />
                  2. Foreign merchants in other countries will not accept local paper banknotes as payment.<br />
                  3. Therefore, domestic citizens and merchants holding excess paper notes rush straight to the issuing banks, demand physical gold coins in exchange for paper, and immediately export the gold out of the country to pay for foreign imports or store wealth safely abroad!
                </p>

                <p>
                  As a result, a bank that prints paper money beyond real economic demand suffers an immediate, devastating drain on its gold reserves, risking immediate bankruptcy.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-rose-800">
                    🏛️ Modern Central Bank Mapping: Money Over-Supply, Import Spikes & Central Bank FX Reserve Depletion
                  </div>
                  <p className="italic text-slate-700">
                    This is the exact mechanism of a modern <strong>Balance of Payments Crisis and Foreign Exchange Reserve Drain</strong>. When a modern central bank prints excess domestic currency (e.g., printing LKR, ARS, or ZWL to finance government deficits), citizens and businesses end up with excess domestic liquidity. Because foreign exporters will not accept domestic paper currency, domestic importers take their local currency to the Central Bank or Forex market to exchange it for US Dollars (USD) to buy foreign goods (fuel, food, electronics). The Central Bank's <strong>Foreign Exchange (FX) Reserves shrink rapidly toward zero</strong>.
                  </p>
                </div>
              </div>

              {/* SECTION 7 - PRUDENT BANKING / REAL BILLS DOCTRINE */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  7. Prudent Banking: The "Real Bills Doctrine" and the Water Pond Metaphor
                </h2>

                <p>
                  To protect itself from gold reserve drains, a bank must strictly follow disciplined lending practices. Smith introduces the <strong>"Real Bills Doctrine"</strong>: banks should only lend money on short-term real commercial bills of exchange drawn by genuine merchants for actual goods moving to market, payable in 30, 60, or 90 days.
                </p>

                <p>
                  <strong>The Water Pond Metaphor:</strong><br />
                  A bank's gold vault resembles a water pond. Money flows out of the pond when the bank issues loans to merchants. Money flows back into the pond when merchants sell their goods in 60 days and repay their loans with interest in gold cash.
                </p>

                <p>
                  If a bank lends only to real merchants for short-term trade, the water level in the pond stays constant naturally.
                </p>

                <p>
                  However, if a bank lends money to long-term real estate speculators or distant high-risk projects whose returns won't come back for years, water flows out of the pond continuously while nothing flows back in. The pond dries up, and the bank must spend enormous sums buying gold emergency reserves at exorbitant market prices to stay solvent.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-cyan-800">
                    🏛️ Modern Economics & Central Bank Mapping: Asset-Liability Matching & Commercial Credit Quality
                  </div>
                  <p className="italic text-slate-700">
                    In modern commercial and central banking, this is known as <strong>Asset-Liability Duration Matching and Credit Risk Management</strong>. When commercial banks fund long-term illiquid real estate or speculative assets using short-term customer deposits (duration mismatch), any economic shock triggers a liquidity crisis or bank failure (as seen in the Silicon Valley Bank collapse of 2023). Central banks mandate strict liquidity coverage ratios (LCR) and net stable funding ratios (NSFR) to prevent pond-drying liquidity crunches.
                  </p>
                </div>
              </div>

              {/* SECTION 8 - FINANCIAL SPECULATION, JOHN LAW & CURRENCY CRISES */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  8. Financial Schemes, "Drawing & Redrawing", John Law's Crash, and Currency Depreciation
                </h2>

                <p>
                  Adam Smith exposes how desperate speculators trick banks when legitimate short-term credit runs dry. Speculators invent the fraudulent scheme of <strong>"Drawing and Redrawing"</strong>: writing fictitious bills of exchange back and forth between accomplice merchants in different cities (e.g. London and Edinburgh) to trick banks into continuously renewing bad loans, creating artificial debt bubbles.
                </p>

                <p>
                  <strong>John Law and the Mississippi Bubble (1716–1720):</strong><br />
                  Adam Smith presents a detailed critique of <strong>John Law</strong>, a Scottish gambler and economist who persuaded the King of France that paper currency could be printed in unlimited quantities if "backed by the value of all land and colonial trade in France".
                </p>

                <p>
                  Law established the Royal Bank of France and issued mountains of unbacked paper notes while pumping up shares in the Mississippi Company. When the French public realized that the printed paper notes far exceeded the actual gold reserves and real production of France, panic erupted.
                </p>

                <p>
                  Noteholders rushed to turn in paper notes for real gold. The French monetary system collapsed, paper notes became worthless trash, stock prices fell by 99%, and thousands of French families were financially ruined.
                </p>

                {/* MODERN CENTRAL BANK MAPPING & CURRENCY CRISIS */}
                <div className="bg-amber-50 border-l-4 border-amber-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-900 rounded-r space-y-2 shadow-md">
                  <div className="font-bold text-amber-950 uppercase font-mono text-xs flex items-center gap-1">
                    ⚠️ Modern Central Bank Mapping: Currency Crises, Artificial Pegs, and Exchange Rate Depreciation
                  </div>
                  <p className="italic text-slate-800">
                    <strong>How John Law's Scheme Maps to Modern Currency Crashes:</strong><br />
                    John Law's Mississippi crisis is the exact historical template for modern <strong>hyperinflation, currency depreciation, and foreign exchange collapses</strong> (such as Weimar Germany 1923, Zimbabwe 2008, Argentina, or Sri Lanka 2022).
                  </p>
                  <p className="italic text-slate-800">
                    When a modern Central Bank prints money to fund government deficits while attempting to fix or peg the exchange rate (e.g., claiming 1 USD = 200 domestic currency units), the following economic chain reaction occurs:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 italic text-slate-800 text-xs">
                    <li><strong>Excess Domestic Liquidity:</strong> Domestic paper currency floods the market while real productive output remains stagnant.</li>
                    <li><strong>FX Reserve Depletion:</strong> Citizens and importers try to dump the over-printed domestic currency to buy US Dollars or gold. The Central Bank burns its foreign reserves trying to defend the exchange rate peg.</li>
                    <li><strong>Reserve Exhaustion & Peg Collapse:</strong> When Central Bank foreign exchange reserves hit ZERO, the central bank can no longer defend the currency. The exchange rate peg breaks!</li>
                    <li><strong>Severe Currency Depreciation:</strong> The exchange rate plunges overnight (e.g., from 200 per USD to 360+ per USD). Imported food, fuel, medicine, and fertilizer prices skyrocket (imported inflation).</li>
                    <li><strong>Loss of Faith in Fiat:</strong> Just as in John Law's France, when people lose faith in a unbacked paper currency, velocity spikes, panic buying ensues, and the real purchasing power of savings is wiped out.</li>
                  </ol>
                </div>
              </div>

              {/* SECTION 9 - CENTRAL BANKING & BANK OF ENGLAND */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  9. Central Banking and the Vulnerabilities of the Bank of England
                </h2>

                <p>
                  Adam Smith analyzes the <strong>Bank of England</strong> (founded in 1694), describing it as the greatest bank of circulation in Europe and the core foundation of British government credit. By advancing loans to the British state during wars, the stability of the Bank of England became indistinguishable from the British nation itself.
                </p>

                <p>
                  However, Smith demonstrates that even the mighty Bank of England made costly monetary errors. When the Bank allowed its paper notes to over-circulate, noteholders turned in paper notes for gold coins.
                </p>

                <p>
                  To replenish its gold vault, the Bank was forced to purchase raw gold bullion on the open market at high emergency prices (e.g. <strong>£4 0s 0d per ounce</strong>) and mint it into official coins at the legal rate of <strong>£3 17s 10½d per ounce</strong>—taking a heavy direct loss on every single coin it minted! Melting down coins and re-minting them became a foolish cycle because excess paper notes kept driving gold straight back out of the country.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-indigo-800">
                    🏛️ Modern Economics & Central Bank Mapping: Central Bank Losses & Sterilization Operations
                  </div>
                  <p className="italic text-slate-700">
                    In modern central banking, this maps to <strong>Unprofitable Foreign Exchange Interventions and Central Bank Balance Sheet Impairment</strong>. When a modern central bank buys foreign currency at high market rates or pays high interest rates on central bank securities (SDBs/OBBs) to mop up excess domestic liquidity ("sterilization"), it incurs heavy operational losses. If central bank capital turns negative, public confidence in monetary policy weakens, forcing interest rates higher to stabilize the currency.
                  </p>
                </div>
              </div>

              {/* SECTION 10 - BANKING REGULATION & PARTY WALLS */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-slate-900 font-serif border-b-2 border-amber-500/40 pb-2 text-amber-900 mt-8">
                  10. Banking Regulations & The "Party Wall" Safety Principle
                </h2>

                <p>
                  Finally, Adam Smith confronts a fundamental free-market question: <em>"If Adam Smith advocates free trade, why does he support strict government regulation of commercial banks?"</em>
                </p>

                <p>
                  Free-market purists argue that restricting bankers from issuing small paper notes (like £1 or 5-shilling notes) violates natural liberty and freedom of contract.
                </p>

                <p>
                  Adam Smith delivers his famous defense of banking regulation:
                </p>

                <div className="bg-sky-50 border-l-4 border-sky-600 p-4 my-3 font-sans text-sm text-sky-950 rounded-r shadow-inner">
                  <p className="font-semibold italic">
                    "The obligation of building party walls, in order to prevent the communication of fire, is a violation of natural liberty exactly of the same kind with the regulations of the banking trade here proposed."
                  </p>
                </div>

                <p>
                  <strong>The Building Firewall Metaphor:</strong><br />
                  A city fire law requiring homeowners to build thick brick "party walls" between row houses restricts what a person can do on their private property. However, if a careless homeowner builds a flimsy house that catches fire, the entire city burns down!
                </p>

                <p>
                  Therefore, limiting the freedom of a few reckless individuals is completely justified to protect the safety of the entire society. In banking, allowing wildcat banks to issue uncontrolled paper notes threatens catastrophic financial contagion, bank panics, and national economic collapse.
                </p>

                {/* MODERN CENTRAL BANK MAPPING */}
                <div className="bg-slate-100 border-l-4 border-slate-700 p-4 my-3 font-sans text-xs sm:text-sm text-slate-800 rounded-r space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 uppercase font-mono text-xs text-emerald-900">
                    🏛️ Modern Economics & Central Bank Mapping: Basel III Accord, Systemic Risk, FDIC & Prudential Supervision
                  </div>
                  <p className="italic text-slate-700">
                    Adam Smith's "Party Wall" principle is the direct intellectual origin of modern <strong>Macro-Prudential Financial Regulation, Basel III Capital Adequacy Frameworks, Systemically Important Financial Institution (SIFI) Rules, and FDIC Deposit Insurance</strong>. Modern central banks restrict bank leverage, mandate minimum Tier-1 capital ratios, enforce stress testing, and limit high-risk speculative exposures precisely because a bank collapse is not a private failure—it creates systemic risk that can destroy the savings of millions and wreck the real economy.
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-slate-900 pt-6 mt-10 text-center text-xs font-mono text-slate-600 space-y-1">
                <div>End of Chapter II (Book II) Comprehensive Plain English Translation & Modern Central Banking Bridge</div>
                <div className="text-amber-800 font-bold">LankaEcon Economics Masterclass Series • Wealth of Nations (1776)</div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KEY TAKEAWAYS & CORE LESSONS */}
      {activeTab === 'summary_ai' && (
        <div className="space-y-6 relative z-10">
          <div className="bg-slate-900/90 border-2 border-amber-400/60 p-5 sm:p-6 rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm uppercase tracking-wider">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>Central Banking Lessons for Modern Policy</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              How Adam Smith's 1776 principles directly govern modern central banks like the Central Bank of Sri Lanka, the Federal Reserve, and the Bank of England today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#091527] border border-slate-700 p-5 rounded-xs space-y-2">
              <span className="text-sky-400 font-mono text-xs font-bold uppercase">LESSON 1</span>
              <h4 className="font-serif text-base font-bold text-white">Money is a Tool, Not Real Wealth</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Printing central bank money does not create real goods. Real wealth comes from agriculture, factories, education, software, and human labor.
              </p>
            </div>

            <div className="bg-[#091527] border border-slate-700 p-5 rounded-xs space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase">LESSON 2</span>
              <h4 className="font-serif text-base font-bold text-white">The Limits of Credit Creation</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Banks can safely lend against real commercial short-term transactions ("Real Bills"), but unbacked long-term speculative loans cause inflation and systemic failure.
              </p>
            </div>

            <div className="bg-[#091527] border border-slate-700 p-5 rounded-xs space-y-2">
              <span className="text-rose-400 font-mono text-xs font-bold uppercase">LESSON 3</span>
              <h4 className="font-serif text-base font-bold text-white">Foreign Exchange Reserve Drains</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                When domestic money is over-printed, citizens convert excess cash into foreign currency to import goods, triggering an immediate drain on foreign reserves.
              </p>
            </div>

            <div className="bg-[#091527] border border-slate-700 p-5 rounded-xs space-y-2">
              <span className="text-emerald-400 font-mono text-xs font-bold uppercase">LESSON 4</span>
              <h4 className="font-serif text-base font-bold text-white">Prudential Banking Safeguards</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Just like firewalls between houses, central bank reserve requirements and capital adequacy ratios protect innocent depositors from bank run contagion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 relative z-10">
          <div className="bg-[#091527] border border-slate-700 p-6 rounded-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-serif text-lg font-extrabold text-amber-300 uppercase">
                  Adam Smith Monetary Mechanics Quiz
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  Test your grasp of Book II, Chapter 2 principles on banking, gross revenue, and money velocity.
                </p>
              </div>
              {quizSubmitted && (
                <div className="bg-amber-400 text-slate-950 font-mono text-xs font-black px-3 py-1.5 rounded-xs border border-amber-500 shadow-xs">
                  SCORE: {calculateScore()} / {quizQuestions.length}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div key={qIdx} className="bg-slate-950 border border-slate-800 p-4 rounded-xs space-y-3">
                    <p className="font-serif font-bold text-xs sm:text-sm text-amber-200">
                      Q{qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700';
                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950 text-emerald-200 border-emerald-500 font-bold';
                          } else if (selectedOpt === optIdx && !isCorrect) {
                            btnStyle = 'bg-rose-950 text-rose-200 border-rose-500';
                          }
                        } else if (selectedOpt === optIdx) {
                          btnStyle = 'bg-sky-950 text-sky-200 border-sky-500 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                              }
                            }}
                            className={`w-full text-left p-3 text-xs font-sans border transition cursor-pointer flex items-center justify-between rounded-xs ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3 text-xs font-mono border rounded-xs ${isCorrect ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500' : 'bg-rose-950/80 text-rose-200 border-rose-500'}`}>
                        <span className="font-bold uppercase block mb-1">
                          {isCorrect ? '✓ CORRECT ANSWER' : '✗ INCORRECT'}
                        </span>
                        <p className="font-sans text-xs text-slate-200">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-3 pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length === 0}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-black px-6 py-3 uppercase tracking-wider transition cursor-pointer disabled:opacity-50 rounded-xs shadow-md"
                  >
                    Submit Answers & Check Mastery
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold px-4 py-2.5 uppercase tracking-wider transition cursor-pointer rounded-xs border border-slate-700"
                  >
                    Reset Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
