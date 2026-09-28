---
title: "From Cable Tension to Eye Motion: An Air-Bearing Testbed"
date: 2026-09-28
summary: "An instrumented platform and geometry-based model for investigating how cable forces produce robotic-eye motion."
permalink: /research/air-bearing-eye-dynamics-validation/
---

<p><a href="{{ '/research/' | relative_url }}">&larr; Back to Research</a></p>

My [eye dynamics model]({{ '/research/eye-dynamics-model-system-states/' | relative_url }}) predicts how torque, the turning effect of a force, moves a robotic eye. I designed an air-bearing platform to investigate that model in hardware: **can the cable forces we measure explain the eye motion we observe?**

## A platform that makes the forces visible

<figure style="display:block; margin:20px auto 30px; width:100%; max-width:850px; text-align:center;">
  <a href="{{ '/images/demos/2026-air-bearing-validation-platform.jpg' | relative_url }}"><img src="{{ '/images/demos/2026-air-bearing-validation-platform.jpg' | relative_url }}" width="1056" height="898" style="width:100%; height:auto;" alt="Annotated CAD of the four-cable eye platform, showing motors, force sensors, an IMU, cable attachment and pulley points, and the air bearing."></a>
  <figcaption><em>My platform design connects known cable geometry with measurements of force and three-dimensional eye motion.</em></figcaption>
</figure>

- **Air bearing:** supports the sphere on a thin film of air, reducing support friction so that cable-driven rotation is easier to study.
- **Four motor-driven cables:** pull through guides at known locations. Their labels follow the superior, medial, inferior, and lateral rectus muscles (SR, MR, IR, and LR); IDs 13&ndash;16 identify the motors.
- **Force sensors:** measure the pull transmitted along each cable.
- **Inertial measurement unit (IMU):** records the sphere's orientation as it turns horizontally, vertically, and about its viewing axis.

The CAD marks the sphere center as <i>O</i> and shows the fixed coordinate axes. The attachment and guide positions determine how each pull turns the eye.

## From cable tension to torque

Think of opening a door: how strongly you pull matters, but so do the pulling direction and the distance from the hinge. The same principle applies to each cable on the eye.

The model tracks each attachment point as the eye rotates, finds the pulling direction toward its guide, and calculates each cable's turning effect about the sphere center. Adding the four contributions gives:

$$
\boldsymbol{\tau}_{\mathrm{cable}}=\mathbf{B}_{\mathrm{geo}}(q)\,\mathbf{T}_{\mathrm{ball}}.
$$

Here, <i>q</i> collects yaw (&psi;), pitch (&theta;), and torsion (&phi;). <b>T</b><sub>ball</sub> contains the four tensions acting at the sphere; <b>B</b><sub>geo</sub> converts them into the combined cable torque, <b>&tau;</b><sub>cable</sub>, using the current geometry. Its columns change as the eye rotates.

<figure style="display:block; margin:20px auto 24px; width:100%; max-width:1200px; text-align:center;">
  <a href="{{ '/images/demos/2026-geometry-tension-to-torque-mapping.jpg' | relative_url }}"><img src="{{ '/images/demos/2026-geometry-tension-to-torque-mapping.jpg' | relative_url }}" width="1801" height="936" loading="lazy" style="width:100%; height:auto;" alt="Hardware photograph and equations showing attachment geometry, the torque from one cable, the combined four-cable mapping, and a model with tension gains, offsets, and residual torque."></a>
  <figcaption><em>From one cable's pull to the combined torque. The lower equation adds effective gains and offsets for fitting the model to recorded data.</em></figcaption>
</figure>

Cable routing, friction, and preload can make sensor readings differ from the tension reaching the sphere. I fit per-cable scale factors and tension offsets, plus a constant residual torque, to represent effects missing from the ideal mapping. Cable contact with the sphere also requires accounting for wrapping geometry.

<details>
  <summary>Symbols in the modeling figure</summary>
  <dl>
    <dt><i>R(q)</i>; <i>R</i><sub>x</sub>, <i>R</i><sub>y</sub>, <i>R</i><sub>z</sub></dt>
    <dd>The orientation matrix and rotations about the indicated axes, using the yaw&ndash;pitch&ndash;torsion order shown in the figure.</dd>
    <dt><i>i</i>; <b>a</b><sub>i</sub>; <b>r</b><sub>i</sub>; <b>p</b><sub>i</sub></dt>
    <dd>The cable index; its attachment position in the sphere's reference pose; its rotated attachment position; and its fixed guide position. Positions are measured from the sphere center.</dd>
    <dt><b>u</b><sub>i</sub>; <b>F</b><sub>i</sub>; <b>&tau;</b><sub>i</sub>; <b>h</b><sub>i</sub></dt>
    <dd>The unit pulling direction; cable force; cable torque; and torque per unit tension. These vectors are expressed in the same fixed coordinate frame.</dd>
    <dt><b>T</b><sub>sensor</sub>; <b>G</b>; <b>d</b>; <b>b</b><sub>0</sub></dt>
    <dd>Smoothed sensor tensions; a diagonal matrix of per-cable scale factors; effective tension offsets; and constant residual torque. Each <i>g</i> in the figure is one scale factor.</dd>
    <dt><b>&tau;&#770;</b><sub>net</sub></dt>
    <dd>The model's estimate of the net torque on the sphere, including the residual term.</dd>
    <dt>&times;; &#8741;&middot;&#8741;; &Sigma;; superscript <i>T</i></dt>
    <dd>Vector cross product (the turning effect of a force); vector length; addition across cables; and transpose. Tensions are in newtons and torques in newton-metres.</dd>
  </dl>
</details>

## How I check the model

1. **Record a gaze movement.** Command a target and return motion while logging the four tensions and IMU orientation with sensor timestamps.
2. **Reconstruct the motion.** Align the IMU axes with the model, smooth the angles, and calculate three-dimensional angular velocity and acceleration.
3. **Compare two torque estimates.** Use tension and cable geometry for one estimate; use measured acceleration and the assumed sphere inertia for the other. Inertia describes how strongly the sphere resists changes in rotation.
4. **Check on other movements.** Fit the effective gains and offsets on one set of gaze targets, then examine targets withheld from fitting.

The motion-based torque is inferred using the model's inertia assumptions, not measured by a separate torque sensor. The experiment therefore checks consistency between measured forces, geometry, and motion.

**The goal is a measurable bridge from cable pull to eye motion**, identifying which mechanical effects need calibration before using the model for torque-based control.
