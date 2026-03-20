
/**
 * D-Banking VAM Reconciliation & Receipt Tracking Engine
 * Optimized for high-volume installment collections (Hasjrat Finance)
 */

import { TransactionStatus } from './types';

export interface PaymentNotification {
  vaNumber: string;
  amount: number;
  externalId: string;
  timestamp: string;
  channelId: string;
}

export interface ReconciliationResult {
  status: '00' | '05' | '99'; // 00: Success, 05: Unappropriated, 99: System Error
  message: string;
  isFdsFlagged: boolean;
  targetMotherAccount: string;
  shadowBalanceDelta: number;
}

/**
 * FDS Sub-routine: Detects 'Same Amount' deposited 3x in 1 minute
 */
export const runFDSCheck = (
  newPayment: PaymentNotification,
  recentHistory: PaymentNotification[]
): boolean => {
  const ONE_MINUTE = 60 * 1000;
  const now = new Date(newPayment.timestamp).getTime();
  
  const similarPayments = recentHistory.filter(p => {
    const pTime = new Date(p.timestamp).getTime();
    return p.amount === newPayment.amount && (now - pTime) <= ONE_MINUTE;
  });

  return similarPayments.length >= 2; // Including current, that makes 3
};

/**
 * Reference implementation of the processPaymentNotification service
 */
export const processPaymentNotificationServiceCode = `
/**
 * processPaymentNotification
 * The core engine for D-Banking VAM Receipt Tracking
 */
async function processPaymentNotification(notification: PaymentNotification) {
  const { vaNumber, amount, externalId } = notification;
  
  // 1. VERIFY: Lookup VA and Status
  const va = await db.virtual_accounts.findFirst({
    where: { va_number: vaNumber, status: 'ACTIVE' },
    include: { motherAccount: true }
  });

  if (!va) {
    // VA Not found or Expired -> Route to Unappropriated
    return recordTransaction(notification, '05', 'VA_NOT_FOUND_OR_EXPIRED');
  }

  // 2. FDS CHECK: Velocity attack prevention
  const recentHistory = await db.transactions.findMany({
    where: { va_id: va.id, created_at: { gte: new Date(Date.now() - 60000) } }
  });
  
  const isFraud = runFDSCheck(notification, recentHistory);
  if (isFraud) {
    return recordTransaction(notification, '05', 'FDS_VELOCITY_LIMIT_EXCEEDED');
  }

  // 3. RECONCILIATION: Match Deposit Information
  // For Hasjrat Finance: Expecting exact installment amount
  const isMatch = Math.abs(va.expected_amount - amount) < 0.01;
  
  if (isMatch) {
    // 4. MOTHER ACCOUNT LOGIC: Update Shadow Balance
    await db.mother_accounts.update({
      where: { id: va.mother_account_id },
      data: { balance: { increment: amount } }
    });
    
    return recordTransaction(notification, '00', 'MATCH_SUCCESS');
  } else {
    // Wrong amount -> Manual Review
    return recordTransaction(notification, '05', 'AMOUNT_MISMATCH');
  }
}
`;
