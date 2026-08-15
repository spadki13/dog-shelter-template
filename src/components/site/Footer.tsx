import type { SiteSetting } from '@/payload-types'

export function Footer({ settings }: { settings: SiteSetting }) {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{settings.shelterName}</p>
        {settings.address && <p>{settings.address}</p>}
        <div className="flex gap-4">
          {settings.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          )}
          {settings.contactPhone && <span>{settings.contactPhone}</span>}
        </div>
      </div>
    </footer>
  )
}
