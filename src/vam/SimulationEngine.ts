
import { supabase } from "@/integrations/supabase/client";
import { LogEntry } from "./LogMonitorAgent";

export type PersonaType = 'FINTECH_RAIL_BURST' | 'LENDING_PARTNER_SETTLEMENT' | 'XYZ_MOBILE_TRAFFIC' | 'PT_XYZ_INTERNAL' | 'CORE_BANKING_FAULT' | 'PT_GLOBAL_CORP';

export interface PersonaProfile {
  id: PersonaType;
  label: string;
  description: string;
  volume: number;
  avgAmount: string;
}

export const PERSONAS: Record<PersonaType, PersonaProfile> = {
  FINTECH_RAIL_BURST: {
    id: 'FINTECH_RAIL_BURST',
    label: 'Fintech Rail Burst (Xendit/DEF)',
    description: 'Massive volume of small-ticket Virtual Account notifications via Dozn Global-SNAP Gateway.',
    volume: 500,
    avgAmount: '150000.00'
  },
  LENDING_PARTNER_SETTLEMENT: {
    id: 'LENDING_PARTNER_SETTLEMENT',
    label: 'P2P Lending Settlement (Modalku)',
    description: 'Concentrated high-value disbursements (TTAK) from Dozn Global pool accounts to partners.',
    volume: 100,
    avgAmount: '50000000.00'
  },
  XYZ_MOBILE_TRAFFIC: {
    id: 'XYZ_MOBILE_TRAFFIC',
    label: 'Dozn Global Mobile Traffic',
    description: 'Standard retail traffic from Dozn Global Mobile Core.',
    volume: 300,
    avgAmount: '500000.00'
  },
  PT_XYZ_INTERNAL: {
    id: 'PT_XYZ_INTERNAL',
    label: 'PT XYZ Internal',
    description: 'Internal treasury movements and payroll.',
    volume: 50,
    avgAmount: '10000000.00'
  },
  CORE_BANKING_FAULT: {
    id: 'CORE_BANKING_FAULT',
    label: 'Core Banking Fault',
    description: 'Simulated connection loss to Dozn Global Core backend.',
    volume: 10,
    avgAmount: '0.00'
  },
  PT_GLOBAL_CORP: {
    id: 'PT_GLOBAL_CORP',
    label: 'PT. Global Manufacturing',
    description: 'High-fidelity corporate entity with complex payroll, vendor payments, and daily operations.',
    volume: 200,
    avgAmount: '25000000.00'
  }
};

export class SimulationEngine {
  constructor() {}

  async generateSystemLogs(count: number, includeCritical: boolean = false): Promise<LogEntry[]> {
    const services = ['CORE', 'SNAP', 'BI-FAST', 'RTGS', 'ISO8583'];
    const protocols: ('ISO8583' | 'SNAP_BI' | 'SOCKET')[] = ['ISO8583', 'SNAP_BI', 'SOCKET'];
    const logs: LogEntry[] = [];

    for (let i = 0; i < count; i++) {
      const isCritical = includeCritical && i === count - 1;
      logs.push({
        timestamp: new Date().toISOString(),
        service_module: services[Math.floor(Math.random() * services.length)],
        institution_id: `XYZ_INST_${Math.floor(Math.random() * 100)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        severity: isCritical ? 'CRITICAL' : 'INFO',
        error_code: isCritical ? '91' : (Math.random() > 0.9 ? '68' : '00'),
        raw_payload: isCritical ? 'CRITICAL: Host Down (DOZN-NODE-04)' : (Math.random() > 0.9 ? 'TIMEOUT: Connection dropped' : 'Transaction Success'),
        metadata: {}
      });
    }
    return logs;
  }

  async generateStream(persona: PersonaType, entropy: number): Promise<LogEntry[]> {
    const profile = PERSONAS[persona];
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mocking the "AI stream" with high-fidelity system logs
    const services = ['CORE', 'SNAP', 'BI-FAST', 'RTGS', 'ISO8583'];
    const protocols: ('ISO8583' | 'SNAP_BI' | 'SOCKET')[] = ['ISO8583', 'SNAP_BI', 'SOCKET'];
    const logs: LogEntry[] = [];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const isAnomaly = Math.random() < (entropy / 100);
      logs.push({
        timestamp: new Date().toISOString(),
        service_module: services[Math.floor(Math.random() * services.length)],
        institution_id: `INST_${profile.id.substring(0, 4)}_${Math.floor(Math.random() * 1000)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        severity: isAnomaly ? 'WARN' : 'INFO',
        error_code: isAnomaly ? '68' : '00',
        raw_payload: isAnomaly 
          ? `ANOMALY: High entropy detected in ${profile.label} flow` 
          : `SUCCESS: Processed ${profile.avgAmount} settlement unit`,
        metadata: { persona: profile.label }
      });
    }

    return logs;
  }

  async injectProtocolChaos(scenario: string): Promise<LogEntry> {
    const logs = await this.generateSystemLogs(1, true);
    const log = logs[0];
    
    switch(scenario) {
      case 'timestamp_drift':
        log.timestamp = new Date(Date.now() - 3600000).toISOString();
        log.raw_payload = "CLOCK_DRIFT: Signature verification failed (Time mismatch > 5min)";
        log.error_code = "4017300";
        break;
      case 'silent_drop':
        log.severity = 'WARN';
        log.raw_payload = "TCP_RESET: Connection reset by peer (DOZN-SNAP-GW)";
        log.error_code = "68";
        break;
      case 'key_rotation':
        log.raw_payload = "AUTH_FAILURE: Public key not found for partner ID";
        log.error_code = "4017301";
        break;
    }
    
    return log;
  }
}
