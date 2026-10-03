import {describe,test,expect} from 'bun:test';
import {persian,monthDays,moveMonth,safeUrl,sameDay} from '../src/calendar';
const date=(s:string)=>new Date(`${s}T12:00:00`);
describe('Persian calendar',()=>{
 test('Nowruz and leap Esfand',()=>{expect(persian(date('2024-03-20'))).toEqual({year:1403,month:1,day:1});expect(persian(date('2025-03-20'))).toEqual({year:1403,month:12,day:30});expect(monthDays(date('2025-03-01')).days.length).toBe(30);expect(monthDays(date('2024-03-01')).days.length).toBe(29);});
 test('month lengths and Saturday-first placement',()=>{expect(monthDays(date('2026-10-02')).days.length).toBe(30);expect(monthDays(date('2024-03-20')).days.length).toBe(31);expect(monthDays(date('2024-03-20')).offset).toBe(4);});
 test('year navigation',()=>{expect(persian(moveMonth(date('2025-03-20'),1))).toEqual({year:1404,month:1,day:1});expect(persian(moveMonth(date('2025-03-21'),-1))).toEqual({year:1403,month:12,day:1});expect(sameDay(date('2025-03-21'),date('2025-03-21'))).toBe(true);});
 test('whole-year sequential days',()=>{for(let i=0;i<12;i++){const m=monthDays(moveMonth(date('2024-03-20'),i));expect(m.days.every((d,j)=>persian(d).day===j+1)).toBe(true);expect(m.days.length).toBe(i<6?31:i<11?30:30);}});
});
test('URL validation rejects executable schemes',()=>{expect(safeUrl('javascript:alert(1)')).toBeNull();expect(safeUrl('data:text/html,test')).toBeNull();expect(safeUrl('https://example.com')).toBe('https://example.com/');expect(safeUrl('example.com/path')).toBe('https://example.com/path');expect(safeUrl('http://example.com')).toBe('http://example.com/');expect(safeUrl('ftp://example.com')).toBeNull();});
