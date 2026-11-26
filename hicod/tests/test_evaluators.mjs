import { readFileSync } from "node:fs";
import { evaluate } from "../evaluators.mjs";
function assert(condition,message){if(!condition)throw new Error(message);}
const fixtures=JSON.parse(readFileSync(new URL("../examples/finite_evidence.json",import.meta.url),"utf8"));
const graph=fixtures.B01,layeredInput=fixtures.B05;
function runTests(){const cases=[];function test(name,fn){fn();cases.push(name);}
test("A01 intersection",()=>assert(evaluate("A01",fixtures.A01).result.common_ids.join()==="g2","intersection"));
test("A04 incompatible",()=>assert(evaluate("A04",fixtures.A04).result.common_count===0,"empty"));
test("B01 connected witness",()=>assert(evaluate("B01",graph).result.graph_connected,"path"));
test("B01 disconnected",()=>assert(!evaluate("B01",{...graph,edges:[]}).result.graph_connected,"no path"));
test("B05 no implicit mode switch",()=>assert(evaluate("B05",layeredInput).result.connected_modes.join()==="B","mode"));
test("B08 two unit disjoint routes",()=>assert(evaluate("B08",graph).result.capacity===2,"flow"));
test("D03 weighted cut",()=>assert(evaluate("D03",graph).result.capacity===2,"cut"));
test("D03 asymmetric directed graph",()=>assert(evaluate("D03",{...graph,source:"t",sink:"s"}).result.capacity===0,"direction"));
test("C05 zero cost route",()=>assert(evaluate("C05",graph).result.minimum_graph_cost===0,"switch cost"));
test("C05 no path is null",()=>assert(evaluate("C05",{...graph,edges:[]}).result.minimum_graph_cost===null,"unreachable"));
test("E06 backward reachability",()=>assert(evaluate("E06",graph).result.non_goal_reachable_states.join()==="dead","backward"));
test("F01 nonfactorization",()=>assert(!evaluate("F01",fixtures.F01).result.factorizes,"coupling"));
test("F01 factorization",()=>assert(evaluate("F01",{...fixtures.F01,feasible_pairs:[["a","x"],["a","y"],["b","x"],["b","y"]]}).result.factorizes,"independence"));
test("H04 sample fraction",()=>assert(Math.abs(evaluate("H04",fixtures.H04).result.weighted_feasible_fraction-2/3)<1e-12,"fraction"));
test("H04 weighted",()=>assert(evaluate("H04",{...fixtures.H04,samples:[{id:"a",feasible:true,weight:3},{id:"b",feasible:false,weight:1}]}).result.weighted_feasible_fraction===.75,"weight"));
test("Missing evidence fails closed",()=>{let threw=false;try{evaluate("B01",{...graph,edges:[{from:"s",to:"t"}]});}catch{threw=true;}assert(threw,"should reject");});
test("Unsupported concept is explicit",()=>assert(evaluate("J02",{}).status==="NOT_IMPLEMENTED","unsupported"));
test("No continuous certificate",()=>assert(Object.entries(fixtures).every(([k,v])=>evaluate(k,v).scope.continuous_certificate===false),"certificate"));
return cases;}
console.log("Passed "+runTests().length+" finite-evidence tests.");
