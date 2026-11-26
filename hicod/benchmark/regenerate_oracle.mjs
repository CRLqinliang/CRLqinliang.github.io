import {readFileSync,writeFileSync} from "node:fs";
import {labelTask} from "./geometry.mjs";
const bank=JSON.parse(readFileSync(new URL("./tasks.json",import.meta.url),"utf8"));
const labels=bank.tasks.map(labelTask),categories={reference:0,regrasp_only:0,deform_only:0,both_repairs:0,none:0};
for(const l of labels){const k=l.successful_kinds.includes("reference")?"reference":l.successful_kinds.includes("regrasp")&&l.successful_kinds.includes("deform")?"both_repairs":l.successful_kinds.includes("regrasp")?"regrasp_only":l.successful_kinds.includes("deform")?"deform_only":"none";l.category=k;categories[k]++;}
const data={schema:"hicod.benchmark.oracle.v1",status:"computed_finite_oracle_same_backend",labels,categories};
const old=JSON.parse(readFileSync(new URL("./oracle.json",import.meta.url),"utf8"));
if(JSON.stringify(old)!==JSON.stringify(data))throw Error("Regenerated oracle differs; review backend/task changes before replacing reference data");
console.log(JSON.stringify({verified:true,tasks:labels.length,categories},null,2));
