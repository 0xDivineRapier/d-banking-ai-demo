import React, { useState, useMemo } from 'react';
import { useI18n } from './i18n';
import {
  Book,
  Key,
  Shield,
  Globe,
  ChevronRight,
  Copy,
  CheckCircle2,
  Play,
  Code,
  Zap,
  ArrowRight,
  Terminal,
  FileJson,
  Lock,
  Send,
  Search,
  CreditCard,
  Banknote,
  AlertTriangle,
  Clock,
  Hash,
  Server,
  Layers,
  ExternalLink,
  ChevronDown,
  Cpu
} from 'lucide-react';

// --- Types ---
interface ApiEndpoint {
  id: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  category: string;
  requestBody?: Record<string, any>;
  responseBody?: Record<string, any>;
  headers?: Record<string, string>;
  params?: { name: string; type: string; required: boolean; description: string }[];
}

// --- SNAP API Endpoints Data ---
const API_ENDPOINTS: ApiEndpoint[] = [
  // Virtual Account SNAP API
  {
    id: 'va-create',
    method: 'POST',
    path: '/snap/v1/transfer-va/create-va',
    title: 'Create Virtual Account',
    description: 'Create a new virtual account number for a corporate client. Supports open and closed VA types with configurable expiry.',
    category: 'Virtual Account',
    params: [
      { name: 'partnerServiceId', type: 'string', required: true, description: 'Bank partner service identifier (8 digits)' },
      { name: 'customerNo', type: 'string', required: true, description: 'Customer number assigned by the partner' },
      { name: 'virtualAccountNo', type: 'string', required: true, description: 'Full VA number (partnerServiceId + customerNo)' },
      { name: 'virtualAccountName', type: 'string', required: true, description: 'Account holder name for display' },
      { name: 'trxId', type: 'string', required: true, description: 'Unique transaction identifier from partner' },
      { name: 'totalAmount.value', type: 'string', required: false, description: 'Expected payment amount (for closed VA)' },
      { name: 'totalAmount.currency', type: 'string', required: false, description: 'ISO 4217 currency code (default: IDR)' },
      { name: 'expiredDate', type: 'string', required: false, description: 'VA expiration datetime (ISO 8601)' },
    ],
    requestBody: {
      partnerServiceId: "   88001",
      customerNo: "00000000000001",
      virtualAccountNo: "   8800100000000000001",
      virtualAccountName: "PT Hasjrat Abadi - Invoice #2024-001",
      trxId: "TRX-20240315-001",
      totalAmount: { value: "1500000.00", currency: "IDR" },
      virtualAccountTrxType: "C",
      expiredDate: "2024-04-15T23:59:59+07:00",
      additionalInfo: {
        channel: "VIRTUAL_ACCOUNT",
        virtualAccountConfig: { reusableStatus: false }
      }
    },
    responseBody: {
      responseCode: "2002700",
      responseMessage: "Successful",
      virtualAccountData: {
        partnerServiceId: "   88001",
        customerNo: "00000000000001",
        virtualAccountNo: "   8800100000000000001",
        virtualAccountName: "PT Hasjrat Abadi - Invoice #2024-001",
        trxId: "TRX-20240315-001",
        totalAmount: { value: "1500000.00", currency: "IDR" },
        expiredDate: "2024-04-15T23:59:59+07:00"
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'X-EXTERNAL-ID': 'EXT-20240315-001',
      'CHANNEL-ID': '95051',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'va-inquiry',
    method: 'POST',
    path: '/snap/v1/transfer-va/inquiry-va',
    title: 'Inquiry Virtual Account',
    description: 'Query the status and details of an existing virtual account. Returns current balance, payment status, and metadata.',
    category: 'Virtual Account',
    params: [
      { name: 'partnerServiceId', type: 'string', required: true, description: 'Bank partner service identifier' },
      { name: 'customerNo', type: 'string', required: true, description: 'Customer number assigned by the partner' },
      { name: 'virtualAccountNo', type: 'string', required: true, description: 'Full VA number to query' },
      { name: 'inquiryRequestId', type: 'string', required: false, description: 'Unique request ID for idempotency' },
    ],
    requestBody: {
      partnerServiceId: "   88001",
      customerNo: "00000000000001",
      virtualAccountNo: "   8800100000000000001",
      inquiryRequestId: "INQ-20240315-001"
    },
    responseBody: {
      responseCode: "2002400",
      responseMessage: "Successful",
      virtualAccountData: {
        inquiryStatus: "00",
        inquiryReason: { english: "Success", indonesia: "Sukses" },
        partnerServiceId: "   88001",
        customerNo: "00000000000001",
        virtualAccountNo: "   8800100000000000001",
        virtualAccountName: "PT Hasjrat Abadi - Invoice #2024-001",
        totalAmount: { value: "1500000.00", currency: "IDR" },
        paidAmount: { value: "0.00", currency: "IDR" },
        virtualAccountTrxType: "C",
        expiredDate: "2024-04-15T23:59:59+07:00"
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'va-payment',
    method: 'POST',
    path: '/snap/v1/transfer-va/payment-va',
    title: 'Payment Notification',
    description: 'Receive payment notification callback when a customer pays to a virtual account. Bank XYZ sends this to the partner\'s registered callback URL.',
    category: 'Virtual Account',
    params: [
      { name: 'partnerServiceId', type: 'string', required: true, description: 'Bank partner service identifier' },
      { name: 'customerNo', type: 'string', required: true, description: 'Customer number' },
      { name: 'virtualAccountNo', type: 'string', required: true, description: 'Full VA number that received payment' },
      { name: 'paymentRequestId', type: 'string', required: true, description: 'Unique payment request identifier' },
      { name: 'paidAmount.value', type: 'string', required: true, description: 'Amount actually paid by customer' },
      { name: 'paidAmount.currency', type: 'string', required: true, description: 'Payment currency (IDR)' },
    ],
    requestBody: {
      partnerServiceId: "   88001",
      customerNo: "00000000000001",
      virtualAccountNo: "   8800100000000000001",
      paymentRequestId: "PAY-20240315-001",
      paidAmount: { value: "1500000.00", currency: "IDR" },
      referenceNo: "REF-BNK-20240315-001",
      flagAdvise: "N",
      additionalInfo: {
        paymentChannel: "ATM",
        senderName: "AHMAD HIDAYAT"
      }
    },
    responseBody: {
      responseCode: "2002500",
      responseMessage: "Successful",
      virtualAccountData: {
        paymentFlagReason: { english: "Payment Accepted", indonesia: "Pembayaran Diterima" },
        partnerServiceId: "   88001",
        customerNo: "00000000000001",
        virtualAccountNo: "   8800100000000000001",
        paymentRequestId: "PAY-20240315-001",
        paidAmount: { value: "1500000.00", currency: "IDR" }
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'va-update',
    method: 'PUT',
    path: '/snap/v1/transfer-va/update-va',
    title: 'Update Virtual Account',
    description: 'Modify an existing virtual account. Supports updating amount, expiry date, and status.',
    category: 'Virtual Account',
    params: [
      { name: 'partnerServiceId', type: 'string', required: true, description: 'Bank partner service identifier' },
      { name: 'customerNo', type: 'string', required: true, description: 'Customer number' },
      { name: 'virtualAccountNo', type: 'string', required: true, description: 'VA number to update' },
      { name: 'trxId', type: 'string', required: true, description: 'Original transaction identifier' },
      { name: 'totalAmount.value', type: 'string', required: false, description: 'New expected amount' },
      { name: 'expiredDate', type: 'string', required: false, description: 'New expiration datetime' },
    ],
    requestBody: {
      partnerServiceId: "   88001",
      customerNo: "00000000000001",
      virtualAccountNo: "   8800100000000000001",
      trxId: "TRX-20240315-001",
      totalAmount: { value: "2000000.00", currency: "IDR" },
      expiredDate: "2024-05-15T23:59:59+07:00",
      virtualAccountTrxType: "C",
      additionalInfo: { updateReason: "Amount revision per client request" }
    },
    responseBody: {
      responseCode: "2002800",
      responseMessage: "Successful",
      virtualAccountData: {
        partnerServiceId: "   88001",
        customerNo: "00000000000001",
        virtualAccountNo: "   8800100000000000001",
        trxId: "TRX-20240315-001",
        totalAmount: { value: "2000000.00", currency: "IDR" },
        expiredDate: "2024-05-15T23:59:59+07:00"
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'va-delete',
    method: 'DELETE',
    path: '/snap/v1/transfer-va/delete-va',
    title: 'Delete Virtual Account',
    description: 'Deactivate and remove a virtual account. The VA number will no longer accept payments after deletion.',
    category: 'Virtual Account',
    params: [
      { name: 'partnerServiceId', type: 'string', required: true, description: 'Bank partner service identifier' },
      { name: 'customerNo', type: 'string', required: true, description: 'Customer number' },
      { name: 'virtualAccountNo', type: 'string', required: true, description: 'VA number to delete' },
      { name: 'trxId', type: 'string', required: true, description: 'Original transaction identifier' },
    ],
    requestBody: {
      partnerServiceId: "   88001",
      customerNo: "00000000000001",
      virtualAccountNo: "   8800100000000000001",
      trxId: "TRX-20240315-001",
      additionalInfo: { reason: "Invoice cancelled" }
    },
    responseBody: {
      responseCode: "2002900",
      responseMessage: "Successful",
      virtualAccountData: {
        partnerServiceId: "   88001",
        customerNo: "00000000000001",
        virtualAccountNo: "   8800100000000000001",
        trxId: "TRX-20240315-001"
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'va-report',
    method: 'POST',
    path: '/snap/v1/transfer-va/report',
    title: 'VA Transaction Report',
    description: 'Generate a report of all VA transactions within a specified date range. Supports pagination and filtering by status.',
    category: 'Virtual Account',
    params: [
      { name: 'partnerServiceId', type: 'string', required: true, description: 'Bank partner service identifier' },
      { name: 'startDate', type: 'string', required: true, description: 'Report start date (ISO 8601)' },
      { name: 'endDate', type: 'string', required: true, description: 'Report end date (ISO 8601)' },
      { name: 'pageSize', type: 'number', required: false, description: 'Records per page (max 100)' },
      { name: 'pageNumber', type: 'number', required: false, description: 'Page number (1-based)' },
    ],
    requestBody: {
      partnerServiceId: "   88001",
      startDate: "2024-03-01T00:00:00+07:00",
      endDate: "2024-03-15T23:59:59+07:00",
      pageSize: 20,
      pageNumber: 1,
      additionalInfo: { statusFilter: "ALL" }
    },
    responseBody: {
      responseCode: "2003100",
      responseMessage: "Successful",
      totalRecords: 142,
      pageSize: 20,
      pageNumber: 1,
      transactions: [
        { virtualAccountNo: "   8800100000000000001", amount: "1500000.00", status: "PAID", paidDate: "2024-03-10T14:22:00+07:00" },
        { virtualAccountNo: "   8800100000000000002", amount: "750000.00", status: "PENDING", paidDate: null }
      ]
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'Authorization': 'Bearer {access_token}'
    }
  },
  // Fund Transfer SNAP API
  {
    id: 'ft-interbank',
    method: 'POST',
    path: '/snap/v1/transfer/interbank',
    title: 'Interbank Transfer',
    description: 'Execute real-time interbank fund transfer via BI-FAST / RTGS / SKN clearing network. Supports domestic IDR transfers to all BI-member banks.',
    category: 'Fund Transfer',
    params: [
      { name: 'beneficiaryAccountNo', type: 'string', required: true, description: 'Destination account number' },
      { name: 'beneficiaryBankCode', type: 'string', required: true, description: 'BI bank code of destination bank' },
      { name: 'amount.value', type: 'string', required: true, description: 'Transfer amount' },
      { name: 'amount.currency', type: 'string', required: true, description: 'Currency (IDR)' },
      { name: 'sourceAccountNo', type: 'string', required: true, description: 'Source/debit account number' },
      { name: 'transactionDate', type: 'string', required: true, description: 'Transaction datetime (ISO 8601)' },
      { name: 'beneficiaryEmail', type: 'string', required: false, description: 'Email for transfer notification' },
    ],
    requestBody: {
      partnerReferenceNo: "FT-20240315-001",
      amount: { value: "25000000.00", currency: "IDR" },
      beneficiaryAccountName: "BUDI SANTOSO",
      beneficiaryAccountNo: "1234567890",
      beneficiaryBankCode: "014",
      beneficiaryBankName: "Bank Central Asia",
      sourceAccountNo: "8800100000001",
      transactionDate: "2024-03-15T10:30:00+07:00",
      additionalInfo: {
        transferType: "BI-FAST",
        purposeCode: "01",
        remark: "VA Settlement Disbursement"
      }
    },
    responseBody: {
      responseCode: "2001700",
      responseMessage: "Successful",
      referenceNo: "BNK-REF-20240315-001",
      partnerReferenceNo: "FT-20240315-001",
      amount: { value: "25000000.00", currency: "IDR" },
      beneficiaryAccountNo: "1234567890",
      beneficiaryBankCode: "014",
      sourceAccountNo: "8800100000001",
      transactionDate: "2024-03-15T10:30:00+07:00",
      transactionStatus: "00"
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'X-EXTERNAL-ID': 'EXT-FT-20240315-001',
      'CHANNEL-ID': '95051',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'ft-intrabank',
    method: 'POST',
    path: '/snap/v1/transfer/intrabank',
    title: 'Intrabank Transfer',
    description: 'Execute instant fund transfer between Bank XYZ accounts. Zero-fee, real-time settlement with immediate balance update.',
    category: 'Fund Transfer',
    params: [
      { name: 'beneficiaryAccountNo', type: 'string', required: true, description: 'Destination Bank XYZ account' },
      { name: 'amount.value', type: 'string', required: true, description: 'Transfer amount' },
      { name: 'sourceAccountNo', type: 'string', required: true, description: 'Source Bank XYZ account' },
      { name: 'remark', type: 'string', required: false, description: 'Transfer memo/description' },
    ],
    requestBody: {
      partnerReferenceNo: "FT-INTRA-20240315-001",
      amount: { value: "5000000.00", currency: "IDR" },
      beneficiaryAccountName: "SITI RAHMA",
      beneficiaryAccountNo: "8800200000001",
      sourceAccountNo: "8800100000001",
      transactionDate: "2024-03-15T10:30:00+07:00",
      remark: "Internal settlement"
    },
    responseBody: {
      responseCode: "2001800",
      responseMessage: "Successful",
      referenceNo: "BNK-INTRA-20240315-001",
      partnerReferenceNo: "FT-INTRA-20240315-001",
      amount: { value: "5000000.00", currency: "IDR" },
      beneficiaryAccountNo: "8800200000001",
      sourceAccountNo: "8800100000001",
      transactionStatus: "00"
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'X-PARTNER-ID': 'HSJ-001',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'ft-status',
    method: 'POST',
    path: '/snap/v1/transfer/status',
    title: 'Transfer Status Inquiry',
    description: 'Check the current status of a fund transfer. Use the original reference number to track settlement progress.',
    category: 'Fund Transfer',
    params: [
      { name: 'originalPartnerReferenceNo', type: 'string', required: true, description: 'Original transfer reference from partner' },
      { name: 'originalReferenceNo', type: 'string', required: false, description: 'Bank reference number (if available)' },
      { name: 'serviceCode', type: 'string', required: true, description: 'Service code: 17 (interbank) or 18 (intrabank)' },
    ],
    requestBody: {
      originalPartnerReferenceNo: "FT-20240315-001",
      originalReferenceNo: "BNK-REF-20240315-001",
      serviceCode: "17",
      transactionDate: "2024-03-15T10:30:00+07:00"
    },
    responseBody: {
      responseCode: "2003600",
      responseMessage: "Successful",
      originalPartnerReferenceNo: "FT-20240315-001",
      originalReferenceNo: "BNK-REF-20240315-001",
      serviceCode: "17",
      latestTransactionStatus: "00",
      transactionStatusDesc: "Settlement completed",
      amount: { value: "25000000.00", currency: "IDR" },
      settlementDate: "2024-03-15T10:30:05+07:00"
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'Authorization': 'Bearer {access_token}'
    }
  },
  {
    id: 'ft-balance',
    method: 'POST',
    path: '/snap/v1/balance-inquiry',
    title: 'Balance Inquiry',
    description: 'Query real-time balance of a Bank XYZ account. Returns available balance, current balance, and hold amount.',
    category: 'Fund Transfer',
    params: [
      { name: 'accountNo', type: 'string', required: true, description: 'Account number to query' },
    ],
    requestBody: {
      partnerReferenceNo: "BAL-20240315-001",
      accountNo: "8800100000001",
      additionalInfo: { accountType: "SAVINGS" }
    },
    responseBody: {
      responseCode: "2001100",
      responseMessage: "Successful",
      accountNo: "8800100000001",
      name: "PT HASJRAT ABADI",
      accountInfos: {
        balanceType: "AVAILABLE",
        amount: { value: "1250000000.00", currency: "IDR" },
        holdAmount: { value: "50000000.00", currency: "IDR" },
        currentBalance: { value: "1300000000.00", currency: "IDR" }
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': '2024-03-15T10:30:00+07:00',
      'X-SIGNATURE': 'HMACSHA512(...)',
      'Authorization': 'Bearer {access_token}'
    }
  },
];

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  POST: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  PUT: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  DELETE: { bg: 'bg-red-500/10', text: 'text-red-600' },
  PATCH: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
};

// --- Code Block with Copy ---
function CodeBlock({ code, language = 'json', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-[hsl(var(--zenith-navy))]">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[hsl(var(--zenith-navy))] border-b border-white/10">
          <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">{title}</span>
          <button onClick={copyToClipboard} className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors">
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-emerald-300/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// --- API Try-It Console ---
function ApiConsole({ endpoint }: { endpoint: ApiEndpoint }) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = () => {
    setLoading(true);
    setTimeout(() => {
      setResponse(JSON.stringify(endpoint.responseBody, null, 2));
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  const curlCommand = `curl -X ${endpoint.method} \\
  https://api.bankxyz.co.id${endpoint.path} \\
${Object.entries(endpoint.headers || {}).map(([k, v]) => `  -H '${k}: ${v}'`).join(' \\\n')} \\
  -d '${JSON.stringify(endpoint.requestBody, null, 2)}'`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleExecute}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <Clock size={14} className="animate-spin" /> : <Play size={14} />}
          {loading ? 'Executing...' : 'Send Request'}
        </button>
        <span className="text-[10px] text-muted-foreground font-mono">Sandbox Mode — No real transactions</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CodeBlock code={curlCommand} title="cURL" language="bash" />
        {response && <CodeBlock code={response} title={`Response · ${endpoint.responseBody?.responseCode || '200'}`} />}
      </div>
    </div>
  );
}

// --- Endpoint Detail View ---
function EndpointDetail({ endpoint }: { endpoint: ApiEndpoint }) {
  const mc = METHOD_COLORS[endpoint.method];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${mc.bg} ${mc.text}`}>{endpoint.method}</span>
          <code className="text-sm font-mono text-foreground font-semibold">{endpoint.path}</code>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{endpoint.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{endpoint.description}</p>
      </div>

      {/* Required Headers */}
      {endpoint.headers && (
        <section>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lock size={14} className="text-primary" /> Required Headers
          </h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-2 font-bold text-muted-foreground">Header</th>
                  <th className="text-left px-4 py-2 font-bold text-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(endpoint.headers).map(([k, v]) => (
                  <tr key={k} className="border-t border-border/50">
                    <td className="px-4 py-2 font-mono font-semibold text-foreground">{k}</td>
                    <td className="px-4 py-2 font-mono text-muted-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Parameters */}
      {endpoint.params && endpoint.params.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Hash size={14} className="text-primary" /> Parameters
          </h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-2 font-bold text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-2 font-bold text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-2 font-bold text-muted-foreground">Required</th>
                  <th className="text-left px-4 py-2 font-bold text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.params.map(p => (
                  <tr key={p.name} className="border-t border-border/50">
                    <td className="px-4 py-2 font-mono font-semibold text-foreground">{p.name}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">{p.type}</span></td>
                    <td className="px-4 py-2">{p.required ? <span className="text-destructive font-bold">Required</span> : <span className="text-muted-foreground">Optional</span>}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Request / Response */}
      <section>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileJson size={14} className="text-primary" /> Request & Response
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {endpoint.requestBody && (
            <CodeBlock code={JSON.stringify(endpoint.requestBody, null, 2)} title="Request Body" />
          )}
          {endpoint.responseBody && (
            <CodeBlock code={JSON.stringify(endpoint.responseBody, null, 2)} title="Response Body" />
          )}
        </div>
      </section>

      {/* Try It */}
      <section>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Terminal size={14} className="text-primary" /> API Console
        </h3>
        <ApiConsole endpoint={endpoint} />
      </section>
    </div>
  );
}

// --- Main Sandbox Portal ---
export default function ApiSandbox() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState(API_ENDPOINTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [envMode, setEnvMode] = useState<'sandbox' | 'production'>('sandbox');

  const categories = useMemo(() => {
    const cats: Record<string, ApiEndpoint[]> = {};
    API_ENDPOINTS.forEach(ep => {
      if (!cats[ep.category]) cats[ep.category] = [];
      cats[ep.category].push(ep);
    });
    return cats;
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    const result: Record<string, ApiEndpoint[]> = {};
    Object.entries(categories).forEach(([cat, eps]) => {
      const f = eps.filter(ep => ep.title.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q));
      if (f.length) result[cat] = f;
    });
    return result;
  }, [categories, searchQuery]);

  const selectedEndpoint = API_ENDPOINTS.find(ep => ep.id === selectedId) || API_ENDPOINTS[0];

  const CATEGORY_ICONS: Record<string, any> = {
    'Virtual Account': CreditCard,
    'Fund Transfer': Banknote,
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Portal Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.15em]">
              Developer Portal
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              envMode === 'sandbox' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              {envMode === 'sandbox' ? '⚡ Sandbox' : '🔒 Production'}
            </div>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">SNAP API Reference</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Complete API documentation for Bank XYZ Virtual Account and Fund Transfer services. SNAP BI v1.0 compliant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Environment Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
            <button onClick={() => setEnvMode('sandbox')} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${envMode === 'sandbox' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              Sandbox
            </button>
            <button onClick={() => setEnvMode('production')} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${envMode === 'production' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              Production
            </button>
          </div>
        </div>
      </div>

      {/* Base URL Card */}
      <div className="mb-8 p-5 rounded-2xl border border-border bg-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">BASE URL</p>
            <code className="text-sm font-mono font-bold text-foreground">
              {envMode === 'sandbox' ? 'https://api-sandbox.bankxyz.co.id' : 'https://api.bankxyz.co.id'}
            </code>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">YOUR API KEY</p>
              <code className="text-xs font-mono text-muted-foreground">sk_test_BQok1kJ...2HlWgH4olfQ2</code>
            </div>
            <div className="flex gap-2">
              {['cURL', 'Node.js', 'Python', 'Java', 'Go'].map(lang => (
                <span key={lang} className="px-2 py-1 rounded-md bg-muted text-[9px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer transition-colors">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Sidebar + Content */}
      <div className="flex gap-0 rounded-2xl border border-border bg-card overflow-hidden min-h-[700px]">
        {/* Left Sidebar */}
        <div className="w-[280px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search endpoints..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3">
            {/* Intro items */}
            <div className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-3 mb-2">Getting Started</p>
              {['Introduction', 'Authentication', 'Error Codes', 'Rate Limits', 'Webhooks'].map(item => (
                <button key={item} className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  {item}
                </button>
              ))}
            </div>

            {/* API categories */}
            {Object.entries(filtered).map(([cat, endpoints]) => {
              const Icon = CATEGORY_ICONS[cat] || Layers;
              return (
                <div key={cat} className="mb-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-3 mb-2 flex items-center gap-2">
                    <Icon size={12} /> {cat}
                  </p>
                  {endpoints.map(ep => {
                    const mc = METHOD_COLORS[ep.method];
                    const isActive = selectedId === ep.id;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => setSelectedId(ep.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                          isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${mc.bg} ${mc.text} shrink-0`}>
                          {ep.method}
                        </span>
                        <span className="truncate">{ep.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <EndpointDetail endpoint={selectedEndpoint} />
        </div>
      </div>
    </div>
  );
}
