# Sites deployment

Site identity: `appgprj_6abeb98c3da88191b5999addc1a5bc6f`. The previously verified public origin is https://travel-softball-team.becky-herbie-6815.chatgpt.site. Audience: public, as requested by the user. Reuse this identity for edits; do not register another Site.

## Source and runtime

The root HTML/CSS/JavaScript and `site.config.js` remain canonical. `dist/server/index.js` is the generated native Worker adapter, embedding the frontend files. D1 persists event overrides, private RSVP records, and hashed native phone sessions/temporary connection grants. Owner schedule/attendance access is authorized against the private `ADMIN_EMAILS` Sites secret. Trent’s explicitly supplied contact email is public content. Private administration allowlists and credentials remain in Sites.

Working identity: Aftershock. Config brand, roster, and initial events are illustrative; Trent is the public team owner/contact, and his supplied email is authorized for schedule management. Platform Site ownership has not been transferred. Sample events stay explicitly labeled. Owner-created confirmed events can clear their individual sample flag. Homepage, calendar, RSVP, and calendar exports share the API's merged schedule.

## Verification

Real isolated Miniflare D1 tests exercise persistence across restart, identity and owner authorization, response ownership, privacy, CSRF rejection, validation, idempotent updates, stale edit rejection, cancellation, closed/past events, and timed/all-day iCalendar exports. Real Chromium exercises month/agenda navigation, filtering, event dialogs, anonymous sign-in links, owner event creation, response saving/updating/reloading/removal, failed-save input retention, and private attendance. Synthetic auth headers exist only in isolated QA; production identity is supplied by Sites. Production ChatGPT sign-in cannot be claimed as an end-to-end browser test from the isolated QA session.

Viewport checks cover 320, 390, 768, and 1440px and 200% text enlargement. The current browser executable is the real Chromium distributed through `@sparticuz/chromium` 153.0.0, used with Playwright after the default download CDN proved unavailable. This is an isolated QA recovery, not a shipped UI dependency.

## Publication and durability

Run the Sites workflow helper with the opened source result, fresh source credential, matching build, and deployment archive. Save that exact pushed source commit and deploy the returned version while preserving public access. A terminal successful deployment with its native URL is the publication receipt. Generated Drizzle migrations are schema-only and deployed before the Worker; preserve applied history.

GitHub changes are staged on `sites/aftershock-editorial` and draft PR #2 for review. Direct `main` publication was rejected by automatic approval review and remains pending user authorization. Wiki-source pages are in `docs/wiki/`; live wiki publication is not claimed. The repository and Sites source preserve the implementation. A prior Drive checkpoint upload was rejected by automatic approval review, and a prior Library archive save hit its storage limit; those blocked duplicate uploads are not retried as part of calendar publishing.

## Phone companion

`/team-app` serves the installable companion; the same bundled interface ships in the genuine Android/iOS Capacitor projects under `mobile/`. It uses the existing calendar API. Phone sign-in requires an explicit approval in a browser signed in through Sites, a five-minute PKCE challenge, and a hashed, expiring native session. Native credentials use encrypted device storage; the public offline cache excludes attendance and private notes. See `mobile/README.md` and `mobile/store/RELEASE.md` for repeatable builds and account/signing requirements.
