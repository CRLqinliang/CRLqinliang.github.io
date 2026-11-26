# Concept definition audit · v0.3

Date: 2026-11-26. Desk review of all 60 concept definitions and 29 source records / accessible excerpts. Not a full-text proof audit; expert sign-off pending. Preserve stable IDs. Keep = retained with interpretation note; Scope = distinguish instance from family; Revise = clarify definition or dependencies (some clarifications are recorded in notes for follow-up). No new claim of standardized terminology.

## Rules

- L4 describes a relation, set, distribution or structure over a declared solution family. A single collision, residual or trajectory failure is L3 evidence.
- Mandatory evidence is distinct from optional evidence, specialization and diagnostic suggestions. Only requires edges constitute the dependency DAG.
- Every negative sampled claim remains scoped to the tested representation. Continuous infeasibility requires a sound certificate.
- No source record establishes the correctness of a new operational definition automatically.

## Review results

- **A01 Shared-Grasp Compatibility — Keep.** Use canonical object-relative grasp IDs and a common sampled universe. Empty intersection only excludes the tested candidates.
- **A02 Grasp–Task Compatibility — Revise.** Whole-task grasp set differs from endpoint overlap (A01) and transfer-only connectivity (B02). Dynamics are conditional on task scope.
- **A03 Grasp–IK Compatibility — Scope.** A single (g,q) check is L3. The projected feasible grasp set or its coverage across a pose family is L4.
- **A04 Skill Compatibility — Keep.** The intersection must use reachable output states from the actual allowed initial set, not nominal postconditions.
- **A05 Base–Task Stage Compatibility — Revise.** Intersection of stage base sets is an endpoint/stage screening relation, not full task compatibility. Use a fixed base and consistent shared assignments.
- **A06 Bimanual Grasp Compatibility — Scope.** Assess the set of grasp pairs for a specified object pose or explicitly declared pose domain, not just one coupled IK witness.
- **B01 Configuration-Space Connectivity — Scope.** Pairwise connectivity is a relation on endpoint states; report reachable sets or components when diagnosing a solution space. Finite graph absence is unknown continuously.
- **B02 Grasp Connectivity — Keep.** Unrestricted object path under a fixed grasp differs from B05 prescribed object path. Include attachment and object collision.
- **B03 Continuous IK Path Lift — Revise.** Use continuous path lift with explicit end constraints; IK labels are implementation-specific, not topology invariants.
- **B04 Object-Pose Connectivity — Keep.** Object pose projection requires a consistent robot/hybrid witness. Distinguish existential reachability from object-only paths.
- **B05 Grasp–IK Trajectory Connectivity — Revise.** Separate fixed-attachment path lift from switch-allowed tracking. A release may violate a continuous drag requirement; only count it under explicit task rules.
- **B06 Multi-modal Connectivity — Keep.** A hybrid execution needs both within-mode paths and admissible boundary transitions. Connectivity cannot be inferred from mode adjacency alone.
- **B07 Homotopy Diversity — Scope.** Homology signatures can discriminate classes without identifying every homotopy class. Count only represented classes under stated equivalence.
- **B08 Connectivity Redundancy — Keep.** Unit-capacity edge-disjoint routes are a graph invariant; declare directedness, endpoint conventions and failure correlations.
- **C01 Regrasp Feasibility — Keep.** A witness with a grasp change is not proof that regrasp is necessary; compare fixed-grasp alternatives.
- **C02 Intermediate-Pose Bridging — Revise.** Require a consistent intermediate placement, supported release and reacquisition and incoming/outgoing robot motions. Two shared-grasp intersections are a screening test.
- **C03 Handover Feasibility — Scope.** Report feasible handover region or grasp-pair family; a single verified handover is L3 evidence.
- **C04 Mode Transition Feasibility — Scope.** For L4 describe admissible transition relation or reachable transition domain. Individual transition validity remains L3.
- **C05 Minimum Mode-Switch Cost — Keep.** Costs apply to explicitly labeled transition edges; report finite graph optimum and do not equate switch count with execution time.
- **C06 Transition Region Availability — Keep.** Measure must be intrinsic to the declared transition manifold or sampling protocol, not ambient volume.
- **D01 Geometric Bottleneck — Revise.** A geometric bottleneck requires path-family or separator evidence. Low clearance and counterfactual relocation are alternative evidence, not universal prerequisites.
- **D02 Narrow Passage — Keep.** A narrow passage is relative to measure, visibility and metric; do not classify by workspace width alone.
- **D03 Connectivity Bottleneck — Revise.** Minimum cut is generic graph capacity, not specific to grasp–IK tracking. Report zero-cut disconnection separately from small positive bottleneck.
- **D04 Singularity Bottleneck — Revise.** An infimum singular value along a path is a proxy; directional velocity feasibility and rank must be interpreted with task dimension and scaling.
- **D05 Clearance Bottleneck — Keep.** Widest-path clearance over alternatives is L4; clearance of a supplied path is L3. Empty feasible path family has no finite margin.
- **D06 Critical Constraint — Keep.** Controlled intervention must specify metric, comparable domain and constraints; diagnostic removal does not authorize physical execution.
- **D07 Constraint Conflict — Keep.** Distinguish inclusion-minimal conflict, minimum-cardinality conflict and a mere unsuccessful numerical solve.
- **E01 Grasp–Motion Dependency — Keep.** Use conditional transfer fibers over grasp choices, equal exploration budget; relation is not a single downstream failure.
- **E02 Cross-Stage Dependency — Keep.** Condition on complete upstream boundary state, distinguish feasibility effects from sampling/solver differences.
- **E03 Object Blocking Dependency — Scope.** Separate mandatory blocking under a specified model from observed collisions on sampled paths.
- **E04 Task Ordering Dependency — Revise.** Precedence can derive from task rules without object blocking; avoid vacuous truth when no feasible execution exists.
- **E05 Precedence Cycles & State Deadlock — Revise.** A strict precedence cycle and a state with no enabled transitions are distinct; report separately. A non-goal state with no goal-reaching continuation may still have enabled actions.
- **E06 Future Feasibility Preservation — Scope.** Compute the backward reachable set for the remaining goal; a membership test for one intermediate state is only L3 evidence.
- **F01 Variable Coupling — Keep.** Feasible-set nonfactorization and objective nonseparability are distinct coupling types; specify blocks and domain.
- **F02 Constraint Coupling — Revise.** Separate structural variable-sharing from quantitative interaction and infeasibility. Joint feasible set is always intersection in common domain.
- **F03 Bimanual Kinematic Coupling — Scope.** Closed-chain equality is L3 at a point. L4 describes coupled feasible pairs, projection/fibers and connectivity across the joint space.
- **F04 Task Decomposability — Keep.** Feasibility decomposition and independent optimality have different conditions; separators and objective both matter.
- **F05 Conditional Feasible-Set Independence — Revise.** Rename display to conditional feasible-set independence (deterministic); do not conflate with probabilistic conditional independence.
- **G01 Grasp Sensitivity — Keep.** Compare normalized grasp perturbations or discrete contrasts with consistent physical and computational budgets.
- **G02 Object-Pose Sensitivity — Keep.** Specify SE(3) perturbation convention and translation/rotation scaling; distinguish changing a task from modeling error.
- **G03 Base-Pose Sensitivity — Revise.** Base-pose sensitivity may use any full task descriptor; stage base compatibility is one optional proxy.
- **G04 Trajectory Sensitivity — Revise.** Trajectory sensitivity applies to a declared family/metric, not exclusively Grasp–IK Connectivity; surrogate gradients are hypotheses.
- **G05 Constraint Sensitivity — Keep.** Dual sensitivity only with appropriate regularity; local solver noise and discontinuous feasibility must be explicit.
- **H01 Feasibility Robustness — Scope.** Separate fixed-plan, adaptive replan and feedback-policy robustness; L4 concerns family or quantified uncertainty, not one nominal result.
- **H02 Grasp Robustness — Scope.** Single-grasp robustness is a conventional quality metric (L3); L4 evaluates distribution or task-conditioned robust grasp set.
- **H03 Connectivity Robustness — Revise.** Endpoint connectivity under each perturbation is not global connectedness of the entire free space; distinguish quantifier order.
- **H04 Solution-Space Volume — Keep.** Declare sampling law, domain and intrinsic measure. A finite feasible fraction estimates probability under that law, not necessarily geometric volume.
- **H05 Solution Diversity — Keep.** Count classes or separated witnesses under a declared metric; diversity is not a universal scalar.
- **H06 Failure Tolerance — Revise.** Failure tolerance requires explicit failed elements and correlated scenarios; edge-disjointness is one special case, not mandatory.
- **I01 Recoverability — Scope.** Recoverable state set is L4; checking whether one failed state belongs to it is L3. Preserve original task and safety constraints.
- **I02 Minimum Constraint Removal — Keep.** Original MCR concerns geometric path constraints; weighted and generic variants are project extensions; do not physically remove safety requirements.
- **I03 Minimum Environment Change — Revise.** Need not first prove a geometric bottleneck; evaluate allowed changes directly and distinguish repair witness from global optimum.
- **I04 Minimum Task Deformation — Revise.** Sensitivity is optional for search, not necessary for minimum deformation; keep hard goals and constraints unchanged.
- **I05 Mode Substitutability — Keep.** Alternative mode family must preserve same goal and hard constraints; distinguish verified substitute from suggestion.
- **I06 Failure Attribution — Revise.** Conflict, bottleneck and counterfactual tests are alternate evidence types; failure cause may be unidentified or nonunique.
- **J01 Grasp–Wrench Compatibility — Scope.** Evaluate wrench feasibility over candidate grasps/task states with force bounds, sign convention and frame; pointwise force closure is not L4.
- **J02 Kinodynamic Connectivity — Keep.** State/control connectivity under dynamics; finite search absence is not a proof.
- **J03 Contact-Mode Connectivity — Keep.** Model contact guards, resets and laws; quasistatic and dynamic cases are distinct.
- **J04 Dynamic Bottleneck — Keep.** Compare dynamic margins across candidate trajectories, normalize slacks and distinguish infeasible family from low positive margin.
- **J05 Temporal Feasibility — Scope.** For one fixed path, existence of a timing is a trajectory feasibility test. L4 describes controllable speed sets or feasible timing/path families.

## Source audit

- **LAV** — [LaValle, Planning Algorithms (2006), chapters 4–8 and 13–15](https://msl.cs.uiuc.edu/~lavalle/planning/book.html). Book table of contents: configuration space, paths and connectivity, sampling, dynamics. Verification: accessible source record/excerpt; full-text derivation pending.
- **TAMP** — [Garrett et al., Integrated Task and Motion Planning (2021)](https://doi.org/10.1146/annurev-control-091420-084139). Publisher record: survey of integrated symbolic/continuous planning. Verification: accessible source record/excerpt; full-text derivation pending.
- **FACT** — [Garrett et al., Sampling-based methods for factored task and motion planning (2018)](https://doi.org/10.1177/0278364918802962). Publisher abstract: factored transitions and constraint scopes; deterministic factorization is project specification. Verification: accessible source record/excerpt; full-text derivation pending.
- **QIN** — [Qin et al., Learning from Planned Data to Improve Robotic Pick-and-Place Planning Efficiency](https://arxiv.org/abs/2506.15920). Full HTML introduction and abstract: shared grasps at initial and goal poses; no continuous transfer guarantee. Verification: accessible source record/excerpt; full-text derivation pending.
- **GRASP** — [Roa and Suárez, Grasp quality measures: review and performance (2015)](https://doi.org/10.1007/s10514-014-9402-3). Publisher abstract: grasp quality measures; task wrench interpretation is scoped project formalization. Verification: accessible source record/excerpt; full-text derivation pending.
- **WAN** — [Wan and Harada, Integrated assembly and motion planning using regrasp graphs (2016)](https://doi.org/10.1186/s40638-016-0050-2). Open-access article: stable support, regrasp graphs and integrated motion planning. Verification: accessible source record/excerpt; full-text derivation pending.
- **MODES** — [Hauser, Robotic Systems, Advanced Topics in Planning: multi-modal motion planning](https://motion.cs.illinois.edu/RoboticSystems/AdvancedTopicsInPlanning.html). Open textbook chapter: transit/transfer modes, transition regions, joint robot/object C-space. Verification: accessible source record/excerpt; full-text derivation pending.
- **IKLINK** — [Wang et al., IKLink: End-Effector Trajectory Tracking with Minimal Reconfigurations (2024)](https://arxiv.org/abs/2402.16154). Abstract: waypoint IK graph and DP minimize reconfigurations; not a proof of continuous path lifting. Verification: accessible source record/excerpt; full-text derivation pending.
- **BASE** — [Real-time robot base placement based on inverse reachability maps (2025)](https://jicrs.icros.org/_PR/view/?aidx=47244&bidx=4266). Publisher abstract: intersect/integrate inverse reachability maps for task targets. Verification: accessible source record/excerpt; full-text derivation pending.
- **DUAL** — [Ortenzi et al., Dual-arm cooperative manipulation under joint limit constraints (2018)](https://doi.org/10.1016/j.robot.2017.10.005). Publisher abstract/metadata: dual-arm rigid-object coordination and joint limits. Verification: accessible source record/excerpt; full-text derivation pending.
- **HAND** — [Manipulation and Handover Planning for Dual-Arm Robots (CASE 2024)](https://doi.org/10.1109/CASE59546.2024.10711713). IEEE abstract: regrasp graph and online handover pose planning. Verification: accessible source record/excerpt; full-text derivation pending.
- **HOMO** — [Bhattacharya et al., Topological Constraints in Search-based Robot Path Planning (2012)](https://publications.ri.cmu.edu/topological-constraints-in-search-based-robot-path-planning). Institutional abstract: homotopy/homology classes and planning. Verification: accessible source record/excerpt; full-text derivation pending.
- **MENGER** — [Menger's theorem: edge and vertex connectivity](https://graphsearch.epfl.ch/en/concept/1155738). EPFL theorem statement: disjoint paths and minimum cut; weighted extension. Verification: accessible source record/excerpt; full-text derivation pending.
- **NARROW** — [Hsu et al., On Finding Narrow Passages with Probabilistic Roadmap Planners (1998)](https://www.kavrakilab.rice.edu/publications/hsu-kavraki1998on-finding-narrow.pdf). Lab/paper abstract: PRM connectivity and narrow passages. Verification: accessible source record/excerpt; full-text derivation pending.
- **MR** — [Lynch and Park, Modern Robotics, section 5.4 Manipulability](https://modernrobotics.northwestern.edu/nu-gm-book-resource/5-4-manipulability/). Textbook supplement: manipulability and directional ellipsoid. Verification: accessible source record/excerpt; full-text derivation pending.
- **CONFLICT** — [Ortiz-Haro et al., A Conflict-driven Interface between Symbolic Planning and Nonlinear Constraint Solving (2022)](https://arxiv.org/abs/2211.15275). Abstract: infeasible subsets of nonlinear constraints. Verification: accessible source record/excerpt; full-text derivation pending.
- **BUFF** — [Gao et al., On Minimizing the Number of Running Buffers for Tabletop Rearrangement (2021)](https://www.roboticsproceedings.org/rss17/p033.html). RSS abstract: dependency graphs and running buffers. Verification: accessible source record/excerpt; full-text derivation pending.
- **TEXT** — [Lin et al., Text2Motion: From Natural Language Instructions to Feasible Plans (2023)](https://arxiv.org/abs/2303.12153). Abstract: geometric dependencies spanning skill sequences. Verification: accessible source record/excerpt; full-text derivation pending.
- **PDDL** — [Garrett et al., PDDLStream (2020)](https://arxiv.org/abs/1802.08705). Abstract: symbolic planning with black-box continuous samplers; background only. Verification: accessible source record/excerpt; full-text derivation pending.
- **BOYD** — [Boyd and Vandenberghe, Convex Optimization (2004), perturbation and sensitivity analysis](https://web.stanford.edu/~boyd/cvxbook/). Author book site: convex optimization; sensitivity formulas require appropriate hypotheses. Verification: accessible source record/excerpt; full-text derivation pending.
- **FUNNEL** — [Majumdar and Tedrake, Funnel Libraries for Real-Time Robust Feedback Motion Planning (2017)](https://arxiv.org/abs/1601.04037). Abstract: robust feedback funnels and bounded disturbances. Verification: accessible source record/excerpt; full-text derivation pending.
- **HJ** — [Bansal et al., Hamilton-Jacobi Reachability: A Brief Overview and Recent Advances (2017)](https://arxiv.org/abs/1709.07523). Abstract: dynamical reachability under bounded disturbances. Verification: accessible source record/excerpt; full-text derivation pending.
- **DEX** — [Berkeley AUTOLAB, Dex-Net, physics-based grasp robustness](https://berkeleyautomation.github.io/dex-net/). Project publication descriptions: force-closure/grasp success under uncertainties. Verification: accessible source record/excerpt; full-text derivation pending.
- **MCR** — [Hauser, The minimum constraint removal problem with three robotics applications (2014)](https://doi.org/10.1177/0278364913507795). Publisher abstract: fewest geometric constraints removed to enable path. Verification: accessible source record/excerpt; full-text derivation pending.
- **ENV** — [Liu and Brandão, Generating Environment-based Explanations of Motion Planner Failure (ICRA 2024)](https://doi.org/10.1109/ICRA57147.2024.10611577). Institutional abstract: environment pose changes enabling planning success. Verification: accessible source record/excerpt; full-text derivation pending.
- **PROOF** — [Li and Dantam, Learning Proofs of Motion Planning Infeasibility (RSS 2021)](https://www.roboticsproceedings.org/rss17/p064.html). RSS abstract: separating obstacle manifolds as infeasibility certificates. Verification: accessible source record/excerpt; full-text derivation pending.
- **TOPP** — [Pham and Pham, A New Approach to Time-Optimal Path Parameterization based on Reachability Analysis (2018)](https://arxiv.org/abs/1707.07239). Abstract: reachable/controllable speed sets via discretized path LPs. Verification: accessible source record/excerpt; full-text derivation pending.
- **CONTACT** — [Cheng et al., Contact Mode Guided Sampling-Based Planning for Quasistatic Dexterous Manipulation in 2D (2021)](https://arxiv.org/abs/2011.01454). IEEE/arXiv abstract: quasistatic manipulation with contact-mode transitions. Verification: accessible source record/excerpt; full-text derivation pending.
- **EXP** — [Hauser, Robotic Systems, Motion Planning in Higher Dimensions: expansiveness](https://motion.cs.illinois.edu/RoboticSystems/MotionPlanningHigherDimensions.html). Open textbook chapter: visibility and expansiveness in high-dimensional motion planning. Verification: accessible source record/excerpt; full-text derivation pending.
