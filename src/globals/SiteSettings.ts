import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'shelterName',
      type: 'text',
      required: true,
      defaultValue: 'Local Dog Shelter',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      type: 'text',
      admin: {
        description: 'Hex color used for the site theme, e.g. #2563eb',
      },
      defaultValue: '#2563eb',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'features',
      type: 'group',
      fields: [
        {
          name: 'enableDonations',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show donation flow on the public site.',
          },
        },
        {
          name: 'enableMerch',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show the merch store on the public site.',
          },
        },
        {
          name: 'enableAdoptionApplications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow visitors to submit adoption applications.',
          },
        },
      ],
    },
  ],
}
