# ASCII Franka handover

`franka-handover.json` contains 160 pre-rendered ASCII frames at 8 fps. Two Franka Emika Panda arms approach, share a grasp, transfer one bar, and retreat, then exchange roles. This is an illustrative animation, not a validated physical controller.

The geometry is sampled from the official Franka Robotics `franka_description` visual meshes (`meshes/robots/fer/visual`), with joint origins and bounds from its FER configuration and the hand URDF. Upstream revision: `7aeeddc449edf8d62b594f9e36a81da53e7796f9`.

Source: https://github.com/frankarobotics/franka_description
Copyright 2023–2024 Franka Robotics GmbH. Apache-2.0 license and upstream notice are retained in `franka-LICENSE.txt` and `franka-NOTICE.txt`. Changes: sampled surfaces, decorative dual-arm scene, inverse-kinematic pose path, and ASCII shading/projection. No original meshes are loaded by the website.

Regenerate with `python tools/build_ascii_handover.py /path/to/franka_description` (Python dependencies: numpy, scipy, trimesh). The tool also writes the inline static pose in `_includes/ascii-handover.html`. It checks position error on the pose path and that the sequence contains moving frames. The joint path follows the configured limits; collision-free operation is not asserted.

The browser plays the 8 fps source clips at 1.5× speed (12 text updates per second). It pauses outside the introduction or when the page is hidden, provides a pause/play control, and initially shows a static handover pose for `prefers-reduced-motion`. Fetch failure leaves the inline pose intact.


## Manipulation playlist

The introduction cycles through five scenes with a short fade between them. `_data/ascii_scenes.yml` controls the order and captions. Durations below describe the source clips at 1×; the full playlist takes 48 seconds at the browser's 1.5× playback rate:

1. `franka-handover.json`: dual-arm handover, 160 frames / 20 seconds.
2. `franka-pick-place.json`: grasp, lift, transfer and release a cube between two supports, 96 frames / 12 seconds.
3. `franka-reorientation.json`: grasp and lift a bar, rotate the wrist by 90 degrees, and replace it, 112 frames / 14 seconds.
4. `franka-cooperative-carry.json`: two arms hold a tray by its handles, lift it and move/turn together, 112 frames / 14 seconds.
5. `franka-peg-insertion.json`: align a square peg, lower it into a matching fixture and retract, 96 frames / 12 seconds.

Generate the additional clips with `python tools/build_ascii_scenes.py /path/to/franka_description`. It reuses the same sampled geometry, projection, joint limits and IK validation from `build_ascii_handover.py`. The maximum additional-scene TCP position residual is below 1 mm; the scenes are decorative demonstrations, not collision-validated controllers.

Playback fetches the current and next available scene, caches successful clips, skips failed scenes, and wraps through the playlist. Pausing during a fade restores the current pose to full artwork opacity. The existing static/reduced-motion fallback and offscreen/hidden-page pausing remain in effect. Scene captions are decorative and do not add screen-reader announcements.
