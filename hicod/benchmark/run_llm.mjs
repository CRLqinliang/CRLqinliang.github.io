// Generic chat-completions-compatible endpoint. No API calls unless explicitly run.
import {readFileSync,writeFileSync} from "node:fs";
import {runModelEpisode} from "./model_runner.mjs";
import {profiles,scoreEpisode,aggregate} from "./core.mjs";
const get=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const bank=get("./tasks.json"),oracle=get("./oracle.json"),registry=get("../concept_graph.json");
const args=process.argv.slice(2);
const opt=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const endpoint=process.env.HICOD_LLM_ENDPOINT,model=opt("--model",process.env.HICOD_LLM_MODEL);
if(!endpoint||!model)throw Error("Set HICOD_LLM_ENDPOINT (complete chat-completions URL) and HICOD_LLM_MODEL, or pass --model.");
const parsedUrl=new URL(endpoint);if(!["https:","http:"].includes(parsedUrl.protocol)||parsedUrl.username||parsedUrl.password)throw Error("Invalid endpoint");
const selected=opt("--profiles",profiles().join(",")).split(",");
if(!selected.length||new Set(selected).size!==selected.length||selected.some(p=>!profiles().includes(p)))throw Error("Invalid profiles");
const split=opt("--split","public_test"),limit=Number(opt("--limit","32")),trials=Number(opt("--trials","1")),out=opt("--output","benchmark_llm_results.json");
if(!["development","public_test","all"].includes(split)||!Number.isInteger(limit)||limit<1||limit>32||!Number.isInteger(trials)||trials<1||trials>20)throw Error("Invalid split/limit/trials");
const temperature=Number(opt("--temperature","0")),maxTokens=Number(opt("--max-output-tokens","500"));
if(!Number.isFinite(temperature)||temperature<0||temperature>2||!Number.isInteger(maxTokens)||maxTokens<1)throw Error("Invalid generation settings");
const tokenParam=opt("--token-param","max_tokens");if(!["max_tokens","max_completion_tokens"].includes(tokenParam))throw Error("Invalid token parameter");
const wanted=opt("--task-ids","").split(",").filter(Boolean);
if(wanted.length&&(new Set(wanted).size!==wanted.length||wanted.some(id=>!bank.tasks.some(t=>t.id===id&&(split==="all"||t.split===split)))))throw Error("Invalid task IDs for split");
const tasks=bank.tasks.filter(t=>(split==="all"||t.split===split)&&(!wanted.length||wanted.includes(t.id))).slice(0,limit);
const apiKey=process.env.HICOD_LLM_API_KEY;const adapter={async complete(messages){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),120000);
 try{
  const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",...(apiKey?{Authorization:"Bearer "+apiKey}:{})},body:JSON.stringify({model,messages,temperature,[tokenParam]:maxTokens}),signal:controller.signal});
  if(!response.ok)throw Error("Provider HTTP "+response.status);
  const r=await response.json();if(typeof r.choices?.[0]?.message?.content!=="string")throw Error("Unsupported completion response");return {content:r.choices[0].message.content,usage:r.usage??null};
 }finally{clearTimeout(timer);}
}};
const rows=[],records=[],config={model,split,profiles:selected,trials,task_ids:tasks.map(t=>t.id),temperature,max_output_tokens:maxTokens,token_param:tokenParam,budgets:bank.settings,endpoint_host:parsedUrl.host};
const persist=()=>{const summary=Object.fromEntries(selected.map(p=>{const rr=rows.filter(r=>r.profile===p),a=aggregate(rr);const mean=k=>rr.length&&rr.every(r=>Number.isFinite(r[k]))?rr.reduce((s,r)=>s+r[k],0)/rr.length:null;return [p,{...a,mean_model_calls:mean("model_calls"),mean_total_latency_ms:mean("total_latency_ms"),mean_model_tokens:mean("total_tokens")}];}));writeFileSync(out,JSON.stringify({status:"external_model_experiment",config,summary,rows,records},null,2)+"\n");};
for(let trial=0;trial<trials;trial++)for(const t of tasks)for(let i=0;i<selected.length;i++){
 // rotate profile order by task/trial to reduce systematic ordering effects.
 const p=selected[(i+Number(t.id.slice(1))+trial)%selected.length],r=await runModelEpisode(t,bank.settings,p,registry,adapter),l=oracle.labels.find(x=>x.id===t.id);
 const row={...scoreEpisode(r,l),trial,split:t.split,model_calls:r.execution.model_calls,total_latency_ms:r.execution.total_latency_ms,total_tokens:r.execution.usage.total_tokens};
 rows.push(row);records.push({...r,trial});persist();console.error(t.id,p,"trial",trial,"success",row.sampled_success);
}
