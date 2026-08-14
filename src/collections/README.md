# Collections

`Users`, `Media`, and `Dogs` are built. Still to be added:

- `AdoptionApplications` — status workflow (submitted → under review → approved/denied)
- `Products` — merch, only relevant when the merch feature toggle is on
- `Donations` — thin wrapper around Stripe Checkout config
- `Orders` — created on successful Stripe checkout for merch purchases
- `WebhookEvents` — Stripe webhook idempotency (unique `stripeEventId`)

See `/project-brief.md` for the rationale behind keeping these separate rather than one generic "Product" type.
