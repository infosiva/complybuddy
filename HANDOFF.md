
## Design lock (2026-10-06, wave 4)
- Archetype: directory-marketplace (hand-scored, pickArchetype not executed)
- Accent: #4338ca (indigo), secondary #3730a3; bg neutral white. Registered in design-system/tokens/palette-registry.json
- Logo: shield+check, app/icon.svg + public/logo.svg; navbar "Comply" + accent "Buddy"
- Theme: lib/theme-loader.ts wired in layout (loadSiteTheme/buildThemeStyleTag/buildGa4Snippet); GA4 off without ID
- Removed: http:// t.js tracker; app/icon.tsx renamed to .bak
- Open: http://31.97.56.148 server fetches in api/stats, pro-status, webhook, lib/*/useMagicAuth (need https endpoint); AdSense id public


## OWASP LLM Top 10 dispositions (gate item 45, 2026-10-07; list recalled from memory, unverified)
- LLM01 prompt injection: lib/guard.ts present, NOT yet wired into routes; no output filtering or tool sandbox review done. PARTIAL.
- LLM02 sensitive info disclosure: `redact()` helper available; not applied to every log. PARTIAL.
- LLM04/10 DoS / unbounded consumption: per-IP rate limit where present; token budgets not enforced. PARTIAL.
- LLM05 improper output handling: model output rendered as text; not audited for HTML sinks. UNVERIFIED.
- LLM06 excessive agency: no tool-calling agents audited. UNVERIFIED.
- Others (supply chain, poisoning, embeddings, misinformation): not assessed.


## ANIMATED SCOPE (gate items 19/21, derived from code 2026-10-07)
- Moves: AnimatedBg (ambient hero/background); CSS keyframes: badgeFloat, blink, borderSpin, comply-bounce, comply-slide-up, dotBlink, drift-a, drift-b; transitions on interactive elements.
- Trigger: page load (ambient) and hover/press (interactive). Reduced motion: honoured via prefers-reduced-motion block.
- STATUS: scope documented from existing code only. Skill-stack passes (ui-ux-pro-max, emil-design-eng, impeccable critique, review-animations) and 375/1280 screenshot review are NOT yet run for this app. Item 21 stays OPEN until they are.
