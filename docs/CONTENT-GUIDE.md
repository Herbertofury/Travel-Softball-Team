# Make it your team

All ordinary content changes belong in `site.config.js`. The current Aftershock identity, player names, Colorado home base, and events are illustrative concept data, not confirmed team facts. The footer identifies this as a concept preview; set `preview: false` only after replacing the sample details and photos with approved team content.

| Change | Location in config |
|---|---|
| Name, monogram, home base, season, colors | `brand` |
| Page title and search description | `meta` |
| Main headline, introduction, hero image | `hero` |
| Team story and standards | `story` |
| Players, numbers, positions, public profile links | `roster` |
| Events, dates, locations, field links | `schedule` |
| Photo viewer images and captions | `gallery` |
| Sponsors and logos | `sponsors`, `sponsorship` |
| Team email, phone, social accounts | `contact` |

## Photos

Replace `assets/images/hero.webp`, `game.webp`, and `team.webp`, or change their paths in the config. Use a landscape hero and two portrait images. The current photographs show softball, but do not depict this illustrative team. See `PHOTO-CREDITS.json` for provenance and reuse terms. Player cards support an optional `image` path; leave it empty to use the clean number-led design.

Headline fields support only `<br>` and `<em>`. Other text is safely escaped. Links accept ordinary web URLs; empty optional links are not shown. Missing images never leave a broken-image icon.

## Calendar

`/calendar` is the full month/agenda calendar; `/rsvp` collects attendance. An event needs a stable `id`, `startDate`, and `endDate` in `YYYY-MM-DD` format. `endDate` is the last included day; all-day exports correctly write the next day as the exclusive iCalendar end. Timed events use `startTime`/`endTime` in `HH:MM` and the configured `America/Denver` timezone. Optional fields include arrival time, RSVP deadline, and details. Sample events are marked illustrative inside the UI and calendar descriptions.

The config supplies the initial sample schedule. Signed-in owners can create/edit/cancel events through the calendar; these durable D1 records override config events by ID. The homepage, full calendar, and exports read the same merged schedule. See [CALENDAR.md](CALENDAR.md) for permissions and storage behavior.

## Contact

No email or phone has been invented. Add the team's real approved contact details. The sponsorship link then opens a correctly addressed email. The page does not collect submissions or pretend to deliver messages.

## Publishing anywhere

Open `index.html` directly to review the presentation site. The full calendar and RSVP app requires its Worker/D1 backend: run `npm ci`, then `npm run build`. Publish the generated adapter using the existing Sites identity. Schema changes require `npm run db:generate`; inspect and retain the generated SQL and metadata before publishing. Keep the source repo and the Sites deployment together; do not edit only `dist/`.

For Wix, Webflow, or Squarespace, carry the same content model and design into that host as an adapter. Keep this repository authoritative.
