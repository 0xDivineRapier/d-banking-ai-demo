
import { supabase } from "@/integrations/supabase/client";

export interface ExtractedCorporateData {
  cif_name?: string;
  legal_id?: string;
  corporate_address?: string;
  industry?: string;
  confidence: number;
  reasoning: string;
}

export class OnboardingAgent {
  async processOnboardingChat(message: string, currentData: any): Promise<{ updatedData: ExtractedCorporateData; aiResponse: string }> {
    const { data, error } = await supabase.functions.invoke("onboarding-ai", {
      body: { action: "chat", message, currentData },
    });

    if (error) throw error;

    return {
      updatedData: {
        cif_name: data.cif_name,
        legal_id: data.legal_id,
        corporate_address: data.corporate_address,
        industry: data.industry,
        confidence: data.confidence || 0,
        reasoning: "NLP Extraction from Chat",
      },
      aiResponse: data.aiResponse || "Details updated. Please verify the form.",
    };
  }

  async processDocumentScan(base64Data: string, mimeType: string): Promise<ExtractedCorporateData> {
    const { data, error } = await supabase.functions.invoke("onboarding-ai", {
      body: { action: "document_scan", base64Data, mimeType },
    });

    if (error) throw error;

    return {
      ...data,
      reasoning: "OCR Vision Extraction",
    };
  }
}
