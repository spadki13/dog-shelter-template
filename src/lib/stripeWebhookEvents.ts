export const isDuplicateKeyError = (err: unknown): boolean =>
  err instanceof Error && /duplicate key|unique constraint/i.test(err.message)

export type CheckoutMetadataAction = { kind: 'donation' | 'order'; id: number } | null

/**
 * Reads a Stripe Checkout session's metadata (set when the session was
 * created) to decide which record to mark paid. Returns null for anything
 * that doesn't match the shape our checkout routes produce.
 */
export const resolveCheckoutAction = (
  metadata: Record<string, string> | null | undefined,
): CheckoutMetadataAction => {
  if (!metadata) return null

  if (metadata.type === 'donation' && metadata.donationId) {
    const id = Number(metadata.donationId)
    if (Number.isInteger(id)) return { kind: 'donation', id }
  }

  if (metadata.type === 'order' && metadata.orderId) {
    const id = Number(metadata.orderId)
    if (Number.isInteger(id)) return { kind: 'order', id }
  }

  return null
}
