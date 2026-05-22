'use client'
// components/FinalCTA.tsx — full-width bottom CTA with pulse glow
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, BUTTON_PRESS, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'
import { theme } from '@/lib/theme'
import Link from 'next/link'

export default function FinalCTA() {
  const vars = useMotionVariants(FADE_UP)

  return (
    <section className="py-20 px-4 sm:px-6 border-t border-white/[0.05]">
      <motion.div
        variants={vars as Parameters<typeof motion.div>[0]['variants']}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          {siteConfig.finalCta.headline}
        </h2>
        <p className="text-white/45 text-base">{siteConfig.finalCta.subtext}</p>

        <motion.div {...BUTTON_PRESS} transition={SPRING_CINEMATIC}>
          <Link
            href={siteConfig.finalCta.ctaHref}
            className={`cta-pulse inline-flex items-center justify-center px-10 py-4 rounded-xl bg-gradient-to-r ${theme.gradient} text-white text-base font-bold min-h-[56px] hover:opacity-90 transition-opacity`}
          >
            {siteConfig.finalCta.ctaText}
          </Link>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {siteConfig.freeTier.pills.map(pill => (
            <span key={pill} className={`text-xs font-medium px-3 py-1 rounded-full ${theme.badge}`}>{pill}</span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
