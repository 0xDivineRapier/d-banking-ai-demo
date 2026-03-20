
/**
 * D-Banking Chaos Middleware
 * Purpose: Intentionally break the Sandbox to test Client Resilience.
 */

export interface ChaosConfig {
  timestampDriftEnabled: boolean;
  silentDropEnabled: boolean;
  keyRotationEnabled: boolean;
}

export class ChaosMiddleware {
  private config: ChaosConfig;
  private lastRotation: number = Date.now();

  constructor(config: ChaosConfig) {
    this.config = config;
  }

  async intercept(method: string, path: string, body: any, headers: any): Promise<{ shouldBlock: boolean; error?: any }> {
    // 1. Scenario: Timestamp Drift Attack (10% probability)
    if (this.config.timestampDriftEnabled && Math.random() < 0.10) {
      return {
        shouldBlock: true,
        error: { 
          responseCode: "4007301", 
          responseMessage: "Invalid Timestamp (Chaos Attack)",
          serverDate: new Date().toISOString()
        }
      };
    }

    // 2. Scenario: Silent Drop (Timeout for > 1B IDR)
    if (this.config.silentDropEnabled && path === '/v2.0/credit-transfer' && method === 'POST') {
      const amount = parseFloat(body.amount?.value || "0");
      if (amount >= 1000000000) {
        console.warn("[Chaos Middleware] Initiating Silent Drop for high-value transfer...");
        // Simulate a 35s hang (we shorten it for UI experience but return 504)
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        return {
          shouldBlock: true,
          error: { 
            status: 504, 
            responseCode: "5040000", 
            responseMessage: "Gateway Timeout (Simulated Silent Drop)" 
          }
        };
      }
    }

    // 3. Scenario: Key Rotation Event (Simulated 24h cycle)
    // For simulation, we check if the current minute is divisible by 5 (rotates every 5 mins in sandbox)
    if (this.config.keyRotationEnabled) {
      const currentMinute = new Date().getMinutes();
      if (currentMinute % 5 === 0) {
         return {
           shouldBlock: true,
           error: { 
             responseCode: "4017300", 
             responseMessage: "Unauthorized. Key Rotation Event Active." 
           }
         };
      }
    }

    return { shouldBlock: false };
  }
}
