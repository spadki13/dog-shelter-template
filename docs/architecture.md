# Architecture

Content pending implementation. Planned sections:

## Feature Toggle Pattern

How `SiteSettings` gates public routes/components (donations, merch, adoption applications) without touching the underlying collections, and the policy for toggling a feature off after records already exist.

## Collection Split Rationale

Why `Dogs`, `AdoptionApplications`, `Products`, `Donations`, and `Orders` are kept as separate collections rather than one generic "Product" type.

## Stripe Webhook Idempotency

The `WebhookEvents` collection and the verify-signature → insert-event-id → short-circuit-on-duplicate flow.
