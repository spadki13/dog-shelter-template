'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function AdoptionForm({ dogId, dogName }: { dogId: number; dogName: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')

    const formData = new FormData(event.currentTarget)

    const response = await fetch('/api/adoption-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dog: dogId,
        applicantName: formData.get('applicantName'),
        applicantEmail: formData.get('applicantEmail'),
        applicantPhone: formData.get('applicantPhone'),
        message: formData.get('message'),
      }),
    })

    setStatus(response.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
        Thanks for applying to adopt {dogName}! We&apos;ve sent a confirmation to your email and
        will follow up soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="applicantName">Your name</Label>
        <Input id="applicantName" name="applicantName" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="applicantEmail">Email</Label>
        <Input id="applicantEmail" name="applicantEmail" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="applicantPhone">Phone</Label>
        <Input id="applicantPhone" name="applicantPhone" type="tel" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Why would you like to adopt {dogName}?</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>
      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit application'}
      </Button>
      {status === 'error' && (
        <p className="text-sm text-destructive">
          Something went wrong submitting your application. Please try again.
        </p>
      )}
    </form>
  )
}
