import {explore,summarize} from "./planar3r.mjs";
function pathSweep(scene,step=.03,extent=4){
 if(scene.path.length!==2)throw Error("Sweep requires a straight two-waypoint reference path");
 if(!Number.isFinite(step)||step<=0||!Number.isInteger(extent)||extent<0||extent>8)throw Error("Invalid finite sweep");
 const [start,goal]=scene.path,mid=start.map((x,i)=>(x+goal[i])/2),baseline=summarize(explore(scene)),candidates=[];
 for(let i=-extent;i<=extent;i++)for(let j=-extent;j<=extent;j++){
  if(i*i+j*j>extent*extent)continue;
  const dx=i*step,dy=j*step,d=Math.hypot(dx,dy),p=[mid[0]+dx,mid[1]+dy,mid[2]],next={...scene,path:[start,p,goal]};
  const s=summarize(explore(next)),score=s.connected_modes.length,delta=score-baseline.connected_modes.length;
  candidates.push({id:"d:"+i+":"+j,offset_m:[dx,dy],max_reference_deviation_m:d,path:next.path,connected_modes:s.connected_modes,common_modes:s.common_modes,valid_slots:s.valid_slots,score,score_change:delta,finite_contrast_modes_per_m:d>0?delta/d:null});
 }
 candidates.sort((a,b)=>a.max_reference_deviation_m-b.max_reference_deviation_m||a.id.localeCompare(b.id));
 const feasible=candidates.filter(c=>c.score>0),best=feasible[0]||null,scope={...baseline.scope,domain:baseline.scope.domain+"; midpoint displacement on a finite XY disk grid, endpoints fixed; no yaw modification",step_m:step,max_deviation_m:step*extent,candidate_count:candidates.length,score:"count of sampled connected fixed attachment modes",continuous_certificate:false};
 return {scene:scene.name,scope,baseline_connected_modes:baseline.connected_modes,candidates,reports:{G04:{concept_id:"G04",status:"FINITE_EVIDENCE_RESULT",claim:"Controlled midpoint perturbations and changes in sampled connected-mode counts; finite contrasts, not gradients.",scope,result:{baseline_score:baseline.connected_modes.length,max_score:Math.max(...candidates.map(c=>c.score)),contrasts:candidates.map(c=>({id:c.id,offset_m:c.offset_m,score_change:c.score_change,finite_contrast_modes_per_m:c.finite_contrast_modes_per_m}))}},I04:{concept_id:"I04",status:"FINITE_EVIDENCE_RESULT",claim:best?"Minimum deviation among the enumerated candidates with a sampled fixed-mode path.":"No repair found among enumerated path deformations; global repair feasibility is unknown.",scope,result:{candidate_count:candidates.length,successful_candidates:feasible.length,minimum_enumerated_deviation_m:best?.max_reference_deviation_m??null,witness:best,global_minimum_certified:false}}}};
}
export {pathSweep};
