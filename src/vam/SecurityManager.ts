/**
 * D-Banking Security Middleware Helper
 * Strictly compliant with Bank Indonesia (BI) SNAP standards for Symmetric Signatures.
 * Architect: Senior Fintech Solutions Architect
 */

export class SnapSecurityManager {
  /**
   * Generates a current timestamp in ISO 8601 format with a fixed +07:00 (WIB) offset.
   * Format: YYYY-MM-DDTHH:mm:ss+07:00
   */
  public generateTimestamp(): string {
    const now = new Date();
    // Calculate WIB (+7) offset manually to ensure consistency regardless of server local time
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wibTime = new Date(utcTime + (3600000 * 7));
    
    // toISOString gives YYYY-MM-DDTHH:mm:ss.sssZ
    // We remove milliseconds and Z, then append +07:00
    return wibTime.toISOString().split('.')[0] + '+07:00';
  }

  /**
   * Generates a SNAP BI Symmetric Signature (HMAC-SHA512).
   * Used for transaction-level authentication.
   * 
   * @param body The request payload object
   * @param method HTTP Method (e.g., 'POST', 'GET')
   * @param url The relative URL path (e.g., '/v2.0/virtual-accounts')
   * @param accessToken The Bearer token obtained from the Auth service
   * @param timestamp The X-TIMESTAMP value (must match header)
   */
  public async generateSymmetricSignature(
    body: any,
    method: string,
    url: string,
    accessToken: string,
    timestamp?: string
  ): Promise<{ signature: string; timestamp: string }> {
    const clientSecret = process.env.SNAP_CLIENT_SECRET || 'FALLBACK_SECRET_DO_NOT_USE_IN_PROD';
    const activeTimestamp = timestamp || this.generateTimestamp();
    
    // 1. Minify Body (ensure no unnecessary whitespace)
    const minifiedBody = JSON.stringify(body);
    
    // 2. Calculate SHA-256 Hash of Minified Body (Lowercase Hex)
    const bodyHash = await this.calculateSHA256(minifiedBody);
    
    // 3. Construct String To Sign
    // Formula: HTTPMethod + ":" + RelativeUrl + ":" + AccessToken + ":" + Lowercase(HexEncode(SHA-256(MinifiedBody))) + ":" + Timestamp
    const stringToSign = [
      method.toUpperCase(),
      url,
      accessToken,
      bodyHash.toLowerCase(),
      activeTimestamp
    ].join(':');

    // 4. Calculate HMAC-SHA512 (Base64 Encoded)
    const signature = await this.calculateHMAC512(clientSecret, stringToSign);

    return {
      signature,
      timestamp: activeTimestamp
    };
  }

  /**
   * Helper: Standard SHA-256 Hex Digest
   */
  private async calculateSHA256(message: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Helper: Standard HMAC-SHA512 Base64 Signature
   */
  private async calculateHMAC512(key: string, message: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const msgData = encoder.encode(message);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw', 
      keyData, 
      { name: 'HMAC', hash: 'SHA-512' }, 
      false, 
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    
    // Convert to Base64 (Standard for SNAP BI Symmetric signatures)
    const hashArray = new Uint8Array(signatureBuffer);
    let binary = '';
    for (let i = 0; i < hashArray.byteLength; i++) {
      binary += String.fromCharCode(hashArray[i]);
    }
    return btoa(binary);
  }
}
