import * as React from 'react'

import { EmailLayout } from './EmailLayout'

export type AdoptionApprovedProps = {
  applicantName: string
  dogName: string
  shelterName: string
}

export const AdoptionApproved = ({
  applicantName,
  dogName,
  shelterName,
}: AdoptionApprovedProps) => (
  <EmailLayout previewText={`Great news about ${dogName}`} shelterName={shelterName}>
    <h1 style={{ fontSize: 20, margin: '0 0 16px' }}>Your application was approved 🎉</h1>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>Hi {applicantName},</p>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>
      Congratulations! Your application to adopt <strong>{dogName}</strong> has been approved.
      We&apos;ll be in touch shortly to arrange next steps.
    </p>
    <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>— {shelterName}</p>
  </EmailLayout>
)
