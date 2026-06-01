'use client'
// components/FeaturesGrid.tsx — bento layout, whileInView stagger, blur-in
import { motion } from 'framer-motion'
import { siteConfig } from '@/site.config'
import { FADE_UP, STAGGER_CONTAINER, CARD_HOVER, SPRING_CINEMATIC, useMotionVariants } from '@/lib/motion'

export default function FeaturesGrid() {
  const containerVars = useMotionVariants(STAGGER_CONTAINER(0.1))
  const itemVars      = useMotionVariants(FADE_UP)

  return (
    <section id="features" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white mb-2">Everything you need</h2>
        <p className="text-white/40 text-sm">Comprehensive compliance coverage — free to start</p>
      </div>

      <motion.div
        variants={containerVars as Parameters<typeof motion.div>[0]['variants']}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4"
      >
        {siteConfig.features.map((f) => {
          const isLarge = f.size === 'large'
          const isWide  = f.size === 'wide'
          return (
            <motion.div
              key={f.title}
              variants={itemVars as Parameters<typeof motion.div>[0]['variants']}
              {...CARD_HOVER}
              transition={SPRING_CINEMATIC}
              style={{
            background: f.accent ? `linear-gradient(135deg, ${f.accent}0d 0%, rgba(255,255,255,0.02) 100%)` : undefined,
            borderColor: f.accent ? `${f.accent}25` : undefined,
          }}
          className={`rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 flex flex-col gap-3 cursor-default select-none
                ${isLarge ? 'md:col-span-1 md:row-span-2' : ''}
                ${isWide  ? 'sm:col-span-2 md:col-span-2' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`${isLarge ? 'text-4xl' : 'text-2xl'}`}>{f.icon}</span>
                {f.accent && <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${f.accent}40, transparent)` }} />}
              </div>
              <div className={`font-bold text-white ${isLarge ? 'text-lg' : 'text-sm'}`}>{f.title}</div>
              <div className={`text-white/50 leading-relaxed ${isLarge ? 'text-sm' : 'text-xs'}`}>{f.desc}</div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
