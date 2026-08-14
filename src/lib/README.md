# Lib

- `stripe.ts` / `resend.ts` — lazy client init, return `null` when the corresponding API key isn't set so routes/hooks can fail closed or fall back to logging.
- `adoptionNotifications.ts` — pure decision logic for which email (if any) an AdoptionApplications change should trigger. Unit tested in `tests/unit/`.
- `stripeWebhookEvents.ts` — pure logic for the webhook handler: duplicate-key detection and Checkout session metadata resolution. Unit tested in `tests/unit/`.
