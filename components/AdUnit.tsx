'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

// Affiliate fallback banners — rotate every 8s if AdSense hasn't loaded
const AFFILIATES = [
  {
    name: 'Hostinger', icon: '🌐', text: 'Web hosting from $2.99/mo',
    url: 'https://hostinger.com?REFERRALCODE=1SIVA75', color: '#673DE6',
    bg: 'rgba(103,61,230,0.10)', border: 'rgba(103,61,230,0.25)', cta: 'Get Hosting →',
  },
  {
    name: 'Namecheap', icon: '🔒', text: 'Domains from $0.99',
    url: 'https://namecheap.com', color: '#DE3723',
    bg: 'rgba(222,55,35,0.10)', border: 'rgba(222,55,35,0.25)', cta: 'Get Domain →',
  },
  {
    name: 'Coursera', icon: '🎓', text: 'Legal & compliance courses',
    url: 'https://coursera.org', color: '#0056D2',
    bg: 'rgba(0,86,210,0.10)', border: 'rgba(0,86,210,0.25)', cta: 'Learn Free →',
  },
]

interface AdUnitProps {
  size?: 'banner' | 'rectangle'
  className?: string
  slot?: string
  format?: string
}

export default function AdUnit({ size = 'rectangle', className = '' }: AdUnitProps) {
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only show ads after element scrolls into view (not on landing)
    let timer: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setShow(true), 500)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -20% 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect(); clearTimeout(timer) }
  }, [])

  useEffect(() => {
    if (!show) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch { /* not loaded yet */ }
  }, [show])

  useEffect(() => {
    // Rotate affiliate fallback
    const t = setInterval(() => setIdx(i => (i + 1) % AFFILIATES.length), 8000)
    return () => clearInterval(t)
  }, [])

  const aff = AFFILIATES[idx]

  if (size === 'banner') {
    return (
      <div ref={ref} className={className}>
        {show && <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4237294630161176"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />}
        {/* Affiliate fallback strip */}
        <a
          href={aff.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 12, marginTop: 8,
            background: aff.bg, border: `1px solid ${aff.border}`,
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 20 }}>{aff.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{aff.name} — {aff.text}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 8, background: aff.color, color: '#fff', whiteSpace: 'nowrap' }}>{aff.cta}</span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>Ad</span>
        </a>
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      {show && <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4237294630161176"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />}
      <a
        href={aff.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 12, marginTop: 8,
          background: aff.bg, border: `1px solid ${aff.border}`,
          textDecoration: 'none',
        }}
      >
        <span style={{ fontSize: 18 }}>{aff.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>{aff.name} — {aff.text}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, padding: '5px 10px', borderRadius: 7, background: aff.color, color: '#fff', whiteSpace: 'nowrap' }}>{aff.cta}</span>
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>Ad</span>
      </a>
    </div>
  )
}
