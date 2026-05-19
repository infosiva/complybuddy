"use client";

import { useState, useEffect } from "react";
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
  const [checkingOut, setCheckingOut] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Check pro status on load + after upgrade redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const userRaw = localStorage.getItem('auth_user');
    if (!userRaw) return;
    try {
      const user = JSON.parse(userRaw);
      fetch(`/api/pro-status?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(d => {
          if (d.pro) setIsPro(true);
        }).catch(() => {});
      if (params.get('upgraded') === '1') {
        setIsPro(true);
        window.history.replaceState({}, '', '/');
      }
    } catch {}
  }, []);

  async function handleUpgrade() {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
    const email = userRaw ? (() => { try { return JSON.parse(userRaw).email } catch { return '' } })() : '';
    if (!email) {
      // Not logged in — show auth gate first
      alert('Please sign in first, then click Upgrade.');
      return;
    }
    setCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || 'Checkout failed');
    } catch {
      setError('Checkout failed — please try again');
    } finally {
      setCheckingOut(false);
    }
  }

  async function handleScan() {
    if (!content.trim()) return;
    // Pro users skip the gate entirely
    if (!isPro) {
      const allowed = await gateIncrement();
      if (!allowed) return;
    }
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
      style={{ background: '#0a0c14' }}>

      {/* ── Subtle grid + glow background ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />
        <div style={{
          position: 'absolute', top: '-160px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '560px',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 68%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '220px',
          background: 'linear-gradient(to bottom, #0a0c14 0%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
          background: 'linear-gradient(to top, #0a0c14 0%, transparent 100%)',
        }} />
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .dot-1 { animation: dotBlink 1.4s ease-in-out infinite; }
        .dot-2 { animation: dotBlink 1.4s ease-in-out 0.2s infinite; }
        .dot-3 { animation: dotBlink 1.4s ease-in-out 0.4s infinite; }
        .cb-nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; height: 54px;
          background: rgba(10,12,20,0.92);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
        }
        .cb-nav-logo { font-size: 15px; font-weight: 900; letter-spacing: -0.5px; color: #fff; display: flex; align-items: center; gap: 8px; }
        .cb-nav-links { display: flex; align-items: center; gap: 24px; }
        .cb-nav-link { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 500; cursor: pointer; border: none; background: none; transition: color 0.15s; }
        .cb-nav-link:hover { color: rgba(255,255,255,0.75); }
        .cb-nav-cta { font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 7px; background: #3b82f6; color: #fff; border: none; cursor: pointer; letter-spacing: 0.01em; transition: background 0.15s; }
        .cb-nav-cta:hover { background: #2563eb; }
        @media (max-width: 640px) {
          .cb-nav-links { display: none; }
          .cb-hero-h1 { font-size: 2rem !important; line-height: 1.08 !important; }
          .cb-pricing-grid { grid-template-columns: 1fr !important; }
          .cb-use-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="cb-nav">
        <div className="cb-nav-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Comply<span style={{ color: '#3b82f6' }}>Scan</span></span>
        </div>
        <div className="cb-nav-links">
          <button className="cb-nav-link" onClick={() => document.getElementById('scan-input')?.scrollIntoView({ behavior: 'smooth' })}>Scanner</button>
          <button className="cb-nav-link" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Pricing</button>
          <button className="cb-nav-cta" onClick={() => document.getElementById('scan-input')?.focus()}>Try free</button>
        </div>
      </nav>

      {/* ── HERO + SCANNER (screen 1) ── */}
      <section className="relative z-10 pt-12 pb-4 px-5 max-w-3xl mx-auto w-full">

        {/* Authority headline */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[11px] font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16,185,129,0.9)' }} />
            AI-powered compliance scanner
          </div>

          <h1 className="cb-hero-h1 font-black text-white leading-[1.07] mb-3"
            style={{ fontSize: '2.75rem', letterSpacing: '-0.03em' }}>
            Is your marketing copy<br />
            <span style={{
              background: 'linear-gradient(95deg, #3b82f6 0%, #60a5fa 55%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              compliant?
            </span>
          </h1>

          <p className="text-slate-400 text-[15px] max-w-md mx-auto leading-relaxed mb-3">
            Paste any ad, email or social post — AI checks GDPR, FTC, ASA in 5 seconds.
          </p>

          {/* Checks bar */}
          <div id="compliance-standards" className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
            {CHECKS.map(c => (
              <span key={c} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#64748b' }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* ── SCANNER CARD ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15,17,28,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(59,130,246,0.08) inset, 0 24px 64px rgba(0,0,0,0.5)',
          }}>

          {/* Card top bar */}
          <div className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {/* Content type selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {CONTENT_TYPES.map(t => (
                <button key={t} onClick={() => setContentType(t)}
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize transition-all"
                  style={contentType === t ? {
                    background: 'rgba(59,130,246,0.2)',
                    border: '1px solid rgba(59,130,246,0.45)',
                    color: '#93c5fd',
                  } : {
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#475569',
                  }}>
                  {t}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-600 hidden sm:block">v2</span>
          </div>

          <div className="p-5">
            {/* Example chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="text-[11px] text-slate-600">Try:</span>
              {EXAMPLES.map(ex => (
                <button key={ex.label}
                  onClick={() => { setContent(ex.text); setResult(null); setError(""); }}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all"
                  style={{ color: '#60a5fa', border: '1px solid rgba(59,130,246,0.22)', background: 'transparent' }}>
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              id="scan-input"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Paste your ${contentType} here…`}
              className="w-full rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none transition-all"
              style={{
                background: 'rgba(5,6,12,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                lineHeight: '1.7',
                minHeight: 140,
              }}
              rows={5}
            />

            {/* Char count */}
            {content.length > 0 && (
              <p className="text-[10px] font-mono mt-1 mb-3"
                style={{ color: content.length > 3800 ? '#f87171' : '#374151' }}>
                {content.length}/4000
                {content.length > 3800 && ' — will be trimmed'}
              </p>
            )}
            {content.length === 0 && <div className="mb-3" />}

            {/* Scan button */}
            <button
              id="scan-btn"
              onClick={handleScan}
              disabled={loading || !content.trim()}
              className="w-full flex items-center justify-center gap-2 font-bold text-[14px] text-white px-6 py-3.5 rounded-xl transition-all disabled:opacity-35 disabled:cursor-not-allowed"
              style={{
                background: loading ? 'rgba(59,130,246,0.5)' : '#3b82f6',
                boxShadow: loading ? 'none' : '0 2px 16px rgba(59,130,246,0.35)',
                letterSpacing: '0.01em',
              }}>
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Run Compliance Scan
                </>
              )}
            </button>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-4 mt-3">
              {['Free to start', 'No signup needed', 'Results in 5s'].map(t => (
                <span key={t} className="text-[11px] text-slate-600 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ERROR ── */}
      {error && (
        <div className="relative z-10 max-w-3xl mx-auto px-5 mt-4 mb-2">
          <div className="rounded-xl p-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* ── AUDIT REPORT RESULTS ── */}
      {result && vStyle && (
        <div className="relative z-10 max-w-3xl mx-auto px-5 mt-5 mb-12 space-y-3">

          {/* Report header card */}
          <div className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(12,14,24,0.95)',
              border: `1px solid ${vStyle.border}`,
              boxShadow: `0 0 48px ${vStyle.bg}`,
            }}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${vStyle.border}`, background: vStyle.bg }}>
              <div className="flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={vStyle.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-mono" style={{ color: vStyle.text }}>
                  Compliance Audit Report
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {new Date().toISOString().split('T')[0]}
              </span>
            </div>

            <div className="p-5 flex items-center gap-5">
              <ScoreCircle score={result.overallScore} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base font-black text-white">Compliance Score</span>
                  <span className="text-[10px] font-bold tracking-[0.1em] px-2.5 py-0.5 rounded-full font-mono"
                    style={{ background: vStyle.bg, border: `1px solid ${vStyle.border}`, color: vStyle.text }}>
                    {scoreLabel(result.overallScore)}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{result.summary}</p>
                {result.checkedFor?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.checkedFor.slice(0, 4).map(f => (
                      <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issues list */}
          {result.issues.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase font-mono text-slate-500">Issues Detected</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  {result.issues.length} found
                </span>
              </div>
              <div className="space-y-2">
                {result.issues.map((issue, i) => {
                  const s = severityStyle(issue.severity);
                  return (
                    <div key={i}
                      className="rounded-xl overflow-hidden cursor-pointer transition-all"
                      style={{ background: s.bg, border: `1px solid ${s.border}` }}
                      onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}>
                      <div className="px-4 py-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-[9px] font-black tracking-[0.1em] px-2 py-0.5 rounded-full mt-0.5 font-mono shrink-0"
                            style={{ background: s.badge, color: s.badgeText, border: `1px solid ${s.border}` }}>
                            {s.label}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white">{issue.category}</p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{issue.description}</p>
                          </div>
                        </div>
                        <span className="text-slate-600 text-[10px] mt-1 shrink-0 font-mono">
                          {expandedIssue === i ? "▲" : "▼"}
                        </span>
                      </div>
                      {expandedIssue === i && (
                        <div className="px-4 pb-4 space-y-3"
                          style={{ borderTop: `1px solid ${s.border}`, paddingTop: 12 }}>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono mb-1.5" style={{ color: '#475569' }}>
                              Recommended fix
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed">{issue.fix}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono mb-1.5" style={{ color: '#475569' }}>
                              Applicable regulation
                            </p>
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
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.18)' }}>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase font-mono mb-2.5" style={{ color: '#34d399' }}>
                Compliant elements
              </p>
              <div className="space-y-1.5">
                {result.positives.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New scan + Ad */}
          <div className="flex items-center justify-between gap-4 rounded-xl p-4"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div>
              <p className="text-sm font-bold text-white">Scan another piece of content</p>
              <p className="text-xs text-slate-500 mt-0.5">Free — no account required</p>
            </div>
            <button
              onClick={() => { setContent(""); setResult(null); setError(""); }}
              className="text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap transition-all"
              style={{ border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa', background: 'transparent' }}>
              New Scan →
            </button>
          </div>

          <AdUnit size="banner" />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────── */}
      {/* BELOW THE FOLD — Features, Pricing, FAQ, Footer        */}
      {/* ─────────────────────────────────────────────────────── */}

      {/* ── HOW IT WORKS (3-col) ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 mt-12 mb-10">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-6 text-center" style={{ color: '#3b82f6' }}>
          How it works
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { num: "01", title: "Paste your content", desc: "Any social post, ad copy, email, or website text — up to 2,000 words." },
            { num: "02", title: "AI scans instantly", desc: "Checks against 6 compliance frameworks in under 5 seconds." },
            { num: "03", title: "Get audit report", desc: "Each issue shows severity, which law applies, and how to fix it." },
          ].map(item => (
            <div key={item.num} className="rounded-xl p-5 relative overflow-hidden"
              style={{ background: 'rgba(15,17,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[36px] font-black absolute top-3 right-4 font-mono opacity-[0.05] leading-none select-none" style={{ color: '#3b82f6' }}>{item.num}</div>
              <p className="text-[10px] font-mono font-bold mb-2" style={{ color: '#3b82f6' }}>{item.num}</p>
              <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 max-w-3xl mx-auto px-5 mb-10">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-1.5 text-center" style={{ color: '#3b82f6' }}>Pricing</p>
        <h2 className="text-2xl font-black text-white text-center mb-1" style={{ letterSpacing: '-0.025em' }}>Simple, transparent pricing</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Start free. Upgrade when you need more.</p>

        <div className="cb-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 580, margin: '0 auto' }}>
          {/* FREE */}
          <div className="rounded-2xl p-6"
            style={{ background: 'rgba(15,17,28,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-mono" style={{ color: '#475569' }}>Free</span>
            <div className="flex items-baseline gap-1 mt-1.5 mb-0.5">
              <span className="text-3xl font-black text-white">$0</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <p className="text-xs text-slate-600 mb-5">No credit card needed</p>
            <div className="space-y-2 mb-6">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', background: 'rgba(255,255,255,0.03)' }}>
              Start free →
            </button>
          </div>

          {/* PRO */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(59,130,246,0.12) 0%, rgba(15,17,28,0.9) 100%)',
              border: '1px solid rgba(59,130,246,0.35)',
              boxShadow: '0 0 40px rgba(59,130,246,0.10)',
            }}>
            <div className="absolute top-0 right-0 text-[9px] font-black tracking-[0.08em] uppercase font-mono px-3 py-1 rounded-bl-xl"
              style={{ background: '#3b82f6', color: '#fff' }}>
              Popular
            </div>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-mono" style={{ color: '#60a5fa' }}>Pro</span>
            <div className="flex items-baseline gap-1 mt-1.5 mb-0.5">
              <span className="text-3xl font-black text-white">$9</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <p className="text-xs text-slate-600 mb-5">Cancel anytime</p>
            <div className="space-y-2 mb-6">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={handleUpgrade}
              disabled={checkingOut || isPro}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#3b82f6', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}>
              {isPro ? 'You\'re on Pro' : checkingOut ? 'Redirecting…' : 'Get Pro — $9/mo →'}
            </button>
          </div>
        </div>
      </section>

      {/* ── WHO USES COMPLYSCAN (4-col) ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 mb-10">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-6 text-center" style={{ color: '#3b82f6' }}>Use cases</p>
        <div className="cb-use-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            { title: "Influencers", desc: "Never miss an #ad disclosure." },
            { title: "Small Businesses", desc: "Meet GDPR and ad standards." },
            { title: "Marketers", desc: "Validate campaigns pre-launch." },
            { title: "Legal Teams", desc: "Quick pre-publish check." },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-4"
              style={{ background: 'rgba(15,17,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 max-w-2xl mx-auto px-5 mb-10">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-6 text-center" style={{ color: '#3b82f6' }}>FAQ</p>
        <div className="space-y-2">
          {[
            { q: "Is this legal advice?", a: "No. ComplyScan is an AI-powered educational tool. Consult a qualified lawyer for serious compliance matters." },
            { q: "Which regulations does it cover?", a: "FTC (US), GDPR (EU), DPDP Act 2023 (India), ASA/ASCI guidelines, copyright basics, COPPA, CCPA, and platform ad policies (Instagram, YouTube, TikTok, LinkedIn)." },
            { q: "Is my content stored?", a: "No. Your content is sent to the AI for analysis only and is never stored or logged on our servers." },
            { q: "How accurate is it?", a: "High accuracy for common issues. Best used as a first-pass check — verify high-severity flags with a legal professional." },
          ].map(item => (
            <div key={item.q} className="rounded-xl p-4"
              style={{ background: 'rgba(15,17,28,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-bold text-white text-sm mb-1">{item.q}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM AD ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 mb-8">
        <AdUnit size="banner" />
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', padding: '28px 24px 20px', marginTop: 8 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Comply<span style={{ color: '#3b82f6' }}>Scan</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', maxWidth: 200, lineHeight: 1.6 }}>
                AI compliance scanner for marketers, creators, and legal teams. Not legal advice.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Product</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Scanner', 'Pricing', 'Frameworks covered'].map(l => (
                    <a key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', cursor: 'pointer' }}>{l}</a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Company</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['About us', 'Contact', 'Privacy policy', 'Cookie policy'].map(l => (
                    <a key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', cursor: 'pointer' }}>{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
              {`© ${new Date().getFullYear()} ComplyScan. For informational use only — not legal advice.`}
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Privacy', 'Cookies', 'Terms'].map(l => (
                <a key={l} style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', textDecoration: 'none', cursor: 'pointer' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── COOKIE BANNER ── */}
      <CookieBanner />

      <GuidedTour steps={COMPLY_TOUR} storageKey="complybuddy_tour_v1" accentColor="#3b82f6" />
    </div>
    </>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const accepted = localStorage.getItem('cb_cookies_ok')
    if (!accepted) setVisible(true)
  }, [])
  if (!visible) return null
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:100, padding:'12px 24px', background:'rgba(10,22,40,0.96)', borderTop:'1px solid rgba(29,78,216,0.3)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
      <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', maxWidth:600, lineHeight:1.5 }}>
        We use essential cookies to keep the scanner working. No tracking cookies, no third-party advertising.{' '}
        <a style={{ color:'#60a5fa', textDecoration:'underline', cursor:'pointer' }}>Cookie policy</a>
      </p>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => { localStorage.setItem('cb_cookies_ok', '1'); setVisible(false) }}
          style={{ fontSize:12, fontWeight:700, padding:'7px 20px', borderRadius:8, background:'linear-gradient(135deg,#1e40af,#1d4ed8)', color:'#fff', border:'none', cursor:'pointer' }}>
          Accept
        </button>
        <button onClick={() => setVisible(false)}
          style={{ fontSize:12, fontWeight:500, padding:'7px 14px', borderRadius:8, background:'transparent', color:'rgba(255,255,255,0.35)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer' }}>
          Decline
        </button>
      </div>
    </div>
  )
}
