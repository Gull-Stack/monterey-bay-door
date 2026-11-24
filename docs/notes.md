# monterey-bay-door — notes

Durable facts a future session or teammate needs. Not a diary — the dated
narrative belongs in the CLAUDE.md Session Log.

Write for someone who was not in the room: no "as discussed", no bare pronouns.
Never put passwords, API keys, or tokens in this file.

## Who

- Tommy Rehak (GM, tomrehak@mbdoor.com) approves the work.
- Erika Garcia (bids admin, erika@mbdoor.com).
- Bids desk: bids@mbdoor.com. Tommy wants leads and plans sent there (30 Sept 2026).
- Kyle Dickson (D One Builders) runs his company on hq.donebuilders.com. The plan page points Tommy to him.

## Decisions

- Lead email routing is hardcoded in api/contact.js, not the SITE_EMAIL env var, so a stale env value can't send leads to the wrong box.
- Commercial terms (prices, invoices) stay out of this public repo. They live in Notion (MBD Door) and untracked drafts in this folder.

## What the client said

- Erika Garcia, 23 Nov 2026 (email): the whole team meets on 12 Dec 2026. She sends
  the CEO portrait and the team photo after that. She asked how to send photos; the
  answer given is email to Bryce.
- Erika Garcia, 23 Nov 2026 (email): the contact page shows "Installs by Staley
  Construction" with California Contractor's License #858597. Not checked against
  the state license board.
- Erika's quote and service option lists came from her own mock-up screenshots.
  Change the options in both `src/contact/index.njk` and `api/_lead-emails.js`.

## Gotchas

- The form's spam check drops any message with an outside URL. The plan link has its
  own field (`plan-link`) so a real plan link does not trip it.
- Service photos live in Blob under `lead-photos/`. Never store them under `leads/`:
  the /leads dashboard fetches every file there as lead JSON.

- SendGrid rejects a send when one address appears twice across to/cc/bcc. Flagged leads go to Bryce alone with no cc/bcc for that reason.
- The site has no visitor analytics as of 30 Sept 2026. Semrush traffic is an estimate.

## Links

- Plan page: https://www.mbdoor.com/plan/ (noindex)
- Lead log: https://www.mbdoor.com/leads/ (PIN-gated)
- Crew photo portal: https://www.mbdoor.com/portal/
- July HQ teaser: mbd-command.vercel.app (repo ~/Documents/clients/mbd-command)

## Service vs bid routing (shipped 2026-10-21)

The contact form asks "What do you need?" (service or bid). Service goes to
service@mbdoor.com, cc tito@staleydoor.com. Bid goes to bids@mbdoor.com, cc
tomrehak@mbdoor.com. With no choice, the project types service-maintenance and
emergency-repair count as service. Logic lives in `api/_lead-emails.js`
(`isServiceRequest`) and `api/contact.js`. Built after Tito's "Lost Lead" email:
a repair request went to the bids desk.
