# Dog Shelter E-Commerce Template — Project Brief

## Goal

An open-source, single-tenant Next.js template that any local dog shelter can fork and deploy for their own site. Built primarily as a portfolio/learning project — prioritize finishing something well-crafted over maximizing feature scope.

## Scope for v1

**In scope:**

- Single shelter per deployment (no multi-tenant hosting, no Stripe Connect)
- Shelter staff can self-manage content and settings through the admin — no code changes needed for day-to-day use
- Branding controlled via one admin screen (logo, colors, name, contact info)
- Feature toggles (enable/disable donations, merch, adoption applications) via the same settings screen
- Stripe for payments — one-time and recurring donations via Stripe Checkout
- Dog listings with photos
- Adoption application flow with a status workflow (submitted → under review → approved/denied)

**Explicitly out of scope for v1 (note in README as roadmap):**

- Multi-shelter hosting / Stripe Connect
- Merch inventory & variants (add later if wanted — it's more CRUD than concept)
- Role/permission system beyond a single admin role
- Cross-shelter discovery/search

## Tech Stack

- **Frontend/framework:** Next.js
- **CMS/backend:** Payload CMS (Next.js-native, installs into the app itself; gives shelter staff an admin UI without building one from scratch)
- **Payments:** Stripe (Checkout for one-time + recurring donations; webhook handling for confirming payment status)
- **Database:** Postgres (via Payload)

## Why Payload over a headless CMS like Sanity

Sanity is a pure content layer with no concept of orders/payments/applications — you'd need to bolt on a separate commerce engine. Payload is a full backend with an admin UI, runs inside the Next.js app, and lets you define custom collections (Products, Orders, Donations, Dogs, AdoptionApplications) with a free admin panel — closer to "one system for content and transactions," which fits non-technical shelter staff managing everything themselves.

## Data Model (collections)

Keep these **separate** rather than one generic "Product" type — their lifecycles are too different, and separate collections keep the admin UI honest (a volunteer managing dogs shouldn't see order/inventory fields).

- **`Dogs`** — always present regardless of toggles; the core of the site
- **`AdoptionApplications`** — form submissions with a status field (submitted → under review → approved/denied); separate from payment, since review happens before/independent of any fee
- **`Products`** — only relevant if merch toggle is on; variants, price, inventory
- **`Donations`** — mostly a thin wrapper around Stripe Checkout config; may not need much of its own schema
- **`Orders`** — created on successful Stripe checkout, for merch purchases only
- **`SiteSettings`** (global) — branding fields + feature toggle checkboxes (enable donations / enable merch / enable adoption applications); frontend reads this at render time to show/hide sections

## What to build with extra care (this is where the learning/portfolio value is)

1. **The Site Settings feature-toggle pattern** — a real, reusable pattern worth doing properly
2. **Stripe integration done right** — signature-verified webhooks, idempotency, handling payment confirmation arriving after the user has left the page
3. **The adoption application status workflow** — has real state logic, not generic CRUD; a good candidate for optimistic UI
4. **Clean, accessible, good-looking frontend** — cheap relative to backend effort, but it's what makes the project look finished

## Project polish checklist (makes it read as a serious open-source project, not just working code)

- [ ] Seed script (`pnpm seed` or similar) that populates a demo shelter, sample dogs, sample donations — one-command setup for anyone cloning the repo
- [ ] End-to-end TypeScript types generated from Payload collections, wired through to frontend
- [ ] Tests on logic-heavy parts only: adoption status machine, Stripe webhook handler (skip testing that forms render)
- [ ] GitHub Actions CI: lint, typecheck, tests on PRs
- [ ] README with a live Vercel demo link, not just screenshots
- [ ] CONTRIBUTING.md, issue templates, a few `good-first-issue` labeled tasks
- [ ] Short architecture doc/diagram explaining the feature-toggle pattern and why collections are split the way they are

## Context / prior art (why this gap is worth filling)

Existing open-source and commercial shelter software (Animal Shelter Manager, ShelterLuv, PetPoint, ShelterBuddy, RescueGroups.org) is almost entirely **operations/case-management** tooling — intake, medical records, kennel tracking, staff workflows. None of it is a lightweight, open-source **public-facing site + store + donation flow** template. That's the gap this project fills; it's not a solved problem.

## Known risk (not a v1 concern, but worth remembering)

The hard part of this kind of project is usually adoption, not code — shelters are small, often volunteer-run, and already have workflows (even clunky free ones). If this ever moves beyond portfolio scope toward real usage, the next step would be finding one real shelter to pilot with and iterating on their actual feedback, rather than adding more speculative features.

## Addendum: decisions to lock in before implementation

**Seed script is first-class, not a checklist afterthought.** Use Payload's local API (not REST) for speed and no auth overhead. Populate: one `SiteSettings` doc with all toggles ON, 8-10 `Dogs` spanning available/pending/adopted status, `AdoptionApplications` covering every workflow state, a few `Products` with variants, and 2-3 `Donations`/`Orders`. Make it idempotent (marker doc or `--force` flag) and run it in CI so a broken seed script fails the build, not a user's first `pnpm seed`.

**Image handling.** Default to Vercel Blob storage (`@payloadcms/storage-vercel-blob`) — matches the "clone and deploy to Vercel" demo story; document S3 as the self-hosted swap-out in the README rather than building both. Add a `beforeChange` hook on the Dogs media field using Payload's bundled `sharp` to cap dimensions / convert to webp, so a volunteer's unoptimized phone photo doesn't ship straight to prod.

**Adoption workflow notifications.** Add an `afterChange` hook on `AdoptionApplications` that fires only on status transitions (`previousDoc.status !== doc.status`), sending email via Resend with one React Email template per transition (submitted confirmation, approved, denied). Treat this as part of the status-workflow showcase piece, not a bolt-on.

**Stripe webhook idempotency, concretely.** Add a `WebhookEvents` collection (or plain table) with a unique `stripeEventId` field. Handler flow: verify signature → attempt insert of event ID → on unique-constraint failure, return 200 without reprocessing. Standard Stripe-recommended pattern, and testable in isolation per the "test logic-heavy parts" rule above.

**Policy: toggling a feature off after records exist.** Toggling off hides the feature from public nav/pages but never deletes or blocks admin access to existing records (past orders/donations remain visible; new creation is blocked). Enforce at the public route/component level, gated on the `SiteSettings` toggle — not by touching the underlying collections. Document this in the field description in the Payload admin UI and in the architecture doc.
