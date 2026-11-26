# HiCoD L4 catalogue · v0.2

60 candidate definitions, 15 lower-level evidence interfaces. Each mathematical expression is a scoped project specification. `literature` identifies established underlying concepts; `operational` identifies our proposed descriptors, supported by related theory. No full evaluator is claimed for any of these 60 entries; the existing planar proxy is separate.

F(T): feasible set in declared candidate domain. G(p): object-relative feasible grasps. Γ: path family. V: declared structural descriptor. μ: specified measure. All results are relative to scope, models and evidence. A sampled negative result is not a continuous infeasibility proof.

## A — Compatibility

### A01 — Shared-Grasp Compatibility

- Terminology: literature
- Definition: Common object-relative grasp modes feasible at both specified object poses.
- Formalization: `G(ps) ∩ G(pg); compatible iff nonempty.`
- Computation: Intersect candidate identities after endpoint grasp, IK and collision checks.
- Inputs: Common grasp universe, two object poses, robot/base and obstacles.
- Required evidence: P03, P04, P05
- Diagnostic follow-up: B02, C02
- Limitations: Necessary for fixed-grasp transfer; not sufficient for a path. Empty sampled intersection is not a continuous certificate.
- Foundations: [QIN](https://arxiv.org/abs/2506.15920), [WAN](https://pmc.ncbi.nlm.nih.gov/articles/PMC5101345/)

### A02 — Grasp–Task Compatibility

- Terminology: operational
- Definition: Grasps admitting a complete task execution under stated attachment and physical constraints.
- Formalization: `G_task={g: ∃z∈F(T), attachment(z)=g throughout required stages}.`
- Computation: Filter candidate grasps by complete transfer and task wrench feasibility if dynamics are in scope.
- Inputs: Task, attachment family, permitted mode changes, geometry and dynamic constraints.
- Required evidence: A01, B02, J01
- Diagnostic follow-up: E01, H02
- Limitations: If dynamics are excluded report geometric compatibility only. Not endpoint graspability.
- Foundations: [QIN](https://arxiv.org/abs/2506.15920), [GRASP](https://doi.org/10.1007/s10514-014-9402-3), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139)

### A03 — Grasp–IK Compatibility

- Terminology: operational
- Definition: Projection of the feasible grasp/configuration relation onto grasp space at a given object pose or pose family.
- Formalization: `G(p)={g: ∃q, FK(q)=p·g, q∈Qvalid(p,g)}.`
- Computation: Sample grasps; enumerate or sample IK branches and filter collisions and limits.
- Inputs: Object poses, grasp transforms, robot, joint limits, environment.
- Required evidence: P03, P04, P05
- Diagnostic follow-up: A01, B03
- Limitations: A single IK witness is local evidence; it does not establish path feasibility or exhaustive coverage.
- Foundations: [QIN](https://arxiv.org/abs/2506.15920), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### A04 — Skill Compatibility

- Terminology: operational
- Definition: Whether the reachable outputs of one skill intersect the admissible inputs of a subsequent skill consistently.
- Formalization: `Post(S1) ∩ Pre(S2) ≠ ∅ in common state and variable space.`
- Computation: Compute reachable postconditions and feasible preconditions; test shared assignments.
- Inputs: Skill models, start sets, boundary states, geometric and resource constraints.
- Required evidence: P07, P08
- Diagnostic follow-up: E02, E06
- Limitations: Symbolic predicate agreement alone is insufficient if continuous parameters differ.
- Foundations: [FACT](https://doi.org/10.1177/0278364918802962), [TEXT](https://arxiv.org/abs/2303.12153)

### A05 — Base–Task Compatibility

- Terminology: operational
- Definition: Common stationary base placements supporting all specified task stages.
- Formalization: `B_task=∩_i B_i; B_i={b: stage i has a feasible witness at b}.`
- Computation: Intersect inverse reachability sets; verify collision and path constraints.
- Inputs: Base domain, stage targets, robot, obstacles, resolution.
- Required evidence: P04, P05
- Diagnostic follow-up: G03, B04
- Limitations: Separate stage witnesses may be mutually incompatible; moving-base tasks need different mode assumptions.
- Foundations: [BASE](https://jicrs.icros.org/_PR/view/?aidx=47244&bidx=4266), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139)

### A06 — Bimanual Grasp Compatibility

- Terminology: operational
- Definition: Grasp pairs allowing both arms to simultaneously realize a common rigid-object pose under joint and collision constraints.
- Formalization: `{(gL,gR): ∃qL,qR,p, FK_L(qL)=p·gL, FK_R(qR)=p·gR, all constraints hold}.`
- Computation: Pair grasps, solve coupled IK, check inter-arm and object collision.
- Inputs: Both robots, object pose, grasp pairs, limits and obstacles.
- Required evidence: P03, P04, P05, F03
- Diagnostic follow-up: C03, J01
- Limitations: Static simultaneous feasibility is not a transport or load-sharing guarantee.
- Foundations: [DUAL](https://doi.org/10.1016/j.robot.2017.10.005), [HAND](https://doi.org/10.1109/CASE59546.2024.10711713)

## B — Connectivity

### B01 — Configuration-Space Connectivity

- Terminology: literature
- Definition: Existence of a continuous path between specified configurations in valid configuration space.
- Formalization: `∃γ:[0,1]→Qfree, γ(0)=qs, γ(1)=qg.`
- Computation: Roadmap or continuous search, verified edges, certified methods for negative claims.
- Inputs: Configuration space, collision model, endpoints and constraints.
- Required evidence: P04, P05, P06
- Diagnostic follow-up: D02, B07
- Limitations: Path-connectedness is relevant; finite roadmap disconnection does not prove continuous disconnection.
- Foundations: [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/), [PROOF](https://www.roboticsproceedings.org/rss17/p064.html)

### B02 — Grasp Connectivity

- Terminology: operational
- Definition: Set of fixed rigid grasps for which a valid transfer path connects endpoint state sets.
- Formalization: `{g: ∃γ⊂Qfree(g), γ connects admissible start and goal sets}.`
- Computation: Search inside each candidate transfer mode with attachment retained.
- Inputs: Endpoint grasp sets, robot, object, transfer mode geometry.
- Required evidence: A01, B01
- Diagnostic follow-up: B05, A02
- Limitations: Endpoint compatibility alone is insufficient; prescribed object paths use B05.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [QIN](https://arxiv.org/abs/2506.15920)

### B03 — IK Branch Connectivity

- Terminology: operational
- Definition: Existence of a continuous valid joint-space lift of a prescribed end-effector path.
- Formalization: `∃ continuous q(s): FK(q(s))=T(s), q(s)∈Qvalid(s).`
- Computation: Generate waypoint IK candidates, verify connecting lifts, search layered graph.
- Inputs: Cartesian path, IK solver, tolerances, limits, collisions.
- Required evidence: P03, P04, P05, P06
- Diagnostic follow-up: B05, D04
- Limitations: IK family labels need not be globally invariant; adjacent endpoint proximity is not an edge certificate.
- Foundations: [IKLINK](https://arxiv.org/abs/2402.16154), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### B04 — Object-Pose Connectivity

- Terminology: operational
- Definition: Reachability between object poses under a declared set of manipulation modes.
- Formalization: `∃ hybrid execution ξ whose object projection connects ps and pg.`
- Computation: Search object/grasp/mode graph with consistent robot witnesses.
- Inputs: Object domain, allowed modes, robot, support and collision models.
- Required evidence: B06, P07
- Diagnostic follow-up: C02, A05
- Limitations: Object-only geometric paths need a consistent robot realization.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139), [WAN](https://pmc.ncbi.nlm.nih.gov/articles/PMC5101345/)

### B05 — Grasp–IK Trajectory Connectivity

- Terminology: operational
- Definition: Continuous feasible grasp and IK realization along a prescribed object path, with only explicitly permitted mode changes.
- Formalization: `∃g,q(s): FK(q(s))=p(s)·g, all constraints; g constant within transfer segments.`
- Computation: Construct layered grasp–IK graph; verify edges; DP for paths or allowed release cost.
- Inputs: Object path, grasp candidates, IK branches, transition rules.
- Required evidence: A03, B03, P06
- Diagnostic follow-up: D03, C05
- Limitations: Report fixed-grasp versus release-allowed scope; finite graph is approximate. This is a HiCoD synthesis of cited foundations.
- Foundations: [QIN](https://arxiv.org/abs/2506.15920), [IKLINK](https://arxiv.org/abs/2402.16154), [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html)

### B06 — Multi-modal Connectivity

- Terminology: literature
- Definition: Connectivity using feasible within-mode paths and admissible transitions between modes.
- Formalization: `∃m0…mk, γi⊂F_mi and valid connecting transitions.`
- Computation: Build/search hybrid mode graph; validate within-mode and transition witnesses.
- Inputs: Mode manifolds, boundary relations, start and goal sets.
- Required evidence: B01, C04
- Diagnostic follow-up: B04, C01
- Limitations: A symbolic mode edge without a valid boundary witness can be optimistic.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139)

### B07 — Homotopy Diversity

- Terminology: literature
- Definition: Multiplicity of distinct endpoint-fixed homotopy classes of feasible paths.
- Formalization: `γ1∼γ2 iff an endpoint-fixed continuous deformation remains in Qfree; count represented classes.`
- Computation: Topology-aware signatures or certificates and alternative path sampling.
- Inputs: Free space, endpoints, path family, equivalence relation.
- Required evidence: B01, P06
- Diagnostic follow-up: H05, B08
- Limitations: Homology may merge homotopy classes; observed count is only a lower bound with sound classification.
- Foundations: [HOMO](https://publications.ri.cmu.edu/topological-constraints-in-search-based-robot-path-planning), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### B08 — Connectivity Redundancy

- Terminology: operational
- Definition: Multiplicity of independent connections between endpoints in a specified graph.
- Formalization: `κ_e(s,t)=max number of edge-disjoint paths=min unit-capacity edge cut.`
- Computation: Compute max flow/min cut or vertex-disjoint paths as declared.
- Inputs: Graph, endpoints, capacity and independence criterion.
- Required evidence: B01, P06
- Diagnostic follow-up: D03, H06
- Limitations: Graph redundancy does not guarantee robustness to correlated physical failures.
- Foundations: [MENGER](https://graphsearch.epfl.ch/en/concept/1155738), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

## C — Transition

### C01 — Regrasp Feasibility

- Terminology: literature
- Definition: Existence of a task-completing execution containing at least one valid attachment change.
- Formalization: `∃ feasible hybrid path with ≥1 validated grasp switch.`
- Computation: Search regrasp graph with support, transit and transfer checks.
- Inputs: Grasp modes, poses, support surfaces and switch rules.
- Required evidence: B06, C04
- Diagnostic follow-up: C02, C05
- Limitations: A feasible regrasp does not prove a regrasp is necessary.
- Foundations: [WAN](https://pmc.ncbi.nlm.nih.gov/articles/PMC5101345/), [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html)

### C02 — Intermediate-Pose Bridging

- Terminology: operational
- Definition: Intermediate poses allowing feasible incoming transfer, grasp change and outgoing transfer.
- Formalization: `M={p: ∃gin,gout, transfer(ps,p,gin)∧switch(p,gin,gout)∧transfer(p,pg,gout)}.`
- Computation: Sample stable placements; prefilter shared grasps then verify both transfers and switch.
- Inputs: Endpoint poses, placement domain, support and grasp constraints.
- Required evidence: A01, B02, C04, P09
- Diagnostic follow-up: C01, C06
- Limitations: Endpoint intersections alone do not verify motion or stable placement.
- Foundations: [WAN](https://pmc.ncbi.nlm.nih.gov/articles/PMC5101345/), [QIN](https://arxiv.org/abs/2506.15920), [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html)

### C03 — Handover Feasibility

- Terminology: literature
- Definition: Existence of a coordinated transfer of ownership between arms with valid acquisition and release.
- Formalization: `∃ common state x and feasible receive/release motions with permitted support.`
- Computation: Search handover poses and grasp pairs, solve coupled IK, verify release and approach.
- Inputs: Arms, grasp pairs, support/force assumptions, handover region.
- Required evidence: A06, C04, P09
- Diagnostic follow-up: C01, F03
- Limitations: Simultaneous static IK is necessary but does not guarantee safe transfer.
- Foundations: [HAND](https://doi.org/10.1109/CASE59546.2024.10711713), [DUAL](https://doi.org/10.1016/j.robot.2017.10.005)

### C04 — Mode Transition Feasibility

- Terminology: literature
- Definition: Existence of a realizable boundary-state transition between two manipulation modes.
- Formalization: `T_mn={(x,y): x∈F_m, y∈F_n, (x,y)∈R_mn}; nonempty on reachable subsets.`
- Computation: Check guards, reset relations, approach, collisions and support at sampled boundaries.
- Inputs: Mode definitions, boundary states and transition rules.
- Required evidence: P05, P07, P09
- Diagnostic follow-up: C06, J03
- Limitations: Intersection of mode manifolds need not imply a physically realizable switch.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [CONTACT](https://par.nsf.gov/servlets/purl/10338784)

### C05 — Minimum Mode-Switch Cost

- Terminology: operational
- Definition: Minimum sum of assigned transition costs among task-completing executions.
- Formalization: `min_π Σ_{e∈π}w(e); unit switch weights count switches.`
- Computation: Shortest path/DP on validated mode graph, record optimum within graph.
- Inputs: Mode graph, weights, endpoints.
- Required evidence: B06, C04
- Diagnostic follow-up: C01, B05
- Limitations: Graph optimum is not continuous global optimum; absence requires appropriate certificate.
- Foundations: [IKLINK](https://arxiv.org/abs/2402.16154), [WAN](https://pmc.ncbi.nlm.nih.gov/articles/PMC5101345/), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### C06 — Transition Region Availability

- Terminology: operational
- Definition: Measure or sampled fraction of reachable boundary states admitting a specified mode transition.
- Formalization: `μ_T(T_mn∩reachable region), on declared transition coordinates.`
- Computation: Sample intrinsic transition domain and estimate feasible fraction/support.
- Inputs: Transition parameterization, sampling measure and domain.
- Required evidence: C04, P10
- Diagnostic follow-up: D01, H04
- Limitations: Lower-dimensional boundaries can have zero ambient measure; report intrinsic measure.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [EXP](https://motion.cs.illinois.edu/RoboticSystems/MotionPlanningHigherDimensions.html)

## D — Bottleneck

### D01 — Geometric Bottleneck

- Terminology: operational
- Definition: Localized geometric feature restricting the family of feasible routes, supported by structural or counterfactual evidence.
- Formalization: `Compare connectivity/capacity of F before and after a declared regional perturbation.`
- Computation: Locate cuts/low-clearance regions and evaluate controlled geometry interventions.
- Inputs: Path family, geometry, region and allowed interventions.
- Required evidence: B01, D05, P11
- Diagnostic follow-up: D02, I03
- Limitations: One colliding trajectory is not sufficient to establish a global bottleneck.
- Foundations: [NARROW](https://www.kavrakilab.rice.edu/publications/hsu-kavraki1998on-finding-narrow.pdf), [ENV](https://doi.org/10.1109/ICRA57147.2024.10611577)

### D02 — Narrow Passage

- Terminology: literature
- Definition: Restrictive connecting free-space region with small measure or visibility relative to nearby regions under a declared metric.
- Formalization: `Proxy: low-measure separator or low expansiveness across a partition of Qfree.`
- Computation: Estimate visibility/expansiveness and roadmap connectivity with adaptive sampling.
- Inputs: Free space, sampling measure, metric, local planner.
- Required evidence: B01, P10, P05
- Diagnostic follow-up: D01, D05
- Limitations: No universal threshold; workspace aperture is not C-space passage width.
- Foundations: [NARROW](https://www.kavrakilab.rice.edu/publications/hsu-kavraki1998on-finding-narrow.pdf), [EXP](https://motion.cs.illinois.edu/RoboticSystems/MotionPlanningHigherDimensions.html)

### D03 — Connectivity Bottleneck

- Terminology: operational
- Definition: A cut or stage transition limiting the capacity of task paths in a specified graph.
- Formalization: `min_{S:s∈S,t∉S} Σ_{e∈δ+(S)}cap(e).`
- Computation: Minimum cut or stagewise edge counts with path-conditioned analysis.
- Inputs: Task graph, capacities and endpoint sets.
- Required evidence: P06, B05
- Diagnostic follow-up: B08, D06
- Limitations: Capacities and graph approximation determine interpretation; sampled zero cut is not a global proof.
- Foundations: [MENGER](https://graphsearch.epfl.ch/en/concept/1155738), [IKLINK](https://arxiv.org/abs/2402.16154)

### D04 — Singularity Bottleneck

- Terminology: operational
- Definition: Task-required motion restricted across candidate paths by low directional velocity margin or poor Jacobian rank.
- Formalization: `sup_{γ∈Γ} inf_s σ_min(J_task(q(s))) as a scaled proxy.`
- Computation: Evaluate task velocity feasibility over path family; localize restricted directions.
- Inputs: Jacobian, task direction, scaling, velocity bounds, path family.
- Required evidence: B03, P12
- Diagnostic follow-up: D03, J04
- Limitations: A small singular value on one path is L3; full rank is not a guarantee of execution.
- Foundations: [MR](https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-4-manipulability/), [IKLINK](https://arxiv.org/abs/2402.16154)

### D05 — Clearance Bottleneck

- Terminology: operational
- Definition: The best attainable minimum clearance across a stated candidate path family.
- Formalization: `sup_{γ∈Γ} inf_s d(γ(s),obstacles).`
- Computation: Signed-distance checks and widest-path search; identify limiting geometry.
- Inputs: Path family, obstacle and robot geometry, distance metric.
- Required evidence: B01, P05
- Diagnostic follow-up: D01, D02
- Limitations: Clearance of one trajectory is local; sampled best clearance is only a scoped estimate.
- Foundations: [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/), [NARROW](https://www.kavrakilab.rice.edu/publications/hsu-kavraki1998on-finding-narrow.pdf)

### D06 — Critical Constraint

- Terminology: operational
- Definition: Constraint whose controlled diagnostic removal or permitted parameter change alters a declared structural metric or feasibility.
- Formalization: `Δ_i=V(F(C\{ci}))−V(F(C)).`
- Computation: Controlled re-solving or probing with a comparable domain and budget.
- Inputs: Constraint set, intervention rules, descriptor, solver oracle.
- Required evidence: P08, P11
- Diagnostic follow-up: D07, G05
- Limitations: Interactions matter; diagnostic removal never authorizes violating safety constraints.
- Foundations: [CONFLICT](https://arxiv.org/abs/2211.15275), [MCR](https://doi.org/10.1177/0278364913507795)

### D07 — Constraint Conflict

- Terminology: literature
- Definition: Infeasible constraint subset; inclusion-minimal if every proper subset is feasible.
- Formalization: `C'⊆C, F(C')=∅; minimal if all proper subsets feasible.`
- Computation: Extract conflicts using sound feasibility/infeasibility oracle semantics.
- Inputs: Constraints, variables, tolerances, certificate requirements.
- Required evidence: P08, P13
- Diagnostic follow-up: D06, I02
- Limitations: Inclusion-minimal is not minimum cardinality; local solver failure is not a proof.
- Foundations: [CONFLICT](https://arxiv.org/abs/2211.15275), [PROOF](https://www.roboticsproceedings.org/rss17/p064.html)

## E — Dependency

### E01 — Grasp–Motion Dependency

- Terminology: operational
- Definition: Dependence of the feasible downstream motion family on the upstream grasp selection.
- Formalization: `M(g)={τ:(g,τ)∈F(T)}; compare conditional fibers across g.`
- Computation: Fix each grasp, explore valid transfers, compare paths or structural measures.
- Inputs: Grasp family, motion domain, task constraints.
- Required evidence: A01, B02
- Diagnostic follow-up: E02, G01
- Limitations: Equalize exploration budget and parameterization; observed association need not be causal.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [QIN](https://arxiv.org/abs/2506.15920)

### E02 — Cross-Stage Dependency

- Terminology: operational
- Definition: Change in downstream feasible sets conditional on different admissible upstream choices.
- Formalization: `F_future(x)={z_future:(x,z_future) satisfies remaining constraints}.`
- Computation: Condition on different boundary states and probe suffix feasibility.
- Inputs: Task skeleton, boundary state domain, remaining constraints.
- Required evidence: A04, P08
- Diagnostic follow-up: E01, E06
- Limitations: Compare controlled choices; distinguish correlation from causal intervention.
- Foundations: [FACT](https://doi.org/10.1177/0278364918802962), [TEXT](https://arxiv.org/abs/2303.12153)

### E03 — Object Blocking Dependency

- Terminology: literature
- Definition: A directed dependency induced when an object occupies a required placement or motion region of another object in a stated model.
- Formalization: `i→j if j blocks required placement/action of i in that model.`
- Computation: Test goal overlap or swept-volume blocking across allowed candidates.
- Inputs: Object poses, geometries, action model and target arrangements.
- Required evidence: P05, P08
- Diagnostic follow-up: E04, E05
- Limitations: Goal-overlap dependencies assume a specific rearrangement model; path-dependent blocking may be conditional.
- Foundations: [BUFF](https://www.roboticsproceedings.org/rss17/p033.html), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139)

### E04 — Task Ordering Dependency

- Terminology: operational
- Definition: Precedence implied by constraints across all feasible executions in the declared task model.
- Formalization: `i≺j iff every feasible execution in scope orders i before j (nonempty feasible family).`
- Computation: Derive mandatory precedences or test alternative sequences with witnesses.
- Inputs: Actions, temporal/precondition constraints, blocking model.
- Required evidence: E03, P08
- Diagnostic follow-up: E05, E02
- Limitations: An observed order is not mandatory; conditional precedences need explicit guards.
- Foundations: [TAMP](https://doi.org/10.1146/annurev-control-091420-084139), [BUFF](https://www.roboticsproceedings.org/rss17/p033.html)

### E05 — Deadlock / Cyclic Dependency

- Terminology: operational
- Definition: Cycle in strict precedence relations, or a reachable non-goal state with no enabled continuation under a stated model.
- Formalization: `Cycle in fixed precedence graph; behavioral deadlock if no admissible progress action.`
- Computation: Strongly connected components and state-space continuation checks.
- Inputs: Precedence model, modes, buffer availability, enabled actions.
- Required evidence: E04, P07
- Diagnostic follow-up: I01, C02
- Limitations: A dependency cycle can be resolved by buffers; not necessarily global infeasibility.
- Foundations: [BUFF](https://www.roboticsproceedings.org/rss17/p033.html), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### E06 — Future Feasibility Preservation

- Terminology: operational
- Definition: Whether an intermediate state lies in the goal-reachable set for remaining stages.
- Formalization: `K_i={x: ∃ admissible continuation from x to goal}; require x∈K_i.`
- Computation: Backward graph reachability or controllable-set analysis.
- Inputs: Remaining stages, goal, transition model and constraints.
- Required evidence: P07, P06
- Diagnostic follow-up: E02, I01
- Limitations: Robust versions need explicit control/disturbance quantifier order.
- Foundations: [HJ](https://arxiv.org/abs/1709.07523), [TOPP](https://arxiv.org/abs/1707.07239), [FACT](https://doi.org/10.1177/0278364918802962)

## F — Coupling & decomposability

### F01 — Variable Coupling

- Terminology: operational
- Definition: Nonseparability of feasibility or cost over declared decision-variable blocks.
- Formalization: `F_AB ≠ proj_A(F_AB)×proj_B(F_AB), or objective nonadditivity.`
- Computation: Inspect factor scopes, conditional feasible fibers or cross-derivative proxies.
- Inputs: Variable partition, constraints, objective and domains.
- Required evidence: P08
- Diagnostic follow-up: F02, F04
- Limitations: Shared factors show potential coupling, not its quantitative strength; Hessian is local.
- Foundations: [FACT](https://doi.org/10.1177/0278364918802962), [BOYD](https://web.stanford.edu/~boyd/cvxbook/)

### F02 — Constraint Coupling

- Terminology: operational
- Definition: Interaction between constraints through shared variables and joint feasible relations.
- Formalization: `Compare F(C1∪C2) with individual feasible sets and joint satisfiability.`
- Computation: Build constraint incidence graph, test joint feasibility and conflicts.
- Inputs: Constraint scopes, variable domains, feasibility oracle.
- Required evidence: P08
- Diagnostic follow-up: D07, F01
- Limitations: Coupling may occur without conflict; structural incidence alone does not quantify strength.
- Foundations: [FACT](https://doi.org/10.1177/0278364918802962), [CONFLICT](https://arxiv.org/abs/2211.15275)

### F03 — Bimanual Kinematic Coupling

- Terminology: literature
- Definition: Closed-chain constraint that both arms realize the same rigid-object transform.
- Formalization: `FK_L(qL)·gL⁻¹=FK_R(qR)·gR⁻¹=p within tolerance.`
- Computation: Coupled IK, relative pose residuals and joint path checks.
- Inputs: Robot models, object-relative grasps, limits and collisions.
- Required evidence: P03, P04, P08
- Diagnostic follow-up: A06, J01
- Limitations: Independent-arm feasibility is insufficient; assumes rigid cooperative attachment.
- Foundations: [DUAL](https://doi.org/10.1016/j.robot.2017.10.005), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### F04 — Task Decomposability

- Terminology: operational
- Definition: Whether a partition into subproblems with shared separators preserves feasibility and, if requested, optimality.
- Formalization: `With separator s, F(s)=∏_k F_k(s); cost separability additionally needed for independent optimality.`
- Computation: Analyze constraint graph separators; verify consistent assignments and objective.
- Inputs: Factor graph, proposed partition, separator and objective.
- Required evidence: F01, F05
- Diagnostic follow-up: E02
- Limitations: Approximate decomposition may sacrifice optimality or completeness; declare preserved properties.
- Foundations: [FACT](https://doi.org/10.1177/0278364918802962), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139)

### F05 — Conditional Independence

- Terminology: operational
- Definition: After fixing separator variables, feasible assignments in remaining blocks factorize.
- Formalization: `F(A,B|s)=F(A|s)×F(B|s) for relevant s.`
- Computation: Inspect factor scopes after conditioning; test feasible relation factorization.
- Inputs: Constraint network, variable blocks, separator assignments.
- Required evidence: P08
- Diagnostic follow-up: F04, F01
- Limitations: This is deterministic feasibility independence, not automatically statistical independence.
- Foundations: [FACT](https://doi.org/10.1177/0278364918802962), [BOYD](https://web.stanford.edu/~boyd/cvxbook/)

## G — Sensitivity

### G01 — Grasp Sensitivity

- Terminology: operational
- Definition: Change in task-level descriptor due to admissible variation of grasp variables.
- Formalization: `Δ_gV=[V(g⊕δ)−V(g)]/||δ||_W, or derivative when smooth.`
- Computation: Controlled grasp perturbations or discrete comparisons with equal budgets.
- Inputs: Grasp parameterization, perturbation metric and task descriptor.
- Required evidence: E01, P11
- Diagnostic follow-up: G04, H02
- Limitations: For discrete grasps use finite contrasts; account for search noise.
- Foundations: [BOYD](https://web.stanford.edu/~boyd/cvxbook/), [QIN](https://arxiv.org/abs/2506.15920)

### G02 — Object-Pose Sensitivity

- Terminology: operational
- Definition: Variation of a task descriptor under permitted object-pose changes.
- Formalization: `Δ_pV=[V(p⊕δ)−V(p)]/||δ||_W in declared SE(3) coordinates.`
- Computation: Perturb normalized translation/rotation coordinates, recompute descriptor.
- Inputs: Pose domain, units, task and perturbation bounds.
- Required evidence: B04, P11
- Diagnostic follow-up: H01, I04
- Limitations: Do not change mandatory task poses; specify translation/rotation normalization.
- Foundations: [BOYD](https://web.stanford.edu/~boyd/cvxbook/), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### G03 — Base-Pose Sensitivity

- Terminology: operational
- Definition: Variation of task feasibility or quality induced by changes in robot base pose.
- Formalization: `Δ_bV=[V(b⊕δ)−V(b)]/||δ||_W.`
- Computation: Probe base placements using inverse reachability and task checks.
- Inputs: Base pose domain, task, descriptor, allowable base movement.
- Required evidence: A05, P11
- Diagnostic follow-up: H01, I03
- Limitations: Inverse reachability alone cannot verify full task or base navigation.
- Foundations: [BASE](https://jicrs.icros.org/_PR/view/?aidx=47244&bidx=4266), [BOYD](https://web.stanford.edu/~boyd/cvxbook/)

### G04 — Trajectory Sensitivity

- Terminology: operational
- Definition: Variation of structural task descriptor under admissible changes in trajectory parameters.
- Formalization: `∇_aV(τ(a)) or controlled finite differences.`
- Computation: Differentiate validated surrogate or probe spline parameters within deformation budget.
- Inputs: Trajectory parameterization, metric, fixed endpoints and budget.
- Required evidence: B05, P11
- Diagnostic follow-up: D03, I04
- Limitations: Surrogate gradients need physical verification; discrete metrics may be nonsmooth.
- Foundations: [BOYD](https://web.stanford.edu/~boyd/cvxbook/), [IKLINK](https://arxiv.org/abs/2402.16154)

### G05 — Constraint Sensitivity

- Terminology: operational
- Definition: Variation of optimal value or feasible-space descriptor with constraint parameters.
- Formalization: `dV*/dθ where differentiable; finite perturbation otherwise.`
- Computation: Parametric optimization, valid dual sensitivity or controlled re-solving.
- Inputs: Constraint parameterization, metric, allowed perturbations.
- Required evidence: D06, P11
- Diagnostic follow-up: D07, I02
- Limitations: Dual interpretations require regularity; feasibility may change discontinuously.
- Foundations: [BOYD](https://web.stanford.edu/~boyd/cvxbook/), [CONFLICT](https://arxiv.org/abs/2211.15275)

## H — Robustness & redundancy

### H01 — Feasibility Robustness

- Terminology: operational
- Definition: Persistence of feasibility under declared uncertainty, distinguishing fixed-plan from replan feasibility.
- Formalization: `Pδ[valid(z,δ)] versus Pδ[∃z valid(z,δ)]; or worst-case versions.`
- Computation: Sample uncertainty or compute robust sets with declared quantifiers.
- Inputs: Perturbation distribution/set, model, solution family.
- Required evidence: P14, P08
- Diagnostic follow-up: H03, H02
- Limitations: Finite Monte Carlo is estimation, not guarantee; uncertainty assumptions are essential.
- Foundations: [FUNNEL](https://arxiv.org/abs/1601.04037), [HJ](https://arxiv.org/abs/1709.07523)

### H02 — Grasp Robustness

- Terminology: literature
- Definition: Probability or bounded tolerance of grasp success under pose/contact/friction disturbances; L4 aggregates a family or task.
- Formalization: `Pδ[grasp_success(g,δ)] or worst-case wrench margin across task/grasps.`
- Computation: Perturb contact models, evaluate force/wrench feasibility or physical trials.
- Inputs: Grasp family, contact model, uncertainty and success condition.
- Required evidence: P03, P09, P14
- Diagnostic follow-up: J01, H01
- Limitations: A single grasp's robustness score is L3 unless used to describe a family or task.
- Foundations: [GRASP](https://doi.org/10.1007/s10514-014-9402-3), [DEX](https://berkeleyautomation.github.io/dex-net/)

### H03 — Connectivity Robustness

- Terminology: operational
- Definition: Persistence of connectivity as scene, robot or task parameters vary.
- Formalization: `Pδ[connected(Fδ)] versus ∃γ∀δ valid(γ,δ).`
- Computation: Rebuild graphs under perturbations and independently evaluate fixed-path robustness.
- Inputs: Graph protocol, uncertainty, endpoints, constraints.
- Required evidence: B01, P14
- Diagnostic follow-up: B08
- Limitations: ∀δ∃γ is weaker than ∃γ∀δ; sampled topology is resolution dependent.
- Foundations: [FUNNEL](https://arxiv.org/abs/1601.04037), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### H04 — Solution-Space Volume

- Terminology: operational
- Definition: Measure of feasible solutions relative to an explicitly declared candidate domain and measure.
- Formalization: `μ(F) or μ(F)/μ(Z) with specified base/intrinsic measure.`
- Computation: Uniform or importance sampling; estimate feasible fraction and uncertainty.
- Inputs: Domain, measure, feasibility predicate and sample protocol.
- Required evidence: P08, P10
- Diagnostic follow-up: C06, D02
- Limitations: Equality-constrained sets may have zero ambient volume; parameterization matters.
- Foundations: [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/), [EXP](https://motion.cs.illinois.edu/RoboticSystems/MotionPlanningHigherDimensions.html)

### H05 — Solution Diversity

- Terminology: operational
- Definition: Variety of feasible solutions measured by a declared distance, mode or equivalence relation.
- Formalization: `Count represented classes or ε-separated verified witnesses.`
- Computation: Cluster verified candidates or compute mode/topology signatures.
- Inputs: Feasible candidates, metric/equivalence and thresholds.
- Required evidence: P06, P10
- Diagnostic follow-up: B07, B08
- Limitations: No universal diversity metric; different paths can share failure modes.
- Foundations: [HOMO](https://publications.ri.cmu.edu/topological-constraints-in-search-based-robot-path-planning), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### H06 — Failure Tolerance

- Terminology: operational
- Definition: Retention of task feasibility after specified components, modes or capabilities fail.
- Formalization: `max k such that all allowed failure sets of size ≤k preserve a goal path, or probability under failure model.`
- Computation: Remove modeled failures and recompute verified reachability.
- Inputs: Failure model, graph, endpoints and failure correlations.
- Required evidence: B08, P14
- Diagnostic follow-up: H03, I05
- Limitations: Disjoint graph paths may share physical risks; modeled failure sets matter.
- Foundations: [MENGER](https://graphsearch.epfl.ch/en/concept/1155738), [FUNNEL](https://arxiv.org/abs/1601.04037)

## I — Recoverability & counterfactual feasibility

### I01 — Recoverability

- Terminology: operational
- Definition: Existence of a permitted safe continuation from a failed or perturbed state to the original goal.
- Formalization: `x_fail∈backward reachable goal set under permitted controls and safety bounds.`
- Computation: Backward search/reachability with verified recovery witness.
- Inputs: Failure state, goal, recovery actions, hard safety constraints.
- Required evidence: E06, P07
- Diagnostic follow-up: I05, E05
- Limitations: Simulator reset need not be physically available; real state/model validity matter.
- Foundations: [HJ](https://arxiv.org/abs/1709.07523), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

### I02 — Minimum Constraint Removal

- Terminology: literature
- Definition: Minimum-cost set of constraints whose diagnostic removal admits a valid path.
- Formalization: `min_{D⊆C}cost(D) s.t. F(C\D)≠∅; original MCR counts removals.`
- Computation: Labeled roadmap or constrained search with witness and bound.
- Inputs: Constraint labels, costs, endpoints and geometry.
- Required evidence: P08, B01
- Diagnostic follow-up: D07, D06
- Limitations: Diagnostic removal is not authorization to violate constraints; exact minimum needs a proof.
- Foundations: [MCR](https://doi.org/10.1177/0278364913507795), [CONFLICT](https://arxiv.org/abs/2211.15275)

### I03 — Minimum Environment Change

- Terminology: operational
- Definition: Least-cost allowed change in environmental variables that enables task feasibility.
- Formalization: `inf_δ cost(δ) s.t. ∃z∈F(E⊕δ), δ∈allowed interventions.`
- Computation: Joint trajectory/environment optimization or counterfactual search.
- Inputs: Movable geometry, change bounds/cost, task and oracle.
- Required evidence: D01, P11
- Diagnostic follow-up: I02, G03
- Limitations: A modified feasible scene does not prove the robot can enact the change.
- Foundations: [ENV](https://doi.org/10.1109/ICRA57147.2024.10611577), [MCR](https://doi.org/10.1177/0278364913507795)

### I04 — Minimum Task Deformation

- Terminology: operational
- Definition: Smallest permitted modification of reference trajectory or soft task specification yielding feasible execution.
- Formalization: `inf_{δ∈D_allowed}||δ||_W s.t. F(T⊕δ)≠∅.`
- Computation: Constrained deformation or path repair with verified witness.
- Inputs: Reference path/task, metric, allowed modifications, hard constraints.
- Required evidence: G04, P11
- Diagnostic follow-up: C05, G02
- Limitations: Preserve mandatory goals and safety; local solution gives upper bound, not global minimum.
- Foundations: [IKLINK](https://arxiv.org/abs/2402.16154), [BOYD](https://web.stanford.edu/~boyd/cvxbook/), [ENV](https://doi.org/10.1109/ICRA57147.2024.10611577)

### I05 — Mode Substitutability

- Terminology: operational
- Definition: Existence of an alternate allowed mode or sequence satisfying the same task after excluding a mode.
- Formalization: `∃π∈Π_allowed excluding m with same goal and verified feasibility.`
- Computation: Search alternative mode families under same task constraints.
- Inputs: Allowed and excluded modes, goals, costs and safety constraints.
- Required evidence: B06, P07
- Diagnostic follow-up: H06, C01
- Limitations: Alternatives may differ in cost or robustness; validate the new execution.
- Foundations: [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html), [TAMP](https://doi.org/10.1146/annurev-control-091420-084139)

### I06 — Failure Attribution

- Terminology: operational
- Definition: Evidence-supported identification of constraints, stages or assumptions explaining failure in a specified solution family.
- Formalization: `Compare hypotheses using conflict certificates or controlled differences V(F_h)−V(F).`
- Computation: Query bottlenecks, conflicts and interventions; rank scoped evidence and keep unknowns.
- Inputs: Failed family, alternative hypotheses, scope, oracle and budget.
- Required evidence: D07, D03, P11
- Diagnostic follow-up: D06, I02, E02
- Limitations: No unique causal explanation guaranteed; counterfactual conclusions are model-relative.
- Foundations: [CONFLICT](https://arxiv.org/abs/2211.15275), [ENV](https://doi.org/10.1109/ICRA57147.2024.10611577), [PROOF](https://www.roboticsproceedings.org/rss17/p064.html)

## J — Dynamic structure

### J01 — Grasp–Wrench Compatibility

- Terminology: operational
- Definition: Task-wide containment of required wrenches in the attainable grasp wrench set with consistent frames and sign conventions.
- Formalization: `∀s, W_required(s)⊆W_available(g,q(s),s).`
- Computation: Construct contact wrench sets, test force feasibility or inclusion and margins.
- Inputs: Contacts, friction, mass/inertia, path and actuator force limits.
- Required evidence: P09, P15
- Diagnostic follow-up: A02, H02
- Limitations: Force closure at one state does not guarantee bounded task-wide wrench capacity.
- Foundations: [GRASP](https://doi.org/10.1007/s10514-014-9402-3), [MR](https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-4-manipulability/)

### J02 — Kinodynamic Connectivity

- Terminology: literature
- Definition: Existence of a state-control trajectory connecting endpoints under dynamics and state/input constraints.
- Formalization: `∃x(t),u(t),T: xdot=f(x,u), x(0)∈Xs, x(T)∈Xg, constraints hold.`
- Computation: Kinodynamic planning, trajectory optimization or reachability with validation.
- Inputs: Dynamics, initial/goal state sets, controls, environment and limits.
- Required evidence: P15, P07
- Diagnostic follow-up: J05, J03
- Limitations: Geometric path existence does not imply dynamic feasibility; sampling failure is not a certificate.
- Foundations: [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/), [HJ](https://arxiv.org/abs/1709.07523)

### J03 — Contact-Mode Connectivity

- Terminology: operational
- Definition: Existence of a physically admissible hybrid execution through contact modes and valid transitions.
- Formalization: `∃ mode sequence with continuous segments satisfying contact laws and valid guards/resets.`
- Computation: Contact-mode graph, complementarity or hybrid optimization with checks.
- Inputs: Contact geometry/friction, modes, dynamic or quasistatic model.
- Required evidence: C04, P09, P15
- Diagnostic follow-up: J02, C03
- Limitations: Quasistatic results are not dynamic guarantees; switches require consistent states and forces.
- Foundations: [CONTACT](https://par.nsf.gov/servlets/purl/10338784), [MODES](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html)

### J04 — Dynamic Bottleneck

- Terminology: operational
- Definition: A task region restricting feasible executions through attainable force, torque, speed or controllability margins.
- Formalization: `sup_{ξ∈Γ_dynamic}inf_t min_j normalized slack_j(ξ(t)).`
- Computation: Evaluate dynamic constraints over candidate trajectory families; identify limiting interval.
- Inputs: Dynamics, actuator/contact limits, normalization and family.
- Required evidence: J02, P15
- Diagnostic follow-up: D04, J05
- Limitations: A single trajectory peak torque is L3; L4 requires a family or certified bound.
- Foundations: [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/), [TOPP](https://arxiv.org/abs/1707.07239), [GRASP](https://doi.org/10.1007/s10514-014-9402-3)

### J05 — Temporal Feasibility

- Terminology: literature
- Definition: Existence of an admissible time parameterization of a prescribed geometric path under dynamic and kinematic bounds.
- Formalization: `∃ monotone s(t): q(t)=q_path(s(t)) with velocity/acceleration/torque bounds and boundary conditions.`
- Computation: TOPP-RA or equivalent path-speed controllability analysis with verification.
- Inputs: Geometric path, boundary velocities, limits and dynamics.
- Required evidence: P15, P07
- Diagnostic follow-up: J02, J04
- Limitations: This concerns a prescribed path and modeled constraints, not search over all path shapes.
- Foundations: [TOPP](https://arxiv.org/abs/1707.07239), [LAV](https://msl.cs.uiuc.edu/~lavalle/planning/)

## Evidence interfaces

- **P01 Geometry and frames**: Meshes, transforms and geometry in consistent frames. Geometry/FK representation.
- **P02 Task and allowed modes**: Goal, boundaries, allowed actions and hard constraints. Task specification.
- **P03 Grasp and IK candidate relation**: Object-relative grasp transforms and their IK witnesses. Grasp sampling/IK.
- **P04 Joint and kinematic validity**: FK residual, joint limits, configuration validity. FK/IK/bounds checks.
- **P05 Collision and signed distance**: Collision predicate and distance for a candidate state or edge. Collision/distance queries.
- **P06 Path and graph evidence**: Candidate states, edges, witnesses and edge-check rules. Roadmap/layered graph verification.
- **P07 State transition and control model**: Permitted transitions, guards and controls. Transition/control feasibility checks.
- **P08 Constraint and variable specification**: Domains, constraint scopes, predicates and objective. Constraint evaluation and incidence graph.
- **P09 Contact, support and grasp stability**: Contact laws, support, grasp forces and stable placements. Contact/wrench evaluation.
- **P10 Sampling domain and measure**: Parameterization, weights, measure, resolution and protocol. Sampling and estimation.
- **P11 Controlled intervention protocol**: Allowed changes, normalized budget, fixed factors and cost. Counterfactual evaluation.
- **P12 Jacobian and directional margin**: Scaled task Jacobian, rank and directional velocity bounds. SVD/directional feasibility.
- **P13 Feasibility certificate / oracle**: Oracle semantics, verified witnesses and sound negative certificates. Certified feasibility checks.
- **P14 Uncertainty and failure model**: Perturbation sets/distributions, scenarios and quantifiers. Uncertainty sampling/robust sets.
- **P15 Dynamics and actuation model**: State dynamics, inertia, actuator and timing constraints. Dynamics/torque checks.

## References

- **LAV** — [LaValle, Planning Algorithms (2006), chapters 4–8 and 13–15](https://msl.cs.uiuc.edu/~lavalle/planning/)
- **TAMP** — [Garrett et al., Integrated Task and Motion Planning (2021)](https://doi.org/10.1146/annurev-control-091420-084139)
- **FACT** — [Garrett et al., Sampling-based methods for factored task and motion planning (2018)](https://doi.org/10.1177/0278364918802962)
- **QIN** — [Qin et al., Learning from Planned Data to Improve Robotic Pick-and-Place Planning Efficiency](https://arxiv.org/abs/2506.15920)
- **GRASP** — [Roa and Suárez, Grasp quality measures: review and performance (2015)](https://doi.org/10.1007/s10514-014-9402-3)
- **WAN** — [Wan and Harada, Integrated assembly and motion planning using regrasp graphs (2016)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5101345/)
- **MODES** — [Hauser, Robotic Systems, Advanced Topics in Planning: multi-modal motion planning](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html)
- **IKLINK** — [Wang et al., IKLink: End-Effector Trajectory Tracking with Minimal Reconfigurations (2024)](https://arxiv.org/abs/2402.16154)
- **BASE** — [Real-time robot base placement based on inverse reachability maps (2025)](https://jicrs.icros.org/_PR/view/?aidx=47244&bidx=4266)
- **DUAL** — [Ortenzi et al., Dual-arm cooperative manipulation under joint limit constraints (2018)](https://doi.org/10.1016/j.robot.2017.10.005)
- **HAND** — [Manipulation and Handover Planning for Dual-Arm Robots (CASE 2024)](https://doi.org/10.1109/CASE59546.2024.10711713)
- **HOMO** — [Bhattacharya et al., Topological Constraints in Search-based Robot Path Planning (2012)](https://publications.ri.cmu.edu/topological-constraints-in-search-based-robot-path-planning)
- **MENGER** — [Menger's theorem: edge and vertex connectivity](https://graphsearch.epfl.ch/en/concept/1155738)
- **NARROW** — [Hsu et al., On Finding Narrow Passages with Probabilistic Roadmap Planners (1998)](https://www.kavrakilab.rice.edu/publications/hsu-kavraki1998on-finding-narrow.pdf)
- **MR** — [Lynch and Park, Modern Robotics, section 5.4 Manipulability](https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-4-manipulability/)
- **CONFLICT** — [Ortiz-Haro et al., A Conflict-driven Interface between Symbolic Planning and Nonlinear Constraint Solving (2022)](https://arxiv.org/abs/2211.15275)
- **BUFF** — [Gao et al., On Minimizing the Number of Running Buffers for Tabletop Rearrangement (2021)](https://www.roboticsproceedings.org/rss17/p033.html)
- **TEXT** — [Lin et al., Text2Motion: From Natural Language Instructions to Feasible Plans (2023)](https://arxiv.org/abs/2303.12153)
- **PDDL** — [Garrett et al., PDDLStream (2020)](https://arxiv.org/abs/1802.08705)
- **BOYD** — [Boyd and Vandenberghe, Convex Optimization (2004), perturbation and sensitivity analysis](https://web.stanford.edu/~boyd/cvxbook/)
- **FUNNEL** — [Majumdar and Tedrake, Funnel Libraries for Real-Time Robust Feedback Motion Planning (2017)](https://arxiv.org/abs/1601.04037)
- **HJ** — [Bansal et al., Hamilton-Jacobi Reachability: A Brief Overview and Recent Advances (2017)](https://arxiv.org/abs/1709.07523)
- **DEX** — [Berkeley AUTOLAB, Dex-Net, physics-based grasp robustness](https://berkeleyautomation.github.io/dex-net/)
- **MCR** — [Hauser, The minimum constraint removal problem with three robotics applications (2014)](https://doi.org/10.1177/0278364913507795)
- **ENV** — [Liu and Brandão, Generating Environment-based Explanations of Motion Planner Failure (ICRA 2024)](https://doi.org/10.1109/ICRA57147.2024.10611577)
- **PROOF** — [Li and Dantam, Learning Proofs of Motion Planning Infeasibility (RSS 2021)](https://www.roboticsproceedings.org/rss17/p064.html)
- **TOPP** — [Pham and Pham, A New Approach to Time-Optimal Path Parameterization based on Reachability Analysis (2018)](https://arxiv.org/abs/1707.07239)
- **CONTACT** — [Cheng et al., Contact Mode Guided Sampling-Based Planning for Quasistatic Dexterous Manipulation in 2D (2021)](https://par.nsf.gov/servlets/purl/10338784)
- **EXP** — [Hauser, Robotic Systems, Motion Planning in Higher Dimensions: expansiveness](https://motion.cs.illinois.edu/RoboticSystems/MotionPlanningHigherDimensions.html)
