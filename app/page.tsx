// app/page.tsx — SERVER COMPONENT (no 'use client')
// Assembles landing page sections in order.
// Crawlers read plain HTML from every server component.
// ScanTool is a client component but is wrapped cleanly.
import { Suspense } from 'react'
import HeroSection       from '@/components/HeroSection'
import MarqueeBar        from '@/components/MarqueeBar'
import ScanTool          from '@/components/ScanTool'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesGrid      from '@/components/FeaturesGrid'
import FAQSection        from '@/components/FAQSection'
import FinalCTA          from '@/components/FinalCTA'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <MarqueeBar />
      <Suspense fallback={<div className="h-96" />}>
        <ScanTool />
      </Suspense>
      <HowItWorksSection />
      <Suspense fallback={<div className="h-96" />}>
        <FeaturesGrid />
      </Suspense>
      <FAQSection />
      <FinalCTA />
    </div>
  )
}
