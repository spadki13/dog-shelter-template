import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type Stripe from 'stripe'

import config from '@/payload.config'
import { getStripeClient } from '@/lib/stripe'
import { isDuplicateKeyError, resolveCheckoutAction } from '@/lib/stripeWebhookEvents'

export async function POST(request: Request) {
  const stripe = getStripeClient()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhooks are not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  // Idempotency: the unique constraint on stripeEventId is the source of
  // truth. If this event was already recorded, a retried delivery lands here
  // and short-circuits instead of reprocessing side effects.
  try {
    await payload.create({
      collection: 'webhook-events',
      data: { stripeEventId: event.id, type: event.type },
    })
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ received: true, duplicate: true })
    }
    throw err
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const action = resolveCheckoutAction(session.metadata)

    if (action?.kind === 'donation') {
      await payload.update({
        collection: 'donations',
        id: action.id,
        data: { status: 'completed' },
      })
    } else if (action?.kind === 'order') {
      await payload.update({ collection: 'orders', id: action.id, data: { status: 'paid' } })
    }
  }

  return NextResponse.json({ received: true })
}
