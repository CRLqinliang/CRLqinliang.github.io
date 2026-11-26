const session={type:"string",description:"Session ID returned by diagnose_task"},concept={type:"string",description:"Stable concept ID, e.g. B05"},page={offset:{type:"integer",minimum:0},limit:{type:"integer",minimum:1,maximum:25}};
const tool=(name,description,properties,required=[])=>({name,description,inputSchema:{type:"object",properties,required,additionalProperties:false}});
export const tools=[
tool("diagnose_task","Create a scoped planar 3R task session and compute fixed-mode evidence. Negative sampled results are not continuous infeasibility proofs.",{scene:{type:"string",enum:["open","partial","disconnected","larger","detour","regrasp_recovery"]},support:{type:"array",items:{type:"integer",minimum:1,maximum:15},maxItems:15,uniqueItems:true,description:"Explicit ideal support stages; default none."},object_radius_m:{type:"number",minimum:.025,maximum:.09}}),
tool("query_concept","Evaluate a supported concept on demand in a session, or return explicit unsupported status.",{session_id:session,concept_id:concept},["session_id","concept_id"]),
tool("drill_down","List concrete evidence IDs for a scoped concept report, paginated.",{session_id:session,concept_id:concept,...page},["session_id","concept_id"]),
tool("inspect_evidence","Inspect a sample, rejected edge, dock, regrasp or perturbation candidate; paginated traces.",{session_id:session,evidence_id:{type:"string"},...page},["session_id","evidence_id"]),
tool("compare_interventions","Compare fixed transfer, ideal supported regrasp and bounded finite midpoint deformation, without asserting a global best strategy.",{session_id:session},["session_id"]),
tool("get_concept_graph","Read the recursive required-evidence definition graph. This does not execute physical probes.",{concept_id:concept},["concept_id"])
];