import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComplyBuddy — AI Compliance Checker for Social Media & Websites",
  description: "Instantly check your social media posts, captions, and website content for GDPR, FTC, copyright, and advertising compliance issues. Free AI-powered compliance scanner.",
  keywords: "compliance checker, GDPR compliance, FTC disclosure, social media compliance, copyright checker, AI compliance tool",
  openGraph: {
    title: "ComplyBuddy — AI Compliance Checker",
    description: "Scan your content for legal compliance issues in seconds. Free for influencers, small businesses, and marketers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
