import { DonationForm } from '@/components/forms/DonationForm'
import { getPayloadClient } from '@/lib/payload'

export const metadata = { title: 'Donate' }

export default async function DonatePage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.features?.enableDonations) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Donations are currently closed</h1>
        <p className="mt-2 text-muted-foreground">Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Support {settings.shelterName}</h1>
      <p className="mt-2 text-muted-foreground">
        Your donation helps cover food, medical care, and shelter for dogs waiting for a home.
      </p>
      <div className="mt-8">
        <DonationForm shelterName={settings.shelterName} />
      </div>
    </div>
  )
}
