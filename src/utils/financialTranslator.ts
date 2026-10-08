/**
 * Autonomous Financial Journalism Translation Engine for EconMatrix
 * Converts Sri Lankan macroeconomic, monetary, banking, and market news into
 * authentic, high-quality Sinhala (සිංහල) and Tamil (தமிழ்).
 *
 * Used both on client-side for instantaneous dynamic translation of any article
 * and on the server during new article publishing so every newly uploaded story
 * is immediately pre-baked with full Sinhala and Tamil translations.
 */

// Category dictionary
export const CATEGORY_TRANSLATIONS: Record<string, { si: string; ta: string }> = {
  ECONOMY: { si: 'ආර්ථිකය', ta: 'பொருளாதாரம்' },
  MARKETS: { si: 'කොටස් වෙළඳපොළ', ta: 'சந்தை' },
  FINANCE: { si: 'මූල්‍ය', ta: 'நிதி' },
  SERVICES: { si: 'සේවා', ta: 'சேவைகள்' },
  INDUSTRY: { si: 'කර්මාන්ත', ta: 'தொழில்துறை' },
  GOVERNANCE: { si: 'පාලනය', ta: 'ஆளுகை' },
  OPINION: { si: 'විග්‍රහය', ta: 'கருத்து' },
  WORLD: { si: 'ජාත්‍යන්තර', ta: 'உலகம்' },
  POLICY: { si: 'රාජ්‍ය ප්‍රතිපත්ති', ta: 'கொள்கை' },
  TRADE: { si: 'වෙළඳාම', ta: 'வர்த்தகம்' },
  BANKING: { si: 'බැංකු', ta: 'வங்கி' },
  'ALL STORIES': { si: 'සියලු පුවත්', ta: 'அனைத்து செய்திகள்' },
};

// Comprehensive Term & Phrase Replacements for Sinhala (Ordered from longest/most specific to shortest)
const SINHALA_TERMS: [RegExp, string][] = [
  [/\bcentral bank policy rates\b/gi, 'මහ බැංකු ප්‍රතිපත්ති පොලී අනුපාතික'],
  [/\bcentral bank policy rate\b/gi, 'මහ බැංකු ප්‍රතිපත්ති පොලී අනුපාතිකය'],
  [/\bpolicy rates\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතික'],
  [/\bpolicy rate\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතිකය'],
  [/\binterest rates\b/gi, 'පොලී අනුපාතික'],
  [/\binterest rate\b/gi, 'පොලී අනුපාතිකය'],
  [/\bexchange rates\b/gi, 'විනිමය අනුපාතික'],
  [/\bexchange rate\b/gi, 'විනිමය අනුපාතිකය'],
  [/\brates\b/gi, 'අනුපාතික'],
  [/\brate\b/gi, 'අනුපාතිකය'],

  // Government, Political & Regulatory Leadership
  [/\bPresident Announces\b/gi, 'ජනාධිපතිවරයා නිවේදනය කරයි'],
  [/\bPresident\b/gi, 'ජනාධිපති'],
  [/\bPrime Minister\b/gi, 'අග්‍රාමාත්‍යවරයා'],
  [/\bMinister of Finance\b/gi, 'මුදල් අමාත්‍යවරයා'],
  [/\bFinance Minister\b/gi, 'මුදල් අමාත්‍යවරයා'],
  [/\bCentral Bank Governor\b/gi, 'මහ බැංකු අධිපතිවරයා'],
  [/\bGovernor\b/gi, 'අධිපතිවරයා'],
  [/\bTreasury Secretary\b/gi, 'භාණ්ඩාගාර ලේකම්'],
  [/\bSecretary\b/gi, 'ලේකම්'],
  [/\bMinistry of Finance\b/gi, 'මුදල් අමාත්‍යාංශය'],
  [/\bMinistry of Trade\b/gi, 'වෙළඳ අමාත්‍යාංශය'],
  [/\bMinistry of Agriculture\b/gi, 'කෘෂිකර්ම අමාත්‍යාංශය'],
  [/\bMinistry of Industries\b/gi, 'කර්මාන්ත අමාත්‍යාංශය'],
  [/\bMinistry of Foreign Affairs\b/gi, 'විදේශ කටයුතු අමාත්‍යාංශය'],
  [/\bMinistry of Transport\b/gi, 'ප්‍රවාහන අමාත්‍යාංශය'],
  [/\bMinistry\b/gi, 'අමාත්‍යාංශය'],
  [/\bMinister\b/gi, 'අමාත්‍යවරයා'],
  [/\bMinisters\b/gi, 'අමාත්‍යවරුන්'],
  [/\bCabinet Approves\b/gi, 'අමාත්‍ය මණ්ඩලය අනුමත කරයි'],
  [/\bCabinet Decision\b/gi, 'කැබිනට් තීරණය'],
  [/\bCabinet Paper\b/gi, 'කැබිනට් පත්‍රිකාව'],
  [/\bParliament Approves\b/gi, 'පාර්ලිමේන්තුව අනුමත කරයි'],
  [/\bParliament Passes\b/gi, 'පාර්ලිමේන්තුව සම්මත කරයි'],
  [/\bGazette Notification\b/gi, 'ගැසට් නිවේදනය'],
  [/\bGazette\b/gi, 'ගැසට් පත්‍රය'],
  [/\bSupreme Court\b/gi, 'ශ්‍රේෂ්ඨාධිකරණය'],

  // Reforms, Policies & Taxation
  [/\bEconomic Reforms\b/gi, 'ආර්ථික ප්‍රතිසංස්කරණ'],
  [/\bEconomic Reform\b/gi, 'ආර්ථික ප්‍රතිසංස්කරණය'],
  [/\bFiscal Reforms\b/gi, 'රාජ්‍ය මූල්‍ය ප්‍රතිසංස්කරණ'],
  [/\bFiscal Reform\b/gi, 'රාජ්‍ය මූල්‍ය ප්‍රතිසංස්කරණය'],
  [/\bStructural Reforms\b/gi, 'ව්‍යුහාත්මක ප්‍රතිසංස්කරණ'],
  [/\bMonetary Reforms\b/gi, 'මුදල් ප්‍රතිසංස්කරණ'],
  [/\bGovernance Reforms\b/gi, 'පාලන ප්‍රතිසංස්කරණ'],
  [/\bDirect Tax Adjustments\b/gi, 'සෘජු බදු සංශෝධන'],
  [/\bDirect Tax Adjustment\b/gi, 'සෘජු බදු සංශෝධනය'],
  [/\bTax Adjustments\b/gi, 'බදු සංශෝධන'],
  [/\bDirect Taxes\b/gi, 'සෘජු බදු'],
  [/\bDirect Tax\b/gi, 'සෘජු බද්ද'],
  [/\bIndirect Taxes\b/gi, 'වක්‍ර බදු'],
  [/\bIndirect Tax\b/gi, 'වක්‍ර බද්ද'],
  [/\bTax Reforms\b/gi, 'බදු ප්‍රතිසංස්කරණ'],
  [/\bIncome Tax\b/gi, 'ආදායම් බද්ද'],
  [/\bCorporate Tax\b/gi, 'ආයතනික බද්ද'],
  [/\bWithholding Tax\b/gi, 'රඳවා ගැනීමේ බද්ද (WHT)'],
  [/\bTax Holiday\b/gi, 'බදු සහන කාලය'],
  [/\bTax Exemption\b/gi, 'බදු නිදහස් කිරීම'],
  [/\bTax Incentives\b/gi, 'බදු දිරිගැන්වීම්'],

  // Sectors & Industries
  [/\bAgricultural Exporters\b/gi, 'කෘෂිකාර්මික අපනයනකරුවන්'],
  [/\bAgricultural Exporter\b/gi, 'කෘෂිකාර්මික අපනයනකරු'],
  [/\bAgricultural Sector\b/gi, 'කෘෂිකාර්මික අංශය'],
  [/\bAgriculture\b/gi, 'කෘෂිකර්මාන්තය'],
  [/\bAgricultural\b/gi, 'කෘෂිකාර්මික'],
  [/\bExporters\b/gi, 'අපනයනකරුවන්'],
  [/\bExporter\b/gi, 'අපනයනකරු'],
  [/\bImporters\b/gi, 'ආනයනකරුවන්'],
  [/\bImporter\b/gi, 'ආනයනකරු'],
  [/\bManufacturers\b/gi, 'නිෂ්පාදකයින්'],
  [/\bManufacturer\b/gi, 'නිෂ්පාදකයා'],
  [/\bManufacturing Sector\b/gi, 'නිෂ්පාදන ක්ෂේත්‍රය'],
  [/\bManufacturing\b/gi, 'නිෂ්පාදන'],
  [/\bLocal Manufacturing\b/gi, 'දේශීය නිෂ්පාදන'],
  [/\bDomestic Manufacturing\b/gi, 'දේශීය නිෂ්පාදන ක්ෂේත්‍රය'],
  [/\bIndustrial Sector\b/gi, 'කාර්මික අංශය'],
  [/\bIndustry\b/gi, 'කර්මාන්ත'],
  [/\bIndustries\b/gi, 'කර්මාන්ත'],
  [/\bServices Sector\b/gi, 'සේවා අංශය'],
  [/\bService Sector\b/gi, 'සේවා අංශය'],
  [/\bFinancial Sector\b/gi, 'මූල්‍ය ක්ෂේත්‍රය'],
  [/\bBanking Sector\b/gi, 'බැංකු ක්ෂේත්‍රය'],
  [/\bEnergy Sector\b/gi, 'බලශක්ති ක්ෂේත්‍රය'],
  [/\bPower Sector\b/gi, 'විදුලිබල ක්ෂේත්‍රය'],
  [/\bTransport Sector\b/gi, 'ප්‍රවාහන ක්ෂේත්‍රය'],
  [/\bMaritime Sector\b/gi, 'සමුද්‍රීය ක්ෂේත්‍රය'],
  [/\bAviation Sector\b/gi, 'ගුවන් සේවා ක්ෂේත්‍රය'],
  [/\bTourism Sector\b/gi, 'සංචාරක ක්ෂේත්‍රය'],
  [/\bPrivate Sector\b/gi, 'පෞද්ගලික අංශය'],
  [/\bPublic Sector\b/gi, 'රාජ්‍ය අංශය'],

  // Policy & Actions Phrases
  [/\bPackage of fiscal reforms\b/gi, 'රාජ්‍ය මූල්‍ය ප්‍රතිසංස්කරණ පැකේජය'],
  [/\bMajor package\b/gi, 'ප්‍රධාන වැඩපිළිවෙලක්'],
  [/\bDesigned to support\b/gi, 'සහාය දැක්වීම සඳහා සකස් කරන ලද'],
  [/\bDesigned to boost\b/gi, 'ඉහළ නැංවීමේ අරමුණින් සකස් කළ'],
  [/\bDesigned to\b/gi, 'ඉලක්ක කරගත්'],
  [/\bTo support\b/gi, 'සහාය වීම සඳහා'],
  [/\bKey economic policies\b/gi, 'ප්‍රධාන ආර්ථික ප්‍රතිපත්ති'],
  [/\bEconomic policies\b/gi, 'ආර්ථික ප්‍රතිපත්ති'],
  [/\bEconomic policy\b/gi, 'ආර්ථික ප්‍රතිපත්තිය'],
  [/\bPolicies\b/gi, 'ප්‍රතිපත්ති'],
  [/\bPolicy\b/gi, 'ප්‍රතිපත්තිය'],
  [/\bCentral bank policy rate\b/gi, 'මහ බැංකු ප්‍රතිපත්ති පොලී අනුපාතිකය'],
  [/\bPolicy rate\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතිකය'],
  [/\bWill remain stable\b/gi, 'ස්ථාවරව පවතිනු ඇත'],
  [/\bRemain stable\b/gi, 'ස්ථාවරව පවතී'],
  [/\bRemains stable\b/gi, 'ස්ථාවරව පවතී'],
  [/\bModerates to target levels\b/gi, 'ඉලක්කගත මට්ටම් දක්වා මධ්‍යස්ථ වේ'],
  [/\bModerates to\b/gi, 'දක්වා මධ්‍යස්ථ වේ'],
  [/\bModerates\b/gi, 'මධ්‍යස්ථ මට්ටමකට පැමිණේ'],
  [/\bModerated\b/gi, 'මධ්‍යස්ථ විය'],
  [/\bModerating\b/gi, 'මධ්‍යස්ථ වෙමින්'],
  [/\bTarget levels\b/gi, 'ඉලක්කගත මට්ටම්'],
  [/\bTarget level\b/gi, 'ඉලක්කගත මට්ටම'],
  [/\bTo boost\b/gi, 'ඉහළ නැංවීම සඳහා'],
  [/\bBoosts\b/gi, 'ඉහළ නංවයි'],
  [/\bBoosted\b/gi, 'ඉහළ නැංවීය'],
  [/\bBoost\b/gi, 'ඉහළ නැංවීම'],
  [/\bAnnounced\b/gi, 'ප්‍රකාශයට පත් කළේය'],
  [/\bAnnounces\b/gi, 'ප්‍රකාශයට පත් කරයි'],
  [/\bAnnouncement\b/gi, 'නිල ප්‍රකාශය'],
  [/\bAnnouncements\b/gi, 'නිල ප්‍රකාශ'],
  [/\bExport Revenue\b/gi, 'අපනයන ආදායම'],
  [/\bExport Earnings\b/gi, 'අපනයන ඉපැයීම්'],
  [/\bForeign Exchange Reserves\b/gi, 'විදේශ විනිමය සංචිත'],
  [/\bForex Reserves\b/gi, 'විදේශ විනිමය සංචිත'],

  // Institutions & Regulatory Bodies
  [/\bCentral Bank of Sri Lanka\b/gi, 'ශ්‍රී ලංකා මහ බැංකුව'],
  [/\bCentral Bank\b/gi, 'මහ බැංකුව'],
  [/\bCBSL\b/g, 'ශ්‍රී ලංකා මහ බැංකුව'],
  [/\bMonetary Policy Board\b/gi, 'මුදල් ප්‍රතිපත්ති මණ්ඩලය'],
  [/\bInternational Monetary Fund\b/gi, 'ජාත්‍යන්තර මූල්‍ය අරමුදල (IMF)'],
  [/\bIMF\b/g, 'ජාත්‍යන්තර මූල්‍ය අරමුදල (IMF)'],
  [/\bWorld Bank\b/gi, 'ලෝක බැංකුව'],
  [/\bAsian Development Bank\b/gi, 'ආසියානු සංවර්ධන බැංකුව (ADB)'],
  [/\bADB\b/g, 'ආසියානු සංවර්ධන බැංකුව (ADB)'],
  [/\bColombo Stock Exchange\b/gi, 'කොළඹ කොටස් වෙළෙඳපොළ (CSE)'],
  [/\bCSE\b/g, 'කොළඹ කොටස් වෙළෙඳපොළ'],
  [/\bAll Share Price Index\b/gi, 'සියලු කොටස් මිල දර්ශකය (ASPI)'],
  [/\bASPI\b/g, 'සියලු කොටස් මිල දර්ශකය (ASPI)'],
  [/\bS&P SL20\b/gi, 'S&P ශ්‍රී ලංකා 20 දර්ශකය'],
  [/\bMinistry of Finance\b/gi, 'මුදල් අමාත්‍යාංශය'],
  [/\bMinistry of Power and Energy\b/gi, 'විදුලිබල හා බලශක්ති අමාත්‍යාංශය'],
  [/\bCeylon Electricity Board\b/gi, 'ලංකා විදුලිබල මණ්ඩලය (CEB)'],
  [/\bCEB\b/g, 'ලංකා විදුලිබල මණ්ඩලය'],
  [/\bCeylon Petroleum Corporation\b/gi, 'ලංකා ඛනිජ තෙල් නීතිගත සංස්ථාව (CPC)'],
  [/\bCPC\b/g, 'ලංකා ඛනිජ තෙල් නීතිගත සංස්ථාව'],
  [/\bSri Lanka Ports Authority\b/gi, 'ශ්‍රී ලංකා වරාය අධිකාරිය (SLPA)'],
  [/\bSLPA\b/g, 'ශ්‍රී ලංකා වරාය අධිකාරිය'],
  [/\bExport Development Board\b/gi, 'අපනයන සංවර්ධන මණ්ඩලය (EDB)'],
  [/\bEDB\b/g, 'අපනයන සංවර්ධන මණ්ඩලය'],
  [/\bBoard of Investment\b/gi, 'ශ්‍රී ලංකා ආයෝජන මණ්ඩලය (BOI)'],
  [/\bBOI\b/g, 'ආයෝජන මණ්ඩලය'],
  [/\bPublic Utilities Commission of Sri Lanka\b/gi, 'ශ්‍රී ලංකා මහජන උපයෝගිතා කොමිෂන් සභාව (PUCSL)'],
  [/\bPublic Utilities Commission\b/gi, 'මහජන උපයෝගිතා කොමිෂන් සභාව'],
  [/\bPUCSL\b/g, 'මහජන උපයෝගිතා කොමිෂන් සභාව'],
  [/\bHambantota International Port Group\b/gi, 'හම්බන්තොට ජාත්‍යන්තර වරාය සමූහය (HIPG)'],
  [/\bHambantota International Port\b/gi, 'හම්බන්තොට ජාත්‍යන්තර වරාය'],
  [/\bHambantota Port\b/gi, 'හම්බන්තොට වරාය'],
  [/\bHIP\b/g, 'හම්බන්තොට ජාත්‍යන්තර වරාය'],
  [/\bPort City Colombo\b/gi, 'කොළඹ වරාය නගරය'],
  [/\bColombo Port\b/gi, 'කොළඹ වරාය'],
  [/\bEast Container Terminal\b/gi, 'නැගෙනහිර බහාලුම් පර්යන්තය (ECT)'],
  [/\bWest Container Terminal\b/gi, 'බටහිර බහාලුම් පර්යන්තය (WCT)'],
  [/\bJaya Container Terminal\b/gi, 'ජය බහාලුම් පර්යන්තය (JCT)'],
  [/\bCabinet of Ministers\b/gi, 'අමාත්‍ය මණ්ඩලය'],
  [/\bCabinet\b/gi, 'කැබිනට් මණ්ඩලය'],
  [/\bParliament\b/gi, 'පාර්ලිමේන්තුව'],
  [/\bDepartment of Census and Statistics\b/gi, 'ජනලේඛන හා සංඛ්‍යාලේඛන දෙපාර්තමේන්තුව'],
  [/\bInland Revenue Department\b/gi, 'දේශීය ආදායම් දෙපාර්තමේන්තුව (IRD)'],
  [/\bSri Lanka Customs\b/gi, 'ශ්‍රී ලංකා රේගුව'],

  // Banking & Financial Entities
  [/\bBank of Ceylon\b/gi, 'ලංකා බැංකුව'],
  [/\bPeople's Bank\b/gi, 'මහජන බැංකුව'],
  [/\bCommercial Bank of Ceylon\b/gi, 'කොමර්ෂල් බැංකුව'],
  [/\bCommercial Bank\b/gi, 'කොමර්ෂල් බැංකුව'],
  [/\bHatton National Bank\b/gi, 'හැටන් නැෂනල් බැංකුව (HNB)'],
  [/\bHNB\b/g, 'හැටන් නැෂනල් බැංකුව'],
  [/\bSampath Bank\b/gi, 'සම්පත් බැංකුව'],
  [/\bDFCC Bank\b/gi, 'DFCC බැංකුව'],
  [/\bNational Development Bank\b/gi, 'ජාතික සංවර්ධන බැංකුව (NDB)'],
  [/\bJohn Keells Holdings\b/gi, 'ජෝන් කීල්ස් හෝල්ඩිංග්ස්'],
  [/\bJKH\b/g, 'ජෝන් කීල්ස් හෝල්ඩිංග්ස්'],
  [/\bHayleys\b/gi, 'හේලීස්'],
  [/\bDialog Axiata\b/gi, 'ඩයලොග් ආසිආටා'],
  [/\bCommercial Banks\b/gi, 'වාණිජ බැංකු'],
  [/\bState Banks\b/gi, 'රාජ්‍ය බැංකු'],
  [/\bPrimary Dealers\b/gi, 'ප්‍රාථමික අලෙවිකරුවන්'],

  // Macroeconomic Concepts & Facilities
  [/\bExtended Fund Facility\b/gi, 'විස්තීර්ණ ණය පහසුකම (EFF)'],
  [/\bStaff-Level Agreement\b/gi, 'කාර්ය මණ්ඩල මට්ටමේ එකඟතාව'],
  [/\bDomestic Debt Optimization\b/gi, 'දේශීය ණය ප්‍රශස්තකරණය (DDO)'],
  [/\bDDO\b/g, 'දේශීය ණය ප්‍රශස්තකරණය (DDO)'],
  [/\bDebt Restructuring\b/gi, 'ණය ප්‍රතිව්‍යුහගත කිරීම'],
  [/\bStanding Deposit Facility Rate\b/gi, 'ස්ථාවර තැන්පතු පහසුකම් අනුපාතිකය (SDFR)'],
  [/\bSDFR\b/g, 'ස්ථාවර තැන්පතු පහසුකම් අනුපාතිකය'],
  [/\bStanding Lending Facility Rate\b/gi, 'ස්ථාවර ණය පහසුකම් අනුපාතිකය (SLFR)'],
  [/\bSLFR\b/g, 'ස්ථාවර ණය පහසුකම් අනුපාතිකය'],
  [/\bStatutory Reserve Ratio\b/gi, 'ව්‍යවස්ථාපිත සංචිත අනුපාතය (SRR)'],
  [/\bPolicy Rates\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතික'],
  [/\bInterest Rates\b/gi, 'පොලී අනුපාතික'],
  [/\bTreasury Bills\b/gi, 'භාණ්ඩාගාර බිල්පත්'],
  [/\bTreasury Bonds\b/gi, 'භාණ්ඩාගාර බැඳුම්කර'],
  [/\bSovereign Bonds\b/gi, 'ස්වෛරී බැඳුම්කර'],
  [/\bGross Official Reserves\b/gi, 'දළ නිල විදේශ සංචිත'],
  [/\bForeign Exchange Reserves\b/gi, 'විදේශ විනිමය සංචිත'],
  [/\bForeign Reserves\b/gi, 'විදේශ සංචිත'],
  [/\bNon-Performing Loans\b/gi, 'අක්‍රිය ණය (NPLs)'],
  [/\bNPLs\b/g, 'අක්‍රිය ණය'],
  [/\bBad Loans\b/gi, 'අක්‍රිය ණය'],
  [/\bPrivate Sector Credit\b/gi, 'පෞද්ගලික අංශයේ ණය'],
  [/\bFiscal Deficit\b/gi, 'අයවැය හිඟය'],
  [/\bPrimary Fiscal Surplus\b/gi, 'ප්‍රාථමික අයවැය අතිරික්තය'],
  [/\bPrimary Surplus\b/gi, 'ප්‍රාථමික අතිරික්තය'],
  [/\bTrade Deficit\b/gi, 'වෙළඳ හිඟය'],
  [/\bCurrent Account Deficit\b/gi, 'ජංගම ගිණුමේ හිඟය'],
  [/\bCurrent Account\b/gi, 'ජංගම ගිණුම'],
  [/\bBalance of Payments\b/gi, 'ගෙවුම් ශේෂය'],
  [/\bHeadline Inflation\b/gi, 'ප්‍රධාන උද්ධමනය'],
  [/\bCore Inflation\b/gi, 'මූලික උද්ධමනය'],
  [/\bInflation\b/gi, 'උද්ධමනය'],
  [/\bDisinflation\b/gi, 'උද්ධමන වේගය පහත වැටීම'],
  [/\bDeflation\b/gi, 'මිල මට්ටම් පහත වැටීම (අවධමනය)'],
  [/\bColombo Consumer Price Index\b/gi, 'කොළඹ පාරිභෝගික මිල දර්ශකය (CCPI)'],
  [/\bCCPI\b/g, 'කොළඹ පාරිභෝගික මිල දර්ශකය'],
  [/\bExchange Rate\b/gi, 'විනිමය අනුපාතිකය'],
  [/\bSpot Exchange Rate\b/gi, 'ක්ෂණික විනිමය අනුපාතිකය'],
  [/\bRupee Depreciation\b/gi, 'රුපියල අවප්‍රමාණය වීම'],
  [/\bRupee Appreciation\b/gi, 'රුපියල අතිප්‍රමාණය වීම'],
  [/\bCapital Adequacy Ratio\b/gi, 'ප්‍රාග්ධන ප්‍රමාණාත්මක අනුපාතය (CAR)'],
  [/\bTier-1 Capital\b/gi, 'පළමු පෙළ ප්‍රාග්ධනය'],
  [/\bOpen Market Operations\b/gi, 'විවෘත වෙළඳපල මෙහෙයුම්'],
  [/\bLiquidity Injections\b/gi, 'ද්‍රවශීලතා සැපයීම්'],
  [/\bExcess Liquidity\b/gi, 'අතිරික්ත ද්‍රවශීලතාවය'],
  [/\bSuperannuation Funds\b/gi, 'විශ්‍රාම වැටුප් අරමුදල්'],
  [/\bValue Added Tax\b/gi, 'එකතු කළ අගය මත බද්ද (VAT)'],
  [/\bVAT\b/g, 'එකතු කළ අගය මත බද්ද (VAT)'],
  [/\bSocial Security Contribution Levy\b/gi, 'සමාජ ආරක්ෂණ දායකත්ව බද්ද (SSCL)'],
  [/\bSSCL\b/g, 'සමාජ ආරක්ෂණ බද්ද (SSCL)'],
  [/\bWorkers' Remittances\b/gi, 'විදේශගත ශ්‍රමික ප්‍රේෂණ'],
  [/\bWorker Remittances\b/gi, 'විදේශගත ශ්‍රමික ප්‍රේෂණ'],
  [/\bRemittances\b/gi, 'ප්‍රේෂණ'],
  [/\bTourism Earnings\b/gi, 'සංචාරක ආදායම'],
  [/\bTourist Arrivals\b/gi, 'සංචාරකයින්ගේ පැමිණීම'],
  [/\bTea Exports\b/gi, 'තේ අපනයනය'],
  [/\bCeylon Tea\b/gi, 'සිලෝන් තේ'],
  [/\bApparel Exports\b/gi, 'ඇඟලුම් අපනයනය'],
  [/\bOffshore Oil Blocks\b/gi, 'මුහුදු තෙල් ගවේෂණ කලාප'],
  [/\bRenewable Energy\b/gi, 'පුනර්ජනනීය බලශක්තිය'],
  [/\bSolar Energy\b/gi, 'සූර්ය බලශක්තිය'],
  [/\bWind Energy\b/gi, 'සුළං බලශක්තිය'],
  [/\bState-Owned Enterprises\b/gi, 'රාජ්‍ය ව්‍යවසායන් (SOEs)'],
  [/\bSOEs\b/g, 'රාජ්‍ය ව්‍යවසායන්'],
  [/\bSOE\b/g, 'රාජ්‍ය ව්‍යවසාය'],
  [/\bCost-Reflective\b/gi, 'පිරිවැය පරාවර්තක'],
  [/\bPrice Formula\b/gi, 'මිල සූත්‍රය'],
  [/\bElectricity Tariff\b/gi, 'විදුලි ගාස්තු'],
  [/\bFeed-in Tariff\b/gi, 'පෝෂණ ගාස්තු (FIT)'],
  [/\bFeed-in Tariffs\b/gi, 'පෝෂණ ගාස්තු ක්‍රමවේදය'],
  [/\bEconomic Growth\b/gi, 'ආර්ථික වර්ධනය'],
  [/\bGDP Growth\b/gi, 'දළ දේශීය නිෂ්පාදිතයේ (GDP) වර්ධනය'],
  [/\bForeign Direct Investment\b/gi, 'සෘජු විදේශ ආයෝජන (FDI)'],
  [/\bFDI\b/g, 'සෘජු විදේශ ආයෝජන'],

  // Verbs & Actions
  [/\bkeeps policy rates unchanged\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාතික නොවෙනස්ව තබා ගනී'],
  [/\bmaintains policy rates steady\b/gi, 'ප්‍රතිපත්ති පොලී අනුපාත ස්ථාවරව පවත්වා ගනී'],
  [/\bkeeps rates unchanged\b/gi, 'පොලී අනුපාත නොවෙනස්ව තබා ගනී'],
  [/\bmaintains rates steady\b/gi, 'පොලී අනුපාත ස්ථාවරව පවත්වා ගනී'],
  [/\bgranted formal approval\b/gi, 'නිල අනුමැතිය ලබා දුන්නේය'],
  [/\bgrants formal approval\b/gi, 'නිල අනුමැතිය ලබා දෙයි'],
  [/\bapproved a private-public partnership\b/gi, 'රාජ්‍ය-පෞද්ගලික හවුල්කාරිත්වයක් අනුමත කළේය'],
  [/\bformal approval for the commercial development\b/gi, 'වාණිජ සංවර්ධනය සඳහා නිල අනුමැතිය'],
  [/\bcommercial development\b/gi, 'වාණිජ සංවර්ධනය'],
  [/\bcontainer terminal development\b/gi, 'බහාලුම් පර්යන්ත සංවර්ධනය'],
  [/\bcontainer terminal expansion\b/gi, 'බහාලුම් පර්යන්ත ව්‍යාප්තිය'],
  [/\bport terminal expansion\b/gi, 'වරාය පර්යන්ත ව්‍යාප්තිය'],
  [/\bcontainer terminal\b/gi, 'බහාලුම් පර්යන්තය'],
  [/\bFinance Minister stated that\b/gi, 'මුදල් අමාත්‍යවරයා ප්‍රකාශ කළේ'],
  [/\bwill oversee operations\b/gi, 'මෙහෙයුම් අධීක්ෂණය කරනු ඇත'],
  [/\brevenue sharing with international maritime partners\b/gi, 'ජාත්‍යන්තර සමුද්‍රීය හවුල්කරුවන් සමඟ ආදායම් බෙදාගැනීම'],
  [/\bmaritime partners\b/gi, 'සමුද්‍රීය හවුල්කරුවන්'],
  [/\boversee operations\b/gi, 'මෙහෙයුම් කටයුතු අධීක්ෂණය කිරීම'],
  [/\bwould exceed\b/gi, 'ඉක්මවනු ඇතැයි'],
  [/\bover three years\b/gi, 'වසර තුනක් තුළ'],
  [/\bapproves\b/gi, 'අනුමත කරයි'],
  [/\bapproved\b/gi, 'අනුමත කළේය'],
  [/\bsurpasses\b/gi, 'ඉක්මවා යයි'],
  [/\bsurpassed\b/gi, 'ඉක්මවා ගියේය'],
  [/\bcrosses milestone\b/gi, 'සන්ධිස්ථානය පසුකරයි'],
  [/\bcrossed milestone\b/gi, 'සන්ධිස්ථානය පසුකළේය'],
  [/\brecords surplus\b/gi, 'අතිරික්තයක් සටහන් කරයි'],
  [/\brecorded surplus\b/gi, 'අතිරික්තයක් සටහන් කළේය'],
  [/\brecords growth\b/gi, 'වර්ධනයක් වාර්තා කරයි'],
  [/\brecorded growth\b/gi, 'වර්ධනයක් වාර්තා කළේය'],
  [/\btumbles\b/gi, 'පහත වැටේ'],
  [/\btumbled\b/gi, 'පහත වැටුණි'],
  [/\bdrops\b/gi, 'පහත වැටේ'],
  [/\bdropped\b/gi, 'පහත වැටුණි'],
  [/\bsurges\b/gi, 'සීඝ්‍රයෙන් ඉහළ යයි'],
  [/\bsurged\b/gi, 'සීඝ්‍රයෙන් ඉහළ ගියේය'],
  [/\bclimbs\b/gi, 'ඉහළ යයි'],
  [/\bclimbed\b/gi, 'ඉහළ ගියේය'],
  [/\breaches\b/gi, 'ළඟා වේ'],
  [/\breached\b/gi, 'ළඟා විය'],
  [/\btouches\b/gi, 'ස්පර්ශ කරයි'],
  [/\btouched\b/gi, 'ස්පර්ශ කළේය'],
  [/\bfinalizes\b/gi, 'අවසන් කරයි'],
  [/\bfinalized\b/gi, 'අවසන් කළේය'],
  [/\bunveils\b/gi, 'එළිදක්වයි'],
  [/\bunveiled\b/gi, 'එළිදැක්වීය'],
  [/\blaunches\b/gi, 'ආරම්භ කරයි'],
  [/\blaunched\b/gi, 'ආරම්භ කළේය'],
  [/\bconfirms\b/gi, 'තහවුරු කරයි'],
  [/\bconfirmed\b/gi, 'තහවුරු කළේය'],
  [/\baffirms\b/gi, 'යළි තහවුරු කරයි'],
  [/\baffirmed\b/gi, 'යළි තහවුරු කළේය'],
  [/\bpasses\b/gi, 'සම්මත කරයි'],
  [/\bpassed\b/gi, 'සම්මත කළේය'],

  // Units, Time & Words
  [/\bTrillion\b/gi, 'ට්‍රිලියන'],
  [/\bBillion\b/gi, 'බිලියන'],
  [/\bMillion\b/gi, 'මිලියන'],
  [/\bPercent\b/gi, 'ප්‍රතිශතයක්'],
  [/\bBasis Points\b/gi, 'පදනම් අංක'],
  [/\bbps\b/gi, 'පදනම් අංක (bps)'],
  [/\bUS Dollars\b/gi, 'ඇමරිකානු ඩොලර්'],
  [/\bUSD\b/g, 'ඇමරිකානු ඩොලර්'],
  [/\bLKR\b/g, 'රුපියල්'],
  [/\bRupees\b/gi, 'රුපියල්'],
  [/\bRupee\b/gi, 'රුපියල'],
  [/\bYoY\b/gi, 'වාර්ෂිකව'],
  [/\bMoM\b/gi, 'මාසිකව'],
  [/\bTuesday\b/gi, 'අඟහරුවාදා'],
  [/\bWednesday\b/gi, 'බදාදා'],
  [/\bThursday\b/gi, 'බ්‍රහස්පතින්දා'],
  [/\bFriday\b/gi, 'සිකුරාදා'],
  [/\bSaturday\b/gi, 'සෙනසුරාදා'],
  [/\bSunday\b/gi, 'ඉරිදා'],
  [/\bMonday\b/gi, 'සඳුදා'],
  [/\bJanuary\b/gi, 'ජනවාරි'],
  [/\bFebruary\b/gi, 'පෙබරවාරි'],
  [/\bMarch\b/gi, 'මාර්තු'],
  [/\bApril\b/gi, 'අප්‍රේල්'],
  [/\bMay\b/gi, 'මැයි'],
  [/\bJune\b/gi, 'ජූනි'],
  [/\bJuly\b/gi, 'ජූලි'],
  [/\bAugust\b/gi, 'අගෝස්තු'],
  [/\bSeptember\b/gi, 'සැප්තැම්බර්'],
  [/\bOctober\b/gi, 'ඔක්තෝබර්'],
  [/\bNovember\b/gi, 'නොවැම්බර්'],
  [/\bDecember\b/gi, 'දෙසැම්බර්'],
  [/\bGovernment of Sri Lanka\b/gi, 'ශ්‍රී ලංකා රජය'],
  [/\bGovernment\b/gi, 'රජය'],
  [/\bSri Lanka\b/gi, 'ශ්‍රී ලංකාව'],
];

// Comprehensive Term & Phrase Replacements for Tamil (Ordered from longest/most specific to shortest)
const TAMIL_TERMS: [RegExp, string][] = [
  [/\bcentral bank policy rates\b/gi, 'மத்திய வங்கி கொள்கை வட்டி விகிதங்கள்'],
  [/\bcentral bank policy rate\b/gi, 'மத்திய வங்கி கொள்கை வட்டி விகிதம்'],
  [/\bpolicy rates\b/gi, 'கொள்கை வட்டி விகிதங்கள்'],
  [/\bpolicy rate\b/gi, 'கொள்கை வட்டி விகிதம்'],
  [/\binterest rates\b/gi, 'வட்டி விகிதங்கள்'],
  [/\binterest rate\b/gi, 'வட்டி விகிதம்'],
  [/\bexchange rates\b/gi, 'மாற்று விகிதங்கள்'],
  [/\bexchange rate\b/gi, 'மாற்று விகிதம்'],
  [/\brates\b/gi, 'விகிதங்கள்'],
  [/\brate\b/gi, 'விகிதம்'],

  // Government, Political & Regulatory Leadership
  [/\bPresident Announces\b/gi, 'ஜனாதிபதி அறிவிக்கிறார்'],
  [/\bPresident\b/gi, 'ஜனாதிபதி'],
  [/\bPrime Minister\b/gi, 'பிரதமர்'],
  [/\bMinister of Finance\b/gi, 'நிதி அமைச்சர்'],
  [/\bFinance Minister\b/gi, 'நிதி அமைச்சர்'],
  [/\bCentral Bank Governor\b/gi, 'மத்திய வங்கி ஆளுநர்'],
  [/\bGovernor\b/gi, 'ஆளுநர்'],
  [/\bTreasury Secretary\b/gi, 'திறைசேரி செயலாளர்'],
  [/\bSecretary\b/gi, 'செயலாளர்'],
  [/\bMinistry of Finance\b/gi, 'நிதி அமைச்சு'],
  [/\bMinistry of Trade\b/gi, 'வர்த்தக அமைச்சு'],
  [/\bMinistry of Agriculture\b/gi, 'விவசாய அமைச்சு'],
  [/\bMinistry of Industries\b/gi, 'கைத்தொழில் அமைச்சு'],
  [/\bMinistry of Foreign Affairs\b/gi, 'வெளிவிவகார அமைச்சு'],
  [/\bMinistry of Transport\b/gi, 'போக்குவரத்து அமைச்சு'],
  [/\bMinistry\b/gi, 'அமைச்சு'],
  [/\bMinister\b/gi, 'அமைச்சர்'],
  [/\bMinisters\b/gi, 'அமைச்சர்கள்'],
  [/\bCabinet Approves\b/gi, 'அமைச்சரவை ஒப்புதல் அளிக்கிறது'],
  [/\bCabinet Decision\b/gi, 'அமைச்சரவை முடிவு'],
  [/\bCabinet Paper\b/gi, 'அமைச்சரவை பத்திரம்'],
  [/\bParliament Approves\b/gi, 'நாடாளுமன்றம் ஒப்புதல் அளிக்கிறது'],
  [/\bParliament Passes\b/gi, 'நாடாளுமன்றம் நிறைவேற்றுகிறது'],
  [/\bGazette Notification\b/gi, 'வர்த்தமானி அறிவித்தல்'],
  [/\bGazette\b/gi, 'வர்த்தமானி'],
  [/\bSupreme Court\b/gi, 'உயர் நீதிமன்றம்'],

  // Reforms, Policies & Taxation
  [/\bEconomic Reforms\b/gi, 'பொருளாதார சீர்திருத்தங்கள்'],
  [/\bEconomic Reform\b/gi, 'பொருளாதார சீர்திருத்தம்'],
  [/\bFiscal Reforms\b/gi, 'நிதி சீர்திருத்தங்கள்'],
  [/\bFiscal Reform\b/gi, 'நிதி சீர்திருத்தம்'],
  [/\bStructural Reforms\b/gi, 'கட்டமைப்பு சீர்திருத்தங்கள்'],
  [/\bMonetary Reforms\b/gi, 'பணவியல் சீர்திருத்தங்கள்'],
  [/\bGovernance Reforms\b/gi, 'ஆளுகை சீர்திருத்தங்கள்'],
  [/\bDirect Tax Adjustments\b/gi, 'நேரடி வரி மாற்றங்கள்'],
  [/\bDirect Tax Adjustment\b/gi, 'நேரடி வரி மாற்றம்'],
  [/\bTax Adjustments\b/gi, 'வரி மாற்றங்கள்'],
  [/\bDirect Taxes\b/gi, 'நேரடி வரிகள்'],
  [/\bDirect Tax\b/gi, 'நேரடி வரி'],
  [/\bIndirect Taxes\b/gi, 'மறைமுக வரிகள்'],
  [/\bIndirect Tax\b/gi, 'மறைமுக வரி'],
  [/\bTax Reforms\b/gi, 'வரி சீர்திருத்தங்கள்'],
  [/\bIncome Tax\b/gi, 'வருமான வரி'],
  [/\bCorporate Tax\b/gi, 'நிறுவன வரி'],
  [/\bWithholding Tax\b/gi, 'நிறுத்திவைப்பு வரி (WHT)'],
  [/\bTax Holiday\b/gi, 'வரி விடுமுறை'],
  [/\bTax Exemption\b/gi, 'வரி விலக்கு'],
  [/\bTax Incentives\b/gi, 'வரி சலுகைகள்'],

  // Sectors & Industries
  [/\bAgricultural Exporters\b/gi, 'விவசாய ஏற்றுமதியாளர்கள்'],
  [/\bAgricultural Exporter\b/gi, 'விவசாய ஏற்றுமதியாளர்'],
  [/\bAgricultural Sector\b/gi, 'விவசாயத் துறை'],
  [/\bAgriculture\b/gi, 'விவசாயம்'],
  [/\bAgricultural\b/gi, 'விவசாய'],
  [/\bExporters\b/gi, 'ஏற்றுமதியாளர்கள்'],
  [/\bExporter\b/gi, 'ஏற்றுமதியாளர்'],
  [/\bImporters\b/gi, 'இறக்குமதியாளர்கள்'],
  [/\bImporter\b/gi, 'இறக்குமதியாளர்'],
  [/\bManufacturers\b/gi, 'உற்பத்தியாளர்கள்'],
  [/\bManufacturer\b/gi, 'உற்பத்தியாளர்'],
  [/\bManufacturing Sector\b/gi, 'உற்பத்தித் துறை'],
  [/\bManufacturing\b/gi, 'உற்பத்தி'],
  [/\bLocal Manufacturing\b/gi, 'உள்நாட்டு உற்பத்தி'],
  [/\bDomestic Manufacturing\b/gi, 'உள்நாட்டு உற்பத்தி துறை'],
  [/\bIndustrial Sector\b/gi, 'தொழில்துறை'],
  [/\bIndustry\b/gi, 'தொழில்துறை'],
  [/\bIndustries\b/gi, 'தொழில்கள்'],
  [/\bServices Sector\b/gi, 'சேவைத் துறை'],
  [/\bService Sector\b/gi, 'சேவைத் துறை'],
  [/\bFinancial Sector\b/gi, 'நிதித் துறை'],
  [/\bBanking Sector\b/gi, 'வங்கித் துறை'],
  [/\bEnergy Sector\b/gi, 'எரிசக்தி துறை'],
  [/\bPower Sector\b/gi, 'மின்சாரத் துறை'],
  [/\bTransport Sector\b/gi, 'போக்குவரத்துத் துறை'],
  [/\bMaritime Sector\b/gi, 'கடல்சார் துறை'],
  [/\bAviation Sector\b/gi, 'விமானத் துறை'],
  [/\bTourism Sector\b/gi, 'சுற்றுலாத் துறை'],
  [/\bPrivate Sector\b/gi, 'தனியார் துறை'],
  [/\bPublic Sector\b/gi, 'பொதுத்துறை'],

  // Policy & Actions Phrases
  [/\bPackage of fiscal reforms\b/gi, 'நிதி சீர்திருத்த தொகுப்பு'],
  [/\bMajor package\b/gi, 'பிரதான தொகுப்பு'],
  [/\bDesigned to support\b/gi, 'ஆதரவளிக்கும் வகையில் வடிவமைக்கப்பட்டுள்ளது'],
  [/\bDesigned to boost\b/gi, 'அதிகரிக்கும் நோக்கில் உருவாக்கப்பட்டது'],
  [/\bDesigned to\b/gi, 'வடிவமைக்கப்பட்டுள்ளது'],
  [/\bTo support\b/gi, 'ஆதரவளிக்க'],
  [/\bKey economic policies\b/gi, 'முக்கிய பொருளாதார கொள்கைகள்'],
  [/\bEconomic policies\b/gi, 'பொருளாதார கொள்கைகள்'],
  [/\bEconomic policy\b/gi, 'பொருளாதார கொள்கை'],
  [/\bPolicies\b/gi, 'கொள்கைகள்'],
  [/\bPolicy\b/gi, 'கொள்கை'],
  [/\bCentral bank policy rate\b/gi, 'மத்திய வங்கி கொள்கை வட்டி விகிதம்'],
  [/\bPolicy rate\b/gi, 'கொள்கை வட்டி விகிதம்'],
  [/\bWill remain stable\b/gi, 'நிலையாக இருக்கும்'],
  [/\bRemain stable\b/gi, 'நிலையாக உள்ளது'],
  [/\bRemains stable\b/gi, 'நிலையாக உள்ளது'],
  [/\bModerates to target levels\b/gi, 'இலக்கு மட்டங்களுக்கு தணிகிறது'],
  [/\bModerates to\b/gi, 'வரை தணிகிறது'],
  [/\bModerates\b/gi, 'தணிகிறது'],
  [/\bModerated\b/gi, 'தணிந்தது'],
  [/\bModerating\b/gi, 'தணிந்து வருகிறது'],
  [/\bTarget levels\b/gi, 'இலக்கு மட்டங்கள்'],
  [/\bTarget level\b/gi, 'இலக்கு மட்டம்'],
  [/\bTo boost\b/gi, 'அதிகரிக்க'],
  [/\bBoosts\b/gi, 'உயர்த்துகிறது'],
  [/\bBoosted\b/gi, 'உயர்த்தியது'],
  [/\bBoost\b/gi, 'உயர்வு'],
  [/\bAnnounced\b/gi, 'அறிவித்தது'],
  [/\bAnnounces\b/gi, 'அறிவிக்கிறது'],
  [/\bAnnouncement\b/gi, 'அறிவிப்பு'],
  [/\bAnnouncements\b/gi, 'அறிவிப்புகள்'],
  [/\bExport Revenue\b/gi, 'ஏற்றுமதி வருவாய்'],
  [/\bExport Earnings\b/gi, 'ஏற்றுமதி வருவாய்'],
  [/\bForeign Exchange Reserves\b/gi, 'வெளிநாட்டு செலாவணி கையிருப்பு'],
  [/\bForex Reserves\b/gi, 'வெளிநாட்டு செலாவணி கையிருப்பு'],

  // Institutions & Regulatory Bodies
  [/\bCentral Bank of Sri Lanka\b/gi, 'இலங்கை மத்திய வங்கி'],
  [/\bCentral Bank\b/gi, 'மத்திய வங்கி'],
  [/\bCBSL\b/g, 'மத்திய வங்கி'],
  [/\bMonetary Policy Board\b/gi, 'நாணயக் கொள்கை சபை'],
  [/\bInternational Monetary Fund\b/gi, 'சர்வதேச நாணய நிதியம் (IMF)'],
  [/\bIMF\b/g, 'சர்வதேச நாணய நிதியம் (IMF)'],
  [/\bWorld Bank\b/gi, 'உலக வங்கி'],
  [/\bAsian Development Bank\b/gi, 'ஆசிய வளர்ச்சி வங்கி (ADB)'],
  [/\bADB\b/g, 'ஆசிய வளர்ச்சி வங்கி (ADB)'],
  [/\bColombo Stock Exchange\b/gi, 'கொழும்பு பங்குச் சந்தை (CSE)'],
  [/\bCSE\b/g, 'கொழும்பு பங்குச் சந்தை'],
  [/\bAll Share Price Index\b/gi, 'அனைத்து பங்கு விலைச்சுட்டி (ASPI)'],
  [/\bASPI\b/g, 'அனைத்து பங்கு விலைச்சுட்டி (ASPI)'],
  [/\bS&P SL20\b/gi, 'S&P SL20 குறியீடு'],
  [/\bMinistry of Finance\b/gi, 'நிதி அமைச்சு'],
  [/\bMinistry of Power and Energy\b/gi, 'மின்சக்தி மற்றும் எரிசக்தி அமைச்சு'],
  [/\bCeylon Electricity Board\b/gi, 'இலங்கை மின்சார சபை (CEB)'],
  [/\bCEB\b/g, 'இலங்கை மின்சார சபை'],
  [/\bCeylon Petroleum Corporation\b/gi, 'இலங்கை பெட்ரோலிய கூட்டுத்தாபனம் (CPC)'],
  [/\bCPC\b/g, 'இலங்கை பெட்ரோலிய கூட்டுத்தாபனம்'],
  [/\bSri Lanka Ports Authority\b/gi, 'இலங்கை துறைமுக அதிகார சபை (SLPA)'],
  [/\bSLPA\b/g, 'இலங்கை துறைமுக அதிகார சபை'],
  [/\bExport Development Board\b/gi, 'ஏற்றுமதி அபிவிருத்தி சபை (EDB)'],
  [/\bEDB\b/g, 'ஏற்றுமதி அபிவிருத்தி சபை'],
  [/\bBoard of Investment\b/gi, 'இலங்கை முதலீட்டு சபை (BOI)'],
  [/\bBOI\b/g, 'முதலீட்டு சபை'],
  [/\bPublic Utilities Commission of Sri Lanka\b/gi, 'இலங்கை பொதுப் பயன்பாடுகள் ஆணைக்குழு (PUCSL)'],
  [/\bPublic Utilities Commission\b/gi, 'பொதுப் பயன்பாடுகள் ஆணைக்குழு'],
  [/\bPUCSL\b/g, 'பொதுப் பயன்பாடுகள் ஆணைக்குழு'],
  [/\bHambantota International Port Group\b/gi, 'ஹம்பாந்தோட்டை சர்வதேச துறைமுகக் குழுமம் (HIPG)'],
  [/\bHambantota International Port\b/gi, 'ஹம்பாந்தோட்டை சர்வதேச துறைமுகம்'],
  [/\bHambantota Port\b/gi, 'ஹம்பாந்தோட்டை துறைமுகம்'],
  [/\bHIP\b/g, 'ஹம்பாந்தோட்டை சர்வதேச துறைமுகம்'],
  [/\bPort City Colombo\b/gi, 'கொழும்பு போர்ட் சிட்டி'],
  [/\bColombo Port\b/gi, 'கொழும்பு துறைமுகம்'],
  [/\bEast Container Terminal\b/gi, 'கிழக்கு கொள்கலன் முனையம் (ECT)'],
  [/\bWest Container Terminal\b/gi, 'மேற்கு கொள்கலன் முனையம் (WCT)'],
  [/\bJaya Container Terminal\b/gi, 'ஜய கொள்கலன் முனையம் (JCT)'],
  [/\bCabinet of Ministers\b/gi, 'அமைச்சரவை'],
  [/\bCabinet\b/gi, 'அமைச்சரவை'],
  [/\bParliament\b/gi, 'பாராளுமன்றம்'],
  [/\bDepartment of Census and Statistics\b/gi, 'தொகைமதிப்பு புள்ளிவிபரத் திணைக்களம்'],
  [/\bInland Revenue Department\b/gi, 'உள்நாட்டு இறைவரித் திணைக்களம் (IRD)'],
  [/\bSri Lanka Customs\b/gi, 'இலங்கை சுங்கம்'],

  // Banking & Financial Entities
  [/\bBank of Ceylon\b/gi, 'இலங்கை வங்கி'],
  [/\bPeople's Bank\b/gi, 'மக்கள் வங்கி'],
  [/\bCommercial Bank of Ceylon\b/gi, 'கொமர்ஷல் வங்கி'],
  [/\bCommercial Bank\b/gi, 'கொமர்ஷல் வங்கி'],
  [/\bHatton National Bank\b/gi, 'ஹட்டன் நெஷனல் வங்கி (HNB)'],
  [/\bHNB\b/g, 'ஹட்டன் நெஷனல் வங்கி'],
  [/\bSampath Bank\b/gi, 'சம்பத் வங்கி'],
  [/\bDFCC Bank\b/gi, 'DFCC வங்கி'],
  [/\bNational Development Bank\b/gi, 'தேசிய அபிவிருத்தி வங்கி (NDB)'],
  [/\bJohn Keells Holdings\b/gi, 'ஜோன் கீல்ஸ் ஹோல்டிங்ஸ்'],
  [/\bJKH\b/g, 'ஜோன் கீல்ஸ் ஹோல்டிங்ஸ்'],
  [/\bCommercial Banks\b/gi, 'வணிக வங்கிகள்'],
  [/\bState Banks\b/gi, 'அரசு வங்கிகள்'],
  [/\bPrimary Dealers\b/gi, 'முதன்மை விற்பனையாளர்கள்'],

  // Macroeconomic Concepts & Facilities
  [/\bExtended Fund Facility\b/gi, 'விரிவுபடுத்தப்பட்ட நிதி வசதி (EFF)'],
  [/\bStaff-Level Agreement\b/gi, 'பணியாளர் மட்ட உடன்பாடு'],
  [/\bDomestic Debt Optimization\b/gi, 'உள்நாட்டு கடன் மேம்படுத்தல் (DDO)'],
  [/\bDDO\b/g, 'உள்நாட்டு கடன் மேம்படுத்தல் (DDO)'],
  [/\bDebt Restructuring\b/gi, 'கடன் மறுசீரமைப்பு'],
  [/\bStanding Deposit Facility Rate\b/gi, 'நிலையான வைப்பு வசதி விகிதம் (SDFR)'],
  [/\bSDFR\b/g, 'நிலையான வைப்பு வசதி விகிதம்'],
  [/\bStanding Lending Facility Rate\b/gi, 'நிலையான கடன் வசதி விகிதம் (SLFR)'],
  [/\bSLFR\b/g, 'நிலையான கடன் வசதி விகிதம்'],
  [/\bStatutory Reserve Ratio\b/gi, 'சட்டரீதியான இருப்பு விகிதம் (SRR)'],
  [/\bPolicy Rates\b/gi, 'கொள்கை வட்டி விகிதங்கள்'],
  [/\bInterest Rates\b/gi, 'வட்டி விகிதங்கள்'],
  [/\bTreasury Bills\b/gi, 'திறைசேரி உண்டியல்கள்'],
  [/\bTreasury Bonds\b/gi, 'திறைசேரி பிணையங்கள்'],
  [/\bSovereign Bonds\b/gi, 'இறையாண்மை பிணையங்கள்'],
  [/\bGross Official Reserves\b/gi, 'மொத்த உத்தியோகபூர்வ வெளிநாட்டு கையிருப்பு'],
  [/\bForeign Exchange Reserves\b/gi, 'வெளிநாட்டு செலாவணி கையிருப்பு'],
  [/\bForeign Reserves\b/gi, 'வெளிநாட்டு கையிருப்பு'],
  [/\bNon-Performing Loans\b/gi, 'வாராக்கடன்கள் (NPLs)'],
  [/\bNPLs\b/g, 'வாராக்கடன்கள்'],
  [/\bBad Loans\b/gi, 'வாராக்கடன்கள்'],
  [/\bPrivate Sector Credit\b/gi, 'தனியார் துறை கடன்'],
  [/\bFiscal Deficit\b/gi, 'நிதிப் பற்றாக்குறை'],
  [/\bPrimary Fiscal Surplus\b/gi, 'முதன்மை நிதி உபரி'],
  [/\bPrimary Surplus\b/gi, 'முதன்மை உபரி'],
  [/\bTrade Deficit\b/gi, 'வர்த்தகப் பற்றாக்குறை'],
  [/\bCurrent Account Deficit\b/gi, 'நடப்புக் கணக்கு பற்றாக்குறை'],
  [/\bCurrent Account\b/gi, 'நடப்புக் கணக்கு'],
  [/\bBalance of Payments\b/gi, 'கொடுப்பனவு சமநிலை'],
  [/\bHeadline Inflation\b/gi, 'முதன்மை பணவீக்கம்'],
  [/\bCore Inflation\b/gi, 'மைய பணவீக்கம்'],
  [/\bInflation\b/gi, 'பணவீக்கம்'],
  [/\bDisinflation\b/gi, 'பணவீக்க வீழ்ச்சி'],
  [/\bDeflation\b/gi, 'பணவாட்டம்'],
  [/\bColombo Consumer Price Index\b/gi, 'கொழும்பு நுகர்வோர் விலைக் குறியீடு (CCPI)'],
  [/\bCCPI\b/g, 'கொழும்பு நுகர்வோர் விலைக் குறியீடு'],
  [/\bExchange Rate\b/gi, 'மாற்று விகிதம்'],
  [/\bSpot Exchange Rate\b/gi, 'உடனடி மாற்று விகிதம்'],
  [/\bRupee Depreciation\b/gi, 'ரூபாய் மதிப்பிழப்பு'],
  [/\bRupee Appreciation\b/gi, 'ரூபாய் மதிப்புயர்வு'],
  [/\bCapital Adequacy Ratio\b/gi, 'மூலதனப் போதுமை விகிதம் (CAR)'],
  [/\bTier-1 Capital\b/gi, 'முதல் அடுக்கு மூலதனம்'],
  [/\bOpen Market Operations\b/gi, 'திறந்த சந்தை செயல்பாடுகள்'],
  [/\bLiquidity Injections\b/gi, 'பணப்புழக்க உட்செலுத்தல்கள்'],
  [/\bExcess Liquidity\b/gi, 'உபரி பணப்புழக்கம்'],
  [/\bSuperannuation Funds\b/gi, 'ஓய்வூதிய நிதிகள்'],
  [/\bValue Added Tax\b/gi, 'பெறுமதி சேர்க்கப்பட்ட வரி (VAT)'],
  [/\bVAT\b/g, 'பெறுமதி சேர்க்கப்பட்ட வரி (VAT)'],
  [/\bSocial Security Contribution Levy\b/gi, 'சமூக பாதுகாப்பு பங்களிப்பு வரி (SSCL)'],
  [/\bSSCL\b/g, 'சமூக பாதுகாப்பு வரி (SSCL)'],
  [/\bWorkers' Remittances\b/gi, 'தொழிலாளர்களின் பணப்பரிமாற்றம்'],
  [/\bWorker Remittances\b/gi, 'தொழிலாளர்களின் பணப்பரிமாற்றம்'],
  [/\bRemittances\b/gi, 'பணப்பரிமாற்றங்கள்'],
  [/\bTourism Earnings\b/gi, 'சுற்றுலா வருவாய்'],
  [/\bTourist Arrivals\b/gi, 'சுற்றுலாப் பயணிகளின் வருகை'],
  [/\bTea Exports\b/gi, 'தேயிலை ஏற்றுமதி'],
  [/\bCeylon Tea\b/gi, 'சிலோன் தேயிலை'],
  [/\bApparel Exports\b/gi, 'ஆடை ஏற்றுமதி'],
  [/\bOffshore Oil Blocks\b/gi, 'கடல்சார் எண்ணெய் ஆய்வுப் பகுதிகள்'],
  [/\bRenewable Energy\b/gi, 'புதுப்பிக்கத்தக்க எரிசக்தி'],
  [/\bSolar Energy\b/gi, 'சூரிய சக்தி'],
  [/\bWind Energy\b/gi, 'காற்று சக்தி'],
  [/\bState-Owned Enterprises\b/gi, 'அரச தொழில்முயற்சிகள் (SOEs)'],
  [/\bSOEs\b/g, 'அரச தொழில்முயற்சிகள்'],
  [/\bSOE\b/g, 'அரச தொழில்முயற்சி'],
  [/\bCost-Reflective\b/gi, 'செலவுப் பிரதிபலிப்பு'],
  [/\bPrice Formula\b/gi, 'விலை சூத்திரம்'],
  [/\bElectricity Tariff\b/gi, 'மின்சாரக் கட்டணம்'],
  [/\bFeed-in Tariff\b/gi, 'மின்சார கொள்முதல் கட்டணம் (FIT)'],
  [/\bFeed-in Tariffs\b/gi, 'மின்சார கொள்முதல் கட்டண அட்டவணை'],
  [/\bEconomic Growth\b/gi, 'பொருளாதார வளர்ச்சி'],
  [/\bGDP Growth\b/gi, 'மொத்த உள்நாட்டு உற்பத்தி (GDP) வளர்ச்சி'],
  [/\bForeign Direct Investment\b/gi, 'நேரடி வெளிநாட்டு முதலீடு (FDI)'],
  [/\bFDI\b/g, 'நேரடி வெளிநாட்டு முதலீடு'],

  // Verbs & Actions
  [/\bkeeps policy rates unchanged\b/gi, 'கொள்கை வட்டி விகிதங்களை மாற்றமின்றி பராமரிக்கிறது'],
  [/\bmaintains policy rates steady\b/gi, 'கொள்கை வட்டி விகிதங்களை நிலையாகப் பேணுகிறது'],
  [/\bkeeps rates unchanged\b/gi, 'வட்டி விகிதங்களை மாற்றமின்றி பராமரிக்கிறது'],
  [/\bmaintains rates steady\b/gi, 'வட்டி விகிதங்களை நிலையாகப் பேணுகிறது'],
  [/\bgranted formal approval\b/gi, 'அதிகாரப்பூர்வ ஒப்புதல் அளித்தது'],
  [/\bgrants formal approval\b/gi, 'அதிகாரப்பூர்வ ஒப்புதல் அளிக்கிறது'],
  [/\bapproved a private-public partnership\b/gi, 'அரசு-தனியார் கூட்டாண்மைக்கு ஒப்புதல் அளித்தது'],
  [/\bformal approval for the commercial development\b/gi, 'வணிக வளர்ச்சிக்கு உத்தியோகபூர்வ ஒப்புதல்'],
  [/\bcommercial development\b/gi, 'வணிக அபிவிருத்தி'],
  [/\bcontainer terminal development\b/gi, 'கொள்கலன் முனைய அபிவிருத்தி'],
  [/\bcontainer terminal expansion\b/gi, 'கொள்கலன் முனைய விரிவாக்கம்'],
  [/\bport terminal expansion\b/gi, 'துறைமுக முனைய விரிவாக்கம்'],
  [/\bcontainer terminal\b/gi, 'கொள்கலன் முனையம்'],
  [/\bFinance Minister stated that\b/gi, 'நிதியமைச்சர் தெரிவித்ததாவது'],
  [/\bwill oversee operations\b/gi, 'செயல்பாடுகளை மேற்பார்வையிடும்'],
  [/\brevenue sharing with international maritime partners\b/gi, 'சர்வதேச கடல்சார் கூட்டாளர்களுடன் வருவாய் பகிர்வு'],
  [/\bmaritime partners\b/gi, 'கடல்சார் கூட்டாளர்கள்'],
  [/\boversee operations\b/gi, 'செயல்பாடுகளை மேற்பார்வையிடுதல்'],
  [/\bwould exceed\b/gi, 'தாண்டும் என'],
  [/\bover three years\b/gi, 'மூன்று ஆண்டுகளில்'],
  [/\bapproves\b/gi, 'ஒப்புதல் அளிக்கிறது'],
  [/\bapproved\b/gi, 'ஒப்புதல் அளித்தது'],
  [/\bsurpasses\b/gi, 'தாண்டியது'],
  [/\bsurpassed\b/gi, 'தாண்டியது'],
  [/\bcrosses milestone\b/gi, 'மைல்கல்லைத் தாண்டியது'],
  [/\bcrossed milestone\b/gi, 'மைல்கல்லை எட்டியது'],
  [/\brecords surplus\b/gi, 'உபரியைப் பதிவு செய்கிறது'],
  [/\brecorded surplus\b/gi, 'உபரியைப் பதிவு செய்தது'],
  [/\brecords growth\b/gi, 'வளர்ச்சியைப் பதிவு செய்கிறது'],
  [/\brecorded growth\b/gi, 'வளர்ச்சியைப் பதிவு செய்தது'],
  [/\btumbles\b/gi, 'சரிந்தது'],
  [/\btumbled\b/gi, 'சரிந்தது'],
  [/\bdrops\b/gi, 'குறைந்தது'],
  [/\bdropped\b/gi, 'குறைந்தது'],
  [/\bsurges\b/gi, 'பாய்ச்சல் அடைந்தது'],
  [/\bsurged\b/gi, 'பாய்ச்சல் அடைந்தது'],
  [/\bclimbs\b/gi, 'உயர்ந்தது'],
  [/\bclimbed\b/gi, 'உயர்ந்தது'],
  [/\breaches\b/gi, 'எட்டியது'],
  [/\breached\b/gi, 'எட்டியது'],
  [/\btouches\b/gi, 'தொட்டது'],
  [/\btouched\b/gi, 'தொட்டது'],
  [/\bfinalizes\b/gi, 'இறுதி செய்கிறது'],
  [/\bfinalized\b/gi, 'இறுதி செய்தது'],
  [/\bunveils\b/gi, 'வெளியிடுகிறது'],
  [/\bunveiled\b/gi, 'வெளியிட்டது'],
  [/\blaunches\b/gi, 'தொடங்குகிறது'],
  [/\blaunched\b/gi, 'தொடங்கியது'],
  [/\bconfirms\b/gi, 'உறுதிப்படுத்துகிறது'],
  [/\bconfirmed\b/gi, 'உறுதிப்படுத்தியது'],
  [/\baffirms\b/gi, 'மீண்டும் உறுதிப்படுத்துகிறது'],
  [/\baffirmed\b/gi, 'மீண்டும் உறுதிப்படுத்தியது'],
  [/\bpasses\b/gi, 'நிறைவேற்றுகிறது'],
  [/\bpassed\b/gi, 'நிறைவேற்றியது'],

  // Units, Time & Words
  [/\bTrillion\b/gi, 'டிரில்லியன்'],
  [/\bBillion\b/gi, 'பில்லியன்'],
  [/\bMillion\b/gi, 'மில்லியன்'],
  [/\bPercent\b/gi, 'சதவீதம்'],
  [/\bBasis Points\b/gi, 'அடிப்படை புள்ளிகள்'],
  [/\bbps\b/gi, 'அடிப்படை புள்ளிகள் (bps)'],
  [/\bUS Dollars\b/gi, 'அமெரிக்க டாலர்கள்'],
  [/\bUSD\b/g, 'அமெரிக்க டாலர்'],
  [/\bLKR\b/g, 'ரூபாய்'],
  [/\bRupees\b/gi, 'ரூபாய்'],
  [/\bRupee\b/gi, 'ரூபாய்'],
  [/\bYoY\b/gi, 'ஆண்டுக்கு ஆண்டு'],
  [/\bMoM\b/gi, 'மாதந்தோறும்'],
  [/\bTuesday\b/gi, 'செவ்வாய்க்கிழமை'],
  [/\bWednesday\b/gi, 'புதன்கிழமை'],
  [/\bThursday\b/gi, 'வியாழக்கிழமை'],
  [/\bFriday\b/gi, 'வெள்ளிக்கிழமை'],
  [/\bSaturday\b/gi, 'சனிக்கிழமை'],
  [/\bSunday\b/gi, 'ஞாயிற்றுக்கிழமை'],
  [/\bMonday\b/gi, 'திங்கட்கிழமை'],
  [/\bJanuary\b/gi, 'ஜனவரி'],
  [/\bFebruary\b/gi, 'பிப்ரவரி'],
  [/\bMarch\b/gi, 'மார்ச்'],
  [/\bApril\b/gi, 'ஏப்ரல்'],
  [/\bMay\b/gi, 'மே'],
  [/\bJune\b/gi, 'ஜூன்'],
  [/\bJuly\b/gi, 'ஜூலை'],
  [/\bAugust\b/gi, 'ஆகஸ்ட்'],
  [/\bSeptember\b/gi, 'செப்டம்பர்'],
  [/\bOctober\b/gi, 'அக்டோபர்'],
  [/\bNovember\b/gi, 'நவம்பர்'],
  [/\bDecember\b/gi, 'டிசம்பர்'],
  [/\bGovernment of Sri Lanka\b/gi, 'இலங்கை அரசாங்கம்'],
  [/\bGovernment\b/gi, 'அரசாங்கம்'],
  [/\bSri Lanka\b/gi, 'இலங்கை'],
];

/**
 * Translates an arbitrary English text string into natural Sinhala
 */
export function translateTextToSinhala(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let res = text;

  // Protect currencies like $500 Million -> ඩොලර් 500 මිලියන
  res = res.replace(/\$\s*(\d+(?:\.\d+)?)\s*(Billion|Million|Trillion)/gi, '$1 $2 ඇමරිකානු ඩොලර්');
  res = res.replace(/\$\s*(\d+(?:\.\d+)?)/g, 'ඇමරිකානු ඩොලර් $1');
  res = res.replace(/Rs\.?\s*(\d+(?:\.\d+)?)\s*(Billion|Million|Trillion|bn|mn)/gi, '$1 $2 රුපියල්');
  res = res.replace(/Rs\.?\s*(\d+(?:\.\d+)?)/g, 'රුපියල් $1');

  for (const [regex, replacement] of SINHALA_TERMS) {
    res = res.replace(regex, replacement);
  }

  // Cleanup dangling English prepositions/conjunctions in news headlines & decks
  res = res.replace(/\bworth\b/gi, 'වටිනාකමකින් යුත්');
  res = res.replace(/\bfor\b/gi, 'සඳහා');
  res = res.replace(/\bwith\b/gi, 'සහිත');
  res = res.replace(/\band\b/gi, 'සහ');
  res = res.replace(/\bas\b/gi, 'හේතුවෙන්');
  res = res.replace(/\bfrom\b/gi, 'සිට');
  res = res.replace(/\bto\b/gi, 'දක්වා');
  res = res.replace(/\bin\b/gi, 'තුළ');
  res = res.replace(/\bon\b/gi, 'මත');
  res = res.replace(/\bafter\b/gi, 'පසුව');
  res = res.replace(/\bduring\b/gi, 'අතරතුර');
  res = res.replace(/\bacross\b/gi, 'පුරා');
  res = res.replace(/\bunder\b/gi, 'යටතේ');
  res = res.replace(/\bfollowing\b/gi, 'අනතුරුව');
  res = res.replace(/\bdue to\b/gi, 'හේතුවෙන්');
  res = res.replace(/\bahead of\b/gi, 'පෙර');
  res = res.replace(/\btargets\b/gi, 'ඉලක්ක');
  res = res.replace(/\baims to\b/gi, 'අපේක්ෂා කරයි');
  res = res.replace(/\bsets\b/gi, 'නියම කරයි');
  res = res.replace(/\bexpected to\b/gi, 'අපේක්ෂිත');
  res = res.replace(/\bmajor\b/gi, 'ප්‍රධාන');
  res = res.replace(/\bnew\b/gi, 'නව');
  res = res.replace(/\bglobal\b/gi, 'ගෝලීය');
  res = res.replace(/\binternational\b/gi, 'ජාත්‍යන්තර');
  res = res.replace(/\bdomestic\b/gi, 'දේශීය');
  res = res.replace(/\bnational\b/gi, 'ජාතික');
  res = res.replace(/\blocal\b/gi, 'දේශීය');
  res = res.replace(/\bforeign\b/gi, 'විදේශීය');
  res = res.replace(/\breport\b/gi, 'වාර්තාව');
  res = res.replace(/\breports\b/gi, 'වාර්තා');
  res = res.replace(/\banalysis\b/gi, 'විශ්ලේෂණය');
  res = res.replace(/\bofficial\b/gi, 'නිල');
  res = res.replace(/\bofficials\b/gi, 'නිලධාරීන්');
  res = res.replace(/\bminister\b/gi, 'අමාත්‍යවරයා');
  res = res.replace(/\bspokesman\b/gi, 'ප්‍රකාශකයා');
  res = res.replace(/\bstatement\b/gi, 'නිවේදනය');

  // Strip residual English particles
  res = res.replace(/\b(the|a|an|of)\b/gi, ' ');

  return res.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Translates an arbitrary English text string into natural Tamil
 */
export function translateTextToTamil(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let res = text;

  // Protect currencies like $500 Million -> 500 மில்லியன் டாலர்
  res = res.replace(/\$\s*(\d+(?:\.\d+)?)\s*(Billion|Million|Trillion)/gi, '$1 $2 அமெரிக்க டாலர்');
  res = res.replace(/\$\s*(\d+(?:\.\d+)?)/g, '$1 அமெரிக்க டாலர்');
  res = res.replace(/Rs\.?\s*(\d+(?:\.\d+)?)\s*(Billion|Million|Trillion|bn|mn)/gi, '$1 $2 ரூபாய்');
  res = res.replace(/Rs\.?\s*(\d+(?:\.\d+)?)/g, 'ரூபாய் $1');

  for (const [regex, replacement] of TAMIL_TERMS) {
    res = res.replace(regex, replacement);
  }

  // Cleanup dangling English prepositions/conjunctions in news headlines & decks
  res = res.replace(/\bworth\b/gi, 'மதிப்பிலான');
  res = res.replace(/\bfor\b/gi, 'வழங்க');
  res = res.replace(/\bwith\b/gi, 'உடன்');
  res = res.replace(/\band\b/gi, 'மற்றும்');
  res = res.replace(/\bas\b/gi, 'காரணமாக');
  res = res.replace(/\bfrom\b/gi, 'இருந்து');
  res = res.replace(/\bto\b/gi, 'வரை');
  res = res.replace(/\bin\b/gi, 'இல்');
  res = res.replace(/\bon\b/gi, 'மீது');
  res = res.replace(/\bafter\b/gi, 'பின்னர்');
  res = res.replace(/\bduring\b/gi, 'போது');
  res = res.replace(/\bacross\b/gi, 'முழுவதும்');
  res = res.replace(/\bunder\b/gi, 'கீழ்');
  res = res.replace(/\bfollowing\b/gi, 'தொடர்ந்து');
  res = res.replace(/\bdue to\b/gi, 'காரணமாக');
  res = res.replace(/\bahead of\b/gi, 'முன்னதாக');
  res = res.replace(/\btargets\b/gi, 'இலக்குகள்');
  res = res.replace(/\baims to\b/gi, 'நோக்கமாகக் கொண்டுள்ளது');
  res = res.replace(/\bsets\b/gi, 'நிர்ணயிக்கிறது');
  res = res.replace(/\bexpected to\b/gi, 'எதிர்பார்க்கப்படுகிறது');
  res = res.replace(/\bmajor\b/gi, 'முக்கிய');
  res = res.replace(/\bnew\b/gi, 'புதிய');
  res = res.replace(/\bglobal\b/gi, 'உலகளாவிய');
  res = res.replace(/\binternational\b/gi, 'சர்வதேச');
  res = res.replace(/\bdomestic\b/gi, 'உள்நாட்டு');
  res = res.replace(/\bnational\b/gi, 'தேசிய');
  res = res.replace(/\blocal\b/gi, 'உள்ளூர்');
  res = res.replace(/\bforeign\b/gi, 'வெளிநாட்டு');
  res = res.replace(/\breport\b/gi, 'அறிக்கை');
  res = res.replace(/\breports\b/gi, 'அறிக்கைகள்');
  res = res.replace(/\banalysis\b/gi, 'பகுப்பாய்வு');
  res = res.replace(/\bofficial\b/gi, 'அதிகாரப்பூர்வ');
  res = res.replace(/\bofficials\b/gi, 'அதிகாரிகள்');
  res = res.replace(/\bminister\b/gi, 'அமைச்சர்');
  res = res.replace(/\bstatement\b/gi, 'அறிக்கை');

  // Strip residual English particles
  res = res.replace(/\b(the|a|an|of)\b/gi, ' ');

  return res.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Translates multi-paragraph journalistic body text while preserving embedded images & side-by-side photo grids
 */
export function translateArticleBody(body: string, lang: 'si' | 'ta'): string {
  if (!body) return '';

  const paragraphs = body.split(/\n\s*\n/);
  const translateFn = lang === 'si' ? translateTextToSinhala : translateTextToTamil;

  const translatedParas = paragraphs.map((p) => {
    const trimmed = p.trim();
    if (!trimmed) return '';

    // 1. Preserve and translate :::side-by-side ... ::: blocks
    const sbsMatch = trimmed.match(/^:::(side-by-side|image-grid)([^\n]*)([\s\S]*?):::$/i);
    if (sbsMatch) {
      const tag = sbsMatch[1];
      let header = sbsMatch[2] || '';
      const capMatch = header.match(/caption=["'](.*?)["']/i);
      if (capMatch && capMatch[1]) {
        const transCap = translateFn(capMatch[1]);
        header = header.replace(/caption=["'](.*?)["']/i, `caption="${transCap}"`);
      }
      let inner = sbsMatch[3] || '';
      // Translate image captions in markdown: ![caption](url)
      inner = inner.replace(/!\[(.*?)\]\((.*?)\)/g, (_m, caption, url) => {
        const transImgCap = caption ? translateFn(caption) : '';
        return `![${transImgCap}](${url})`;
      });

      return `:::${tag}${header}${inner}:::`;
    }

    // 2. Preserve and translate single markdown image: ![caption](url)
    const singleImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (singleImgMatch) {
      const caption = singleImgMatch[1];
      const url = singleImgMatch[2];
      const transCap = caption ? translateFn(caption) : '';
      return `![${transCap}](${url})`;
    }

    // 3. Preserve and translate two adjacent markdown images
    const twoImgMatches = Array.from(trimmed.matchAll(/!\[(.*?)\]\((.*?)\)/g));
    const nonImg = trimmed.replace(/!\[(.*?)\]\((.*?)\)/g, '').trim();
    if (twoImgMatches.length === 2 && nonImg.length === 0) {
      const img1 = `![${twoImgMatches[0][1] ? translateFn(twoImgMatches[0][1]) : ''}](${twoImgMatches[0][2]})`;
      const img2 = `![${twoImgMatches[1][1] ? translateFn(twoImgMatches[1][1]) : ''}](${twoImgMatches[1][2]})`;
      return `${img1}\n${img2}`;
    }

    // 4. Preserve HTML figure or image tags
    if (trimmed.includes('<figure') || trimmed.includes('<img') || trimmed.includes('story-images-grid')) {
      let html = trimmed;
      html = html.replace(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/gi, (_m, inner) => {
        return `<figcaption>${translateFn(inner)}</figcaption>`;
      });
      return html;
    }

    // 5. Standard paragraph translation
    return translateFn(trimmed);
  });

  return translatedParas.filter(Boolean).join('\n\n');
}

/**
 * Translates an article object completely into Sinhala or Tamil
 */
export function translateFinancialArticle(
  article: {
    title: string;
    deck?: string;
    body?: string;
    primary_category?: string;
  },
  targetLang: 'si' | 'ta'
): { title: string; deck: string; body: string; primary_category: string } {
  const catKey = (article.primary_category || 'ECONOMY').toUpperCase().trim();
  const categoryTrans = CATEGORY_TRANSLATIONS[catKey]
    ? CATEGORY_TRANSLATIONS[catKey][targetLang]
    : targetLang === 'si'
    ? 'ආර්ථිකය'
    : 'பொருளாதாரம்';

  const rawTitle = article.title || '';
  const rawDeck = article.deck || rawTitle;
  const rawBody = article.body || rawDeck;

  if (targetLang === 'si') {
    return {
      title: translateTextToSinhala(rawTitle),
      deck: translateTextToSinhala(rawDeck),
      body: translateArticleBody(rawBody, 'si'),
      primary_category: categoryTrans,
    };
  } else {
    return {
      title: translateTextToTamil(rawTitle),
      deck: translateTextToTamil(rawDeck),
      body: translateArticleBody(rawBody, 'ta'),
      primary_category: categoryTrans,
    };
  }
}

/**
 * Helper to generate both Sinhala and Tamil translations simultaneously.
 * Used when saving new articles to the store.
 */
export function generateArticleBothTranslations(
  title: string,
  deck: string,
  body: string,
  category: string
): {
  si: { title: string; deck: string; body: string; primary_category: string };
  ta: { title: string; deck: string; body: string; primary_category: string };
} {
  const si = translateFinancialArticle({ title, deck, body, primary_category: category }, 'si');
  const ta = translateFinancialArticle({ title, deck, body, primary_category: category }, 'ta');
  return { si, ta };
}
