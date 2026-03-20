
/**
 * D-Banking SNAP BI Type Definitions
 * Strictly mirrored from Bank Indonesia SNAP Open API Specifications
 */

export interface TotalAmount {
  /** Value string, e.g. "10000.00" */
  value: string;
  /** ISO 4217 Currency Code, e.g. "IDR" */
  currency: string;
}

export interface SnapHeader {
  'X-TIMESTAMP': string;
  'X-PARTNER-ID': string;
  'X-EXTERNAL-ID': string;
  'CHANNEL-ID': string;
  'X-SIGNATURE': string;
  'Authorization'?: string;
  'X-IP-ADDRESS'?: string;
  'X-DEVICE-ID'?: string;
}

/**
 * SNAP BI: Virtual Account Inquiry Request
 */
export interface VirtualAccountInquiryRequest {
  partnerServiceId: string;
  customerNo: string;
  virtualAccountNo: string;
  channelCode?: string;
}

/**
 * SNAP BI: Virtual Account Create Request
 */
export interface VirtualAccountCreateRequest {
  partnerServiceId: string;
  customerNo: string;
  virtualAccountName: string;
  totalAmount: TotalAmount;
  trxId: string;
  expiredDate: string;
  additionalInfo?: Record<string, any>;
}

/**
 * SNAP BI: Virtual Account Response Structure
 */
export interface SnapResponse<T = any> {
  responseCode: string;
  responseMessage: string;
  virtualAccountData?: T;
  additionalInfo?: Record<string, any>;
}
