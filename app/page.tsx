"use client";

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

// ── Sub-components ────────────────────────────────────────────────────────────
function AnimatedBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent)", filter: "blur(120px)" }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent)", filter: "blur(100px)" }}
        animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent)", filter: "blur(80px)" }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
      />
    </div>
  );
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

// Mock compliance ring for hero right col
function MockComplianceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl p-5 h-full"
      style={{ background: "rgba(15,17,28,0.9)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 0 40px rgba(99,102,241,0.1)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px rgba(99,102,241,0.8)" }} />
        <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase font-mono">Live Scan Result</span>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="absolute w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            {/* red segment ~30% */}
            <circle cx="32" cy="32" r="26" fill="none" strokeWidth="5" stroke="#f87171"
              strokeDasharray={`${0.3 * 2 * Math.PI * 26} ${2 * Math.PI * 26}`} strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 4px rgba(248,113,113,0.5))" }} />
            {/* amber segment ~20% offset */}
            <circle cx="32" cy="32" r="26" fill="none" strokeWidth="5" stroke="#fbbf24"
              strokeDasharray={`${0.2 * 2 * Math.PI * 26} ${2 * Math.PI * 26}`}
              strokeDashoffset={`-${0.3 * 2 * Math.PI * 26}`}
              strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(251,191,36,0.5))" }} />
            {/* green segment ~50% offset */}
            <circle cx="32" cy="32" r="26" fill="none" strokeWidth="5" stroke="#34d399"
              strokeDasharray={`${0.5 * 2 * Math.PI * 26} ${2 * Math.PI * 26}`}
              strokeDashoffset={`-${0.5 * 2 * Math.PI * 26}`}
              strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.5))" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-black text-white">73</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-white mb-1">Compliance Score</div>
          <div className="text-[10px] font-mono px-2 py-0.5 rounded-full inline-block"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24" }}>
            REVIEW NEEDED
          </div>
        </div>
      </div>

      {/* Issue summary */}
      <div className="space-y-2">
        {[
          { count: 3, label: "Critical violations", color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
          { count: 5, label: "Warnings", color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
          { count: 12, label: "Checks passed", color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: item.bg, border: `1px solid ${item.border}` }}>
            <span className="text-sm font-black font-mono" style={{ color: item.color }}>{item.count}</span>
            <span className="text-xs text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Standards chips */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {COMPLIANCE_STANDARDS.slice(0, 4).map(s => (
          <span key={s.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}>
            {s.icon} {s.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi! Ask me about GDPR, WCAG, or cookie compliance 🔍" }
  ]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg }],
          system: "You are ComplyBuddy, an AI compliance assistant. Answer questions about GDPR, WCAG, CCPA, cookie law, and website compliance. Be concise and actionable."
        })
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: "bot", text: data.text || data.content || "Let me check that for you..." }]);
    } catch {
      setMsgs(m => [...m, { role: "bot", text: "Sorry, I'm having trouble connecting right now." }]);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ position: "fixed", bottom: 24, right: 24, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(99,102,241,0.5)", zIndex: 1000, fontSize: 20 }}
      >
        {open ? "✕" : "💬"}
      </motion.button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{ position: "fixed", bottom: 88, right: 24, width: 320, height: 420, background: "rgba(10,15,30,0.97)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, display: "flex", flexDirection: "column", zIndex: 1000, overflow: "hidden", backdropFilter: "blur(20px)" }}
        >
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.2)", fontSize: 13, fontWeight: 700, color: "#f8fafc" }}>ComplyBuddy Assistant</div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)", padding: "8px 12px", borderRadius: 10, fontSize: 12, color: "rgba(248,250,252,0.85)", maxWidth: "85%" }}>{m.text}</div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(99,102,241,0.2)", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about compliance..." style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#f8fafc", outline: "none" }} />
            <button onClick={send} style={{ background: "#6366f1", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#fff", cursor: "pointer" }}>→</button>
          </div>
        </motion.div>
      )}
    </>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem('cb_cookies_ok');
    if (!accepted) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, padding: '12px 24px', background: 'rgba(10,22,40,0.96)', borderTop: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', maxWidth: 600, lineHeight: 1.5 }}>
        We use essential cookies to keep the scanner working. No tracking cookies, no third-party advertising.{' '}
        <a style={{ color: '#a5b4fc', textDecoration: 'underline', cursor: 'pointer' }}>Cookie policy</a>
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => { localStorage.setItem('cb_cookies_ok', '1'); setVisible(false); }}
          style={{ fontSize: 12, fontWeight: 700, padding: '7px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Accept
        </button>
        <button onClick={() => setVisible(false)}
          style={{ fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
          Decline
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
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
        .cb-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:54px;background:rgba(10,15,30,0.92);border-bottom:1px solid rgba(99,102,241,0.12);backdrop-filter:blur(20px)}
        .cb-nav-logo{font-size:15px;font-weight:900;letter-spacing:-0.5px;color:#fff;display:flex;align-items:center;gap:8px}
        .cb-nav-links{display:flex;align-items:center;gap:24px}
        .cb-nav-link{font-size:13px;color:rgba(255,255,255,0.4);font-weight:500;cursor:pointer;border:none;background:none;transition:color 0.15s}
        .cb-nav-link:hover{color:rgba(255,255,255,0.75)}
        .cb-nav-cta{font-size:12px;font-weight:700;padding:7px 16px;border-radius:7px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;cursor:pointer;letter-spacing:0.01em;transition:opacity 0.15s}
        .cb-nav-cta:hover{opacity:0.88}
        @media(max-width:640px){
          .cb-nav-links{display:none}
          .cb-hero-h1{font-size:1.9rem!important;line-height:1.1!important}
          .cb-hero-right{display:none!important}
          .cb-pricing-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#0a0f1e' }}>
        <AnimatedBg />

        {/* NAV */}
        <nav className="cb-nav">
          <div className="cb-nav-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Comply<span style={{ color: '#a5b4fc' }}>Buddy</span></span>
          </div>
          <div className="cb-nav-links">
            <button className="cb-nav-link" onClick={() => document.getElementById('scan-input')?.scrollIntoView({ behavior: 'smooth' })}>Scanner</button>
            <button className="cb-nav-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</button>
            <button className="cb-nav-link" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Pricing</button>
            <button className="cb-nav-cta" onClick={() => document.getElementById('scan-input')?.focus()}>Try free</button>
          </div>
        </nav>

        {/* ── HERO — 2-col ── */}
        <section className="relative z-10 pt-12 pb-4 px-5 max-w-5xl mx-auto w-full">
          <div className="flex items-start gap-8">

            {/* Left col — 60% */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 6px rgba(52,211,153,0.9)' }} />
                  AI-powered compliance scanner
                </div>

                <h1 className="cb-hero-h1 font-black text-white leading-[1.07] mb-3"
                  style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}>
                  Scan any content for<br />
                  <span style={{ background: 'linear-gradient(95deg,#6366f1 0%,#a5b4fc 55%,#8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    compliance violations
                  </span>
                  {" "}in seconds
                </h1>

                <p className="text-slate-400 text-[14px] max-w-md leading-relaxed mb-4">
                  GDPR · WCAG · CCPA · Cookie law · Privacy policy gaps — found in &lt; 30s
                </p>

                {/* Standards chips */}
                <div id="compliance-standards" className="flex flex-wrap items-center gap-1.5 mb-5">
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
                      className="w-full flex items-center justify-center gap-2 font-bold text-[14px] text-white px-6 py-3 rounded-xl transition-all disabled:opacity-35 disabled:cursor-not-allowed"
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
              </motion.div>
            </div>

            {/* Right col — 40%, hidden on mobile */}
            <div className="cb-hero-right w-[38%] shrink-0 pt-12">
              <MockComplianceCard />
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
                className="text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap transition-all"
                style={{ border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc', background: 'transparent' }}>
                New Scan →
              </button>
            </div>
            <AdUnit size="banner" />
          </motion.div>
        )}

        {/* HOW IT WORKS — 3-step with stagger */}
        <motion.section
          id="how-it-works"
          className="relative z-10 max-w-5xl mx-auto px-5 py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2 text-center" style={{ color: '#6366f1' }}>How it works</p>
          <h2 className="text-[22px] font-black text-white text-center mb-8" style={{ letterSpacing: '-0.025em' }}>Three steps to compliance clarity</h2>

          <div className="grid sm:grid-cols-3 gap-4 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden sm:block absolute top-8 left-[16.6%] right-[16.6%] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.15), rgba(99,102,241,0.4), rgba(99,102,241,0.15))' }} />

            {[
              { num: "①", title: "Paste your content", desc: "Any social post, ad copy, email, or website text — up to 2,000 words.", icon: "📋" },
              { num: "②", title: "AI scans 40+ rules", desc: "Checks against GDPR, FTC, WCAG, CCPA and more in under 5 seconds.", icon: "🔍" },
              { num: "③", title: "Fix with one click", desc: "Each issue shows severity, which law applies, and exactly how to fix it.", icon: "✅" },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="rounded-xl p-5 relative text-center"
                style={{ background: 'rgba(15,17,28,0.8)', border: '1px solid rgba(99,102,241,0.12)' }}
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="text-[11px] font-mono font-bold mb-1" style={{ color: '#6366f1' }}>{item.num}</div>
                <h3 className="font-bold text-white text-[13px] mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PRICING */}
        <motion.section
          id="pricing"
          className="relative z-10 max-w-5xl mx-auto px-5 pb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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
              <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
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
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                {isPro ? "You're on Pro" : checkingOut ? 'Redirecting…' : 'Get Pro — $9/mo →'}
              </button>
            </div>
          </div>
        </motion.section>

        {/* AD + FOOTER */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 mb-8">
          <AdUnit size="banner" />
        </div>

        <footer className="relative z-10 border-t" style={{ borderColor: 'rgba(99,102,241,0.1)', padding: '24px 24px 20px', marginTop: 8 }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Comply<span style={{ color: '#a5b4fc' }}>Buddy</span>
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
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Legal</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Privacy policy', 'Cookie policy', 'Terms'].map(l => (
                      <a key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', cursor: 'pointer' }}>{l}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(99,102,241,0.1)' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
                {`© ${new Date().getFullYear()} ComplyBuddy. For informational use only — not legal advice.`}
              </p>
            </div>
          </div>
        </footer>

        <CookieBanner />
        <FloatingChat />
        <GuidedTour steps={COMPLY_TOUR} storageKey="complybuddy_tour_v1" accentColor="#6366f1" />
      </div>
    </>
  );
}
