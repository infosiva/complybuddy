"use client";

import { useMagicAuth, getStoredUser, isLoggedIn } from "@/lib/auth/useMagicAuth";
export { useMagicAuth, getStoredUser, isLoggedIn };

export const SITE_CONFIG = {
  name: "ComplyScan",
  site: "complyscan",
  accentColor: "#6366f1",
  freeLimit: 3,
  freeFeature: "free compliance scans",
  lockedFeature: "unlimited scans + detailed reports",
};

export const AFFILIATES = [
  {
    name: "Grammarly",
    tagline: "Write compliant, clear content with AI writing checks",
    cta: "Try Free →",
    color: "#15803d",
    icon: "✍️",
    url: "https://grammarly.com/?affiliate=siva",
  },
  {
    name: "Notion",
    tagline: "Document your compliance policies and audit trails",
    cta: "Try Notion →",
    color: "#000000",
    icon: "📝",
    url: "https://notion.so/?affiliate=siva",
  },
  {
    name: "Canva",
    tagline: "Create compliant marketing visuals with built-in guides",
    cta: "Design Free →",
    color: "#7c3aed",
    icon: "🎨",
    url: "https://canva.com/?affiliate=siva",
  },
];
