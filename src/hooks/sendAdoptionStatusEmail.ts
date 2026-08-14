import type { CollectionAfterChangeHook } from 'payload'
import { createElement } from 'react'

import { AdoptionApproved } from '../emails/templates/AdoptionApproved'
import { AdoptionDenied } from '../emails/templates/AdoptionDenied'
import { AdoptionSubmitted } from '../emails/templates/AdoptionSubmitted'
import { renderEmail } from '../emails/render'
import { getResendClient } from '../lib/resend'
import { resolveNotifiableStatus } from '../lib/adoptionNotifications'
import type { AdoptionApplication, Dog } from '../payload-types'

const TEMPLATES = {
  submitted: {
    subject: (dogName: string) => `Application received for ${dogName}`,
    Component: AdoptionSubmitted,
  },
  approved: {
    subject: (dogName: string) => `You've been approved to adopt ${dogName}!`,
    Component: AdoptionApproved,
  },
  denied: {
    subject: (dogName: string) => `Update on your application for ${dogName}`,
    Component: AdoptionDenied,
  },
} as const

export const sendAdoptionStatusEmail: CollectionAfterChangeHook<AdoptionApplication> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const status = resolveNotifiableStatus(operation, previousDoc?.status, doc.status)

  if (!status) return doc

  const dog =
    typeof doc.dog === 'object'
      ? doc.dog
      : ((await req.payload.findByID({
          collection: 'dogs',
          id: doc.dog,
        })) as Dog)

  const siteSettings = await req.payload.findGlobal({ slug: 'site-settings' })

  const { subject, Component } = TEMPLATES[status]
  const props = {
    applicantName: doc.applicantName,
    dogName: dog.name,
    shelterName: siteSettings.shelterName,
  }
  const { html, text } = await renderEmail(createElement(Component, props))

  const resend = getResendClient()

  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    req.payload.logger.info(
      `[email] would send "${subject(dog.name)}" to ${doc.applicantEmail} (no RESEND_API_KEY configured)`,
    )
    return doc
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: doc.applicantEmail,
    subject: subject(dog.name),
    html,
    text,
  })

  return doc
}
