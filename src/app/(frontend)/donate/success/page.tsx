import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata = { title: 'Thank you' }

export default function DonateSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Thank you!</h1>
      <p className="mt-3 text-muted-foreground">
        Your donation is on its way through. We&apos;ll email a receipt shortly.
      </p>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-8">
        Back home
      </Button>
    </div>
  )
}
