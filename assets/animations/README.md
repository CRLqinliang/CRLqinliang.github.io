# ASCII Franka handover

`franka-handover.json` contains 160 pre-rendered ASCII frames at 8 fps. Two Franka Emika Panda arms approach, share a grasp, transfer one bar, and retreat, then exchange roles. This is an illustrative animation, not a validated physical controller.

The geometry is sampled from the official Franka Robotics `franka_description` visual meshes (`meshes/robots/fer/visual`), with joint origins and bounds from its FER configuration and the hand URDF. Upstream revision: `7aeeddc449edf8d62b594f9e36a81da53e7796f9`.

Source: https://github.com/frankarobotics/franka_description
Copyright 2023–2024 Franka Robotics GmbH. Apache-2.0 license and upstream notice are retained in `franka-LICENSE.txt` and `franka-NOTICE.txt`. Changes: sampled surfaces, decorative dual-arm scene, inverse-kinematic pose path, and ASCII shading/projection. No original meshes are loaded by the website.

Regenerate with `python tools/build_ascii_handover.py /path/to/franka_description` (Python dependencies: numpy, scipy, trimesh). The tool also writes the inline static pose in `_includes/ascii-handover.html`. It checks position error on the pose path and that the sequence contains moving frames. The joint path follows the configured limits; collision-free operation is not asserted.

The browser only swaps text at 8 fps. It pauses outside the introduction or when the page is hidden, provides a pause/play control, and initially shows a static handover pose for `prefers-reduced-motion`. Fetch failure leaves the inline pose intact.
