import {RefreshCw,Plus} from 'lucide-react';
import {useGoogleCalendar} from './use-google-calendar';
import {eventsOnDay} from './google-calendar';
import {iranDay} from './iran-calendar';
import {fa,persian} from './calendar';
export function CalendarAgenda({calendar,day,onConnect}:{calendar:ReturnType<typeof useGoogleCalendar>;day:Date;onConnect:()=>void}){
 const iran=iranDay(day),events=eventsOnDay(calendar.events,day);
 return <section className="agenda" aria-label="مناسبت‌ها و رویدادها"><div className="agenda-heading"><span>مناسبت‌ها و رویدادها</span>{calendar.feeds.length>0&&<button aria-label="به‌روزرسانی تقویم" disabled={calendar.loading} onClick={calendar.refresh}><RefreshCw size={14}/></button>}</div>
 {calendar.feeds.length>0&&<p className="sync-status" role="status">{calendar.loading?'در حال دریافت…':calendar.error||(!calendar.updated?'در انتظار دریافت':`آخرین دریافت: ${new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(calendar.updated)}`)}</p>}
 <div className="event-list">{!iran.verified&&<p className="coverage-notice">مناسبت‌های قمری سال {fa(persian(day).year)} هنوز تأیید نشده‌اند؛ فقط مناسبت‌های ثابت نمایش داده می‌شوند.</p>}{iran.friday&&<div className="occasion-row"><span className="holiday-label">جمعه · تعطیل هفتگی</span></div>}{iran.occasions.map((o,i)=><div className={`occasion-row ${o.holiday?'is-holiday':''}`} key={`${o.title}-${i}`}><strong>{o.title}</strong><small>{o.holiday?'تعطیل رسمی':'مناسبت'}</small></div>)}{events.map(e=><div className="event-row" key={e.id}><strong>{e.title}</strong><span>{e.allDay?'تمام روز':`${new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(e.start)} – ${new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(e.end)}`}</span><small>{e.calendar}{e.location?` · ${e.location}`:''}</small></div>)}{events.length===0&&iran.occasions.length===0&&!iran.friday&&<p className="no-events">{calendar.loading?'':calendar.error?'رویدادها در دسترس نیستند.':'برای این روز مناسبت یا رویدادی نیست.'}</p>}</div>
 {calendar.feeds.length===0&&<button className="connect-calendar" onClick={onConnect}>اتصال Google Calendar <Plus size={15}/></button>}
 </section>;
}
