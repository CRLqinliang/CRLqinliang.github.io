import {pathSweep} from "../physical/path_sweep.mjs";
import {scenes} from "../physical/planar3r.mjs";
import {recoveryScene} from "../physical/hybrid_reports.mjs";
const cases={...scenes(),regrasp_recovery:recoveryScene()};const s=cases[process.argv[2]||"regrasp_recovery"];if(!s)throw Error("Unknown scene");console.log(JSON.stringify(pathSweep(s),null,2));
