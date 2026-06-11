// lib/theme.ts — complybuddy sky-blue theme tokens
// All accent class strings derived here so components stay theme-agnostic.

export const theme = {
  // Badge / pill backgrounds
  badge: 'bg-sky-500/10 border border-sky-500/25 text-sky-700',

  // Gradient text for accent headline words
  gradientText: 'bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent',

  // Gradient for buttons / badges
  gradient: 'from-sky-600 to-sky-700',

  // Accent text
  textAccent: 'text-sky-600',
}

export const btn = {
  secondary: 'rounded-xl border border-sky-200 text-sky-600 hover:border-sky-400 hover:text-sky-800 transition-all inline-flex',
}

export default theme
