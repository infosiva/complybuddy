'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.23, 1, 0.32, 1] as const

const PILLS = ['GDPR', 'Terms of Service', 'NDA', 'Privacy Policy', 'Employment', 'Contract']

const SAMPLE_CLAUSES = [
  { text: 'Provider may share your data with third parties without notice.', risk: 'high', label: 'Data sharing' },
  { text: 'All disputes shall be resolved by binding arbitration.', risk: 'medium', label: 'Arbitration' },
  { text: 'Service may be terminated at any time without refund.', risk: 'high', label: 'Termination' },
]

const STEPS = [
  { n: '1', title: 'Paste content', desc: 'Any text — ads, terms, social posts, email campaigns' },
  { n: '2', title: 'AI scans', desc: 'Checks GDPR, FTC disclosures, copyright, ADA in seconds' },
  { n: '3', title: 'Fix issues', desc: 'Clear verdict with plain-English fixes for every problem' },
]

const FREE_FEATURES = ['10 scans / month', 'GDPR + FTC + copyright', 'Risk score + highlights', 'Plain-English summary']
const PRO_FEATURES = ['Unlimited scans', 'All compliance types', 'Export PDF report', 'Priority support', 'Team access']

export default function HomePage() {
  const [activeType, setActiveType] = useState('GDPR')
  const [text, setText] = useState('')

  return (
    <div className="min-h-screen text-sky-900" style={{ background: '#f0f9ff' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex h-[52px] items-center justify-between border-b border-sky-200/60 px-5 backdrop-blur-xl" style={{ background: 'rgba(240,249,255,0.9)' }}>
        <span className="text-[16px] font-black tracking-tight text-sky-900">
          Comply<span className="text-sky-600">Buddy</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-[12px] text-sky-500 hover:text-sky-700 sm:block transition-colors">Log in</Link>
          <Link
            href="/#scan"
            className="rounded-lg px-3.5 py-1.5 text-[12px] font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            style={{ background: '#0284c7' }}
          >
            Scan free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 pt-14 pb-10 lg:grid-cols-2 lg:gap-12 lg:pt-16">
        {/* Left */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/60 px-3 py-1" style={{ background: 'rgba(2,132,199,0.08)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#0284c7' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#0284c7' }}>AI-powered compliance scanner</span>
          </div>
          <h1 className="mb-3 font-black leading-[1.05] tracking-tight text-sky-900" style={{ fontSize: 'clamp(28px,4.5vw,48px)' }}>
            Paste any content.<br />
            <span style={{ color: '#0284c7' }}>Know your compliance risk</span><br />
            in 60 seconds.
          </h1>
          <p className="mb-6 text-[14px] leading-relaxed text-sky-700/70">
            GDPR, FTC disclosures, copyright, ADA — paste any text and get an instant compliance check in plain English. Free, no sign-up.
          </p>

          {/* Scan input */}
          <div id="scan" className="rounded-xl border border-sky-200 p-4 shadow-sm" style={{ background: '#fff' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste any content here… ads, social posts, email copy, terms, privacy policies…"
              className="h-28 w-full resize-none bg-transparent text-[13px] text-sky-800 placeholder-sky-400/60 outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-sky-400">{text.length} chars</span>
              <Link
                href={text.length > 10 ? `/scan?q=${encodeURIComponent(text)}` : '/#scan'}
                className="rounded-lg px-5 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
                style={{ background: '#0284c7' }}
              >
                Scan now →
              </Link>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-sky-400">Free — 10 scans/month, no credit card</p>
        </motion.div>

        {/* Right — animated demo panel */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
        >
          <div className="w-full max-w-[380px] rounded-2xl border border-sky-200 p-5 shadow-sm" style={{ background: '#fff' }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-bold text-sky-500">Risk Analysis</span>
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>HIGH RISK</span>
            </div>
            {/* Score bar */}
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-[10px] text-sky-400">
                <span>Compliance score</span><span className="font-bold text-red-500">42 / 100</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#e0f2fe' }}>
                <div className="h-2 rounded-full" style={{ width: '42%', background: 'linear-gradient(to right,#f97316,#ef4444)' }} />
              </div>
            </div>
            {/* Flagged clauses */}
            <div className="space-y-2">
              {SAMPLE_CLAUSES.map(c => (
                <div
                  key={c.text}
                  className="rounded-lg border px-3 py-2"
                  style={{
                    borderColor: c.risk === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                    background: c.risk === 'high' ? 'rgba(239,68,68,0.06)' : 'rgba(234,179,8,0.06)',
                  }}
                >
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase" style={{ color: c.risk === 'high' ? '#dc2626' : '#b45309' }}>
                      {c.risk === 'high' ? 'High Risk' : 'Review'}
                    </span>
                    <span className="text-[9px] text-sky-400">· {c.label}</span>
                  </div>
                  <p className="text-[11px] leading-snug text-sky-700">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-sky-100 p-3 text-[11px] leading-relaxed text-sky-600" style={{ background: '#f0f9ff' }}>
              <span className="font-bold text-sky-800">Summary: </span>
              This content has 2 high-risk compliance issues. Data sharing without notice and arbitration clauses may violate GDPR Article 13 and FTC guidelines.
            </div>
          </div>
        </motion.div>
      </section>

      {/* FILTER PILLS */}
      <div className="border-y border-sky-200/60" style={{ background: 'rgba(224,242,254,0.4)' }}>
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
          <span className="shrink-0 text-[11px] font-semibold text-sky-400">Filter by type:</span>
          {PILLS.map(p => (
            <button
              key={p}
              onClick={() => setActiveType(p)}
              className="shrink-0 rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all duration-150"
              style={
                activeType === p
                  ? { background: '#0284c7', color: '#fff' }
                  : { border: '1px solid rgba(2,132,199,0.2)', background: 'transparent', color: '#0369a1' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="mb-4 text-[11px] font-black uppercase tracking-widest" style={{ color: '#0284c7' }}>How it works</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease }}
              className="flex items-start gap-4 rounded-xl border border-sky-200 p-5 shadow-sm"
              style={{ background: '#fff' }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: '#0284c7' }}>
                {s.n}
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-sky-900">{s.title}</h3>
                <p className="mt-0.5 text-[12px] text-sky-600">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <p className="mb-4 text-[11px] font-black uppercase tracking-widest" style={{ color: '#0284c7' }}>Pricing</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-sky-200 p-6 shadow-sm" style={{ background: '#fff' }}>
            <div className="mb-1 text-[13px] font-black text-sky-900">Free</div>
            <div className="mb-4 text-[32px] font-black tracking-tight text-sky-900">
              $0 <span className="text-[14px] font-normal text-sky-400">/ month</span>
            </div>
            <div className="space-y-2">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-sky-700">
                  <span style={{ color: '#0284c7' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <Link
              href="/#scan"
              className="mt-5 block rounded-xl border border-sky-200 py-2.5 text-center text-[13px] font-bold text-sky-600 transition-all duration-150 hover:border-sky-400 hover:text-sky-800 active:scale-[0.97]"
            >
              Start free →
            </Link>
          </div>
          {/* Pro */}
          <div className="relative rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}>
            <div className="absolute -top-3 right-5 rounded-full bg-emerald-400 px-3 py-0.5 text-[10px] font-black text-black">
              Popular
            </div>
            <div className="mb-1 text-[13px] font-black">Pro</div>
            <div className="mb-4 text-[32px] font-black tracking-tight">
              $9 <span className="text-[14px] font-normal opacity-60">/ month</span>
            </div>
            <div className="space-y-2">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-white/90">
                  <span className="text-white/70">✓</span> {f}
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="mt-5 block rounded-xl bg-white/90 py-2.5 text-center text-[13px] font-black transition-all duration-150 hover:bg-white active:scale-[0.97]"
              style={{ color: '#0369a1' }}
            >
              Start Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-sky-200 px-5 py-5 text-center text-[11px] text-sky-400">
        <span className="mr-3 font-black text-sky-700">Comply<span style={{ color: '#0284c7' }}>Buddy</span></span>
        © {new Date().getFullYear()} ·{' '}
        <Link href="/privacy" className="hover:text-sky-700 transition-colors">Privacy</Link> ·{' '}
        <Link href="/terms" className="hover:text-sky-700 transition-colors">Terms</Link>
      </footer>
    </div>
  )
}
