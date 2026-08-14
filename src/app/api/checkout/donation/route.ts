import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { getStripeClient } from '@/lib/stripe'

const donationSchema = z.object({
  donorName: z.string().min(1),
  donorEmail: z.string().email(),
  amountInCents: z.number().int().min(100),
  frequency: z.enum(['one_time', 'monthly']),
})

export async function POST(request: Request) {
  const stripe = getStripeClient()
  if (!stripe) {
    return NextResponse.json({ error: 'Donations are not configured.' }, { status: 503 })
  }

  const parsed = donationSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { donorName, donorEmail, amountInCents, frequency } = parsed.data

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.features?.enableDonations) {
    return NextResponse.json({ error: 'Donations are currently disabled.' }, { status: 403 })
  }

  const donation = await payload.create({
    collection: 'donations',
    data: { donorName, donorEmail, amountInCents, frequency, status: 'pending' },
  })

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const productName = `${frequency === 'monthly' ? 'Monthly' : 'One-time'} donation to ${settings.shelterName}`

  const session = await stripe.checkout.sessions.create({
    mode: frequency === 'monthly' ? 'subscription' : 'payment',
    customer_email: donorEmail,
    line_items: [
      frequency === 'monthly'
        ? {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: amountInCents,
              product_data: { name: productName },
              recurring: { interval: 'month' },
            },
          }
        : {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: amountInCents,
              product_data: { name: productName },
            },
          },
    ],
    metadata: { type: 'donation', donationId: String(donation.id) },
    success_url: `${serverUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${serverUrl}/donate`,
  })

  await payload.update({
    collection: 'donations',
    id: donation.id,
    data: { stripeCheckoutSessionId: session.id },
  })

  return NextResponse.json({ url: session.url })
}
