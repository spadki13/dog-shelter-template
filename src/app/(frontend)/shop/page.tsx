import { ProductCard } from '@/components/shop/ProductCard'
import { getPayloadClient } from '@/lib/payload'

export const metadata = { title: 'Shop' }

export default async function ShopPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.features?.enableMerch) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">The shop is currently closed</h1>
        <p className="mt-2 text-muted-foreground">Please check back later.</p>
      </div>
    )
  }

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    limit: 50,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Shop</h1>
      <p className="mb-8 text-muted-foreground">Proceeds support {settings.shelterName}.</p>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products available right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
