'use client'

import { useState } from 'react'
import Link from 'next/link'

const PILLS = ['GDPR', 'Terms of Service', 'NDA', 'Privacy Policy', 'Employment', 'Contract']

const SAMPLE_CLAUSES = [
  { text: 'Provider may share your data with third parties without notice.', risk: 'high', label: 'Data sharing' },
  { text: 'All disputes shall be resolved by binding arbitration.', risk: 'medium', label: 'Arbitration' },
  { text: 'Service may be terminated at any time without refund.', risk: 'high', label: 'Termination' },
]

const STEPS = [
  { n: '1', title: 'Paste clause', desc: 'Any legal text — contracts, terms, NDAs' },
  { n: '2', title: 'AI scans', desc: 'GPT-4 flags risk clauses in seconds' },
  { n: '3', title: 'Risk score', desc: 'Clear verdict: Safe / Review / High Risk' },
]

const FREE_FEATURES = ['10 scans / month', 'GDPR + Terms analysis', 'Risk score + highlights', 'Plain-English summary']
const PRO_FEATURES = ['Unlimited scans', 'All clause types', 'Export PDF report', 'Priority support', 'Team access']

export default function HomePage() {
  const [activeType, setActiveType] = useState('GDPR')
  const [text, setText] = useState('')
  const [activeTab, setActiveTab] = useState('Scope')

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex h-[52px] items-center justify-between border-b border-white/[0.07] bg-[#0a0a0f]/90 px-5 backdrop-blur-xl">
        <span className="text-[16px] font-black tracking-tight">
          Comply<span className="text-violet-400">Scan</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-[12px] text-white/40 hover:text-white sm:block transition-colors">Log in</Link>
          <Link
            href="/login"
            className="rounded-lg bg-violet-700 px-3.5 py-1.5 text-[12px] font-bold text-white transition-all duration-150 hover:bg-violet-600 active:scale-[0.97]"
          >
            Start free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 pt-14 pb-10 lg:grid-cols-2 lg:gap-12 lg:pt-16">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span className="text-[11px] font-semibold text-violet-300">AI-powered legal risk scanner</span>
          </div>
          <h1 className="mb-3 text-[clamp(28px,4.5vw,48px)] font-black leading-[1.05] tracking-tight text-white">
            Paste any clause.<br />
            <span className="text-violet-400">Know your legal risk</span><br />
            in 60 seconds.
          </h1>
          <p className="mb-6 text-[14px] leading-relaxed text-white/50">
            GDPR, NDAs, employment contracts, privacy policies — paste any legal text and get an instant risk assessment in plain English.
          </p>
          {/* Scan input */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste any legal clause here… e.g. 'The Company may collect and share your personal data with third-party partners for marketing purposes.'"
              className="h-28 w-full resize-none bg-transparent text-[13px] text-white/80 placeholder-white/25 outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-white/30">{text.length} chars</span>
              <Link
                href={text.length > 10 ? `/scan?q=${encodeURIComponent(text)}` : '/login'}
                className="rounded-lg bg-violet-600 px-5 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:bg-violet-500 active:scale-[0.97]"
              >
                Scan now →
              </Link>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-white/25">Free — 10 scans/month, no credit card</p>
        </div>

        {/* Right — sample output card */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[380px] rounded-2xl border border-white/[0.08] bg-[#0d0b1a] p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-bold text-white/60">Risk Analysis</span>
              <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-black text-red-400">HIGH RISK</span>
            </div>
            {/* Score bar */}
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-[10px] text-white/30">
                <span>Risk score</span><span className="font-bold text-red-400">78 / 100</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
              </div>
            </div>
            {/* Flagged clauses */}
            <div className="space-y-2">
              {SAMPLE_CLAUSES.map(c => (
                <div
                  key={c.text}
                  className={`rounded-lg border px-3 py-2 ${
                    c.risk === 'high'
                      ? 'border-red-500/20 bg-red-500/10'
                      : 'border-yellow-500/20 bg-yellow-500/10'
                  }`}
                >
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className={`text-[9px] font-black uppercase ${c.risk === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {c.risk === 'high' ? 'High Risk' : 'Review'}
                    </span>
                    <span className="text-[9px] text-white/30">· {c.label}</span>
                  </div>
                  <p className="text-[11px] leading-snug text-white/60">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/40">
              <span className="font-bold text-white/60">Summary: </span>
              This contract contains 2 high-risk clauses. Data sharing without notice and no-refund termination violate GDPR Article 13.
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER PILLS ── */}
      <div className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
          <span className="shrink-0 text-[11px] font-semibold text-white/30">Filter by type:</span>
          {PILLS.map(p => (
            <button
              key={p}
              onClick={() => setActiveType(p)}
              className={`shrink-0 rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all duration-150 ${
                activeType === p
                  ? 'bg-violet-600 text-white'
                  : 'border border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-violet-500/40 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-violet-400">How it works</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-[#0d0b1a] p-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-[13px] font-black text-violet-400">
                {s.n}
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-white">{s.title}</h3>
                <p className="mt-0.5 text-[12px] text-white/40">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block absolute" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="mx-auto max-w-3xl px-5 pb-10">
        <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-violet-400">Pricing</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d0b1a] p-6">
            <div className="mb-1 text-[13px] font-black text-white">Free</div>
            <div className="mb-4 text-[32px] font-black tracking-tight text-white">
              $0 <span className="text-[14px] font-normal text-white/30">/ month</span>
            </div>
            <div className="space-y-2">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-white/60">
                  <span className="text-violet-400">✓</span> {f}
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="mt-5 block rounded-xl border border-white/[0.08] bg-white/[0.05] py-2.5 text-center text-[13px] font-bold text-white/60 transition-all duration-150 hover:border-white/20 hover:text-white active:scale-[0.97]"
            >
              Start free →
            </Link>
          </div>
          {/* Pro */}
          <div className="relative rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-700 p-6">
            <div className="absolute -top-3 right-5 rounded-full bg-green-400 px-3 py-0.5 text-[10px] font-black text-black">
              Popular
            </div>
            <div className="mb-1 text-[13px] font-black text-white">Pro</div>
            <div className="mb-4 text-[32px] font-black tracking-tight text-white">
              $9 <span className="text-[14px] font-normal text-white/50">/ month</span>
            </div>
            <div className="space-y-2">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-white/80">
                  <span className="text-white/60">✓</span> {f}
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="mt-5 block rounded-xl bg-white/90 py-2.5 text-center text-[13px] font-black text-violet-700 transition-all duration-150 hover:bg-white active:scale-[0.97]"
            >
              Start Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.07] px-5 py-5 text-center text-[11px] text-white/30">
        <span className="mr-3 font-black text-white/60">Comply<span className="text-violet-400">Scan</span></span>
        © {new Date().getFullYear()} ·{' '}
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link> ·{' '}
        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
      </footer>
    </div>
  )
}
