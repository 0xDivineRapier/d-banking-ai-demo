
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
    // Simulated delay for "Thinking" state
    await new Promise(resolve => setTimeout(resolve, 1000));

    const m = message.toLowerCase();

    if (m.includes('ready') || m.includes('register') || m.includes('start')) {
      return {
        updatedData: { ...currentData },
        aiResponse: "Understood. I've initiated the autonomous onboarding flow. Please let me know the corporate name or legal registration number to begin extraction."
      };
    }

    if (m.includes('pt') || m.includes('corp') || m.includes('group')) {
      return {
        updatedData: {
          ...currentData,
          cif_name: "PT. Global Retail Solusi",
          industry: "Retail & E-commerce",
          confidence: 0.95
        },
        aiResponse: "I've identified PT. Global Retail Solusi from the registration data. I'm now verifying the industry classification (Retail) and extracting the legal address. Would you like me to scan the NPWP document next?"
      };
    }

    return {
      updatedData: { ...currentData },
      aiResponse: "I've updated the session context. Please provide more corporate details or upload a business license for OCR scanning."
    };
  }

  async processDocumentScan(base64Data: string, mimeType: string): Promise<ExtractedCorporateData> {
    // Simulated delay for OCR Vision
    await new Promise(resolve => setTimeout(resolve, 2500));

    return {
      cif_name: "PT. Maju Bersama Digital",
      legal_id: "01.234.567.8-901.000",
      corporate_address: "Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan, 12190",
      industry: "Financial Technology",
      confidence: 0.99,
      reasoning: "OCR Hub: Extracted via Vision Model V3 (Legal Document)"
    };
  }
}
