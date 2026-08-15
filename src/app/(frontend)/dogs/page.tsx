import { DogCard } from '@/components/dogs/DogCard'
import { getPayloadClient } from '@/lib/payload'

export const metadata = { title: 'Dogs' }

export default async function DogsPage() {
  const payload = await getPayloadClient()

  const { docs: dogs } = await payload.find({
    collection: 'dogs',
    sort: 'status',
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Dogs</h1>
      {dogs.length === 0 ? (
        <p className="text-muted-foreground">No dogs listed yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  )
}
