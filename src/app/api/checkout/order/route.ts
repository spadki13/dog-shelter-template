import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { getStripeClient } from '@/lib/stripe'

const orderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  items: z
    .array(
      z.object({
        productId: z.number().int(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
})

export async function POST(request: Request) {
  const stripe = getStripeClient()
  if (!stripe) {
    return NextResponse.json({ error: 'The merch store is not configured.' }, { status: 503 })
  }

  const parsed = orderSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { customerName, customerEmail, items } = parsed.data

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.features?.enableMerch) {
    return NextResponse.json({ error: 'The merch store is currently disabled.' }, { status: 403 })
  }

  // Prices always come from the current product record, never the client, to
  // prevent a tampered request from checking out at an arbitrary price.
  const products = await payload.find({
    collection: 'products',
    where: { id: { in: items.map((item) => item.productId) }, active: { equals: true } },
    limit: items.length,
  })

  const productById = new Map(products.docs.map((product) => [product.id, product]))

  const orderItems = items.map((item) => {
    const product = productById.get(item.productId)
    if (!product) throw new Error(`Product ${item.productId} not found or inactive`)
    return {
      product: product.id,
      quantity: item.quantity,
      unitPriceInCents: product.priceInCents,
      name: product.name,
    }
  })

  const totalInCents = orderItems.reduce(
    (sum, item) => sum + item.unitPriceInCents * item.quantity,
    0,
  )

  const order = await payload.create({
    collection: 'orders',
    data: {
      customerName,
      customerEmail,
      items: orderItems.map(({ product, quantity, unitPriceInCents }) => ({
        product,
        quantity,
        unitPriceInCents,
      })),
      totalInCents,
      status: 'pending',
    },
  })

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: customerEmail,
    line_items: orderItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: item.unitPriceInCents,
        product_data: { name: item.name },
      },
    })),
    metadata: { type: 'order', orderId: String(order.id) },
    success_url: `${serverUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${serverUrl}/shop`,
  })

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: { stripeCheckoutSessionId: session.id },
  })

  return NextResponse.json({ url: session.url })
}
