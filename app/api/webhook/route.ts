import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://31.97.56.148:3110'

async function markUserPro(email: string, subscriptionId: string, status: 'pro' | 'free') {
  try {
    await fetch(`${AUTH_API}/user/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subscriptionId, status, site: 'complyscan.app' }),
    })
  } catch (e: any) {
    console.error('[webhook] markUserPro failed:', e.message)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('[webhook] signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email || (session.metadata?.email ?? '')
    const subId = typeof session.subscription === 'string' ? session.subscription : ''
    if (email) await markUserPro(email, subId, 'pro')
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const customer = await stripe.customers.retrieve(sub.customer as string) as Stripe.Customer
    const email = customer.email || ''
    if (email) await markUserPro(email, sub.id, 'free')
  }

  return NextResponse.json({ ok: true })
}
