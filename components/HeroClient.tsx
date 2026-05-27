'use client'
// components/HeroClient.tsx — animated hero copy for ComplyBuddy
import { motion } from 'framer-motion'
import { STAGGER_CONTAINER, FADE_UP, SPRING_CINEMATIC, BUTTON_PRESS, useMotionVariants } from '@/lib/motion'
import { siteConfig } from '@/site.config'
import { theme, btn } from '@/lib/theme'
import { type ContentOverrides } from '@/lib/content'
import Link from 'next/link'

export default function HeroClient({ overrides = {} }: { overrides?: ContentOverrides }) {
  const variants  = useMotionVariants(STAGGER_CONTAINER(0.06))
  const childVars = useMotionVariants(FADE_UP)

  return (
    <motion.div
      variants={variants as Parameters<typeof motion.div>[0]['variants']}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5 items-center text-center"
    >
      {/* Badge */}
      <motion.div variants={childVars as Parameters<typeof motion.div>[0]['variants']}>
        <span className={`badge-glow inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.badge} text-xs font-bold uppercase tracking-widest`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {siteConfig.heroBadge}
        </span>
      </motion.div>

      {/* Headline — each line staggered */}
      <motion.h1
        variants={childVars as Parameters<typeof motion.h1>[0]['variants']}
        className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight"
      >
        {overrides.headline
          ? <span className="block"><span className={theme.gradientText} style={{ filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.45))' }}>{overrides.headline}</span></span>
          : siteConfig.headline.map((line, i) => (
            <span key={i} className="block">
              {i === 1
                ? <span className={theme.gradientText} style={{ filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.45))' }}>{line}</span>
                : <span className="text-white">{line}</span>
              }
            </span>
          ))
        }
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={childVars as Parameters<typeof motion.p>[0]['variants']}
        className="text-white/55 text-base leading-relaxed max-w-lg"
      >
        {overrides.subheadline ?? siteConfig.subheadline}
      </motion.p>

      {/* Free tier pills */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-wrap justify-center gap-2"
      >
        {siteConfig.freeTier.pills.map(pill => (
          <span key={pill} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${theme.badge}`}>{pill}</span>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="flex flex-col sm:flex-row gap-3 justify-center"
        id="hero-cta-row"
      >
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link
            href={siteConfig.ctaPrimary.href}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base font-bold min-h-[52px] hover:opacity-90 transition-opacity cta-pulse"
          >
            {overrides.cta ?? siteConfig.ctaPrimary.text}
          </Link>
        </motion.div>
        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link
            href={siteConfig.ctaSecondary.href}
            className={btn.secondary + ' text-sm px-8 py-4 font-bold min-h-[52px] flex items-center gap-2'}
          >
            {siteConfig.ctaSecondary.text}
          </Link>
        </motion.div>
      </motion.div>

      {/* Static scan result preview card — replaces demo panel for centered layout */}
      <motion.div
        variants={childVars as Parameters<typeof motion.div>[0]['variants']}
        className="mt-2 w-full max-w-sm rounded-2xl p-5 text-left"
        style={{
          background: 'rgba(15,17,28,0.9)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 0 40px rgba(99,102,241,0.1)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
          <span className="text-[11px] font-bold text-white/40 tracking-widest uppercase font-mono">Scan Preview</span>
        </div>

        {/* Score row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg className="absolute w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle cx="24" cy="24" r="19" fill="none" strokeWidth="4" stroke="#f87171"
                strokeDasharray={`${0.35 * 2 * Math.PI * 19} ${2 * Math.PI * 19}`} strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.5))' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-black text-white">68</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-white mb-1">Compliance Score</div>
            <div className="text-[10px] font-mono px-2 py-0.5 rounded-full inline-block"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
              2 ISSUES FOUND
            </div>
          </div>
        </div>

        {/* Example issue */}
        <div className="rounded-lg px-3 py-2 mb-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>HIGH</span>
            <span className="text-[11px] font-bold text-white">Missing consent disclosure</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">GDPR Art. 13 — data processing purpose not stated.</p>
        </div>

        <div className="rounded-lg px-3 py-2"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>MED</span>
            <span className="text-[11px] font-bold text-white">FTC sponsorship not disclosed</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">FTC 16 CFR 255 — add #ad or #sponsored tag.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
