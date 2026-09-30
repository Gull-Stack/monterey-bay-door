# monterey-bay-door — notes

Durable facts a future session or teammate needs. Not a diary — the dated
narrative belongs in the CLAUDE.md Session Log.

Write for someone who was not in the room: no "as discussed", no bare pronouns.
Never put passwords, API keys, or tokens in this file.

## Who

- Tommy Rehak (GM, tomrehak@mbdoor.com) approves everything and holds the money.
- Erika Garcia (bids admin, erika@mbdoor.com). Keep her off money threads.
- Bids desk: bids@mbdoor.com. Tommy wants leads and plans sent there (30 Sept 2026).
- Kyle Dickson (D One Builders) runs his company on hq.donebuilders.com. The plan page points Tommy to him.

## Decisions

- Lead email routing is hardcoded in api/contact.js, not the SITE_EMAIL env var, so a stale env value can't send leads to the wrong box.
- Commercial terms (prices, invoices) stay out of this public repo. They live in Notion (MBD Door) and untracked drafts in this folder.

## Gotchas

- SendGrid rejects a send when one address appears twice across to/cc/bcc. Flagged leads go to Bryce alone with no cc/bcc for that reason.
- The site has no visitor analytics as of 30 Sept 2026. Semrush traffic is an estimate.

## Links

- Plan page: https://www.mbdoor.com/plan/ (noindex)
- Lead log: https://www.mbdoor.com/leads/ (PIN-gated)
- Crew photo portal: https://www.mbdoor.com/portal/
- July HQ teaser: mbd-command.vercel.app (repo ~/Documents/clients/mbd-command)
