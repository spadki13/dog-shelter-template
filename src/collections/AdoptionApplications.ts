import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../access/isAdmin'
import { sendAdoptionStatusEmail } from '../hooks/sendAdoptionStatusEmail'

export const AdoptionApplications: CollectionConfig = {
  slug: 'adoption-applications',
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['applicantName', 'dog', 'status', 'createdAt'],
  },
  access: {
    read: isAdmin,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [sendAdoptionStatusEmail],
  },
  fields: [
    {
      name: 'dog',
      type: 'relationship',
      relationTo: 'dogs',
      required: true,
    },
    {
      name: 'applicantName',
      type: 'text',
      required: true,
    },
    {
      name: 'applicantEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'applicantPhone',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      admin: {
        description: 'Why would you like to adopt this dog?',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'submitted',
      access: {
        update: isAdminFieldLevel,
      },
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Denied', value: 'denied' },
      ],
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Internal notes, not visible to the applicant.',
      },
    },
  ],
}
