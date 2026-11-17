import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {curvesOf,train,predict} from './analog.mjs';
const input=process.env.MAKEFUN_INPUT_DIR??'/input',output=process.env.MAKEFUN_OUTPUT_DIR??'/output';
mkdirSync(output,{recursive:true});
for(const file of readdirSync(input).filter(f=>f.endsWith('.in')).sort()){
 const c=JSON.parse(readFileSync(join(input,file),'utf8'));
 const pool=curvesOf(c),fit=train(pool),result=predict(c,pool,fit);
 writeFileSync(join(output,file.replace(/\.in$/,'.out')),JSON.stringify(result)+'\n');
 console.error(JSON.stringify({case:c.id,historical_launches:pool.length,neighbors:fit.k,metadata_weight:fit.weight,cv_loss:fit.loss,unconditional_cv_loss:fit.unconditional_loss}));
}
