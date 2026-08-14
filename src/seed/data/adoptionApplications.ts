export type SeedApplication = {
  dogSlug: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  message: string
  targetStatus: 'submitted' | 'under_review' | 'approved' | 'denied'
}

export const seedApplications: SeedApplication[] = [
  {
    dogSlug: 'buddy',
    applicantName: 'Jordan Lee',
    applicantEmail: 'jordan.lee@example.com',
    applicantPhone: '(555) 200-1001',
    message: 'We have a big backyard and another dog who loves company.',
    targetStatus: 'submitted',
  },
  {
    dogSlug: 'luna',
    applicantName: 'Sam Rivera',
    applicantEmail: 'sam.rivera@example.com',
    applicantPhone: '(555) 200-1002',
    message: "I'm a runner and Luna's energy sounds like a great fit.",
    targetStatus: 'under_review',
  },
  {
    dogSlug: 'max',
    applicantName: 'Casey Nguyen',
    applicantEmail: 'casey.nguyen@example.com',
    applicantPhone: '(555) 200-1003',
    message: 'First-time dog owner, working from home, ready for training.',
    targetStatus: 'approved',
  },
  {
    dogSlug: 'bella',
    applicantName: 'Taylor Brooks',
    applicantEmail: 'taylor.brooks@example.com',
    applicantPhone: '(555) 200-1004',
    message: 'Looking for a companion for my elderly parents.',
    targetStatus: 'denied',
  },
]
