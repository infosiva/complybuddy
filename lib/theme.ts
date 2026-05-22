// lib/theme.ts — complybuddy indigo/violet theme tokens
// All accent class strings derived here so components stay theme-agnostic.

export const theme = {
  // Badge / pill backgrounds
  badge: 'bg-indigo-500/10 border border-indigo-500/25 text-indigo-300',

  // Gradient text for accent headline words
  gradientText: 'bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent',

  // Gradient for buttons / badges
  gradient: 'from-indigo-600 to-violet-600',

  // Accent text
  textAccent: 'text-indigo-400',
}

export const btn = {
  secondary: 'rounded-xl border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all inline-flex',
}

export default theme
