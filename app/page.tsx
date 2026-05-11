"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import { useGate } from '@/lib/shared/useGate'
import RegisterGate from '@/lib/shared/RegisterGate'
import GuidedTour, { type TourStep } from '@/components/GuidedTour'

const COMPLY_TOUR: TourStep[] = [
  { target: '#scan-input', title: 'Paste your content', icon: '📋', body: 'Paste any social post, ad copy, or email — ComplyBuddy checks it against GDPR, FTC, ASA and more.', placement: 'bottom' },
  { target: '#scan-btn', title: 'Scan in seconds', icon: '🔍', body: 'AI checks for compliance issues instantly — no account needed for your first 3 scans.', placement: 'top' },
  { target: '#compliance-standards', title: 'Covers all major laws', icon: '⚖️', body: 'GDPR, FTC, COPPA, ASA — one tool for all global compliance rules.', placement: 'top' },
]

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

const COMPLIANCE_STANDARDS = ["GDPR", "FTC", "ASA", "COPPA", "DPDP", "CCPA"];

const FREE_FEATURES = [
  "3 scans per day",
  "FTC & GDPR checks",
  "Severity classification",
  "Plain-English explanations",
  "Basic fix suggestions",
];

const PRO_FEATURES = [
  "Unlimited scans",
  "All 8 compliance frameworks",
  "Detailed regulation citations",
  "Priority AI processing",
  "PDF audit report export",
  "COPPA & CCPA checks",
  "Team sharing (up to 5)",
  "Email digest reports",
];

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}
function scoreRing(score: number) {
  if (score >= 80) return "stroke-emerald-400";
  if (score >= 50) return "stroke-amber-400";
  return "stroke-red-400";
}
function scoreLabel(score: number) {
  if (score >= 80) return "COMPLIANT";
  if (score >= 50) return "REVIEW NEEDED";
  return "NON-COMPLIANT";
}
function verdictColor(verdict: ScanResult["verdict"]) {
  if (verdict === "compliant") return { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "#34d399", label: "COMPLIANT" };
  if (verdict === "issues-found") return { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", text: "#fbbf24", label: "ISSUES FOUND" };
  return { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#f87171", label: "NON-COMPLIANT" };
}
function severityStyle(s: Severity) {
  if (s === "high") return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", badge: "rgba(239,68,68,0.2)", badgeText: "#f87171", label: "HIGH" };
  if (s === "medium") return { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", badge: "rgba(245,158,11,0.2)", badgeText: "#fbbf24", label: "MED" };
  return { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", badge: "rgba(16,185,129,0.2)", badgeText: "#34d399", label: "LOW" };
}

function ScoreCircle({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
      {/* Track */}
      <svg className="absolute w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={r} fill="none" strokeWidth="6"
          className={`transition-all duration-1000 ${scoreRing(score)}`}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: score >= 80 ? 'drop-shadow(0 0 6px rgba(52,211,153,0.6))' : score >= 50 ? 'drop-shadow(0 0 6px rgba(251,191,36,0.6))' : 'drop-shadow(0 0 6px rgba(248,113,113,0.6))' }}
        />
      </svg>
      <div className="text-center">
        <div className={`text-2xl font-black ${scoreColor(score)}`}>{score}</div>
        <div className="text-[9px] text-slate-500 font-bold tracking-widest">/100</div>
      </div>
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

  const vStyle = result ? verdictColor(result.verdict) : null;

  return (
    <>
    {showGate && (
      <RegisterGate
        freeUsed={gateCount}
        freeLimit={3}
        freeFeature="scans"
        lockedFeature="unlimited compliance scans"
        accentColor="#1d4ed8"
        site="complybuddy"
        onSuccess={onRegistered}
        onDismiss={dismissGate}
      />
    )}

    {/* ─── Page shell ─── */}
    <div className="relative min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1d38 40%, #0a1628 100%)' }}>

      {/* ── Animated compliance grid background ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Flat grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(29,78,216,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Horizontal scan line that crawls down */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(29,78,216,0.5) 30%, rgba(99,102,241,0.8) 50%, rgba(29,78,216,0.5) 70%, transparent 100%)',
          animation: 'scanMove 6s linear infinite',
          top: 0,
        }} />
        {/* Deep navy radial fade at top to avoid harsh grid */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '260px',
          background: 'linear-gradient(to bottom, #0a1628 0%, transparent 100%)',
        }} />
        {/* Soft blue glow top-center */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(29,78,216,0.14) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
          background: 'linear-gradient(to top, #0a1628 0%, transparent 100%)',
        }} />
      </div>

      {/* Scanline keyframe */}
      <style>{`
        @keyframes scanMove {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes auditPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .dot-1 { animation: dotBlink 1.4s ease-in-out infinite; }
        .dot-2 { animation: dotBlink 1.4s ease-in-out 0.2s infinite; }
        .dot-3 { animation: dotBlink 1.4s ease-in-out 0.4s infinite; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-20 pb-10 px-5 text-center max-w-4xl mx-auto w-full">

        {/* Compliance framework badges row */}
        <div id="compliance-standards" className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {COMPLIANCE_STANDARDS.map(std => (
            <span key={std}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] px-3 py-1 rounded"
              style={{
                background: 'rgba(29,78,216,0.12)',
                border: '1px solid rgba(29,78,216,0.35)',
                color: '#93c5fd',
                letterSpacing: '0.1em',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', boxShadow: '0 0 6px rgba(59,130,246,0.8)', flexShrink: 0 }} />
              {std}
            </span>
          ))}
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-[3.5rem] font-black text-white mb-4 leading-[1.05]" style={{ letterSpacing: '-0.03em' }}>
          Scan your content for<br />
          <span style={{
            background: 'linear-gradient(90deg, #60a5fa 0%, #818cf8 50%, #60a5fa 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            compliance issues in seconds
          </span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto mb-2 leading-relaxed">
          AI-powered scanner that checks your posts, ads, and copy against GDPR, FTC, ASA, COPPA and more — before they cost you.
        </p>

        {/* Sub-trust line */}
        <p className="text-slate-500 text-xs mb-10">
          Used by 2,400+ marketers, creators, and legal teams &nbsp;·&nbsp; No account needed to start
        </p>

        {/* ── SCANNER CARD ── */}
        <div className="max-w-2xl mx-auto text-left">

          {/* Content type selector */}
          <div className="mb-3">
            <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-[0.15em] mb-2">Content type</p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setContentType(t)}
                  className="text-xs px-3.5 py-1.5 rounded font-semibold capitalize transition-all"
                  style={contentType === t ? {
                    background: 'rgba(29,78,216,0.3)',
                    border: '1px solid rgba(59,130,246,0.6)',
                    color: '#93c5fd',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: '#64748b',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Main input panel */}
          <div className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(13,25,56,0.7)',
              border: '1px solid rgba(29,78,216,0.3)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(29,78,216,0.1) inset',
            }}>

            {/* Terminal-style header bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ borderColor: 'rgba(29,78,216,0.2)', background: 'rgba(10,20,44,0.6)' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              <span className="ml-auto text-[10px] text-slate-500 font-mono tracking-widest uppercase">compliance scanner v2</span>
            </div>

            <div className="p-5">
              <textarea
                id="scan-input"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Paste your ${contentType} here…`}
                className="w-full rounded-lg p-3.5 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none transition-all font-mono"
                style={{
                  background: 'rgba(5,12,30,0.6)',
                  border: '1px solid rgba(29,78,216,0.2)',
                  lineHeight: '1.7',
                }}
                rows={4}
              />

              {/* Example shortcuts */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 mb-4">
                <span className="text-[11px] text-slate-600 font-mono">{'>'} try:</span>
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.label}
                    onClick={() => { setContent(ex.text); setResult(null); setError(""); }}
                    className="text-[11px] font-mono transition-all px-2.5 py-0.5 rounded"
                    style={{ color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', background: 'transparent' }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {/* Scan CTA */}
              <button
                id="scan-btn"
                onClick={handleScan}
                disabled={loading || !content.trim()}
                className="w-full flex items-center justify-center gap-2.5 font-bold text-sm text-white px-6 py-3.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: loading ? 'rgba(29,78,216,0.6)' : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)',
                  boxShadow: '0 2px 20px rgba(29,78,216,0.4)',
                  letterSpacing: '0.02em',
                }}
              >
                {loading ? (
                  <>
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white dot-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white dot-2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white dot-3" />
                    </span>
                    Scanning for violations…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Run Compliance Scan
                  </>
                )}
              </button>

              {/* Framework pills */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[11px] text-slate-600 mr-0.5 font-mono">checks:</span>
                {CHECKS.map(c => (
                  <span key={c} className="text-[11px] font-mono px-2 py-0.5 rounded"
                    style={{ color: '#475569', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ERROR ── */}
      {error && (
        <div className="relative z-10 max-w-2xl mx-auto px-5 mb-6">
          <div className="rounded-lg p-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* ── AUDIT REPORT RESULTS ── */}
      {result && vStyle && (
        <div className="relative z-10 max-w-2xl mx-auto px-5 mb-12 space-y-4">

          {/* Report header */}
          <div className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(10,18,40,0.85)',
              border: `1px solid ${vStyle.border}`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 40px ${vStyle.bg}`,
            }}>
            {/* Report top bar */}
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${vStyle.border}`, background: vStyle.bg }}>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={vStyle.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase font-mono" style={{ color: vStyle.text }}>
                  Compliance Audit Report
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {new Date().toISOString().split('T')[0]}
              </span>
            </div>

            {/* Score row */}
            <div className="p-5 flex items-center gap-5">
              <ScoreCircle score={result.overallScore} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-black text-white">Compliance Score</span>
                  <span className="text-[10px] font-bold tracking-[0.12em] px-2.5 py-0.5 rounded font-mono"
                    style={{ background: vStyle.bg, border: `1px solid ${vStyle.border}`, color: vStyle.text }}>
                    {scoreLabel(result.overallScore)}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{result.summary}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {result.checkedFor?.slice(0,4).map(f => (
                    <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ background: 'rgba(29,78,216,0.12)', border: '1px solid rgba(29,78,216,0.25)', color: '#60a5fa' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Issues list */}
          {result.issues.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase font-mono text-slate-500">
                  Issues Detected
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                  {result.issues.length} found
                </span>
              </div>
              <div className="space-y-2">
                {result.issues.map((issue, i) => {
                  const s = severityStyle(issue.severity);
                  return (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden cursor-pointer transition-all"
                      style={{ background: s.bg, border: `1px solid ${s.border}` }}
                      onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                    >
                      <div className="px-4 py-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-[9px] font-black tracking-[0.12em] px-2 py-0.5 rounded mt-0.5 font-mono shrink-0"
                            style={{ background: s.badge, color: s.badgeText, border: `1px solid ${s.border}` }}>
                            {s.label}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white">{issue.category}</p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{issue.description}</p>
                          </div>
                        </div>
                        <span className="text-slate-600 text-xs mt-0.5 shrink-0 font-mono">
                          {expandedIssue === i ? "▲" : "▼"}
                        </span>
                      </div>
                      {expandedIssue === i && (
                        <div className="px-4 pb-4 pt-0 space-y-3"
                          style={{ borderTop: `1px solid ${s.border}`, paddingTop: 12 }}>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] font-mono mb-1.5"
                              style={{ color: '#64748b' }}>Recommended fix</p>
                            <p className="text-xs text-slate-300 leading-relaxed">{issue.fix}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] font-mono mb-1.5"
                              style={{ color: '#64748b' }}>Applicable regulation</p>
                            <p className="text-xs font-mono" style={{ color: '#60a5fa' }}>{issue.law}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Positives */}
          {result.positives.length > 0 && (
            <div className="rounded-lg p-4"
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase font-mono mb-3"
                style={{ color: '#34d399' }}>Compliant elements</p>
              <div className="space-y-1.5">
                {result.positives.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="mt-0.5 shrink-0 font-mono" style={{ color: '#34d399' }}>✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New scan CTA */}
          <div className="rounded-lg p-4 flex items-center justify-between gap-4"
            style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.2)' }}>
            <div>
              <p className="text-sm font-bold text-white">Scan another piece of content</p>
              <p className="text-xs text-slate-500 mt-0.5">Free — no account required</p>
            </div>
            <button
              onClick={() => { setContent(""); setResult(null); setError(""); }}
              className="text-xs font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap"
              style={{ border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa', background: 'transparent' }}
            >
              New Scan →
            </button>
          </div>

          {/* Ad after results */}
          <AdUnit size="banner" />
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 mb-16">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase font-mono mb-2" style={{ color: '#3b82f6' }}>How it works</p>
          <h2 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Professional audit in three steps</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { num: "01", icon: "📋", title: "Paste your content", desc: "Any social post, ad copy, email, or website text — up to 2,000 words." },
            { num: "02", icon: "⚡", title: "AI scans instantly", desc: "Checks against 8 compliance frameworks in under 5 seconds." },
            { num: "03", icon: "📄", title: "Get audit report", desc: "Each issue shows severity, which law applies, and exactly how to fix it." },
          ].map(item => (
            <div key={item.num} className="rounded-xl p-5 relative overflow-hidden"
              style={{
                background: 'rgba(13,25,56,0.6)',
                border: '1px solid rgba(29,78,216,0.18)',
                backdropFilter: 'blur(16px)',
              }}>
              <div className="text-[40px] font-black absolute top-4 right-4 font-mono opacity-[0.04] leading-none"
                style={{ color: '#60a5fa' }}>{item.num}</div>
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 mb-16">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase font-mono mb-2" style={{ color: '#3b82f6' }}>Pricing</p>
          <h2 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Simple, transparent pricing</h2>
          <p className="text-slate-400 text-sm mt-2">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

          {/* FREE plan */}
          <div className="rounded-xl p-6"
            style={{
              background: 'rgba(13,25,56,0.5)',
              border: '1px solid rgba(29,78,216,0.2)',
              backdropFilter: 'blur(16px)',
            }}>
            <div className="mb-4">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase font-mono" style={{ color: '#64748b' }}>Free</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">$0</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">No credit card needed</p>
            </div>
            <div className="space-y-2 mb-6">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono shrink-0" style={{ color: '#34d399' }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ border: '1px solid rgba(29,78,216,0.35)', color: '#60a5fa', background: 'rgba(29,78,216,0.08)' }}
            >
              Start free →
            </button>
          </div>

          {/* PRO plan */}
          <div className="rounded-xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(29,78,216,0.18) 0%, rgba(13,25,56,0.7) 100%)',
              border: '1px solid rgba(59,130,246,0.4)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px rgba(29,78,216,0.15)',
            }}>
            {/* Popular badge */}
            <div className="absolute top-0 right-0">
              <div className="text-[10px] font-black tracking-[0.1em] uppercase font-mono px-3 py-1 rounded-bl-lg"
                style={{ background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', color: '#bfdbfe' }}>
                Most Popular
              </div>
            </div>
            <div className="mb-4">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase font-mono" style={{ color: '#60a5fa' }}>Pro</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">$9</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Billed monthly, cancel anytime</p>
            </div>
            <div className="space-y-2 mb-6">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-mono shrink-0" style={{ color: '#60a5fa' }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #1e40af, #1d4ed8)',
                boxShadow: '0 4px 20px rgba(29,78,216,0.4)',
              }}
            >
              Get Pro — $9/mo →
            </button>
          </div>
        </div>
      </section>

      {/* ── WHO USES COMPLYSCAN ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 mb-16">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase font-mono mb-2" style={{ color: '#3b82f6' }}>Use cases</p>
          <h2 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Built for every team</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "📱", title: "Influencers", desc: "Never miss an #ad disclosure again." },
            { icon: "🏪", title: "Small Businesses", desc: "Meet GDPR and advertising standards." },
            { icon: "📣", title: "Marketers", desc: "Validate campaigns before launch." },
            { icon: "⚖️", title: "Legal Teams", desc: "Quick pre-publish sanity check." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4"
              style={{
                background: 'rgba(13,25,56,0.5)',
                border: '1px solid rgba(29,78,216,0.15)',
              }}>
              <div className="text-xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST / COMPLIANCE STANDARDS SECTION ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-5 mb-16">
        <div className="rounded-xl p-8 text-center"
          style={{
            background: 'rgba(13,25,56,0.6)',
            border: '1px solid rgba(29,78,216,0.2)',
            backdropFilter: 'blur(20px)',
          }}>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase font-mono mb-2" style={{ color: '#3b82f6' }}>Coverage</p>
          <h2 className="text-xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>Covers major compliance frameworks</h2>
          <p className="text-xs text-slate-500 mb-6">Continuously updated as regulations evolve</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { code: "GDPR", name: "EU Data Protection", region: "Europe" },
              { code: "FTC", name: "Ad Disclosure Rules", region: "US" },
              { code: "ASA", name: "Advertising Standards", region: "UK" },
              { code: "COPPA", name: "Children's Online Privacy", region: "US" },
              { code: "CCPA", name: "Consumer Privacy Act", region: "California" },
              { code: "DPDP", name: "Digital Personal Data", region: "India" },
            ].map(std => (
              <div key={std.code} className="rounded-lg px-4 py-3 text-left"
                style={{
                  background: 'rgba(29,78,216,0.08)',
                  border: '1px solid rgba(29,78,216,0.25)',
                  minWidth: 120,
                }}>
                <div className="text-sm font-black text-white mb-0.5">{std.code}</div>
                <div className="text-[10px] text-slate-400">{std.name}</div>
                <div className="text-[10px] font-mono mt-1" style={{ color: '#60a5fa' }}>{std.region}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 max-w-2xl mx-auto px-5 mb-16">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase font-mono mb-2" style={{ color: '#3b82f6' }}>FAQ</p>
          <h2 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Common questions</h2>
        </div>
        <div className="space-y-3">
          {[
            { q: "Is this legal advice?", a: "No. ComplyScan is an AI-powered educational tool. Consult a qualified lawyer for serious compliance matters." },
            { q: "Which regulations does it cover?", a: "FTC (US), GDPR (EU), DPDP Act 2023 (India), ASA/ASCI guidelines, copyright basics, COPPA, CCPA, and platform ad policies (Instagram, YouTube, TikTok, LinkedIn)." },
            { q: "Is my content stored?", a: "No. Your content is sent to the AI for analysis only and is never stored or logged on our servers." },
            { q: "How accurate is it?", a: "High accuracy for common issues but not infallible. Best used as a first-pass check — always verify high-severity flags with a legal professional." },
          ].map(item => (
            <div key={item.q} className="rounded-lg p-5"
              style={{
                background: 'rgba(13,25,56,0.5)',
                border: '1px solid rgba(29,78,216,0.15)',
              }}>
              <p className="font-bold text-white text-sm mb-1.5">{item.q}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM AD ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 mb-8">
        <AdUnit size="banner" />
      </div>

      <GuidedTour steps={COMPLY_TOUR} storageKey="complybuddy_tour_v1" accentColor="#3b82f6" />
    </div>
    </>
  );
}
