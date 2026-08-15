import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata = { title: 'Order confirmed' }

export default function ShopSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Order confirmed!</h1>
      <p className="mt-3 text-muted-foreground">
        Thanks for your purchase. We&apos;ll email a receipt shortly.
      </p>
      <Button render={<Link href="/shop" />} nativeButton={false} className="mt-8">
        Continue shopping
      </Button>
    </div>
  )
}
