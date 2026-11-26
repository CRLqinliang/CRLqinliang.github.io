// MIT. Sampled planar regrasp with ideal support; no contact dynamics.
import {fk,ik,dist,pointSeg,segSeg,poseAt,explore,summarize} from './planar3r.mjs';
import {evaluate} from '../evaluators.mjs';
function emptyCheck(scene,q,pose,allowDock=false){
 const m=scene.model,k=fk(q,m.lengths),faults=[],pairs=[];q.forEach((v,i)=>{if(!Number.isFinite(v)||v<m.limits[i][0]-1e-10||v>m.limits[i][1]+1e-10)faults.push("JOINT_LIMIT_"+i);});
 function add(a,b,d,threshold=m.margin){pairs.push({a,b,clearance:d,threshold});if(d<=threshold)faults.push("CLEARANCE:"+a+"/"+b);}
 for(let j=0;j<scene.obstacles.length;j++){const o=scene.obstacles[j];for(let i=0;i<3;i++)add("link"+i,"obs"+j,pointSeg(o.center,k.points[i],k.points[i+1])-m.link_radius-o.radius);add("payload","obs"+j,dist(pose,o.center)-m.object_radius-o.radius);}
 add("link0","link2",segSeg(k.points[0],k.points[1],k.points[2],k.points[3])-2*m.link_radius);
 for(let i=0;i<3;i++){const a=k.points[i],b=k.points[i+1],d=pointSeg(pose,a,b)-m.link_radius-m.object_radius;
 const capOnly=i===2&&allowDock&&((pose[0]-b[0])*(b[0]-a[0])+(pose[1]-b[1])*(b[1]-a[1])>=-1e-10)&&dist(pose,b)>=m.object_radius-1e-9;
 add("link"+i,"payload",d,capOnly?-m.link_radius-1e-9:m.margin);}
 return {q,points:k.points,pose,valid:!faults.length,faults,pairs};
}
function dock(scene,slot,pose,retreat,steps){
 const m=scene.model,samples=[];for(let i=0;i<=steps;i++){const q=ik(pose,m.angles[slot.mi],slot.branch,{...m,object_radius:m.object_radius+retreat*i/steps});if(!q){samples.push({q:null,pose,valid:false,faults:["IK_UNREACHABLE"]});continue;}samples.push(emptyCheck(scene,q,pose,true));}
 const jump=samples.some((p,i)=>i&&p.q&&samples[i-1].q&&p.q.some((x,j)=>Math.abs(x-samples[i-1].q[j])>scene.max_joint_step));
 const exit=samples.at(-1).q?emptyCheck(scene,samples.at(-1).q,pose,false):null;
 return {valid:samples.every(p=>p.valid)&&!jump&&!!exit?.valid,samples,jump,exit};
}
function transit(scene,q1,q2,pose){
 const steps=Math.max(1,Math.ceil(Math.max(...q1.map((q,i)=>Math.abs(q2[i]-q)))/Math.min(scene.max_joint_step,.04)));const samples=[];for(let i=0;i<=steps;i++)samples.push(emptyCheck(scene,q1.map((q,j)=>q+(q2[j]-q)*i/steps),pose,false));return {valid:samples.every(p=>p.valid),samples};
}
function traverse(nodes,edges,roots,reverse=false){
 const adj=new Map(nodes.map(n=>[n,[]]));for(const e of edges)adj.get(reverse?e.to:e.from).push(reverse?e.from:e.to);
 const seen=new Set(roots),queue=[...roots];for(let i=0;i<queue.length;i++)for(const n of adj.get(queue[i]))if(!seen.has(n)){seen.add(n);queue.push(n);}return seen;
}
function multimodal(scene,supportStages=[],options={}){
 const retreat=options.retreat??.08,steps=options.dock_steps??8,keep=options.keep_evidence!==false;
 if(!Array.isArray(supportStages)||new Set(supportStages).size!==supportStages.length||supportStages.some(i=>!Number.isInteger(i)||i<=0||i>=scene.stages-1))throw Error("Support stages must be unique interior integers");
 if(!Number.isFinite(retreat)||retreat<=scene.model.link_radius+scene.model.margin||!Number.isInteger(steps)||steps<2||steps>100)throw Error("Invalid retreat or dock resolution");
 const raw=explore(scene),fixed=summarize(raw),i=fixed.inputs.B05,valid=raw.slots.filter(x=>raw.probes[x.probe].valid),nodes=i.nodes,edges=[...i.edges],starts=i.starts,goals=i.goals;
 const docks={},attempts=[],switchEdges=[],stageReports=[];
 const reachFixed=traverse(nodes,edges,starts),coFixed=traverse(nodes,edges,goals,true);
 let checks=0;
 for(const stage of [...supportStages].sort((a,b)=>a-b)){const slots=valid.filter(x=>x.stage===stage),pose=poseAt(scene,stage/(scene.stages-1)),ds=new Map();
 for(const s of slots){const d=dock(scene,s,pose,retreat,steps);if(d.valid&&d.samples[0].q.some((q,j)=>Math.abs(q-raw.probes[s.probe].q[j])>1e-8))throw Error("Dock does not match attached endpoint");const id="dock:"+s.id;ds.set(s.id,d);if(keep)docks[id]={id,slot:s.id,...d};}
 let count=0,eligible=0,dockRejected=0,transitRejected=0;
 for(const a of slots)for(const b of slots){if(a.mode===b.mode)continue;eligible++;const da=ds.get(a.id),db=ds.get(b.id),id="r:"+stage+":"+a.id+":"+b.id;const entry={id,stage,from:a.id,to:b.id,release_dock:"dock:"+a.id,acquire_dock:"dock:"+b.id,valid:false,reason:null};
 if(!da.valid||!db.valid){dockRejected++;entry.reason="DOCK_OR_RETREAT_REJECTED";}else{checks++;const t=transit(scene,da.samples.at(-1).q,db.samples.at(-1).q,pose);entry.valid=t.valid;entry.reason=t.valid?null:"EMPTY_TRANSIT_REJECTED";if(keep)entry.transit=t;if(t.valid){count++;switchEdges.push({from:a.id,to:b.id,switch_cost:1,evidence_id:id,capacity:1,stage,kind:"supported_regrasp"});}else transitRejected++;}
 if(keep)attempts.push(entry);}
 stageReports.push({stage,pose,attached_slots:slots.length,eligible_pairs:eligible,valid_docks:[...ds.values()].filter(d=>d.valid).length,accepted_switches:count,rejected_dock:dockRejected,rejected_transit:transitRejected});
 }
 const all=[...edges,...switchEdges],reachable=traverse(nodes,all,starts),coreach=traverse(nodes,all,goals,true);
 const oneSwitch=switchEdges.filter(e=>reachFixed.has(e.from)&&coFixed.has(e.to)),onRoute=switchEdges.filter(e=>reachable.has(e.from)&&coreach.has(e.to));
 const scope={...fixed.scope,model:"analytic planar 3R; explicit ideal support at selected interior stages",domain:fixed.scope.domain+"; release–radial retreat–empty joint transit–radial approach–reacquire at fixed object pose; different attachment modes only",evidence:"Sampled analytic geometry, IK, joint bounds, dock and transit traces; ideal support/attachment assumption, no actual force closure or support dynamics.",support_stages:[...supportStages],retreat_m:retreat,dock_steps:steps,empty_transit_max_joint_step_rad:Math.min(scene.max_joint_step,.04),continuous_certificate:false};
 const input={scope,nodes,edges:all,starts,goals};
 const cost=starts.length&&goals.length?evaluate("C05",input).result:{minimum_graph_cost:null,path:[]};
 const witness=cost.path.slice(1).map((v,j)=>{const e=all.find(e=>e.from===cost.path[j]&&e.to===v);if(!e)throw Error("Missing path edge");return e;});
 const bridges=[...new Set(oneSwitch.map(e=>e.stage))].sort((a,b)=>a-b);
 const summary={scene:scene.name,common_modes:fixed.common_modes,connected_fixed_modes:fixed.connected_modes,hybrid_connected:cost.path.length>0,min_graph_switches:cost.minimum_graph_cost,stage_reports:stageReports,attempted_pairs:stageReports.reduce((a,s)=>a+s.eligible_pairs,0),transit_checks:checks,accepted_switches:switchEdges.length,one_switch_bridge_stages:bridges,one_switch_bridge_edges:oneSwitch.map(e=>e.evidence_id),on_route_switches:onRoute.map(e=>e.evidence_id),path:cost.path,witness_edges:witness,scope};
 return {summary,graph:input,raw:keep?raw:null,docks,attempts};
}
export {emptyCheck,dock,transit,traverse,multimodal};
