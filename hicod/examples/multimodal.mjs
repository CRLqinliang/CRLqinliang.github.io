import {writeFileSync} from "node:fs";
import {scenes} from "../physical/planar3r.mjs";
import {multimodal} from "../physical/multimodal.mjs";
import {hybridReports,recoveryScene,supportAll} from "../physical/hybrid_reports.mjs";
const [name="regrasp_recovery",support="all",output]=process.argv.slice(2),cases={...scenes(),regrasp_recovery:recoveryScene()};
if(!cases[name])throw Error("Unknown scene");
const s=cases[name],stages=support==="all"?supportAll(s):support==="none"?[]:support.split(",").map(Number);
const r=multimodal(s,stages,{keep_evidence:true}),result={summary:r.summary,reports:hybridReports(r)};
if(output)writeFileSync(output,JSON.stringify({...result,evidence:r},null,2)+"\n");else console.log(JSON.stringify(result,null,2));
