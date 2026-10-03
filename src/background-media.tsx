import {useEffect,useRef,useState} from 'react';
export function BackgroundMedia({url,kind}:{url:string;kind:'image'|'video'}){
 const video=useRef<HTMLVideoElement>(null);const [paused,setPaused]=useState(false);
 useEffect(()=>{const v=video.current;if(!v)return;v.muted=true;v.defaultMuted=true;v.volume=0;const play=()=>{v.muted=true;v.volume=0;void v.play().then(()=>setPaused(false)).catch(()=>setPaused(true));};const visibility=()=>{if(document.hidden)v.pause();else play();};play();document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility);},[url,kind]);
 return <>{kind==='video'?<video ref={video} className="custom-media" src={url} autoPlay loop muted playsInline preload="auto" aria-hidden="true" onVolumeChange={e=>{e.currentTarget.muted=true;e.currentTarget.volume=0;}}/>:<img className="custom-media" src={url} alt=""/>}{paused&&kind==='video'&&<button className="resume-background" onClick={()=>{const v=video.current;if(v){v.muted=true;v.volume=0;void v.play().then(()=>setPaused(false));}}}>پخش پس‌زمینه</button>}</>;
}
