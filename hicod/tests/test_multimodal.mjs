import {scenes} from "../physical/planar3r.mjs";
import {multimodal} from "../physical/multimodal.mjs";
import {hybridReports,recoveryScene,supportAll} from "../physical/hybrid_reports.mjs";
function testMulti(){const checks=[];const t=(name,v)=>{if(!v)throw Error(name);checks.push(name);};const s=recoveryScene(),none=multimodal(s,[],{keep_evidence:false}),all=multimodal(s,supportAll(s)),only=multimodal(s,[8],{keep_evidence:false}),outside=multimodal(s,[1],{keep_evidence:false}),neg=multimodal(scenes().disconnected,supportAll(s),{keep_evidence:false});
t("No support: no switch",none.summary.accepted_switches===0&&!none.summary.hybrid_connected);
t("Full support: one switch",all.summary.hybrid_connected&&all.summary.min_graph_switches===1);
t("Eleven supported bridge stages",JSON.stringify(all.summary.one_switch_bridge_stages)===JSON.stringify(Array.from({length:11},(_,i)=>i+2)));
t("One bridge stage sufficient",only.summary.hybrid_connected&&only.summary.min_graph_switches===1);
t("Nonbridging stage insufficient",!outside.summary.hybrid_connected);
t("Negative scene retained",!neg.summary.hybrid_connected&&neg.summary.accepted_switches>0);
t("Witness cost agrees",all.summary.witness_edges.reduce((v,e)=>v+e.switch_cost,0)===all.summary.min_graph_switches);
t("Switch edges have different modes and same stage",all.graph.edges.filter(e=>e.switch_cost).every(e=>{const a=all.raw.slots.find(s=>s.id===e.from),b=all.raw.slots.find(s=>s.id===e.to);return a.mode!==b.mode&&a.stage===b.stage;}));
t("Every admitted switch has checked dock and transit evidence",all.graph.edges.filter(e=>e.switch_cost).every(e=>{const a=all.attempts.find(a=>a.id===e.evidence_id);return a?.valid&&a.transit.samples.every(p=>p.valid)&&all.docks[a.release_dock].valid&&all.docks[a.acquire_dock].valid;}));
t("C01 and C02 agree with graph",hybridReports(all).C01.result.regrasp_required_in_graph&&hybridReports(all).C02.result.bridge_stages.length===11);
t("No unsupported stages",only.graph.edges.filter(e=>e.switch_cost).every(e=>e.stage===8));
let bad=false;try{multimodal(s,[0]);}catch{bad=true;}t("Invalid support input rejected",bad);
return {checks,results:{none:none.summary,all:all.summary,only:only.summary,outside:outside.summary,negative:neg.summary}};
}
console.log(JSON.stringify(testMulti().checks,null,2));
