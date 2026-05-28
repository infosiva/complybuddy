import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

    const origin = req.headers.get('origin') || 'https://complyscan.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?upgraded=1`,
      cancel_url: `${origin}/`,
      metadata: { email },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[checkout]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
