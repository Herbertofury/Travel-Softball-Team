(() => {
  "use strict";

  const data = window.SOFTBALL_SITE;
  if (!data) {
    document.body.innerHTML = '<main style="font-family:system-ui;padding:3rem"><h1>Missing site.config.js</h1><p>Make sure site.config.js loads before app.js.</p></main>';
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const setTextAll = (selector, value) => {
    $$(selector).forEach((el) => { el.textContent = value; });
  };

  const setHtmlAll = (selector, value) => {
    $$(selector).forEach((el) => { el.innerHTML = value; });
  };

  const isMeaningfulUrl = (value) => typeof value === "string" && value.trim() !== "";

  function applyBrand() {
    const root = document.documentElement;
    const colors = data.brand.colors || {};
    root.style.setProperty("--ink", colors.ink || "#101217");
    root.style.setProperty("--paper", colors.paper || "#f5f0e7");
    root.style.setProperty("--primary", colors.primary || "#ef4b31");
    root.style.setProperty("--accent", colors.accent || "#8ce6d2");
    root.style.setProperty("--warm", colors.warm || "#e8dcc8");

    document.title = data.meta?.title || `${data.brand.teamName} | Travel Softball`;
    const description = $('meta[name="description"]');
    if (description) description.content = data.meta?.description || "Travel softball team website";
    const theme = $('meta[name="theme-color"]');
    if (theme) theme.content = colors.ink || "#101217";

    setTextAll("[data-team-name]", data.brand.teamName);
    setTextAll("[data-team-mark]", data.brand.mark);
    setTextAll("[data-team-subtitle]", data.brand.subtitle);
    setTextAll("[data-home-base]", data.brand.homeBase);
    setTextAll("[data-season]", data.brand.season);
    setTextAll("[data-year]", new Date().getFullYear());
  }

  function renderHero() {
    setTextAll("[data-hero-eyebrow]", data.hero.eyebrow);
    setHtmlAll("[data-hero-title]", data.hero.title);
    setTextAll("[data-hero-intro]", data.hero.intro);

    const photo = $("[data-hero-photo]");
    if (photo && isMeaningfulUrl(data.hero.image)) {
      const img = new Image();
      img.src = data.hero.image;
      img.alt = data.hero.imageAlt || "Team photo";
      img.decoding = "async";
      img.fetchPriority = "high";
      img.addEventListener("load", () => {
        photo.innerHTML = "";
        photo.append(img);
        photo.classList.add("has-image");
      });
    }

    const track = $("[data-ticker-track]");
    const items = data.hero.ticker || [];
    if (track && items.length) {
      const loop = [...items, ...items]
        .map((item) => `<span>${escapeHtml(item)}</span><i></i>`)
        .join("");
      track.innerHTML = loop;
    }
  }

  function renderStory() {
    setTextAll("[data-story-title]", data.story.title);
    setTextAll("[data-story-lede]", data.story.lede);
    setTextAll("[data-story-body]", data.story.body);

    const stats = $("[data-stats]");
    if (!stats) return;
    stats.innerHTML = (data.story.stats || []).map((stat) => `
      <div class="stat-card">
        <strong>${escapeHtml(stat.value)}</strong>
        <span>${escapeHtml(stat.label)}</span>
      </div>
    `).join("");
  }

  let rosterFilter = "ALL";

  function rosterPositions() {
    const values = new Set();
    (data.roster || []).forEach((player) => (player.positions || []).forEach((position) => values.add(position)));
    return ["ALL", ...values];
  }

  function renderRosterFilters() {
    const filters = $("[data-position-filters]");
    if (!filters) return;
    filters.innerHTML = rosterPositions().map((position) => `
      <button class="filter-button ${position === rosterFilter ? "is-active" : ""}" type="button" data-filter="${escapeHtml(position)}">
        ${escapeHtml(position)}
      </button>
    `).join("");

    $$("[data-filter]", filters).forEach((button) => {
      button.addEventListener("click", () => {
        rosterFilter = button.dataset.filter;
        renderRosterFilters();
        renderRoster();
      });
    });
  }

  function playerPhoto(player) {
    const alt = `${player.name} - ${player.positions.join(" / ")}`;
    return `
      <div class="player-photo" data-photo-shell>
        <img src="${escapeHtml(player.image)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" data-fallback-image>
        <div class="player-fallback" aria-hidden="true">
          <span>${escapeHtml(player.number)}</span>
          <small>ADD PLAYER PHOTO</small>
        </div>
      </div>
    `;
  }

  function renderRoster() {
    const grid = $("[data-roster-grid]");
    const count = $("[data-roster-count]");
    if (!grid) return;

    const players = (data.roster || []).filter((player) => (
      rosterFilter === "ALL" || (player.positions || []).includes(rosterFilter)
    ));

    if (count) count.textContent = `${players.length} PLAYER${players.length === 1 ? "" : "S"}`;

    grid.innerHTML = players.map((player, index) => {
      const cardTag = isMeaningfulUrl(player.profileUrl) ? "a" : "article";
      const cardAttrs = isMeaningfulUrl(player.profileUrl)
        ? `href="${escapeHtml(player.profileUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(player.name)} profile"`
        : "";
      return `
        <${cardTag} class="player-card reveal is-visible" ${cardAttrs} style="--card-delay:${index * 45}ms">
          ${playerPhoto(player)}
          <div class="player-number">#${escapeHtml(player.number)}</div>
          <div class="player-info">
            <div>
              <h3>${escapeHtml(player.name)}</h3>
              <p>${escapeHtml((player.positions || []).join(" / "))}</p>
            </div>
            <dl>
              <div><dt>GRAD</dt><dd>${escapeHtml(player.gradYear)}</dd></div>
              <div><dt>B/T</dt><dd>${escapeHtml(player.batsThrows)}</dd></div>
            </dl>
          </div>
        </${cardTag}>
      `;
    }).join("");

    $$("[data-fallback-image]", grid).forEach((img) => {
      const markFailed = () => img.closest("[data-photo-shell]")?.classList.add("show-fallback");
      img.addEventListener("error", markFailed, { once: true });
      if (img.complete && img.naturalWidth === 0) markFailed();
    });
  }

  function renderSchedule() {
    const list = $("[data-schedule-list]");
    if (!list) return;

    list.innerHTML = (data.schedule || []).map((event, index) => {
      const action = isMeaningfulUrl(event.mapUrl)
        ? `<a href="${escapeHtml(event.mapUrl)}" target="_blank" rel="noopener noreferrer" class="schedule-link">MAP <span aria-hidden="true">↗</span></a>`
        : `<span class="schedule-status">${escapeHtml(event.status || "UPCOMING")}</span>`;
      return `
        <article class="schedule-row reveal" data-delay="${Math.min(index, 3)}">
          <div class="schedule-index">${String(index + 1).padStart(2, "0")}</div>
          <div class="schedule-date">${escapeHtml(event.date)}</div>
          <div class="schedule-name">
            <h3>${escapeHtml(event.name)}</h3>
            <p>${escapeHtml(event.type)}</p>
          </div>
          <div class="schedule-location">${escapeHtml(event.location)}</div>
          <div class="schedule-action">${action}</div>
        </article>
      `;
    }).join("");
  }

  function renderGallery() {
    const grid = $("[data-gallery-grid]");
    const copy = $("[data-gallery-copy]");
    if (copy) copy.textContent = data.gallery?.copy || "";
    if (!grid) return;

    const photos = data.gallery?.photos || [];
    grid.innerHTML = photos.map((photo, index) => `
      <figure class="gallery-card gallery-card-${(index % 5) + 1} reveal" data-delay="${index % 3}">
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async" data-gallery-image>
        <div class="gallery-fallback">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <small>ADD TEAM PHOTO</small>
        </div>
      </figure>
    `).join("");

    $$("[data-gallery-image]", grid).forEach((img) => {
      const markFailed = () => img.parentElement?.classList.add("show-fallback");
      img.addEventListener("error", markFailed, { once: true });
      if (img.complete && img.naturalWidth === 0) markFailed();
    });
  }

  function renderSponsors() {
    const grid = $("[data-sponsor-grid]");
    if (!grid) return;

    grid.innerHTML = (data.sponsors || []).map((sponsor) => {
      const inner = `
        <img src="${escapeHtml(sponsor.logo)}" alt="${escapeHtml(sponsor.name)} logo" loading="lazy" decoding="async" data-sponsor-logo>
        <span class="sponsor-fallback">${escapeHtml(sponsor.name)}</span>
      `;
      return isMeaningfulUrl(sponsor.url)
        ? `<a class="sponsor-card" href="${escapeHtml(sponsor.url)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
        : `<div class="sponsor-card">${inner}</div>`;
    }).join("");

    $$("[data-sponsor-logo]", grid).forEach((img) => {
      const markFailed = () => img.parentElement?.classList.add("show-fallback");
      img.addEventListener("error", markFailed, { once: true });
      if (img.complete && img.naturalWidth === 0) markFailed();
    });
  }

  function renderContact() {
    setHtmlAll("[data-contact-title]", data.contact.title);
    setTextAll("[data-contact-copy]", data.contact.copy);
    setTextAll("[data-footer-copy]", data.footer?.copy || "");

    const actions = $("[data-contact-actions]");
    if (!actions) return;

    const links = [];
    if (data.contact.email) links.push(`<a class="contact-link" href="mailto:${escapeHtml(data.contact.email)}"><span>EMAIL</span><strong>${escapeHtml(data.contact.email)}</strong></a>`);
    if (data.contact.phone) links.push(`<a class="contact-link" href="tel:${escapeHtml(data.contact.phone.replace(/[^+\\d]/g, ""))}"><span>PHONE</span><strong>${escapeHtml(data.contact.phone)}</strong></a>`);
    if (data.contact.instagram) links.push(`<a class="contact-link" href="${escapeHtml(data.contact.instagram)}" target="_blank" rel="noopener noreferrer"><span>SOCIAL</span><strong>Instagram ↗</strong></a>`);
    if (data.contact.facebook) links.push(`<a class="contact-link" href="${escapeHtml(data.contact.facebook)}" target="_blank" rel="noopener noreferrer"><span>SOCIAL</span><strong>Facebook ↗</strong></a>`);
    actions.innerHTML = links.length
      ? links.join("")
      : '<p class="contact-empty">Contact details will be added here.</p>';

    const preferred = data.contact.email ? `mailto:${data.contact.email}` : "#contact";
    $$("[data-contact-link], [data-sponsor-contact]").forEach((link) => { link.href = preferred; });
  }

  function renderStructuredData() {
    const json = {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: data.brand.teamName,
      sport: "Softball",
      description: data.meta?.description,
      email: data.contact?.email || undefined,
      location: data.brand?.homeBase || undefined,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(json);
    document.head.append(script);
  }

  function wireMenu() {
    const button = $("[data-menu-button]");
    const menu = $("[data-mobile-menu]");
    if (!button || !menu) return;

    const close = () => {
      button.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    $$("a", menu).forEach((link) => link.addEventListener("click", close));
    window.addEventListener("resize", () => { if (window.innerWidth > 820) close(); }, { passive: true });
  }

  function wireHeader() {
    const header = $("[data-header]");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function wireReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  applyBrand();
  renderHero();
  renderStory();
  renderRosterFilters();
  renderRoster();
  renderSchedule();
  renderGallery();
  renderSponsors();
  renderContact();
  renderStructuredData();
  wireMenu();
  wireHeader();
  requestAnimationFrame(wireReveal);
})();
