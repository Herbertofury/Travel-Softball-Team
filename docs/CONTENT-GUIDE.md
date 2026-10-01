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

An event needs `startDate` and `endDate` in `YYYY-MM-DD` format for the schedule download. `endDate` is the last included day; the exporter correctly writes the next day as the exclusive iCalendar end. The downloaded `.ics` imports into Google Calendar, Outlook, or Apple Calendar. Sample events are marked illustrative inside their calendar descriptions.

## Contact

No email or phone has been invented. Add the team's real approved contact details. The sponsorship link then opens a correctly addressed email. The page does not collect submissions or pretend to deliver messages.

## Publishing anywhere

Open `index.html` directly to review. Upload the root page, scripts, stylesheet, and `assets/` folder to any static host. No packages, subscriptions, or build tools are needed. After edits, run `python scripts/package-static.py` to refresh the `dist/` adapter for Sites. Keep the source repo and the Sites deployment together; do not edit only `dist/`.

For Wix, Webflow, or Squarespace, carry the same content model and design into that host as an adapter. Keep this repository authoritative.
