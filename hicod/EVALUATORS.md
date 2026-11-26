# Finite-evidence evaluators · v0.3.1

The first executable layer evaluates **already acquired evidence**. It does not replace a physical backend. All inputs must declare model, candidate domain and evidence provenance. Graphs are directed; an admitted edge requires an evidence ID, but that ID is not an independent proof of validity. The adapter must establish what evidence actually means. No negative finite result is a continuous-space certificate.

| ID | Computation |
|---|---|
| A01 | Shared-Grasp Compatibility — finite evidence only |
| A04 | Skill Compatibility — finite evidence only |
| B01 | Configuration-Space Connectivity — finite evidence only |
| B05 | Grasp–IK Trajectory Connectivity — finite evidence only |
| B08 | Connectivity Redundancy — finite evidence only |
| D03 | Connectivity Bottleneck — finite evidence only |
| C05 | Minimum Mode-Switch Cost — finite evidence only |
| E06 | Future Feasibility Preservation — finite evidence only |
| F01 | Variable Coupling — finite evidence only |
| H04 | Solution-Space Volume — finite evidence only |

Run with Node.js 18+:

    node examples/evaluate.mjs B05
    node examples/evaluate.mjs
    node tests/test_evaluators.mjs

The teaching fixture is synthetic; it contains no MuJoCo or actual robot measurements. Its two-mode layered graph has three feasible nodes per mode but only mode B connects all layers without changing mode. This distinguishes local feasibility from structural continuity. A01/A04 require a common universe of IDs; H04 reports a weighted sample fraction, not geometric volume. B08 and D03 use directed max-flow/min-cut; C05 finds minimum supplied-graph cost with explicitly specified nonnegative switch costs. E06 returns backward goal-reachable states. F01 tests finite feasible relation factorization, not statistical independence or objective separability.

## Backend contract

The backend must provide consistent IDs, state-space boundaries, sampled or certified edge evidence, admissibility criteria, uncertainty and physical model provenance. Continuous feasibility remains unknown until separately verified. Evidence IDs identify backend artifacts, not proof of correctness. A01 requires object-relative grasp identity and real endpoint feasibility tests, not just two arbitrary labels. B05 uses a **fixed-mode** layered graph only; release/reacquisition extension is pending.

## Test record

18 assertions executed against the same evaluator function bodies before committing (JavaScript runtime). A runnable Node test file is included. No MuJoCo runtime or browser validation was performed in that environment.

## Remaining work

Integrate an articulated manipulator, sampled grasp/IK and collision-checked edge generation, then add C02 bridge feasibility and verified multi-modal transitions. The other 50 full descriptors remain definition-only; even these ten are finite-evidence computations, not full physical evaluators.
