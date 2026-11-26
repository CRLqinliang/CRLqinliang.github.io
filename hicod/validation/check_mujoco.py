"""Cross-check computed candidate samples using an independent MuJoCo geometry kernel.
No continuous path or dynamic execution certificate. Preserve disagreements.
"""
import argparse
import json
import subprocess
import os
from pathlib import Path
import sys
import numpy as np
import mujoco

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"examples"))
from mujoco4_articulated import model_xml, replay

def check_switches(scene, switches):
    model=mujoco.MjModel.from_xml_string(model_xml(scene))
    data=mujoco.MjData(model)
    qids=[int(model.jnt_qposadr[mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_JOINT,f"q{i}")]) for i in range(3)]
    paddr=int(model.jnt_qposadr[mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_JOINT,"payload_free")])
    names=["link0","link1","link2","payload"]+[f"obs{i}" for i in range(len(scene["obstacles"]))]
    gids={n:mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_GEOM,n) for n in names}
    count=0; pairs=0; disag=[]
    for sw in switches:
        for j,s in enumerate(sw["samples"]):
            if not s or not s["q"] or not s["valid"]:
                raise ValueError("Expected an admitted switch witness")
            data.qpos[qids]=s["q"]
            data.qpos[paddr:paddr+7]=[*s["pose"][:2],0,1,0,0,0]
            data.qvel[:]=0
            mujoco.mj_forward(model,data)
            count+=1
            for p in s["pairs"]:
                d=float(mujoco.mj_geomDistance(model,data,gids[p["a"]],gids[p["b"]],10.,np.zeros(6)))
                threshold=p["threshold"];pairs+=1
                if not np.isfinite(d):raise RuntimeError("Nonfinite geometry distance")
                if (d<=threshold)!=(p["clearance"]<=threshold):
                    disag.append({"switch_id":sw["id"],"sample":j,"pair":[p["a"],p["b"]],"analytic":p["clearance"],"mujoco":d,"threshold":threshold})
    return {"samples":count,"pair_checks":pairs,"threshold_disagreements":disag}

def main():
    p=argparse.ArgumentParser();p.add_argument("input",type=Path);p.add_argument("output",type=Path);a=p.parse_args()
    cases=json.loads((a.input/"index.json").read_text());rows=[];source=os.getenv("GITHUB_SHA","local")
    for case in cases:
        key=case["key"];r=json.loads((a.input/(key+".json")).read_text())
        rr=replay(r["raw"])
        rp=a.input/(key+".replay.json");rp.write_text(json.dumps(rr))
        comparison=json.loads(subprocess.check_output(["node",str(Path(__file__).with_name("compare_graph.mjs")),str(a.input/(key+".json")),str(rp)],text=True))
        switch=check_switches(r["raw"]["scene"],r["switches"])
        rows.append({**case,"transfer_probes_with_ik":len(rr["probes"]),"transfer_pair_checks":sum(len(v["pairs"]) for v in rr["probes"].values()),"max_fk_error_m":rr["comparison"]["max_tip_error_m"],"max_pair_distance_error_m":rr["comparison"]["max_pair_distance_error_m"],"transfer_disagreements":len(rr["comparison"]["threshold_disagreements"]),"transfer_disagreement_examples":rr["comparison"]["threshold_disagreements"][:12],"switch_probes":switch["samples"],"switch_pair_checks":switch["pair_checks"],"switch_disagreements":len(switch["threshold_disagreements"]),"switch_disagreement_examples":switch["threshold_disagreements"][:12],**comparison})
        rp.unlink()
    status="completed_with_disagreements" if any(r["transfer_disagreements"] or r["switch_disagreements"] or not r["fixed_graph_agrees"] for r in rows) else "passed"
    result={"status":status,"source_commit":source,"mujoco_version":mujoco.__version__,"cases":len(rows),"reference_cases":sum(r["kind"]=="reference" for r in rows),"repair_witness_cases":sum(r["kind"]!="reference" for r in rows),"transfer_probes_with_ik":sum(r["transfer_probes_with_ik"] for r in rows),"transfer_pair_checks":sum(r["transfer_pair_checks"] for r in rows),"switch_probes":sum(r["switch_probes"] for r in rows),"switch_pair_checks":sum(r["switch_pair_checks"] for r in rows),"transfer_disagreements":sum(r["transfer_disagreements"] for r in rows),"switch_disagreements":sum(r["switch_disagreements"] for r in rows),"fixed_graph_agreement_cases":sum(r["fixed_graph_agrees"] for r in rows),"max_fk_error_m":max(r["max_fk_error_m"] for r in rows),"rows":rows,"scope":"MuJoCo distance kernel and FK at identical finite configurations; 32 reference graphs and one selected positive witness per repair kind for non-reference-solvable tasks. Switch witness probes only, not exhaustive reconstruction of all hybrid edges. No independent IK search, continuous collision proof, support dynamics, real gripper or hardware validation."}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(result,indent=2)+"\n");print(json.dumps({k:v for k,v in result.items() if k!="rows"},indent=2))
if __name__=="__main__":main()
