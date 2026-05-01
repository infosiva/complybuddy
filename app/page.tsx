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
  { label: "Sponsored post", text: "Loving my new skincare routine with @GlowLab products! Their vitamin C serum has completely transformed my skin in just 2 weeks. Use code SARAH20 for 20% off — link in bio! ✨ #skincare #glowup #beauty" },
  { label: "Misleading claim", text: "🚨 LIMITED TIME ONLY — 90% of users lose 10kg in 30 days with our SuperSlim formula! Scientifically PROVEN and doctor-approved. Only 3 bottles left at this price. Buy NOW before it's gone forever!" },
  { label: "GDPR risk", text: "Welcome to ShopEasy! We use cookies to track your browsing behaviour, build detailed profiles, and share your data with our 50+ advertising partners to show you personalised ads." },
];

const CHECKS = ["FTC", "GDPR / DPDP", "Copyright", "Misleading Claims", "ASCI (India)", "Platform Policy"];

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
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg className="absolute w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" strokeWidth="5"
          className={`transition-all duration-700 ${scoreRing(score)}`}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}</span>
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
    <div className="relative min-h-screen z-10 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 glass sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <span className="font-bold text-white tracking-tight">ComplyScan</span>
            <span className="badge-blue text-xs px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <nav className="flex items-center gap-5 text-sm text-slate-400">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-8 pb-16">

        {/* Compact hero */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
            Is your content <span className="text-indigo-400">legally compliant?</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Paste any post, ad, or website copy. Get an instant AI check for FTC, GDPR, copyright & more.
          </p>
        </div>

        {/* Main scanner — everything above fold */}
        <div className="glass rounded-2xl p-5 glow-indigo">

          {/* Content type pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CONTENT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setContentType(t)}
                className={`text-xs px-3 py-1 rounded-full border transition-all capitalize ${
                  contentType === t
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Paste your ${contentType} here…`}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
            rows={4}
          />

          {/* Bottom row: examples + char count + button */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500">Try:</span>
              {EXAMPLES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => { setContent(ex.text); setResult(null); setError(""); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2 py-0.5 rounded-full transition-all"
                >
                  {ex.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleScan}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm whitespace-nowrap"
            >
              {loading ? (
                <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Scanning…</>
              ) : (
                <>🔍 Scan now</>
              )}
            </button>
          </div>

          {/* What we check — compact chips */}
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-slate-500 mr-1">Checks:</span>
            {CHECKS.map(c => (
              <span key={c} className="text-xs text-slate-500 border border-white/8 px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="issue-red rounded-xl p-4 mt-4 fade-in text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="fade-in space-y-4 mt-6">

            {/* Score bar */}
            <div className="glass rounded-2xl p-5 flex items-center gap-5">
              <ScoreCircle score={result.overallScore} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">Compliance Score</span>
                  {verdictBadge(result.verdict)}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Issues Found ({result.issues.length})
                </p>
                <div className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`${severityClass(issue.severity)} rounded-xl p-4 cursor-pointer transition-all`}
                      onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          {severityBadge(issue.severity)}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{issue.category}</p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{issue.description}</p>
                          </div>
                        </div>
                        <span className="text-slate-500 text-xs mt-0.5 shrink-0">{expandedIssue === i ? "▲" : "▼"}</span>
                      </div>
                      {expandedIssue === i && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 fade-in">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">How to fix</p>
                            <p className="text-xs text-slate-300 leading-relaxed">{issue.fix}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Regulation</p>
                            <p className="text-xs text-indigo-300">{issue.law}</p>
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
              <div className="glass rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What you did right</p>
                <div className="space-y-1.5">
                  {result.positives.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New scan CTA */}
            <div className="flex items-center justify-between glass rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-white">Scan another piece of content</p>
                <p className="text-xs text-slate-500 mt-0.5">Free, no account needed</p>
              </div>
              <button
                onClick={() => { setContent(""); setResult(null); setError(""); }}
                className="text-sm border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 px-4 py-1.5 rounded-xl transition-all whitespace-nowrap"
              >
                New Scan
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <section id="how" className="mt-16">
          <h2 className="text-xl font-bold text-white text-center mb-6">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: "📋", step: "1", title: "Paste your content", desc: "Any social post, ad copy, email, or website text." },
              { icon: "🤖", step: "2", title: "AI scans instantly", desc: "Checks 8 compliance categories in seconds." },
              { icon: "🛠️", step: "3", title: "Get exact fixes", desc: "Each issue includes what to fix and which law applies." },
            ].map(item => (
              <div key={item.step} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <span className="badge-blue text-xs px-2 py-0.5 rounded-full inline-block mb-1.5">Step {item.step}</span>
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white text-center mb-6">Who uses ComplyScan?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "📱", title: "Influencers", desc: "Never miss an #ad disclosure again." },
              { icon: "🏪", title: "Small Businesses", desc: "Meet GDPR and advertising standards." },
              { icon: "📣", title: "Marketers", desc: "Validate campaigns before launch." },
              { icon: "⚖️", title: "Legal Teams", desc: "Quick pre-publish sanity check." },
            ].map(item => (
              <div key={item.title} className="glass rounded-xl p-4">
                <div className="text-xl mb-1.5">{item.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-10">
          <h2 className="text-xl font-bold text-white text-center mb-6">FAQ</h2>
          <div className="space-y-2 max-w-xl mx-auto">
            {[
              { q: "Is this legal advice?", a: "No. ComplyScan is an AI-powered educational tool. Consult a qualified lawyer for serious compliance matters." },
              { q: "Which regulations does it cover?", a: "FTC (US), GDPR (EU), DPDP Act 2023 (India), ASCI guidelines, copyright basics, and platform ad policies (Instagram, YouTube, TikTok, LinkedIn)." },
              { q: "Is my content stored?", a: "No. Your content is sent to the AI for analysis only and is never stored or logged." },
              { q: "How accurate is it?", a: "High accuracy for common issues but not infallible. Best used as a first-pass check — always verify high-severity flags." },
            ].map(item => (
              <div key={item.q} className="glass rounded-xl p-4">
                <p className="font-semibold text-white text-sm mb-1">{item.q}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        <p>🛡️ <strong className="text-slate-400">ComplyScan</strong> — AI compliance checker for content creators and businesses</p>
        <p className="mt-1">Not legal advice. For educational purposes only.</p>
      </footer>
    </div>
  );
}
