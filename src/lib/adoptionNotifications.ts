export type AdoptionOperation = 'create' | 'update'
export type AdoptionStatus = 'submitted' | 'under_review' | 'approved' | 'denied'
export type NotifiableStatus = 'submitted' | 'approved' | 'denied'

/**
 * Decides whether a create/update to an AdoptionApplication should trigger
 * an email, and which one. `under_review` is intentionally silent — it's an
 * internal step, not something the applicant needs to hear about.
 */
export const resolveNotifiableStatus = (
  operation: AdoptionOperation,
  previousStatus: AdoptionStatus | undefined,
  newStatus: AdoptionStatus,
): NotifiableStatus | null => {
  if (operation === 'create') return 'submitted'
  if (previousStatus === newStatus) return null
  if (newStatus === 'approved' || newStatus === 'denied') return newStatus
  return null
}
