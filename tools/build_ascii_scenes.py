#!/usr/bin/env python3
"""Generate four additional manipulation vignettes using the shared Franka model.
Usage: python tools/build_ascii_scenes.py /path/to/franka_description
"""
from pathlib import Path
import json
import numpy as np
import trimesh
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation
import build_ascii_handover as model

ROOT = Path(__file__).resolve().parents[1]
FPS = model.FPS
REST = model.qs[0].copy()
MAX_ERROR = 0.


def sample_box(size, color=.2, seed=31):
    mesh = trimesh.creation.box(size)
    points, faces = trimesh.sample.sample_surface(mesh, max(1800, int(mesh.area*80000)), seed=seed)
    return points, mesh.face_normals[faces], np.full(len(points), color)


def combine(clouds):
    return tuple(np.concatenate([cloud[i] for cloud in clouds]) for i in range(3))


def arm_cloud(base, q, opening):
    matrices, hand, tcp = model.fk(q)
    clouds = [model.cloud_at(cloud, base @ matrix) for cloud, matrix in zip(model.parts, matrices)]
    clouds.append(model.cloud_at(model.hand_cloud, base @ hand))
    for sign in (-1, 1):
        finger = hand @ model.transform((0, sign*opening, .0584), (0, 0, np.pi if sign < 0 else 0))
        clouds.append(model.cloud_at(model.finger_cloud, base @ finger))
    return clouds, (base @ tcp)


def solve_pose(position, yaw, seed):
    global MAX_ERROR
    orientation = Rotation.from_euler('z', yaw).as_matrix() @ model.orientation
    def residual(q):
        tcp = model.fk(q)[2]
        return np.r_[10*(tcp[:3, 3]-position), Rotation.from_matrix(tcp[:3, :3] @ orientation.T).as_rotvec(), .002*(q-REST)]
    result = least_squares(residual, seed, bounds=model.bounds, ftol=1e-8, xtol=1e-8, gtol=1e-8)
    tcp = model.fk(result.x)[2]
    error = np.linalg.norm(tcp[:3, 3]-position)
    MAX_ERROR = max(MAX_ERROR, error)
    assert error < .001, (position, error)
    assert np.linalg.norm(Rotation.from_matrix(tcp[:3, :3] @ orientation.T).as_rotvec()) < .01
    return result.x


def interpolate(keys, phase):
    for i in range(len(keys)-1):
        a, b = keys[i], keys[i+1]
        if phase <= b[0]:
            u = model.ease((phase-a[0])/(b[0]-a[0]))
            return np.array(a[1:])*(1-u)+np.array(b[1:])*u
    return np.array(keys[-1][1:])


cube = sample_box((.07, .045, .07), 0.)
bar = sample_box((.16, .045, .06), 0.)
peg = sample_box((.035, .035, .14), 0.)
pedestal = sample_box((.18, .15, .09), .55)
tray = combine([sample_box((.28, .14, .04), .35)] + [model.cloud_at(sample_box((.08, .045, .03), .05), model.transform((sign*.16, 0, 0))) for sign in (-1, 1)])
wall = .0625
fixture = combine([
    model.cloud_at(sample_box((wall, .18, .10), .5), model.transform((sign*.05875, 0, 0))) for sign in (-1, 1)
] + [
    model.cloud_at(sample_box((.055, wall, .10), .5), model.transform((0, sign*.05875, 0))) for sign in (-1, 1)
] + [model.cloud_at(sample_box((.21, .21, .025), .6), model.transform((0, 0, -.055)))])

# Key: phase, local TCP x/y/z, wrist yaw, per-finger opening.
PICK_KEYS = [(0,.30,0,.38,0,.04),(.12,.37,.08,.30,0,.04),(.23,.37,.08,.16,0,.04),(.28,.37,.08,.16,0,.023),(.40,.37,.08,.38,0,.023),(.60,.60,-.08,.38,0,.023),(.72,.60,-.08,.16,0,.023),(.78,.60,-.08,.16,0,.04),(.90,.60,-.08,.38,0,.04),(1,.30,0,.38,0,.04)]
TURN_KEYS = [(0,.30,0,.38,0,.04),(.12,.37,0,.30,0,.04),(.22,.37,0,.16,0,.04),(.28,.37,0,.16,0,.023),(.42,.37,0,.40,0,.023),(.65,.37,0,.40,np.pi/2,.023),(.76,.37,0,.40,np.pi/2,.023),(.86,.37,0,.16,np.pi/2,.023),(.90,.37,0,.16,np.pi/2,.04),(.96,.37,0,.38,np.pi/2,.04),(1,.30,0,.38,0,.04)]
INSERT_KEYS = [(0,.32,0,.42,0,.023),(.18,.45,0,.42,0,.023),(.40,.45,0,.30,0,.023),(.60,.45,0,.235,0,.023),(.72,.45,0,.235,0,.023),(.88,.45,0,.42,0,.023),(1,.32,0,.42,0,.023)]
CARRY_KEYS = [(0,-.08,.23,0),(.22,-.08,.42,0),(.44,.14,.42,.30),(.56,.14,.23,.30),(.64,.14,.23,.30),(.74,.14,.42,.30),(.92,-.08,.42,0),(1,-.08,.23,0)]


def render_clip(kind, seconds):
    count = int(seconds*FPS)
    frames = []
    seeds = [REST.copy(), REST.copy()]
    for i in range(count):
        phase = i/(count-1)
        if kind == 'cooperative-carry':
            y, z, yaw = interpolate(CARRY_KEYS, phase)
            clouds = []
            for arm, (base, sign) in enumerate(((model.left_base,-1),(model.right_base,1))):
                point = np.array([sign*.18*np.cos(yaw), y+sign*.18*np.sin(yaw), z])
                local = (np.linalg.inv(base) @ np.r_[point,1])[:3]
                seeds[arm] = solve_pose(local, yaw, seeds[arm])
                clouds.extend(arm_cloud(base,seeds[arm],.023)[0])
            clouds.append(model.cloud_at(tray,model.transform((0,y,z),(0,0,yaw))))
        else:
            keys = {'pick-place':PICK_KEYS,'reorientation':TURN_KEYS,'peg-insertion':INSERT_KEYS}[kind]
            x,y,z,yaw,opening = interpolate(keys,phase)
            seeds[1] = solve_pose(np.array([x,y,z]),yaw,seeds[1])
            clouds = arm_cloud(model.left_base,REST,.04)[0]
            active, tcp = arm_cloud(model.right_base,seeds[1],opening)
            clouds.extend(active)
            if kind == 'pick-place':
                pick, place = (.18,-.08,.16),(-.05,.08,.16)
                if .28 <= phase <= .75:
                    pose = model.transform(tcp[:3,3])
                else:
                    pose = model.transform(pick if phase < .28 else place)
                clouds.append(model.cloud_at(cube,pose))
                clouds.extend(model.cloud_at(pedestal,model.transform((p[0],p[1],.08))) for p in (pick,place))
            elif kind == 'reorientation':
                if .28 <= phase <= .90:
                    pose = model.transform(tcp[:3,3],(0,0,np.pi+yaw))
                else:
                    pose = model.transform((.18,0,.16),(0,0,0 if phase < .28 else np.pi/2))
                clouds.append(model.cloud_at(bar,pose))
                # Top at .13, matching the underside of the 6 cm tall bar.
                clouds.append(model.cloud_at(pedestal,model.transform((.18,0,.085))))
            else:
                clouds.append(model.cloud_at(peg,model.transform(tcp[:3,3]+[0,0,-.05])))
                clouds.append(model.cloud_at(fixture,model.transform((.10,0,.12))))
        frames.append(model.render_cloud(combine(clouds)))
    assert len(set(frames)) > count*.6, kind
    return {'fps':FPS,'columns':model.COLS,'rows':model.ROWS,'poster':0,'frames':frames}


if __name__ == '__main__':
    for kind, seconds in [('pick-place',12),('reorientation',14),('cooperative-carry',14),('peg-insertion',12)]:
        clip = render_clip(kind,seconds)
        target = ROOT/'assets/animations'/('franka-'+kind+'.json')
        target.write_text(json.dumps(clip,separators=(',',':')))
        print(kind,len(clip['frames']),'frames',target.stat().st_size,'bytes',flush=True)
    print('Maximum additional-scene TCP error (m):',MAX_ERROR,flush=True)
