import { readFileSync } from "node:fs";
import { evaluate } from "../evaluators.mjs";
const fixture=JSON.parse(readFileSync(new URL("./finite_evidence.json",import.meta.url),"utf8"));
const id=process.argv[2];
if(id && !(id in fixture))throw new Error("No example for "+id);
console.log(JSON.stringify(id?evaluate(id,fixture[id]):Object.fromEntries(Object.entries(fixture).map(([key,input])=>[key,evaluate(key,input)])),null,2));
