import {evaluateCandidate} from "./geometry.mjs";
function profiles(){return ["binary","local","raw","numeric","semantic","full"];}

function diagnoses(){return ["reference_connected","endpoint_unavailable","local_stage_gap","structural_disconnection","unknown"];}

function createEpisode(task,settings,profile,registry=null){
 if(!profiles().includes(profile))throw Error("Unknown profile");
 const actions=new Map(task.actions.map(a=>[a.id,a])),cache=new Map(),history=[];let calls=0,probes=0,steps=0,done=false,submission=null;
 const invariant="Only finite analytic sampled evidence; ideal support/attachment. Never infer continuous infeasibility or execution safety. All groups share the candidate solver.";
 function solve(id){const action=actions.get(id);if(!action)throw Error("Unknown candidate action");if(cache.has(id))throw Error("Already tested; inspect existing feedback");if(calls>=settings.max_solver_calls)throw Error("Solver budget exhausted");const r=evaluateCandidate(task,action);cache.set(id,r);calls++;probes+=r.probe_calls;return r;}
 function numeric(r){const f=r.fixed,hy=r.hybrid?.summary;return {common_modes:f.common_modes.length,connected_fixed_modes:f.connected_modes.length,local_counts:f.stage_counts,forward_reachable_counts:f.reachable_counts,valid_slots:f.valid_slots,total_slots:f.total_slots,...(hy?{supported_stage:r.action.stage,admitted_switches:hy.accepted_switches,minimum_graph_switches:hy.min_graph_switches,one_switch_bridge_stages:hy.one_switch_bridge_stages}:{})};}
 function local(r){const slot=r.raw.slots.find(s=>s.stage===0&&r.raw.probes[s.probe].valid)||r.raw.slots[0];const trace=r.raw.slots.filter(s=>s.mode===slot.mode&&s.branch===slot.branch).map(s=>r.raw.probes[s.probe]);const bad=trace.find(p=>!p.valid),p=bad||trace.at(-1);return {scope:"One reference attachment/IK branch in slot order, not all candidates. For a hybrid action, this is its fixed-transfer local trace, not the switch witness.",probe_id:p.id,mode:p.mode,branch:p.branch,t:p.t,valid:p.valid,faults:p.faults,minimum_checked_clearance_m:p.pairs?.length?Math.min(...p.pairs.map(x=>x.clearance)):null};}
 function rawIndex(r){return {slot_count:r.raw.slots.length,transfer_edge_count:r.raw.transitions.length,regrasp_attempt_count:r.hybrid?.attempts.length??0,available_pages:["slots","transfer_edges",...(r.hybrid?["switches"]:[])]};}
 function feedback(r){const o={action_id:r.action.id,sampled_path_found:r.found,solver_calls_used:calls,probe_calls_used:probes};
  if(profile==="local")o.local=local(r);
  if(profile==="raw")o.raw_index=rawIndex(r);
  if(["numeric","semantic","full"].includes(profile)){const n=numeric(r);o.metrics=n;if(profile!=="numeric"){o.explanation=`${n.common_modes} attachment modes are compatible at both endpoints, and ${n.connected_fixed_modes} span the fixed sampled path. ${n.local_counts.filter(x=>x===0).length} of ${n.local_counts.length} sampled stages have no locally valid slot. ${n.forward_reachable_counts.at(-1)} goal slots are reachable from the start in the fixed graph.`;if(r.hybrid)o.explanation+=` With support at stage ${n.supported_stage}, ${n.admitted_switches} sampled switches are admitted and the graph minimum is ${n.minimum_graph_switches===null?"unknown (no graph route)":n.minimum_graph_switches}.`;}}
  if(profile==="full")o.evidence_index=rawIndex(r);return o;}
 function inspect(a){if(!["raw","full"].includes(profile))throw Error("Evidence pages are not available in this profile");const r=cache.get(a.action_id);if(!r)throw Error("Test this action before inspecting");const offset=a.offset??0;if(!Number.isSafeInteger(offset)||offset<0)throw Error("Invalid offset");let list;
  if(a.kind==="slots")list=r.raw.slots.map(s=>{const p=r.raw.probes[s.probe];return {id:s.id,stage:s.stage,mode:s.mode,branch:s.branch,probe_id:s.probe,valid:p.valid,q:p.q,faults:p.faults};});
  else if(a.kind==="transfer_edges"){const good=new Set(r.fixed.inputs.B05.edges.map(e=>e.evidence_id));list=r.raw.transitions.map(e=>({id:e.id,from:e.from,to:e.to,admitted:good.has(e.id),probes:e.probes}));}
  else if(a.kind==="switches"&&r.hybrid)list=r.hybrid.attempts.map(e=>({id:e.id,stage:e.stage,from:e.from,to:e.to,admitted:e.valid,reason:e.reason,release_dock:e.release_dock,acquire_dock:e.acquire_dock}));
  else if(a.kind==="probe"&&profile==="full"){const p=r.raw.probes[a.evidence_id];if(!p)throw Error("Unknown probe");return {action_id:a.action_id,probe:p};}
  else if(a.kind==="edge"&&profile==="full"){const e=r.raw.transitions.find(e=>e.id===a.evidence_id);if(!e)throw Error("Unknown edge");list=e.probes.map(id=>r.raw.probes[id]);}
  else if(a.kind==="switch"&&profile==="full"){const e=r.hybrid?.attempts.find(e=>e.id===a.evidence_id);if(!e)throw Error("Unknown switch");return {id:e.id,admitted:e.valid,reason:e.reason,release_dock:e.release_dock,acquire_dock:e.acquire_dock,transit_sample_count:e.transit?.samples.length??0};}
  else if(a.kind==="dock"&&profile==="full"){const d=r.hybrid?.docks[a.evidence_id];if(!d)throw Error("Unknown dock");list=d.samples.map((p,i)=>({index:i,...p}));}
  else if(a.kind==="transit"&&profile==="full"){const e=r.hybrid?.attempts.find(e=>e.id===a.evidence_id);if(!e?.transit)throw Error("No evaluated transit");list=e.transit.samples.map((p,i)=>({index:i,...p}));}
  else throw Error("Unknown or unavailable evidence page");
  const limit=settings.inspect_page_size;return {action_id:a.action_id,kind:a.kind,total:list.length,offset,items:list.slice(offset,offset+limit),next_offset:offset+limit<list.length?offset+limit:null};}
 const initial=feedback(solve("reference"));
 const observation={task_id:task.id,information_profile:profile,task:{robot:task.scene.model,path:task.scene.path,obstacles:task.scene.obstacles,stages:task.scene.stages,edge_subdivisions:task.scene.edge_subdivisions,max_joint_step:task.scene.max_joint_step,allowed_support:task.allowed_support},actions:task.actions,initial,limits:{...settings,max_solver_calls:settings.max_solver_calls,max_steps:settings.max_steps},diagnosis_labels:diagnoses(),scope:invariant};
 function step(a){if(done)throw Error("Episode finished");if(steps>=settings.max_steps)throw Error("Step budget exhausted");steps++;let result;
  try{if(!a||typeof a!=="object")throw Error("Action must be object");
   if(a.tool==="test_candidate")result=feedback(solve(a.action_id));
   else if(a.tool==="inspect")result=inspect(a);
   else if(a.tool==="get_concept"){if(profile!=="full"||!registry)throw Error("Concept definitions are unavailable in this profile");const n=[...registry.concepts,...registry.primitives].find(n=>n.id===a.concept_id);if(!n)throw Error("Unknown concept ID");result={concept_id:n.id,definition:n.definition,formalization:n.formalization,requires:n.requires,optional_evidence:n.optional_evidence||[],diagnostic_related:n.diagnostic_related,limitations:n.limitations,note:"Definition and dependency contracts only; no new physical evaluation."};}
   else if(a.tool==="submit"){if(!diagnoses().includes(a.diagnosis))throw Error("Choose declared diagnosis label");if(a.action_id!==null&&(!cache.has(a.action_id)||!cache.get(a.action_id).found))throw Error("Submit only a tested action with a sampled witness, or null");submission={action_id:a.action_id,diagnosis:a.diagnosis};done=true;result={accepted:true,submission};}
   else throw Error("Unknown tool");
  }catch(e){result={error:e.message};}
  history.push({step:steps,action:a,result});return {...result,remaining_solver_calls:settings.max_solver_calls-calls,remaining_steps:settings.max_steps-steps};}
 function finish(){if(!done){done=true;submission={action_id:null,diagnosis:"unknown",timed_out:true};}return {task_id:task.id,profile,submission,solver_calls:calls,physical_probe_calls:probes,steps,history};}
 return {observation,step,finish,get done(){return done;}};
}

function scoreEpisode(record,label){const id=record.submission.action_id,success=id!==null&&label.successful_actions.includes(id),abstain=id===null&&!record.submission.timed_out;return {task_id:record.task_id,profile:record.profile,category:label.category,oracle_solvable:label.finite_oracle_solvable,sampled_success:success,correct_abstention:abstain&&!label.finite_oracle_solvable,false_abstention:abstain&&label.finite_oracle_solvable,unresolved:!!record.submission.timed_out,diagnosis_correct:record.submission.diagnosis===label.diagnosis,solver_calls:record.solver_calls,physical_probe_calls:record.physical_probe_calls,steps:record.steps,timed_out:!!record.submission.timed_out};}

function aggregate(rows){const N=rows.length,solvable=rows.filter(r=>r.oracle_solvable),none=rows.filter(r=>!r.oracle_solvable),avg=(k)=>N?rows.reduce((s,r)=>s+r[k],0)/N:null;return {tasks:N,oracle_solvable:solvable.length,sampled_successes:rows.filter(r=>r.sampled_success).length,success_rate_on_solvable:solvable.length?solvable.filter(r=>r.sampled_success).length/solvable.length:null,correct_abstentions:none.filter(r=>r.correct_abstention).length,none_count:none.length,false_abstentions:rows.filter(r=>r.false_abstention).length,unresolved:rows.filter(r=>r.unresolved).length,diagnosis_accuracy:N?rows.filter(r=>r.diagnosis_correct).length/N:null,mean_solver_calls:avg("solver_calls"),mean_physical_probe_calls:avg("physical_probe_calls"),mean_steps:avg("steps")};}

function scriptedEpisode(task,settings,profile){const ep=createEpisode(task,settings,profile),initial=ep.observation.initial;
 let diagnosis=initial.sampled_path_found?"reference_connected":"unknown",order=task.actions.filter(a=>a.id!=="reference");
 if(initial.metrics){const m=initial.metrics;if(!initial.sampled_path_found){diagnosis=m.local_counts[0]===0||m.local_counts.at(-1)===0?"endpoint_unavailable":m.local_counts.some(n=>n===0)?"local_stage_gap":"structural_disconnection";
  // Explicit hand-written diagnostic policy for a smoke test, not an LLM.
  if(diagnosis==="structural_disconnection")order.sort((a,b)=>(a.kind==="regrasp"?Math.abs(a.stage-8):100)-(b.kind==="regrasp"?Math.abs(b.stage-8):100));
  if(diagnosis==="local_stage_gap")order.sort((a,b)=>(a.kind==="deform"?0:100)-(b.kind==="deform"?0:100));
 }}
 let chosen=initial.sampled_path_found?"reference":null;for(const a of order.slice(0,settings.max_solver_calls-1)){if(chosen)break;const r=ep.step({tool:"test_candidate",action_id:a.id});if(r.sampled_path_found)chosen=a.id;}
 ep.step({tool:"submit",action_id:chosen,diagnosis});return ep.finish();}

function verifyBenchmark(bank,oracle){const checks=[];const check=(name,x)=>{if(!x)throw Error(name);checks.push(name);};const task=bank.tasks.find(t=>t.id==="T001"),label=oracle.labels.find(x=>x.id===task.id),settings=bank.settings;
check("32 tasks / 448 finite action labels",bank.tasks.length===32&&oracle.labels.reduce((s,l)=>s+l.actions.length,0)===448);
check("every public-test strategy category represented",["reference","regrasp_only","deform_only","none"].every(k=>oracle.labels.some(l=>l.split==="public_test"&&l.category===k)));
check("split identity matches labels",bank.tasks.every(t=>oracle.labels.find(l=>l.id===t.id).split===t.split));
const ep=createEpisode(task,settings,"full");check("initial reference counted",ep.observation.initial.solver_calls_used===1&&ep.observation.initial.probe_calls_used===1040);
check("no oracle fields in initial observation",!JSON.stringify(ep.observation).includes("successful_actions")&&!JSON.stringify(ep.observation).includes("finite_oracle_solvable"));
const candidate=ep.step({tool:"test_candidate",action_id:"r8"});check("same finite witness as oracle",candidate.sampled_path_found===label.successful_actions.includes("r8"));
const page=ep.step({tool:"inspect",kind:"switches",action_id:"r8"});check("paginated observed switches",page.items.length<=settings.inspect_page_size&&page.total>0);
const bad=ep.step({tool:"submit",action_id:"d0",diagnosis:"structural_disconnection"});check("unverified action rejected",!!bad.error&&!ep.done);
ep.step({tool:"submit",action_id:"r8",diagnosis:"structural_disconnection"});check("verified finite success",scoreEpisode(ep.finish(),label).sampled_success);
const p1=createEpisode(task,settings,"numeric"),p2=createEpisode(task,settings,"semantic");check("numeric/semantic exact same numerical payload",JSON.stringify(p1.observation.initial.metrics)===JSON.stringify(p2.observation.initial.metrics)&&!p1.observation.initial.explanation&&!!p2.observation.initial.explanation);
const b=createEpisode(task,settings,"binary");check("binary cannot access raw evidence",!!b.step({tool:"inspect",kind:"slots",action_id:"reference"}).error&&!b.observation.initial.metrics);
const r=createEpisode(task,settings,"raw");check("raw page but no structural summary",!r.observation.initial.metrics&&r.step({tool:"inspect",kind:"slots",action_id:"reference"}).items.length===settings.inspect_page_size);
for(const a of task.actions.slice(1,6))b.step({tool:"test_candidate",action_id:a.id});check("budget enforced",!!b.step({tool:"test_candidate",action_id:task.actions[6].id}).error);
const rows=[];for(const t of bank.tasks){const l=oracle.labels.find(x=>x.id===t.id);for(const p of ["binary","numeric"]){const r=scriptedEpisode(t,settings,p);rows.push({...scoreEpisode(r,l),split:t.split});}}
check("64 scripted episodes scored",rows.length===64&&rows.every(r=>r.solver_calls<=settings.max_solver_calls));
return {checks,rows,summary:Object.fromEntries(["binary","numeric"].map(p=>[p,Object.fromEntries(["development","public_test","all"].map(split=>[split,aggregate(rows.filter(r=>r.profile===p&&(split==="all"||r.split===split)))]))]))};}
export {profiles,diagnoses,createEpisode,scoreEpisode,aggregate,scriptedEpisode,verifyBenchmark};
