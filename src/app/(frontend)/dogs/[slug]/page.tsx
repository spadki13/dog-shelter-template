import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { AdoptionForm } from '@/components/forms/AdoptionForm'
import { Badge } from '@/components/ui/badge'
import { getPayloadClient } from '@/lib/payload'

export default async function DogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [{ docs: dogs }, settings] = await Promise.all([
    payload.find({ collection: 'dogs', where: { slug: { equals: slug } }, limit: 1 }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const dog = dogs[0]
  if (!dog) notFound()

  const photo = typeof dog.mainPhoto === 'object' ? dog.mainPhoto : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
        {photo?.url && (
          <Image
            src={photo.url}
            alt={photo.alt}
            width={800}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{dog.name}</h1>
        <Badge>{dog.status}</Badge>
      </div>
      <p className="mt-1 text-muted-foreground">
        {[dog.breed, dog.age, dog.sex, dog.size].filter(Boolean).join(' · ')}
      </p>

      {dog.description && (
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <RichText data={dog.description} />
        </div>
      )}

      <div className="mt-10 border-t pt-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Adopt {dog.name}</h2>
        {settings.features?.enableAdoptionApplications && dog.status === 'available' ? (
          <AdoptionForm dogId={dog.id} dogName={dog.name} />
        ) : (
          <p className="text-muted-foreground">
            {dog.status !== 'available'
              ? `${dog.name} is no longer available for adoption.`
              : 'Adoption applications are currently closed.'}
          </p>
        )}
      </div>
    </div>
  )
}
