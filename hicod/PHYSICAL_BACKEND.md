# Physical Evidence Backend & Solution-Space Explorer · v0.4

This implementation bridges **L1–L3 geometry to L4 structure** on a genuine articulated kinematic model (three revolute joints), not hardware or a full physics manipulation benchmark.

## Model and scope

- Planar 3R serial arm, link lengths 0.36 / 0.30 / 0.16 m; capsule links, circular payload and obstacles.
- Eight object-relative approach directions approximate ideal rigid attachments. The tip meets the circular object's boundary; terminal-link/payload contact is permitted, adjacent-link contacts are excluded; nonadjacent link/link, upstream-link/payload and all obstacle pairs are checked.
- Analytic two-branch IK solves a specified object pose and attachment transform. Each witness is checked for FK residual, angle residual, joint limits and signed clearance (3 mm margin).
- A piecewise-linear SE(2) object path is sampled at 17 layers with four subdivisions per interval. Every same-mode, same-branch candidate transition is re-solved along the prescribed object path, not a straight joint interpolation. Adjacent sample joint displacement must be ≤0.24 rad. No branch switches are searched.
- Negative results are exact for the supplied finite graph only; no continuous infeasibility certificate. Positive results are sampled witnesses, not continuous execution certificates. No approach, actual grasp mechanics, release, support stability, or dynamics.

## Run the analytic explorer

Requires Node 18+, no dependencies.

    cd hicod
    node examples/planar3r.mjs disconnected --raw raw.json --report report.json
    node examples/planar3r.mjs disconnected --inspect e0
    node tests/test_planar3r.mjs

Other scenes: open, partial, larger, detour. The last two vary payload radius or path shape; they are diagnostic alternatives, not certified repairs. See [physical_results.json](physical_results.json) for actual analytic results, and [physical.html](physical.html) for the interactive explorer.

## MuJoCo 4 replay

Use the same candidate domain and probe IDs:

    pip install -r requirements.txt
    python examples/mujoco4_articulated.py raw.json mujoco_replay.json
    node examples/planar3r.mjs disconnected --replay mujoco_replay.json --report replay_report.json

MuJoCo adapter builds an equivalent MJCF three-hinge model, sets joint and payload poses, checks FK against the analytic backend and uses mj_geomDistance for the explicitly selected geometry pairs. It reports threshold disagreements. The JS replay replaces pair-distance verdicts and reconstructs edges and concept reports (all candidate transitions were sampled, even those rejected analytically). IK remains analytic. The replay must be generated from the exact matching raw scene; full scene configuration, probe IDs, q, pose and pair ordering are checked. MuJoCo 4.0.1 Python API: https://mujoco.readthedocs.io/en/4.0.1/python.html and https://mujoco.readthedocs.io/en/4.0.1/APIreference/APIfunctions.html.

**MuJoCo replay is implemented but unexecuted:** authoring environment lacked MuJoCo and package installation failed due to network/DNS restrictions. Do not interpret analytic results as MuJoCo measurements. An identity replay test exercised the reconstruction protocol, not MuJoCo.

## Computed contrastive cases

| Scene | Common attachment candidates | Connected fixed modes | Valid slots | Accepted edges |
|---|---:|---:|---:|---:|
| open | 4 | 4 | 196/272 | 181 |
| partial | 3 | 2 | 115/272 | 102 |
| disconnected | 4 | 0 | 92/272 | 75 |
| larger | 2 | 0 | 66/272 | 48 |
| detour | 4 | 0 | 83/272 | 65 |

The disconnected case was selected from a deterministic obstacle search to demonstrate that equal endpoint compatibility and nonzero local feasibility at every layer need not imply path-family connectivity. This is a designed case, not unbiased performance evaluation.

## Evidence chain

A01 → endpoint slot IDs → grasp-mode IDs / IK / clearance. H04 → slot population (uniform over stage × mode × branch). B05 → admitted/rejected transition IDs → probe IDs → q, FK residual, pairwise clearance, joint limits. D03 → finite cut capacity and cut edges; E06 → backward reachable states. Artificial endpoint arcs have capacities above the sum of unit transition capacities. Failure frontier identifies rejected edges from start-reachable states to nonreachable states; it is diagnostic evidence, not unique causal attribution.

The 60-concept registry still distinguishes finite evaluators from full physical implementations. This backend instantiates five concepts under a deliberately limited planar transport scope.

## Verification record

14 geometry/evidence checks and five scene-level integration checks passed in the JavaScript runtime using the repository module bodies with import/export wrappers removed. Cross-checks compare A01, H04 and D03 to independent explorer traversal and B05. The UI module parsed successfully; actual browser rendering, direct Node module execution and MuJoCo runtime validation remain untested here.
