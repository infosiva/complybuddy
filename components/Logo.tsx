export default function Logo({ color }: { color: string }) {
  return (
    <span className="flex items-center gap-2" aria-label="ComplyBuddy">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={24} height={24} className="transition-transform duration-200 group-hover:scale-110" />
      <span className="font-semibold text-blue-900 text-sm tracking-tight">Comply<span style={{ color }}>Buddy</span></span>
    </span>
  )
}
