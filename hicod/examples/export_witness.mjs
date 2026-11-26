import {writeFileSync} from "node:fs";
import {multimodal} from "../physical/multimodal.mjs";
import {recoveryScene} from "../physical/hybrid_reports.mjs";
function witnessFrames(){
 const scene=recoveryScene(),r=multimodal(scene,[8]),frames=[];
 const slot=new Map(r.raw.slots.map(s=>[s.id,s])),edge=new Map(r.raw.transitions.map(e=>[e.id,e])),attempt=new Map(r.attempts.map(a=>[a.id,a]));
 function append(p,phase,id){if(!p?.valid||!p.q||!p.points)throw Error("Invalid witness probe "+id);frames.push({phase,evidence_id:id,q:p.q,pose:p.pose,points:p.points});}
 for(const e of r.summary.witness_edges){
  if(!e.switch_cost){for(const id of edge.get(e.evidence_id).probes)append(r.raw.probes[id],"transfer",id);}
  else {const a=attempt.get(e.evidence_id);const rel=r.docks[a.release_dock],acq=r.docks[a.acquire_dock];rel.samples.forEach((p,i)=>append(p,"retreat",rel.id+":"+i));a.transit.samples.forEach((p,i)=>append(p,"transit",a.id+":"+i));acq.samples.slice().reverse().forEach((p,i)=>append(p,"approach",acq.id+":"+(acq.samples.length-1-i)));}
 }
 if(!frames.length||r.summary.min_graph_switches!==1)throw Error("Expected one-switch witness");
 return {schema:"hicod.sampled-witness-render.v1",scene,summary:{min_graph_switches:r.summary.min_graph_switches,support_stages:[8],path:r.summary.path},frames,limitations:["Analytic sampled geometric witness only.","Ideal external support and attachment; no grasp force or dynamics validation.","Frames show sampled configurations, not a verified continuous execution."]};
}
writeFileSync(process.argv[2]||"media/regrasp_witness.json",JSON.stringify(witnessFrames())+"\n");
