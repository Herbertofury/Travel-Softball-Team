/* Sites adapter. SITE and ASSETS are injected from the canonical source at build time. */
const json = (value, status=200) => new Response(JSON.stringify(value), {status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail = (status,message) => {throw Object.assign(new Error(message),{status});};
const database = env => env.DB || fail(503,'The team calendar is temporarily unavailable. Please try again.');
const identity = (request,env) => {
  const id=request.headers.get('oai-authenticated-user-id');
  const email=request.headers.get('oai-authenticated-user-email');
  const admins=(env.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  return {id,canManage:!!id && !!email && admins.includes(email.toLowerCase())};
};
const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:SITE.calendar.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const validDate = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s;
const clean = (v,max,required=false) => {
  if(typeof v!=='string' || v.length>max || (required && !v.trim()))fail(400,'Please check the required fields and text lengths.');
  return v.trim();
};
async function body(request) {
  if(!request.headers.get('content-type')?.includes('application/json'))fail(415,'Please submit the form as JSON.');
  const origin=request.headers.get('origin');
  if(!origin || origin!==new URL(request.url).origin)fail(403,'Please submit this form from the team website.');
  if(Number(request.headers.get('content-length'))>12000)fail(413,'The form is too large.');
  const raw=await request.text();if(raw.length>12000)fail(413,'The form is too large.');
  try{const value=JSON.parse(raw);if(!value || Array.isArray(value) || typeof value!=='object')throw new Error();return value;}catch{fail(400,'The form could not be read. Please check your entries.');}
}
async function eventsFor(env) {
  const rows=await database(env).prepare('SELECT id,payload,updated_at FROM events').all();
  const events=new Map(SITE.schedule.map(e=>[e.id,{...e,revision:null}]));
  for(const row of rows.results)events.set(row.id,{...JSON.parse(row.payload),revision:row.updated_at});
  return [...events.values()].sort((a,b)=>a.startDate.localeCompare(b.startDate)||(a.startTime||'').localeCompare(b.startTime||'')||a.name.localeCompare(b.name));
}
function eventState(e) {return e.cancelled?'cancelled':e.endDate<today()?'past':e.rsvpDeadline && e.rsvpDeadline<today()?'closed':'open';}
function validateEvent(input,id) {
  const e={id,name:clean(input.name,120,true),location:clean(input.location,200,true),description:clean(input.description||'',2000),type:input.type,startDate:input.startDate,endDate:input.endDate,allDay:input.allDay===true,startTime:input.startTime||'',endTime:input.endTime||'',arrivalTime:input.arrivalTime||'',rsvpDeadline:input.rsvpDeadline||'',cancelled:input.cancelled===true,preview:input.preview===true};
  if(!SITE.calendar.types.includes(e.type))fail(400,'Choose an event type.');
  if(!validDate(e.startDate)||!validDate(e.endDate)||e.endDate<e.startDate)fail(400,'Enter a valid start and end date.');
  if(e.rsvpDeadline && (!validDate(e.rsvpDeadline)||e.rsvpDeadline>e.endDate))fail(400,'The RSVP deadline must be on or before the event ends.');
  const validTime=s=>/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  if(!e.allDay && (!validTime(e.startTime)||!validTime(e.endTime)||(e.startDate===e.endDate && e.endTime<=e.startTime)))fail(400,'Enter an end time after the start time.');
  if(e.arrivalTime && !validTime(e.arrivalTime))fail(400,'Enter a valid arrival time.');
  if(e.allDay){e.startTime='';e.endTime='';}
  return e;
}
function icsEscape(v=''){return String(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function calendarFile(events) {
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z/,'Z');
  const compact=s=>s.replace(/-/g,'');
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aftershock//Team Calendar//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',`X-WR-CALNAME:${icsEscape(SITE.brand.teamName+' calendar')}`,`X-WR-TIMEZONE:${SITE.calendar.timezone}`];
  for(const e of events){
    lines.push('BEGIN:VEVENT',`UID:${e.id}@travel-softball`,`DTSTAMP:${stamp}`);
    if(e.allDay){const end=new Date(e.endDate+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+1);lines.push(`DTSTART;VALUE=DATE:${compact(e.startDate)}`,`DTEND;VALUE=DATE:${compact(end.toISOString().slice(0,10))}`);}
    else {lines.push(`DTSTART;TZID=${SITE.calendar.timezone}:${compact(e.startDate)}T${e.startTime.replace(':','')}00`,`DTEND;TZID=${SITE.calendar.timezone}:${compact(e.endDate)}T${e.endTime.replace(':','')}00`);}
    lines.push(`SUMMARY:${icsEscape(e.name)}`,`LOCATION:${icsEscape(e.location)}`,`DESCRIPTION:${icsEscape((e.preview?'ILLUSTRATIVE EVENT. ':'')+e.description)}`,`STATUS:${e.cancelled?'CANCELLED':'CONFIRMED'}`,'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  const fold=line=>{let out='',column=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(column+n>73){out+='\r\n ';column=1;}out+=c;column+=n;}return out;};
  return new Response(lines.map(fold).join('\r\n')+'\r\n',{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'attachment; filename="aftershock-calendar.ics"','Cache-Control':'no-cache'}});
}
async function api(request,env,url) {
  const who=identity(request,env),db=database(env),path=url.pathname;
  if(request.method==='GET' && path==='/api/session')return json({signedIn:!!who.id,canManage:who.canManage});
  if(request.method==='GET' && (path==='/api/events'||path==='/calendar.ics')){
    const events=await eventsFor(env);
    if(path==='/calendar.ics'){const id=url.searchParams.get('event');if(id && !events.some(e=>e.id===id))fail(404,'Event not found.');return calendarFile(id?events.filter(e=>e.id===id):events);}
    const counts=await db.prepare('SELECT event_id,status,COUNT(*) AS responses,SUM(guests) AS guests FROM rsvps GROUP BY event_id,status').all();
    const mine=who.id?(await db.prepare('SELECT event_id,display_name,status,guests,note,updated_at FROM rsvps WHERE user_id=?').bind(who.id).all()).results:[];
    return json({events:events.map(e=>({...e,rsvpState:eventState(e),counts:Object.fromEntries(counts.results.filter(r=>r.event_id===e.id).map(r=>[r.status,{responses:r.responses,guests:r.guests}]))})),mine,session:{signedIn:!!who.id,canManage:who.canManage},timezone:SITE.calendar.timezone});
  }
  if(request.method==='GET' && path==='/api/attendance'){
    if(!who.canManage)fail(403,'Only the site owner can view team responses.');
    const id=url.searchParams.get('event');
    if(!(await eventsFor(env)).some(e=>e.id===id))fail(404,'Event not found.');
    const rows=await db.prepare('SELECT display_name,status,guests,note,updated_at FROM rsvps WHERE event_id=? ORDER BY display_name,updated_at').bind(id).all();
    return json({responses:rows.results});
  }
  if(path==='/api/rsvp' && ['PUT','DELETE'].includes(request.method)){
    if(!who.id)fail(401,'Sign in with ChatGPT to save your response.');
    const input=await body(request),events=await eventsFor(env),event=events.find(e=>e.id===input.eventId);
    if(!event)fail(404,'This event could not be found.');
    if(eventState(event)!=='open')fail(409,'RSVPs are closed for this event.');
    if(request.method==='DELETE'){await db.prepare('DELETE FROM rsvps WHERE event_id=? AND user_id=?').bind(event.id,who.id).run();return json({saved:true});}
    if(!['going','maybe','unavailable'].includes(input.status))fail(400,'Choose an attendance response.');
    const displayName=clean(input.displayName,80,true),note=clean(input.note||'',1000),guests=input.status==='unavailable'?0:input.guests;
    if(!Number.isInteger(guests)||guests<0||guests>10)fail(400,'Guest count must be between 0 and 10.');
    const updatedAt=new Date().toISOString();
    await db.prepare('INSERT INTO rsvps (event_id,user_id,display_name,status,guests,note,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(event_id,user_id) DO UPDATE SET display_name=excluded.display_name,status=excluded.status,guests=excluded.guests,note=excluded.note,updated_at=excluded.updated_at').bind(event.id,who.id,displayName,input.status,guests,note,updatedAt).run();
    return json({saved:true,response:{event_id:event.id,display_name:displayName,status:input.status,guests,note,updated_at:updatedAt}});
  }
  if(path==='/api/events' && ['POST','PUT'].includes(request.method)){
    if(!who.canManage)fail(403,'Only the site owner can manage the schedule.');
    const input=await body(request),isNew=request.method==='POST',id=isNew?crypto.randomUUID():input.id;
    if(!isNew && !(await eventsFor(env)).some(e=>e.id===id))fail(404,'Event not found.');
    const event=validateEvent(input,id),revision=new Date().toISOString()+':'+crypto.randomUUID();
    const row=await db.prepare('INSERT INTO events (id,payload,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at WHERE events.updated_at=? RETURNING id').bind(id,JSON.stringify(event),revision,input.revision||'').first();
    if(!row)fail(409,'This event changed while you were editing. Reload it before saving.');
    return json({saved:true,event:{...event,revision}},isNew?201:200);
  }
  fail(404,'This calendar action was not found.');
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    try {
      if(url.pathname.startsWith('/api/')||url.pathname==='/calendar.ics')return await api(request,env,url);
      if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
      const route={'/':'/index.html','/calendar':'/calendar.html','/calendar/':'/calendar.html','/rsvp':'/rsvp.html','/rsvp/':'/rsvp.html'};
      const asset=ASSETS[route[url.pathname]||url.pathname];
      if(!asset)return new Response('Page not found',{status:404});
      const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
      return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':asset.type.includes('text/html')?'no-cache':'public, max-age=3600','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self'; base-uri 'self'; frame-ancestors 'self' https://chatgpt.com; form-action 'self'"}});
    } catch(error){if(!error.status)console.error('Calendar request failed:',error.message);return json({error:error.status?error.message:'The team calendar is temporarily unavailable. Your changes have not been saved. Please try again.'},error.status||503);}
  }
};
