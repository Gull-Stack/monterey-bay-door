# Monterey Bay Door - Build Instructions

## Overview
Build a professional B2B website for Monterey Bay Door — a commercial access control & door hardware company in Hollister, CA. This is a GullStack client site.

## Tech Stack
- **11ty (Eleventy)** static site generator
- **No frameworks** — vanilla CSS, minimal JS
- **Snipcart** for future e-commerce (just add the script tag placeholder for now, don't build the shop yet)
- **Deployed on Vercel**

## Design Inspiration
- **Primary:** https://unikorns.work/ — clean, minimal, professional B2B aesthetic
- **Scrolling partner logos** like Unikorns' "Trusted By" section (infinite horizontal scroll, grayscale logos)
- **NOT** a spa or consumer site — this is B2B commercial security

## Brand
- **Colors:** Dark Teal `#051E21` (primary), Sage Green `#94AB69` (accent), White `#FFFFFF`
- **Fonts:** Use a professional sans-serif pairing (e.g., Inter or similar from Google Fonts)
- **Tone:** Professional, trustworthy, enterprise-grade but approachable
- **NO emojis on the website** — use SVG icons or CSS if needed

## Assets
All assets are in `assets-source/`:
- `logos/` — 6 logo variations (wide/tall, dark/white/white-green)
- `images/` — 15+ professional photos organized by category
- `partner-logos-web-ready/` — 10 manufacturer logos (SVG/PNG)
- `favicons/` — complete favicon package
- Copy files: `monterey-bay-door-homepage-copy.md`, `monterey-bay-door-about-copy.md`, `monterey-bay-door-remaining-pages-copy.md`

## Pages to Build
1. **Homepage** — Hero, value props, scrolling partner logos, services preview, stats, CTA
2. **About** — Company story, team, what makes them different
3. **Services** (can be one page with sections or 3 sub-pages):
   - Access Control Systems
   - Commercial Door Hardware
   - Service & Maintenance
4. **Projects** — Portfolio/case studies (placeholder content OK, Tommy will provide photos)
5. **Partners** — Manufacturer partnerships with scrolling logo section
6. **Service Areas** — Central California coverage map/list
7. **Contact** — Quote request form, contact info, map

## Key Features
- **Scrolling partner logos** — infinite horizontal CSS animation, grayscale treatment, "AUTHORIZED PARTNERS" heading
- **Responsive** — mobile-first
- **Fast** — static site, optimized images
- **SEO** — proper meta tags, structured data, sitemap
- **Dynamic sitemap** using `collections.all` in 11ty
- **GullStack footer** — "Powered by GullStack" in footer

## Placeholder Info (client hasn't provided yet)
- Phone: Use `(831) 555-0100` as placeholder
- Email: Use `info@mbdoor.com`
- Address: Use `Hollister, CA` (no street address yet)
- License #: Use `[License #]` placeholder

## Copy
Use the copy from the .md files in assets-source/. Adapt as needed for the design but keep the messaging intact. Remove any emoji from the copy when putting it on the site.

## Structure
```
src/
  _data/
  _includes/
    layouts/
  assets/
    css/
    images/
    logos/
    partner-logos/
    favicons/
  pages/
.eleventy.js
package.json
```

## Important Rules
- NO Shopify — e-commerce will be Snipcart/Stripe later
- NO emojis on the website
- Professional B2B aesthetic — not consumer/spa vibes
- Must look like it can compete with national suppliers
- Clean, modern, fast
- GullStack footer on every page

## When Done
1. Commit everything
2. Push to main
3. Run: `openclaw system event --text "Done: Monterey Bay Door 11ty site built - 7 pages, scrolling partner logos, responsive, ready for Vercel deploy" --mode now`
