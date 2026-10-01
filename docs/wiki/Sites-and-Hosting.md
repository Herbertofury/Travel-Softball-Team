# Sites and hosting

The canonical presentation site is plain HTML, CSS, and vanilla JavaScript. Its full calendar and RSVP pages add a native Worker/D1 adapter, without a UI framework.

For Sites, run `npm ci`, `npm run build`, and `npm test`, then publish the exact source state using the existing project identity in `.openai/hosting.json`. Schema changes require generated Drizzle migrations before building. Owner permissions use the private `ADMIN_EMAILS` environment value.

Keep `site.config.js` authoritative for initial content; event edits and RSVPs persist in D1. `dist/` is generated output. Calendar operations are documented in `docs/CALENDAR.md`; deployment notes are in `docs/DEPLOYMENT.md`.
