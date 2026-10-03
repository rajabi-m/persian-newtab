import {useEffect,useState} from 'react';
import {BackgroundAsset,backgroundKind,readBackground,storeBackground,validateBackground} from './background';
export function useBackground(){
 const [asset,setAsset]=useState<BackgroundAsset|null>(null);const [url,setUrl]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 useEffect(()=>{let active=true;const load=()=>{void readBackground().then(a=>{if(active)setAsset(a);}).catch(()=>{if(active)setError('پس‌زمینه ذخیره‌شده در دسترس نیست.');});};load();const channel=new BroadcastChannel('no-backgrounds');channel.onmessage=load;return()=>{active=false;channel.close();};},[]);
 useEffect(()=>{if(!asset){setUrl('');return;}const u=URL.createObjectURL(asset.blob);setUrl(u);return()=>URL.revokeObjectURL(u);},[asset]);
 const broadcast=()=>{const c=new BroadcastChannel('no-backgrounds');c.postMessage('changed');c.close();};
 async function upload(file:File){setError('');setBusy(true);try{const kind=backgroundKind(file);await validateBackground(file,kind);const a:BackgroundAsset={id:crypto.randomUUID(),name:file.name,kind,blob:file};await storeBackground(a);setAsset(a);broadcast();}catch(e){setError(e instanceof Error?e.message:'ذخیره پس‌زمینه ناموفق بود.');throw e;}finally{setBusy(false);}}
 async function remove(){await storeBackground(null);setAsset(null);setError('');broadcast();}
 return{asset,url,error,busy,upload,remove};
}
