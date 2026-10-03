const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {year:'numeric',month:'numeric',day:'numeric'});
export const fa = (n:number) => new Intl.NumberFormat('fa-IR',{useGrouping:false}).format(n);
export function persian(date:Date) {
  const p = Object.fromEntries(parts.formatToParts(date).map(p=>[p.type,p.value]));
  return {year:Number(p.year),month:Number(p.month),day:Number(p.day)};
}
export function addDays(date:Date,days:number) { const d=new Date(date); d.setDate(d.getDate()+days); d.setHours(12,0,0,0); return d; }
export function monthStart(date:Date) {return addDays(date,1-persian(date).day);}
export function moveMonth(date:Date,delta:number) {
  let d=monthStart(date);
  const step=delta>=0?1:-1;
  for(let i=0;i<Math.abs(delta);i++) d=step===1?monthStart(addDays(d,32)):monthStart(addDays(d,-1));
  return d;
}
export function monthDays(date:Date) {
  const start=monthStart(date), next=moveMonth(start,1);
  const days:Date[]=[];
  for(let d=start;d<next;d=addDays(d,1)) days.push(d);
  return {days,offset:(start.getDay()+1)%7};
}
export function sameDay(a:Date,b:Date) {return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
export const monthTitle=(d:Date)=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',{month:'long',year:'numeric'}).format(d);
export const fullDate=(d:Date)=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);
export function safeUrl(raw:string) { try {const url=new URL(raw.includes('://')?raw:`https://${raw}`);return ['https:','http:'].includes(url.protocol)&&url.hostname.includes('.')?url.href:null;}catch{return null;} }
export const engines={google:'https://www.google.com/search?q=',bing:'https://www.bing.com/search?q=',duck:'https://duckduckgo.com/?q='};
