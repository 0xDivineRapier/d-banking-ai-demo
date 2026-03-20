
export interface ReportResult {
  sql: string;
  explanation: string;
  data: any[];
  chartConfig: {
    type: 'bar' | 'line' | 'pie' | 'table';
    xAxis?: string;
    yAxis?: string;
    label?: string;
    visualization_hint?: string;
  };
}

export class ReportingAgent {
  async queryInsights(userQuery: string): Promise<ReportResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const query = userQuery.toLowerCase();

    if (query.includes('failed') || query.includes('error')) {
      return {
        sql: "SELECT trx_id, status_code, error_message FROM transactions WHERE status_code != '00' LIMIT 5;",
        explanation: "Retrieving the 5 most recent failed Virtual Account transactions.",
        data: [
          { trx_id: 'TX-9901', status_code: '4017300', error_message: 'Invalid Signature', institution: 'Xendit' },
          { trx_id: 'TX-9904', status_code: '5047300', error_message: 'Gateway Timeout', institution: 'Flip' },
          { trx_id: 'TX-9912', status_code: '4017301', error_message: 'Token Expired', institution: 'Modalku' }
        ],
        chartConfig: { type: 'table', visualization_hint: 'Failure Log' }
      };
    }

    return {
      sql: "SELECT institution_name, COUNT(*) as volume FROM transactions JOIN clients USING(client_id) GROUP BY 1;",
      explanation: "Showing volume distribution across all BSS institutional partners for today.",
      data: [
        { institution_name: 'Hasjrat Abadi', volume: 1402 },
        { institution_name: 'Xendit', volume: 890 },
        { institution_name: 'Flip', volume: 450 }
      ],
      chartConfig: { type: 'bar', xAxis: 'institution_name', yAxis: 'volume' }
    };
  }
}
