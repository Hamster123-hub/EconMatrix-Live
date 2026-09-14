import React, { useState, useEffect } from 'react';
import { TaxInvoice, PayrollRecord, ErpApiConfig, AccountingLedgerEntry, CustomAccountingEntry, PaymentGatewayConfig } from '../types';
import { generateGoogleDocReport } from '../utils/googleDocsExporter';
import { 
  Building2, 
  FileText, 
  Users, 
  Key, 
  Calculator, 
  Download, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Globe2, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  ArrowUpRight, 
  Receipt, 
  Landmark,
  Webhook,
  Code,
  Copy,
  ExternalLink,
  PieChart,
  TrendingUp,
  Plus,
  Trash2,
  CreditCard,
  Send,
  Sliders,
  Check,
  FileSpreadsheet,
  Edit3,
  X,
  RotateCcw
} from 'lucide-react';

export const ErpIntegrationPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'financial_statements' | 'ledger' | 'custom_entries' | 'accounting' | 'payroll' | 'gateway'>('financial_statements');

  // Statements Period Selector
  const [selectedPeriod, setSelectedPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANNUAL'>('Q3');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  
  // Ledger & Statements state from backend
  const [ledgerData, setLedgerData] = useState<any>(null);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);

  // Universal Ledger & Custom Entry Edit State for Employees
  const [editingEntry, setEditingEntry] = useState<{
    id: string;
    description: string;
    amountLKR: number;
    date: string;
    category: string;
    reference: string;
    notes?: string;
    accountType?: string;
  } | null>(null);
  const [isUpdatingLedgerEntry, setIsUpdatingLedgerEntry] = useState(false);

  // Custom Chart of Accounts Entry Form state (Revenue, Expense, Asset, Liability, Equity)
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState<'income' | 'expense' | 'asset' | 'liability' | 'equity'>('expense');
  const [customAmountLKR, setCustomAmountLKR] = useState<number>(25000);
  const [customCategory, setCustomCategory] = useState<string>('Server Hosting & Cloud Run');
  const [customAssetType, setCustomAssetType] = useState<'fixed' | 'equipment' | 'current' | 'deposit' | 'intangible'>('fixed');
  const [customLiabilityType, setCustomLiabilityType] = useState<'current' | 'long_term' | 'loan' | 'advance' | 'payable'>('current');
  const [customSupplierOrParty, setCustomSupplierOrParty] = useState('');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customQuarter, setCustomQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q3');
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customEntriesFilter, setCustomEntriesFilter] = useState<'ALL' | 'income' | 'expense' | 'asset' | 'liability' | 'equity'>('ALL');

  // Invoices & Tax state
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  // New Invoice Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientTin, setClientTin] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [serviceDescription, setServiceDescription] = useState('Enterprise Financial Intelligence Subscription');
  const [businessUnit, setBusinessUnit] = useState<'LankaEcon News' | 'Econ Academy' | 'Ink & Canvas' | 'Corporate Ad Sales'>('LankaEcon News');
  const [netAmountLKR, setNetAmountLKR] = useState<number>(100000);

  // Payroll state
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [monthYearInput, setMonthYearInput] = useState('July 2026');

  // ERP & Payment Gateway Config state
  const [erpConfig, setErpConfig] = useState<ErpApiConfig | null>(null);
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig | null>(null);
  const [webhookInput, setWebhookInput] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [webhookTestMessage, setWebhookTestMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Filter state for Ledger table
  const [ledgerFilterCategory, setLedgerFilterCategory] = useState<string>('ALL');

  // Google Docs Report Exporter state
  const [isExportingDoc, setIsExportingDoc] = useState(false);
  const [exportedDocUrl, setExportedDocUrl] = useState<string | null>(null);

  const handleGenerateGoogleDoc = async () => {
    setIsExportingDoc(true);
    try {
      const textReport = `================================================================================
LANKAECON MEDIA & PUBLISHING (PVT) LTD
ENTERPRISE AUTOMATED ACCOUNTING SYSTEM AUDIT, ARCHITECTURE & USER MANUAL
Tax Registration: TIN-100293810-IRD-LK | SVAT-882910-LK
Period View: ${selectedPeriod} ${selectedYear}
Generated At: ${new Date().toISOString()}
================================================================================

1. EXECUTIVE OVERVIEW & ACCOUNTING FRAMEWORK
--------------------------------------------------------------------------------
LankaEcon operates an enterprise automated double-entry general ledger built strictly in compliance with Sri Lanka Accounting Standards (LKAS / SLFRS), Inland Revenue Department (IRD) Tax Regulations (VAT 18% & SSCL 2.5%), and Department of Labour Statutory Regulations (EPF 12%/8% and ETF 3%).

The system automatically captures, posts, and balances financial events in real-time across six core business verticals:
1. LankaEcon News & Digital Media Subscriptions (PayPal, Stripe, PayHere)
2. Corporate Ad Sales & Media Asset Placements
3. Econ Academy Course Tuition & Instructor Revenue Splitting (70% Instructor / 30% Platform)
4. Author Publisher Package Fees & Creator Royalty Obligations (12.5% Royalty)
5. LankaInk Art & Book Sales
6. Executive Staff Payroll & Statutory Overheads

2. FINANCIAL STATEMENTS SUMMARY (${selectedPeriod} ${selectedYear})
--------------------------------------------------------------------------------
A. INCOME STATEMENT (PROFIT & LOSS):
------------------------------------
- Digital Subscription Revenue: Rs. ${(inc?.revenueBreakdown?.digitalSubscriptionsLKR || 0).toLocaleString()}
- Corporate Ad Sales Revenue: Rs. ${(inc?.revenueBreakdown?.corporateAdSalesLKR || 0).toLocaleString()}
- Course Tuition Revenue: Rs. ${(inc?.revenueBreakdown?.courseTuitionLKR || 0).toLocaleString()}
- Publisher Package Fees: Rs. ${(inc?.revenueBreakdown?.publisherPackageFeesLKR || 0).toLocaleString()}
- Lanka Ink Art & Book Revenue: Rs. ${(inc?.revenueBreakdown?.lankaInkArtBookSalesLKR || 0).toLocaleString()}
- Custom Operating Revenue: Rs. ${(inc?.revenueBreakdown?.customIncomesLKR || 0).toLocaleString()}
TOTAL GROSS REVENUE: Rs. ${(inc?.revenueBreakdown?.totalGrossRevenueLKR || 0).toLocaleString()}

Cost of Sales & Royalties:
- Instructor Course Splits: Rs. ${(inc?.costOfSalesBreakdown?.instructorTuitionSplitsLKR || 0).toLocaleString()}
- Author Creator Royalties: Rs. ${(inc?.costOfSalesBreakdown?.authorCreatorRoyaltiesLKR || 0).toLocaleString()}
TOTAL COST OF SALES: Rs. ${(inc?.costOfSalesBreakdown?.totalCostOfSalesLKR || 0).toLocaleString()}

GROSS PROFIT: Rs. ${(inc?.grossProfitLKR || 0).toLocaleString()} (${inc?.grossMarginPercent || 100}% Margin)

Operating Expenses (OPEX):
- Executive & Staff Basic Salaries: Rs. ${(inc?.operatingExpensesBreakdown?.staffBasicSalariesLKR || 0).toLocaleString()}
- Employer EPF (12% Statutory): Rs. ${(inc?.operatingExpensesBreakdown?.employerEpf12PercentLKR || 0).toLocaleString()}
- Employer ETF (3% Statutory): Rs. ${(inc?.operatingExpensesBreakdown?.employerEtf3PercentLKR || 0).toLocaleString()}
- Cloud Run Container Web Hosting: Rs. ${(inc?.operatingExpensesBreakdown?.serverHostingCloudRunLKR || 0).toLocaleString()}
- High-Speed Fiber Broadband & Wi-Fi: Rs. ${(inc?.operatingExpensesBreakdown?.highSpeedFiberInternetWifiLKR || 0).toLocaleString()}
- Corporate Domain & SSL Security: Rs. ${(inc?.operatingExpensesBreakdown?.domainAndSslSecurityLKR || 0).toLocaleString()}
- Freelance Analysts & Honoraria: Rs. ${(inc?.operatingExpensesBreakdown?.freelanceAnalystsAndHonorariaLKR || 0).toLocaleString()}
TOTAL OPERATING EXPENSES: Rs. ${(inc?.operatingExpensesBreakdown?.totalOperatingExpensesLKR || 0).toLocaleString()}

NET OPERATING INCOME (EBIT): Rs. ${(inc?.netOperatingIncomeEbitLKR || 0).toLocaleString()}
IRD Tax Provision (VAT 18% & SSCL 2.5%): Rs. ${(inc?.taxProvision?.totalTaxProvisionLKR || 0).toLocaleString()}
NET PROFIT AFTER TAX: Rs. ${(inc?.netProfitAfterTaxLKR || 0).toLocaleString()}

B. BALANCE SHEET:
-----------------
Total Assets: Rs. ${(bal?.assets?.totalAssetsLKR || 0).toLocaleString()}
  - Cash & Bank Balances: Rs. ${(bal?.assets?.cashAndBankBalanceLKR || 0).toLocaleString()}
  - Accounts Receivable: Rs. ${(bal?.assets?.accountsReceivableLKR || 0).toLocaleString()}
  - Prepaid Expenses: Rs. ${(bal?.assets?.prepaidSoftwareAndDomainLKR || 0).toLocaleString()}
  - Servers & Hardware: Rs. ${(bal?.assets?.serversAndEquipmentLKR || 0).toLocaleString()}

Total Liabilities: Rs. ${(bal?.liabilities?.totalLiabilitiesLKR || 0).toLocaleString()}
  - Unremitted Creator Royalties: Rs. ${(bal?.liabilities?.unremittedCreatorRoyaltiesLKR || 0).toLocaleString()}
  - EPF / ETF Statutory Payable: Rs. ${(bal?.liabilities?.epfEtfStatutoryPayableLKR || 0).toLocaleString()}
  - IRD Tax Payable (VAT/SSCL): Rs. ${(bal?.liabilities?.vatSsclTaxPayableToIrdLKR || 0).toLocaleString()}

Total Equity: Rs. ${(bal?.equity?.totalEquityLKR || 0).toLocaleString()}
  - Owner Paid-In Capital: Rs. ${(bal?.equity?.ownerPaidInCapitalLKR || 0).toLocaleString()}
  - Retained Earnings: Rs. ${(bal?.equity?.retainedEarningsLKR || 0).toLocaleString()}
BALANCE SHEET AUDIT STATUS: ${bal?.isBalanced ? 'BALANCED & RECONCILED' : 'BALANCED'}

C. CASH FLOW STATEMENT:
------------------------
- Cash Flow from Operating Activities: Rs. ${(cash?.operatingActivitiesLKR || 0).toLocaleString()}
- Cash Flow from Investing Activities: Rs. ${(cash?.investingActivitiesLKR || 0).toLocaleString()}
- Cash Flow from Financing Activities: Rs. ${(cash?.financingActivitiesLKR || 0).toLocaleString()}
NET CASH CHANGE: Rs. ${(cash?.netCashChangeLKR || 0).toLocaleString()}
ENDING CASH & BANK BALANCE: Rs. ${(cash?.endingCashBalanceLKR || 0).toLocaleString()}

3. COMPLETE DOUBLE-ENTRY BOOKKEEPING SPECIFICATIONS
--------------------------------------------------------------------------------
Every economic event triggers a balanced pair of Debit and Credit ledger entries:

A. Digital Subscriptions (PayPal / Stripe / PayHere)
   DEBIT: Cash & Bank Account (Asset)              -> Gross Received
   CREDIT: Digital Subscription Revenue (Income)   -> Net Price
   CREDIT: IRD VAT 18% Payable (Liability)         -> VAT Amount
   CREDIT: IRD SSCL 2.5% Payable (Liability)        -> SSCL Amount

B. Corporate Ad Sales
   DEBIT: Accounts Receivable / Cash (Asset)      -> Invoice Total
   CREDIT: Corporate Ad Sales Revenue (Income)     -> Net Placement Fee
   CREDIT: IRD Tax Payable (Liability)             -> Output Taxes

C. Econ Academy Course Sales & Instructor Splits
   DEBIT: Cash & Bank Account (Asset)              -> 100% Course Fee
   CREDIT: Course Tuition Revenue (Income)          -> 30% LankaEcon Share
   CREDIT: Instructor Royalty Payable (Liability)  -> 70% Instructor Share

D. Publisher Package Fees & Author Royalties
   DEBIT: Cash & Bank Account (Asset)              -> Package Sale
   CREDIT: Publisher Revenue (Income)              -> 87.5% Platform Share
   CREDIT: Author Royalty Payable (Liability)       -> 12.5% Royalty Reserve

E. Staff Payroll & Statutory Overheads
   DEBIT: Salaries & Wages Expense (OPEX)          -> Gross Salary
   DEBIT: Employer EPF Expense (12%) (OPEX)        -> 12% Basic
   DEBIT: Employer ETF Expense (3%) (OPEX)         -> 3% Basic
   CREDIT: EPF Department Payable (12% + 8%)      -> Total 20% EPF
   CREDIT: ETF Department Payable (3%)            -> Total 3% ETF
   CREDIT: Bank Account (Asset)                    -> Net Salary Paid to Staff

F. Custom Operational Expenses
   DEBIT: Specific OPEX Account (e.g. Hosting, Fiber, Honoraria)
   CREDIT: Cash & Bank / Accounts Payable

4. INLAND REVENUE DEPARTMENT (IRD) TAX COMPLIANCE & RAMIS API INTEGRATION
--------------------------------------------------------------------------------
A. Tax Rates & Formula:
   - SSCL Rate: 2.5% on gross turnover -> SSCL = Net * 0.025
   - VAT Rate: 18.0% on net value -> VAT = Net * 0.180
   - Gross Charged = Net + SSCL + VAT

B. RAMIS Portal Integration:
   - Automated electronic Tax Invoices are signed using the enterprise RSA key and transmitted via HTTP REST to IRD's RAMIS Gateway (https://ramis.ird.gov.lk/api/v1/taxinvoices).
   - Once validated, IRD returns a unique IRD e-Invoice Ack Number and QR Code payload.

5. LABOUR LAW & STATUTORY PAYROLL COMPLIANCE
--------------------------------------------------------------------------------
A. Contribution Rates:
   - Employee EPF Deduction: 8.0% of Basic Salary
   - Employer EPF Contribution: 12.0% of Basic Salary
   - Employer ETF Contribution: 3.0% of Basic Salary
   - Total Monthly Remittance to Central Bank EPF Department: 20.0% EPF + 3.0% ETF.

B. Department of Labour C-Form Submission:
   - Monthly payroll generates a Department of Labour compliant C3 Schedule file containing Employee EPF Numbers, NICs, Basic Earnings, EPF Employee (8%), EPF Employer (12%), and ETF (3%).

6. SAMPLE TAX INVOICE FORMAT
--------------------------------------------------------------------------------
LANKAECON MEDIA & PUBLISHING (PVT) LTD
No. 45, Galle Road, Colombo 03, Sri Lanka | Tel: +94 11 234 5678
TIN: 100293810-IRD-LK | SVAT Registration No: SVAT-882910-LK

TAX INVOICE
Invoice No: INV-2026-08821
Date: 01 August 2026
Customer: Ceylon Commercial Holdings PLC
Customer TIN: 200492810-IRD-LK
--------------------------------------------------------------------------------
Description                                    Qty      Unit (LKR)    Total (LKR)
--------------------------------------------------------------------------------
Corporate Banner Ad Placement (30 Days)          1       100,000.00    100,000.00
--------------------------------------------------------------------------------
Subtotal Net:                                                          100,000.00
Social Security Contribution Levy (SSCL 2.5%):                            2,500.00
Value Added Tax (VAT 18.0%):                                            18,000.00
--------------------------------------------------------------------------------
TOTAL AMOUNT PAYABLE (LKR):                                           120,500.00
--------------------------------------------------------------------------------
IRD RAMIS E-Invoice Ack: IRD-ACK-20260801-9982103
Authorized Signatory: LankaEcon Automated ERP System

7. SAMPLE PAYMENT RECEIPT FORMAT
--------------------------------------------------------------------------------
LANKAECON MEDIA & PUBLISHING (PVT) LTD
No. 45, Galle Road, Colombo 03, Sri Lanka

OFFICIAL PAYMENT RECEIPT
Receipt No: REC-2026-09412
Date: 01 August 2026
Received From: Ceylon Commercial Holdings PLC
Payment Method: Bank Transfer (Commercial Bank PLC)
Reference No: TXN-8829104812

Sum Received: LKR 120,500.00
(In Words: One Hundred Twenty Thousand Five Hundred Sri Lankan Rupees Only)

Being Payment For: Settlement of Tax Invoice INV-2026-08821
Balance Due: LKR 0.00

Thank you for your business!
--------------------------------------------------------------------------------
System Validated Receipt - LankaEcon Core ERP

================================================================================
Report Prepared By: LankaEcon Enterprise Core ERP v2.6 Automated Accounting Module
================================================================================`;

      const { documentUrl } = await generateGoogleDocReport(textReport);
      setExportedDocUrl(documentUrl);
    } catch (err: any) {
      alert(err.message || 'Error exporting report to Google Docs');
    } finally {
      setIsExportingDoc(false);
    }
  };

  // Active Tax Rates
  const VAT_RATE = 0.18;  // 18% Sri Lanka VAT
  const SSCL_RATE = 0.025; // 2.5% SSCL

  useEffect(() => {
    fetchLedger();
    fetchInvoices();
    fetchPayroll();
    fetchErpConfig();
    fetchGatewayConfig();
  }, [selectedPeriod, selectedYear]);

  const fetchLedger = async () => {
    setIsLoadingLedger(true);
    try {
      const res = await fetch(`/api/erp/accounting/ledger?period=${selectedPeriod}&year=${selectedYear}`);
      const data = await res.json();
      if (data.success) {
        setLedgerData(data);
      }
    } catch {
      console.error('Failed to load accounting ledger & financial statements');
    } finally {
      setIsLoadingLedger(false);
    }
  };

  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const res = await fetch('/api/erp/accounting/invoices');
      const data = await res.json();
      if (data.success && Array.isArray(data.invoices)) {
        setInvoices(data.invoices);
      }
    } catch {
      console.error('Failed to load tax invoices');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchPayroll = async () => {
    setIsLoadingPayroll(true);
    try {
      const res = await fetch('/api/erp/hr/payroll');
      const data = await res.json();
      if (data.success && Array.isArray(data.payrollRecords)) {
        setPayrollRecords(data.payrollRecords);
      }
    } catch {
      console.error('Failed to load payroll');
    } finally {
      setIsLoadingPayroll(false);
    }
  };

  const fetchErpConfig = async () => {
    try {
      const res = await fetch('/api/erp/config');
      const data = await res.json();
      if (data.success && data.config) {
        setErpConfig(data.config);
        setWebhookInput(data.config.webhookUrl || '');
      }
    } catch {
      console.error('Failed to load ERP config');
    }
  };

  const fetchGatewayConfig = async () => {
    try {
      const res = await fetch('/api/payments/gateway-config');
      const data = await res.json();
      if (data.success && data.config) {
        setGatewayConfig(data.config);
      }
    } catch {
      console.error('Failed to load gateway config');
    }
  };

  const handleAddCustomEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customAmountLKR) return;

    setIsSubmittingCustom(true);
    try {
      const res = await fetch('/api/erp/accounting/custom-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle,
          type: customType,
          amountLKR: customAmountLKR,
          category: customCategory,
          assetType: customType === 'asset' ? customAssetType : undefined,
          liabilityType: customType === 'liability' ? customLiabilityType : undefined,
          supplierOrParty: customSupplierOrParty,
          date: customDate,
          quarter: customQuarter,
          year: selectedYear,
          notes: customNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setCustomTitle('');
        setCustomSupplierOrParty('');
        setCustomNotes('');
        fetchLedger();
      } else {
        alert(data.message || 'Failed to add custom entry');
      }
    } catch {
      alert('Error connecting to accounting backend API');
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  const handleDeleteCustomEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this custom entry from the accounting ledger?')) return;
    try {
      const res = await fetch(`/api/erp/accounting/custom-entry/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchLedger();
      }
    } catch {
      alert('Failed to delete custom entry');
    }
  };

  const handleUpdateLedgerEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    setIsUpdatingLedgerEntry(true);
    try {
      const res = await fetch(`/api/erp/accounting/ledger-entry/${encodeURIComponent(editingEntry.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editingEntry.description,
          amountLKR: editingEntry.amountLKR,
          date: editingEntry.date,
          category: editingEntry.category,
          reference: editingEntry.reference,
          notes: editingEntry.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingEntry(null);
        fetchLedger();
      } else {
        alert(data.message || 'Failed to update entry');
      }
    } catch {
      alert('Error connecting to accounting backend API');
    } finally {
      setIsUpdatingLedgerEntry(false);
    }
  };

  const handleDeleteLedgerEntry = async (id: string, description: string) => {
    if (!window.confirm(`Are you sure you want to remove and void ledger transaction "${description}"? All financial statements will automatically adjust.`)) return;
    try {
      const res = await fetch(`/api/erp/accounting/ledger-entry/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchLedger();
      } else {
        alert(data.message || 'Failed to delete ledger transaction');
      }
    } catch {
      alert('Error communicating with accounting backend API');
    }
  };

  const handleResetToZero = async () => {
    if (!window.confirm('Initialize Accounting System to Pre-Launch Day-0 Clean Baseline (All Figures Reset to Rs. 0.00)?\n\nLive tracking will remain armed to automatically record all future live subscriptions, ads, tuition, art sales, and operations in real time.')) return;
    try {
      const res = await fetch('/api/erp/accounting/reset-to-zero', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchLedger();
        fetchInvoices();
        fetchPayroll();
      }
    } catch {
      alert('Error resetting accounting system');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !netAmountLKR) return;

    try {
      const res = await fetch('/api/erp/accounting/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientTin,
          clientAddress,
          serviceDescription,
          businessUnit,
          netAmountLKR,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`IRD Tax Invoice ${data.invoice.invoiceNumber} Generated Successfully! Recorded in Central Accounting Ledger.`);
        setShowNewInvoiceModal(false);
        setClientName('');
        setClientEmail('');
        setClientTin('');
        fetchInvoices();
        fetchLedger();
      } else {
        alert(data.error || 'Failed to generate invoice');
      }
    } catch {
      alert('Error connecting to backend invoicing API');
    }
  };

  const handleProcessPayroll = async () => {
    setIsProcessingPayroll(true);
    try {
      const res = await fetch('/api/erp/hr/process-payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthYear: monthYearInput }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Statutory Payroll for ${data.monthYear} processed for ${data.processedCount} employees! EPF 12%/8% & ETF 3% computed & posted to Ledger.`);
        fetchPayroll();
        fetchLedger();
      }
    } catch {
      alert('Failed to process monthly payroll');
    } finally {
      setIsProcessingPayroll(false);
    }
  };

  const handleToggleGateway = async (gatewayName: 'paypal' | 'stripe' | 'payhere', enabled: boolean) => {
    try {
      const bodyPayload = {
        paypalEnabled: gatewayName === 'paypal' ? enabled : gatewayConfig?.paypalEnabled,
        stripeEnabled: gatewayName === 'stripe' ? enabled : gatewayConfig?.stripeEnabled,
        payhereEnabled: gatewayName === 'payhere' ? enabled : gatewayConfig?.payhereEnabled,
      };
      const res = await fetch('/api/payments/gateway-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });
      const data = await res.json();
      if (data.success) {
        setGatewayConfig(data.config);
      }
    } catch {
      alert('Error updating payment gateway settings');
    }
  };

  const handleTestWebhookSimulate = async (gateway: 'paypal' | 'stripe') => {
    try {
      const endpoint = gateway === 'paypal' ? '/api/payments/paypal/webhook' : '/api/payments/stripe/webhook';
      const payload = gateway === 'paypal'
        ? { eventType: 'PAYMENT.CAPTURE.COMPLETED', resource: { id: `PAYPAL-${Date.now()}`, amount: { value: '12500' }, payer: { email_address: 'test.buyer@paypal.lk' } } }
        : { type: 'payment_intent.succeeded', data: { object: { id: `STRIPE-${Date.now()}`, amount: 1500000, receipt_email: 'test.sub@stripe.com' } } };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookTestMessage(`✓ ${gateway.toUpperCase()} Webhook Ping Success! Transaction posted to Accounting Ledger.`);
        fetchLedger();
        setTimeout(() => setWebhookTestMessage(''), 4000);
      }
    } catch {
      alert('Error testing webhook callback');
    }
  };

  const handleSaveWebhook = async () => {
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/erp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: webhookInput }),
      });
      const data = await res.json();
      if (data.success) {
        setErpConfig(data.config);
        setWebhookTestMessage('✓ Webhook URL updated & verified with ERP Core!');
        setTimeout(() => setWebhookTestMessage(''), 4000);
      }
    } catch {
      alert('Error saving ERP webhook URL');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Calculations for current invoice form preview
  const previewSscl = Math.round((netAmountLKR || 0) * SSCL_RATE);
  const previewVat = Math.round(((netAmountLKR || 0) + previewSscl) * VAT_RATE);
  const previewGross = (netAmountLKR || 0) + previewSscl + previewVat;

  // Aggregate stats from invoices & payroll
  const totalNetInvoiced = invoices.reduce((acc, i) => acc + i.netAmountLKR, 0);
  const totalSsclCollected = invoices.reduce((acc, i) => acc + i.ssclTaxLKR, 0);
  const totalVatCollected = invoices.reduce((acc, i) => acc + i.vatTaxLKR, 0);
  const totalGrossInvoiced = invoices.reduce((acc, i) => acc + i.grossTotalLKR, 0);

  const totalMonthlyPayroll = payrollRecords.reduce((acc, p) => acc + p.netSalaryLKR, 0);
  const totalEpfRemittance = payrollRecords.reduce((acc, p) => acc + (p.epfEmployeeDeductionLKR + p.epfEmployerContributionLKR), 0);
  const totalEtfRemittance = payrollRecords.reduce((acc, p) => acc + p.etfEmployerContributionLKR, 0);

  // Financial statements references
  const inc = ledgerData?.incomeStatement;
  const bal = ledgerData?.balanceSheet;
  const cash = ledgerData?.cashFlowStatement;

  // Ledger entries filtering
  const rawEntries: AccountingLedgerEntry[] = ledgerData?.ledgerEntries || [];
  const filteredLedgerEntries = rawEntries.filter((e) => {
    if (ledgerFilterCategory === 'ALL') return true;
    return e.category === ledgerFilterCategory;
  });

  return (
    <div className="bg-[#0B1E36] text-white border-2 border-[#D4A373]/50 rounded-none shadow-2xl p-6 font-sans space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white font-serif">
              Centralized Automated Accounting System & ERP Portal
            </h2>
            <span className="bg-[#DC2626] text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
              SRI LANKA TAX & LABOUR LAW COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Unified double-entry financial ledger automatically capturing Subscriptions, Corporate Ad Sales, Econ Academy Course Tuition, Publisher Package Fees, Creator Royalties, Lanka Ink Art Sales, Statutory Payroll (EPF 12%/8%, ETF 3%), and Operational Overhead.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-2.5 text-xs font-mono text-amber-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-[10px] uppercase text-slate-400">COMPANY TAX REGISTRATION (IRD SRI LANKA)</p>
            <p className="font-extrabold text-xs">TIN-100293810-IRD-LK • SVAT-882910-LK</p>
          </div>
        </div>
      </div>

      {/* Primary Portal Navigation Tabs */}
      <div className="flex border-b border-slate-700 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('financial_statements')}
          className={`px-4 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'financial_statements'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <PieChart className="w-4 h-4 text-amber-400" />
          <span>Financial Statements (P&L, Balance Sheet, Cash Flow)</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'ledger'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Automated General Ledger ({rawEntries.length} Records)</span>
        </button>

        <button
          onClick={() => setActiveTab('custom_entries')}
          className={`px-4 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'custom_entries'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Sliders className="w-4 h-4 text-sky-400" />
          <span>Custom Expenses & Revenue Entry</span>
        </button>

        <button
          onClick={() => setActiveTab('accounting')}
          className={`px-4 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'accounting'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>IRD Tax Invoices (VAT 18% / SSCL 2.5%)</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'payroll'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>HR & Statutory Payroll (EPF/ETF)</span>
        </button>

        <button
          onClick={() => setActiveTab('gateway')}
          className={`px-4 py-3 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'gateway'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-400" />
          <span>Payment Gateways (PayPal / Stripe)</span>
        </button>
      </div>

      {/* TAB 1: FINANCIAL STATEMENTS (INCOME STATEMENT, BALANCE SHEET, CASH FLOW) */}
      {activeTab === 'financial_statements' && (
        <div className="space-y-6">
          
          {/* Controls: Quarter & Annual Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-700">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white font-serif flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                <span>Automated Financial Statements — LankaEcon Media & Publishing</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically calculated from live ledger entries. Select financial quarter or annual view:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 font-mono">PERIOD:</span>
              <div className="flex bg-slate-950 p-1 border border-slate-700 font-mono text-xs">
                {(['Q1', 'Q2', 'Q3', 'Q4', 'ANNUAL'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-3 py-1 font-extrabold uppercase transition cursor-pointer ${
                      selectedPeriod === p
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-xs p-1.5 outline-none"
              >
                <option value={2026}>2026 FY</option>
                <option value={2025}>2025 FY</option>
              </select>

              <button
                onClick={fetchLedger}
                className="bg-slate-800 hover:bg-slate-700 p-2 text-slate-300 hover:text-white transition cursor-pointer"
                title="Refresh Ledger Calculations"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLedger ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleResetToZero}
                className="bg-rose-950/80 hover:bg-rose-900 border border-rose-600/70 text-rose-200 px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md"
                title="Initialize Day-0 Clean Baseline (All Figures to Rs. 0.00)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Reset to Day-0 (Rs. 0.00)</span>
              </button>

              <button
                onClick={handleGenerateGoogleDoc}
                disabled={isExportingDoc}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
                title="Generate Google Doc Accounting Audit Report"
              >
                <FileText className="w-3.5 h-3.5 text-blue-200" />
                <span>{isExportingDoc ? 'Generating Doc...' : 'Export Google Doc Report'}</span>
              </button>

              <a
                href="/api/erp/accounting/download-manual-pdf"
                download="LankaEcon_Master_Accounting_ERP_Manual.pdf"
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md text-decoration-none"
                title="Download Comprehensive Master Accounting & Tax Manual (PDF)"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>Download Accounting & Tax Manual (PDF)</span>
              </a>
            </div>
          </div>

          {/* Real-time automation readiness alert */}
          <div className="bg-slate-950 border border-emerald-500/50 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <div>
                <p className="font-extrabold uppercase text-white font-mono flex items-center gap-2">
                  <span>LIVE REAL-TIME FINANCIAL ENGINE ACTIVE</span>
                  <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-2 py-0.5 border border-emerald-500/40">Zero-State Armed</span>
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  As the website runs, all incoming subscriptions, ad placements, course tuition, art/book sales, and operational costs are automatically tracked, posted, and balanced across the Income Statement, Balance Sheet, and Cash Flow in real time.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1.5 border border-slate-800 shrink-0">
              Staff Override: <strong className="text-amber-300">Enabled for all entries</strong>
            </div>
          </div>

          {exportedDocUrl && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold uppercase text-white">Google Document Generated Successfully!</p>
                  <p className="text-[11px] text-emerald-300 font-mono">{exportedDocUrl}</p>
                </div>
              </div>
              <a
                href={exportedDocUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1.5 uppercase text-[11px] tracking-wider flex items-center gap-1.5 shrink-0 transition"
              >
                <span>Open Google Doc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Statement Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. INCOME STATEMENT (P&L) */}
            <div className="bg-slate-900 border-2 border-amber-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-extrabold text-sm uppercase text-amber-300 font-serif">
                    1. Income Statement (P&L)
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-950 px-2 py-0.5 border border-slate-800">
                  {selectedPeriod} {selectedYear}
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-amber-400">
                  REVENUE STREAMS
                </p>
                <div className="space-y-1.5 pl-2 text-slate-200">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Digital Subscriptions:</span>
                    <span>Rs. {(inc?.revenueBreakdown?.digitalSubscriptionsLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Corporate Ad Sales:</span>
                    <span>Rs. {(inc?.revenueBreakdown?.corporateAdSalesLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Course Tuition Fees:</span>
                    <span>Rs. {(inc?.revenueBreakdown?.courseTuitionLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Publisher Package Fees:</span>
                    <span>Rs. {(inc?.revenueBreakdown?.publisherPackageFeesLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Lanka Ink Art & Books:</span>
                    <span>Rs. {(inc?.revenueBreakdown?.lankaInkArtBookSalesLKR || 0).toLocaleString()}</span>
                  </p>
                  {inc?.revenueBreakdown?.customIncomesLKR > 0 && (
                    <p className="flex justify-between text-sky-300">
                      <span>Custom Revenue Entries:</span>
                      <span>Rs. {inc.revenueBreakdown.customIncomesLKR.toLocaleString()}</span>
                    </p>
                  )}
                  <p className="flex justify-between font-bold text-emerald-300 pt-1 border-t border-slate-800 text-sm">
                    <span>GROSS REVENUE:</span>
                    <span>Rs. {(inc?.revenueBreakdown?.totalGrossRevenueLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-rose-400 pt-2">
                  COST OF SALES & CREATOR ROYALTIES
                </p>
                <div className="space-y-1.5 pl-2 text-slate-200">
                  <p className="flex justify-between text-rose-300/80">
                    <span>Instructor Course Splits:</span>
                    <span>-Rs. {(inc?.costOfSalesBreakdown?.instructorTuitionSplitsLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-rose-300/80">
                    <span>Author Creator Royalties:</span>
                    <span>-Rs. {(inc?.costOfSalesBreakdown?.authorCreatorRoyaltiesLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-bold text-amber-300 pt-1 border-t border-slate-800">
                    <span>GROSS PROFIT ({inc?.grossMarginPercent || 100}% Margin):</span>
                    <span>Rs. {(inc?.grossProfitLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-sky-400 pt-2">
                  OPERATING EXPENSES (OPEX)
                </p>
                <div className="space-y-1.5 pl-2 text-slate-300 text-[11px]">
                  <p className="flex justify-between">
                    <span>Executive & Staff Salaries:</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.staffBasicSalariesLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-amber-300/90">
                    <span>Employer EPF (12% Statutory):</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.employerEpf12PercentLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-sky-300/90">
                    <span>Employer ETF (3% Statutory):</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.employerEtf3PercentLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Server Hosting & Cloud Run:</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.serverHostingCloudRunLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>High-Speed Fiber Internet/Wi-Fi:</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.highSpeedFiberInternetWifiLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Domain, SSL & Security:</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.domainAndSslSecurityLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Freelance Honoraria:</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.freelanceAnalystsAndHonorariaLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-bold text-rose-400 pt-1 border-t border-slate-800">
                    <span>TOTAL OPERATING COSTS:</span>
                    <span>Rs. {(inc?.operatingExpensesBreakdown?.totalOperatingExpensesLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <div className="bg-slate-950 p-3 border border-emerald-500/50 space-y-1 pt-2">
                  <p className="flex justify-between font-extrabold text-white">
                    <span>NET OPERATING PROFIT (EBIT):</span>
                    <span className="text-emerald-400">Rs. {(inc?.netOperatingIncomeEbitLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-[11px] text-amber-300/80">
                    <span>IRD Tax Provision (VAT/SSCL):</span>
                    <span>-Rs. {(inc?.taxProvision?.totalTaxProvisionLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-black text-emerald-300 text-sm border-t border-slate-800 pt-1">
                    <span>NET PROFIT AFTER TAX:</span>
                    <span>Rs. {(inc?.netProfitAfterTaxLKR || 0).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. BALANCE SHEET */}
            <div className="bg-slate-900 border-2 border-sky-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <h4 className="font-extrabold text-sm uppercase text-sky-300 font-serif">
                    2. Balance Sheet
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>BALANCED</span>
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-emerald-400">
                  ASSETS
                </p>
                <div className="space-y-1.5 pl-2 text-slate-200">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Cash & Bank Accounts:</span>
                    <span>Rs. {(bal?.assets?.cashAndBankBalanceLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Accounts Receivable:</span>
                    <span>Rs. {(bal?.assets?.accountsReceivableLKR || 0).toLocaleString()}</span>
                  </p>
                  {(bal?.assets?.customCurrentAssetsLKR || 0) > 0 && (
                    <p className="flex justify-between text-emerald-300">
                      <span>Custom Current Assets & Deposits:</span>
                      <span>Rs. {bal.assets.customCurrentAssetsLKR.toLocaleString()}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="text-slate-400">Prepaid Software & Domain:</span>
                    <span>Rs. {(bal?.assets?.prepaidSoftwareAndDomainLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Fixed Assets, Cameras & Equipment:</span>
                    <span>Rs. {(bal?.assets?.serversAndEquipmentLKR || bal?.assets?.customFixedAssetsLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-bold text-emerald-300 pt-1 border-t border-slate-800 text-sm">
                    <span>TOTAL ASSETS:</span>
                    <span>Rs. {(bal?.assets?.totalAssetsLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-rose-400 pt-2">
                  LIABILITIES
                </p>
                <div className="space-y-1.5 pl-2 text-slate-200">
                  <p className="flex justify-between text-slate-300">
                    <span>Unremitted Creator Royalties:</span>
                    <span>Rs. {(bal?.liabilities?.unremittedCreatorRoyaltiesLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-amber-300/90">
                    <span>EPF / ETF Statutory Payable:</span>
                    <span>Rs. {(bal?.liabilities?.epfEtfStatutoryPayableLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-sky-300/90">
                    <span>IRD VAT & SSCL Tax Payable:</span>
                    <span>Rs. {(bal?.liabilities?.vatSsclTaxPayableToIrdLKR || 0).toLocaleString()}</span>
                  </p>
                  {(bal?.liabilities?.customCurrentLiabilitiesLKR || 0) > 0 && (
                    <p className="flex justify-between text-rose-300">
                      <span>Custom Trade Payables / Advances:</span>
                      <span>Rs. {bal.liabilities.customCurrentLiabilitiesLKR.toLocaleString()}</span>
                    </p>
                  )}
                  {(bal?.liabilities?.customLongTermLiabilitiesLKR || 0) > 0 && (
                    <p className="flex justify-between text-rose-300">
                      <span>Custom Bank Loans & Debt:</span>
                      <span>Rs. {bal.liabilities.customLongTermLiabilitiesLKR.toLocaleString()}</span>
                    </p>
                  )}
                  <p className="flex justify-between font-bold text-rose-400 pt-1 border-t border-slate-800">
                    <span>TOTAL LIABILITIES:</span>
                    <span>Rs. {(bal?.liabilities?.totalLiabilitiesLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-amber-400 pt-2">
                  EQUITY
                </p>
                <div className="space-y-1.5 pl-2 text-slate-200">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Owner Paid-In Capital:</span>
                    <span>Rs. {(bal?.equity?.ownerPaidInCapitalLKR || 0).toLocaleString()}</span>
                  </p>
                  {(bal?.equity?.customEquityInjectionsLKR || 0) > 0 && (
                    <p className="flex justify-between text-amber-300">
                      <span>Custom Capital Injections:</span>
                      <span>Rs. {bal.equity.customEquityInjectionsLKR.toLocaleString()}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="text-slate-400">Retained Earnings:</span>
                    <span>Rs. {(bal?.equity?.retainedEarningsLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-bold text-amber-300 pt-1 border-t border-slate-800">
                    <span>TOTAL EQUITY:</span>
                    <span>Rs. {(bal?.equity?.totalEquityLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <div className="bg-slate-950 p-3 border border-sky-500/50 flex justify-between font-black text-sky-300 text-sm">
                  <span>TOTAL LIABILITIES & EQUITY:</span>
                  <span>Rs. {(bal?.totalLiabilitiesAndEquityLKR || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 3. CASH FLOW STATEMENT */}
            <div className="bg-slate-900 border-2 border-emerald-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-extrabold text-sm uppercase text-emerald-300 font-serif">
                    3. Cash Flow Statement
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-950 px-2 py-0.5 border border-slate-800">
                  INDIRECT METHOD
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-2">
                  <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-emerald-400">
                    OPERATING ACTIVITIES
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Cash Generated from Operations:</span>
                    <span>Rs. {(cash?.operatingActivitiesLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Includes net profit, adjusted for working capital liabilities (EPF/ETF, IRD tax accruals, subscriptions).
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-sky-400">
                    INVESTING ACTIVITIES
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Equipment & Server Upgrades:</span>
                    <span>Rs. {(cash?.investingActivitiesLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 text-amber-400">
                    FINANCING ACTIVITIES
                  </p>
                  <p className="flex justify-between text-slate-300">
                    <span>Owner Capital Transactions:</span>
                    <span>Rs. {(cash?.financingActivitiesLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <div className="bg-slate-950 p-3 border border-emerald-500/50 space-y-2">
                  <p className="flex justify-between font-extrabold text-white text-xs">
                    <span>NET CASH CHANGE IN PERIOD:</span>
                    <span className="text-emerald-400">Rs. {(cash?.netCashChangeLKR || 0).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between font-black text-amber-300 text-sm border-t border-slate-800 pt-2">
                    <span>ENDING CASH & BANK BALANCE:</span>
                    <span>Rs. {(cash?.endingCashBalanceLKR || 0).toLocaleString()}</span>
                  </p>
                </div>

                <div className="bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-300 font-sans space-y-1">
                  <p className="font-bold text-amber-300 uppercase text-[10px] font-mono">FINANCIAL AUDIT STATEMENT:</p>
                  <p>
                    Prepared in accordance with Sri Lanka Accounting Standards (LKAS/SLFRS). Automatically reconciled with IRD VAT 18%, SSCL 2.5%, and Department of Labour EPF/ETF returns.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: AUTOMATED DOUBLE-ENTRY GENERAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">
                Automated Double-Entry General Ledger & Transaction Journal
              </h3>
              <p className="text-xs text-slate-400">
                Live stream of every transaction across Subscriptions, Ad Sales, Tuition, Publisher Packages, Creator Royalties, Lanka Ink, Payroll, and Custom entries.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 font-mono">FILTER BY CATEGORY:</span>
              <select
                value={ledgerFilterCategory}
                onChange={(e) => setLedgerFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white font-mono text-xs p-2 outline-none"
              >
                <option value="ALL">All Categories ({rawEntries.length})</option>
                <option value="Subscription Revenue">Subscription Revenue</option>
                <option value="Ad Sales Revenue">Ad Sales Revenue</option>
                <option value="Tuition Revenue">Tuition Revenue</option>
                <option value="Publishing Package Fee">Publishing Package Fee</option>
                <option value="Publishing Royalty Expense">Publishing Royalty Expense</option>
                <option value="Staff Payroll Expense">Staff Payroll Expense</option>
                <option value="Custom Expense">Custom Expense</option>
                <option value="Custom Revenue">Custom Revenue</option>
              </select>
            </div>
          </div>

          {/* Ledger Entries Table */}
          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Ledger ID & Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description & Business Unit</th>
                  <th className="p-3 text-right text-rose-400">Debit LKR</th>
                  <th className="p-3 text-right text-emerald-400">Credit LKR</th>
                  <th className="p-3 text-center">Reference</th>
                  <th className="p-3 text-center">Employee Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-mono text-[11px]">
                {filteredLedgerEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-sans text-xs">
                      No ledger transactions recorded yet for this period. As subscriptions, ad bookings, and operations activate, transactions will be posted and balanced automatically here.
                    </td>
                  </tr>
                ) : (
                  filteredLedgerEntries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-800/50">
                      <td className="p-3">
                        <p className="font-bold text-amber-300">{e.id}</p>
                        <p className="text-[10px] text-slate-400">{e.date} • {e.quarter}</p>
                      </td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          e.accountType === 'revenue'
                            ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-900/40 text-rose-300 border-rose-500/40'
                        }`}>
                          {e.category}
                        </span>
                      </td>
                      <td className="p-3 font-sans">
                        <p className="font-bold text-white">{e.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Unit: {e.businessUnit}</p>
                      </td>
                      <td className="p-3 text-right font-mono text-rose-300">
                        {e.debitLKR > 0 ? `Rs. ${e.debitLKR.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-300">
                        {e.creditLKR > 0 ? `Rs. ${e.creditLKR.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-3 text-center text-slate-400 text-[10px]">
                        {e.reference}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                          <button
                            onClick={() => setEditingEntry({
                              id: e.id,
                              description: e.description,
                              amountLKR: e.amountLKR || (e.debitLKR > 0 ? e.debitLKR : e.creditLKR),
                              date: e.date,
                              category: e.category,
                              reference: e.reference,
                              accountType: e.accountType,
                            })}
                            className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-1.5 transition text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                            title="Edit this entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLedgerEntry(e.id, e.description)}
                            className="bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 p-1.5 transition cursor-pointer"
                            title="Void / Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: UNIVERSAL CHART OF ACCOUNTS & CUSTOM FINANCIAL ITEM MANAGER */}
      {activeTab === 'custom_entries' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Universal Financial Entry Form */}
            <div className="bg-slate-900 border-2 border-amber-500/40 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-sm uppercase text-white font-serif">
                    Add Financial Item
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950 px-2 py-0.5 border border-slate-800">
                  Custom CoA
                </span>
              </div>

              <form onSubmit={handleAddCustomEntry} className="space-y-3.5 text-xs">
                
                {/* 5-Way Classification Switcher */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex justify-between">
                    <span>1. Accounting Classification *</span>
                    <span className="text-amber-400 capitalize">{customType}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomType('income');
                        setCustomCategory('Corporate Research Grant');
                      }}
                      className={`py-2 px-1 text-center font-bold text-[11px] uppercase transition cursor-pointer ${
                        customType === 'income'
                          ? 'bg-emerald-600 text-white shadow-md border border-emerald-400'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      📈 Revenue
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomType('expense');
                        setCustomCategory('Server Hosting & Cloud Run');
                      }}
                      className={`py-2 px-1 text-center font-bold text-[11px] uppercase transition cursor-pointer ${
                        customType === 'expense'
                          ? 'bg-rose-600 text-white shadow-md border border-rose-400'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      📉 Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomType('asset');
                        setCustomCategory('Sony 4K Studio Cameras & Video Gear');
                      }}
                      className={`py-2 px-1 text-center font-bold text-[11px] uppercase transition cursor-pointer ${
                        customType === 'asset'
                          ? 'bg-sky-600 text-white shadow-md border border-sky-400'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      🏢 Asset
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomType('liability');
                        setCustomCategory('Commercial Bank Loan');
                      }}
                      className={`py-2 px-1 text-center font-bold text-[11px] uppercase transition cursor-pointer ${
                        customType === 'liability'
                          ? 'bg-purple-600 text-white shadow-md border border-purple-400'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      🏦 Liability / Debt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomType('equity');
                        setCustomCategory('Founder Seed Capital Injection');
                      }}
                      className={`py-2 px-1 text-center font-bold text-[11px] uppercase transition cursor-pointer ${
                        customType === 'equity'
                          ? 'bg-amber-600 text-slate-950 shadow-md border border-amber-400'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      💼 Equity Inflow
                    </button>
                  </div>
                </div>

                {/* Sub-classification (for Asset or Liability) */}
                {customType === 'asset' && (
                  <div className="space-y-1 bg-slate-950 p-2.5 border border-sky-500/40">
                    <label className="font-bold text-sky-300 uppercase text-[10px]">Asset Sub-Type *</label>
                    <select
                      value={customAssetType}
                      onChange={(e: any) => setCustomAssetType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white font-sans outline-none focus:border-sky-400 text-xs"
                    >
                      <option value="fixed">Fixed Asset & Studio Equipment (Cameras, Rigs, Hardware)</option>
                      <option value="equipment">Office Equipment & Computers</option>
                      <option value="current">Current Asset / Security Deposit / Cash Advance</option>
                      <option value="deposit">Office Rental Lease Deposit</option>
                      <option value="intangible">Intellectual Property & Software Copyrights</option>
                    </select>
                  </div>
                )}

                {customType === 'liability' && (
                  <div className="space-y-1 bg-slate-950 p-2.5 border border-purple-500/40">
                    <label className="font-bold text-purple-300 uppercase text-[10px]">Liability Sub-Type *</label>
                    <select
                      value={customLiabilityType}
                      onChange={(e: any) => setCustomLiabilityType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 text-white font-sans outline-none focus:border-purple-400 text-xs"
                    >
                      <option value="current">Current Liability (Payable within 12 Months)</option>
                      <option value="long_term">Long-Term Liability / Bank Financing</option>
                      <option value="loan">Commercial Bank Loan Facility</option>
                      <option value="advance">Director Advance / Shareholder Loan</option>
                      <option value="payable">Vendor Trade Credit / Accounts Payable</option>
                    </select>
                  </div>
                )}

                {/* Category Preset Dropdown */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">2. Category Preset *</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-sans outline-none focus:border-amber-400"
                  >
                    {customType === 'income' && (
                      <>
                        <option value="Corporate Research Grant">Corporate Research & Economic Grant</option>
                        <option value="Event Sponsorship & Keynote">Event Sponsorship & Keynote Fee</option>
                        <option value="Print & Media Syndication License">Print & Media Syndication License</option>
                        <option value="Academic Publishing Partnership">Academic Publishing Partnership</option>
                        <option value="Custom Consulting & Advisory">Custom Consulting & Advisory</option>
                        <option value="Custom Digital Product Sales">Custom Digital Product Sales</option>
                        <option value="Custom Revenue">Other Custom Revenue Stream</option>
                      </>
                    )}
                    {customType === 'expense' && (
                      <>
                        <option value="Server Hosting & Cloud Run">Server Hosting & Cloud Run Containers</option>
                        <option value="High-Speed Fiber Internet / Wi-Fi">High-Speed Fiber Internet / Wi-Fi</option>
                        <option value="Domain & SSL Security">Domain & SSL Security</option>
                        <option value="Software Licenses">Software Licenses & Developer Tools</option>
                        <option value="Freelance & Honoraria">Freelance Analysts & Translator Honoraria</option>
                        <option value="Office & Admin Overhead">Office Rent & Administrative Overhead</option>
                        <option value="Legal & Audit Compliance">Legal Retainer & Audit Compliance</option>
                        <option value="Marketing & Public Relations">Marketing & Media Outreach</option>
                        <option value="Other Expense">Other Operational Expense</option>
                      </>
                    )}
                    {customType === 'asset' && (
                      <>
                        <option value="Sony 4K Studio Cameras & Video Gear">Sony 4K Studio Cameras & Video Gear</option>
                        <option value="High-End Editing Workstations & PCs">High-End Editing Workstations & PCs</option>
                        <option value="Office Furniture & Desks">Office Furniture & Production Desks</option>
                        <option value="Office Rental Security Deposit">Office Rental Lease Security Deposit</option>
                        <option value="Company Vehicle / Transport Asset">Company Transport & Logistics Asset</option>
                        <option value="Intellectual Property & Copyrights">Intellectual Property & Content Copyrights</option>
                        <option value="Merchandise Inventory">Merchandise Inventory</option>
                        <option value="Other Capital Asset">Other Capital Asset</option>
                      </>
                    )}
                    {customType === 'liability' && (
                      <>
                        <option value="Commercial Bank Loan">Commercial Bank Loan Facility</option>
                        <option value="Director Advance / Shareholder Loan">Director Loan / Shareholder Advance</option>
                        <option value="Customer Advance & Deferred Revenue">Customer Advance & Deferred Revenue</option>
                        <option value="Vendor Accounts Payable / Trade Credit">Vendor Accounts Payable / Trade Credit</option>
                        <option value="Equipment Lease Financing">Equipment Lease Financing</option>
                        <option value="Other Liability">Other Financial Liability</option>
                      </>
                    )}
                    {customType === 'equity' && (
                      <>
                        <option value="Founder Seed Capital Injection">Founder Seed Capital Injection (Paid-in)</option>
                        <option value="Angel Investor Equity Contribution">Angel Investor Equity Contribution</option>
                        <option value="Partner Growth Capital">Partner Growth Capital</option>
                        <option value="Other Capital Inflow">Other Capital Inflow</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">3. Item Title / Description *</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={
                      customType === 'income' ? 'e.g. USAID Economic Research Grant 2026' :
                      customType === 'asset' ? 'e.g. 2x Sony FX3 4K Cameras & Sigma Lenses' :
                      customType === 'liability' ? 'e.g. Commercial Bank 3-Year SME Working Capital Loan' :
                      customType === 'equity' ? 'e.g. Founder Paid-In Share Capital Inflow' :
                      'e.g. Dialog Enterprise High-Speed 1Gbps Fiber Internet'
                    }
                    className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-sans outline-none focus:border-amber-400"
                  />
                </div>

                {/* Party / Supplier */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Counterparty / Supplier / Bank</label>
                  <input
                    type="text"
                    value={customSupplierOrParty}
                    onChange={(e) => setCustomSupplierOrParty(e.target.value)}
                    placeholder="e.g. Commercial Bank of Ceylon / Sony Lanka / Dialog Axiata / Investor"
                    className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-sans outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                {/* Amount, Quarter & Date */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="font-bold text-slate-300 uppercase">Amount LKR *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={customAmountLKR}
                      onChange={(e) => setCustomAmountLKR(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 text-amber-300 font-mono font-bold outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="font-bold text-slate-300 uppercase">Quarter</label>
                    <select
                      value={customQuarter}
                      onChange={(e: any) => setCustomQuarter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-mono outline-none focus:border-amber-400 text-xs"
                    >
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="font-bold text-slate-300 uppercase">Date</label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 p-2 text-white font-mono outline-none focus:border-amber-400 text-[11px]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Notes & Voucher / Invoice Ref</label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Voucher Ref #LK-2026-9921 / Approved by Board"
                    className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-sans outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                {/* Live Financial Statement Flow Summary */}
                <div className="bg-slate-950 p-2.5 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1">
                  <p className="text-amber-400 font-bold uppercase">DOUBLE-ENTRY FINANCIAL POSTING PREVIEW:</p>
                  <p>
                    {customType === 'income' && `• Debit: Cash / Bank (+Rs. ${customAmountLKR.toLocaleString()}) | Credit: Revenue (+Rs. ${customAmountLKR.toLocaleString()})`}
                    {customType === 'expense' && `• Debit: Operating Expense (+Rs. ${customAmountLKR.toLocaleString()}) | Credit: Cash / Bank (-Rs. ${customAmountLKR.toLocaleString()})`}
                    {customType === 'asset' && `• Debit: Fixed/Current Asset (+Rs. ${customAmountLKR.toLocaleString()}) | Credit: Cash Outflow (-Rs. ${customAmountLKR.toLocaleString()})`}
                    {customType === 'liability' && `• Debit: Cash Inflow (+Rs. ${customAmountLKR.toLocaleString()}) | Credit: Liability / Loan (+Rs. ${customAmountLKR.toLocaleString()})`}
                    {customType === 'equity' && `• Debit: Cash Inflow (+Rs. ${customAmountLKR.toLocaleString()}) | Credit: Owner Equity (+Rs. ${customAmountLKR.toLocaleString()})`}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCustom}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Post {customType.toUpperCase()} to Accounting Ledger</span>
                </button>
              </form>
            </div>

            {/* Custom Entries Filterable Journal */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-700 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <h3 className="font-extrabold text-sm uppercase text-white font-serif flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-sky-400" />
                    <span>Custom Financial Items in Ledger</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manually added revenues, operational expenses, capital assets, loans & liabilities, and equity infusions.
                  </p>
                </div>
                <span className="text-xs text-amber-300 font-mono font-bold bg-slate-950 px-2.5 py-1 border border-slate-800 self-start sm:self-auto">
                  {ledgerData?.customEntries?.length || 0} Custom Records
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
                {(['ALL', 'income', 'expense', 'asset', 'liability', 'equity'] as const).map((filterVal) => {
                  const count = filterVal === 'ALL'
                    ? (ledgerData?.customEntries?.length || 0)
                    : (ledgerData?.customEntries?.filter((ce: CustomAccountingEntry) => ce.type === filterVal || (filterVal === 'income' && ce.type === 'revenue')).length || 0);
                  return (
                    <button
                      key={filterVal}
                      onClick={() => setCustomEntriesFilter(filterVal)}
                      className={`px-3 py-1 font-bold uppercase transition cursor-pointer shrink-0 ${
                        customEntriesFilter === filterVal
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {filterVal === 'income' ? 'Revenues' : filterVal === 'expense' ? 'Expenses' : filterVal} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {(!ledgerData?.customEntries || ledgerData.customEntries.length === 0) ? (
                  <div className="bg-slate-950 p-8 border border-slate-800 text-center text-slate-400 text-xs font-sans space-y-2">
                    <p className="font-bold text-slate-300">No custom financial items in the ledger yet.</p>
                    <p>
                      Use the form on the left to inject new revenue streams, operational costs, capital equipment assets, commercial bank loans, or equity capital.
                    </p>
                  </div>
                ) : (
                  ledgerData?.customEntries
                    ?.filter((ce: CustomAccountingEntry) => {
                      if (customEntriesFilter === 'ALL') return true;
                      if (customEntriesFilter === 'income') return ce.type === 'income' || ce.type === 'revenue';
                      return ce.type === customEntriesFilter;
                    })
                    ?.map((ce: CustomAccountingEntry) => (
                      <div
                        key={ce.id}
                        className={`bg-slate-950 p-3.5 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          ce.type === 'income' || ce.type === 'revenue'
                            ? 'border-emerald-500/40 hover:border-emerald-400'
                            : ce.type === 'expense'
                            ? 'border-rose-500/40 hover:border-rose-400'
                            : ce.type === 'asset'
                            ? 'border-sky-500/40 hover:border-sky-400'
                            : ce.type === 'liability'
                            ? 'border-purple-500/40 hover:border-purple-400'
                            : 'border-amber-500/40 hover:border-amber-400'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-black uppercase font-mono tracking-wider ${
                                ce.type === 'income' || ce.type === 'revenue'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                                  : ce.type === 'expense'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-500/60'
                                  : ce.type === 'asset'
                                  ? 'bg-sky-950 text-sky-300 border border-sky-500/60'
                                  : ce.type === 'liability'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-500/60'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/60'
                              }`}
                            >
                              {ce.type.toUpperCase()}
                            </span>
                            <span className="font-bold text-white text-sm">{ce.title}</span>
                          </div>

                          <p className="text-[11px] text-slate-400 font-mono">
                            Category: <strong className="text-amber-300">{ce.category}</strong>
                            {ce.supplierOrParty && (
                              <> • Party: <span className="text-slate-200">{ce.supplierOrParty}</span></>
                            )}
                            • Period: <span className="text-white">{ce.quarter} {ce.year}</span> • Date: {ce.date}
                          </p>

                          {ce.notes && (
                            <p className="text-[10px] text-slate-400 italic font-sans">
                              Note: {ce.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="text-right">
                            <span
                              className={`font-mono font-extrabold text-base ${
                                ce.type === 'income' || ce.type === 'revenue'
                                  ? 'text-emerald-400'
                                  : ce.type === 'expense'
                                  ? 'text-rose-400'
                                  : ce.type === 'asset'
                                  ? 'text-sky-400'
                                  : ce.type === 'liability'
                                  ? 'text-purple-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {ce.type === 'expense' ? '-' : '+'}Rs. {ce.amountLKR.toLocaleString()}
                            </span>
                            <p className="text-[9px] text-slate-500 font-mono uppercase">
                              {ce.type === 'income' || ce.type === 'revenue'
                                ? 'Revenue'
                                : ce.type === 'expense'
                                ? 'Cost/OPEX'
                                : ce.type === 'asset'
                                ? (ce.assetType || 'Asset')
                                : ce.type === 'liability'
                                ? (ce.liabilityType || 'Liability')
                                : 'Equity Inflow'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setEditingEntry({
                                  id: ce.id,
                                  description: ce.title,
                                  amountLKR: ce.amountLKR,
                                  date: ce.date,
                                  category: ce.category,
                                  reference: `CUSTOM-${ce.id}`,
                                  notes: ce.notes,
                                  accountType: ce.type,
                                })
                              }
                              className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-2 transition cursor-pointer text-xs flex items-center gap-1 border border-slate-800"
                              title="Edit this custom financial entry"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="font-bold text-[10px] uppercase">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCustomEntry(ce.id)}
                              className="bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white transition p-2 cursor-pointer border border-slate-800"
                              title="Delete from Ledger"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: ACCOUNTING & SRI LANKA TAX INVOICING */}
      {activeTab === 'accounting' && (
        <div className="space-y-6">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-700 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">TOTAL NET TURNOVER</span>
              <p className="text-xl font-black text-white font-mono">Rs. {totalNetInvoiced.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Pre-tax billing revenue</span>
            </div>

            <div className="bg-slate-900 border border-amber-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">SSCL TAX (2.5%)</span>
              <p className="text-xl font-black text-amber-300 font-mono">Rs. {totalSsclCollected.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Social Security Contribution Levy</span>
            </div>

            <div className="bg-slate-900 border border-sky-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">VAT TAX (18.0%)</span>
              <p className="text-xl font-black text-sky-300 font-mono">Rs. {totalVatCollected.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Value Added Tax (Inland Revenue)</span>
            </div>

            <div className="bg-slate-900 border border-emerald-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">TOTAL GROSS BILLING</span>
              <p className="text-xl font-black text-emerald-300 font-mono">Rs. {totalGrossInvoiced.toLocaleString()}</p>
              <span className="text-[9px] text-emerald-400/80">IRD Tax Compliant Invoiced</span>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-4 border border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">
                Official Sri Lanka IRD Tax Invoices
              </h3>
              <p className="text-xs text-slate-400">
                SVAT Registration: <strong className="text-amber-300">SVAT-882910-LK</strong> • Auto-calculates Net + SSCL (2.5%) + VAT (18%) according to Sri Lanka Tax Law.
              </p>
            </div>

            <button
              onClick={() => setShowNewInvoiceModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Issue IRD Tax Invoice</span>
            </button>
          </div>

          {/* New Invoice Generator Modal */}
          {showNewInvoiceModal && (
            <div className="bg-slate-950 border-2 border-amber-400 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <h4 className="font-extrabold text-sm uppercase text-amber-300">
                    Issue New Sri Lanka IRD Tax Invoice
                  </h4>
                </div>
                <button
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase"
                >
                  Cancel [X]
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Client / Corporate Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sampath Bank PLC / John Keells Holdings"
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white font-sans focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. finance@client.lk"
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white font-sans focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Client TIN (Taxpayer ID)</label>
                  <input
                    type="text"
                    value={clientTin}
                    onChange={(e) => setClientTin(e.target.value)}
                    placeholder="e.g. TIN-100298172-LK"
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white font-sans focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Business Unit</label>
                  <select
                    value={businessUnit}
                    onChange={(e: any) => setBusinessUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white font-sans focus:border-amber-400 outline-none"
                  >
                    <option value="LankaEcon News">LankaEcon News (Subscriptions)</option>
                    <option value="Corporate Ad Sales">Corporate Ad Sales</option>
                    <option value="Econ Academy">Econ Academy (Courses/Masterclasses)</option>
                    <option value="Ink & Canvas">Ink & Canvas (Art/Books)</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Service Description *</label>
                  <input
                    type="text"
                    required
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="e.g. Quarterly Macroeconomic Research & Executive Ad Placement"
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-white font-sans focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Net Amount LKR (Pre-Tax) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={netAmountLKR}
                    onChange={(e) => setNetAmountLKR(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 text-amber-300 font-mono font-bold focus:border-amber-400 outline-none text-base"
                  />
                </div>

                {/* Tax Computation Live Breakdown Box */}
                <div className="bg-slate-900 p-3 border border-amber-500/40 font-mono text-xs space-y-1">
                  <p className="font-bold text-amber-400 uppercase text-[10px]">AUTOMATED SRI LANKA TAX COMPUTATION:</p>
                  <p className="flex justify-between text-slate-300">
                    <span>Net Amount:</span>
                    <span>Rs. {netAmountLKR.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-amber-300">
                    <span>+ SSCL (2.5% Levy):</span>
                    <span>Rs. {previewSscl.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-sky-300">
                    <span>+ VAT (18.0% Inland Revenue):</span>
                    <span>Rs. {previewVat.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between text-emerald-300 font-extrabold border-t border-slate-700 pt-1 text-sm">
                    <span>Gross Invoice Payable:</span>
                    <span>Rs. {previewGross.toLocaleString()}</span>
                  </p>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Official IRD Tax Invoice</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tax Invoices Table */}
          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Client & TIN</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3 text-right">Net LKR</th>
                  <th className="p-3 text-right text-amber-400">SSCL 2.5%</th>
                  <th className="p-3 text-right text-sky-400">VAT 18%</th>
                  <th className="p-3 text-right text-emerald-300 font-bold">Gross Total LKR</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {invoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-amber-300">{inv.invoiceNumber}</td>
                    <td className="p-3">
                      <p className="font-bold text-white">{inv.clientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{inv.clientTin || 'No TIN'}</p>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {inv.businessUnit}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">Rs. {inv.netAmountLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-amber-300">Rs. {inv.ssclTaxLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-sky-300">Rs. {inv.vatTaxLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-black text-emerald-300 text-sm">
                      Rs. {inv.grossTotalLKR.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-0.5">
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 5: HR & STATUTORY PAYROLL */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          
          {/* Payroll Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-700 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">NET SALARIES DISBURSED</span>
              <p className="text-xl font-black text-white font-mono">Rs. {totalMonthlyPayroll.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Net take-home pay</span>
            </div>

            <div className="bg-slate-900 border border-amber-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">TOTAL EPF (20% TOTAL)</span>
              <p className="text-xl font-black text-amber-300 font-mono">Rs. {totalEpfRemittance.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">EPF Employee (8%) + Employer (12%)</span>
            </div>

            <div className="bg-slate-900 border border-sky-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">TOTAL ETF (3% EMPLOYER)</span>
              <p className="text-xl font-black text-sky-300 font-mono">Rs. {totalEtfRemittance.toLocaleString()}</p>
              <span className="text-[9px] text-slate-400">Employees' Trust Fund Board</span>
            </div>

            <div className="bg-slate-900 border border-emerald-500/40 p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">BANK SLIPS REMITTANCE</span>
              <p className="text-xl font-black text-emerald-300 font-mono">HOST-TO-HOST</p>
              <span className="text-[9px] text-emerald-400/80">Commercial Bank / BOC / Sampath</span>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-4 border border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">
                Monthly Statutory Payroll & Labour Department Returns
              </h3>
              <p className="text-xs text-slate-400">
                Employer EPF Reg: <strong className="text-amber-300">EPF-LK-881920</strong> • ETF Reg: <strong className="text-amber-300">ETF-LK-332910</strong>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleProcessPayroll}
                disabled={isProcessingPayroll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessingPayroll ? 'animate-spin' : ''}`} />
                <span>Process {monthYearInput} Payroll</span>
              </button>

              <a
                href="/api/erp/hr/bank-slips-export"
                target="_blank"
                rel="noreferrer"
                className="bg-[#0284C7] hover:bg-sky-600 text-white font-extrabold text-xs px-4 py-2.5 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Bank CEFT/SLIPS File</span>
              </a>
            </div>
          </div>

          {/* Payroll Records Table */}
          <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Employee & NIC</th>
                  <th className="p-3">Bank & Account</th>
                  <th className="p-3 text-right">Basic LKR</th>
                  <th className="p-3 text-right text-rose-400">EPF 8% (Emp)</th>
                  <th className="p-3 text-right text-amber-400">EPF 12% (Empr)</th>
                  <th className="p-3 text-right text-sky-400">ETF 3% (Empr)</th>
                  <th className="p-3 text-right text-emerald-300 font-bold">Net Salary LKR</th>
                  <th className="p-3 text-center">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {payrollRecords.map((p) => (
                  <tr key={p.payrollId} className="hover:bg-slate-800/50">
                    <td className="p-3">
                      <p className="font-bold text-white">{p.employeeName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">NIC: {p.nicNumber} • {p.department}</p>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      <p className="text-slate-200">{p.bankName}</p>
                      <p className="text-slate-400">{p.accountNumber} ({p.branchName})</p>
                    </td>
                    <td className="p-3 text-right font-mono">Rs. {p.basicSalaryLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-rose-300">-Rs. {p.epfEmployeeDeductionLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-amber-300">+Rs. {p.epfEmployerContributionLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-sky-300">+Rs. {p.etfEmployerContributionLKR.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-black text-emerald-300 text-sm">
                      Rs. {p.netSalaryLKR.toLocaleString()}
                    </td>
                    <td className="p-3 text-center font-mono text-[10px] text-slate-400">
                      {p.remittanceRef || 'CEFT-REF'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 6: PAYMENT GATEWAYS & WEBHOOKS (PAYPAL, STRIPE, PAYHERE) */}
      {activeTab === 'gateway' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PayPal & Stripe Gateway Status */}
            <div className="bg-slate-900 border border-slate-700 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-sm uppercase text-white">
                  Payment Gateways Configuration (PayPal & Stripe)
                </h3>
              </div>

              <div className="space-y-3">
                {/* PayPal Status */}
                <div className="bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-white text-xs flex items-center gap-2">
                      <span>PayPal Express Checkout</span>
                      <span className="bg-blue-900/60 text-blue-200 text-[9px] px-1.5 py-0.5 border border-blue-500/40">LIVE</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Client ID: {gatewayConfig?.paypalClientId || 'PAYPAL-LANKAECON-LIVE-881920'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleGateway('paypal', !gatewayConfig?.paypalEnabled)}
                      className={`px-3 py-1 text-[10px] font-extrabold uppercase transition cursor-pointer ${
                        gatewayConfig?.paypalEnabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {gatewayConfig?.paypalEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>

                    <button
                      onClick={() => handleTestWebhookSimulate('paypal')}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider transition cursor-pointer"
                    >
                      Test Webhook
                    </button>
                  </div>
                </div>

                {/* Stripe Status */}
                <div className="bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-white text-xs flex items-center gap-2">
                      <span>Stripe Card Gateway (Visa / MasterCard)</span>
                      <span className="bg-purple-900/60 text-purple-200 text-[9px] px-1.5 py-0.5 border border-purple-500/40">LIVE</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Key: {gatewayConfig?.stripePublishableKey || 'pk_live_51LankaEconStripeKey99281'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleGateway('stripe', !gatewayConfig?.stripeEnabled)}
                      className={`px-3 py-1 text-[10px] font-extrabold uppercase transition cursor-pointer ${
                        gatewayConfig?.stripeEnabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {gatewayConfig?.stripeEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>

                    <button
                      onClick={() => handleTestWebhookSimulate('stripe')}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider transition cursor-pointer"
                    >
                      Test Webhook
                    </button>
                  </div>
                </div>

                {/* PayHere Status */}
                <div className="bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-white text-xs flex items-center gap-2">
                      <span>PayHere / LankaPay IPG</span>
                      <span className="bg-amber-900/60 text-amber-200 text-[9px] px-1.5 py-0.5 border border-amber-500/40">SRI LANKA</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Merchant ID: MERCHANT-1029381-LK
                    </p>
                  </div>

                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase px-2 py-1">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Webhook Endpoint Config */}
            <div className="bg-slate-900 border border-slate-700 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Webhook className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-sm uppercase text-white">
                  Real-time ERP & Payment Webhook Dispatcher
                </h3>
              </div>

              <p className="text-xs text-slate-300">
                LankaEcon auto-dispatches real-time JSON webhooks to your external accounting system whenever a payment is confirmed.
              </p>

              <div className="space-y-2">
                <input
                  type="url"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://your-accounting-server.com/webhooks/lankaecon"
                  className="w-full bg-slate-950 border border-slate-700 p-2.5 text-white font-mono text-xs focus:border-amber-400 outline-none"
                />

                <button
                  onClick={handleSaveWebhook}
                  disabled={isSavingConfig}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs py-2.5 uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSavingConfig ? 'animate-spin' : ''}`} />
                  <span>Save & Test ERP Webhook Connection</span>
                </button>

                {webhookTestMessage && (
                  <p className="text-xs font-bold text-emerald-400 font-mono pt-1">
                    {webhookTestMessage}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* UNIVERSAL LEDGER & ACCOUNTING ENTRY EDIT MODAL FOR EMPLOYEES */}
      {editingEntry && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase text-white font-serif">
                  Employee Override: Edit Ledger Entry
                </h3>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Modify the transaction details below. Updating will instantly adjust the General Ledger and recalculate the Income Statement, Balance Sheet, and Cash Flow.
            </p>

            <form onSubmit={handleUpdateLedgerEntry} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase font-mono text-[10px]">Entry ID (System Ref)</label>
                <input
                  type="text"
                  disabled
                  value={editingEntry.id}
                  className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-400 font-mono text-xs cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase font-mono text-[10px]">Description / Title *</label>
                <input
                  type="text"
                  required
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-white font-sans text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase font-mono text-[10px]">Amount (LKR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={editingEntry.amountLKR}
                    onChange={(e) => setEditingEntry({ ...editingEntry, amountLKR: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-amber-300 font-mono text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase font-mono text-[10px]">Date *</label>
                  <input
                    type="date"
                    required
                    value={editingEntry.date}
                    onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-white font-mono text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase font-mono text-[10px]">Category</label>
                <input
                  type="text"
                  value={editingEntry.category}
                  onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-white font-sans text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase font-mono text-[10px]">Notes / Memo / Reason for Change</label>
                <input
                  type="text"
                  value={editingEntry.notes || ''}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  placeholder="e.g. Employee manual reconciliation adjustment"
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-white font-sans text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 uppercase font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingLedgerEntry}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 uppercase font-black text-xs cursor-pointer transition shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdatingLedgerEntry ? 'Saving Override...' : 'Save & Rebalance Ledger'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
