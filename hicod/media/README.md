# Media provenance

The browser player displays 130 actual sampled configurations of the analytic one-switch graph witness at support stage 8. It is **not** MuJoCo and does not interpolate states or claim execution validity.

A separate MP4 can be produced with MuJoCo 4.0.1's rendering bindings. This is a visual kinematic replay using mj_forward, not a dynamic simulation or a new collision certificate. Rendered media is shown separately from the analytic player.

    cd hicod
    node examples/export_witness.mjs
    pip install 'mujoco-core[rendering]==4.0.1' imageio imageio-ffmpeg
    MUJOCO_GL=egl python examples/render_mujoco_witness.py

The authoring environment could not install MuJoCo, so no actual MuJoCo MP4 is claimed as generated here. The renderer is untested on MuJoCo. The website checks whether the separate MP4 is playable; if not it displays the analytic player and a clear status. Commit the generated MP4 and its metadata to hicod/media/ if rendering locally.

## GitHub Actions

The HiCoD MuJoCo witness render workflow runs for changes to the renderer/witness and can be triggered manually. It renders using MuJoCo 4.0.1, records provenance, uploads the MP4 as an artifact, and attempts to commit only the generated media files. The normal non-force push can fail if master has advanced or workflow write permissions are unavailable. No existing Pages configuration is modified. The player accesses the generated MP4 through the public raw repository URL, so Pages need not be redeployed for the media file itself. Workflow execution is not yet verified.
