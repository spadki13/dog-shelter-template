# Hooks

- `sendAdoptionStatusEmail` — built. `AdoptionApplications` `afterChange` hook; sends a submission-confirmation email on create and an approved/denied email on status transitions (`under_review` is silent). Falls back to a console log when Resend isn't configured.

Still to be added:

- `Dogs` media field `beforeChange` — resizes/converts uploads via `sharp` before they hit storage.
