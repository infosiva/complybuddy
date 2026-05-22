// components/HeroSection.tsx — server component
// Static HTML that crawlers read. HeroClient mounts stagger animation on top.
import HeroClient from './HeroClient'

export default function HeroSection() {
  return (
    <section className="relative px-4 sm:px-6 pt-6 pb-10 max-w-4xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <HeroClient />
      </div>
    </section>
  )
}
