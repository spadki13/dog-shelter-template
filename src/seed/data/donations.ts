export type SeedDonation = {
  donorName: string
  donorEmail: string
  amountInCents: number
  frequency: 'one_time' | 'monthly'
  status: 'pending' | 'completed' | 'failed'
}

export const seedDonations: SeedDonation[] = [
  {
    donorName: 'Alex Chen',
    donorEmail: 'alex.chen@example.com',
    amountInCents: 5000,
    frequency: 'one_time',
    status: 'completed',
  },
  {
    donorName: 'Morgan Patel',
    donorEmail: 'morgan.patel@example.com',
    amountInCents: 2500,
    frequency: 'monthly',
    status: 'completed',
  },
  {
    donorName: 'Riley Kim',
    donorEmail: 'riley.kim@example.com',
    amountInCents: 10000,
    frequency: 'one_time',
    status: 'pending',
  },
]
