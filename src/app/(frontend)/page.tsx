import Link from 'next/link'

import { DogCard } from '@/components/dogs/DogCard'
import { Button } from '@/components/ui/button'
import { getPayloadClient } from '@/lib/payload'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const { docs: dogs } = await payload.find({
    collection: 'dogs',
    where: { status: { equals: 'available' } },
    limit: 4,
    sort: '-createdAt',
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="flex flex-col items-start gap-6 py-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Every dog deserves a home.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {settings.shelterName} connects loving families with dogs who need one. Browse available
          dogs, submit an adoption application, or support our work with a donation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/dogs" />} nativeButton={false} size="lg">
            Meet the dogs
          </Button>
          {settings.features?.enableDonations && (
            <Button
              render={<Link href="/donate" />}
              nativeButton={false}
              variant="outline"
              size="lg"
            >
              Donate
            </Button>
          )}
        </div>
      </section>

      {dogs.length > 0 && (
        <section className="py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Available now</h2>
            <Link href="/dogs" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
