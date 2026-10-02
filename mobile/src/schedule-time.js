export function eventInstant(event,timeZone){
  const [year,month,day]=event.startDate.split('-').map(Number);
  const [hour,minute]=(event.allDay?'09:00':event.startTime).split(':').map(Number);
  const wallTime=Date.UTC(year,month-1,day,hour,minute);
  let instant=wallTime;
  for(let i=0;i<3;i++){
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(instant)).map(part=>[part.type,part.value]));
    instant+=wallTime-Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day),Number(parts.hour),Number(parts.minute));
  }
  return new Date(instant);
}
export function reminderInstant(event,timeZone){
  if(!event.allDay)return new Date(eventInstant(event,timeZone).getTime()-86400000);
  const previousDay=new Date(event.startDate+'T12:00:00Z');
  previousDay.setUTCDate(previousDay.getUTCDate()-1);
  return eventInstant({...event,startDate:previousDay.toISOString().slice(0,10)},timeZone);
}
