import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  admin: {
    useAsTitle: 'stripeEventId',
    defaultColumns: ['stripeEventId', 'type', 'createdAt'],
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'stripeEventId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Stripe event ID (evt_...). Unique constraint is what makes webhook processing idempotent.',
      },
    },
    {
      name: 'type',
      type: 'text',
    },
  ],
}
