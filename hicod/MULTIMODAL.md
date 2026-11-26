# Multimodal Solution-Space Explorer · v0.5

The analytic 3R backend now explores transfer and regrasp transitions. A mode switch is not a symbolic edge: it is admitted only at an explicitly supported interior stage, between two distinct attachment directions with valid endpoint configurations, sampled radial release/retreat and approach/reacquisition, and a sampled collision-checked empty-arm joint-space segment.

**Scope:** Support is an ideal external assumption, not a computed physical support polygon or force equilibrium. The terminal capsule cap is allowed to overlap the payload by its radius during docking only; empty transit checks the terminal link against the object. Joint interpolation is sampled (≤0.04 rad per step); same-branch transfer and docking are sampled too. No force closure, contact dynamics, actual lifting, certified continuous collision checking, unrestricted transit planning, or continuous infeasibility proof. MuJoCo replay from v0.4 covers transfer probes only, not these new transitions.

## Concepts

B06 hybrid connectivity, C01 regrasp feasibility, C02 one-switch intermediate-pose bridging, C04 sampled mode-transition relation, C05 minimum number of attachment changes. C01 distinguishes existence of a route containing a switch (possibly optional) from requirement of a switch within the supplied graph. C02 only describes one-switch bridges along the prescribed path. C05 uses nonnegative costs 0 for transfer and 1 for attachment change.

## Reproduce

    node examples/multimodal.mjs regrasp_recovery all
    node examples/multimodal.mjs regrasp_recovery 8
    node examples/multimodal.mjs regrasp_recovery none
    node examples/multimodal.mjs disconnected all
    node examples/multimodal.mjs regrasp_recovery all report.json
    node tests/test_multimodal.mjs

The JSON export includes dock and empty-transit evidence with IDs. The one-switch bridge set is computed by intersecting fixed-transfer forward reachability, feasible switch edges and fixed-transfer backward goal reachability.

## Actual computed cases

| Case | Fixed modes | Supported stages | Accepted switches | Hybrid path | Min switches |
|---|---:|---|---:|---|---:|
| none | 0 | none | 0 | false | unknown |
| all | 0 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | 88 | true | 1 |
| only | 0 | 8 | 6 | true | 1 |
| outside | 0 | 1 | 4 | false | unknown |
| negative | 0 | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 | 42 | false | unknown |

The recovery example was selected from a deterministic obstacle search (12 scenes inspected, 1 eligible for a hybrid search before the first success). This is a designed counterexample, not a success-rate benchmark. With all interior stages supported, 11 one-switch bridge stages (2–12) are found; with only stage 8 supported, a one-switch path still exists; with only stage 1 supported, it does not. The old disconnected scene remains disconnected despite admitted local switches.

12 checks passed on the exact module function bodies in a JavaScript runtime; direct Node CLI, browser rendering and MuJoCo dynamics are not verified here.

## Counterfactual path deformation (G04 / I04)

The same analytic scene is evaluated over 49 midpoint displacement candidates on a 30 mm XY grid within a 120 mm disk; endpoints and yaw are preserved. The score is the count of sampled connected fixed modes. G04 reports finite contrasts, not differentiable gradients. I04 reports the minimum deviation among enumerated candidates only.

Actual result: 0 / 49 candidates with a sampled fixed-mode path; minimum enumerated deviation = unknown. See [path_sweep_results.json](path_sweep_results.json). Six checks passed in the JavaScript runtime.

    node examples/path_sweep.mjs regrasp_recovery
    node tests/test_path_sweep.mjs

## Next
Search-based empty transit; actual gripper, support and contact validation; broader trajectory families and agent-facing query integration.
