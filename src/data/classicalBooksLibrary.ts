import { BookPage } from '../types';

export interface BookLibraryDetails {
  subtitle: string;
  volumeLabel: string;
  keyTopics: {
    title: string;
    description: string;
  }[];
  tableOfContents: {
    chapterNumber: string;
    title: string;
    summary: string;
    pageStart?: number;
    pageEnd?: number;
  }[];
  previewExcerpt: {
    chapterTitle: string;
    sectionTitle: string;
    quote?: string;
    paragraphs: string[];
    keyFormula?: string;
  };
  samplePages: BookPage[];
}

export const CLASSICAL_BOOKS_DATA: Record<string, BookLibraryDetails> = {
  'book-class-001': {
    subtitle: 'The Division of Labour, Capital Accumulation & The Invisible Hand',
    volumeLabel: '950 Pages • 5 Books Complete',
    keyTopics: [
      {
        title: 'The Division of Labour',
        description: 'Examines how specialization and division of tasks in manufacturing exponentially multiplies human labor productivity and national wealth.',
      },
      {
        title: 'The Invisible Hand & Market Coordination',
        description: 'Demonstrates how individuals pursuing their self-interest in competitive markets inadvertently promote societal welfare more effectively than conscious planning.',
      },
      {
        title: 'Origins & Functions of Money',
        description: 'Analyzes money as the universal instrument of commerce overcoming the inconveniences of barter, distinguishing between nominal and real price of commodities.',
      },
      {
        title: 'Critique of Mercantilism',
        description: 'Refutes the mercantilist fallacy that wealth consists in hoarding gold bullion, arguing that real wealth consists in the annual produce of land and labor.',
      },
    ],
    tableOfContents: [
      {
        chapterNumber: 'Book I',
        title: 'Of the Causes of Improvement in the Productive Powers of Labour',
        summary: 'Division of labour, origin of money, component parts of price, wages of labour, profits of stock, and rent of land.',
        pageStart: 1,
        pageEnd: 260,
      },
      {
        chapterNumber: 'Book II',
        title: 'Of the Nature, Accumulation, and Employment of Stock',
        summary: 'Division of capital stock, money as a particular branch of general stock, productive vs unproductive labour, and loanable funds.',
        pageStart: 261,
        pageEnd: 380,
      },
      {
        chapterNumber: 'Book III',
        title: 'Of the Different Progress of Opulence in Different Nations',
        summary: 'Natural progress of opulence, discouragement of agriculture in post-feudal Europe, and the rise of commercial cities.',
        pageStart: 381,
        pageEnd: 440,
      },
      {
        chapterNumber: 'Book IV',
        title: 'Of Systems of Political Oeconomy (The Mercantile System)',
        summary: 'Principles of the commercial/mercantile system, restraints upon importation, bounties, treaties of commerce, and colonies.',
        pageStart: 441,
        pageEnd: 680,
      },
      {
        chapterNumber: 'Book V',
        title: 'Of the Revenue of the Sovereign or Commonwealth',
        summary: 'Expenses of defense and justice, public works, education, canons of fair taxation, and public debts.',
        pageStart: 681,
        pageEnd: 950,
      },
    ],
    previewExcerpt: {
      chapterTitle: 'BOOK I, CHAPTER I: Of the Division of Labour',
      sectionTitle: 'The Pin Factory & The Foundations of Productivity',
      quote: 'It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own self-interest.',
      paragraphs: [
        'The greatest improvement in the productive powers of labour, and the greater part of the skill, dexterity, and judgment with which it is anywhere directed, or applied, seem to have been the effects of the division of labour.',
        'To take an example, therefore, from a very trifling manufacture; but one in which the division of labour has been very often taken notice of, the trade of the pin-maker: a workman not educated to this business, nor acquainted with the use of the machinery employed in it, could scarce, perhaps, with his utmost industry, make one pin in a day, and certainly could not make twenty.',
        'But in the way in which this business is now carried on, not only the whole work is a peculiar trade, but it is divided into a number of branches, of which the greater part are likewise peculiar trades. One man draws out the wire, another straights it, a third cuts it, a fourth points it, a fifth grinds it at the top for receiving the head; to make the head requires two or three distinct operations; to put it on, is a peculiar business, to whiten the pins is another; it is even a trade by itself to put them into the paper.',
        'In this manner, dividing the manufacture into eighteen distinct operations, ten persons could make among them upwards of forty-eight thousand pins in a day. Each person, therefore, making a tenth part of forty-eight thousand pins, might be considered as making four thousand eight hundred pins in a day.',
      ],
      keyFormula: 'Total Produce = Labor Specialization Factor × Tools & Technology × Quantity of Labor',
    },
    samplePages: [
      {
        pageNumber: 1,
        chapterTitle: 'Frontispiece & Introduction',
        partTitle: 'The Wealth of Nations (1776)',
        content: `### An Inquiry into the Nature and Causes of the Wealth of Nations
**By Adam Smith, LL.D. and F.R.S.**

*Formerly Professor of Moral Philosophy in the University of Glasgow*

---

#### General Introduction and Plan of the Work
The annual labour of every nation is the fund which originally supplies it with all the necessaries and conveniences of life which it annually consumes, and which consist always either in the immediate produce of that labour, or in what is purchased with that produce from other nations.

According therefore, as this produce, or what is purchased with it, bears a greater or smaller proportion to the number of those who are to consume it, the nation will be better or worse supplied with all the necessaries and conveniences for which it has occasion.

This proportion must in every nation be regulated by two different circumstances:
1. First, by the skill, dexterity, and judgment with which its labour is generally applied; and,
2. Secondly, by the proportion between the number of those who are employed in useful labour, and that of those who are not so employed.`,
      },
      {
        pageNumber: 2,
        chapterTitle: 'Chapter I: Of the Division of Labour',
        partTitle: 'Book I: Productive Powers of Labour',
        content: `### Book I • Chapter I: The Pin Factory Example

The greatest improvement in the productive powers of labour, and the greater part of the skill, dexterity, and judgment with which it is anywhere directed, or applied, seem to have been the effects of the division of labour.

The effects of the division of labour, in the general business of society, will be more easily understood, by considering in what manner it operates in some particular manufactures.

> *"One man draws out the wire, another straights it, a third cuts it, a fourth points it, a fifth grinds it at the top for receiving the head; to make the head requires two or three distinct operations; to put it on, is a peculiar business, to whiten the pins is another; it is even a trade by itself to put them into the paper."*

I have seen a small manufactory of this kind where ten men only were employed, and where some of them consequently performed two or three distinct operations. But though they were very poor, and therefore but indifferently accommodated with the necessary machinery, they could, when they exerted themselves, make among them about twelve pounds of pins in a day.`,
        keyFormula: 'Output per Worker = Aggregate Output / Specialized Task Hours',
      },
      {
        pageNumber: 3,
        chapterTitle: 'Chapter II: The Propensity to Truck, Barter, and Exchange',
        partTitle: 'Book I: Productive Powers of Labour',
        content: `### Book I • Chapter II: Mutual Exchange & Social Coordination

This division of labour, from which so many advantages are derived, is not originally the effect of any human wisdom, which foresees and intends that general opulence to which it gives occasion.

It is the necessary, though very slow and gradual, consequence of a certain propensity in human nature which has in view no such extensive utility; the propensity to truck, barter, and exchange one thing for another.

Whether this propensity be one of those original principles in human nature, of which no further account can be given; or whether, as seems more probable, it be the necessary consequence of the faculties of reason and speech, it belongs not to our present subject to enquire.

> *"It is not from the benevolence of the butcher, the brewer, or the baker, that we expect our dinner, but from their regard to their own interest. We address ourselves, not to their humanity but to their self-love, and never talk to them of our own necessities but of their advantages."*`,
      },
      {
        pageNumber: 4,
        chapterTitle: 'Book IV • Chapter II: The Invisible Hand',
        partTitle: 'Book IV: Systems of Political Oeconomy',
        content: `### Book IV • Chapter II: Restraints upon Importation & Domestic Industry

Every individual is continually exerting himself to find out the most advantageous employment for whatever capital he can command. It is his own advantage, indeed, and not that of the society, which he has in view. But the study of his own advantage naturally, or rather necessarily leads him to prefer that employment which is most advantageous to the society.

By preferring the support of domestic to that of foreign industry, he intends only his own security; and by directing that industry in such a manner as its produce may be of the greatest value, he intends only his own gain.

> *"He intends only his own gain, and he is in this, as in many other cases, led by an invisible hand to promote an end which was no part of his intention. Nor is it always the worse for the society that it was no part of it. By pursuing his own interest he frequently promotes that of the society more effectually than when he really intends to promote it."*`,
      },
    ],
  },

  'book-class-002': {
    subtitle: 'A Description of the Money Market & The Lender of Last Resort',
    volumeLabel: '320 Pages • Classic Central Banking Treatise',
    keyTopics: [
      {
        title: 'Bagehot’s Dictum for Liquidity Crises',
        description: 'The golden rule of central banking: in a financial panic, the central bank must lend freely, at a penalty rate of interest, against good and solvent collateral.',
      },
      {
        title: 'The Constitution of the Money Market',
        description: 'Meticulous dissection of the bill brokers, commercial joint-stock banks, and the central reserve held at the Bank of England.',
      },
      {
        title: 'The One-Reserve System',
        description: 'Exposes the structural vulnerability of the British financial architecture, where all private banks held minimal reserves and relied entirely on the Bank of England.',
      },
      {
        title: 'Psychology of Financial Panics',
        description: 'Explores how monetary apprehension turns into infectious dread, and why prompt, bold lending is the only mechanism capable of arresting an internal bank run.',
      },
    ],
    tableOfContents: [
      {
        chapterNumber: 'Chapter I',
        title: 'A General View of Lombard Street',
        summary: 'The scale of English loanable capital and how Lombard Street coordinates global commerce.',
        pageStart: 1,
        pageEnd: 42,
      },
      {
        chapterNumber: 'Chapter II',
        title: 'Why Lombard Street is Often Dull, and Sometimes Excited',
        summary: 'The cyclical nature of trade, confidence, credit expansion, and panic impulses.',
        pageStart: 43,
        pageEnd: 84,
      },
      {
        chapterNumber: 'Chapter III',
        title: 'The Position of the Bank of England',
        summary: 'The Bank of England as keeper of the ultimate reserve and the duty of the Banking Department.',
        pageStart: 85,
        pageEnd: 136,
      },
      {
        chapterNumber: 'Chapter IV–VII',
        title: 'The Management of Banking Reserves & Bagehot’s Rule',
        summary: 'Lending freely at a high rate; distinguishing between illiquidity and insolvency.',
        pageStart: 137,
        pageEnd: 220,
      },
      {
        chapterNumber: 'Chapter VIII–XIII',
        title: 'The Bill-Brokers, Private Banks, and Joint Stock Banking',
        summary: 'Operational structure of the London discount market and institutional governance.',
        pageStart: 221,
        pageEnd: 320,
      },
    ],
    previewExcerpt: {
      chapterTitle: 'CHAPTER VII: A More Exact Account of the Bank of England Reserve',
      sectionTitle: 'Bagehot’s Rule: The Doctrine of Free Lending in Panics',
      quote: 'A panic, in a word, is a species of neuralgia, and according to the rules of science you must not starve it. The holders of the cash reserve must lend not only freely, but boldly, so that the public may feel that there is no danger of exhaustion.',
      paragraphs: [
        'The cardinal method of abating a panic is by an advance of money. In wild excitement, when credit is suddenly stopped, all merchants and bankers want money, and they want it at once. What is wanted is to reassure the public mind, and this can only be done by showing that money can be had on application.',
        'First, that these advances should only be made at a very high rate of interest. This will operate as a heavy fine on unreasonable timidity, and will prevent firms from borrowing more than they really require.',
        'Secondly, that at this rate these advances should be made on all good banking securities, and as largely as the public ask for them. The object is to stay alarm, and the dread that, though your securities are good, you cannot buy money with them.',
        'If it is known that the Bank of England will advance freely on good security, the panic will subside; but if there is any doubt about its doing so, the alarm will intensify, and the cash reserve will be exhausted in a few hours.',
      ],
      keyFormula: 'Emergency Liquidity Injection = f(Solvent Collateral) @ Penalty Rate (r > r_market)',
    },
    samplePages: [
      {
        pageNumber: 1,
        chapterTitle: 'Introductory: The Scale of Lombard Street',
        partTitle: 'Lombard Street (1873)',
        content: `### Lombard Street: A Description of the Money Market
**By Walter Bagehot**

---

#### Chapter I: A General View of Lombard Street

The objects which you see in Lombard Street, and in that money world which revolves around it, are the most extraordinary in the world. 

There is no other place where so much credit is organized into such compact machinery, or where so enormous an amount of loanable capital is instantly available.

The distinctive peculiarity of English banking is the smallness of the cash reserve compared with the gigantic liabilities. Other nations have large reserves and modest liabilities; England has an immense superstructure of credit erected upon a tiny pivot of bullion held in the vaults of the Bank of England.

This "One-Reserve System" makes the money market singularly sensitive and prone to sudden convulsions whenever that central store is threatened.`,
      },
      {
        pageNumber: 2,
        chapterTitle: 'Chapter VII: Bagehot’s Rule',
        partTitle: 'Lombard Street (1873)',
        content: `### Chapter VII • The Proper Management of a Panic

When a panic arrives, what should the Bank of England do?

History demonstrates that hesitating, contracting, or refusing accommodation during a panic guarantees total disaster.

> *"Lend freely, boldly, and at a penalty rate of interest, against all good banking securities."*

- **Lend Freely:** Any appearance of hesitation or reluctance by the Bank will accelerate the panic, driving sound merchants and banks into insolvency.
- **At a High Rate:** The rate of interest must be high enough to deter speculative borrowing and ensure that only those who genuinely require funds will step forward.
- **Against Good Collateral:** Advances must never be made on rotten or insolvent paper, but any merchant presenting sound bills or government stock must receive gold without question.`,
        keyFormula: 'Bagehot Rule: Advances = Full Collateral Value | Interest Rate = Penalty Tier',
      },
    ],
  },

  'book-class-003': {
    subtitle: 'Aggregate Demand, Liquidity Preference & The Multiplier',
    volumeLabel: '430 Pages • The Macroeconomic Revolution',
    keyTopics: [
      {
        title: 'The Principle of Effective Demand',
        description: 'Demonstrates that output and employment are determined where aggregate demand price equals aggregate supply price, refuting Say’s Law that supply creates its own demand.',
      },
      {
        title: 'Liquidity Preference & The Rate of Interest',
        description: 'Formulates interest as the reward for parting with liquidity rather than saving, identifying transaction, precautionary, and speculative motives for holding cash.',
      },
      {
        title: 'The Marginal Propensity to Consume & The Multiplier',
        description: 'Establishes how an initial autonomous investment expenditure multiplies through the economy depending on consumer spending habits.',
      },
      {
        title: 'The Liquidity Trap & Underemployment Equilibrium',
        description: 'Explains why monetary policy loses traction when interest rates hit the floor, requiring proactive fiscal expansion to restore full employment.',
      },
    ],
    tableOfContents: [
      {
        chapterNumber: 'Book I',
        title: 'Introduction & The Classical Postulates',
        summary: 'Critique of classical wage flexibility and the principle of effective demand.',
        pageStart: 1,
        pageEnd: 40,
      },
      {
        chapterNumber: 'Book II',
        title: 'Definitions and Ideas',
        summary: 'The choice of units, expectation as determining output, and definitions of income, saving, and investment.',
        pageStart: 41,
        pageEnd: 84,
      },
      {
        chapterNumber: 'Book III',
        title: 'The Propensity to Consume',
        summary: 'Objective and subjective factors; the marginal propensity to consume and the investment multiplier.',
        pageStart: 85,
        pageEnd: 134,
      },
      {
        chapterNumber: 'Book IV',
        title: 'The Inducement to Invest',
        summary: 'Marginal efficiency of capital, liquidity preference, the rate of interest, and radical uncertainty.',
        pageStart: 135,
        pageEnd: 256,
      },
      {
        chapterNumber: 'Book V–VI',
        title: 'Money-Wages, Prices & Social Philosophy',
        summary: 'Wage rigidity, notes on the trade cycle, mercantilism, and state guidance of investment.',
        pageStart: 257,
        pageEnd: 430,
      },
    ],
    previewExcerpt: {
      chapterTitle: 'BOOK I, CHAPTER 3: The Principle of Effective Demand',
      sectionTitle: 'Refuting Say’s Law: The Duality of Aggregate Demand & Supply',
      quote: 'The ideas of economists and political philosophers, both when they are right and when they are wrong, are more powerful than is commonly understood. Indeed the world is ruled by little else.',
      paragraphs: [
        'The classical doctrine, embodied in Say’s Law, asserts that the whole of the costs of production must necessarily be spent in the aggregate, directly or indirectly, on purchasing the product. As a result, supply creates its own demand.',
        'This assumption is radically misleading. When employment increases, aggregate real income is increased. The psychology of the community is such that when aggregate real income is increased, aggregate consumption is increased, but not by so much as income.',
        'Hence employers would make a loss if the whole of the increased employment were to be devoted to satisfying the increased demand for immediate consumption. Thus, to justify any given amount of employment there must be an amount of current investment sufficient to absorb the excess of total output over what the community chooses to consume.',
      ],
      keyFormula: 'Y = C + I + G + (X - M) | Investment Multiplier k = 1 / (1 - MPC)',
    },
    samplePages: [
      {
        pageNumber: 1,
        chapterTitle: 'Chapter 1: The General Theory',
        partTitle: 'The General Theory (1936)',
        content: `### The General Theory of Employment, Interest and Money
**By John Maynard Keynes**

---

#### Chapter 1: The Scope of the Work

I have called this book the *General Theory of Employment, Interest and Money*, placing the emphasis on the prefix *General*. 

The object of such a title is to contrast the character of my arguments and conclusions with those of the classical theory of the subject, upon which I was brought up and which dominates the economic thought, both practical and theoretical, of the governing and academic classes of this generation.

I shall argue that the postulates of the classical theory are applicable to a special case only and not to the general case, the situation which it assumes being a limiting point of the possible positions of equilibrium. 

Moreover, the characteristics of the special case assumed by the classical theory happen not to be those of the economic society in which we actually live, with the result that its teaching is misleading and disastrous if we attempt to apply it to the facts of experience.`,
      },
      {
        pageNumber: 2,
        chapterTitle: 'Chapter 3: The Principle of Effective Demand',
        partTitle: 'Book I: Introduction',
        content: `### Chapter 3 • The Core Theorem of Effective Demand

The lines of argument may be summarized as follows:

1. In a given state of technique, resources and costs, employment $N$ depends upon the volume of aggregate demand $D$.
2. Aggregate income is divided between Consumption $C$ and Investment $I$: $Y = C + I$.
3. When employment increases, income increases, and consumption increases, but by less than income ($0 < \\frac{dC}{dY} < 1$).
4. Therefore, to sustain employment, new investment $I$ must fill the gap between output and consumption.
5. In an unregulated market, there is no automatic mechanism ensuring that the rate of investment equals the volume required for full employment.

Hence, an economy can settle into a chronic underemployment equilibrium.`,
        keyFormula: 'Effective Demand Equilibrium: Y* where Aggregate Demand = Aggregate Supply',
      },
    ],
  },

  'book-class-004': {
    subtitle: 'Comparative Advantage, Differential Rent & Tax Incidence',
    volumeLabel: '350 Pages • Foundational Classical Treatise',
    keyTopics: [
      {
        title: 'The Law of Comparative Advantage',
        description: 'The monumental theorem demonstrating that mutually beneficial trade occurs whenever nations specialize where their opportunity cost is lowest, even if one nation holds an absolute advantage in all goods.',
      },
      {
        title: 'The Theory of Differential Rent',
        description: 'Demonstrates that agricultural rent arises from differences in the natural fertility of soil and the margin of cultivation, proving that rent does not enter into the composition of price.',
      },
      {
        title: 'Distribution of National Produce',
        description: 'Examines the fundamental conflict between landlords (rent), capitalists (profit), and laborers (wages) over the distribution of economic surplus.',
      },
      {
        title: 'The Ingot Plan & Sound Money',
        description: 'Advocated for paper currency convertibility into standard gold ingots rather than circulating gold coins, establishing the blueprint for modern reserve backing.',
      },
    ],
    tableOfContents: [
      {
        chapterNumber: 'Chapter I',
        title: 'On Value & Relative Prices',
        summary: 'Determination of exchange value by the quantity of labor embodied in commodities.',
        pageStart: 1,
        pageEnd: 60,
      },
      {
        chapterNumber: 'Chapter II–III',
        title: 'On Rent and Agricultural Margins',
        summary: 'Differential rent on fertile land and the extension of farming to marginal soils.',
        pageStart: 61,
        pageEnd: 98,
      },
      {
        chapterNumber: 'Chapter VII',
        title: 'On Foreign Trade (Comparative Advantage)',
        summary: 'The famous Portuguese wine and English cloth model of international specialization.',
        pageStart: 131,
        pageEnd: 174,
      },
      {
        chapterNumber: 'Chapter VIII–XXVI',
        title: 'On Taxation, Bounties, and Corn Laws',
        summary: 'Taxes on raw produce, wages, profits, and the incidence of tariffs on national welfare.',
        pageStart: 175,
        pageEnd: 310,
      },
      {
        chapterNumber: 'Chapter XXVII–XXXII',
        title: 'On Currency and Banks',
        summary: 'Paper money issue, the Ingot Plan, and machinery’s effect on the working class.',
        pageStart: 311,
        pageEnd: 350,
      },
    ],
    previewExcerpt: {
      chapterTitle: 'CHAPTER VII: On Foreign Trade',
      sectionTitle: 'The Classical Demonstration of Comparative Advantage',
      quote: 'Under a system of perfectly free commerce, each country naturally devotes its capital and labour to such employments as are most beneficial to each. This pursuit of individual advantage is admirably connected with the universal good of the whole.',
      paragraphs: [
        'England may be so circumstanced, that to produce the cloth may require the labour of 100 men for one year; and if she attempted to make the wine, it might require the labour of 120 men for the same time.',
        'Portugal may be in such a condition that to produce the wine, it may require only the labour of 80 men for one year; and to produce the cloth, it might require the labour of 90 men.',
        'It would therefore be for the interest of Portugal to export wine in exchange for cloth. This exchange might even take place, notwithstanding that the commodity imported by Portugal could be produced there with less labour than in England.',
        'Though she could make the cloth with the labour of 90 men, she would import it from a country where it required the labour of 100 men to produce it, because it would be advantageous to her to employ her capital in the production of wine, for which she would obtain more cloth from England, than she could produce by diverting a portion of her capital from vines to the manufacture of cloth.',
      ],
      keyFormula: 'Opportunity Cost Ratio: (Cloth/Wine)_England < (Cloth/Wine)_Portugal => England Exports Cloth',
    },
    samplePages: [
      {
        pageNumber: 1,
        chapterTitle: 'Preface & Scope of Political Economy',
        partTitle: 'Principles of Political Economy (1817)',
        content: `### On the Principles of Political Economy and Taxation
**By David Ricardo**

---

#### Preface

The produce of the earth—all that is derived from its surface by the united application of labour, machinery, and capital, is divided among three classes of the community; namely, the proprietor of the land, the owner of the stock or capital necessary for its cultivation, and the labourers by whose industry it is cultivated.

To determine the laws which regulate this distribution—between Rent, Profit, and Wages—is the principal problem in Political Economy.

Much as the science has been improved by the writings of Turgot, Stuart, Smith, Say, Sismondi, and others, they afford very little satisfactory information respecting the natural course of rent, profit, and wages. To supply this deficiency, the present treatise is dedicated.`,
      },
      {
        pageNumber: 2,
        chapterTitle: 'Chapter VII: Comparative Advantage',
        partTitle: 'Principles of Political Economy (1817)',
        content: `### Chapter VII • On Foreign Trade

No extension of foreign trade will immediately increase the amount of value in a country, although it will very powerfully contribute to increase the mass of commodities, and therefore the sum of enjoyments.

> *"If Portugal can produce wine with 80 men and cloth with 90 men, while England produces wine with 120 men and cloth with 100 men, both nations gain if England specializes in cloth and Portugal in wine."*

Even though Portugal has an absolute advantage in both commodities, England holds a comparative advantage in cloth because its relative sacrifice (100/120 = 0.83) is lower than Portugal's relative sacrifice (90/80 = 1.125).

Thus, trade relies upon comparative, not absolute, cost advantages.`,
        keyFormula: 'Gains from Trade: Increased Aggregate Consumption Frontiers via Specialization',
      },
    ],
  },

  'book-class-005': {
    subtitle: 'The 75-Year Evolution of Sri Lankan Monetary Architecture',
    volumeLabel: '520 Pages • Official Historical & Policy Treatise',
    keyTopics: [
      {
        title: 'From Currency Board to Central Bank (1949–1950)',
        description: 'Examines the John Exter Report and the enactment of the Monetary Law Act No. 58 of 1949, replacing the automatic 100% sterling currency board with discretionary central banking.',
      },
      {
        title: 'Open Market Operations & The 1977 Transformation',
        description: 'Details the transition from rigid administrative price controls and multiple exchange rates to market-determined interest rates and trade liberalization.',
      },
      {
        title: 'The 2022 Crisis & Balance of Payments Rupture',
        description: 'In-depth historical accounting of reserve depletion, sovereign debt default, inflation surge to 70%, and exchange rate depreciation.',
      },
      {
        title: 'The Central Bank of Sri Lanka Act No. 16 of 2023',
        description: 'Comprehensive analysis of the modern legal framework: the single Overnight Policy Rate (OPR), prohibition of primary deficit monetization, and flexible inflation targeting.',
      },
    ],
    tableOfContents: [
      {
        chapterNumber: 'Part I',
        title: 'The Founding Era (1950–1960)',
        summary: 'The Exter Report, establishment of the Central Bank of Ceylon, and early sterling link.',
        pageStart: 1,
        pageEnd: 110,
      },
      {
        chapterNumber: 'Part II',
        title: 'The Closed Economy & Import Substitution (1960–1977)',
        summary: 'Exchange control regimes, dual exchange rates (FEECs), and fiscal dominance.',
        pageStart: 111,
        pageEnd: 220,
      },
      {
        chapterNumber: 'Part III',
        title: 'Financial Deregulation & Floating Rates (1977–2000)',
        summary: 'Market reforms, Treasury bond primary auction systems, and automated settlement.',
        pageStart: 221,
        pageEnd: 340,
      },
      {
        chapterNumber: 'Part IV',
        title: 'Monetary Policy Frameworks in the 21st Century (2001–2021)',
        summary: 'The journey toward Flexible Inflation Targeting, repo corridor adjustments, and FX reserves.',
        pageStart: 341,
        pageEnd: 440,
      },
      {
        chapterNumber: 'Part V',
        title: 'The 2022 Crisis, CBSL Act No. 16 of 2023 & The OPR Era',
        summary: 'Restructuring external debt, ending Treasury bill monetization, and single policy rate corridor.',
        pageStart: 441,
        pageEnd: 520,
      },
    ],
    previewExcerpt: {
      chapterTitle: 'PART V, CHAPTER 14: The Central Bank of Sri Lanka Act of 2023',
      sectionTitle: 'A New Institutional Anchor: De-politicizing Money Creation',
      quote: 'Price stability is the bedrock of social equity. Without permanent monetary discipline, all developmental gains are eventually washed away in the crucible of currency depreciation.',
      paragraphs: [
        'The passage of the Central Bank of Sri Lanka Act No. 16 of 2023 represents the most comprehensive legislative transformation of Sri Lanka’s monetary constitution since 1949.',
        'Foremost among its statutory guarantees is the legal prohibition against direct financing of the fiscal deficit (the ending of primary Treasury bill purchases), eliminating the historical driver of unsterilized rupee expansion.',
        'Furthermore, the Central Bank established a single policy rate—the Overnight Policy Rate (OPR)—to replace the legacy dual corridor of SDFR and SLFR, anchoring interbank money market expectations firmly to official policy stance.',
      ],
      keyFormula: 'Target Variable: CCPI Headline Inflation (5.0% ± 2.0%) via Policy Rate Corridor',
    },
    samplePages: [
      {
        pageNumber: 1,
        chapterTitle: 'Historical Introduction',
        partTitle: '75 Years of Central Banking in Sri Lanka (1950–2025)',
        content: `### 75 Years of Central Banking & Monetary Stance in Sri Lanka
**Official Publication of the Central Bank of Sri Lanka (CBSL)**

---

#### Commemorative Monograph • 1950 to 2025

On 28 August 1950, the Central Bank of Ceylon commenced operations, founded upon the visionary blueprint of American economist John Exter.

Exter sought to replace the rigid British colonial Currency Board with an institution possessing discretionary authority to adjust liquidity to seasonal trade demands and economic expansion.

Over the ensuing seven and a half decades, the Central Bank has operated across diverse macroeconomic regimes:
- The early fixed-exchange rate era (1950–1968)
- The Foreign Exchange Entitlement Certificate Scheme (FEECs) era (1968–1977)
- The Post-1977 trade liberalization and managed crawling peg era
- The modern Flexible Inflation Targeting (FIT) regime codified under Act No. 16 of 2023`,
      },
      {
        pageNumber: 2,
        chapterTitle: 'The 2023 CBSL Act & The Single Policy Rate',
        partTitle: '75 Years of Central Banking in Sri Lanka (1950–2025)',
        content: `### Modern Architecture: Act No. 16 of 2023

The new monetary law enacts three foundational pillars:
1. **Primary Objective of Domestic Price Stability:** The Bank's statutory focus is cemented on preserving the purchasing power of the rupee, followed by maintaining financial system stability.
2. **Prohibition of Direct Monetary Financing:** The Central Bank is strictly barred from subscribing to primary issuances of government securities, preventing the fiscal monetization that caused catastrophic reserve drainage.
3. **The Single Policy Rate (OPR):** Transition from the dual-rate corridor (SDFR / SLFR) to a single Overnight Policy Rate (OPR) to dramatically improve the speed and transparency of interest rate transmission into commercial lending rates.`,
        keyFormula: 'Target Inflation = 5.0% | Central Target Band: 3.0% – 7.0%',
      },
    ],
  },
};

export function getBookDetailsFromLibrary(bookId: string): BookLibraryDetails | null {
  return CLASSICAL_BOOKS_DATA[bookId] || null;
}
