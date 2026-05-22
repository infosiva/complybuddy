"use client";
// components/ScanTool.tsx — extracted scan UI (unchanged from original page.tsx)
// Preserves all existing functionality: scan form, results, pricing, gate, guided tour.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdUnit from "@/components/AdUnit";
import { useGate } from '@/lib/shared/useGate'
import RegisterGate from '@/lib/shared/RegisterGate'
import GuidedTour, { type TourStep } from '@/components/GuidedTour'

// ── Config ────────────────────────────────────────────────────────────────────
const COMPLIANCE_STANDARDS = [
  { id: "gdpr", label: "GDPR", icon: "🇪🇺", desc: "EU data privacy" },
  { id: "wcag", label: "WCAG 2.1", icon: "♿", desc: "Accessibility" },
  { id: "ccpa", label: "CCPA", icon: "🇺🇸", desc: "CA privacy law" },
  { id: "cookie", label: "Cookie Law", icon: "🍪", desc: "Consent rules" },
  { id: "privacy", label: "Privacy Policy", icon: "🔒", desc: "Policy gaps" },
  { id: "ftc", label: "FTC", icon: "⚖️", desc: "US ad rules" },
];

const COMPLY_TOUR: TourStep[] = [
  { target: '#scan-input', title: 'Paste your content', icon: '📋', body: 'Paste any social post, ad copy, or email — ComplyBuddy checks it against GDPR, FTC, ASA and more.', placement: 'bottom' },
  { target: '#scan-btn', title: 'Scan in seconds', icon: '🔍', body: 'AI checks for compliance issues instantly — no account needed for your first 3 scans.', placement: 'top' },
  { target: '#compliance-standards', title: 'Covers all major laws', icon: '⚖️', body: 'GDPR, FTC, COPPA, ASA — one tool for all global compliance rules.', placement: 'top' },
];

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
  "social media post", "website copy", "ad creative", "email campaign", "blog post",
];

const EXAMPLES = [
  { label: "Sponsored post", text: "Loving my new skincare routine with @GlowLab products! Their vitamin C serum has completely transformed my skin in just 2 weeks. Use code SARAH20 for 20% off — link in bio! ✨ #skincare #glowup #beauty" },
  { label: "Misleading claim", text: "🚨 LIMITED TIME ONLY — 90% of users lose 10kg in 30 days with our SuperSlim formula! Scientifically PROVEN and doctor-approved. Only 3 bottles left at this price. Buy NOW before it's gone forever!" },
  { label: "GDPR risk", text: "Welcome to ShopEasy! We use cookies to track your browsing behaviour, build detailed profiles, and share your data with our 50+ advertising partners to show you personalised ads." },
];

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

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Main Scan Tool ─────────────────────────────────────────────────────────────
export default function ScanTool() {
  const { count: gateCount, showGate, increment: gateIncrement, onRegistered, dismissGate } = useGate('complybuddy', 3);
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("social media post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const userRaw = localStorage.getItem('auth_user');
    if (!userRaw) return;
    try {
      const user = JSON.parse(userRaw);
      fetch(`/api/pro-status?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(d => { if (d.pro) setIsPro(true); })
        .catch(() => {});
      if (params.get('upgraded') === '1') {
        setIsPro(true);
        window.history.replaceState({}, '', '/');
      }
    } catch { }
  }, []);

  async function handleUpgrade() {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
    const email = userRaw ? (() => { try { return JSON.parse(userRaw).email; } catch { return ''; } })() : '';
    if (!email) { alert('Please sign in first, then click Upgrade.'); return; }
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
    } catch (e: unknown) {
      setError((e instanceof Error ? e.message : null) || "Something went wrong. Please try again.");
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
          accentColor="#6366f1"
          site="complybuddy"
          onSuccess={onRegistered}
          onDismiss={dismissGate}
        />
      )}

      <style>{`
        @keyframes dotBlink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        .dot-1{animation:dotBlink 1.4s ease-in-out infinite}
        .dot-2{animation:dotBlink 1.4s ease-in-out 0.2s infinite}
        .dot-3{animation:dotBlink 1.4s ease-in-out 0.4s infinite}
        @media(max-width:640px){
          .cb-pricing-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* ── SCANNER ── */}
      <section id="scanner" className="relative z-10 py-12 px-5 max-w-5xl mx-auto w-full border-t border-white/[0.05]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Run a compliance scan</h2>
          <p className="text-white/40 text-sm">Paste any content and get results in seconds</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Standards chips */}
          <div id="compliance-standards" className="flex flex-wrap items-center gap-1.5 mb-5 justify-center">
            {COMPLIANCE_STANDARDS.map(s => (
              <span key={s.id} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>

          {/* Scanner card */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15,17,28,0.9)', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 0 0 1px rgba(99,102,241,0.06) inset, 0 24px 64px rgba(0,0,0,0.5)' }}>

            {/* Content type tabs */}
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
              <div className="flex items-center gap-1 flex-wrap">
                {CONTENT_TYPES.map(t => (
                  <button key={t} onClick={() => setContentType(t)}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize transition-all"
                    style={contentType === t ? {
                      background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.45)', color: '#a5b4fc',
                    } : {
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#475569',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {/* Example chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[11px] text-slate-600">Try:</span>
                {EXAMPLES.map(ex => (
                  <button key={ex.label}
                    onClick={() => { setContent(ex.text); setResult(null); setError(""); }}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all"
                    style={{ color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)', background: 'transparent' }}>
                    {ex.label}
                  </button>
                ))}
              </div>

              <textarea
                id="scan-input"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Paste your ${contentType} here…`}
                className="w-full rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none transition-all"
                style={{ background: 'rgba(5,6,12,0.7)', border: '1px solid rgba(255,255,255,0.07)', lineHeight: '1.7', minHeight: 120 }}
                rows={4}
              />

              {content.length > 0 && (
                <p className="text-[10px] font-mono mt-1 mb-2"
                  style={{ color: content.length > 3800 ? '#f87171' : '#374151' }}>
                  {content.length}/4000{content.length > 3800 && ' — will be trimmed'}
                </p>
              )}
              {content.length === 0 && <div className="mb-2" />}

              <button
                id="scan-btn"
                onClick={handleScan}
                disabled={loading || !content.trim()}
                className="w-full flex items-center justify-center gap-2 font-bold text-[14px] text-white px-6 py-3 rounded-xl transition-all disabled:opacity-35 disabled:cursor-not-allowed btn-press"
                style={{ background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: loading ? 'none' : '0 2px 20px rgba(99,102,241,0.4)', letterSpacing: '0.01em' }}>
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Run Compliance Scan
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-3">
                {['Free to start', 'No signup needed', 'Results in 5s'].map(t => (
                  <span key={t} className="text-[11px] text-slate-600 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="relative z-10 max-w-5xl mx-auto px-5 mt-4 mb-2">
          <div className="rounded-xl p-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* AUDIT RESULTS */}
      {result && vStyle && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 max-w-5xl mx-auto px-5 mt-5 mb-10 space-y-3"
        >
          {/* Report header */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(12,14,24,0.95)', border: `1px solid ${vStyle.border}`, boxShadow: `0 0 48px ${vStyle.bg}` }}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${vStyle.border}`, background: vStyle.bg }}>
              <div className="flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={vStyle.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-mono" style={{ color: vStyle.text }}>Compliance Audit Report</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{new Date().toISOString().split('T')[0]}</span>
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
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issues */}
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
                    <div key={i} className="rounded-xl overflow-hidden cursor-pointer transition-all"
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
                        <span className="text-slate-600 text-[10px] mt-1 shrink-0 font-mono">{expandedIssue === i ? "▲" : "▼"}</span>
                      </div>
                      {expandedIssue === i && (
                        <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${s.border}`, paddingTop: 12 }}>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono mb-1.5" style={{ color: '#475569' }}>Recommended fix</p>
                            <p className="text-xs text-slate-300 leading-relaxed">{issue.fix}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono mb-1.5" style={{ color: '#475569' }}>Applicable regulation</p>
                            <p className="text-xs font-mono" style={{ color: '#a5b4fc' }}>{issue.law}</p>
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
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase font-mono mb-2.5" style={{ color: '#34d399' }}>Compliant elements</p>
              <div className="space-y-1.5">
                {result.positives.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 rounded-xl p-4"
            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)' }}>
            <div>
              <p className="text-sm font-bold text-white">Scan another piece of content</p>
              <p className="text-xs text-slate-500 mt-0.5">Free — no account required</p>
            </div>
            <button
              onClick={() => { setContent(""); setResult(null); setError(""); }}
              className="text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap transition-all btn-press"
              style={{ border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc', background: 'transparent' }}>
              New Scan →
            </button>
          </div>
          <AdUnit size="banner" />
        </motion.div>
      )}

      {/* PRICING */}
      <section
        id="pricing"
        className="relative z-10 max-w-5xl mx-auto px-5 pb-12 border-t border-white/[0.05] pt-14"
      >
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-1.5 text-center" style={{ color: '#6366f1' }}>Pricing</p>
        <h2 className="text-[22px] font-black text-white text-center mb-1" style={{ letterSpacing: '-0.025em' }}>Simple, transparent pricing</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Start free. Upgrade when you need more.</p>

        <div className="cb-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 560, margin: '0 auto' }}>
          {/* FREE */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(15,17,28,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-mono" style={{ color: '#475569' }}>Free</span>
            <div className="flex items-baseline gap-1 mt-1.5 mb-0.5">
              <span className="text-3xl font-black text-white">$0</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">No credit card needed</p>
            <div className="space-y-2 mb-5">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all btn-press"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', background: 'rgba(255,255,255,0.03)' }}>
              Start free →
            </button>
          </div>

          {/* PRO */}
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.12) 0%, rgba(15,17,28,0.9) 100%)', border: '1px solid rgba(99,102,241,0.4)', boxShadow: '0 0 40px rgba(99,102,241,0.10)' }}>
            <div className="absolute top-0 right-0 text-[9px] font-black tracking-[0.08em] uppercase font-mono px-3 py-1 rounded-bl-xl"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
              Popular
            </div>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase font-mono" style={{ color: '#a5b4fc' }}>Pro</span>
            <div className="flex items-baseline gap-1 mt-1.5 mb-0.5">
              <span className="text-3xl font-black text-white">$9</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">Cancel anytime</p>
            <div className="space-y-2 mb-5">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={handleUpgrade}
              disabled={checkingOut || isPro}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-press"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
              {isPro ? "You're on Pro" : checkingOut ? 'Redirecting…' : 'Get Pro — $9/mo →'}
            </button>
          </div>
        </div>
      </section>

      <GuidedTour steps={COMPLY_TOUR} storageKey="complybuddy_tour_v1" accentColor="#6366f1" />
    </>
  );
}
