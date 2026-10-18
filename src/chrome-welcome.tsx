import {useEffect,useRef,useState} from 'react';
import {X,Check,MousePointer2} from 'lucide-react';
import {isGoogleChrome,CHROME_WELCOME_KEY} from './chrome-onboarding';
import {useStored} from './storage';
export function ChromeWelcome(){
 const [chrome]=useState(()=>{const browser=navigator as Navigator&{userAgentData?:{brands:{brand:string}[]};brave?:unknown};return isGoogleChrome({userAgent:browser.userAgent,vendor:browser.vendor,brands:browser.userAgentData?.brands,brave:browser.brave});});
 const [dismissed,setDismissed]=useStored(CHROME_WELCOME_KEY,false,(v):v is boolean=>typeof v==='boolean');
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const el=dialog.current;if(!el)return;
  if(chrome&&!dismissed){if(!el.open)el.showModal();}else el.close();
 },[chrome,dismissed]);
 if(!chrome||dismissed)return null;
 const dismiss=()=>setDismissed(true);
 return <dialog className="chrome-welcome" ref={dialog} aria-labelledby="chrome-welcome-title" onCancel={e=>{e.preventDefault();dismiss();}}>
  <div className="dialog-content">
   <div className="panel-heading"><h2 id="chrome-welcome-title">نو را در Chrome آماده کن</h2><button type="button" aria-label="بستن راهنمای Chrome" onClick={dismiss}><X size={20}/></button></div>
   <p className="welcome-intro">دو نکته برای شروعی آرام‌تر؛ فقط همین بار این راهنما را می‌بینی.</p>
   <ol className="welcome-steps">
    <li><span className="welcome-step-number" aria-hidden="true">۱</span><div><h3>نو را برای تب‌های تازه نگه دار</h3><p>اگر Chrome پرسید صفحه تب تازه تغییر کند، گزینه <b dir="ltr">Keep it</b> یا <b dir="ltr">Keep changes</b> (حفظ تغییرات) را بزن تا نو باقی بماند.</p><div className="welcome-choice"><Check size={17} aria-hidden="true"/><span>انتخاب در پیام مرورگر: <b dir="ltr">Keep it / Keep changes</b></span></div></div></li>
    <li><span className="welcome-step-number" aria-hidden="true">۲</span><div><h3>نوار پایین Chrome را پنهان کن</h3><p>اگر پایین صفحه نوار خاکستری می‌بینی، روی خود نوار راست‌کلیک کن و <b dir="ltr">Hide footer on New Tab page</b> را انتخاب کن.</p><div className="welcome-footer-hint"><MousePointer2 size={17} aria-hidden="true"/><span>راست‌کلیک روی نوار پایین ← پنهان‌کردن نوار</span></div><p>راه دیگر: <b dir="ltr">Customize Chrome</b> ← <b dir="ltr">Footer</b> ← خاموش‌کردن <b dir="ltr">Show footer on New Tab page</b>.</p><p className="welcome-note">اگر نوار از قبل پنهان است، کاری لازم نیست. در مرورگرهای سازمانی ممکن است این گزینه در اختیار مدیر باشد.</p></div></li>
   </ol>
   <button className="primary welcome-done" type="button" onClick={dismiss}>متوجه شدم، شروع کنیم</button>
  </div>
 </dialog>;
}
