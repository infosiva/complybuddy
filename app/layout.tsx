import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import DesignEffects from '@/components/DesignEffects'
import type { BrandConfig } from '@/components/SharedNavbar'

const brand: BrandConfig = {
  name: 'ComplyScan',
  tagline: 'AI compliance checker — GDPR, FTC, copyright issues caught before they cost you.',
  icon: '🛡️',
  color: '#3b82f6',
  url: 'https://complyscan.app',
  navLinks: [{ label: 'Scan content', href: '/' }],
  cta: { label: 'Scan free →', href: '/' },
}

export const metadata: Metadata = {
  title: 'ComplyScan — AI Compliance Checker',
  description: 'Instantly scan social media posts, ads and website content for GDPR, FTC and copyright compliance issues. Free AI-powered compliance scanner.',
  keywords: ['compliance scanner', 'GDPR compliance', 'FTC disclosure', 'social media compliance', 'copyright checker'],
  openGraph: { title: 'ComplyScan — AI Compliance Checker', description: 'Scan your content for legal compliance issues in seconds.', type: 'website', locale: 'en_GB', siteName: 'ComplyScan', url: 'https://complyscan.app' },
  twitter: { card: 'summary_large_image', title: 'ComplyScan', description: 'AI compliance checker for GDPR, FTC and copyright.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "SoftwareApplication",
          "name": "ComplyScan", "url": brand.url, "description": brand.tagline,
          "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
        })}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176" crossOrigin="anonymous" strategy="lazyOnload" />
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
        <script src="http://31.97.56.148:3098/t.js" data-site="complyscan.app" defer></script>
      </body>
    </html>
  )
}
