import { Resend } from 'resend'

let client: Resend | null = null

export const getResendClient = (): Resend | null => {
  if (!process.env.RESEND_API_KEY) return null

  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY)
  }

  return client
}
