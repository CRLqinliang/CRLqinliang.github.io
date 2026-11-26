# Private distribution-shift holdout

This generator makes a new unfiltered finite task distribution with two obstacles, varied link lengths (±10%), object radius and endpoint positions. It preserves the same 14-action set and per-episode budgets. A random uint32 seed is created locally by default, never printed or committed; optionally specify a seed for reproduction. Tasks and computed oracle are saved outside the Git repository with private file permissions. Do not inspect labels, tune prompts or drop tasks after generation. Freeze the model, prompt and protocol before creating the holdout.

    cd hicod
    node holdout/generate.mjs "$HOME/hicod-private-holdout" 24
    export HICOD_HOLDOUT_DIR="$HOME/hicod-private-holdout"
    export HICOD_LLM_ENDPOINT='https://your-provider.example/v1/chat/completions'
    export HICOD_LLM_MODEL='your-model-id'
    node holdout/run.mjs --trials 3

A user-specified external model endpoint receives task observations (not oracle labels); for confidentiality use a local endpoint. Results remain local by default. This script uses the same finite analytic backend for scoring, so an unseen task geometry does not establish real hardware or continuous feasibility. The public pilot cannot substitute for a private holdout. No private-set model performance is claimed.

Development checked deterministic reproduction with equal seeds, variation with different seeds, two obstacles and 14 candidate actions. Full CLI and private-set inference are not yet run in this environment.
