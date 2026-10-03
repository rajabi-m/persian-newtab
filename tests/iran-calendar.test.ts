import {test,expect} from 'bun:test';
import data from '../src/data/iran-1405.json';
import {iranDay} from '../src/iran-calendar';
import {monthStart,moveMonth,addDays,persian} from '../src/calendar';
import {backgroundKind} from '../src/background';
const start=monthStart(new Date(2026,2,21,12));
const date=(m:number,d:number)=>addDays(moveMonth(start,m-1),d-1);
test('official 1405 holiday list includes corrected lunar dates',()=>{
 const expected=['1/1','1/2','1/3','1/4','1/12','1/13','1/25','3/6','3/14','3/15','4/3','4/4','5/13','5/21','5/22','5/30','6/8','8/22','10/2','10/16','11/4','11/22','12/9','12/19','12/20','12/29'];
 expect([...new Set(data.filter(x=>x.holiday).map(x=>`${x.month}/${x.day}`))]).toEqual(expected);
 expect(iranDay(date(1,25)).occasions.some(o=>o.holiday&&o.title.includes('صادق'))).toBe(true);
 expect(iranDay(date(10,1)).occasions.some(o=>o.holiday)).toBe(false);
 expect(iranDay(date(10,2)).occasions.some(o=>o.holiday&&o.title.includes('پدر'))).toBe(true);
 expect(iranDay(date(12,18)).occasions.some(o=>o.holiday)).toBe(false);
 expect(iranDay(date(12,19)).occasions.some(o=>o.holiday&&o.title.includes('فطر'))).toBe(true);
});
test('Yalda, Nowruz, teacher day, Friday, and unverified-year coverage',()=>{
 expect(iranDay(date(9,30)).occasions.some(o=>o.title.includes('یلدا'))).toBe(true);
 expect(iranDay(date(1,1)).holiday).toBe(true);
 expect(iranDay(date(2,12)).occasions.some(o=>o.title.includes('معلم'))).toBe(true);
 expect(iranDay(new Date(2026,9,2)).friday).toBe(true);
 expect(iranDay(moveMonth(start,12)).verified).toBe(false);
 expect(iranDay(moveMonth(start,12)).occasions.every(o=>o.kind!=='lunar')).toBe(true);
});
test('all dataset dates resolve to the corresponding Persian date',()=>{for(const row of data)expect(persian(date(row.month,row.day))).toEqual({year:1405,month:row.month,day:row.day});});
test('background allowlist and file size limits',()=>{
 expect(backgroundKind({type:'image/gif',size:100})).toBe('image');expect(backgroundKind({type:'video/webm',size:100})).toBe('video');expect(backgroundKind({type:'video/mp4',size:100})).toBe('video');
 for(const file of [{type:'text/html',size:10},{type:'image/svg+xml',size:10},{type:'image/png',size:0},{type:'image/png',size:21*1024*1024},{type:'video/mp4',size:81*1024*1024}])expect(()=>backgroundKind(file)).toThrow();
});
