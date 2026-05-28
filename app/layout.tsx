import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import Footer from '../components/Footer'
import DesignEffects from '@/components/DesignEffects'
import AuthButton from '@/components/AuthButton'
import AffiliateStrip from '@/components/AffiliateStrip'
import type { BrandConfig } from '@/components/SharedNavbar'
import CookieConsent from "../components/CookieConsent";
import ChatBot from '@/components/ChatBot'
import SchemaOrg from '@/components/SchemaOrg'
import BackToTop from '@/components/BackToTop'

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
  title: 'ComplyBuddy — AI Compliance Scanner for GDPR, ADA & FTC',
  description: 'Paste any content and AI instantly checks for GDPR, ADA, FTC, and legal compliance issues. Free compliance scanner — no sign-up required.',
  keywords: ['compliance scanner', 'GDPR compliance', 'FTC disclosure', 'ADA compliance', 'CCPA checker', 'privacy policy scanner', 'cookie compliance'],
  metadataBase: new URL('https://complyscan.app'),
  openGraph: { title: 'ComplyBuddy — AI Compliance Scanner', description: 'Paste any content and AI instantly checks for GDPR, ADA, FTC, and legal issues. Free, no sign-up.', type: 'website', locale: 'en_US', siteName: 'ComplyBuddy', url: 'https://complyscan.app', images: [{ url: '/og.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'ComplyBuddy — AI Compliance Scanner', description: 'GDPR, ADA, FTC compliance check in seconds. Free.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <SchemaOrg />
      
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: #2563eb;
            --theme-secondary: #1d4ed8;
            --theme-base: #020b1a;
            --background: #020b1a;
            --surface-1: #071428;
            --surface-2: #0d2040;
            --foreground: #f8fafc;
            --text-2: #93c5fd;
            --border-default: rgba(37,99,235,0.15);
            --border-strong: rgba(37,99,235,0.3);
            --radius: 0.375rem;
            --radius-lg: 0.5rem;
          }
          body { font-family: 'IBM Plex Sans', system-ui, sans-serif !important; }
          h1, h2, h3 { font-weight: 600 !important; letter-spacing: -0.01em; }
          .glass { background: rgba(2,11,26,0.75) !important; border-color: rgba(37,99,235,0.12) !important; }
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        <div className="grain" aria-hidden />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176" crossOrigin="anonymous" strategy="lazyOnload" />
        <DesignEffects />
        <SharedNavbar brand={brand} authSlot={<AuthButton />} />
        <main className="flex-1 pt-16">{children}</main>
        <AffiliateStrip />
        <Footer siteName="ComplyScan" />
        <script src="http://31.97.56.148:3098/t.js" data-site="complyscan.app" defer></script>
      <ChatBot />
      <BackToTop accentColor="#3b82f6" />
      <CookieConsent />
      </body>
    </html>
  )
}
