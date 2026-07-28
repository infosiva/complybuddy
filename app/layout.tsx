import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import Footer from '../components/Footer'
import DesignEffects from '@/components/DesignEffects'
import AuthButton from '@/components/AuthButton'
import AffiliateStrip from '@/components/AffiliateStrip'
import type { BrandConfig } from '@/components/SharedNavbar'
import CookieConsent from "../components/CookieConsent"
import ChatBot from '@/components/ChatBot'
import SchemaOrg from '@/components/SchemaOrg'
import BackToTop from '@/components/BackToTop'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import FeedbackWidget from '@/components/FeedbackWidget'
import { loadSiteTheme, buildThemeStyleTag, isWidgetHidden } from '@/lib/theme-loader'

const brand: BrandConfig = {
  name: 'ComplyBuddy',
  tagline: 'AI compliance checker — GDPR, FTC, copyright issues caught before they cost you.',
  icon: '⚖️',
  color: '#2563eb',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await loadSiteTheme('complybuddy')

  const themeCSS = buildThemeStyleTag(theme, {
    background: '#ffffff',
    primary: '#2563eb',
    secondary: '#1d4ed8',
  })

  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <SchemaOrg />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: #2563eb;
            --theme-secondary: #1d4ed8;
            --theme-base: #ffffff;
            --background: #ffffff;
            --surface-1: #f8fafc;
            --surface-2: #e2e8f0;
            --foreground: #1e3a8a;
            --text-2: #2563eb;
            --border-default: rgba(37,99,235,0.15);
            --border-strong: rgba(37,99,235,0.3);
            --radius: 0.375rem;
            --radius-lg: 0.5rem;
          }
          html, body { background: #ffffff !important; color: #1e3a8a !important; }
          body { font-family: 'IBM Plex Sans', system-ui, sans-serif !important; }
          h1, h2, h3 { font-weight: 600 !important; letter-spacing: -0.01em; }
          ${themeCSS}
        ` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176" crossOrigin="anonymous" strategy="lazyOnload" />
        <DesignEffects />
        <SharedNavbar brand={brand} authSlot={<AuthButton />} />
        <main className="flex-1 pt-16">{children}</main>
        <AffiliateStrip />
        <Footer siteName="ComplyBuddy" />
        {!isWidgetHidden(theme, 'chatbot') && <ChatBot />}
        {!isWidgetHidden(theme, 'backToTop') && <BackToTop accentColor="#2563eb" />}
        {!isWidgetHidden(theme, 'cookieConsent') && <CookieConsent />}
        <FloatingChatWrapper />
        <FeedbackWidget siteName="ComplyBuddy" accentColor="#2563eb" accentColor2="#1d4ed8" position="left" />
      </body>
    </html>
  )
}
