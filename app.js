(() => {
  'use strict';
  const data = window.SOFTBALL_SITE;
  if (!data) return;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const esc = (s='') => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (s,v) => $$(s).forEach(el => {el.textContent=v ?? '';});
  // The authored headline fields allow only line breaks and emphasis, never executable HTML.
  const headline = (s,v) => $$(s).forEach(el => {el.innerHTML=esc(v).replace(/&lt;br\s*\/?&gt;/gi,'<br>').replace(/&lt;(\/?)em&gt;/gi,'<$1em>');});
  const url = (v) => {try { const u=new URL(v,location.href); return ['http:','https:'].includes(u.protocol) ? u.href : ''; } catch {return '';}};
  const photoUrl = (v) => { if(typeof v!=='string' || !v.trim()) return ''; if(!/^[a-z][a-z0-9+.-]*:/i.test(v) && !v.startsWith('//')) return v; return url(v); };
  const external = (v) => typeof v==='string' && /^https?:\/\//i.test(v) ? url(v) : '';
  Object.entries(data.brand.colors || {}).forEach(([k,v]) => {if(/^#[\da-f]{3,8}$/i.test(v)) document.documentElement.style.setProperty('--'+k,v);});
  document.title=data.meta.title;
  $('meta[name="description"]').content=data.meta.description;
  $('meta[name="theme-color"]').content=data.brand.colors.ink;
  text('[data-team-name]',data.brand.teamName);text('[data-team-mark]',data.brand.mark);text('[data-team-subtitle]',data.brand.subtitle);
  text('[data-home-base]',data.brand.homeBase);text('[data-season]',data.brand.season);text('[data-year]',new Date().getFullYear());
  text('[data-preview-note]', data.preview ? 'CONCEPT PREVIEW · Illustrative team details and photography.' : '');
  text('[data-hero-eyebrow]',data.hero.eyebrow);headline('[data-hero-title]',data.hero.title);text('[data-hero-intro]',data.hero.intro);text('[data-hero-caption]',data.hero.caption);
  if(photoUrl(data.hero.image)) {
    const img=document.createElement('img');img.alt=data.hero.imageAlt;img.decoding='async';img.fetchPriority='high';img.src=photoUrl(data.hero.image);
    img.addEventListener('error',()=>img.remove(),{once:true});$('[data-hero-photo]').append(img);
  }
  $('[data-ticker-track]').innerHTML=(data.hero.ticker||[]).map(x=>'<span>'+esc(x)+'</span>').join('<i></i>');
  headline('[data-story-title]',data.story.title);text('[data-story-lede]',data.story.lede);text('[data-story-body]',data.story.body);
  $('[data-stats]').innerHTML=(data.story.stats||[]).map(s=>`<div class="stat-card"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('');
  let filter='ALL';
  const filters=$('[data-position-filters]');
  const positions=['ALL',...new Set((data.roster||[]).flatMap(p=>p.positions||[]))];
  filters.innerHTML=positions.map(p=>`<button type="button" class="filter-button ${p==='ALL'?'is-active':''}" aria-pressed="${p==='ALL'}" data-filter="${esc(p)}">${p==='ALL'?'All players':esc(p)}</button>`).join('');
  function renderRoster() {
    const players=(data.roster||[]).filter(p=>filter==='ALL'||(p.positions||[]).includes(filter));
    text('[data-roster-count]',`${players.length} player${players.length===1?'':'s'}`);
    $('[data-roster-grid]').innerHTML=players.length ? players.map(p=> {
      const link=external(p.profileUrl);const tag=link?'a':'article';
      const photo=photoUrl(p.image) ? `<img class="player-portrait" src="${esc(photoUrl(p.image))}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : '';
      return `<${tag} class="player-card" ${link?`href="${esc(link)}" target="_blank" rel="noopener noreferrer"`:''}><span class="player-number">${esc(p.number)}</span>${photo}<div class="player-info"><h3>${esc(p.name)}</h3><p>${esc((p.positions||[]).join(' / '))}</p><div class="player-detail">${p.batsThrows?'B/T '+esc(p.batsThrows):''}${p.gradYear?' · Class of '+esc(p.gradYear):''}</div></div></${tag}>`;
    }).join('') : '<p class="empty-state">Roster announcements are on the way.</p>';
    $$('.player-portrait').forEach(img=>img.addEventListener('error',()=>img.remove(),{once:true}));
  }
  filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;$$('[data-filter]',filters).forEach(x=>{const on=x===b;x.classList.toggle('is-active',on);x.setAttribute('aria-pressed',String(on));});renderRoster();});
  renderRoster();
  let events=data.schedule||[];
  const scheduleDate=s=>new Date(s+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'}).toUpperCase();
  function renderSchedule(){
    const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Denver'});
    const upcoming=events.find(e=>!e.cancelled&&e.endDate && e.endDate>=today);
    const next=$('[data-next-event]').closest('a');next.classList.toggle('is-hidden',!upcoming);
    if(upcoming){text('[data-next-event]',upcoming.name);text('[data-next-date]',upcoming.date||scheduleDate(upcoming.startDate));next.href='/calendar?event='+encodeURIComponent(upcoming.id);}
    const list=events.filter(e=>!e.cancelled && e.endDate>=today).slice(0,4);
    $('[data-schedule-list]').innerHTML=list.length ? list.map(e=>`<article class="schedule-row"><div class="date-tile"><span>${esc(e.month||scheduleDate(e.startDate).split(' ')[0])}</span><strong>${esc(e.day||e.startDate.slice(-2))}</strong></div><div class="schedule-name"><h3>${esc(e.name)}</h3><p>${esc(e.date||(scheduleDate(e.startDate)+(e.endDate!==e.startDate?' – '+scheduleDate(e.endDate):'')))} · ${esc(e.type)}</p></div><p class="schedule-location">${esc(e.location)}</p><div class="schedule-action"><a class="schedule-link" href="/calendar?event=${encodeURIComponent(e.id)}">Details & RSVP ↗</a></div></article>`).join('') : '<p class="empty-state">The next season\'s schedule is coming soon.</p>';
  }
  renderSchedule();
  if(location.protocol!=='file:')fetch('/api/events').then(r=>{if(!r.ok)throw new Error();return r.json();}).then(result=>{events=result.events;renderSchedule();}).catch(()=>{const note=$('[data-schedule-load-note]');note.hidden=false;note.textContent='The live schedule could not be loaded. Open the full calendar to try again.';});
  function icsEscape(v=''){return String(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
  const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'') && !Number.isNaN(Date.parse(s));
  const dateStamp=s=>s.replace(/-/g,'');
  const calendarEvents=events.filter(e=>validDate(e.startDate)&&validDate(e.endDate));
  const calendar=$('[data-calendar]');
  if(!calendarEvents.length)calendar.hidden=true;
  calendar.addEventListener('click',()=>{
    if(location.protocol!=='file:'){location.href='/calendar.ics';return;}
    const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z');
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Travel Softball//Team Schedule//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',`X-WR-CALNAME:${icsEscape(data.brand.teamName)} schedule`];
    calendarEvents.forEach((e,i)=>{const end=new Date(e.endDate+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+1);lines.push('BEGIN:VEVENT',`UID:${dateStamp(e.startDate)}-${i}-${data.brand.mark.replace(/[^a-z0-9]/gi,'')}@travel-softball`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${dateStamp(e.startDate)}`,`DTEND;VALUE=DATE:${dateStamp(end.toISOString().slice(0,10))}`,`SUMMARY:${icsEscape(e.name)}`,`LOCATION:${icsEscape(e.location)}`,`DESCRIPTION:${icsEscape(data.preview?'Illustrative concept schedule. Replace with confirmed team events.':e.type)}`,'END:VEVENT');});
    lines.push('END:VCALENDAR');
    const fold=line=>{let out='',column=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(column+n>73){out+='\r\n ';column=1;}out+=c;column+=n;}return out;};
    const blob=new Blob([lines.map(fold).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});
    const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=data.brand.teamName.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-schedule.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);
  });
  headline('[data-gallery-title]',data.gallery.title);text('[data-gallery-copy]',data.gallery.copy);
  const photos=(data.gallery.photos||[]).filter(p=>photoUrl(p.src));
  $('[data-gallery-grid]').innerHTML=photos.map((p,i)=>`<button class="gallery-card" type="button" data-photo="${i}" aria-label="View photo: ${esc(p.alt)}"><img src="${esc(photoUrl(p.src))}" alt="${esc(p.alt)}" loading="lazy" decoding="async"><span class="gallery-caption">${esc(p.caption||p.alt)}<span aria-hidden="true">＋</span></span></button>`).join('');
  $$('.gallery-card img').forEach(img=>img.addEventListener('error',()=>{img.remove();},{once:true}));
  const dialog=$('[data-lightbox]');let photoIndex=0;
  function showPhoto(index){photoIndex=(index+photos.length)%photos.length;const p=photos[photoIndex];$('[data-lightbox-image]').src=photoUrl(p.src);$('[data-lightbox-image]').alt=p.alt;text('[data-lightbox-caption]',p.caption||p.alt);text('[data-photo-index]',`${photoIndex+1} / ${photos.length}`);}
  $('[data-gallery-grid]').addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(!b)return;showPhoto(Number(b.dataset.photo));dialog.showModal();document.body.style.overflow='hidden';});
  $('.lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.style.overflow='');
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
  $('[data-photo-prev]').addEventListener('click',()=>showPhoto(photoIndex-1));$('[data-photo-next]').addEventListener('click',()=>showPhoto(photoIndex+1));
  headline('[data-sponsor-title]',data.sponsorship.title);text('[data-sponsor-copy]',data.sponsorship.copy);text('[data-sponsor-contact]',data.sponsorship.cta);
  $('[data-sponsor-grid]').innerHTML=(data.sponsors||[]).map(s=>{const link=external(s.url);return `<${link?'a':'div'} class="sponsor-card" ${link?`href="${esc(link)}" target="_blank" rel="noopener noreferrer"`:''}>${photoUrl(s.logo)?`<img src="${esc(photoUrl(s.logo))}" alt="${esc(s.name)}" loading="lazy" decoding="async">`:esc(s.name)}</${link?'a':'div'}>`;}).join('');
  $$('.sponsor-card img').forEach(img=>img.addEventListener('error',()=>{img.replaceWith(document.createTextNode(img.alt));},{once:true}));
  headline('[data-contact-title]',data.contact.title);text('[data-contact-copy]',data.contact.copy);text('[data-footer-copy]',data.footer.copy);
  const links=[];if(data.contact.name)links.push(`<p class="contact-owner"><strong>${esc(data.contact.name)}</strong><span>${esc(data.contact.role||'Team contact')}</span></p>`);const email=data.contact.email?.trim();const phone=data.contact.phone?.replace(/[^+\d]/g,'');
  if(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){links.push(`<a class="contact-link" href="mailto:${esc(email)}"><span>EMAIL THE TEAM</span><strong>${esc(email)}</strong></a>`);$('[data-sponsor-contact]').href='mailto:'+email;}
  if(phone)links.push(`<a class="contact-link" href="tel:${esc(phone)}"><span>CALL THE TEAM</span><strong>${esc(data.contact.phone)}</strong></a>`);
  ['instagram','facebook'].forEach(s=>{if(external(data.contact[s]))links.push(`<a class="contact-link" href="${esc(external(data.contact[s]))}" target="_blank" rel="noopener noreferrer"><span>FOLLOW ALONG</span><strong>${s==='instagram'?'Instagram':'Facebook'}</strong></a>`);});
  $('[data-contact-actions]').innerHTML=links.length?links.join(''):`<p class="contact-empty">${esc(data.contact.empty)}</p>`;
  const menu=$('[data-mobile-menu]'),button=$('[data-menu-button]');
  const closeMenu=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false');$('.sr-only',button).textContent='Open navigation';};
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';menu.hidden=open;button.setAttribute('aria-expanded',String(!open));$('.sr-only',button).textContent=open?'Open navigation':'Close navigation';});
  $$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !menu.hidden){closeMenu();button.focus();}});
  document.addEventListener('click',e=>{if(!menu.hidden && !$('[data-header]').contains(e.target))closeMenu();});
  window.matchMedia('(min-width: 821px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
  if(!data.preview){const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'SportsTeam',name:data.brand.teamName,sport:'Softball',description:data.meta.description});document.head.append(schema);}
})();
