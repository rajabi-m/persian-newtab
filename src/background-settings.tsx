import {useState} from 'react';
import {useBackground} from './use-background';
export function BackgroundSettings({background,onSelect,onRemove}:{background:ReturnType<typeof useBackground>;onSelect:()=>void;onRemove:()=>void}){
 const [message,setMessage]=useState('');
 return <div className="background-settings"><label className="upload-background">{background.busy?'در حال ذخیره…':'آپلود تصویر، GIF یا ویدئو'}<input aria-label="آپلود پس‌زمینه" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/ogg" disabled={background.busy} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;setMessage('');void background.upload(file).then(()=>{onSelect();setMessage('پس‌زمینه ذخیره شد.');}).catch(()=>{});}}/></label>
 {background.asset&&<div className="custom-background-row"><span>{background.asset.name}</span><button type="button" onClick={onSelect}>استفاده</button><button type="button" onClick={()=>{void background.remove().then(()=>{onRemove();setMessage('پس‌زمینه حذف شد.');}).catch(()=>setMessage('حذف پس‌زمینه ناموفق بود.'));}}>حذف</button></div>}
 {(background.error||message)&&<p role="status">{background.error||message}</p>}<p className="privacy">تصویر تا ۲۰ و ویدئو تا ۸۰ مگابایت. ویدئو بی‌صدا و تکرارشونده است. فایل فقط در مرورگر ذخیره می‌شود؛ در پشتیبان JSON قرار نمی‌گیرد.</p>
 </div>;
}
