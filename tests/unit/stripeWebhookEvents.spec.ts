import { describe, expect, it } from 'vitest'

import { isDuplicateKeyError, resolveCheckoutAction } from '../../src/lib/stripeWebhookEvents'

describe('isDuplicateKeyError', () => {
  it('recognizes Postgres unique-constraint errors', () => {
    expect(isDuplicateKeyError(new Error('duplicate key value violates unique constraint'))).toBe(
      true,
    )
    expect(
      isDuplicateKeyError(
        new Error('violates unique constraint "webhook_events_stripe_event_id_idx"'),
      ),
    ).toBe(true)
  })

  it('does not misclassify unrelated errors, so real failures still surface', () => {
    expect(isDuplicateKeyError(new Error('connection refused'))).toBe(false)
    expect(isDuplicateKeyError('duplicate key')).toBe(false)
    expect(isDuplicateKeyError(null)).toBe(false)
  })
})

describe('resolveCheckoutAction', () => {
  it('resolves donation metadata', () => {
    expect(resolveCheckoutAction({ type: 'donation', donationId: '42' })).toEqual({
      kind: 'donation',
      id: 42,
    })
  })

  it('resolves order metadata', () => {
    expect(resolveCheckoutAction({ type: 'order', orderId: '7' })).toEqual({ kind: 'order', id: 7 })
  })

  it('returns null for missing, empty, or malformed metadata', () => {
    expect(resolveCheckoutAction(null)).toBeNull()
    expect(resolveCheckoutAction({})).toBeNull()
    expect(resolveCheckoutAction({ type: 'donation' })).toBeNull()
    expect(resolveCheckoutAction({ type: 'donation', donationId: 'not-a-number' })).toBeNull()
    expect(resolveCheckoutAction({ type: 'something-else', donationId: '42' })).toBeNull()
  })
})
