import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
