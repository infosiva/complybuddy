// components/HeroSection.tsx — server component
import { getContentOverrides } from '@/lib/content'
import HeroClient from './HeroClient'

export default async function HeroSection() {
  const overrides = await getContentOverrides()
  return (
    <section className="relative px-4 sm:px-6 pt-6 pb-10 max-w-4xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <HeroClient overrides={overrides} />
      </div>
    </section>
  )
}
