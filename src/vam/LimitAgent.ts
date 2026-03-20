

export interface VolumeStat {
  time: string;
  volume: number;
}

export interface LimitPrediction {
  projected_breach_time: string | null;
  current_utilization: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'OVERLOAD';
  recommendation: string;
}

export class LimitAgent {
  async predictBreach(history: VolumeStat[], currentLimit: number): Promise<LimitPrediction> {
    // Demo Mode Logic: Immediate return of realistic mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lastVolume = history[history.length - 1]?.volume || 0;
    const utilization = (lastVolume / currentLimit) * 100;
    
    // Predetermined realistic response for BSS Demo
    return {
      projected_breach_time: utilization > 70 ? "16:45" : null,
      current_utilization: Math.round(utilization),
      risk_level: utilization > 85 ? 'CRITICAL' : utilization > 60 ? 'MEDIUM' : 'LOW',
      recommendation: utilization > 70 
        ? "Transaction velocity in Fintech-Rail-01 is peaking. Recommend increasing limit by 15B IDR." 
        : "Liquidity rails stable. No manual intervention required."
    };
  }
}
