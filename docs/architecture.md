# Architecture

## Feature Toggle Pattern

`SiteSettings` (`src/globals/SiteSettings.ts`) is a Payload global with a `features` group: `enableDonations`, `enableMerch`, `enableAdoptionApplications`. It's the single source of truth shelter staff use to turn parts of the public site on or off — no code changes, no redeploy.

The toggle is enforced **at the route/component level, never at the collection level**:

- `src/app/(frontend)/donate/page.tsx` and `.../shop/page.tsx` check `settings.features.enableDonations` / `enableMerch` and render a "currently closed" message instead of the real page when off.
- `src/app/(frontend)/dogs/[slug]/page.tsx` checks `enableAdoptionApplications` and swaps the `AdoptionForm` for a closed-message when off.
- `src/components/site/Header.tsx` hides the corresponding nav links when a feature is off, so there's no dead-end link to a closed section.
- The Stripe checkout routes (`src/app/api/checkout/*`) re-check the toggle server-side before creating a Checkout session — the UI gate is a courtesy, not the security boundary.

Collections (`Donations`, `Orders`, `Products`) are never touched by the toggle. **Policy:** turning a feature off hides it from the public site but never deletes or blocks admin access to existing records — past orders and donations stay visible in the admin, and staff can still review them. Only _new_ creation is blocked (by the route-level check). This means toggling merch off after selling shirts for a season doesn't lose any order history, and toggling it back on later just resumes where it left off.

Why route-level and not collection-level `access` functions: collection access controls who can read/write data, which is an authorization concern. Feature toggles are a product/marketing concern — "should this section exist on the site right now" — and conflating the two would make it impossible for an admin to review historical `Orders` while merch is toggled off.

## Collection Split Rationale

`Dogs`, `AdoptionApplications`, `Products`, `Donations`, and `Orders` are five separate collections rather than one generic "listing" or "transaction" type, because their lifecycles and admin-UI needs genuinely differ:

- **`Dogs`** has no payment or workflow concept — it's a content listing, always present regardless of any toggle.
- **`AdoptionApplications`** has a real state machine (`submitted → under_review → approved/denied`) with side effects (email notifications) — see `src/lib/adoptionNotifications.ts`. Application review happens independent of any payment.
- **`Products`** is catalog data (price, inventory, active flag) — no relationship to a specific transaction.
- **`Donations`** and **`Orders`** are transaction records created by the Stripe checkout flow, each with their own `status` and `stripeCheckoutSessionId`. Donations are a single flat amount; Orders carry a line-item array with price snapshots (`unitPriceInCents`) so a later price change on a `Product` doesn't retroactively rewrite historical order totals.

A volunteer managing `Dogs` in the admin panel never needs to see payment fields, and a generic "Product" collection trying to cover both dogs and merch would either bloat the admin UI with irrelevant fields or require conditional field visibility hacks. Separate collections keep each admin screen honest about what it's actually for.

## Stripe Webhook Idempotency

`src/app/api/webhooks/stripe/route.ts` implements the standard Stripe-recommended idempotency pattern:

1. Verify the `stripe-signature` header via `stripe.webhooks.constructEvent()` — reject anything that isn't genuinely from Stripe.
2. Attempt to `payload.create()` a `WebhookEvents` doc with `stripeEventId: event.id`. The field has a **unique constraint** (`src/collections/WebhookEvents.ts`).
3. If that create throws a duplicate-key error (`src/lib/stripeWebhookEvents.ts`'s `isDuplicateKeyError`), this event was already processed — return `200` immediately without touching `Donations`/`Orders` again. Any other error is rethrown so Stripe's retry mechanism kicks in correctly.
4. Only after the event is durably recorded as new does the handler resolve which record to update (`resolveCheckoutAction`) and mark the `Donation`/`Order` as completed.

This matters because Stripe _will_ redeliver webhook events (network blips, slow responses, deploys mid-request), and payment confirmation routinely arrives after the customer has already left the success page. Recording the event ID before doing any side effect — rather than checking-then-acting — closes the race window a naive "check if processed, then process" implementation would leave open under concurrent delivery.
