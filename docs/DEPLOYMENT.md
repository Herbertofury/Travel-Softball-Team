# Sites deployment

The private Site is registered as `appgprj_6abeb98c3da88191b5999addc1a5bc6f`. This document is updated with the literal URL only after a successful native deployment result.

## Source and content

The root HTML/CSS/JavaScript and `site.config.js` are authoritative. `dist/` is the deterministic static Sites adapter. Working identity: Aftershock; all team/player/event facts are illustrative. Contact details remain unconfigured. Photography is clearly identified as illustrative in the footer and source guide.

## Runtime verification

Real Chromium loads the local static adapter; filters, dialog navigation, mobile menu, and a downloaded iCalendar file are exercised. The final receipt will record viewport, text-enlargement, image, JavaScript-error, and fresh-extraction checks.

## Durability

GitHub updates are staged on `sites/aftershock-editorial` for review. Direct `main` publication was rejected by automatic approval review and remains pending explicit user authorization. Live wiki publication is also pending that final repository publication step. A complete portable archive is provided alongside the Site.

## Implementation decisions

Retained the zero-build architecture required by AGENTS.md. Framework migration and UI libraries would add complexity without improving this presentation site. Reused native HTML dialog and iCalendar export rather than third-party viewer/calendar packages. Fonts and photography are local; below-fold images are lazy-loaded. The page has no trackers, remote font dependencies, auto-updaters, or runtime service dependencies.

## Verification environment recovery

The default Playwright browser was absent. Its download CDN returned a 195-byte HTML "Site Unavailable" response, not a ZIP. The materially different successful route used the official `@sparticuz/chromium` npm package (153.0.0), decompressed its real Chromium executable, and drove that executable with Playwright. This affects only the isolated QA toolchain, not the site or its dependencies. Reuse this route when the default browser/CDN is unavailable.
