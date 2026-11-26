import {readFileSync,writeFileSync,readdirSync} from "node:fs";
import {join} from "node:path";
import {aggregate,profiles} from "../benchmark/core.mjs";
const dir=process.argv[2],out=process.argv[3],parts=readdirSync(dir).filter(s=>s.startsWith("pilot-")&&s.endsWith(".json")).map(s=>JSON.parse(readFileSync(join(dir,s),"utf8"))),meta=readdirSync(dir).filter(s=>s.startsWith("model-")&&s.endsWith(".json")).map(s=>JSON.parse(readFileSync(join(dir,s),"utf8")));
const rows=parts.flatMap(p=>p.rows),summary=Object.fromEntries(profiles().map(p=>{const rr=rows.filter(r=>r.profile===p),a=aggregate(rr);return [p,{...a,mean_model_tokens:rr.length&&rr.every(r=>Number.isFinite(r.total_tokens))?rr.reduce((s,r)=>s+r.total_tokens,0)/rr.length:null}];}));
const complete=parts.length===4&&rows.length===24&&new Set(rows.map(r=>r.task_id+"/"+r.profile)).size===24&&meta.length===4&&new Set(meta.map(m=>m.model_revision)).size===1;
writeFileSync(out,JSON.stringify({status:complete?"completed":"incomplete",source_commit:process.env.GITHUB_SHA,model:"Qwen2.5-0.5B-Instruct",episodes:rows.length,model_metadata:meta,scope:"Real open-weight CPU inference, four selected public test tasks, six profiles, one trial. No scripted policy fallback. Small non-generalization pilot.",summary,rows},null,2)+"\n");
