import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Dog } from '@/payload-types'

const STATUS_VARIANT: Record<Dog['status'], 'default' | 'secondary' | 'outline'> = {
  available: 'default',
  pending: 'secondary',
  adopted: 'outline',
}

export function DogCard({ dog }: { dog: Dog }) {
  const photo = typeof dog.mainPhoto === 'object' ? dog.mainPhoto : null

  return (
    <Link href={`/dogs/${dog.slug}`}>
      <Card className="overflow-hidden py-0 transition hover:shadow-md">
        <div className="aspect-4/3 w-full overflow-hidden bg-muted">
          {photo?.url && (
            <Image
              src={photo.url}
              alt={photo.alt}
              width={400}
              height={300}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{dog.name}</CardTitle>
            <Badge variant={STATUS_VARIANT[dog.status]}>{dog.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-6 text-sm text-muted-foreground">
          {[dog.breed, dog.age].filter(Boolean).join(' · ')}
        </CardContent>
      </Card>
    </Link>
  )
}
