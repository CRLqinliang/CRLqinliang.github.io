import {readFileSync} from "node:fs";
import {verifyBenchmark} from "../benchmark/core.mjs";
const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));console.log(JSON.stringify(verifyBenchmark(load("../benchmark/tasks.json"),load("../benchmark/oracle.json")).checks,null,2));
