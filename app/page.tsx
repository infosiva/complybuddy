'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.23, 1, 0.32, 1] as const

const PILLS = ['GDPR', 'Terms of Service', 'NDA', 'Privacy Policy', 'Employment', 'Contract']

const CHECKLIST_ITEMS = [
  { label: 'GDPR Article 13 — data collection notice', pass: true },
  { label: 'FTC disclosure — material connection', pass: false },
  { label: 'Copyright attribution present', pass: true },
  { label: 'Arbitration clause identified', pass: false },
  { label: 'Data retention period stated', pass: true },
  { label: 'ADA-compliant language', pass: true },
  { label: 'Third-party sharing disclosed', pass: false },
  { label: 'Opt-out mechanism present', pass: true },
]

const STEPS = [
  { n: '1', title: 'Paste content', desc: 'Any text — ads, terms, social posts, email campaigns' },
  { n: '2', title: 'AI scans', desc: 'Checks GDPR, FTC disclosures, copyright, ADA in seconds' },
  { n: '3', title: 'Fix issues', desc: 'Clear verdict with plain-English fixes for every problem' },
]

const FREE_FEATURES = ['10 scans / month', 'GDPR + FTC + copyright', 'Risk score + highlights', 'Plain-English summary']
const PRO_FEATURES = ['Unlimited scans', 'All compliance types', 'Export PDF report', 'Priority support', 'Team access']

type ScanResult = {
  overallScore: number
  verdict: string
  summary: string
  issues: Array<{ severity: 'high' | 'medium' | 'low'; category: string; description: string; fix: string; law: string }>
  positives: string[]
  checkedFor: string[]
} | null

export default function HomePage() {
  const [activeType, setActiveType] = useState('GDPR')
  const [text, setText] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult>(null)
  const [error, setError] = useState('')
  const [checkedCount, setCheckedCount] = useState(0)
  const prefersReduced = useReducedMotion()

  // Animate compliance checklist items ticking in
  useEffect(() => {
    if (result) return // once user has real result, keep it
    const interval = setInterval(() => {
      setCheckedCount(n => {
        if (n >= CHECKLIST_ITEMS.length) {
          clearInterval(interval)
          return n
        }
        return n + 1
      })
    }, prefersReduced ? 0 : 400)
    return () => clearInterval(interval)
  }, [result, prefersReduced])

  // Reset animation loop
  useEffect(() => {
    if (result) return
    if (checkedCount >= CHECKLIST_ITEMS.length) {
      const t = setTimeout(() => setCheckedCount(0), prefersReduced ? 0 : 1200)
      return () => clearTimeout(t)
    }
  }, [checkedCount, result, prefersReduced])

  const handleScan = useCallback(async () => {
    if (text.trim().length < 10) return
    setScanning(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, contentType: activeType }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(`Scan failed: ${msg}. Try again.`)
    } finally {
      setScanning(false)
    }
  }, [text, activeType])

  return (
    <div className="min-h-screen text-blue-900" style={{ background: '#ffffff' }}>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 pt-8 pb-10 lg:grid-cols-2 lg:gap-12 lg:pt-10">
        {/* Left */}
        <motion.div
          className="flex flex-col justify-center"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-300/60 px-3 py-1" style={{ background: 'rgba(37,99,235,0.08)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#2563eb' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#2563eb' }}>AI-powered compliance scanner</span>
          </div>
          <h1 className="mb-3 font-black leading-[1.05] tracking-tight text-blue-900" style={{ fontSize: 'clamp(28px,4.5vw,48px)' }}>
            Paste any content.<br />
            <span style={{ color: '#2563eb' }}>Know your compliance risk</span><br />
            in 60 seconds.
          </h1>
          <p className="mb-6 text-[14px] leading-relaxed text-blue-700/70">
            GDPR, FTC disclosures, copyright, ADA — paste any text and get an instant compliance check in plain English. Free, no sign-up.
          </p>

          {/* Scan input */}
          <div id="scan" className="rounded-xl border border-blue-200 p-4 shadow-sm" style={{ background: '#fff' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste any content here… ads, social posts, email copy, terms, privacy policies…"
              className="h-28 w-full resize-none bg-transparent text-[13px] text-blue-800 placeholder-blue-400/60 outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-blue-400">{text.length} chars</span>
              <button
                onClick={handleScan}
                disabled={scanning || text.trim().length < 10}
                className="rounded-lg px-5 py-2 text-[13px] font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#2563eb' }}
              >
                {scanning ? 'Scanning…' : 'Scan now →'}
              </button>
            </div>
            {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
          </div>
          <p className="mt-2 text-[11px] text-blue-400">Free — 10 scans/month, no credit card</p>
        </motion.div>

        {/* Right — animated compliance checklist / scan result */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
        >
          {result ? (
            /* Real scan result */
            <div className="w-full max-w-[380px] rounded-2xl border border-blue-200 p-5 shadow-sm" style={{ background: '#fff' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-bold text-blue-500">Scan Result</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-black"
                  style={result.overallScore >= 70
                    ? { background: 'rgba(16,185,129,0.1)', color: '#059669' }
                    : result.overallScore >= 40
                    ? { background: 'rgba(234,179,8,0.1)', color: '#b45309' }
                    : { background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}
                >
                  {result.overallScore >= 70 ? 'LOW RISK' : result.overallScore >= 40 ? 'MEDIUM RISK' : 'HIGH RISK'}
                </span>
              </div>
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-[10px] text-blue-400">
                  <span>Compliance score</span>
                  <span className="font-bold" style={{ color: result.overallScore >= 70 ? '#059669' : result.overallScore >= 40 ? '#b45309' : '#dc2626' }}>
                    {result.overallScore} / 100
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#e2e8f0' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${result.overallScore}%`,
                      background: result.overallScore >= 70 ? '#10b981' : result.overallScore >= 40 ? 'linear-gradient(to right,#f97316,#eab308)' : 'linear-gradient(to right,#f97316,#ef4444)',
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {result.issues.map((issue, i) => (
                  <div
                    key={i}
                    className="rounded-lg border px-3 py-2"
                    style={{
                      borderColor: issue.severity === 'high' ? 'rgba(239,68,68,0.2)' : issue.severity === 'medium' ? 'rgba(234,179,8,0.2)' : 'rgba(16,185,129,0.2)',
                      background: issue.severity === 'high' ? 'rgba(239,68,68,0.06)' : issue.severity === 'medium' ? 'rgba(234,179,8,0.06)' : 'rgba(16,185,129,0.06)',
                    }}
                  >
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase" style={{ color: issue.severity === 'high' ? '#dc2626' : issue.severity === 'medium' ? '#b45309' : '#059669' }}>
                        {issue.severity}
                      </span>
                      <span className="text-[9px] text-blue-400">· {issue.category}</span>
                    </div>
                    <p className="text-[11px] leading-snug text-blue-700">{issue.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-blue-100 p-3 text-[11px] leading-relaxed text-blue-600" style={{ background: '#ffffff' }}>
                <span className="font-bold text-blue-800">Summary: </span>
                {result.summary}
              </div>
              <button
                onClick={() => { setResult(null); setCheckedCount(0) }}
                className="mt-3 w-full rounded-lg border border-blue-200 py-1.5 text-[11px] text-blue-500 hover:border-blue-400 hover:text-blue-700 transition-all duration-150 active:scale-[0.97]"
              >
                New scan
              </button>
            </div>
          ) : (
            /* Animated compliance checklist demo */
            <div className="w-full max-w-[380px] rounded-2xl border border-blue-200 p-5 shadow-sm" style={{ background: '#fff' }}>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-bold text-blue-500">Compliance Checklist</span>
                <span className="rounded-full border border-blue-200 px-2.5 py-0.5 text-[10px] text-blue-400">
                  Live scan
                </span>
              </div>
              <div className="space-y-2.5">
                {CHECKLIST_ITEMS.map((item, i) => {
                  const visible = i < checkedCount
                  return (
                    <motion.div
                      key={item.label}
                      initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-black transition-all duration-300"
                        style={visible
                          ? item.pass
                            ? { background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' }
                            : { background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)' }
                          : { background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', color: 'transparent' }}
                      >
                        {visible ? (item.pass ? '✓' : '✗') : ''}
                      </span>
                      <span className={`text-[12px] leading-snug transition-colors duration-300 ${visible ? 'text-blue-800' : 'text-blue-300'}`}>
                        {item.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-4 h-1 rounded-full" style={{ background: '#e2e8f0' }}>
                <motion.div
                  className="h-1 rounded-full"
                  style={{ background: '#2563eb' }}
                  animate={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }}
                  transition={{ duration: 0.3, ease }}
                />
              </div>
              <p className="mt-2 text-[10px] text-blue-400 text-right">
                {checkedCount} / {CHECKLIST_ITEMS.length} checks
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* FILTER PILLS */}
      <div className="border-y border-blue-200/60" style={{ background: 'rgba(224,242,254,0.4)' }}>
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
          <span className="shrink-0 text-[11px] font-semibold text-blue-400">Filter by type:</span>
          {PILLS.map(p => (
            <button
              key={p}
              onClick={() => setActiveType(p)}
              className="shrink-0 rounded-full px-3.5 py-1 text-[12px] font-semibold transition-all duration-150 active:scale-[0.97]"
              style={
                activeType === p
                  ? { background: '#2563eb', color: '#fff' }
                  : { border: '1px solid rgba(37,99,235,0.2)', background: 'transparent', color: '#1d4ed8' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="mb-4 text-[11px] font-black uppercase tracking-widest" style={{ color: '#2563eb' }}>How it works</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease }}
              className="flex items-start gap-4 rounded-xl border border-blue-200 p-5 shadow-sm"
              style={{ background: '#fff' }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white" style={{ background: '#2563eb' }}>
                {s.n}
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-blue-900">{s.title}</h3>
                <p className="mt-0.5 text-[12px] text-blue-600">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <p className="mb-4 text-[11px] font-black uppercase tracking-widest" style={{ color: '#2563eb' }}>Pricing</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-blue-200 p-6 shadow-sm" style={{ background: '#fff' }}>
            <div className="mb-1 text-[13px] font-black text-blue-900">Free</div>
            <div className="mb-4 text-[32px] font-black tracking-tight text-blue-900">
              $0 <span className="text-[14px] font-normal text-blue-400">/ month</span>
            </div>
            <div className="space-y-2">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[12px] text-blue-700">
                  <span style={{ color: '#2563eb' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a
              href="#scan"
              className="mt-5 block rounded-xl border border-blue-200 py-2.5 text-center text-[13px] font-bold text-blue-600 transition-all duration-150 hover:border-blue-400 hover:text-blue-800 active:scale-[0.97]"
            >
              Start free →
            </a>
          </div>
          {/* Pro */}
          <div className="relative rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
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
              style={{ color: '#1d4ed8' }}
            >
              Start Pro →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-200 px-5 py-5 text-center text-[11px] text-blue-400">
        <span className="mr-3 font-black text-blue-700">Comply<span style={{ color: '#2563eb' }}>Buddy</span></span>
        © {new Date().getFullYear()} ·{' '}
        <Link href="/privacy" className="hover:text-blue-700 transition-colors">Privacy</Link> ·{' '}
        <Link href="/terms" className="hover:text-blue-700 transition-colors">Terms</Link>
      </footer>
    </div>
  )
}
