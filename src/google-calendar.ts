import ICAL from 'ical.js';
import {monthStart,moveMonth} from './calendar';
export type CalendarEvent={id:string;title:string;start:Date;end:Date;allDay:boolean;location:string;calendar:string};
export type CalendarFeed={id:string;name:string;url:string};
export const GOOGLE_ORIGIN='https://calendar.google.com/*';
export function googleFeedUrl(raw:string):string|null{
 try{const u=new URL(raw.trim());return u.protocol==='https:'&&u.hostname==='calendar.google.com'&&!u.port&&!u.username&&!u.password&&!u.search&&!u.hash&&/^\/calendar\/ical\/.+\/.+\.ics$/.test(u.pathname)?u.href:null;}catch{return null;}
}
export const validFeeds=(v:unknown):v is CalendarFeed[]=>Array.isArray(v)&&v.length<=10&&v.every(f=>f&&typeof f.id==='string'&&typeof f.name==='string'&&typeof f.url==='string'&&!!googleFeedUrl(f.url));
type Permissions={request:(p:{origins:string[]})=>Promise<boolean>;contains:(p:{origins:string[]})=>Promise<boolean>;remove:(p:{origins:string[]})=>Promise<boolean>};
function permissions(){const env=globalThis as typeof globalThis & {browser?:{permissions?:Permissions};chrome?:{permissions?:Permissions}};return env.browser?.permissions??env.chrome?.permissions;}
export async function requestCalendarAccess(){const p=permissions();if(!p)throw new Error('اتصال تقویم فقط در نسخه نصب‌شده افزونه در دسترس است.');if(!await p.request({origins:[GOOGLE_ORIGIN]}))throw new Error('اجازه دسترسی به Google Calendar داده نشد.');}
export async function removeCalendarAccess(){await permissions()?.remove({origins:[GOOGLE_ORIGIN]});}
export async function fetchCalendar(url:string,signal?:AbortSignal):Promise<string>{
 if(!googleFeedUrl(url))throw new Error('آدرس iCal معتبر Google Calendar وارد کنید.');
 const p=permissions();if(!p||!await p.contains({origins:[GOOGLE_ORIGIN]}))throw new Error('برای دریافت رویدادها، دسترسی Google Calendar را در تنظیمات فعال کنید.');
 const response=await fetch(url,{credentials:'omit',redirect:'error',cache:'no-store',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(20000)]):AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error('تقویم دریافت نشد؛ لینک را بررسی کنید یا دوباره تلاش کنید.');
 if(Number(response.headers.get('content-length'))>5_000_000){await response.body?.cancel();throw new Error('تقویم بیش از حد بزرگ است.');}
 const reader=response.body?.getReader();if(!reader)throw new Error('تقویم خالی دریافت شد.');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>5_000_000){await reader.cancel();throw new Error('تقویم بیش از حد بزرگ است.');}chunks.push(value);}
 const bytes=new Uint8Array(size);let pos=0;for(const c of chunks){bytes.set(c,pos);pos+=c.length;}const text=new TextDecoder().decode(bytes);
 if(!text.trimStart().startsWith('BEGIN:VCALENDAR'))throw new Error('لینک باید فایل iCal تقویم باشد، نه لینک اشتراک صفحه.');
 return text;
}
export function eventsForMonth(text:string,month:Date,calendar='Google Calendar'):CalendarEvent[]{
 if(text.length>5_000_000)throw new Error('تقویم بیش از حد بزرگ است.');
 const component=new ICAL.Component(ICAL.parse(text));if(component.name!=='vcalendar')throw new Error('فایل تقویم معتبر نیست.');
 ICAL.TimezoneService.reset();for(const zone of component.getAllSubcomponents('vtimezone'))ICAL.TimezoneService.register(new ICAL.Timezone(zone));
 const min=monthStart(month);min.setHours(0,0,0,0);const max=moveMonth(month,1);max.setHours(0,0,0,0);
 const raw=component.getAllSubcomponents('vevent');if(raw.length>10000)throw new Error('تقویم بیش از حد بزرگ است.');
 const events:CalendarEvent[]=[];let iterations=0;
 const add=(event:ICAL.Event,start:ICAL.Time,end:ICAL.Time,key:string)=>{
  if(event.component.getFirstPropertyValue('status')==='CANCELLED')return;
  const s=start.toJSDate(),e=end.toJSDate();if(!Number.isFinite(s.getTime())||!Number.isFinite(e.getTime()))return;
  if(s<max&&(e>min||(s.getTime()===e.getTime()&&s>=min))){events.push({id:`${event.uid}-${key}`,title:event.summary||'بدون عنوان',start:s,end:e,allDay:start.isDate,location:event.location||'',calendar});if(events.length>5000)throw new Error('تعداد رویدادهای این ماه بیش از حد مجاز است.');}
 };
 for(const vevent of raw){
  const event=new ICAL.Event(vevent);if(!vevent.hasProperty('dtstart'))continue;
  // Detached exceptions are added independently so moved occurrences are not lost across month boundaries.
  if(event.isRecurrenceException()){add(event,event.startDate,event.endDate,'exception-'+event.recurrenceId.toString());continue;}
  if(!event.isRecurring()){add(event,event.startDate,event.endDate,'single');continue;}
  const exceptions=raw.filter(c=>c.getFirstPropertyValue('uid')===event.uid&&c.hasProperty('recurrence-id'));
  const excluded=new Set(exceptions.map(c=>String(c.getFirstPropertyValue('recurrence-id'))));
  const iterator=event.iterator();let occurrence:ICAL.Time|null;
  while((occurrence=iterator.next())){
   if(++iterations>100000)throw new Error('تکرارهای این تقویم بیش از حد زیاد است.');
   if(occurrence.toJSDate()>=max)break;
   if(excluded.has(occurrence.toString()))continue;
   const detail=event.getOccurrenceDetails(occurrence);add(detail.item,detail.startDate,detail.endDate,occurrence.toString());
  }
 }
 return events.sort((a,b)=>a.start.getTime()-b.start.getTime());
}
export function eventsOnDay(events:CalendarEvent[],day:Date){const start=new Date(day);start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);return events.filter(e=>e.start<end&&(e.end>start||(e.end.getTime()===e.start.getTime()&&e.start>=start)));}
