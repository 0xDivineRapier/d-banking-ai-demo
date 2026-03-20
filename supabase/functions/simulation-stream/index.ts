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
    const { persona, entropy, volume, avgAmount, description } = await req.json();
    const count = Math.min(20, Math.floor(volume / 10));

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
            content: "You are a high-fidelity synthetic data generator for Bank XYZ. Return ONLY a JSON array of log entries.",
          },
          {
            role: "user",
            content: `Generate ${count} realistic banking transaction logs for persona: ${persona}.
Context: ${description}
Average Amount: ${avgAmount}
Entropy Level: ${entropy} (0.0 = perfect, 1.0 = chaotic)

Requirements:
- Use SNAP BI JSON format for 'raw_payload' if protocol is 'SNAP_BI'.
- Inject anomalies if entropy > 0.5 (duplicate trxId, invalid signature, timeout).
- Output a JSON array of LogEntry objects.

LogEntry Schema:
{
  timestamp: string (ISO8601),
  service_module: string (CORE|SNAP|BI-FAST|RTGS),
  institution_id: string,
  protocol: 'ISO8583' | 'SNAP_BI' | 'SOCKET',
  severity: 'INFO' | 'WARN' | 'CRITICAL',
  error_code: string ('00' success, '68' timeout, '91' host down, '4017300' invalid signature),
  raw_payload: string,
  metadata: object
}`,
          },
        ],
        response_format: { type: "json_object" },
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
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    let logs;
    try {
      const parsed = JSON.parse(content);
      logs = Array.isArray(parsed) ? parsed : parsed.logs || parsed.entries || Object.values(parsed)[0];
    } catch {
      logs = [];
    }

    return new Response(JSON.stringify(logs), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("simulation-stream error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
