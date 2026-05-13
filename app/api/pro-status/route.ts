import { NextRequest, NextResponse } from 'next/server'

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://31.97.56.148:3110'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ pro: false })

  try {
    const res = await fetch(`${AUTH_API}/user/subscription?email=${encodeURIComponent(email)}&site=complyscan.app`)
    if (!res.ok) return NextResponse.json({ pro: false })
    const data = await res.json()
    return NextResponse.json({ pro: data.status === 'pro' })
  } catch {
    return NextResponse.json({ pro: false })
  }
}
