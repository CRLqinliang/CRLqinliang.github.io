# HiCoD — High-Level Concept Debugger for Agentic Robotics

**Robotics for reasoning.** A research prototype for understanding robotic solution spaces through computationally grounded, hierarchical, traceable physical concepts.

Project page: https://crlqinliang.github.io/hicod/

## Motivation

A conventional robot debugger reports why a candidate solution failed (collision, IK residual, joint limit). HiCoD asks why a specified *family* of solutions is difficult to find: incompatible feasible sets, disconnected modes, narrow transition regions, constraints or dependencies. High-level abstraction must preserve decision-relevant information and remain traceable to physical evidence.

## Architecture

- G2L: physical state + task → solution-space exploration → structural analysis → grounded semantic reports.
- LLM: query concepts on demand, drill down through evidence, propose problem reformulation.
- L2G: instantiate goals/constraints, use existing planners/optimizers, independently verify. HiCoD is not an execution controller.

L1 geometry; L2 relations; L3 individual candidate feasibility; L4 solution-space descriptors; L5 problem transformation; L6 concept discovery (long-term). This taxonomy is a project proposal, not an established standard.

## Quickstart

Requires Python 3.11+ and MuJoCo 4.0.1. Run from this directory.

    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    python examples/mujoco4_transport.py --gap 0.07
    python examples/mujoco4_transport.py --gap 0.13
    python examples/mujoco4_transport.py --gap 0.03
    python -m unittest discover -s tests

The example is a pedagogical kinematic XY carrier with a fixed payload orientation, not a full articulated pick-and-place or dynamics benchmark. It samples a 41x41 translation grid for two orientations, checks contacts using MuJoCo, tests graph edges at intermediate samples, and compares fixed-mode connectivity. There is no verified physical regrasp between modes. The browser example uses an independent analytic collision proxy and is explicitly not MuJoCo running in the browser. MuJoCo 4.0.1 is the target dependency; runtime testing has not been performed in the authoring environment.

## Evidence semantics

Reports distinguish verified sampled facts, sampled graph witnesses, and unknown continuous-space feasibility. The absence of a graph path is **not** a proof of continuous infeasibility. A graph witness is not a verified dynamic execution. Sample ratios depend on the domain, measure and grid resolution. Safety constraints must never be relaxed for execution simply because a counterfactual suggests it.

## v0.3: Structural concept knowledge graph

[Definition audit](AUDIT.md): 60 entries desk-reviewed. Required and optional evidence are separate; source excerpts verified, independent full-text review pending.

[Interactive graph explorer](https://crlqinliang.github.io/hicod/graph.html) · [Full concept catalogue](CONCEPTS.md).

The [full registry](concept_graph.json) contains 60 L4 definitions, 15 evidence interfaces, 304 typed edges and 29 source records. The [catalogue](CONCEPTS.md) contains mathematical specifications, computation contracts, inputs, dependencies and limitations. The underlying literature is distinguished from HiCoD operational proposals; ten entries now have finite-evidence evaluators; the remaining 50 are definition-only. No entry is claimed as a full physical evaluator.

The required-evidence DAG can be queried without MuJoCo or an LLM:

    python concept_graph.py validate
    python concept_graph.py show A01
    python concept_graph.py trace B05

Diagnostic links are suggested queries, not causal or logical implications. The planar demo remains an independent proof-of-concept proxy; it does not implement these 60 full robotic descriptors.

## v0.3.1: Executable finite-evidence layer

See [EVALUATORS.md](EVALUATORS.md) and [evaluators.mjs](evaluators.mjs). Run with Node.js 18+:

    node examples/evaluate.mjs B05
    node tests/test_evaluators.mjs

Ten concept computations are implemented over explicitly supplied finite data (not a robot simulator); 18 checks were executed on the evaluator function bodies. Full physical validation and backend integration remain pending.

## v0.4: Articulated physical evidence backend

[Interactive physical explorer](https://crlqinliang.github.io/hicod/physical.html) · [Backend documentation](PHYSICAL_BACKEND.md) · [Computed analytic results](physical_results.json)

The 3R planar arm uses analytic FK/IK, collision clearances, ideal fixed attachment directions and a layered path-family explorer. It feeds A01, B05, D03, E06 and H04 with actual computed finite evidence. The MuJoCo 4 replay adapter is provided but not runtime-tested. The analytic experiment is not a full pick-and-place execution or a MuJoCo result. Fourteen geometry/evidence checks and five scene integration checks passed on the repository function bodies in a JavaScript runtime; direct Node CLI and browser rendering have not been tested.

    node examples/planar3r.mjs disconnected --raw raw.json --report report.json
    node tests/test_planar3r.mjs

## v0.5: Multimodal explorer

[Interactive multimodal explorer](https://crlqinliang.github.io/hicod/multimodal.html) · [中文术语](TERMINOLOGY_CN.md).

[Multimodal documentation](MULTIMODAL.md) · [Computed results](multimodal_results.json). Five hybrid concepts now have planar implementations under explicitly assumed support, including B06, C01, C02, C04, C05. A designed geometry case has no sampled fixed-mode path but admits a one-switch path. No continuous or dynamic guarantee.

    node examples/multimodal.mjs regrasp_recovery all
    node tests/test_multimodal.mjs

## Concept modules

See [concepts.json](concepts.json) for the registry, [hicod.py](hicod.py) for the small evaluator and evidence-report implementation, and [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution contract. Initial implementations: sampled feasibility, endpoint compatibility, graph connectivity and connected components. Roadmap: shared-grasp sets from actual robot IK/collision, intermediate pose/regrasp, Grasp–IK/drag connectivity, bottleneck attribution, constraint conflicts, cross-stage dependencies, sensitivity, robustness and counterfactual recovery. The author's existing research implementations are not included in this initial commit.

## Evaluation plan

Compare binary feedback, raw geometry, local concepts, numerical structural descriptors and grounded semantic descriptors with identical backend and tool budgets. Record success, total computational time (including probes), token cost, calls, OOD generalization, and diagnosis accuracy. Include matched cases with the same local feasibility but different global connectivity. No benchmark results are claimed yet.

## Related foundations

- PDDLStream: https://arxiv.org/abs/1802.08705
- LLM³: https://arxiv.org/abs/2403.11552
- Text2Motion: https://arxiv.org/abs/2303.12153
- Minimum Constraint Removal: https://doi.org/10.1177/0278364913507795
- MuJoCo release notes: https://mujoco.readthedocs.io/en/4.0.1/changelog.html

## License

MIT, scoped to this HiCoD project directory. Contributions welcome. This is a subdirectory of the personal Pages repository; a standalone repository and MCP interface are future packaging tasks.
