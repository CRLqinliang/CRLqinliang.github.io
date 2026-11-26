import {createEpisode} from "./core.mjs";
function promptFor(profile){
 const common=`You are evaluating finite sampled robot manipulation tasks. Choose an allowed action using the provided task and tool feedback. Your goal is to find a sampled path under the shared solver and step budgets, and classify the REFERENCE path diagnosis. Do not claim continuous infeasibility, dynamic safety, or actual robot execution. All geometry is a planar analytic 3R model with ideal attachment/support. No outside data or tools are available. Respond with exactly one JSON object and no markdown.
Allowed tools: {"tool":"test_candidate","action_id":"r8"} evaluates one listed candidate (not reference again); {"tool":"submit","action_id":"reference","diagnosis":"reference_connected"} ends the episode. Submit only a tested action that returned sampled_path_found=true, or null if you abstain. Leave a step for submission.
Diagnosis labels (for the initial reference, not the modified action): reference_connected = reference graph has a start-goal path; endpoint_unavailable = at least one endpoint has no valid candidate slot; local_stage_gap = endpoints nonempty but an interior stage has no valid slot; structural_disconnection = every stage has a locally valid slot but no start-goal graph path; unknown = evidence is insufficient.`;
 const extra={binary:"Only binary solver outcome is exposed.",local:"One representative local trace is exposed; it is not the entire solution space.",raw:'You may inspect already tested actions using {"tool":"inspect","action_id":"reference","kind":"slots","offset":0}. Available page kinds: slots, transfer_edges, switches (for regrasp). Use next_offset to paginate.',numeric:"Numerical structural metrics are exposed.",semantic:"The same numerical structural metrics and their language explanations are exposed.",full:'Numerical metrics and language explanations are exposed. Inspect already tested evidence: {"tool":"inspect","action_id":"reference","kind":"slots","offset":0}; other page kinds transfer_edges, switches, probe, edge, switch, dock, transit (for an individual item specify evidence_id). Query definition contracts with {"tool":"get_concept","concept_id":"B05"}. Definition contracts are not measured evidence.'};
 return common+"\n"+extra[profile];
}

function parseAction(content){if(typeof content!=="string")return null;try{const a=JSON.parse(content.trim());return a&&typeof a==="object"&&!Array.isArray(a)?a:null;}catch{return null;}}

async function runModelEpisode(task,settings,profile,registry,adapter){
 const t0=Date.now(),ep=createEpisode(task,settings,profile,registry),messages=[{role:"system",content:promptFor(profile)},{role:"user",content:JSON.stringify(ep.observation)}],modelCalls=[];let modelMs=0,solverMs=0; // initial solve included in total latency, not later solver_ms
 for(let i=0;i<settings.max_steps&&!ep.done;i++){
  const begin=Date.now();let r;
  try{r=await adapter.complete(messages.map(m=>({...m})));}catch(e){modelCalls.push({error:String(e.message||e),elapsed_ms:Date.now()-begin});modelMs+=Date.now()-begin;break;}
  const elapsed=Date.now()-begin;modelMs+=elapsed;const content=typeof r.content==="string"?r.content:"",a=parseAction(content);modelCalls.push({content,usage:r.usage??null,elapsed_ms:elapsed});
  const s0=Date.now(),feedback=ep.step(a||{tool:"invalid_json"});solverMs+=Date.now()-s0;
  messages.push({role:"assistant",content:content||"{}"},{role:"user",content:JSON.stringify(feedback)});
 }
 const record=ep.finish(),usageKeys=["prompt_tokens","completion_tokens","total_tokens"],usage={};
 for(const k of usageKeys)usage[k]=modelCalls.length>0&&modelCalls.every(c=>Number.isFinite(c.usage?.[k]))?modelCalls.reduce((s,c)=>s+c.usage[k],0):null;
 return {...record,execution:{model_calls:modelCalls.length,model_latency_ms:modelMs,post_initial_tool_latency_ms:solverMs,total_latency_ms:Date.now()-t0,usage,model_trace:modelCalls}};
}
export {promptFor,parseAction,runModelEpisode};
