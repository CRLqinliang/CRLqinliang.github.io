import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join} from "node:path";
import {evaluateCandidate} from "../benchmark/geometry.mjs";
const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const bank=load("../benchmark/tasks.json"),oracle=load("../benchmark/oracle.json"),out=process.argv[2]||"/tmp/hicod-validation-input";
mkdirSync(out,{recursive:true});const cases=[];
for(const task of bank.tasks){
 const label=oracle.labels.find(l=>l.id===task.id),chosen=[task.actions[0]];
 if(!label.successful_actions.includes("reference"))for(const kind of ["regrasp","deform"]){const a=task.actions.find(a=>a.kind===kind&&label.successful_actions.includes(a.id));if(a)chosen.push(a);}
 for(const action of chosen){
  const r=evaluateCandidate(task,action),key=task.id+"-"+action.id,raw=r.raw;
  const expected={connected_modes:r.fixed.connected_modes,stage_counts:r.fixed.stage_counts,reachable_counts:r.fixed.reachable_counts,found:r.found};
  const switches=[];
  if(r.hybrid)for(const e of r.hybrid.summary.witness_edges.filter(e=>e.switch_cost>0)){
    const a=r.hybrid.attempts.find(x=>x.id===e.evidence_id);
    const rel=r.hybrid.docks[a.release_dock],acq=r.hybrid.docks[a.acquire_dock];
    switches.push({id:a.id,samples:[...rel.samples,rel.exit,...a.transit.samples,acq.exit,...acq.samples.slice().reverse()]});
  }
  writeFileSync(join(out,key+".json"),JSON.stringify({key,action,raw,expected,switches}));
  cases.push({key,task_id:task.id,kind:action.kind,expected_found:r.found});
 }
}
writeFileSync(join(out,"index.json"),JSON.stringify(cases));
console.log(JSON.stringify({cases:cases.length,reference:bank.tasks.length,repair:cases.length-bank.tasks.length}));
