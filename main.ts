import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const input=process.env.MAKEFUN_INPUT_DIR??'/input',output=process.env.MAKEFUN_OUTPUT_DIR??'/output';
mkdirSync(output,{recursive:true});
const log=(v:number)=>Math.log(Math.max(1,v));
function weighted(values:{v:number,w:number}[],q:number){
 values.sort((a,b)=>a.v-b.v);const total=values.reduce((s,a)=>s+a.w,0);let sum=0;
 for(let i=0;i<values.length;i++){const a=values[i],prev=sum;sum+=a.w;if(sum>=total*q){const prior=values[Math.max(0,i-1)].v;return prior+(a.v-prior)*Math.min(1,(total*q-prev)/a.w)}}
 return values.at(-1)!.v;
}
for(const file of readdirSync(input).filter(f=>f.endsWith('.in')).sort()){
 const c=JSON.parse(readFileSync(join(input,file),'utf8'));const p1=Math.max(1,c.known.find((r:any)=>r.hour===1).viewers);
 const curves:any[]=[];
 for(const a of c.comparables??[]){
  const start=Date.parse(a.day_start),points=new Map<number,number>();
  for(const r of a.hourly){const h=Math.round((Date.parse(r.from)-start)/3600000)+1;if(Number.isFinite(r.viewers))points.set(h,r.viewers)}
  const first=points.get(1);if(!first||first<100)continue;
  let w=1;const text=JSON.stringify([a.platforms,a.unlock]).toLowerCase();
  if(/midnight|rolling|local/.test(text))w*=2;
  if(/pc|windows/.test(text))w*=.65;
  const pre=[-23,-11,-5,-2,0].map(h=>points.get(h)).filter(v=>v!==undefined) as number[];
  if(pre.length){const ratio=pre.reduce((s,v)=>s+v,0)/pre.length/first;
   const ours=(c.history_hourly??[]).filter((r:any)=>{const h=(Date.parse(r.from)-Date.parse(c.day_start))/3600000;return h>=-24&&h<0}).map((r:any)=>r.viewers);
   if(ours.length){const target=ours.reduce((s:number,v:number)=>s+v,0)/ours.length/p1;w*=Math.exp(-Math.abs(Math.log(ratio+.02)-Math.log(target+.02))*.25)}
  }
  curves.push({points,first,w});
 }
 const hours=c.forecast.map(({hour}:any)=>{
  const values:{v:number,w:number}[]=[];
  for(const a of curves){const v=a.points.get(hour);if(v===undefined)continue;values.push({v:Math.log(Math.max(.04,Math.min(20,v/a.first))),w:a.w})}
  if(!values.length)values.push({v:0,w:1});
  const q=c.levels.map((level:number)=>{
   const shape=weighted([...values],level);const center=weighted([...values],.5);
   const widened=center+(shape-center)*1.1;
   return Math.round(Math.max(1,Math.min(1e9,p1*Math.exp(widened)))*100)/100;
  }).sort((a:number,b:number)=>a-b);return {hour,q};
 });
 writeFileSync(join(output,file.replace(/\.in$/,'.out')),JSON.stringify({hours})+'\n');
}
