import full from './data/iran-1405.json';
import solar from './data/iran-solar.json';
import {persian} from './calendar';
export type Occasion={month:number;day:number;title:string;holiday:boolean;kind:string};
export const verifiedIranYears=[1405];
export function iranDay(date:Date){const p=persian(date);const verified=verifiedIranYears.includes(p.year);const occasions:Occasion[]=(verified?full:solar).filter(o=>o.month===p.month&&o.day===p.day);return{occasions,holiday:date.getDay()===5||occasions.some(o=>o.holiday),friday:date.getDay()===5,verified};}
