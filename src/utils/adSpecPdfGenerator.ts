import { jsPDF } from 'jspdf';
import { LANKAECON_AD_SLOTS } from '../data/adSlotsData';

export function generateAdSpecPdf(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // ----------------------------------------------------
  // PAGE 1: COVER & VISUAL PLACEMENT BLUEPRINT
  // ----------------------------------------------------

  // Header Banner
  doc.setFillColor(11, 30, 54); // #0B1E36 - Deep Navy
  doc.rect(margin, y, pageWidth - margin * 2, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('LANKAECON INTELLIGENCE NETWORK', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253); // light blue
  doc.text('Commercial Advertising Slots, Dimensions & Placement Architecture Spec Sheet', margin + 6, y + 14);
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Official Document Ref: SPEC-AD-2026-v2.6  •  Generated: ${new Date().toLocaleDateString('en-GB')}`, margin + 6, y + 20);

  y += 30;

  // Executive Introduction
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. PURPOSE & SLOT ISOLATION ARCHITECTURE', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const introText = 
    'This technical specification sheet outlines the 5 standardized commercial advertisement placement slots across the LankaEcon digital publication. ' +
    'Each placement slot is strictly isolated in the publishing engine, ensuring that an advertisement assigned to one designated slot never leaks, duplicates, ' +
    'or bleeds into other slots. Advertisers may book distinct creative campaigns tailored specifically to individual target zones on the page.';
  const splitIntro = doc.splitTextToSize(introText, pageWidth - margin * 2);
  doc.text(splitIntro, margin, y);
  y += splitIntro.length * 4.5 + 4;

  // Visual Layout Blueprint (Wireframe Map)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. VISUAL PAGE LAYOUT & AD SLOT WIREFRAME MAP', margin, y);
  y += 5;

  // Draw newspaper visual layout container
  const wireframeWidth = pageWidth - margin * 2;
  const wireframeHeight = 90;
  const startX = margin;
  const startY = y;

  // Background canvas for wireframe
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(startX, startY, wireframeWidth, wireframeHeight, 'FD');

  // Wireframe Header Bar: Slot #1 (header_banner)
  doc.setFillColor(11, 30, 54);
  doc.rect(startX + 3, startY + 3, wireframeWidth - 6, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SLOT 1: MASTHEAD SUPER-LEADERBOARD [header_banner] (970 x 90 px - Full Width)', startX + 6, startY + 9);

  // Masthead bar
  doc.setFillColor(226, 232, 240);
  doc.rect(startX + 3, startY + 15, wireframeWidth - 6, 6, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.text('LANKAECON MASTHEAD & PRIMARY NAVIGATION BAR', startX + 6, startY + 19);

  // Split into Center News Column (70%) and Right Sidebar Column (30%)
  const colGap = 4;
  const leftColWidth = (wireframeWidth - 6 - colGap) * 0.68;
  const rightColWidth = (wireframeWidth - 6 - colGap) * 0.32;
  const colLeftX = startX + 3;
  const colRightX = colLeftX + leftColWidth + colGap;
  const colStartY = startY + 23;

  // Left Column Layout:
  // 1. Breaking ribbon
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.rect(colLeftX, colStartY, leftColWidth, 4, 'FD');
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(6);
  doc.text('BREAKING MACROECONOMIC UPDATES RIBBON', colLeftX + 3, colStartY + 3);

  // 2. Slot #2 (hero_top_updates)
  doc.setFillColor(2, 132, 199);
  doc.rect(colLeftX, colStartY + 5.5, leftColWidth, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SLOT 2: TOP HERO UPDATES BILLBOARD [hero_top_updates] (728 x 90 px)', colLeftX + 3, colStartY + 11.5);

  // 3. Lead Article Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(colLeftX, colStartY + 16, leftColWidth, 11, 'FD');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('LEAD EDITORIAL STORY & MACRO INTELLIGENCE (Stories #1, #2, #3)', colLeftX + 3, colStartY + 23);

  // 4. Slot #4 (feed_inline_1)
  doc.setFillColor(5, 150, 105);
  doc.rect(colLeftX, colStartY + 28.5, leftColWidth, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SLOT 4: FEED INLINE MPU #1 (MID-FEED) [feed_inline_1] (300 x 250 px • 6:5)', colLeftX + 3, colStartY + 34.5);

  // 5. Secondary Stories
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(colLeftX, colStartY + 39, leftColWidth, 8, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('SECONDARY EDITORIAL NEWS STREAM (Stories #5, #6, #7)', colLeftX + 3, colStartY + 44.5);

  // 6. Slot #5 (feed_inline_2)
  doc.setFillColor(13, 148, 136);
  doc.rect(colLeftX, colStartY + 48.5, leftColWidth, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SLOT 5: FEED INLINE MPU #2 (BOTTOM-FEED) [feed_inline_2] (300 x 250 px • 6:5)', colLeftX + 3, colStartY + 54.5);

  // Right Column Layout:
  // 1. Slot #3 (sidebar_top)
  doc.setFillColor(220, 38, 38);
  doc.rect(colRightX, colStartY, rightColWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SLOT 3: TOP SIDEBAR BILLBOARD', colRightX + 3, colStartY + 6.5);
  doc.setFontSize(6);
  doc.text('[sidebar_top] (300 x 250 / 350 px)', colRightX + 3, colStartY + 12);

  // 2. CSE Market Watch Tickers
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(colRightX, colStartY + 17.5, rightColWidth, 12, 'FD');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('LIVE CSE STOCK TICKER', colRightX + 3, colStartY + 23);
  doc.text('& CBSL BENCHMARK RATES', colRightX + 3, colStartY + 27.5);

  // 3. Slot #6 (sidebar_widget)
  doc.setFillColor(124, 58, 237);
  doc.rect(colRightX, colStartY + 31, rightColWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SLOT 6: LOWER SIDEBAR WIDGET', colRightX + 3, colStartY + 38);
  doc.setFontSize(6);
  doc.text('[sidebar_widget] (300 x 250 px)', colRightX + 3, colStartY + 43.5);

  // 4. Currency & Gold Panel
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(colRightX, colStartY + 48.5, rightColWidth, 9, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('CURRENCIES & GOLD RATES', colRightX + 3, colStartY + 54);

  y += wireframeHeight + 8;

  // Master Summary Rate & Dimension Cards
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. COMPREHENSIVE ADVERTISING SLOT DIRECTORY', margin, y);
  y += 5;

  LANKAECON_AD_SLOTS.forEach((slot, idx) => {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2, 2, 'FD');

    // Color tag pill
    doc.setFillColor(slot.wireframeColor);
    doc.rect(margin, y, 4, 24, 'F');

    // Title & Technical Identifier
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${idx + 1}. ${slot.displayName}`, margin + 8, y + 6);

    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`Slot Key: ${slot.slotLocation}`, margin + 8, y + 11);

    // Dimension & Pricing Pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129);
    doc.text(`LKR ${slot.priceLKR.toLocaleString()} / USD $${slot.priceUSD} (30 Days)`, pageWidth - margin - 75, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Dimensions: ${slot.recommendedDimensions}`, margin + 8, y + 16);
    doc.text(`Estimated Reach: ${slot.estimatedImpressions}`, margin + 8, y + 21);
    doc.text(`Hierarchy: ${slot.exactPlacementHierarchy}`, pageWidth - margin - 95, y + 16);

    y += 27;
  });

  // ----------------------------------------------------
  // PAGE 2: TECHNICAL CREATIVE SPECS & ACCOUNTING INTEGRATION
  // ----------------------------------------------------
  doc.addPage();
  y = margin;

  // Header Bar Page 2
  doc.setFillColor(11, 30, 54);
  doc.rect(margin, y, pageWidth - margin * 2, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. TECHNICAL CREATIVE SPECIFICATIONS & GUIDELINES', margin + 6, y + 9);
  y += 20;

  // Table of Specs
  const specs = [
    ['Accepted Graphic Formats', 'PNG (Lossless), JPEG (Max Quality), WebP, Vector SVG, Animated GIF (Banner only)'],
    ['Maximum File Size', '5.0 Megabytes (Optimized for instant page load speed across Sri Lankan mobile networks)'],
    ['Target Landing URLs', 'Must be valid HTTPS secure URLs with direct advertiser verification (Phone/WhatsApp enabled)'],
    ['Banner Graphic Ratio', 'Header: 10.7:1  |  Hero: 8.1:1  |  Sidebar: 1.2:1 / 1:1  |  Feed Inline: 4:1'],
    ['Editorial Card Formats', 'Includes Company Title, Verified Category Badge, Sub-Headline Tagline, and Live Telephone Link'],
    ['Strict Slot Independence', 'Creative uploaded to a slot is bound exclusively to that slot ID and will not appear elsewhere'],
  ];

  specs.forEach(([label, value]) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, 60, 11, 'FD');
    doc.rect(margin + 60, y, pageWidth - margin * 2 - 60, 11, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label, margin + 3, y + 7);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(value, margin + 63, y + 7);

    y += 12;
  });

  y += 6;

  // Section 5: Financial Accounting, Invoicing & Tax Compliance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('5. FINANCIAL ACCOUNTING, BANK VERIFICATION & IRD TAX COMPLIANCE', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const finText =
    'LankaEcon operates a 100% compliant zero-base double-entry ERP general ledger adhering to Sri Lanka Accounting Standards (LKAS/SLFRS) ' +
    'and Inland Revenue Department (IRD) Tax Regulations (VAT 18% and SSCL 2.5%). When an advertisement is approved and paid:';
  const splitFin = doc.splitTextToSize(finText, pageWidth - margin * 2);
  doc.text(splitFin, margin, y);
  y += splitFin.length * 4.5 + 4;

  const accountingSteps = [
    ['1. Official IRD Tax Invoicing', 'An automated official Tax Invoice is generated with unique serial (INV-LKECON-2026-XXX), TRN/VAT numbers, 18% VAT, and 2.5% Social Security Contribution Levy.'],
    ['2. Corporate Bank Reconciliations', 'Direct deposits routed to Commercial Bank of Ceylon Corporate Current A/C #8810 2930 19 or Bank of Ceylon A/C #7029 1029 01 are verified by staff.'],
    ['3. Automated Double-Entry Ledger', 'The central accounting platform automatically posts Credits to Corporate Ad Sales Revenue (#4200) and Debits to Bank & Cash Assets (#1010) with full audit trail.'],
    ['4. Publishing & Campaign Lifetime', 'Upon payment reconciliation, the ad status transitions to "active" and the campaign is published live with impression and click tracking enabled.'],
  ];

  accountingSteps.forEach(([stepTitle, stepDesc]) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, pageWidth - margin * 2, 14, 'FD');

    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(stepTitle, margin + 4, y + 5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(stepDesc, margin + 4, y + 10);

    y += 16;
  });

  y += 4;

  // Contact Footer Box
  doc.setFillColor(11, 30, 54);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('LANKAECON COMMERCIAL & ADVERTISING OPERATIONS DESK', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Colombo 01, Sri Lanka  •  Email: ads@lankaecon.lk / finance@lankaecon.lk  •  Phone: +94 11 234 5678', margin + 6, y + 13);
  doc.text('Online Booking & Client Portal: https://lankaecon.lk/advertise  •  Commercial Bank A/C: 8810 2930 19', margin + 6, y + 18);

  return doc;
}

export function downloadAdSpecPdf(filename = 'LankaEcon_Advertising_Slot_Architecture_Spec_Sheet.pdf'): void {
  const doc = generateAdSpecPdf();
  doc.save(filename);
}
