import {useEffect,useMemo,useRef,useState} from 'react';
import {useStored} from './storage';
import {CalendarFeed,eventsForMonth,fetchCalendar,googleFeedUrl,removeCalendarAccess,requestCalendarAccess,validFeeds} from './google-calendar';
export function useGoogleCalendar(month:Date){
 const [feeds,setFeeds,saveError]=useStored('no.google-calendars',[],validFeeds);
 const [sources,setSources]=useState<Record<string,string>>({});const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [updated,setUpdated]=useState<Date|null>(null);const [nonce,setNonce]=useState(0);const [connecting,setConnecting]=useState(false);const generation=useRef(0);
 useEffect(()=>{
  const control=new AbortController();const current=++generation.current;
  setSources({});setUpdated(null);
  if(!feeds.length){setError('');setLoading(false);return()=>control.abort();}
  async function load(){setLoading(true);setError('');const results=await Promise.allSettled(feeds.map(async f=>[f.id,await fetchCalendar(f.url,control.signal)] as const));if(control.signal.aborted||current!==generation.current)return;
   const errors=results.flatMap((r,i)=>r.status==='rejected'?[`${feeds[i].name}: ${r.reason instanceof Error&&r.reason.message.startsWith('برای دریافت')?r.reason.message:'دریافت تقویم ناموفق بود؛ لینک یا اتصال را بررسی کنید.'}`]:[]);
   setSources(Object.fromEntries(results.flatMap(r=>r.status==='fulfilled'?[r.value]:[])));setError(errors.join(' '));setUpdated(new Date());setLoading(false);
  }
  void load();const timer=setInterval(()=>void load(),15*60*1000);return()=>{control.abort();clearInterval(timer);};
 },[feeds,nonce]);
 const parsed=useMemo(()=>{try{return{events:feeds.flatMap(f=>sources[f.id]?eventsForMonth(sources[f.id],month,f.name).map(e=>({...e,id:`${f.id}-${e.id}`})):[]).sort((a,b)=>a.start.getTime()-b.start.getTime()),error:''};}catch{return{events:[],error:'پردازش تقویم ناموفق بود؛ فایل معتبر یا با حجم کوچک‌تر را امتحان کنید.'};}},[feeds,sources,month]);
 async function connect(name:string,raw:string){const url=googleFeedUrl(raw);if(!url)throw new Error('لینک Secret address in iCal format گوگل را وارد کنید.');if(feeds.length>=10)throw new Error('حداکثر ۱۰ تقویم قابل اتصال است.');if(feeds.some(f=>f.url===url))throw new Error('این تقویم قبلاً متصل شده است.');
  // Permission request must stay directly inside the user's click gesture.
  const access=requestCalendarAccess();setConnecting(true);
  try{await access;const text=await fetchCalendar(url);eventsForMonth(text,month,name);setFeeds(current=>[...current,{id:crypto.randomUUID(),name:name.trim()||'Google Calendar',url}]);}finally{setConnecting(false);}
 }
 async function disconnect(id:string){setFeeds(current=>current.filter(f=>f.id!==id));if(feeds.length===1)await removeCalendarAccess();}
 async function allowAccess(){await requestCalendarAccess();setNonce(n=>n+1);}
 return{feeds,events:parsed.events,loading,connecting,error:error||parsed.error||(saveError?'ذخیره اتصال تقویم ناموفق بود.':''),updated,connect,disconnect,allowAccess,refresh:()=>setNonce(n=>n+1)};
}
