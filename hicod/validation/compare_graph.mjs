import {readFileSync} from "node:fs";
import {applyReplay,summarize} from "../physical/planar3r.mjs";
const r=JSON.parse(readFileSync(process.argv[2],"utf8")),replay=JSON.parse(readFileSync(process.argv[3],"utf8"));
const s=summarize(applyReplay(r.raw,replay)),e=r.expected,eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
console.log(JSON.stringify({fixed_graph_agrees:eq(s.connected_modes,e.connected_modes)&&eq(s.stage_counts,e.stage_counts)&&eq(s.reachable_counts,e.reachable_counts),analytic_connected_modes:e.connected_modes,mujoco_connected_modes:s.connected_modes,analytic_stage_counts:e.stage_counts,mujoco_stage_counts:s.stage_counts,analytic_reachable_counts:e.reachable_counts,mujoco_reachable_counts:s.reachable_counts}));
