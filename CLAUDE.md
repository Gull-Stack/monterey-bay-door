# Monterey Bay Door — mbdoor.com

11ty static site for Monterey Bay Door (commercial doors, frames, hardware,
access control — Hollister, CA). GullStack client site.

- **Repo:** github.com/Gull-Stack/monterey-bay-door (PUBLIC — keep client
  business details like billing out of this file)
- **Deploys:** push to `main` → Vercel project `gull-stack/monterey-bay-door`
  → www.mbdoor.com (git-connected, auto-deploy)
- **Build:** `npx eleventy` (src/ → _site/, _site is committed)
- **Sister site:** staleydoor.com (Staley Construction) — separate Vercel
  project `staley-construction`, CLI-deployed from a non-git working tree at
  `~/Documents/staley-construction/src` (recovered from Vercel deployment
  files 2026-06-11; deploy with `vercel --prod` from that src dir)
- **Contacts:** Tommy Rehak (GM, tomrehak@mbdoor.com), Erika Garcia (bids
  admin, erika@mbdoor.com). Bids → bids@mbdoor.com. Leads relay via
  leads@gullstack.com is live.

# Session Log

## 2026-06-11 — Tommy's 6/5 meeting updates (commit cb4b9f9, deployed)

- Custom wood doors now lead the services everywhere; access control moved
  to 3rd; roll-up doors removed site-wide (homepage, About, Partners).
- New homepage Big Job / Small Job packages section + Submit Your Plans CTA
  ("machine your Home Depot door" angle for local contractors).
- Sectors band: custom/tract/modular/multifamily homes → complex commercial.
- Partners: added Kelleher, ABS, DCI Hollow Metal cards.
- New /careers/ page (email application to tomrehak@) + footer link.
- Service areas: Central Valley card (Fresno, Visalia); city strips on
  homepage + all three service pages; schema areaServed updated.
- Same-day: staleydoor.com got careers/sectors/service-area sections.
- Verified live on www.mbdoor.com (careers 200, roll-up count 0).

**Crew portal (2026-06-11, LIVE):** mbdoor.com/portal — PIN 1630
(PORTAL_PIN env). Phone form: job name/city/type/notes + photos
(client-side resized to 1600px). api/project-update.js stores photos in
Vercel Blob store `mbd-project-photos` (public,
`projects/<job-slug>/...` + meta-<ts>.json per submission) and emails
bryce@gullstack.com via SendGrid. Verified end-to-end. Friday pipeline
reads the Blob store (list by prefix `projects/`). NOTE: SUPABASE_* env
vars on this project point at a DELETED project (NXDOMAIN) — contact.js
lead logging is silently dead; lead emails unaffected.

**Project intake workflow (2026-06-11):** Job Log Google Sheet
(docs.google.com/spreadsheets/d/1Elimi3PELt88sazRnuiB2RwFp0NMk7G3_H-r-30Bx2k)
— Erika logs one row per job; photos arrive via Tommy's Dropbox, folder per
job. Friday pipeline: new rows + photos → optimized images in
src/assets/images/projects/ → project pages → GMB/social drafts. 14 photos
from the 6/5 emails already live under /assets/images/projects/.

**Open items / next session:**
- Project gallery write-ups: photos are inline in Tommy's three 6/5 emails
  ("Actions shots…", "More pics", untitled) — need job names per photo and
  the Dropbox share Tommy promised on the 6/5 call.
- Reviews section: waiting on reviews/testimonial emails from Erika.
- Hero video background: wants shop/install footage (stock as interim).
- Google Business Profile: bryce@gullstack.com manager access still pending
  (asked 4/28). Needed for the weekly-post plan.
- staleyconstruction.com does not resolve — site domain is staleydoor.com;
  confirm with Tommy whether to register the other.
- Location × service SEO pages queued for months 2–3 of the SEO plan.
