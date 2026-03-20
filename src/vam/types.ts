
export enum AccountType {
  COLLECTION = 'COLLECTION',
  WITHDRAWAL = 'WITHDRAWAL'
}

export enum ConnectionType {
  SOCKET = 'SOCKET',
  REST = 'REST'
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  UNAPPROPRIATED = 'UNAPPROPRIATED'
}

export enum TransactionCategory {
  STM = 'STM', // Setoran Tabungan (Deposit)
  TTAK = 'TTAK' // Tarik Tunai/Remittance (Withdrawal)
}

export enum FeeType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE'
}

export interface FeeConfig {
  feeType: FeeType;
  feeValue: number;
  epaySplitPercent: number; // Percentage of the fee that goes to the aggregator (e-pay)
}

export interface ClientFeatures {
  fdsEnabled: boolean;
  crossBorderEnabled: boolean;
  snapV2Enabled: boolean;
  autoReconciliation: boolean;
  socketLegacySupport: boolean;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  connectionType: ConnectionType;
  ipAddress?: string;
  port?: number;
  apiEndpoint?: string;
  status: 'ACTIVE' | 'INACTIVE';
  features: ClientFeatures;
  feeConfig: FeeConfig;
  volume24h: number;
  rankChange: 'UP' | 'DOWN' | 'STABLE';
}

export interface MotherAccount {
  id: string;
  institutionId: string;
  accountNumber: string;
  accountName: string;
  type: AccountType;
  currency: string;
  balance: number;
}

export interface VirtualAccount {
  id: string;
  motherAccountId: string;
  vaNumber: string;
  customerName: string;
  currency: string;
  expirationDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface Transaction {
  id: string;
  vaId?: string;
  motherAccountId: string;
  externalId: string; // SNAP X-EXTERNAL-ID
  amount: number;
  currency: string;
  type: 'CREDIT' | 'DEBIT';
  category: TransactionCategory;
  status: TransactionStatus;
  responseStatus: string; // e.g., '00', '05'
  timestamp: string;
}

export interface SettlementBatch {
  id: string;
  batchDate: string;
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}
