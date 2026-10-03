import {useState} from 'react';
import {useGoogleCalendar} from './use-google-calendar';
export function GoogleCalendarSettings({calendar}:{calendar:ReturnType<typeof useGoogleCalendar>}){
 const [name,setName]=useState('');const [url,setUrl]=useState('');const [message,setMessage]=useState('');
 return <fieldset className="calendar-settings"><legend>Google Calendar</legend><p className="privacy">تقویم گوگل ← Settings ← نام تقویم ← Integrate calendar ← Secret address in iCal format. لینک را اینجا وارد کنید؛ تقویم لازم نیست عمومی شود.</p>
 <a className="subtle" href="https://calendar.google.com/calendar/u/0/r/settings" target="_blank" rel="noreferrer">باز کردن تنظیمات Google Calendar ↗</a>
 {calendar.feeds.map(f=><div className="feed-row" key={f.id}><span>{f.name}</span><button type="button" onClick={()=>{void calendar.disconnect(f.id).catch(()=>setMessage('اتصال حذف شد؛ دسترسی را می‌توانید در تنظیمات مرورگر حذف کنید.'));}}>قطع اتصال</button></div>)}
 <label>نام تقویم<input aria-label="نام تقویم گوگل" value={name} maxLength={40} onChange={e=>setName(e.target.value)} placeholder="مثلاً: شخصی یا کار"/></label>
 <label>لینک خصوصی iCal<input aria-label="لینک تقویم گوگل" type="password" dir="ltr" autoComplete="off" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://calendar.google.com/calendar/ical/…/basic.ics"/></label>
 <button className="primary" type="button" disabled={calendar.connecting} onClick={()=>{setMessage('');void calendar.connect(name,url).then(()=>{setName('');setUrl('');setMessage('تقویم متصل شد.');}).catch(e=>setMessage(e instanceof Error?e.message:'اتصال ناموفق بود.'));}}>{calendar.connecting?'در حال اتصال…':'اتصال تقویم'}</button>
 {calendar.feeds.length>0&&<button className="subtle" type="button" onClick={()=>{void calendar.allowAccess().catch(()=>setMessage('اجازه دسترسی داده نشد.'));}}>فعال‌سازی دوباره دسترسی</button>}
 {message&&<p role="status">{message}</p>}<p className="privacy">فقط خواندنی؛ هر ۱۵ دقیقه در تب باز به‌روز می‌شود. این لینک امکان خواندن تقویم را می‌دهد؛ آن را محرمانه نگه دارید. فقط روی همین مرورگر ذخیره می‌شود و در پشتیبان قرار نمی‌گیرد. رویدادها برای هیچ سرور دیگری ارسال نمی‌شوند.</p>
 </fieldset>;
}
