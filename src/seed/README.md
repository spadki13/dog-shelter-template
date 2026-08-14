# Seed

`index.ts` is the seed entrypoint, run via `pnpm seed`. Currently a placeholder — real seed data (SiteSettings, Dogs, AdoptionApplications, Products, Donations/Orders) gets added alongside the collections themselves.

Design intent (see `/project-brief.md` addendum): idempotent via a marker doc or `--force` flag, run in CI to prove it stays working, and must not require live Stripe/Resend/Blob calls to succeed.
