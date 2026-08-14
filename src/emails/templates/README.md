# Email templates

Built: `AdoptionSubmitted`, `AdoptionApproved`, `AdoptionDenied`, sharing a plain `EmailLayout` wrapper. Rendered via `@react-email/render` (not `@react-email/components`, which is flagged deprecated upstream) and sent through Resend by `src/hooks/sendAdoptionStatusEmail.ts`.
