# Sites and hosting

The canonical page is static HTML, CSS, and vanilla JavaScript. Open `index.html` directly or upload the root site files and `assets/` to any static host.

For Sites, run `python scripts/package-static.py` to refresh `dist/`, then publish the exact source state using the existing project identity in `.openai/hosting.json`.

Keep `site.config.js` authoritative. `dist/` is a generated publishing adapter. The successful deployment and verification receipt is tracked in [DEPLOYMENT.md](https://github.com/Herbertofury/Travel-Softball-Team/blob/main/docs/DEPLOYMENT.md).
