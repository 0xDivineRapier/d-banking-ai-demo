
/**
 * D-Banking Batch Management System
 * Nightly Fee Settlement & Billing File Generation
 */

export interface FeeSettlementLine {
  institutionCode: string;
  institutionName: string;
  txCount: number;
  grossVolume: number;
  totalFee: number;
  bankShare: number;
  epayShare: number;
}

export const generateBatchSettlementCode = `
/**
 * nightlyFeeSettlementJob
 * Aggregates daily transactions and generates Core Banking billing file
 */
async function nightlyFeeSettlementJob(targetDate: Date) {
  const dateStr = targetDate.toISOString().split('T')[0];
  
  // 1. AGGREGATE: Sum successful transactions per Institution
  const aggregations = await db.transactions.groupBy({
    by: ['institution_id'],
    where: {
      status: 'SUCCESS',
      created_at: {
        gte: new Date(dateStr + 'T00:00:00Z'),
        lte: new Date(dateStr + 'T23:59:59Z')
      }
    },
    _sum: { amount: true },
    _count: { id: true }
  });

  const settlements: FeeSettlementLine[] = [];

  for (const agg of aggregations) {
    const inst = await db.institutions.findUnique({ where: { id: agg.institution_id } });
    if (!inst) continue;

    // 2. CALCULATE FEES: Apply rule (Flat vs %)
    let totalFee = 0;
    const grossVolume = agg._sum.amount || 0;
    const txCount = agg._count.id || 0;

    if (inst.fee_type === 'FLAT') {
      totalFee = txCount * inst.fee_value;
    } else {
      totalFee = grossVolume * (inst.fee_value / 100);
    }

    // 3. SPLIT: Calculate Fee Distribution (Bank vs Aggregator)
    const epayShare = totalFee * (inst.epay_split_percent / 100);
    const bankShare = totalFee - epayShare;

    settlements.push({
      institutionCode: inst.code,
      institutionName: inst.name,
      txCount,
      grossVolume,
      totalFee,
      bankShare,
      epayShare
    });
  }

  // 4. OUTPUT: Generate Billing Fee CSV for Core Banking ingestion
  const csvContent = generateBillingCSV(settlements, dateStr);
  const filePath = await storage.saveBatchFile(\`settlement_\${dateStr}.csv\`, csvContent);

  // Update Batch Status
  await db.settlement_batches.create({
    data: {
      batch_date: targetDate,
      total_tx_count: settlements.reduce((s, x) => s + x.txCount, 0),
      total_volume: settlements.reduce((s, x) => s + x.grossVolume, 0),
      total_bank_fee: settlements.reduce((s, x) => s + x.bankShare, 0),
      total_epay_fee: settlements.reduce((s, x) => s + x.epayShare, 0),
      billing_file_path: filePath,
      status: 'COMPLETED'
    }
  });

  return settlements;
}

function generateBillingCSV(data: FeeSettlementLine[], date: string) {
  const header = "DATE,INST_CODE,TX_COUNT,GROSS_VOL,TOTAL_FEE,BANK_SHARE,EPAY_SHARE";
  const rows = data.map(d => 
    \`\${date},\${d.institutionCode},\${d.txCount},\${d.grossVolume.toFixed(2)},\${d.totalFee.toFixed(2)},\${d.bankShare.toFixed(2)},\${d.epayShare.toFixed(2)}\`
  );
  return [header, ...rows].join("\\n");
}
`;
