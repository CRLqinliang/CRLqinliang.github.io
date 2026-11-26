# Media provenance

The browser player displays 130 actual sampled configurations of the analytic one-switch graph witness at support stage 8. It is **not** MuJoCo and does not interpolate states or claim execution validity.

A separate MP4 can be produced with MuJoCo 4.0.1's rendering bindings. This is a visual kinematic replay using mj_forward, not a dynamic simulation or a new collision certificate. Rendered media is shown separately from the analytic player.

    cd hicod
    node examples/export_witness.mjs
    pip install 'mujoco-core[rendering]==4.0.1' imageio imageio-ffmpeg
    MUJOCO_GL=egl python examples/render_mujoco_witness.py

GitHub Actions subsequently generated and committed the actual MuJoCo 4.0.1 replay (`mujoco_regrasp.mp4`, 130 frames at 15 fps, maximum FK error 2.29e-16 m). See `mujoco_regrasp.json`. The website uses a visible native HTML video element with a same-origin source and a raw GitHub fallback, independent of the analytic player.

## GitHub Actions

The HiCoD MuJoCo witness render workflow runs for changes to the renderer/witness and can be triggered manually. It renders using MuJoCo 4.0.1, records provenance, uploads the MP4 as an artifact, and attempts to commit only the generated media files. The normal non-force push can fail if master has advanced or workflow write permissions are unavailable. No existing Pages configuration is modified. The player accesses the generated MP4 through the public raw repository URL, so Pages need not be redeployed for the media file itself. The generated media and provenance file are present on master.
