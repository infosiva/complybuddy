// lib/theme.ts — complybuddy blue theme tokens
// All accent class strings derived here so components stay theme-agnostic.

export const theme = {
  // Badge / pill backgrounds
  badge: 'bg-blue-500/10 border border-blue-500/25 text-blue-700',

  // Gradient text for accent headline words
  gradientText: 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent',

  // Gradient for buttons / badges
  gradient: 'from-blue-600 to-blue-700',

  // Accent text
  textAccent: 'text-blue-600',
}

export const btn = {
  secondary: 'rounded-xl border border-blue-200 text-blue-600 hover:border-blue-400 hover:text-blue-800 transition-all inline-flex',
}

export default theme
