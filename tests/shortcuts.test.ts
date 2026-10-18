import {expect,test} from 'bun:test';
import {faviconUrl,validLinks,validIcon,MAX_ICON_DATA_LENGTH} from '../src/shortcuts';
const legacy={id:'old',name:'Existing shortcut',url:'https://example.com/docs?private=1'};
test('legacy and custom shortcut choices survive JSON backups',()=>{
 for(const link of [legacy,{...legacy,icon:{kind:'builtin',name:'star'}},{...legacy,icon:{kind:'image',data:'data:image/png;base64,iVBORw0KGgo='}}]){
  expect(validLinks(JSON.parse(JSON.stringify([link])))).toBe(true);
 }
});
test('favicon requests contain only the site origin',()=>{
 expect(faviconUrl('https://user:password@example.com:8443/private?secret=1#part')).toBe('https://example.com:8443/favicon.ico');
 expect(faviconUrl('example.com/subpage')).toBe('https://example.com/favicon.ico');
 expect(faviconUrl('http://example.com/path')).toBe('http://example.com/favicon.ico');
 expect(faviconUrl('javascript:alert(1)')).toBeNull();
 expect(faviconUrl('file:///etc/passwd')).toBeNull();
});
test('import rejects unsafe or unbounded custom icons without accepting executable URLs',()=>{
 for(const icon of [null,{}, {kind:'builtin',name:'unknown'},{kind:'image',data:'https://tracker.example/icon.png'},{kind:'image',data:'data:image/svg+xml;base64,PHN2Zz4='},{kind:'image',data:'data:image/png;base64,'+'A'.repeat(MAX_ICON_DATA_LENGTH)}]){
  expect(validIcon(icon)).toBe(false);
  expect(validLinks([{...legacy,icon}])).toBe(false);
 }
 expect(validLinks([{...legacy,url:'javascript:alert(1)'}])).toBe(false);
});
