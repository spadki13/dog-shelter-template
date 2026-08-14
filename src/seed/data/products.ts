export type SeedProduct = {
  name: string
  slug: string
  description: string
  priceInCents: number
  inventory: number
  photoColor: string
}

export const seedProducts: SeedProduct[] = [
  {
    name: 'Shelter Logo T-Shirt',
    slug: 'shelter-logo-tshirt',
    description: 'Soft cotton tee with the shelter logo. Proceeds support dog care.',
    priceInCents: 2500,
    inventory: 40,
    photoColor: '#334155',
  },
  {
    name: "Adopt Don't Shop Tote Bag",
    slug: 'adopt-dont-shop-tote',
    description: 'Canvas tote bag, perfect for carrying supplies on a shelter visit.',
    priceInCents: 1800,
    inventory: 25,
    photoColor: '#7c2d12',
  },
  {
    name: 'Dog Bandana',
    slug: 'dog-bandana',
    description: 'Adjustable bandana for your own dog, in shelter blue.',
    priceInCents: 1200,
    inventory: 60,
    photoColor: '#1d4ed8',
  },
]
