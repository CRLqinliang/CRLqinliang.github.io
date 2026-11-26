import { scenes } from "./planar3r.mjs";
import { traverse } from "./multimodal.mjs";
function hybridReports(r){
 const s=r.summary,sc=s.scope;
 const make=(id,claim,result,children=[])=>({concept_id:id,status:"FINITE_EVIDENCE_RESULT",claim,result,scope:sc,children,limitations:["Ideal support is an explicit assumption, not verified stability.","Sampled paths and transitions only; no continuous or dynamic certificate."]});
 const switchOnly=r.graph.edges.filter(e=>e.switch_cost>0);
 const forward=traverse(r.graph.nodes,r.graph.edges,r.graph.starts),backward=traverse(r.graph.nodes,r.graph.edges,r.graph.goals,true);
 const routeSwitch=switchOnly.filter(e=>forward.has(e.from)&&backward.has(e.to));
 return {
 B06:make("B06",s.hybrid_connected?"A sampled hybrid path connects the endpoint sets.":"No sampled hybrid path found; continuous feasibility is unknown.",{connected:s.hybrid_connected,path:s.path},[{concept_id:"C04",edge_ids:switchOnly.map(e=>e.evidence_id)}]),
 C01:make("C01",routeSwitch.length?"A goal-reaching sampled walk with at least one attachment change exists.":"No goal-reaching sampled walk containing a regrasp was found.",{regrasp_witness_exists:routeSwitch.length>0,route_switch_ids:routeSwitch.map(e=>e.evidence_id),regrasp_required_in_graph:s.hybrid_connected&&s.min_graph_switches>0},[{concept_id:"B06"},{concept_id:"C04"}]),
 C02:make("C02","Computed intermediate supported stages admitting a complete one-switch sampled route.",{bridge_stages:s.one_switch_bridge_stages,bridge_edge_ids:s.one_switch_bridge_edges},[{concept_id:"C04",edge_ids:s.one_switch_bridge_edges}]),
 C04:make("C04","Computed sampled attachment-change relation over declared supported stages.",{attempted_pairs:s.attempted_pairs,accepted_switches:s.accepted_switches,stage_reports:s.stage_reports},[{concept_id:"P07"},{concept_id:"P09",assumption:"Ideal stationary support; not a tested stability predicate."}]),
 C05:make("C05",s.hybrid_connected?"Minimum attachment-change count in the supplied sampled graph.":"No finite graph route found; global minimum unknown.",{minimum_graph_cost:s.min_graph_switches,path:s.path,witness_edges:s.witness_edges},[{concept_id:"B06"},{concept_id:"C04"}])
 };
}
function recoveryScene(){return {...scenes().open,name:"regrasp_recovery",obstacles:[{center:[.23,-.1],radius:.055}]};}
function supportAll(s){return Array.from({length:s.stages-2},(_,i)=>i+1);}
export {hybridReports,recoveryScene,supportAll};
