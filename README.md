# Travel Softball Team

A deliberately designed, portable softball site: deep navy, electric yellow, oversized Barlow Condensed type, real softball photography, and a clean editorial rhythm.

**Working concept:** Aftershock. The current brand, roster, home base, and schedule are illustrative. Team contact details intentionally remain unconfigured. Replace the sample data and approved photos before presenting it as an official team site.

## Website

The Sites version is registered and kept in sync from this source. The published URL is recorded in `docs/DEPLOYMENT.md` after successful publication.

## Edit it

1. Change `site.config.js` for team details, colors, roster, events, photos, sponsors, and contact.
2. Replace local images in `assets/images/`.
3. Open `index.html`; the canonical site has no framework and no build step.
4. For Sites, refresh the static adapter with `python scripts/package-static.py`.

See [the content guide](docs/CONTENT-GUIDE.md) and the included wiki-source pages in `docs/wiki/`.

## Included

- Responsive desktop, tablet, and mobile layouts
- Accessible mobile navigation and keyboard focus
- Roster filters with live counts and optional public recruiting profiles
- Downloadable all-day `.ics` schedule
- Native accessible photo dialog, next/previous controls, and arrow-key navigation
- Optional sponsors, email, phone, and social accounts
- Local licensed photos and fonts; no third-party scripts or tracking
- Reduced-motion support and intentional missing-image states

## Portability and provenance

Publish the root page, scripts, stylesheet, and assets to GitHub Pages, Cloudflare Pages, Netlify, or standard static hosting. `dist/` is the deterministic Sites adapter, not an independent source.

Barlow Condensed is distributed under the SIL Open Font License; see `assets/fonts/OFL.txt`. Photography sources and permissions are recorded in `docs/PHOTO-CREDITS.json`.
