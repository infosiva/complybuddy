"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import { useGate } from '@/lib/shared/useGate'
import RegisterGate from '@/lib/shared/RegisterGate'

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
  const { count: gateCount, showGate, increment: gateIncrement, onRegistered, dismissGate } = useGate('complybuddy', 3)
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("social media post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

  async function handleScan() {
    if (!content.trim()) return;
    const allowed = await gateIncrement();
    if (!allowed) return;
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
    <>
    {showGate && (
      <RegisterGate
        freeUsed={gateCount}
        freeLimit={3}
        freeFeature="scans"
        lockedFeature="unlimited compliance scans"
        accentColor="#6366f1"
        site="complybuddy"
        onSuccess={onRegistered}
        onDismiss={dismissGate}
      />
    )}
    <div className="relative min-h-screen z-10 flex flex-col" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)' }}>
      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />
      {/* Ambient blobs — deep blue/indigo at very low opacity */}
      <div
        className="liquid-blob liquid-blob-1"
        style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.10), transparent 70%)', opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="liquid-blob liquid-blob-2"
        style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.08), transparent 70%)', animationDelay: '-7s', opacity: 0.1 }}
        aria-hidden="true"
      />

      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/95 border-b border-blue-900/30">
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="badge-3d flex items-center justify-center w-8 h-8 rounded-lg text-base"
              style={{ background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', boxShadow: '0 2px 12px rgba(29,78,216,0.35)' }}
            >
              ✓
            </span>
            <span className="font-extrabold text-white tracking-tight text-lg">ComplyBuddy</span>
            <span className="pill-glass text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ color: '#93c5fd' }}>
              AI Compliance
            </span>
          </div>
          <button
            className="btn-liquid px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', boxShadow: '0 2px 10px rgba(29,78,216,0.3)' }}
          >
            Get started free
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 pb-16">

        {/* Hero */}
        <section className="py-20 md:py-28 text-center relative">
          {/* Large checkmark badge */}
          <div className="inline-flex items-center justify-center mb-6">
            <span
              className="badge-3d inline-flex items-center justify-center w-16 h-16 rounded-2xl text-4xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
                boxShadow: '0 4px 24px rgba(29,78,216,0.40), 0 1px 0 rgba(255,255,255,0.08) inset',
                color: '#bfdbfe',
                fontSize: '28px',
              }}
            >
              ✓
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Stay compliant.<br />
            <span className="text-iridescent">Stay protected.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            AI compliance assistant that explains regulations in plain English for your industry.
          </p>

          {/* Content-type selector */}
          <div className="glass-liquid rounded-2xl p-6 mb-6 max-w-2xl mx-auto text-left">
            <p className="text-xs font-semibold text-blue-300/70 uppercase tracking-widest mb-3">Content type</p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setContentType(t)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border font-semibold transition-all capitalize ${
                    contentType === t
                      ? "border-blue-500 text-blue-200"
                      : "border-white/10 text-slate-400 hover:border-blue-700/50 hover:text-slate-300"
                  }`}
                  style={contentType === t ? { background: 'rgba(29,78,216,0.25)' } : {}}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Main scanner input */}
          <div className="glass-liquid rounded-2xl p-6 max-w-2xl mx-auto text-left">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Paste your ${contentType} here…`}
              className="w-full rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(29,78,216,0.25)',
              }}
              rows={4}
            />

            {/* Example shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 mb-4">
              <span className="text-xs text-slate-500">Try:</span>
              {EXAMPLES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => { setContent(ex.text); setResult(null); setError(""); }}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-700/30 hover:border-blue-500/50 px-2.5 py-0.5 rounded-full transition-all"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Scan CTA */}
            <button
              onClick={handleScan}
              disabled={loading || !content.trim()}
              className="btn-liquid w-full flex items-center justify-center gap-2 font-bold text-sm text-white px-6 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', boxShadow: '0 2px 16px rgba(29,78,216,0.35)' }}
            >
              {loading ? (
                <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Scanning…</>
              ) : (
                <>✓ Scan for compliance</>
              )}
            </button>

            {/* What we check */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
              <span className="text-xs text-slate-500 mr-1">Checks:</span>
              {CHECKS.map(c => (
                <span key={c} className="text-xs text-slate-500 border border-white/[0.08] px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 -mt-8">
          {[
            { icon: "🔒", label: "GDPR Ready" },
            { icon: "⚡", label: "Instant answers" },
            { icon: "📋", label: "Plain English" },
            { icon: "🏭", label: "Industry-specific" },
          ].map(pill => (
            <span key={pill.label} className="pill-glass text-xs font-semibold px-4 py-1.5 rounded-full" style={{ color: '#bfdbfe' }}>
              {pill.icon} {pill.label}
            </span>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="issue-red rounded-xl p-4 mb-6 fade-in text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="fade-in space-y-4 mb-10">

            {/* Score card */}
            <div className="glass-liquid rounded-2xl p-5 reveal-3d flex items-center gap-5">
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
                <p className="text-xs font-semibold text-blue-300/60 uppercase tracking-widest mb-2">
                  Issues Found ({result.issues.length})
                </p>
                <div className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`${severityClass(issue.severity)} reveal-3d rounded-xl p-4 cursor-pointer transition-all`}
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
                            <p className="text-xs text-blue-300">{issue.law}</p>
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
              <div className="glass-liquid rounded-2xl p-5 reveal-3d">
                <p className="text-xs font-semibold text-blue-300/60 uppercase tracking-widest mb-3">What you did right</p>
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
            <div className="glass-liquid reveal-3d rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Scan another piece of content</p>
                <p className="text-xs text-slate-500 mt-0.5">Free, no account needed</p>
              </div>
              <button
                onClick={() => { setContent(""); setResult(null); setError(""); }}
                className="text-sm border font-semibold border-blue-600/40 text-blue-400 hover:bg-blue-600/10 px-4 py-1.5 rounded-xl transition-all whitespace-nowrap"
              >
                New Scan
              </button>
            </div>
          </div>
        )}

        {/* Ad — after results */}
        {result && <AdUnit size="banner" className="mb-10" />}

        {/* How it works */}
        <section id="how" className="mt-4 mb-12">
          <h2 className="text-xl font-bold text-white text-center mb-6 tracking-tight">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: "📋", step: "1", title: "Paste your content", desc: "Any social post, ad copy, email, or website text." },
              { icon: "🤖", step: "2", title: "AI scans instantly", desc: "Checks 8 compliance categories in seconds." },
              { icon: "🛠️", step: "3", title: "Get exact fixes", desc: "Each issue includes what to fix and which law applies." },
            ].map(item => (
              <div key={item.step} className="glass-liquid rounded-2xl p-5 text-center reveal-3d">
                <div className="text-2xl mb-2">{item.icon}</div>
                <span className="badge-blue text-xs px-2 py-0.5 rounded-full inline-block mb-1.5">Step {item.step}</span>
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white text-center mb-6 tracking-tight">Who uses ComplyBuddy?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "📱", title: "Influencers", desc: "Never miss an #ad disclosure again." },
              { icon: "🏪", title: "Small Businesses", desc: "Meet GDPR and advertising standards." },
              { icon: "📣", title: "Marketers", desc: "Validate campaigns before launch." },
              { icon: "⚖️", title: "Legal Teams", desc: "Quick pre-publish sanity check." },
            ].map(item => (
              <div key={item.title} className="glass-liquid rounded-2xl p-4 reveal-3d">
                <div className="text-xl mb-1.5">{item.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-4">
          <h2 className="text-xl font-bold text-white text-center mb-6 tracking-tight">FAQ</h2>
          <div className="space-y-2 max-w-xl mx-auto">
            {[
              { q: "Is this legal advice?", a: "No. ComplyBuddy is an AI-powered educational tool. Consult a qualified lawyer for serious compliance matters." },
              { q: "Which regulations does it cover?", a: "FTC (US), GDPR (EU), DPDP Act 2023 (India), ASCI guidelines, copyright basics, and platform ad policies (Instagram, YouTube, TikTok, LinkedIn)." },
              { q: "Is my content stored?", a: "No. Your content is sent to the AI for analysis only and is never stored or logged." },
              { q: "How accurate is it?", a: "High accuracy for common issues but not infallible. Best used as a first-pass check — always verify high-severity flags." },
            ].map(item => (
              <div key={item.q} className="glass-liquid rounded-2xl p-5 reveal-3d">
                <p className="font-semibold text-white text-sm mb-1">{item.q}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ad — bottom of page */}
        <AdUnit size="banner" className="mb-6" />
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-900/20 py-8 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', color: '#bfdbfe' }}
          >
            ✓
          </span>
          <strong className="text-slate-400 font-semibold">ComplyBuddy</strong>
          <span>— AI compliance checker for content creators and businesses</span>
        </div>
        <p className="mt-1">Not legal advice. For educational purposes only.</p>
      </footer>
    </div>
    </>
  );
}
