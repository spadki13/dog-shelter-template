'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BuyButton({ productId }: { productId: number }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')

    const formData = new FormData(event.currentTarget)

    const response = await fetch('/api/checkout/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        items: [{ productId, quantity: 1 }],
      }),
    })

    if (!response.ok) {
      setStatus('error')
      return
    }

    const { url } = await response.json()
    window.location.href = url
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full">
        Buy now
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="grid gap-1">
        <Label htmlFor={`name-${productId}`} className="text-xs">
          Name
        </Label>
        <Input id={`name-${productId}`} name="customerName" required />
      </div>
      <div className="grid gap-1">
        <Label htmlFor={`email-${productId}`} className="text-xs">
          Email
        </Label>
        <Input id={`email-${productId}`} name="customerEmail" type="email" required />
      </div>
      <Button type="submit" disabled={status === 'submitting'} className="w-full">
        {status === 'submitting' ? 'Redirecting…' : 'Checkout'}
      </Button>
      {status === 'error' && (
        <p className="text-xs text-destructive">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
