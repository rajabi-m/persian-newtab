export type BackgroundAsset={id:string;name:string;kind:'image'|'video';blob:Blob};
export function backgroundKind(file:Pick<File,'type'|'size'>):BackgroundAsset['kind']{
 const image=['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(file.type);const video=['video/mp4','video/webm','video/ogg'].includes(file.type);
 if(!image&&!video)throw new Error('تصویر JPG، PNG، WebP، GIF یا AVIF و ویدئوی MP4، WebM یا OGG انتخاب کنید.');
 if(file.size===0)throw new Error('فایل خالی است.');if(file.size>(video?80:20)*1024*1024)throw new Error(video?'حداکثر حجم ویدئو ۸۰ مگابایت است.':'حداکثر حجم تصویر ۲۰ مگابایت است.');return video?'video':'image';
}
function db():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open('no-backgrounds',1);r.onupgradeneeded=()=>r.result.createObjectStore('assets');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(new Error('ذخیره‌سازی پس‌زمینه در دسترس نیست.'));});}
export async function readBackground():Promise<BackgroundAsset|null>{const d=await db();try{return await new Promise((resolve,reject)=>{const r=d.transaction('assets','readonly').objectStore('assets').get('background');r.onsuccess=()=>resolve(r.result??null);r.onerror=()=>reject(r.error);});}finally{d.close();}}
export async function storeBackground(asset:BackgroundAsset|null){const d=await db();try{await new Promise<void>((resolve,reject)=>{const tx=d.transaction('assets','readwrite');if(asset)tx.objectStore('assets').put(asset,'background');else tx.objectStore('assets').delete('background');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('فضای کافی برای ذخیره پس‌زمینه وجود ندارد.'));tx.onabort=()=>reject(new Error('ذخیره پس‌زمینه ناموفق بود.'));});}finally{d.close();}}
export async function validateBackground(file:File,kind:BackgroundAsset['kind']){
 const url=URL.createObjectURL(file);try{await new Promise<void>((resolve,reject)=>{
  const media=kind==='video'?document.createElement('video'):document.createElement('img');let settled=false;
  const finish=(error=false)=>{if(settled)return;settled=true;clearTimeout(timer);media.removeAttribute('src');if(media instanceof HTMLVideoElement)media.load();error?reject(new Error('مرورگر نمی‌تواند این فایل را پخش کند؛ فایل یا کدک دیگری امتحان کنید.')):resolve();};
  const timer=setTimeout(()=>finish(true),15000);media.onerror=()=>finish(true);
  if(media instanceof HTMLVideoElement){media.muted=true;media.preload='metadata';media.onloadedmetadata=()=>finish(media.videoWidth===0||media.videoHeight===0);}else media.onload=()=>finish(media.naturalWidth===0||media.naturalHeight===0);
  media.src=url;
 });}finally{URL.revokeObjectURL(url);}
}
