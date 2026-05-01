import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 40_000;

interface ScanResult {
  overallScore: number;
  verdict: "compliant" | "issues-found" | "non-compliant";
  summary: string;
  issues: {
    severity: "high" | "medium" | "low";
    category: string;
    description: string;
    fix: string;
    law: string;
  }[];
  positives: string[];
  checkedFor: string[];
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timed out")), ms);
    p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

const SYSTEM_PROMPT = `You are a legal compliance expert specialising in digital content, social media, and advertising law.
You check content for: GDPR/DPDP (data privacy), FTC rules (sponsored content/disclosures), copyright issues,
misleading advertising claims, cookie/tracking compliance, undisclosed affiliate links,
defamation risks, and platform-specific policy violations (Instagram, YouTube, TikTok, LinkedIn).
You are familiar with Indian law (DPDP Act 2023, ASCI guidelines) as well as US/EU regulations.
Return ONLY valid JSON. No markdown fences, no explanation outside JSON.`;

const USER_PROMPT = (content: string, contentType: string) => `Scan this ${contentType} for compliance issues:

---
${content.slice(0, 4000)}
---

Check for ALL of the following:
1. FTC disclosure (sponsored, paid partnership, affiliate links — must be clearly disclosed)
2. GDPR/DPDP (personal data collection, cookie notices, privacy policy references)
3. Misleading claims (unsubstantiated superlatives, fake urgency, false scarcity)
4. Copyright (unlicensed music, images, brand names used incorrectly)
5. Defamation risk (negative claims about competitors or individuals)
6. Platform policy violations (Instagram/YouTube/TikTok ad policies)
7. ASCI guidelines (India advertising standards)
8. Accessibility (missing alt text, discriminatory language)

Return this JSON:
{
  "overallScore": 0-100,
  "verdict": "compliant|issues-found|non-compliant",
  "summary": "2-3 sentence plain-English summary of findings",
  "issues": [
    {
      "severity": "high|medium|low",
      "category": "FTC|GDPR|Copyright|Misleading|Defamation|Platform Policy|ASCI|Accessibility",
      "description": "What the issue is and where it appears in the content",
      "fix": "Exactly how to fix it — be specific and actionable",
      "law": "Which regulation/guideline this falls under"
    }
  ],
  "positives": ["thing done correctly 1", "thing done correctly 2"],
  "checkedFor": ["FTC Disclosure", "GDPR", "Copyright", "Misleading Claims", "Defamation", "Platform Policy", "ASCI", "Accessibility"]
}

Rules:
- If content is clearly compliant on a point, do NOT create a fake issue
- Be specific: quote the actual problematic text when describing issues
- Severity: high = legal risk, medium = best practice violation, low = minor improvement
- overallScore: 100 = fully compliant, 0 = severe violations`;

async function callGroq(content: string, contentType: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Groq not configured");
  const models = ["meta-llama/llama-4-scout-17b-16e-instruct", "llama-3.3-70b-versatile", "qwen/qwen3-32b"];
  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model, max_tokens: 2000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPT(content, contentType) },
          ],
        }),
      });
      if (!res.ok) { const e = await res.text(); throw new Error(`Groq ${res.status}: ${e.slice(0, 100)}`); }
      const data = await res.json() as any;
      const text = data.choices?.[0]?.message?.content || "";
      if (text) return text;
    } catch (e: any) {
      const m = e.message?.toLowerCase() || "";
      if (m.includes("rate") || m.includes("quota") || m.includes("429") || m.includes("model")) continue;
      throw e;
    }
  }
  throw new Error("Groq exhausted");
}

async function callGemini(content: string, contentType: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini not configured");
  const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model, max_tokens: 2000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPT(content, contentType) },
          ],
        }),
      });
      if (!res.ok) { const e = await res.text(); throw new Error(`Gemini ${res.status}: ${e.slice(0, 100)}`); }
      const data = await res.json() as any;
      const text = data.choices?.[0]?.message?.content || "";
      if (text) return text;
    } catch (e: any) {
      const m = e.message?.toLowerCase() || "";
      if (m.includes("rate") || m.includes("quota") || m.includes("429") || m.includes("model")) continue;
      throw e;
    }
  }
  throw new Error("Gemini exhausted");
}

async function callAnthropic(content: string, contentType: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Anthropic not configured");
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: USER_PROMPT(content, contentType) }],
  });
  return res.content[0].type === "text" ? res.content[0].text : "";
}

function parseResult(text: string): ScanResult {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");
  return JSON.parse(match[0]) as ScanResult;
}

export async function POST(req: NextRequest) {
  try {
    const { content, contentType = "social media post" } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    let rawText = "";
    const providers = [
      { name: "groq",      fn: () => callGroq(content, contentType) },
      { name: "gemini",    fn: () => callGemini(content, contentType) },
      { name: "anthropic", fn: () => callAnthropic(content, contentType) },
    ];

    for (const { name, fn } of providers) {
      try {
        rawText = await withTimeout(fn(), TIMEOUT_MS);
        if (rawText) { console.log(`[ComplyBuddy] used ${name}`); break; }
      } catch (e: any) {
        const m = (e.message || "").toLowerCase();
        if (m.includes("exhausted") || m.includes("not configured") || m.includes("timed out") ||
            m.includes("rate") || m.includes("quota") || m.includes("429")) {
          console.log(`[ComplyBuddy] ${name} unavailable — trying next`);
          continue;
        }
        throw e;
      }
    }

    if (!rawText) return NextResponse.json({ error: "All AI providers unavailable" }, { status: 503 });

    const result = parseResult(rawText);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[ComplyBuddy] error:", err.message);
    return NextResponse.json({ error: err.message || "Scan failed" }, { status: 500 });
  }
}
