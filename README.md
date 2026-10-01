# Travel Softball Team Website

A fast, portable, design-first starter for a travel softball team.

The canonical site intentionally uses plain HTML, CSS, and JavaScript with no framework or build step. That makes it easy to host almost anywhere, hand to another developer, adapt into a site builder, or use as source material for ChatGPT Sites later.

## Fastest way to customize

1. Open `site.config.js`.
2. Replace the team name, colors, story, roster, schedule, sponsors, and contact details.
3. Drop approved team photos into `assets/images/` using the paths already listed in the config.
4. Open `index.html` in a browser to preview.
5. Publish the folder to your chosen host.

Normal team-content updates should not require editing HTML or CSS.

## Images

Recommended source files:

- `assets/images/hero.webp` - portrait/action hero image
- `assets/images/players/player-01.webp` - player portrait
- `assets/images/gallery/game-01.webp` - game, dugout, practice, travel, and team moments
- `assets/images/sponsors/sponsor-01.svg` - sponsor logo

The site shows deliberate branded fallbacks while images are being collected rather than broken-image icons.

## Hosting targets

Because this is zero-build static HTML, it is a strong fit for:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Hostinger/static hosting
- Any normal Apache/Nginx/static web root

For Squarespace, Wix, or Webflow, treat this repository as the canonical design/content source and port the sections into that platform rather than allowing platform-specific content to become the only copy.

For ChatGPT Sites, use this repository/files as the canonical source and ask Sites to preserve the design system and content model. Keep `site.config.js` as the source of truth so team data does not become trapped in one publishing surface.

## Design principles

- Real sports-editorial hierarchy instead of generic template blocks
- One source of truth for team content
- No fake buttons or dead forms
- Responsive desktop/tablet/mobile behavior
- Keyboard focus and reduced-motion support
- Local assets and no runtime framework dependency
- No analytics, cookies, trackers, or third-party scripts by default

## Next passes

Once real team details and photos are available:

1. Finalize brand colors, team name, logo, and typography.
2. Replace placeholder roster and schedule data.
3. Add real photography and sponsor marks.
4. Add optional public recruiting profile links and event map links.
5. Choose the final host and domain.
6. Add analytics only if the team actually wants them.
