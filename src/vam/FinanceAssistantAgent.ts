
import { GoogleGenAI, Type } from "@google/genai";

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
  private ai: GoogleGenAI | null = null;

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to use AI features.");
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async processQuery(query: string): Promise<AssistantResponse> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the BSS Finance Intelligence Bot. 
      Interpret this request: "${query}". 
      Possible actions:
      - RECONCILE: Match bank transactions to ERP invoices.
      - FEE_AUDIT: Check for leakage in charged fees vs SNAP contracts.
      - RESOLVE_SUSPENSE: Suggest beneficiaries for unidentified inbound funds.
      
      Return JSON with:
      - message: Conversational response.
      - action: { type, summary, parameters }
      - suggested_prompts: 3 next-step short prompts.`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a specialized Fintech Treasury Assistant for Bank Sampoerna. Be concise, precise, and professional.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            action: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                summary: { type: Type.STRING },
                parameters: { type: Type.OBJECT }
              },
              required: ["type", "summary"]
            },
            suggested_prompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["message", "suggested_prompts"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }
}
