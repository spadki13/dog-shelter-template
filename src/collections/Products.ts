import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'priceInCents', 'active'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'priceInCents',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in cents, e.g. 2000 for $20.00',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'inventory',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Inactive products are hidden from the store but keep their order history.',
      },
    },
  ],
}
