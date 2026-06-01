// site.config.ts — ComplyBuddy site configuration
// Drives all landing page sections: hero, marquee, how-it-works, features, FAQ, CTAs.

export type HeroVariant = 'split' | 'centered' | 'minimal'

export interface SiteConfig {
  siteName: string
  domain: string
  themeColor: string
  heroBadge: string
  headline: string[]
  subheadline: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary: { text: string; href: string }
  freeTier: {
    pills: string[]
  }
  socialProof: {
    marqueeItems: string[]
  }
  howItWorks: Array<{ step: number; icon: string; title: string; desc: string }>
  features: Array<{ icon: string; title: string; desc: string; size?: 'large' | 'wide' | 'medium'; accent?: string }>
  faq: Array<{ q: string; a: string }>
  finalCta: { headline: string; subtext: string; ctaText: string; ctaHref: string }
  layout: { heroVariant: HeroVariant; sectionOrder: string[]; hideSections: string[] }
  seo: { title: string; description: string; ogImage: string; llmsDescription: string }
  nav: Array<{ label: string; href: string }>
  chatbot: { welcomeMessage: string; botName: string; placeholder: string }
}

export const siteConfig: SiteConfig = {
  siteName:   'ComplyBuddy',
  domain:     'complyscan.app',
  themeColor: 'indigo',

  heroBadge:    'complybuddy · AI compliance scanner · free to scan',
  headline:     ['Paste any clause.', 'Know your legal risk', 'in 60 seconds.'],
  subheadline:  'AI scans contracts, policies, and terms — flags risks in plain English with instant fix suggestions. No lawyer needed.',
  ctaPrimary:   { text: 'Scan My Content Free', href: '#scan-input' },
  ctaSecondary: { text: 'See how it works', href: '#how-it-works' },

  freeTier: {
    pills: ['3 free scans', 'GDPR + ADA + FTC', 'No sign-up'],
  },

  socialProof: {
    marqueeItems: [
      '⚖️ GDPR',
      '🇺🇸 CCPA',
      '♿ ADA/WCAG',
      '📣 FTC',
      '🔒 ISO 27001',
      '🏥 HIPAA',
      '💳 PCI-DSS',
      '🇪🇺 ePrivacy',
      '🍪 Cookie Law',
      '📜 Privacy Policy',
      '🛡️ Data Protection',
      '⚡ Instant Results',
    ],
  },

  howItWorks: [
    { step: 1, icon: '📋', title: 'Paste your content', desc: 'Drop in any policy text, ad copy, website content, or contract — up to 4,000 characters.' },
    { step: 2, icon: '🔍', title: 'AI scans for issues', desc: 'Our AI checks against 40+ compliance rules across GDPR, ADA, FTC, and more in seconds.' },
    { step: 3, icon: '✅', title: 'Get a fix report',   desc: 'Each issue shows severity, which regulation applies, and exactly what to change.' },
  ],

  features: [
    { icon: '🇪🇺', title: 'GDPR Scanning',         desc: 'Detects consent gaps, missing data-processing statements, and right-to-erasure issues. References exact GDPR articles.',  size: 'large', accent: '#3b82f6'  },
    { icon: '♿', title: 'ADA / WCAG 2.1',          desc: 'Flags accessibility barriers in web content and policy text against WCAG 2.1 AA standards.',          size: 'medium', accent: '#06b6d4' },
    { icon: '📣', title: 'FTC Ad Rules',            desc: 'Catches undisclosed sponsorships, misleading claims, and endorsement policy violations before regulators do.', size: 'medium', accent: '#f59e0b' },
    { icon: '🔒', title: 'Privacy Policy AI',       desc: 'Identifies vague language, missing required clauses, and jurisdiction-specific gaps in your privacy disclosures.', size: 'medium', accent: '#8b5cf6' },
    { icon: '🍪', title: 'Cookie Compliance',       desc: 'Scans for missing consent banners, improper cookie classifications, and third-party tracking disclosures.', size: 'wide', accent: '#10b981' },
    { icon: '⚡', title: 'Instant Fix Suggestions', desc: 'Every flagged issue includes the exact regulation clause, severity rating, and a plain-English fix you can copy.',  size: 'medium', accent: '#f43f5e' },
  ],

  faq: [
    { q: 'What regulations does ComplyBuddy check?',
      a: 'ComplyBuddy checks your content against GDPR (EU data privacy), CCPA (California privacy), ADA/WCAG 2.1 (accessibility), FTC advertising rules, and general cookie/privacy policy requirements. Pro unlocks HIPAA, PCI-DSS, ISO 27001, and more.' },
    { q: 'How accurate is the AI compliance scan?',
      a: 'ComplyBuddy provides a strong first-pass audit to catch common issues — missing disclosures, vague consent language, non-compliant claims. It is not a substitute for qualified legal advice, but it catches the majority of everyday compliance gaps quickly.' },
    { q: 'Does ComplyBuddy store my text after scanning?',
      a: 'No. Your pasted content is processed in real-time and not stored. We never retain the text you scan — only anonymous usage metrics are logged for improving the model.' },
    { q: 'Is ComplyBuddy free to use?',
      a: 'Yes — ComplyBuddy gives you 3 free scans per session with no account required. Sign up free to get daily scans. Pro unlocks unlimited scans, all 8 compliance frameworks, PDF audit reports, and team sharing.' },
    { q: 'What content formats does it support?',
      a: 'Paste any plain text: social media posts, ad copy, website landing pages, privacy policies, cookie notices, contracts, or email campaigns. Maximum 4,000 characters per scan on the free tier.' },
  ],

  finalCta: {
    headline: 'Scan your content for free.',
    subtext:  'No account needed. Results in 5 seconds.',
    ctaText:  '⚖️ Run Free Scan →',
    ctaHref:  '#scan-input',
  },

  layout: {
    heroVariant:  'centered',
    sectionOrder: ['hero', 'marquee', 'scanTool', 'howItWorks', 'features', 'faq', 'finalCta'],
    hideSections: [],
  },

  seo: {
    title:       'ComplyBuddy — AI Compliance Scanner for GDPR, ADA & FTC',
    description: 'Paste any content and AI instantly checks for GDPR, ADA, FTC, and legal compliance issues. Free compliance scanner — no sign-up required.',
    ogImage:     '/og.png',
    llmsDescription: 'ComplyBuddy is a free AI-powered compliance scanner at complyscan.app. It checks any pasted content against GDPR, CCPA, ADA/WCAG, FTC rules, cookie law, and privacy policy standards in seconds. Free tier: 3 scans per session, no account needed. Pro: unlimited scans, all 8 frameworks, PDF audit export.',
  },

  nav: [
    { label: 'Home',         href: '/' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Features',     href: '/#features' },
    { label: 'FAQ',          href: '/#faq' },
  ],

  chatbot: {
    welcomeMessage: "I'm ComplyBot. Paste any content and I'll tell you exactly what compliance issues it has — GDPR, FTC, ADA, or cookie law. What would you like me to check?",
    botName:        'ComplyBot',
    placeholder:    'Paste content or ask about a compliance rule…',
  },
}

export default siteConfig
