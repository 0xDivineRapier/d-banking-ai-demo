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
    const { query } = await req.json();

    const tools = [
      {
        type: "function",
        function: {
          name: "finance_response",
          description: "Return finance assistant response",
          parameters: {
            type: "object",
            properties: {
              message: { type: "string" },
              action: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["RECONCILE", "FEE_AUDIT", "RESOLVE_SUSPENSE", "NONE"] },
                  summary: { type: "string" },
                },
                required: ["type", "summary"],
              },
              suggested_prompts: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["message", "suggested_prompts"],
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
        messages: [
          {
            role: "system",
            content: "You are a specialized Fintech Treasury Assistant for Bank Sampoerna. Be concise, precise, and professional.",
          },
          {
            role: "user",
            content: `You are the BSS Finance Intelligence Bot. 
Interpret this request: "${query}". 
Possible actions:
- RECONCILE: Match bank transactions to ERP invoices.
- FEE_AUDIT: Check for leakage in charged fees vs SNAP contracts.
- RESOLVE_SUSPENSE: Suggest beneficiaries for unidentified inbound funds.

Return JSON with:
- message: Conversational response.
- action: { type, summary }
- suggested_prompts: 3 next-step short prompts.`,
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "finance_response" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
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
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : { message: "Error processing", suggested_prompts: [] };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("finance-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
