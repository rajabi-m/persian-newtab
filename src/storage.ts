import {useEffect,useState} from 'react';
export function useStored<T>(key:string,fallback:T,validate:(v:unknown)=>v is T) {
  const read=()=>{try {const v=JSON.parse(localStorage.getItem(key)??'null');return validate(v)?v:fallback;}catch{return fallback;}};
  const [value,setValue]=useState<T>(read);
  const [error,setError]=useState(false);
  useEffect(()=>{try {localStorage.setItem(key,JSON.stringify(value));setError(false);}catch{setError(true);}},[key,value]);
  useEffect(()=>{const sync=(e:StorageEvent)=>{if(e.key===key)setValue(read());};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[key]);
  return [value,setValue,error] as const;
}
