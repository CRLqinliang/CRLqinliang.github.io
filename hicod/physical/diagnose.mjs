import { evaluate } from "../evaluators.mjs";
import { summarize } from "./planar3r.mjs";

export function diagnose(raw){
  const s=summarize(raw),i=s.inputs;
  const reports={A01:evaluate("A01",i.A01),H04:evaluate("H04",i.H04)};
  if(i.B05.starts.length && i.B05.goals.length){
    reports.B05=evaluate("B05",i.B05);
    if(JSON.stringify([...reports.B05.result.connected_modes].sort())!==JSON.stringify([...s.connected_modes].sort()))
      throw Error("Layered evaluator disagrees with independent explorer traversal");
  }else{
    reports.B05={concept_id:"B05",status:"FINITE_EVIDENCE_RESULT",claim:"One or both endpoint sets are empty in the tested universe. Continuous feasibility is unknown.",result:{connected_modes:[]},scope:s.scope};
  }
  // Super-source/sink represent endpoint families; unit capacities on actual transitions.
  // Large endpoint capacities ensure the finite cut is not dominated by artificial edges.
  const capacity=i.B05.edges.length+1;
  const cutInput={scope:{...s.scope,domain:s.scope.domain+"; min-cut uses unit-capacity transition edges and artificial endpoint arcs"},
    nodes:["__start","__goal",...i.B05.nodes],source:"__start",sink:"__goal",
    edges:[...i.B05.edges,...i.B05.starts.map(n=>({from:"__start",to:n,capacity,evidence_id:"endpoint:"+n})),...i.B05.goals.map(n=>({from:n,to:"__goal",capacity,evidence_id:"endpoint:"+n}))]};
  reports.D03=evaluate("D03",cutInput);
  reports.E06=evaluate("E06",{...cutInput,goals:["__goal"]});
  const slots=new Map(raw.slots.map(n=>[n.id,n])),transitions=new Map(raw.transitions.map(e=>[e.id,e]));
  const failureFrontier=s.rejected_edges.filter(e=>s.reachable_ids.includes(e.from)&&!s.reachable_ids.includes(e.to));
  const diagnosis={status:"FINITE_EVIDENCE_RESULT",claim:s.connected_modes.length?
      "At least one sampled fixed attachment admits a branch-consistent path.":
      s.common_modes.length&&s.stage_counts.every(n=>n>0)?
      "Endpoint compatibility and local IK feasibility coexist with disconnection of the sampled fixed-mode path family.":
      "No sampled fixed-mode path was found; inspect endpoint and stage feasibility.",
    evidence:{common_modes:s.common_modes,connected_modes:s.connected_modes,first_lost_stage:s.first_lost_stage,frontier_rejected_edge_ids:failureFrontier.map(e=>e.id),stage_counts:s.stage_counts,reachable_counts:s.reachable_counts},
    limitations:["Failure frontier describes this sampled path family, not a causal proof or global task infeasibility.","No actual gripper, support/regrasp, approach, release, dynamics, or continuous collision certificate."]};
  return {summary:s,reports,diagnosis,drillDown(id){
    if(raw.probes[id])return raw.probes[id];
    if(slots.has(id))return {slot:slots.get(id),probe:raw.probes[slots.get(id).probe]};
    if(transitions.has(id)){const e=transitions.get(id);return {transition:e,probes:e.probes.map(p=>raw.probes[p]),rejection:s.rejected_edges.find(r=>r.id===id)||null};}
    return null;
  }};
}
