import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComplyScan — AI Compliance Checker for Social Media & Websites",
  description: "Instantly scan your social media posts, ads, and website content for GDPR, FTC, copyright, and advertising compliance issues. Free AI-powered compliance scanner.",
  keywords: "compliance scanner, GDPR compliance, FTC disclosure, social media compliance, copyright checker, AI compliance tool, complyscan",
  openGraph: {
    title: "ComplyScan — AI Compliance Scanner",
    description: "Scan your content for legal compliance issues in seconds. Free for influencers, small businesses, and marketers.",
    type: "website",
    url: "https://complyscan.app",
  },
};

import SharedFooter from "@/components/SharedFooter";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {children}
        <SharedFooter theme="dark" />
        <script src="http://31.97.56.148:3098/t.js" data-site="complyscan.app" defer></script>
      </body>
    </html>
  );
}
