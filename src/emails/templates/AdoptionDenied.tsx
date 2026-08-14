import * as React from 'react'

import { EmailLayout } from './EmailLayout'

export type AdoptionDeniedProps = {
  applicantName: string
  dogName: string
  shelterName: string
}

export const AdoptionDenied = ({ applicantName, dogName, shelterName }: AdoptionDeniedProps) => (
  <EmailLayout previewText={`Update on your application for ${dogName}`} shelterName={shelterName}>
    <h1 style={{ fontSize: 20, margin: '0 0 16px' }}>Application update</h1>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>Hi {applicantName},</p>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>
      Thank you for your interest in adopting <strong>{dogName}</strong>. After review, we
      won&apos;t be moving forward with this application. We encourage you to check our other
      available dogs.
    </p>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>— {shelterName}</p>
  </EmailLayout>
)
