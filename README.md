# Dog Shelter Template

An open-source, single-tenant Next.js template that any local dog shelter can fork and deploy for their own site. Shelter staff manage dogs, adoption applications, donations, and (optionally) merch entirely through the admin — no code changes needed for day-to-day use.

> **Status:** functionally complete for v1 — collections, the adoption email hook, the Stripe integration, and the public frontend (home, dog listings/detail, adoption form, donations, shop) are all built. Media storage is still local disk (Vercel Blob not yet wired), and there's no live demo deploy yet — see [Roadmap](#roadmap--out-of-scope) and `project-brief.md`.

[Live demo](#) — coming once deployed · [CI](../../actions)

## Features

- Dog listings with photos
- Adoption application flow with a status workflow (submitted → under review → approved/denied)
- One-time and recurring donations via Stripe Checkout
- Optional merch store (feature-toggleable)
- Branding and feature toggles controlled from a single admin settings screen

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — accessible, unstyled-primitive components copied into the repo rather than a runtime dependency, easy for a fork to reskin
- **CMS/backend:** [Payload CMS](https://payloadcms.com/) — installs directly into the Next.js app, giving shelter staff a full admin UI without a separate backend
- **Database:** Postgres, via Payload's Postgres adapter
- **Payments:** [Stripe](https://stripe.com/) (Checkout + webhooks)
- **Email:** [Resend](https://resend.com/) + React Email, for adoption status notifications
- **Media storage:** Vercel Blob (S3 documented as a self-hosted alternative)

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for local Postgres via Docker Compose)

### Setup

```bash
git clone <this-repo>
cd dog-shelter-template
pnpm install
cp .env.example .env        # fill in PAYLOAD_SECRET at minimum; see below
docker compose up -d        # starts local Postgres
pnpm generate:types
pnpm seed
pnpm dev
```

Open `http://localhost:3000/admin` and follow the prompts to create your first admin user.

## Environment Variables

See `.env.example` for the full list. Only `DATABASE_URL` and `PAYLOAD_SECRET` are required to run the app locally. `RESEND_API_KEY`/`RESEND_FROM_EMAIL` and the `STRIPE_*` variables are optional — without them, adoption status emails log to the console and the checkout/webhook routes respond `503` instead of calling out. Blob variables are only needed once media storage is wired up.

| Variable                                                                             | Purpose                                                                        |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `PAYLOAD_SECRET`                                                                     | Signs Payload's JWTs/sessions. Any random 32+ char string.                     |
| `DATABASE_URL`                                                                       | Postgres connection string. Matches `docker-compose.yml` by default.           |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Checkout + webhook verification. From the Stripe dashboard (test mode). |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL`                                               | Adoption status-change emails. From the Resend dashboard.                      |
| `BLOB_READ_WRITE_TOKEN`                                                              | Vercel Blob storage for dog photos. From a Vercel project's Storage tab.       |
| `NEXT_PUBLIC_SERVER_URL`                                                             | Public base URL, used in links (e.g. emails).                                  |

## Project Structure

```
src/
├── app/
│   ├── (frontend)/   # public-facing site: home, dogs, donate, shop
│   ├── (payload)/    # Payload admin + REST/GraphQL, generator-owned
│   └── api/           # Stripe checkout + webhook routes
├── collections/       # Payload collections (Users, Media, Dogs, AdoptionApplications, Products, Donations, Orders, WebhookEvents)
├── components/         # site chrome, forms, dog/shop cards, shadcn/ui primitives
├── globals/           # Payload globals (SiteSettings)
├── fields/            # shared reusable field configs
├── access/            # access-control functions
├── hooks/             # collection/global hooks
├── emails/templates/  # React Email templates (Resend)
├── seed/              # seed script (`pnpm seed`)
└── lib/                # shared utilities (Stripe/Resend clients, etc.)
```

See [`docs/architecture.md`](docs/architecture.md) for the reasoning behind the feature-toggle pattern and the collection split.

## Scripts

| Script                      | Purpose                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | Start the Next.js dev server                                                                        |
| `pnpm build` / `pnpm start` | Production build / start                                                                            |
| `pnpm lint`                 | ESLint                                                                                              |
| `pnpm typecheck`            | `tsc --noEmit`                                                                                      |
| `pnpm test`                 | Integration (Vitest) + E2E (Playwright) tests                                                       |
| `pnpm seed`                 | Populate a demo shelter, dogs, and sample data                                                      |
| `pnpm generate:types`       | Regenerate `src/payload-types.ts` from collection configs (gitignored, run after any schema change) |

## Roadmap / Out of Scope

Explicitly out of scope for v1 (see `project-brief.md` for the reasoning):

- Multi-shelter hosting / Stripe Connect
- Merch inventory & variants beyond basic products
- Role/permission system beyond a single admin role
- Cross-shelter discovery/search

## Deployment

Deployment instructions (Vercel) will be added once the app has real functionality to deploy.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE)
