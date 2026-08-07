"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

// ponytail: AdSense flagged "ads on screens without publisher content" —
// skip loading Auto Ads on thin pages (about/contact) rather than building
// a page-level ad-density config. Add more paths here if AdSense flags them.
const NO_ADS_PATHS = ["/about", "/contact"];

export default function AdsScript() {
  const pathname = usePathname();
  if (NO_ADS_PATHS.includes(pathname)) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
