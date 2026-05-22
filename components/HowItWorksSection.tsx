'use client'
// components/HowItWorksSection.tsx
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, STAGGER_CONTAINER, useMotionVariants } from '@/lib/motion'

export default function HowItWorksSection() {
  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.15))
  const itemVars      = useMotionVariants(FADE_UP)

  return (
    <section id="how-it-works" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <motion.div
        variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVars as Parameters<typeof motion.div>[0]['variants']} className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">How it works</h2>
          <p className="text-white/40 text-sm">Three steps to compliance clarity</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-white/[0.08]" aria-hidden="true" />

          {siteConfig.howItWorks.map((step) => (
            <motion.div key={step.step} variants={itemVars as Parameters<typeof motion.div>[0]['variants']} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              <div className="text-3xl font-black text-white/10 tabular-nums leading-none">
                {String(step.step).padStart(2, '0')}
              </div>
              <h3 className="text-white font-bold text-base">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
