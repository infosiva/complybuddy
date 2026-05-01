"use client";

import { useState } from "react";

type Severity = "high" | "medium" | "low";
type ContentType = "social media post" | "website copy" | "ad creative" | "email campaign" | "blog post";

interface Issue {
  severity: Severity;
  category: string;
  description: string;
  fix: string;
  law: string;
}

interface ScanResult {
  overallScore: number;
  verdict: "compliant" | "issues-found" | "non-compliant";
  summary: string;
  issues: Issue[];
  positives: string[];
  checkedFor: string[];
}

const CONTENT_TYPES: ContentType[] = [
  "social media post",
  "website copy",
  "ad creative",
  "email campaign",
  "blog post",
];

const EXAMPLES = [
  {
    label: "Sponsored post (no disclosure)",
    text: "Loving my new skincare routine with @GlowLab products! Their vitamin C serum has completely transformed my skin in just 2 weeks. Use code SARAH20 for 20% off — link in bio! ✨ #skincare #glowup #beauty",
  },
  {
    label: "Misleading ad claim",
    text: "🚨 LIMITED TIME ONLY — 90% of users lose 10kg in 30 days with our SuperSlim formula! Scientifically PROVEN and doctor-approved. Only 3 bottles left at this price. Buy NOW before it's gone forever!",
  },
  {
    label: "GDPR risk (no cookie notice)",
    text: "Welcome to ShopEasy! We use cookies to track your browsing behaviour, build detailed profiles, and share your data with our 50+ advertising partners to show you personalised ads.",
  },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreRing(score: number) {
  if (score >= 80) return "stroke-green-400";
  if (score >= 50) return "stroke-amber-400";
  return "stroke-red-400";
}

function verdictBadge(verdict: ScanResult["verdict"]) {
  if (verdict === "compliant") return <span className="badge-green text-xs font-semibold px-3 py-1 rounded-full">✓ Compliant</span>;
  if (verdict === "issues-found") return <span className="badge-amber text-xs font-semibold px-3 py-1 rounded-full">⚠ Issues Found</span>;
  return <span className="badge-red text-xs font-semibold px-3 py-1 rounded-full">✕ Non-Compliant</span>;
}

function severityClass(s: Severity) {
  if (s === "high") return "issue-red";
  if (s === "medium") return "issue-amber";
  return "issue-green";
}

function severityBadge(s: Severity) {
  if (s === "high") return <span className="badge-red text-xs font-medium px-2 py-0.5 rounded">High</span>;
  if (s === "medium") return <span className="badge-amber text-xs font-medium px-2 py-0.5 rounded">Medium</span>;
  return <span className="badge-green text-xs font-medium px-2 py-0.5 rounded">Low</span>;
}

function ScoreCircle({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="absolute w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" strokeWidth="6"
          className={`transition-all duration-700 ${scoreRing(score)}`}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</span>
    </div>
  );
}

export default function Home() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("social media post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  async function handleScan() {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    setExpandedIssue(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, contentType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen z-10">
      {/* Header */}
      <header className="border-b border-white/5 glass sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-white">ComplyBuddy</span>
            <span className="badge-blue text-xs px-2 py-0.5 rounded-full ml-1">Beta</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Is your content <span className="text-indigo-400">legally compliant?</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Paste your social media post, ad copy, or website content. Get an instant AI compliance check
            for GDPR, FTC rules, copyright, misleading claims, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["FTC Disclosures", "GDPR / DPDP", "Copyright", "Misleading Claims", "ASCI (India)"].map(tag => (
              <span key={tag} className="badge-blue text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Scanner card */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-8 glow-indigo">
          {/* Content type selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CONTENT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setContentType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                  contentType === t
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Paste your ${contentType} here…\n\nExample: "Loving this product! Use code SARAH20 — link in bio! #ad"`}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
            rows={7}
          />

          {/* Example buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
            <span className="text-xs text-slate-500">Try an example:</span>
            {EXAMPLES.map(ex => (
              <button
                key={ex.label}
                onClick={() => { setContent(ex.text); setResult(null); setError(""); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1 rounded-full transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">{content.length} characters</p>
            <button
              onClick={handleScan}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning…
                </>
              ) : (
                <><span>🔍</span> Scan for Compliance</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="issue-red rounded-xl p-4 mb-6 fade-in text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="fade-in space-y-6">
            {/* Score header */}
            <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <ScoreCircle score={result.overallScore} />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <h2 className="text-lg font-bold text-white">Compliance Score</h2>
                  {verdictBadge(result.verdict)}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{result.summary}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">Checked for</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {(result.checkedFor || []).map(c => (
                    <span key={c} className="text-xs badge-blue px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Issues Found ({result.issues.length})
                </h3>
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`${severityClass(issue.severity)} rounded-xl p-4 cursor-pointer transition-all`}
                      onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {severityBadge(issue.severity)}
                          <div>
                            <p className="text-sm font-medium text-white">{issue.category}</p>
                            <p className="text-sm text-slate-400 mt-0.5">{issue.description}</p>
                          </div>
                        </div>
                        <span className="text-slate-500 text-sm mt-0.5">{expandedIssue === i ? "▲" : "▼"}</span>
                      </div>
                      {expandedIssue === i && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 fade-in">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">How to fix</p>
                            <p className="text-sm text-slate-300">{issue.fix}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Regulation</p>
                            <p className="text-sm text-indigo-300">{issue.law}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positives */}
            {result.positives.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  What you did right ✓
                </h3>
                <div className="glass rounded-xl p-4 space-y-2">
                  {result.positives.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="glass rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Scan another piece of content</p>
                <p className="text-xs text-slate-500 mt-0.5">ComplyBuddy is free to use. No account needed.</p>
              </div>
              <button
                onClick={() => { setContent(""); setResult(null); setError(""); }}
                className="text-sm border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 px-5 py-2 rounded-xl transition-all whitespace-nowrap"
              >
                New Scan
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <section id="how" className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "📋", step: "1", title: "Paste your content", desc: "Copy-paste any social post, ad, website copy, or email into the scanner." },
              { icon: "🤖", step: "2", title: "AI scans it instantly", desc: "Our AI checks for 8 compliance categories including FTC, GDPR, copyright, and misleading claims." },
              { icon: "🛠️", step: "3", title: "Get actionable fixes", desc: "Each issue comes with a specific fix and the regulation it falls under." },
            ].map(item => (
              <div key={item.step} className="glass rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-xs badge-blue px-2 py-0.5 rounded-full inline-block mb-2">Step {item.step}</p>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Who uses ComplyBuddy?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📱", title: "Influencers", desc: "Check posts before publishing. Never miss an #ad disclosure again." },
              { icon: "🏪", title: "Small Businesses", desc: "Ensure your ads and website copy meet GDPR and advertising standards." },
              { icon: "📣", title: "Marketers", desc: "Validate campaigns for FTC compliance and platform policy." },
              { icon: "⚖️", title: "Legal Teams", desc: "Quick pre-publish check without waiting for a full legal review." },
            ].map(item => (
              <div key={item.title} className="glass rounded-xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              { q: "Is this legal advice?", a: "No. ComplyBuddy is an AI-powered educational tool. It helps you identify potential issues but does not constitute legal advice. Consult a qualified lawyer for serious compliance matters." },
              { q: "Which regulations does it cover?", a: "FTC (US), GDPR (EU), DPDP Act 2023 (India), ASCI guidelines (India), copyright basics, platform ad policies (Instagram, YouTube, TikTok, LinkedIn), and general advertising standards." },
              { q: "Is my content stored?", a: "No. Your content is sent to an AI model for analysis and is not stored or logged by us." },
              { q: "How accurate is it?", a: "The AI is highly capable but not infallible. It works best as a first-pass check. High-severity issues flagged should always be verified." },
            ].map(item => (
              <div key={item.q} className="glass rounded-xl p-5">
                <p className="font-semibold text-white text-sm mb-2">{item.q}</p>
                <p className="text-sm text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center text-xs text-slate-500">
        <p>🛡️ <strong className="text-slate-400">ComplyBuddy</strong> — AI compliance checker for content creators and businesses</p>
        <p className="mt-1">Not legal advice. For educational purposes only.</p>
      </footer>
    </div>
  );
}
