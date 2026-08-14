import * as React from 'react'

import { EmailLayout } from './EmailLayout'

export type AdoptionSubmittedProps = {
  applicantName: string
  dogName: string
  shelterName: string
}

export const AdoptionSubmitted = ({
  applicantName,
  dogName,
  shelterName,
}: AdoptionSubmittedProps) => (
  <EmailLayout
    previewText={`We received your application for ${dogName}`}
    shelterName={shelterName}
  >
    <h1 style={{ fontSize: 20, margin: '0 0 16px' }}>Application received</h1>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>Hi {applicantName},</p>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>
      Thanks for applying to adopt <strong>{dogName}</strong>. Our team will review your application
      and follow up with next steps soon.
    </p>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>— {shelterName}</p>
  </EmailLayout>
)
