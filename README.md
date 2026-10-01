# Travel Softball Team

A deliberately designed, portable softball site: deep navy, electric yellow, oversized Barlow Condensed type, real softball photography, and a clean editorial rhythm.

**Working concept:** Aftershock. The current brand, roster, home base, and schedule are illustrative. Team contact details intentionally remain unconfigured. Replace the sample data and approved photos before presenting it as an official team site.

## Website

The Sites version is registered and kept in sync from this source. The published URL is recorded in `docs/DEPLOYMENT.md` after successful publication.

## Edit it

1. Change `site.config.js` for team details, colors, roster, events, photos, sponsors, and contact.
2. Replace local images in `assets/images/`.
3. Open `index.html` to preview the presentation site without a framework.
4. For the complete Sites app, run `npm ci`, `npm run db:generate` when the schema changes, `npm run build`, and `npm test`.
5. Sign in through **Team sign in** on the calendar. The site owner can add, edit, or cancel events and review/export attendance. The `ADMIN_EMAILS` Sites secret controls this permission; never put actual account emails in public source.

See [the content guide](docs/CONTENT-GUIDE.md) and the included wiki-source pages in `docs/wiki/`.

## Included

- Responsive desktop, tablet, and mobile layouts
- Accessible mobile navigation and keyboard focus
- Roster filters with live counts and optional public recruiting profiles
- Full month and agenda calendar, event-type filters, month navigation, and event details
- All-day and timed event exports, Google Calendar links, field directions, and RSVP deadlines
- Dedicated RSVP page with Going / Maybe / Unavailable, guest counts, private notes, and response updates
- Durable D1 storage, ChatGPT sign-in, owner-only schedule editing and private attendance CSV exports
- Native accessible photo dialog, next/previous controls, and arrow-key navigation
- Optional sponsors, email, phone, and social accounts
- Local licensed photos and fonts; no third-party scripts or tracking
- Reduced-motion support and intentional missing-image states

## Portability and provenance

The homepage remains plain HTML/CSS/JavaScript. Calendar and RSVP use a small native Worker and D1 backend on Sites. `dist/server/index.js` embeds the canonical frontend files; it is generated output, not an independent source. A static host can serve the presentation site, but it cannot save RSVPs or manage events without the backend. See [calendar operations](docs/CALENDAR.md).

Barlow Condensed is distributed under the SIL Open Font License; see `assets/fonts/OFL.txt`. Photography sources and permissions are recorded in `docs/PHOTO-CREDITS.json`.
