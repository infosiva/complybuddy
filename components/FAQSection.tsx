'use client'
// components/FAQSection.tsx — native details/summary accordion (no Radix dependency)
// Content mirrors SchemaOrg JSON-LD — single source of truth in siteConfig.faq
import { siteConfig } from '@/site.config'

export default function FAQSection() {
  return (
    <section id="faq" className="py-14 px-4 sm:px-6 max-w-3xl mx-auto border-t border-white/[0.05]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Frequently asked questions</h2>
        <p className="text-white/40 text-sm">Everything you need to know</p>
      </div>

      <div className="flex flex-col gap-2">
        {siteConfig.faq.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
          >
            <summary className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer list-none">
              {item.q}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/30 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-3"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
