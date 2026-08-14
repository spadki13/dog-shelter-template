export type SeedDog = {
  name: string
  slug: string
  status: 'available' | 'pending' | 'adopted'
  breed: string
  age: string
  sex: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  photoColor: string
}

export const seedDogs: SeedDog[] = [
  {
    name: 'Buddy',
    slug: 'buddy',
    status: 'available',
    breed: 'Labrador Retriever',
    age: '2 years',
    sex: 'male',
    size: 'large',
    photoColor: '#d97706',
  },
  {
    name: 'Luna',
    slug: 'luna',
    status: 'available',
    breed: 'Border Collie',
    age: '1 year',
    sex: 'female',
    size: 'medium',
    photoColor: '#0ea5e9',
  },
  {
    name: 'Max',
    slug: 'max',
    status: 'available',
    breed: 'Beagle',
    age: 'Puppy',
    sex: 'male',
    size: 'small',
    photoColor: '#16a34a',
  },
  {
    name: 'Bella',
    slug: 'bella',
    status: 'available',
    breed: 'German Shepherd',
    age: '3 years',
    sex: 'female',
    size: 'large',
    photoColor: '#9333ea',
  },
  {
    name: 'Charlie',
    slug: 'charlie',
    status: 'pending',
    breed: 'Poodle Mix',
    age: '4 years',
    sex: 'male',
    size: 'medium',
    photoColor: '#dc2626',
  },
  {
    name: 'Daisy',
    slug: 'daisy',
    status: 'pending',
    breed: 'Terrier Mix',
    age: '5 years',
    sex: 'female',
    size: 'small',
    photoColor: '#ca8a04',
  },
  {
    name: 'Rocky',
    slug: 'rocky',
    status: 'adopted',
    breed: 'Boxer',
    age: '6 years',
    sex: 'male',
    size: 'large',
    photoColor: '#0d9488',
  },
  {
    name: 'Molly',
    slug: 'molly',
    status: 'adopted',
    breed: 'Dachshund',
    age: '2 years',
    sex: 'female',
    size: 'small',
    photoColor: '#db2777',
  },
]
