import {useRef,useState} from 'react';
import {Link,Globe,Star,Heart,Briefcase,BookOpen,Code,Music,Mail,Play} from 'lucide-react';
import {safeUrl} from './calendar';
import {faviconUrl,iconNames,readShortcutIcon,type Shortcut,type ShortcutIconChoice} from './shortcuts';
const icons={link:Link,globe:Globe,star:Star,heart:Heart,briefcase:Briefcase,book:BookOpen,code:Code,music:Music};
const defaultIcons={google:Globe,gmail:Mail,github:Code,youtube:Play};
const isDefaultShortcut=(id?:string)=>id==='wikipedia'||!!id&&Object.hasOwn(defaultIcons,id);
const labels={link:'پیوند',globe:'وب',star:'ستاره',heart:'قلب',briefcase:'کار',book:'کتاب',code:'کدنویسی',music:'موسیقی'};
function IconImage({src}:{src:string}){
 const [failed,setFailed]=useState(false);
 return failed?<Link aria-hidden="true"/>:<img src={src} alt="" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>;
}
export function ShortcutIcon({shortcut}:{shortcut:Pick<Shortcut,'url'|'icon'>&{id?:string}}){
 if(shortcut.icon?.kind==='builtin'){const Icon=icons[shortcut.icon.name];return <Icon aria-hidden="true"/>;}
 if(!shortcut.icon&&shortcut.id==='wikipedia')return <span className="wiki" aria-hidden="true">W</span>;
 if(!shortcut.icon&&shortcut.id&&Object.hasOwn(defaultIcons,shortcut.id)){const Icon=defaultIcons[shortcut.id as keyof typeof defaultIcons];return <Icon aria-hidden="true"/>;}
 const src=shortcut.icon?.kind==='image'?shortcut.icon.data:faviconUrl(shortcut.url);
 return src?<IconImage key={src} src={src}/>:<Link aria-hidden="true"/>;
}
export function ShortcutEditor({shortcut,onSave,onDelete}:{shortcut:Shortcut|null;onSave:(s:Shortcut)=>void;onDelete:()=>void}){
 const [url,setUrl]=useState(shortcut?.url??'');
 const [icon,setIcon]=useState<ShortcutIconChoice|undefined>(shortcut?.icon);
 const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const uploadRequest=useRef(0);
 function choose(choice:ShortcutIconChoice|undefined){uploadRequest.current++;setBusy(false);setError('');setIcon(choice);}
 async function upload(file?:File){
  if(!file)return;const request=++uploadRequest.current;setBusy(true);setError('');
  try{const result=await readShortcutIcon(file);if(request===uploadRequest.current)setIcon(result);}
  catch(e){if(request===uploadRequest.current)setError((e as Error).message);}
  finally{if(request===uploadRequest.current)setBusy(false);}
 }
 return <form className="link-form" onSubmit={e=>{
  e.preventDefault();if(busy)return;
  const name=String(new FormData(e.currentTarget).get('name')??'').trim();const normalized=safeUrl(url);
  if(!name||!normalized){setError('نام و یک آدرس معتبر http یا https وارد کنید.');return;}
  onSave({id:shortcut?.id??crypto.randomUUID(),name,url:normalized,...(icon?{icon}: {})});
 }}>
  <label>نام میانبر<input name="name" maxLength={30} defaultValue={shortcut?.name} required autoFocus placeholder="مثلاً: گیت‌هاب"/></label>
  <label>آدرس سایت<input name="url" dir="ltr" value={url} onChange={e=>setUrl(e.target.value)} required placeholder="https://example.com"/></label>
  <fieldset className="shortcut-icon-picker"><legend>آیکون میانبر</legend>
   <div className="shortcut-icon-options">
    <button type="button" className="automatic-icon" aria-pressed={!icon} onClick={()=>choose(undefined)}>{isDefaultShortcut(shortcut?.id)?'آیکون پیش‌فرض':'آیکون سایت (خودکار)'}</button>
    {iconNames.map(name=>{const Icon=icons[name];return <button type="button" key={name} aria-label={labels[name]} title={labels[name]} aria-pressed={icon?.kind==='builtin'&&icon.name===name} onClick={()=>choose({kind:'builtin',name})}><Icon size={22}/></button>;})}
   </div>
   <div className="shortcut-icon-upload"><span className="shortcut-icon" aria-label="پیش‌نمایش آیکون"><ShortcutIcon shortcut={{id:shortcut?.id,url,icon}}/></span><label>بارگذاری لوگوی دلخواه<input type="file" accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico" disabled={busy} onChange={e=>{void upload(e.target.files?.[0]);e.target.value='';}}/></label></div>
   <p className="icon-help">PNG، JPG، WebP یا ICO تا ۱ مگابایت. لوگوی شما روی همین مرورگر ذخیره و در پشتیبان نگهداری می‌شود.</p>
   <p className="icon-help">{isDefaultShortcut(shortcut?.id)?'برای میانبرهای پیش‌فرض، نماد اصلی نمایش داده می‌شود؛ می‌توانید آن را با نماد یا لوگوی دلخواه جایگزین کنید.':'در حالت خودکار، آیکون مستقیماً از سایت دریافت می‌شود. اگر در دسترس نباشد، نماد پیوند نمایش داده می‌شود.'}</p>
  </fieldset>
  {busy&&<p role="status">در حال آماده‌سازی لوگو…</p>}{error&&<p role="alert">{error}</p>}
  <div className="form-actions"><button className="primary" type="submit" disabled={busy}>ذخیره میانبر</button>{shortcut&&<button type="button" className="danger" onClick={onDelete}>حذف میانبر</button>}</div>
 </form>;
}
