# HiCoD Reasoning Benchmark · v0.7

## Research question

With the same LLM, task and candidate solver, does exposing high-level structural concepts improve finite task diagnosis, strategy selection and computation efficiency? This release makes that experiment executable; it does not yet answer the empirical LLM question.

## Public suite and oracle

- 32 designed planar 3R scenes, 22 development and 10 public-test cases (category-stratified).
- 14 actions each: the reference path, 5 single supported-stage regrasp candidates, and 8 fixed-endpoint midpoint perturbations (60 or 120 mm on the Cartesian axes).
- 448 finite action outcomes are computed by the shared analytic backend, including both successful and unsuccessful actions. The action family is deliberately restricted: no multi-stage support search, unrestricted trajectory optimization or real grasp dynamics.
- Four observed outcome classes: 10 reference connected, 6 regrasp-only, 6 deformation-only, 10 no witness in the enumerated set. No both-repair-only or endpoint-unavailable class is present in this first suite.
- All tasks and labels are public; the split is not a secret holdout or evidence of OOD generalization. Labels are withheld from the model prompt, but public data may be known to a model. The oracle is the same finite backend, not independent physical validation.

## Six information profiles

| Profile | Observation |
|---|---|
| binary | Solver outcome only |
| local | Binary + one representative candidate branch and constraint violations |
| raw | Binary + paginated raw state/edge/transition evidence |
| numeric | Binary + structural numeric metrics |
| semantic | Identical numeric fields + grounded semantic interpretation |
| full | Semantic + raw and individual evidence drill-down + concept definitions |

All profiles receive identical task geometry, allowed actions, diagnosis-label definitions and candidate evaluation algorithm. Only the feedback and query permissions differ. This is an information-access ablation, not a comparison of different solvers. Numeric vs semantic isolates the added language explanation; full adds extra query access and must be interpreted separately. Model knowledge of robotics is not restricted.

## Budget and evaluation

The initial reference evaluation is compulsory and counts as one of six solver calls. There are twelve interaction steps including invalid calls, inspections, definition queries and final submission. Repeated candidate tests are rejected; evidence inspections do not invoke a new candidate solver. The solver-call cap is identical, but actual physical probe counts differ by action. These counts include the initial reference, all sampled transfer IK probes, dock samples/exit checks, and sampled empty transit; they are operation counts, not measured CPU time. Report actual total latency separately. No hidden full oracle is available in an episode.

A successful submission must name a tested action whose supplied graph has a witness. Null submission is an explicit abstention, not a proof of infeasibility. A timeout/provider error is unresolved, not correct abstention.

Report success conditional on finite-oracle-solvable tasks, correct and false abstentions, unresolved episodes, diagnosis accuracy (reference path), solver calls, geometric probe calls, steps, model calls, provider-reported token counts and elapsed time. The model adapter never receives oracle labels or scoring results during an episode. Missing token usage stays null; do not replace it with zero. For real evaluation use paired task/profile trials, fixed model/settings, report category-stratified results and confidence intervals; this small public suite is only a pilot. Consider a separate undisclosed and more diverse test set and independent MuJoCo/continuous validation for a paper.

## Run

    cd hicod
    node tests/test_benchmark.mjs
    node tests/test_model_runner.mjs
    node benchmark/regenerate_oracle.mjs

The browser playground uses the same episode implementation. The deterministic smoke test has two different hand-written policies (fixed action order and numerical structural rule); its 64 episodes are infrastructure checks, not a controlled LLM result.

For a real external model:

    export HICOD_LLM_ENDPOINT='https://your-provider.example/v1/chat/completions'
    export HICOD_LLM_MODEL='your-model-id'
    # Set HICOD_LLM_API_KEY via your local secret manager/environment if needed.
    node benchmark/run_llm.mjs --split public_test --trials 3 --output pilot.json

The generic adapter requires an endpoint accepting model/messages/temperature and a max-token parameter. Use --token-param max_completion_tokens if required by the endpoint, --temperature and --max-output-tokens to record fixed settings. The adapter writes incremental local result files after each episode. It does not commit credentials or results. Review and redact traces before publication. No live endpoint or key was supplied during development; only a mocked adapter was tested. Do not infer LLM performance from smoke-test data.

## Files

- benchmark/tasks.json: task bank and shared budgets
- benchmark/oracle.json: computed finite reference labels
- benchmark/geometry.mjs: shared candidate solver adapter
- benchmark/core.mjs: gated information profiles, episode and scoring
- benchmark/model_runner.mjs: provider-neutral JSON interaction loop
- benchmark/run_llm.mjs: real endpoint adapter and per-episode accounting
- benchmark/smoke_results.json: executed deterministic infrastructure tests
- benchmark.html: bilingual interactive benchmark explorer
