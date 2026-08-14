import { describe, expect, it } from 'vitest'

import { resolveNotifiableStatus } from '../../src/lib/adoptionNotifications'

describe('resolveNotifiableStatus', () => {
  it('sends the submitted email on create, regardless of the initial status', () => {
    expect(resolveNotifiableStatus('create', undefined, 'submitted')).toBe('submitted')
    expect(resolveNotifiableStatus('create', undefined, 'approved')).toBe('submitted')
  })

  it('does nothing when the status did not change on update', () => {
    expect(resolveNotifiableStatus('update', 'submitted', 'submitted')).toBeNull()
    expect(resolveNotifiableStatus('update', 'approved', 'approved')).toBeNull()
  })

  it('sends approved/denied emails on transition into those statuses', () => {
    expect(resolveNotifiableStatus('update', 'submitted', 'approved')).toBe('approved')
    expect(resolveNotifiableStatus('update', 'under_review', 'denied')).toBe('denied')
  })

  it('stays silent transitioning into under_review', () => {
    expect(resolveNotifiableStatus('update', 'submitted', 'under_review')).toBeNull()
  })

  it('stays silent transitioning out of approved/denied back to under_review', () => {
    expect(resolveNotifiableStatus('update', 'approved', 'under_review')).toBeNull()
  })
})
