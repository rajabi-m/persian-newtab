import {safeUrl} from './calendar';
export const iconNames=['link','globe','star','heart','briefcase','book','code','music'] as const;
export type IconName=typeof iconNames[number];
export type ShortcutIconChoice={kind:'builtin';name:IconName}|{kind:'image';data:string};
export type Shortcut={id:string;name:string;url:string;icon?:ShortcutIconChoice};
export const MAX_ICON_DATA_LENGTH=64*1024;
export function validIcon(v:unknown):v is ShortcutIconChoice {
 if(!v||typeof v!=='object')return false;
 if('kind'in v&&v.kind==='builtin')return 'name'in v&&iconNames.includes(v.name as IconName);
 return 'kind'in v&&v.kind==='image'&&'data'in v&&typeof v.data==='string'&&v.data.length<=MAX_ICON_DATA_LENGTH&&/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(v.data);
}
export const validLinks=(v:unknown):v is Shortcut[]=>Array.isArray(v)&&v.every(x=>x&&typeof x.id==='string'&&typeof x.name==='string'&&typeof x.url==='string'&&!!safeUrl(x.url)&&(x.icon===undefined||validIcon(x.icon)));
export function faviconUrl(raw:string):string|null {
 const safe=safeUrl(raw);if(!safe)return null;
 // Only the origin is contacted: never send a saved path, query, or URL credentials.
 return new URL('/favicon.ico',new URL(safe).origin).href;
}
export async function readShortcutIcon(file:File):Promise<ShortcutIconChoice> {
 if(!['image/png','image/jpeg','image/webp','image/x-icon','image/vnd.microsoft.icon'].includes(file.type))throw Error('تصویر PNG، JPG، WebP یا ICO انتخاب کنید.');
 if(file.size===0||file.size>1024*1024)throw Error('تصویر باید غیرخالی و حداکثر ۱ مگابایت باشد.');
 const url=URL.createObjectURL(file);
 try {
  const img=new Image();img.src=url;await img.decode();
  if(!img.naturalWidth||!img.naturalHeight)throw Error();
  const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error();
  const scale=Math.min(96/img.naturalWidth,96/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  ctx.drawImage(img,(96-w)/2,(96-h)/2,w,h);
  const icon:ShortcutIconChoice={kind:'image',data:canvas.toDataURL('image/png')};
  if(!validIcon(icon))throw Error();
  return icon;
 }catch{throw Error('تصویر قابل خواندن نیست؛ فایل دیگری انتخاب کنید.');}
 finally{URL.revokeObjectURL(url);}
}
