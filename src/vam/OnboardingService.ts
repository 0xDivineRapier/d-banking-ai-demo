
/**
 * Dozn Banking Smart Onboarding Service
 * Specialized for Dozn Global Admin Dashboard - 'Register VA' Module
 * Architect: Senior Backend Developer
 */

export interface CorporateProfile {
  cif_name: string;
  legal_id: string;
  corporate_address: string;
  phone: string;
  main_account_list: string[];
}

export interface LimitConfig {
  daily_transfer_limit: number;
  per_transaction_limit: number;
}

export interface TechnicalConfig {
  whitelist_ips: string[];
  ports: number[];
}

export interface OnboardingResponse {
  status: "SUCCESS" | "FAILED" | "WARNING";
  error_code?: string;
  message?: string;
  data?: {
    profile: CorporateProfile;
    suggested_prefix: string;
    limit_validation: {
      status: "OK" | "WARNING";
      message: string;
    };
  };
}

export class OnboardingService {
  // BANKWIDE_MASTER_LIMIT: 10 Billion IDR (10.000.000.000) for standard merchants
  private static readonly BANKWIDE_MASTER_LIMIT = 10_000_000_000;
  
  // Simulated T24 Core Banking Database
  private static readonly T24_CIF_STORE: Record<string, CorporateProfile> = {
    "CIF-1001": {
      cif_name: "PT. ABC Corp",
      legal_id: "ID-9921004",
      corporate_address: "Dozn Global Strategic Square, Jakarta",
      phone: "+62-21-5550192",
      main_account_list: ["10940001", "10940005"]
    },
    "CIF-2002": {
      cif_name: "Xendit Group Indonesia",
      legal_id: "ID-8812003",
      corporate_address: "Victoria Office Tower, Jakarta",
      phone: "+62-21-8889123",
      main_account_list: ["20948801"]
    },
    "CIF-3003": {
      cif_name: "University of Indonesia",
      legal_id: "ID-0010022",
      corporate_address: "Depok, West Java",
      phone: "+62-21-1234567",
      main_account_list: ["30940001"]
    }
  };

  // Mock database of used prefixes to ensure no collision
  private static readonly USED_PREFIXES = new Set(["88001", "88041", "77001", "77010"]);

  /**
   * Validates IPv4 address format.
   */
  public static validate_ip(ip: string): boolean {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  }

  /**
   * fetch_corporate_profile(cif_number):
   * Simulates a connection to T24 Core Banking.
   */
  public static async fetch_corporate_profile(cif_number: string): Promise<CorporateProfile> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Sync latency
    
    const profile = this.T24_CIF_STORE[cif_number];
    if (!profile) {
      throw new Error("ERR-T24-404");
    }
    return profile;
  }

  /**
   * suggest_available_prefix(industry_category):
   * Suggests next available 5-digit prefix based on industry mapping.
   */
  public static suggest_available_prefix(industry_category: string): string {
    const mapping: Record<string, string> = {
      'Education': '88',
      'E-Commerce': '77',
      'Government': '11',
      'General': '99'
    };
    
    const base = mapping[industry_category] || '99';
    let counter = 1;
    let suggested = "";
    
    while (counter < 999) {
      suggested = base + counter.toString().padStart(3, '0');
      if (!this.USED_PREFIXES.has(suggested)) {
        return suggested;
      }
      counter++;
    }
    
    return base + "999";
  }

  /**
   * validate_transaction_limits(merchant_limit_config):
   * Rule Engine logic: Compare proposed limits against BANKWIDE_MASTER_LIMIT.
   */
  public static validate_transaction_limits(merchant_limit_config: LimitConfig): { status: 'OK' | 'WARNING'; message: string } {
    if (merchant_limit_config.daily_transfer_limit > this.BANKWIDE_MASTER_LIMIT) {
      return {
        status: 'WARNING',
        message: 'Proposed Limit (Rp ' + merchant_limit_config.daily_transfer_limit.toLocaleString() + ') exceeds Standard Risk Tolerance. Supervisor review and risk justification will be required upon submission.'
      };
    }
    
    return {
      status: 'OK',
      message: 'Proposed limits are within the automatic approval threshold for standard institutional merchants.'
    };
  }
}
