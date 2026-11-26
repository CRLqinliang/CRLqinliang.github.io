import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {resolve,join,relative,isAbsolute} from "node:path";
import {fileURLToPath} from "node:url";
import {randomBytes} from "node:crypto";
import {generateHoldout} from "./generator.mjs";
import {labelTask} from "../benchmark/geometry.mjs";
const [destination,countText="24",seedText]=process.argv.slice(2);
if(!destination)throw Error("Usage: node holdout/generate.mjs /absolute/private/output [count] [uint32 seed]");
const dir=resolve(destination),root=fileURLToPath(new URL("../../",import.meta.url)),rel=relative(root,dir);
if(!isAbsolute(destination)||(!rel.startsWith("..")&&!isAbsolute(rel)))throw Error("Place private holdout outside the repository");
if(["tasks.json","oracle.json","manifest.json"].some(n=>existsSync(join(dir,n))))throw Error("Existing private holdout would be overwritten");
const bank=JSON.parse(readFileSync(new URL("../benchmark/tasks.json",import.meta.url),"utf8")),seed=seedText===undefined?randomBytes(4).readUInt32LE():Number(seedText),count=Number(countText);
const tasks=generateHoldout(bank.tasks[0].scene,bank.settings,count,seed),labels=tasks.map(labelTask),categories={reference:0,regrasp_only:0,deform_only:0,both_repairs:0,none:0};
for(const l of labels){const k=l.successful_kinds.includes("reference")?"reference":l.successful_kinds.includes("regrasp")&&l.successful_kinds.includes("deform")?"both_repairs":l.successful_kinds.includes("regrasp")?"regrasp_only":l.successful_kinds.includes("deform")?"deform_only":"none";l.category=k;categories[k]++;}
mkdirSync(dir,{recursive:true,mode:0o700});const save=(n,v)=>writeFileSync(join(dir,n),JSON.stringify(v,null,2)+"\n",{flag:"wx",mode:0o600});
save("tasks.json",{schema:"hicod.benchmark.tasks.v1",settings:bank.settings,tasks,split_policy:"private seeded unfiltered distribution shift: two obstacles, varied arm lengths, endpoints and radius"});
save("oracle.json",{schema:"hicod.benchmark.oracle.v1",status:"computed_finite_oracle_same_backend",labels,categories});
save("manifest.json",{schema:"hicod.holdout.v1",seed,count,generator:"holdout/generator.mjs",note:"Keep seed, tasks and oracle private until evaluation is frozen. Do not select or drop tasks after observing outcomes."});
console.log("Private holdout generated at "+dir+"; "+count+" tasks. No labels or seed printed.");
