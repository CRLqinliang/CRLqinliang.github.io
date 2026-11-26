"""Replay every analytically generated candidate in an equivalent MuJoCo 4 MJCF model.
No dynamics or real grasp validation. See PHYSICAL_BACKEND.md for scope.
"""
import argparse
import json
from pathlib import Path
import numpy as np
import mujoco

def model_xml(scene):
    m = scene["model"]
    l0, l1, l2 = m["lengths"]
    r = m["link_radius"]
    obs = "".join(
        f'<geom name="obs{i}" type="sphere" pos="{o["center"][0]} {o["center"][1]} 0" size="{o["radius"]}"/>'
        for i, o in enumerate(scene["obstacles"]))
    # Independent payload pose: ideal rigid attachment is imposed by analytic pose queries.
    return f"""<mujoco model="hicod_planar3r">
      <compiler angle="radian"/>
      <option gravity="0 0 0"/>
      <worldbody>
        {obs}
        <body name="arm0">
          <joint name="q0" type="hinge" axis="0 0 1"/>
          <geom name="link0" type="capsule" fromto="0 0 0 {l0} 0 0" size="{r}" mass=".2"/>
          <body name="arm1" pos="{l0} 0 0">
            <joint name="q1" type="hinge" axis="0 0 1"/>
            <geom name="link1" type="capsule" fromto="0 0 0 {l1} 0 0" size="{r}" mass=".2"/>
            <body name="arm2" pos="{l1} 0 0">
              <joint name="q2" type="hinge" axis="0 0 1"/>
              <geom name="link2" type="capsule" fromto="0 0 0 {l2} 0 0" size="{r}" mass=".1"/>
              <site name="tip" pos="{l2} 0 0"/>
            </body>
          </body>
        </body>
        <body name="payload_body"><freejoint name="payload_free"/>
          <geom name="payload" type="sphere" size="{m["object_radius"]}" mass=".1"/>
        </body>
      </worldbody>
    </mujoco>"""

def replay(raw):
    if raw.get("schema") != "hicod.planar3r.evidence.v1":
        raise ValueError("Unexpected evidence schema")
    scene = raw["scene"]
    model = mujoco.MjModel.from_xml_string(model_xml(scene))
    data = mujoco.MjData(model)
    qids = [int(model.jnt_qposadr[mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, f"q{i}")]) for i in range(3)]
    payload_adr = int(model.jnt_qposadr[mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_JOINT, "payload_free")])
    tip = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, "tip")
    geom_ids = {name: mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_GEOM, name)
                for name in ["link0","link1","link2","payload"] + [f"obs{i}" for i in range(len(scene["obstacles"]))]}
    result = {}
    differences = []
    max_tip_error = 0.0
    max_distance_error = 0.0
    for key, p in raw["probes"].items():
        if p["q"] is None:
            continue
        data.qpos[qids] = p["q"]
        data.qpos[payload_adr:payload_adr+7] = [p["pose"][0],p["pose"][1],0,1,0,0,0]
        data.qvel[:] = 0
        mujoco.mj_forward(model,data)
        tip_error = float(np.linalg.norm(data.site_xpos[tip,:2] - np.array(p["points"][-1])))
        max_tip_error = max(max_tip_error,tip_error)
        if tip_error > 1e-7:
            raise RuntimeError(f"MuJoCo/analytic FK mismatch at {key}: {tip_error}")
        pairs = []
        for pair in p["pairs"]:
            a,b = pair["a"],pair["b"]
            d = float(mujoco.mj_geomDistance(model,data,geom_ids[a],geom_ids[b],10.0,np.zeros(6)))
            if not np.isfinite(d):
                raise RuntimeError(f"Nonfinite distance at {key}")
            pairs.append({"a":a,"b":b,"clearance":d})
            max_distance_error = max(max_distance_error,abs(d-pair["clearance"]))
            if (d <= scene["model"]["margin"]) != (pair["clearance"] <= scene["model"]["margin"]):
                differences.append({"probe":key,"pair":[a,b],"analytic":pair["clearance"],"mujoco":d})
        result[key] = {"q":p["q"],"pose":p["pose"],"pairs":pairs}
    return {"schema":"hicod.planar3r.mujoco-replay.v1","version":mujoco.__version__,"scene":scene["name"],
            "probes":result,"comparison":{"max_tip_error_m":max_tip_error,"max_pair_distance_error_m":max_distance_error,"threshold_disagreements":differences},
            "limitations":["Pointwise geometry only; attachment is idealized, no contact dynamics or grasp execution."]}

if __name__ == "__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("raw",type=Path)
    p.add_argument("output",type=Path)
    a=p.parse_args()
    output=replay(json.loads(a.raw.read_text(encoding="utf-8")))
    a.output.write_text(json.dumps(output,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"version":output["version"],"probes":len(output["probes"]),"comparison":output["comparison"]},indent=2))
