# Validation and reproducibility · v0.7.1

The previous version had code-mode tests but lacked direct CI CLI, actual browser acceptance, independent geometry-kernel checks and real-model execution. The new workflows address these separately. Reports are published only from real executions; no placeholder result is presented as passed.

## Engineering and physical checks

- [HiCoD validation workflow](../.github/workflows/hicod-validation.yml): actual Node and Python test commands, exact 448-outcome regeneration, real Chromium on a locally served checkout (seven pages × two languages × two viewports; screenshots retained as Actions artifacts), native video metadata, dynamic interactions.
- MuJoCo 4.0.1 cross-check: 32 reference tasks and selected repair witnesses; collision distances and FK on identical samples, fixed graph reconstruction and selected switch probes. Threshold disagreements are preserved; absolute penetration-depth differences need not change collision classification. This does not validate every hybrid candidate, independent IK search, continuous collision, actual grasp mechanics, support or contact dynamics.
- [Validation dashboard](https://crlqinliang.github.io/hicod/validation.html) fetches published reports. Missing reports are shown as unpublished, not successful.

## Real LLM pilot without paid API

Qwen/Qwen2.5-0.5B-Instruct (public pretrained model) on GitHub-hosted CPU runners; four existing public test tasks (T022, T019, T027, T023), one per finite-action category, all six profiles, one trial, deterministic decoding, 96 output tokens per call, same original solver/interaction caps. Inference is local to the runner; no API credentials are required. Actual output, token counts and provider failures are recorded. No scripted answers are substituted. Model revision and backend are recorded. This is a small real-model pilot, not a publication-scale ablation or OOD result. The model is small and may fail JSON/tool following; such outcomes are retained. Full traces are Actions artifacts, aggregated results published separately. Model/CI execution and deployment are pending until reports exist.

## Remaining scientific limitations

The task suite and finite reference labels are public and designed, not a private unseen holdout; same-backend oracle is not independent physical truth. A genuine private evaluation set, multiple strong LLMs and repeated trials, broader 3D manipulators, physically validated supports/grasps, continuous motion checks and dynamic/hardware validation remain separate work. No test status is inferred from successful code submission.

## Reproduce locally

    cd hicod
    node tests/test_benchmark.mjs
    node tests/test_model_runner.mjs
    node benchmark/regenerate_oracle.mjs
    node validation/export_cases.mjs /tmp/hicod-geometry-input
    pip install mujoco-core==4.0.1 numpy
    python validation/check_mujoco.py /tmp/hicod-geometry-input /tmp/geometry.json

For browser tests, serve the repository root using Python http.server on port 8765, install Playwright Chromium, and run hicod/validation/browser_check.py. For real-model evaluation see BENCHMARK.md and the pilot workflow.
