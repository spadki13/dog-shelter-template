import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { getPayloadClient } from '@/lib/payload'
import './styles.css'

export const metadata = {
  description: 'An open-source template for local dog shelters.',
  title: 'Dog Shelter',
}

// Content is admin-managed via Payload; force-dynamic ensures edits show
// up immediately rather than requiring a rebuild for a static prerender.
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
