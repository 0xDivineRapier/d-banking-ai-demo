
import { GoogleGenAI, Type } from "@google/genai";

export interface ExtractedCorporateData {
  cif_name?: string;
  legal_id?: string;
  corporate_address?: string;
  industry?: string;
  confidence: number;
  reasoning: string;
}

export class OnboardingAgent {
  private ai: GoogleGenAI | null = null;

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to use AI features.");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Processes a chat message to extract merchant details.
   */
  async processOnboardingChat(message: string, currentData: any): Promise<{ updatedData: ExtractedCorporateData; aiResponse: string }> {
    const response = await this.getAI().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are a Senior BSS Banking Onboarding Assistant. Extract institutional merchant details from this message: "${message}". 
          Current state: ${JSON.stringify(currentData)}.
          Rule: If specific details like Company Name, Tax ID (NPWP), or Address are found, extract them.
          Return a JSON object with fields: cif_name, legal_id, corporate_address, industry, confidence (0-1), and aiResponse (a professional and proactive banking agent message).` }]
        }
      ],
      config: {
        systemInstruction: "You are an expert in Indonesian Corporate Banking (SNAP BI Standards). Your goal is to simplify merchant registration for bank officers.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cif_name: { type: Type.STRING, description: "Official legal name of the entity" },
            legal_id: { type: Type.STRING, description: "Tax identification number (NPWP)" },
            corporate_address: { type: Type.STRING, description: "HQ office full address" },
            industry: { type: Type.STRING, description: "Industry category (Education, Automotive, E-Commerce, General)" },
            confidence: { type: Type.NUMBER, description: "Certainty score from 0 to 1" },
            aiResponse: { type: Type.STRING, description: "Helpful conversational response" }
          },
          required: ["confidence", "aiResponse"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      updatedData: {
        cif_name: result.cif_name,
        legal_id: result.legal_id,
        corporate_address: result.corporate_address,
        industry: result.industry,
        confidence: result.confidence || 0,
        reasoning: "NLP Extraction from Chat"
      },
      aiResponse: result.aiResponse || "Details updated. Please verify the form."
    };
  }

  /**
   * Processes an image (OCR) to extract merchant details.
   */
  async processDocumentScan(base64Data: string, mimeType: string): Promise<ExtractedCorporateData> {
    const response = await this.getAI().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Extract the Legal Entity Name (Nama Perusahaan), Tax ID (NPWP), and Registered Address from this institutional document. Return results as JSON." }
          ]
        }
      ],
      config: {
        systemInstruction: "You are a specialized OCR Vision agent for Indonesian Business Documents (NIB, NPWP, Deeds). Be precise with IDs and Legal Names.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cif_name: { type: Type.STRING },
            legal_id: { type: Type.STRING },
            corporate_address: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["cif_name", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      reasoning: "OCR Vision Extraction"
    };
  }
}
