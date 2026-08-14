import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'donorEmail',
    defaultColumns: ['donorName', 'amountInCents', 'frequency', 'status', 'createdAt'],
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'donorName',
      type: 'text',
      required: true,
    },
    {
      name: 'donorEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'amountInCents',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'frequency',
      type: 'select',
      required: true,
      defaultValue: 'one_time',
      options: [
        { label: 'One-time', value: 'one_time' },
        { label: 'Monthly', value: 'monthly' },
      ],
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
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
}
