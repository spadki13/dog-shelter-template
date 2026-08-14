import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'customerEmail',
    defaultColumns: ['customerName', 'totalInCents', 'status', 'createdAt'],
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPriceInCents',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Snapshot of the product price at time of order.',
          },
        },
      ],
    },
    {
      name: 'totalInCents',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}
