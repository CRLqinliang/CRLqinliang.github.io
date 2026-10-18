#!/usr/bin/env python3
"""Render a decorative ASCII handover from official Franka Panda visual meshes.
Usage: python tools/build_ascii_handover.py /path/to/franka_description
Requires numpy, scipy and trimesh. No runtime graphics dependencies.
"""
from pathlib import Path
import json
import sys
import xml.etree.ElementTree as ET
import numpy as np
import trimesh
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1])
NS = {'c': 'http://www.collada.org/2005/11/COLLADASchema'}
COLS, ROWS, FPS, COUNT = 150, 54, 8, 160
rng = np.random.default_rng(24)

def transform(xyz=(0, 0, 0), rpy=(0, 0, 0)):
    m = np.eye(4)
    m[:3, :3] = Rotation.from_euler('xyz', rpy).as_matrix()
    m[:3, 3] = xyz
    return m

# Origin transforms from robots/fer/kinematics.yaml; hand offset from its URDF.
origins = [transform((0, 0, .333)), transform(rpy=(-np.pi/2, 0, 0)),
           transform((0, -.316, 0), (np.pi/2, 0, 0)),
           transform((.0825, 0, 0), (np.pi/2, 0, 0)),
           transform((-.0825, .384, 0), (-np.pi/2, 0, 0)),
           transform(rpy=(np.pi/2, 0, 0)),
           transform((.088, 0, 0), (np.pi/2, 0, 0))]
hand_offset = transform((0, 0, .107), (0, 0, -np.pi/4))
tcp_offset = transform((0, 0, .1034))

def fk(q):
    matrices = [np.eye(4)]
    for origin, angle in zip(origins, q):
        matrices.append(matrices[-1] @ origin @ transform(rpy=(0, 0, angle)))
    hand = matrices[-1] @ hand_offset
    return matrices, hand, hand @ tcp_offset

def read_mesh(name):
    tree = ET.parse(SOURCE / 'meshes/robots/fer/visual' / (name + '.dae'))
    effects = {e.get('id'): np.mean(np.fromstring(e.find('.//c:diffuse/c:color', NS).text, sep=' ')[:3])
               for e in tree.findall('.//c:effect', NS)}
    materials = {m.get('id'): effects[m.find('c:instance_effect', NS).get('url')[1:]]
                 for m in tree.findall('.//c:material', NS)}
    geometries = {g.get('id'): g for g in tree.findall('.//c:geometry', NS)}
    clouds = []
    def visit(node, parent):
        matrix_node = node.find('c:matrix', NS)
        matrix = parent @ (np.fromstring(matrix_node.text, sep=' ').reshape(4, 4) if matrix_node is not None else np.eye(4))
        for instance in node.findall('c:instance_geometry', NS):
            mesh = geometries[instance.get('url')[1:]].find('c:mesh', NS)
            data = {s.get('id'): np.fromstring(s.find('c:float_array', NS).text, sep=' ').reshape(-1, 3) for s in mesh.findall('c:source', NS)}
            verts = {v.get('id'): data[v.find('c:input', NS).get('source')[1:]] for v in mesh.findall('c:vertices', NS)}
            bindings = {b.get('symbol'): materials[b.get('target')[1:]] for b in instance.findall('.//c:instance_material', NS)}
            for triangles in mesh.findall('c:triangles', NS):
                inputs = triangles.findall('c:input', NS)
                stride = max(int(i.get('offset')) for i in inputs) + 1
                vin = next(i for i in inputs if i.get('semantic') == 'VERTEX')
                idx = np.fromstring(triangles.find('c:p', NS).text, sep=' ', dtype=int).reshape(-1, stride)[:, int(vin.get('offset'))].reshape(-1, 3)
                model = trimesh.Trimesh(vertices=verts[vin.get('source')[1:]], faces=idx, process=False)
                n = max(40, int(model.area * 65000))
                points, faces = trimesh.sample.sample_surface(model, n, seed=int(rng.integers(2**31)))
                normals = model.face_normals[faces]
                color = bindings.get(triangles.get('material'), 1.)
                points = points @ matrix[:3, :3].T + matrix[:3, 3]
                normals = normals @ matrix[:3, :3].T
                clouds.append((points, normals, np.full(n, color)))
        for child in node.findall('c:node', NS):
            visit(child, matrix)
    for node in tree.findall('.//c:visual_scene/c:node', NS):
        visit(node, np.eye(4))
    return tuple(np.concatenate([c[i] for c in clouds]) for i in range(3))

parts = [read_mesh('link' + str(i)) for i in range(8)]
hand_cloud, finger_cloud = read_mesh('hand'), read_mesh('finger')
print('Sampled arm surface points:', sum(len(c[0]) for c in parts), flush=True)

bounds = ([-2.8973, -1.7628, -2.8973, -3.0718, -2.8973, -.0175, -2.8973],
          [2.8973, 1.7628, 2.8973, -.0698, 2.8973, 3.7525, 2.8973])
seed = np.array([0., -.5, 0., -2.2, 0., 1.7, .7854])
orientation = np.diag([1., -1., -1.])
qs, max_error = [], 0.
for x in np.linspace(.30, .475, 61):
    goal = np.array([x, 0, .38])
    def error(q):
        tcp = fk(q)[2]
        return np.r_[10 * (tcp[:3, 3] - goal), Rotation.from_matrix(tcp[:3, :3] @ orientation.T).as_rotvec(), .002 * (q - seed)]
    result = least_squares(error, seed, bounds=bounds, ftol=1e-9, xtol=1e-9, gtol=1e-9)
    seed = result.x
    qs.append(seed.copy())
    max_error = max(max_error, np.linalg.norm(fk(seed)[2][:3, 3] - goal))
assert max_error < .001, max_error
print('Maximum TCP path error (m):', max_error, flush=True)
qs = np.array(qs)

def ease(p):
    p = np.clip(p, 0, 1)
    return p**3 * (10 - 15*p + 6*p*p)

def path_q(progress):
    index = np.clip(progress, 0, 1) * (len(qs)-1)
    lo = int(index)
    hi = min(lo+1, len(qs)-1)
    return qs[lo] * (1-index+lo) + qs[hi] * (index-lo)

def cloud_at(cloud, matrix):
    p, n, c = cloud
    return p @ matrix[:3, :3].T + matrix[:3, 3], n @ matrix[:3, :3].T, c

left_base = transform((-.55, 0, 0))
right_base = transform((.55, 0, 0), (0, 0, np.pi))
object_mesh = trimesh.creation.box((.20, .045, .06))
op, of = trimesh.sample.sample_surface(object_mesh, 5000, seed=11)
object_cloud = op, object_mesh.face_normals[of], np.zeros(len(op))

def scene(t):
    # Two ten-second handovers, alternating donor, so the loop has no reset jump.
    half = int(t // 10)
    phase = (t % 10) / 10
    retreat = ease((phase-.45)/.30)
    donor = ease(phase/.25) * (1-retreat)
    receiver = ease((phase-.15)/.20) * (1-retreat)
    donor_opening = .023 + .017 * ease((phase-.40)/.05)
    receiver_opening = .04 - .017 * ease((phase-.35)/.05)
    states = [(donor, donor_opening), (receiver, receiver_opening)]
    if half:
        states.reverse()
    clouds, tips = [], []
    for base, (progress, opening) in zip((left_base, right_base), states):
        matrices, hand, tcp = fk(path_q(progress))
        tips.append((base @ tcp)[:3, 3])
        clouds.extend(cloud_at(cloud, base @ m) for cloud, m in zip(parts, matrices))
        clouds.append(cloud_at(hand_cloud, base @ hand))
        for sign in (-1, 1):
            finger = hand @ transform((0, sign*opening, .0584), (0, 0, np.pi if sign < 0 else 0))
            clouds.append(cloud_at(finger_cloud, base @ finger))
    donor_id, receiver_id = (0, 1) if not half else (1, 0)
    direction = 1 if not half else -1
    # Both grasps refer to the same bar at the transfer point.
    object_pos = tips[donor_id] + [direction*.075, 0, 0] if phase < .40 else tips[receiver_id] + [-direction*.075, 0, 0]
    clouds.append(cloud_at(object_cloud, transform(object_pos)))
    return tuple(np.concatenate([c[i] for c in clouds]) for i in range(3))

forward = np.array([0., 3., -1.35]); forward /= np.linalg.norm(forward)
right = np.array([1., 0., 0.]); up = np.cross(right, forward)
view = np.stack([right, up, forward])
# Preserve monospace character aspect rather than stretching the robot shape.
width = 1.65
height = width / (COLS*.6/ROWS)
center = np.array([0, 0, .37]) @ view.T
light = np.array([-.4, -.5, 1.]); light /= np.linalg.norm(light)
ramp = np.array(list(' .:-=+*#%@'))

def render_cloud(cloud):
    points, normals, colors = cloud
    projected = points @ view.T - center
    x = np.floor((projected[:, 0]/width+.5)*COLS).astype(int)
    y = np.floor((.5-projected[:, 1]/height)*ROWS).astype(int)
    valid = (x >= 0) & (x < COLS) & (y >= 0) & (y < ROWS)
    x, y, z = x[valid], y[valid], projected[valid, 2]
    illumination = np.clip(normals[valid] @ light, 0, 1)
    tone = np.clip(.22 + .48*(1-illumination) + .30*(1-colors[valid]), .1, 1)
    cell = y*COLS+x
    # Closest sample per character cell is a small software depth buffer.
    order = np.lexsort((z, cell))
    cell_sorted = cell[order]
    nearest = order[np.r_[True, cell_sorted[1:] != cell_sorted[:-1]]]
    buffer = np.full(ROWS*COLS, ' ')
    buffer[cell[nearest]] = ramp[np.maximum(1, (tone[nearest]*9).astype(int))]
    buffer = buffer.reshape(ROWS, COLS)
    return '\n'.join(''.join(row).rstrip() for row in buffer)

def render(t):
    return render_cloud(scene(t))


if __name__ == '__main__':
    frames = [render(i/FPS) for i in range(COUNT)]
    assert len(set(frames)) > COUNT*.5
    assert frames[0] == frames[-1], "Loop must return to the same resting pose"
    asset = ROOT / 'assets/animations/franka-handover.json'
    asset.write_text(json.dumps({'fps': FPS, 'columns': COLS, 'rows': ROWS, 'poster': 28, 'frames': frames}, separators=(',', ':')))
    poster = ROOT / '_includes/ascii-handover.html'
    poster.write_text('<pre class="ascii-handover" data-frames-url="{{ \'/assets/animations/franka-handover.json\' | relative_url }}">'+frames[28]+'</pre>\n')
    print('Frames:', COUNT, 'uncompressed bytes:', asset.stat().st_size, flush=True)
