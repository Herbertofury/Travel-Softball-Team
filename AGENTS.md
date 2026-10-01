# Travel Softball Team - Agent Guide

## Product invariant

This site should feel like a deliberate sports editorial identity, not a generic generated template. Preserve strong hierarchy, restrained motion, fast loading, clear mobile behavior, and direct human copy.

## Source of truth

- `site.config.js` owns team-specific content, links, colors, roster, initial schedule, gallery, sponsors, and contact information. Owner-created event overrides and RSVPs live in D1; all pages read them through the same API.
- Do not hardcode duplicate team facts into layout files unless the value is a fallback.
- `index.html` owns semantic page structure.
- `styles.css` owns the visual system.
- `app.js` owns rendering and interactions.
- `calendar.html`, `rsvp.html`, `calendar.css`, and `calendar.js` own the scheduling UI. `worker/api.js` owns persistence, authentication, and server authorization. Generated Drizzle migrations own schema changes.

## Portability

Keep the canonical site framework-free and zero-build unless a future requirement clearly needs a framework. Any platform-specific version should be treated as an adapter of this canonical source, not a new independent truth.

## UI rules

- No fake forms, fake success states, empty buttons, or dead navigation.
- Optional links must disappear or become truthful non-clickable states when their URL is absent.
- Missing images must degrade to intentional branded fallback blocks, never broken-image icons.
- Respect `prefers-reduced-motion`.
- Preserve keyboard focus visibility and semantic headings.

## Performance

Do not add large UI libraries for effects that CSS or small vanilla JavaScript can provide. Prefer local optimized WebP/AVIF imagery, lazy-load non-hero images, and keep third-party scripts out unless they provide clear required value.

## Content/privacy

Do not add private player information, birth dates, home addresses, personal phone numbers, or other sensitive youth data to the public site. Only publish player/recruiting details the team has intentionally approved for public use.
