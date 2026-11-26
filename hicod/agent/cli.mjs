import {readFileSync} from "node:fs";
import {createInterface} from "node:readline";
import {createAgent} from "./core.mjs";
const a=createAgent(JSON.parse(readFileSync(new URL("../concept_graph.json",import.meta.url),"utf8")));
for await(const line of createInterface({input:process.stdin,crlfDelay:Infinity})){try{const r=JSON.parse(line);console.log(JSON.stringify({id:r.id,result:a.call(r.tool,r.arguments)}));}catch(e){console.log(JSON.stringify({error:e.message}));}}
