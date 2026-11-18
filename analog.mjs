const clip=(x,a,b)=>Math.max(a,Math.min(b,x));
const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)]??0;
export function quantile(a,q){a=[...a].sort((a,b)=>a.v-b.v);const total=a.reduce((s,x)=>s+x.w,0);let sum=0;for(const x of a){sum+=x.w;if(sum>=q*total)return x.v}return a.at(-1)?.v??0}
function description(text){return {pc:/\bPC\b|Windows|Steam/i.test(text),rolling:/midnight|rolling|local/i.test(text),early:/early.access|Deluxe|Premium/i.test(text)}}
function features(points,first){const before=h=>{const a=[...points].filter(([hour])=>hour<=h).sort((a,b)=>b[0]-a[0]);return a[0]?.[1]??first};return [-24,-12,-6,-2].map(h=>Math.log((before(h)+1)/(first+1))).concat(Math.log(first+1)*.3)}
export function curvesOf(c){return (c.comparables??[]).filter(a=>!/target-history|not a launch/i.test(a.unlock??'')).map(a=>{const points=new Map();for(const r of a.hourly){const h=Math.round((Date.parse(r.from)-Date.parse(a.day_start))/3600000)+1;if(Number.isFinite(r.viewers))points.set(h,r.viewers)}const first=points.get(1);return {points,first,feature:features(points,Math.max(1,first??1)),...description(a.platforms+' '+a.unlock)}}).filter(a=>a.first>=100)}
function distance(a,b,scale,weight){let d=0;for(let i=0;i<scale.length;i++)d+=Math.min(9,((a.feature[i]-b.feature[i])/scale[i])**2);return d+weight*((a.pc!==b.pc?1:0)+(a.rolling!==b.rolling?1:0)+(a.early!==b.early?1:0))}
function neighbors(target,pool,scale,weight) {
  return pool.map(a=>({a,d:distance(target,a,scale,weight)})).sort((a,b)=>a.d-b.d);
}
function samples(sorted,h,k) {
  k=Math.min(k,sorted.length);
  const band=sorted[Math.max(0,k-1)]?.d||1;
  return sorted.filter(({a})=>a.points.has(h)).map(({a,d},i)=>({
    v:Math.log(Math.max(1,a.points.get(h))/a.first),
    w:.15/Math.max(1,sorted.length)+(i<k?.85*Math.exp(-d/Math.max(.1,band))/k:0)
  })).sort((a,b)=>a.v-b.v);
}
function orderedQuantile(sample,q,total) {
  let weight=0;
  for(const {v,w} of sample){
    weight+=w;
    if(weight>=q*total)return v;
  }
  return sample.at(-1)?.v??0;
}
export function train(pool){
  const scale=pool[0]?.feature.map((_,i)=>{
    const center=median(pool.map(row=>row.feature[i]));
    return Math.max(.4,median(pool.map(row=>Math.abs(row.feature[i]-center)))*1.4826);
  })??[1,1,1,1,1];
  const weights=[0,2,6];
  const byWeight=weights.map(weight=>pool.map(target=>neighbors(target,pool.filter(row=>row!==target),scale,weight)));
  let best={k:pool.length,weight:0,loss:Infinity},global=0,count=0;
  for(const k of [4,8,16,pool.length])for(const [index,weight] of weights.entries()){
    let loss=0,n=0;
    for(const [i,target] of pool.entries())for(let h=2;h<=24;h++){
      const actual=target.points.get(h);
      if(actual===undefined)continue;
      const sample=samples(byWeight[index][i],h,k);
      if(!sample.length)continue;
      const total=sample.reduce((sum,row)=>sum+row.w,0);
      const y=Math.log(Math.max(1,actual)/target.first);
      for(const q of [.05,.25,.5,.75,.95]){
        const e=y-orderedQuantile(sample,q,total);
        loss+=Math.max(q*e,(q-1)*e);
        n++;
      }
    }
    loss/=Math.max(1,n);
    if(k===pool.length&&weight===0){global=loss;count=n}
    if(loss<best.loss)best={k,weight,loss};
  }
  return {...best,scale,unconditional_loss:global,observations:count};
}
export function predict(c,pool,fit){const first=Math.max(1,c.known.find(a=>a.hour===1).viewers),points=new Map();for(const r of c.history_hourly??[]){const h=Math.round((Date.parse(r.from)-Date.parse(c.day_start))/3600000)+1;if(h<=1)points.set(h,r.viewers)}points.set(1,first);const target={first,points,feature:features(points,first),...description((c.notes??'').split('Source:')[0])};const sorted=neighbors(target,pool,fit.scale,fit.weight);return {hours:c.forecast.map(({hour})=>{const a=samples(sorted,hour,fit.k);return {hour,q:c.levels.map(q=>Math.round(clip(first*Math.exp(quantile(a,q)),1,1e9)*100)/100)}})}}
