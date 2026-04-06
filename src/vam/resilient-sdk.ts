
/**
 * D-Banking Resilient SDK (The Nervous System)
 * Active Error Remediation & SNAP-BI Protocol Handling
 * Architect: Senior Fintech Solutions Architect
 */

import { SNAP_ERROR_CODES } from './snap-logic';
import { ChaosMiddleware, ChaosConfig } from './ChaosMiddleware';
import { SnapSecurityManager } from './SecurityManager';

export interface DoznConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  maxRetries?: number;
  mode: 'sandbox' | 'production';
  chaosConfig?: ChaosConfig;
}

export class ComplianceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ComplianceError';
  }
}

export interface RemediationStep {
  timestamp: string;
  action: string;
  errorCode: string;
  details: string;
}

const ANTASENA_SECTOR_MAP: Record<string, string> = {
  'Farming': '1010',
  'Mining': '1020',
  'Textile': '4010',
  'Construction': '2030',
  'Finance': '6010',
  'Technology': '7020'
};

export const sdkUsageExample = `
import { DoznResilientClient } from './resilient-sdk';

const client = new DoznResilientClient({
  clientId: 'HASJRAT_DEMO',
  clientSecret: 'SECRET_KEY',
  baseUrl: 'https://api.dozn.io',
  mode: 'sandbox'
});

// The SDK handles token refresh, clock drift, and signature resync automatically.
const response = await client.request('POST', '/v2.0/transfer-va', {
  amount: { value: "100000.00", currency: "IDR" },
  customerNo: "12345"
});

console.log('Remediation Log:', response.remediationHistory);
`;

export class DoznResilientClient {
  private config: DoznConfig;
  private accessToken: string | null = null;
  private clockOffset: number = 0;
  private security: SnapSecurityManager;
  private chaos: ChaosMiddleware;
  private remediationHistory: RemediationStep[] = [];

  constructor(config: DoznConfig) {
    this.config = { 
      maxRetries: 3, 
      ...config,
      chaosConfig: config.chaosConfig || {
        timestampDriftEnabled: true,
        silentDropEnabled: true,
        keyRotationEnabled: true
      }
    };
    this.security = new SnapSecurityManager();
    this.chaos = new ChaosMiddleware(this.config.chaosConfig!);
  }

  /**
   * Antasena Compliance Middleware (Indonesian Central Bank Regulation)
   * Transactions >= 500M IDR require specific metadata.
   */
  private check_antasena_compliance(body: any) {
    const amountStr = body.amount?.value || body.totalAmount?.value || "0";
    const amount = parseFloat(amountStr);
    const threshold = 500000000;

    if (amount >= threshold) {
      const info = body.additionalInfo || {};
      const hasSector = !!info.economic_sector_code;
      const hasDoc = !!info.underlying_document_type;

      if (!hasSector || !hasDoc) {
        const suggestions = Object.entries(ANTASENA_SECTOR_MAP)
          .map(([k, v]) => `${k} (${v})`)
          .join(', ');

        const errorMsg = `Antasena Compliance: Transaction >= 500M IDR requires 'economic_sector_code' and 'underlying_document_type'. Suggested Sector Codes: ${suggestions}`;

        if (this.config.mode === 'sandbox') {
          console.warn(`[SDK WARNING] ${errorMsg}. This will fail in production.`);
          return { status: 'WARNING', msg: errorMsg };
        } else {
          throw new ComplianceError(errorMsg);
        }
      }
    }
    return { status: 'OK' };
  }

  /**
   * Primary entry point for API requests with self-healing capabilities.
   */
  async request(method: string, path: string, body: any = {}): Promise<any> {
    const compliance = this.check_antasena_compliance(body);
    this.remediationHistory = []; // Reset for new request chain
    
    return this._executeWithHealer(method, path, body, 0, compliance);
  }

  /**
   * Recursive execution engine with interceptor logic for auto-remediation.
   */
  private async _executeWithHealer(
    method: string, 
    path: string, 
    body: any, 
    retryCount: number, 
    compliance: any
  ): Promise<any> {
    
    // 1. Prepare dynamic SNAP headers
    const headers = await this._prepareHeaders(method, path, body);

    try {
      // 2. Simulation of Network Interceptor with Chaos (Sandbox only)
      if (this.config.mode === 'sandbox') {
        const chaosResult = await this.chaos.intercept(method, path, body, headers);
        if (chaosResult.shouldBlock) {
          throw chaosResult.error;
        }
      }

      // 3. Actual Network Call (Simulated for this environment)
      const response = await this._simulateNetworkCall(method, path, headers, body);
      
      return { 
        ...response, 
        complianceLog: compliance,
        remediationHistory: this.remediationHistory 
      };

    } catch (error: any) {
      // 4. Analyze error for remediation possibilities
      if (retryCount >= (this.config.maxRetries || 3)) {
        throw new Error(`Circuit Breaker: Max retries exceeded for ${path}. Final error: ${error.responseMessage || error.message}`);
      }

      const remediation = await this._analyzeAndHeal(error, method, path, body);
      
      if (remediation.success) {
        this.remediationHistory.push({
          timestamp: new Date().toISOString(),
          action: remediation.action,
          errorCode: error.responseCode || 'FETCH_ERROR',
          details: remediation.details
        });

        console.log(`[SDK HEALER] Remediation successful: ${remediation.action}. Retrying (${retryCount + 1})...`);
        return this._executeWithHealer(method, path, body, retryCount + 1, compliance);
      }

      throw error;
    }
  }

  /**
   * The "Healer" Interceptor: Decides how to fix a failing request.
   */
  private async _analyzeAndHeal(error: any, method: string, path: string, body: any) {
    const code = error.responseCode?.toString();
    
    // Heal 1: Auth Failure (Token/Signature mismatch)
    if (code === "4017301" || code === "4017300" || code === "401") {
      await this._refreshToken();
      return { 
        success: true, 
        action: "TOKEN_REFRESH", 
        details: "Obtained new B2B Access Token and regenerated signature." 
      };
    }
    
    // Heal 2: Clock Drift (Timestamp format or window violation)
    if (code === "4007301" || code === "4017302") {
      const serverDate = error.serverDate || new Date().toISOString();
      this.clockOffset = new Date(serverDate).getTime() - Date.now();
      return { 
        success: true, 
        action: "CLOCK_SYNC", 
        details: `Synchronized local clock with Bank Server. New offset: ${this.clockOffset}ms` 
      };
    }

    // Heal 3: Conflict (Idempotency failure)
    if (code === "4097300" || code === "409") {
       // In a real scenario, we might want to verify if the previous one succeeded
       // For this SDK, we'll try a new external ID if the user wants a retry
       return { 
         success: true, 
         action: "IDEMPOTENCY_RENEWAL", 
         details: "Generated new X-EXTERNAL-ID for a clean transaction intent." 
       };
    }

    return { success: false, action: "NONE", details: "Error not remediable by SDK heuristics." };
  }

  /**
   * Prepares the standard BI SNAP headers with signature generation.
   */
  private async _prepareHeaders(method: string, path: string, body: any) {
    const timestamp = new Date(Date.now() + this.clockOffset)
      .toISOString()
      .replace('Z', '+07:00');

    const token = this.accessToken || 'INITIAL_EXPIRED_TOKEN';
    
    // Real signature calculation logic using SecurityManager
    const { signature } = await this.security.generateSymmetricSignature(
      body,
      method,
      path,
      token,
      timestamp
    );

    return {
      'Content-Type': 'application/json',
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature,
      'X-PARTNER-ID': this.config.clientId,
      'X-EXTERNAL-ID': `TX-${Math.random().toString(36).substr(2, 9)}`,
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Refreshes the B2B Access Token.
   */
  private async _refreshToken() {
    // In production, this would be an asymmetric call to /v2.0/client-trust/token
    this.accessToken = "VAM_SECURE_TOKEN_" + Math.random().toString(36).substr(2, 10);
    return Promise.resolve();
  }

  /**
   * Mock Network Call for demo purposes.
   */
  private async _simulateNetworkCall(method: string, path: string, headers: any, body: any) {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulation logic to trigger healing cycles
    if (headers['Authorization'] === 'Bearer INITIAL_EXPIRED_TOKEN') {
      throw { responseCode: "4017301", responseMessage: "Unauthorized. Token Expired." };
    }

    // Simulate clock drift error if no offset is set yet (and it's first retry)
    if (this.clockOffset === 0 && Math.random() < 0.2) {
      throw { 
        responseCode: "4007301", 
        responseMessage: "Invalid Timestamp Format.", 
        serverDate: new Date().toISOString() 
      };
    }

    return { 
      responseCode: "2000000", 
      responseMessage: "Successful",
      data: {
        referenceNo: "DOZN-" + Date.now(),
        status: "PROCESSED"
      }
    };
  }
}
