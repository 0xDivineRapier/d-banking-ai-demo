import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { action, message, currentData, base64Data, mimeType } = await req.json();

    let messages: any[];

    if (action === "chat") {
      messages = [
        {
          role: "system",
          content: "You are an expert in Indonesian Corporate Banking (SNAP BI Standards). Your goal is to simplify merchant registration for bank officers.",
        },
        {
          role: "user",
          content: `You are a Senior BSS Banking Onboarding Assistant. Extract institutional merchant details from this message: "${message}". 
Current state: ${JSON.stringify(currentData)}.
Rule: If specific details like Company Name, Tax ID (NPWP), or Address are found, extract them.
Return a JSON object with fields: cif_name, legal_id, corporate_address, industry, confidence (0-1), and aiResponse (a professional and proactive banking agent message).`,
        },
      ];
    } else if (action === "document_scan") {
      messages = [
        {
          role: "system",
          content: "You are a specialized OCR Vision agent for Indonesian Business Documents (NIB, NPWP, Deeds). Be precise with IDs and Legal Names.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Data}` },
            },
            {
              type: "text",
              text: "Extract the Legal Entity Name (Nama Perusahaan), Tax ID (NPWP), and Registered Address from this institutional document. Return results as JSON with fields: cif_name, legal_id, corporate_address, confidence (0-1).",
            },
          ],
        },
      ];
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tools = [
      {
        type: "function",
        function: {
          name: "extract_data",
          description: "Extract structured onboarding data",
          parameters: {
            type: "object",
            properties: {
              cif_name: { type: "string", description: "Official legal name" },
              legal_id: { type: "string", description: "Tax ID (NPWP)" },
              corporate_address: { type: "string", description: "HQ address" },
              industry: { type: "string", description: "Industry category" },
              confidence: { type: "number", description: "0-1 certainty" },
              aiResponse: { type: "string", description: "Conversational response" },
            },
            required: ["confidence", "aiResponse"],
          },
        },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools,
        tool_choice: { type: "function", function: { name: "extract_data" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : {};

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("onboarding-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
