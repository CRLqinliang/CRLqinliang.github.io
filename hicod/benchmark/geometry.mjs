import {scenes,explore,summarize} from "../physical/planar3r.mjs";
import {multimodal} from "../physical/multimodal.mjs";
function makeTasks(specs,settings){
 const base=scenes().open;return specs.map(([x,y,r],i)=>({id:"T"+String(i+1).padStart(3,"0"),split:i%4===3?"public_test":"development",scene:{...base,name:"T"+String(i+1).padStart(3,"0"),obstacles:[{center:[x,y],radius:r}]},allowed_support:[...settings.support_stages],actions:[{id:"reference",kind:"reference"},...settings.support_stages.map(stage=>({id:"r"+stage,kind:"regrasp",stage})),...settings.offsets.map(([dx,dy],j)=>({id:"d"+j,kind:"deform",offset_m:[dx,dy]}))]}));
}
function evaluateCandidate(task,action){
 const original=task.scene;let spec=original;
 if(action.kind==="deform"){const [a,b]=original.path,mid=a.map((v,i)=>(v+b[i])/2);spec={...original,path:[a,[mid[0]+action.offset_m[0],mid[1]+action.offset_m[1],mid[2]],b]};}
 let raw,hybrid=null,probe_calls=0;
 if(action.kind==="regrasp"){if(!task.allowed_support.includes(action.stage))throw Error("Unsupported stage");hybrid=multimodal(spec,[action.stage]);raw=hybrid.raw;probe_calls=Object.keys(raw.probes).length+Object.values(hybrid.docks).reduce((s,d)=>s+d.samples.length+(d.exit?1:0),0)+hybrid.attempts.reduce((s,a)=>s+(a.transit?.samples.length||0),0);}
 else{raw=explore(spec);probe_calls=Object.keys(raw.probes).length;}
 const fixed=summarize(raw),found=hybrid?hybrid.summary.hybrid_connected:fixed.connected_modes.length>0;
 return {action,raw,fixed,hybrid,found,probe_calls,scope:"Finite sampled analytic 3R; ideal attachment/support; no continuous or dynamic certificate."};
}
function classify(f){if(f.connected_modes.length)return "reference_connected";if(!f.inputs.B05.starts.length||!f.inputs.B05.goals.length)return "endpoint_unavailable";if(f.stage_counts.some(n=>n===0))return "local_stage_gap";return "structural_disconnection";}
function labelTask(task){const solved=task.actions.map(a=>{const x=evaluateCandidate(task,a);return {id:a.id,kind:a.kind,found:x.found,probe_calls:x.probe_calls,...(x.hybrid?{min_graph_switches:x.hybrid.summary.min_graph_switches}:{})};});const f=evaluateCandidate(task,task.actions[0]).fixed;const successful=solved.filter(x=>x.found),kinds=[...new Set(successful.map(x=>x.kind))];return {id:task.id,split:task.split,diagnosis:classify(f),finite_oracle_solvable:successful.length>0,successful_actions:successful.map(x=>x.id),successful_kinds:kinds,reference_common:f.common_modes.length,reference_connected:f.connected_modes.length,all_local_nonempty:f.stage_counts.every(x=>x>0),actions:solved};}
export {makeTasks,evaluateCandidate,classify,labelTask};
