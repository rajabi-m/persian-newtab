export type BrowserIdentity={userAgent:string;vendor:string;brands?:readonly {brand:string}[];brave?:unknown};
export function isGoogleChrome(browser:BrowserIdentity):boolean {
 if(browser.brave||/Edg(?:e|A|iOS)?\/|OPR\/|Opera|Vivaldi\/|SamsungBrowser\/|Firefox\/|FxiOS\//i.test(browser.userAgent))return false;
 if(browser.brands?.length)return browser.brands.some(({brand})=>brand==='Google Chrome');
 return browser.vendor==='Google Inc.'&&/(?:Headless)?Chrome\/\d+/.test(browser.userAgent);
}
export const CHROME_WELCOME_KEY='no.chrome-welcome.v1';
