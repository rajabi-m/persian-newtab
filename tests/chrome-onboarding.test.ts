import {expect,test} from 'bun:test';
import {isGoogleChrome} from '../src/chrome-onboarding';
const chrome={userAgent:'Mozilla/5.0 Chrome/142.0.0.0 Safari/537.36',vendor:'Google Inc.'};
test('Chrome is recognized with client hints and legacy identification',()=>{
 expect(isGoogleChrome({...chrome,brands:[{brand:'Chromium'},{brand:'Google Chrome'}]})).toBe(true);
 expect(isGoogleChrome(chrome)).toBe(true);
});
test('Chrome instructions stay hidden in other browsers',()=>{
 for(const userAgent of ['Mozilla/5.0 Firefox/140.0','Mozilla/5.0 Safari/605.1.15',chrome.userAgent+' Edg/142.0',chrome.userAgent+' OPR/120.0',chrome.userAgent+' Vivaldi/7.0'])expect(isGoogleChrome({...chrome,userAgent})).toBe(false);
 expect(isGoogleChrome({...chrome,brave:{}})).toBe(false);
 expect(isGoogleChrome({...chrome,brands:[{brand:'Chromium'},{brand:'Microsoft Edge'}]})).toBe(false);
});
