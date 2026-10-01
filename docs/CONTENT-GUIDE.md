# Content and Photo Swap Guide

## One-file content workflow

For normal updates, edit only `site.config.js`.

### Brand

Change:
- `brand.teamName`
- `brand.mark`
- `brand.subtitle`
- `brand.homeBase`
- `brand.season`
- the five brand colors

### Roster

Copy or remove player objects in `roster`. Each player supports jersey number, display name, positions, graduation year, bats/throws, image path, and an optional public recruiting/profile URL.

If `profileUrl` is blank, the player card remains non-clickable rather than pretending a profile exists.

### Schedule

Each schedule item supports an optional `mapUrl`. If blank, the site shows event status instead of a dead map button.

### Photos

Keep real image files local to the repository when possible.

Suggested naming:
- hero: `assets/images/hero.webp`
- players: `assets/images/players/player-##.webp`
- gallery: `assets/images/gallery/game-##.webp`
- sponsors: `assets/images/sponsors/sponsor-##.svg`

### Contact

The site does not ship a fake form. It uses real email, phone, and social links from the config once provided. A proper form can be added later once the final host/backend is selected.
