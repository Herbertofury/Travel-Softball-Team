# Calendar and attendance

The public website has two dedicated pages: `/calendar` and `/rsvp`. Month and agenda views show the same schedule, with month navigation, event-type filters, event details, directions, calendar downloads, and Google Calendar links. Timed events and arrival times use America/Denver. Multi-day all-day events include their final date in the UI and use an exclusive next-day end in iCalendar.

## Families

Choose an upcoming event and sign in with ChatGPT. Save Going, Maybe, or Unavailable, a player/family name, additional guests, and an optional private note. One response is stored per signed-in account per event. The same account can update or remove that response before the deadline. Unavailable responses have zero guests. Closed, cancelled, and past events reject response changes on the server. No messages or emails are sent by the RSVP form.

The calendar is public. Any signed-in visitor can submit their own response. Public visitors see aggregate totals, never respondent names or notes. A respondent sees their own records; the site owner sees all records for an event. Avoid sensitive youth information in names, notes, and public event descriptions.

## Owner

Use **Team sign in** on the calendar. The owner email is configured privately in the Sites `ADMIN_EMAILS` secret. That server-side allowlist enables Add event, Edit event, Cancel event, and View team responses. Event details include type, location, dates, optional times/arrival time, RSVP deadline, and a description. A sample-event checkbox preserves truthful concept labeling. Cancelling retains the event and attendance history. The private attendance view can export a CSV; potentially executable spreadsheet values are escaped.

## Persistence and deployment

`site.config.js` supplies initial events and team branding. D1 stores event overrides and RSVP records. No browser storage is authoritative. Event IDs remain stable so links and responses survive edits; concurrent owner edits reject stale revisions. Identity comes from Sites dispatch headers; the application never trusts a client-provided user ID or permission flag.

The framework-free frontend remains canonical. `scripts/build-worker.mjs` embeds it in a native Workers-compatible module. The hosting manifest declares the logical `DB` D1 binding. `db/schema.ts` is the schema; `drizzle/*.sql` and `drizzle/meta/` are generated migration history. Do not edit an applied migration. Runtime code never creates or alters schema.

Run `npm ci`, `npm run build`, and `npm test`. Tests use a real isolated Miniflare D1 database, including a Worker restart, owner/response authorization, privacy, CSRF protection, validation, stale schedule edits, cancellations, and timed/all-day exports. Test identities are synthetic dispatcher headers only in the isolated test environment. Production sign-in is handled by Sites.

When storage fails, the UI reports the error and retains form input. A success message appears only after the write succeeds. No local-only draft is presented as a saved RSVP.
