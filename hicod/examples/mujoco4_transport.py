"""MuJoCo 4 contact-probed solution-space example. No dynamic execution."""
import argparse
import json
import math
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import numpy as np
import mujoco
from hicod import analyze_grid, report_modes

def make_scene(gap):
    # Horizontal wall with a centered opening; carrier has XY translation and yaw.
    width=.62
    half=(width-gap)/2
    center=(width+gap)/2
    xml=f"""
    <mujoco model="hicod_transport">
      <compiler angle="radian"/>
      <option gravity="0 0 0"/>
      <worldbody>
        <geom name="wall_left" type="box" pos="{-center} 0 0" size="{half} .025 .08"/>
        <geom name="wall_right" type="box" pos="{center} 0 0" size="{half} .025 .08"/>
        <body name="carrier">
          <joint name="x" type="slide" axis="1 0 0"/>
          <joint name="y" type="slide" axis="0 1 0"/>
          <joint name="yaw" type="hinge" axis="0 0 1"/>
          <geom name="payload" type="box" size=".09 .045 .04" mass=".3"/>
        </body>
      </worldbody>
    </mujoco>"""
    model=mujoco.MjModel.from_xml_string(xml)
    return model,mujoco.MjData(model)

def run(gap,n):
    model,data=make_scene(gap)
    xs=np.linspace(-.45,.45,n)
    ys=np.linspace(-.5,.5,n)
    start,goal=(n//2,0),(n//2,n-1)
    results={}
    payload=mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_GEOM,"payload")
    walls={mujoco.mj_name2id(model,mujoco.mjtObj.mjOBJ_GEOM,name) for name in ("wall_left","wall_right")}
    for name,yaw in (("A_broad",0.),("B_rotated",math.pi/2)):
        def feasible(x,y):
            data.qpos[:]=[x,y,yaw]
            data.qvel[:]=0
            mujoco.mj_forward(model,data)
            for i in range(data.ncon):
                c=data.contact[i]
                pair={int(c.geom1),int(c.geom2)}
                if payload in pair and pair.intersection(walls) and c.dist<=0:
                    return False
            return True
        result=analyze_grid(xs,ys,feasible,start,goal)
        result["straight_candidate_sampled_clear"]=all(feasible(0.,float(y)) for y in np.linspace(-.5,.5,161))
        result["center_sample_clear"]=feasible(0.,0.)
        results[name]=result
    scope={"backend":"MuJoCo "+mujoco.__version__,"gap_half_width_m":gap,"grid":[n,n],
           "x_bounds_m":[-.45,.45],"y_bounds_m":[-.5,.5],"edge_fractions":[.25,.5,.75],
           "payload_half_size_m":[.09,.045,.04],"modes_yaw_rad":[0.,math.pi/2],
           "limitations":["Kinematic pose probes, not dynamic rollout","No real gripper, articulated arm, or mode transition","Finite samples, no continuous infeasibility certificate"]}
    return report_modes(results,scope).to_dict()

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gap",type=float,default=.07,help="Passage half-width in meters")
    parser.add_argument("--grid",type=int,default=41,help="Odd number of samples per axis")
    parser.add_argument("--output",type=Path)
    args=parser.parse_args()
    if not 0<args.gap<.62 or args.grid<3 or args.grid%2==0:
        parser.error("Require 0 < gap < .62 and odd grid >= 3")
    text=json.dumps(run(args.gap,args.grid),indent=2)
    if args.output:
        args.output.write_text(text+"\n",encoding="utf-8")
    print(text)
