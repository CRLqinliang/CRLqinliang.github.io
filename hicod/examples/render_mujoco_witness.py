"""Render the stored analytic witness using MuJoCo; kinematic replay, not dynamics."""
import argparse
import json
from pathlib import Path
import os
os.environ.setdefault("MUJOCO_GL", "egl")
import numpy as np
import mujoco
import imageio.v2 as imageio
from mujoco4_articulated import model_xml

def render(trace, output, fps):
    scene = trace["scene"]
    xml = model_xml(scene)
    # Fixed overhead view; all visual geometry is the same as the analytic model.
    xml = xml.replace("<worldbody>", """
      <visual><global offwidth="960" offheight="720"/></visual>
      <worldbody>
        <light pos="0.4 0 2.2" dir="0 0 -1" diffuse=".8 .8 .8"/>
        <camera name="overhead" pos=".36 0 1.8" xyaxes="1 0 0 0 1 0" fovy="38"/>
    """)
    xml = xml.replace('name="payload" type="sphere"', 'name="payload" rgba=".85 .55 .18 1" type="sphere"')
    for i in range(3):
        xml = xml.replace(f'name="link{i}" type="capsule"', f'name="link{i}" rgba=".16 .40 .66 1" type="capsule"')
    model = mujoco.MjModel.from_xml_string(xml)
    data = mujoco.MjData(model)
    qids = [int(model.jnt_qposadr[mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_JOINT,f"q{i}")]) for i in range(3)]
    payload = int(model.jnt_qposadr[mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_JOINT,"payload_free")])
    tip = mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_SITE,"tip")
    output.parent.mkdir(parents=True,exist_ok=True)
    count=0
    max_error=0.0
    with mujoco.Renderer(model,height=720,width=960) as renderer, imageio.get_writer(str(output),fps=fps,codec="libx264",pixelformat="yuv420p",macro_block_size=2) as writer:
        for f in trace["frames"]:
            data.qpos[qids]=f["q"]
            data.qpos[payload:payload+7]=[f["pose"][0],f["pose"][1],0,1,0,0,0]
            data.qvel[:]=0
            mujoco.mj_forward(model,data)
            err=float(np.linalg.norm(data.site_xpos[tip,:2]-np.array(f["points"][-1])))
            max_error=max(max_error,err)
            if err>1e-7:
                raise RuntimeError(f"FK mismatch {f['evidence_id']}: {err}")
            renderer.update_scene(data,camera="overhead")
            writer.append_data(renderer.render().copy())
            count+=1
    return {"mujoco_version":mujoco.__version__,"frames":count,"fps":fps,"max_fk_error_m":max_error,"status":"kinematic_replay_rendered","limitations":["No mj_step dynamics; ideal support and attachment; no actual grasp verification."]}

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--trace",type=Path,default=Path("media/regrasp_witness.json"))
    p.add_argument("--output",type=Path,default=Path("media/mujoco_regrasp.mp4"))
    p.add_argument("--fps",type=int,default=15)
    a=p.parse_args()
    if a.fps<=0: p.error("fps must be positive")
    result=render(json.loads(a.trace.read_text()),a.output,a.fps)
    a.output.with_suffix(".json").write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps(result,indent=2))
