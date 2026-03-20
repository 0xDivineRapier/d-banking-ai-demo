
import { supabase } from "@/integrations/supabase/client";

export interface AssistantAction {
  type: 'RECONCILE' | 'FEE_AUDIT' | 'RESOLVE_SUSPENSE' | 'NONE';
  summary: string;
  parameters?: Record<string, any>;
}

export interface AssistantResponse {
  message: string;
  action?: AssistantAction;
  suggested_prompts: string[];
}

export class FinanceAssistantAgent {
  async processQuery(query: string): Promise<AssistantResponse> {
    const { data, error } = await supabase.functions.invoke("finance-assistant", {
      body: { query },
    });

    if (error) throw error;
    return data;
  }
}
