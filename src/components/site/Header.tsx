import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

export function Header({ settings }: { settings: SiteSetting }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {settings.shelterName}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/dogs" className="hover:text-foreground">
            Dogs
          </Link>
          {settings.features?.enableDonations && (
            <Link href="/donate" className="hover:text-foreground">
              Donate
            </Link>
          )}
          {settings.features?.enableMerch && (
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
