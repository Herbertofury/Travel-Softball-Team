/* Sites adapter. SITE and ASSETS are injected from the canonical source at build time. */
const json = (value, status=200) => new Response(JSON.stringify(value), {status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail = (status,message) => {throw Object.assign(new Error(message),{status});};
const database = env => env.DB || fail(503,'The team calendar is temporarily unavailable. Please try again.');
const nativeOrigins = new Set(['capacitor://localhost','https://localhost']);
const hashToken = async value => btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const identity = async (request,env) => {
  let id=request.headers.get('oai-authenticated-user-id');
  let email=request.headers.get('oai-authenticated-user-email');
  const authorization=request.headers.get('Authorization');
  if(authorization){
    if(!/^Bearer [A-Za-z0-9_-]{43}$/.test(authorization))fail(401,'Please sign in again.');
    const record=await database(env).prepare('SELECT user_id,email FROM app_sessions WHERE token_hash=? AND expires_at>?').bind(await hashToken(authorization.slice(7)),Date.now()).first();
    if(!record)fail(401,'Your app session has expired. Please sign in again.');
    id=record.user_id;email=record.email;
  }
  const admins=(env.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  return {id,canManage:!!id && !!email && admins.includes(email.toLowerCase())};
};
const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:SITE.calendar.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const validDate = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s;
const clean = (v,max,required=false) => {
  if(typeof v!=='string' || v.length>max || (required && !v.trim()))fail(400,'Please check the required fields and text lengths.');
  return v.trim();
};
async function body(request,allowNativePublic=false) {
  if(!request.headers.get('content-type')?.includes('application/json'))fail(415,'Please submit the form as JSON.');
  const origin=request.headers.get('origin');
  if(!origin || (origin!==new URL(request.url).origin && !(nativeOrigins.has(origin) && (request.headers.has('Authorization')||allowNativePublic))))fail(403,'Please submit this form from the team website or app.');
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
  const who=await identity(request,env),db=database(env),path=url.pathname;
  if(path==='/api/app-auth/start' && request.method==='POST'){
    const input=await body(request,true);
    if(!/^[A-Za-z0-9_-]{43}$/.test(input.challenge||'')||!['ios','android'].includes(input.platform))fail(400,'The app sign-in request is invalid.');
    const requestId=crypto.randomUUID(),expiresAt=Date.now()+5*60*1000;
    await db.batch([db.prepare('DELETE FROM app_connections WHERE expires_at<?').bind(Date.now()),db.prepare('DELETE FROM app_sessions WHERE expires_at<?').bind(Date.now()),db.prepare('INSERT INTO app_connections (request_id,challenge,platform,expires_at) VALUES (?,?,?,?)').bind(requestId,input.challenge,input.platform,expiresAt)]);
    return json({requestId,expiresAt,approvalUrl:new URL('/connect-app?request='+requestId,url.origin).href},201);
  }
  if(path==='/api/app-auth/connection' && request.method==='GET'){
    const row=await db.prepare('SELECT platform,expires_at,user_id FROM app_connections WHERE request_id=? AND expires_at>?').bind(url.searchParams.get('request')||'',Date.now()).first();
    if(!row)fail(410,'This app connection expired. Start sign-in again in the app.');
    return json({platform:row.platform,approved:!!row.user_id,signedIn:!!who.id});
  }
  if(path==='/api/app-auth/approve' && request.method==='POST'){
    if(!who.id || request.headers.has('Authorization'))fail(401,'Sign in on the team website to connect this phone.');
    const input=await body(request);
    const row=await db.prepare('UPDATE app_connections SET user_id=?,email=? WHERE request_id=? AND expires_at>? AND user_id IS NULL RETURNING request_id').bind(who.id,request.headers.get('oai-authenticated-user-email'),input.requestId||'',Date.now()).first();
    if(!row)fail(410,'This connection expired or has already been approved.');
    return json({approved:true});
  }
  if(path==='/api/app-auth/exchange' && request.method==='POST'){
    const input=await body(request,true);
    if(!/^[A-Za-z0-9_-]{43,128}$/.test(input.verifier||''))fail(400,'The sign-in proof is invalid.');
    const challenge=await hashToken(input.verifier);
    const pending=await db.prepare('SELECT challenge,user_id FROM app_connections WHERE request_id=? AND expires_at>?').bind(input.requestId||'',Date.now()).first();
    if(!pending)fail(410,'This app connection expired or was already completed.');
    if(challenge!==pending.challenge)fail(403,'This connection belongs to a different phone.');
    if(!pending.user_id)return json({pending:true},202);
    const token=crypto.getRandomValues(new Uint8Array(32)),plain=btoa(String.fromCharCode(...token)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    const tokenHash=await hashToken(plain),expiresAt=Date.now()+30*24*60*60*1000;
    const result=await db.batch([
      db.prepare('INSERT INTO app_sessions (token_hash,user_id,email,expires_at) SELECT ?,user_id,email,? FROM app_connections WHERE request_id=? AND challenge=? AND expires_at>? AND user_id IS NOT NULL').bind(tokenHash,expiresAt,input.requestId||'',challenge,Date.now()),
      db.prepare('DELETE FROM app_connections WHERE request_id=? AND challenge=? AND user_id IS NOT NULL').bind(input.requestId||'',challenge)
    ]);
    if(result[0].meta.changes!==1)fail(410,'This connection was already completed.');
    return json({token:plain,expiresAt});
  }
  if(path==='/api/app-auth/revoke' && request.method==='POST'){
    if(!who.id)fail(401,'Sign in to disconnect this app.');await body(request);
    if(request.headers.has('Authorization'))await db.prepare('DELETE FROM app_sessions WHERE token_hash=?').bind(await hashToken(request.headers.get('Authorization').slice(7))).run();
    return json({revoked:true});
  }
  if(path==='/api/my-data' && request.method==='DELETE'){
    if(!who.id)fail(401,'Sign in to remove your attendance data.');await body(request);
    await db.batch([db.prepare('DELETE FROM rsvps WHERE user_id=?').bind(who.id),db.prepare('DELETE FROM app_sessions WHERE user_id=?').bind(who.id),db.prepare('DELETE FROM app_connections WHERE user_id=?').bind(who.id)]);
    return json({deleted:true});
  }
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
    const origin=request.headers.get('Origin');
    const cors=response=>{if(nativeOrigins.has(origin)){const headers=new Headers(response.headers);headers.set('Access-Control-Allow-Origin',origin);headers.set('Vary','Origin');return new Response(response.body,{status:response.status,headers});}return response;};
    try {
      if(request.method==='OPTIONS' && url.pathname.startsWith('/api/')){if(!nativeOrigins.has(origin))return new Response(null,{status:403});return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Max-Age':'600','Vary':'Origin'}});}
      if(url.pathname.startsWith('/api/')||url.pathname==='/calendar.ics')return cors(await api(request,env,url));
      if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
      const route={'/':'/index.html','/calendar':'/calendar.html','/calendar/':'/calendar.html','/rsvp':'/rsvp.html','/rsvp/':'/rsvp.html','/team-app':'/mobile/web-index.html','/team-app/':'/mobile/web-index.html','/connect-app':'/connect-app.html','/privacy':'/privacy.html','/delete-data':'/delete-data.html'};
      const asset=ASSETS[route[url.pathname]||url.pathname];
      if(!asset)return new Response('Page not found',{status:404});
      const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
      return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':asset.type.includes('text/html')||asset.type.includes('javascript')||asset.type.includes('css')?'no-cache':'public, max-age=3600','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self'; worker-src 'self'; base-uri 'self'; frame-ancestors 'self' https://chatgpt.com; form-action 'self'"}});
    } catch(error){if(!error.status)console.error('Calendar request failed:',error.message);return cors(json({error:error.status?error.message:'The team calendar is temporarily unavailable. Your changes have not been saved. Please try again.'},error.status||503));}
  }
};
