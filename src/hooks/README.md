# Hooks

Collection/global hooks. Planned:

- `AdoptionApplications` `afterChange` — sends a status-transition email via Resend when `previousDoc.status !== doc.status`.
- `Dogs` media field `beforeChange` — resizes/converts uploads via `sharp` before they hit storage.
