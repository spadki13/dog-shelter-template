'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PRESET_AMOUNTS = [25, 50, 100]

export function DonationForm({ shelterName }: { shelterName: string }) {
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS[1])
  const [customAmount, setCustomAmount] = useState('')
  const [frequency, setFrequency] = useState<'one_time' | 'monthly'>('one_time')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  const effectiveAmount = customAmount ? Number(customAmount) : amount

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')

    const formData = new FormData(event.currentTarget)

    const response = await fetch('/api/checkout/donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donorName: formData.get('donorName'),
        donorEmail: formData.get('donorEmail'),
        amountInCents: Math.round(effectiveAmount * 100),
        frequency,
      }),
    })

    if (!response.ok) {
      setStatus('error')
      return
    }

    const { url } = await response.json()
    window.location.href = url
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label>Amount</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={!customAmount && amount === preset ? 'default' : 'outline'}
              onClick={() => {
                setAmount(preset)
                setCustomAmount('')
              }}
            >
              ${preset}
            </Button>
          ))}
          <Input
            type="number"
            min={1}
            placeholder="Custom"
            value={customAmount}
            onChange={(event) => setCustomAmount(event.target.value)}
            className="w-28"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Frequency</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={frequency === 'one_time' ? 'default' : 'outline'}
            onClick={() => setFrequency('one_time')}
          >
            One-time
          </Button>
          <Button
            type="button"
            variant={frequency === 'monthly' ? 'default' : 'outline'}
            onClick={() => setFrequency('monthly')}
          >
            Monthly
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="donorName">Your name</Label>
        <Input id="donorName" name="donorName" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="donorEmail">Email</Label>
        <Input id="donorEmail" name="donorEmail" type="email" required />
      </div>

      <Button type="submit" disabled={status === 'submitting' || !effectiveAmount} size="lg">
        {status === 'submitting'
          ? 'Redirecting to checkout…'
          : `Donate $${effectiveAmount || 0}${frequency === 'monthly' ? '/month' : ''} to ${shelterName}`}
      </Button>
      {status === 'error' && (
        <p className="text-sm text-destructive">
          Something went wrong starting checkout. Please try again.
        </p>
      )}
    </form>
  )
}
