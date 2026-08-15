import Image from 'next/image'

import { BuyButton } from '@/components/shop/BuyButton'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Product } from '@/payload-types'

export function ProductCard({ product }: { product: Product }) {
  const image = typeof product.image === 'object' ? product.image : null

  return (
    <Card className="overflow-hidden py-0">
      <div className="aspect-4/3 w-full overflow-hidden bg-muted">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt}
            width={400}
            height={300}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 text-sm text-muted-foreground">
        {product.description}
        <p className="mt-2 font-medium text-foreground">
          ${(product.priceInCents / 100).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="border-t bg-transparent p-4">
        <BuyButton productId={product.id} />
      </CardFooter>
    </Card>
  )
}
