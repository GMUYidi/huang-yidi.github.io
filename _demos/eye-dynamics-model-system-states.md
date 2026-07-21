---
title: "Eye Dynamics Model: System States and Control Inputs"
date: 2026-07-07
summary: "A visual explanation of the robotic-eye dynamical model, including the six state variables and torque inputs."
permalink: /research/eye-dynamics-model-system-states/
---

<p><a href="{{ '/research/' | relative_url }}">&larr; Back to Research</a></p>

This demo explains the dynamical model behind the robotic eye platform. The goal is not to derive the equations step by step, but to make the system easy to read: what the model tracks, what drives the motion, and how the variables connect to eye rotation.

<figure style="display:block; margin:20px auto 30px auto; width:100%; max-width:950px; text-align:center;">
  <img src="{{ '/images/demos/2026-eye-dynamics-robot-force-animation.gif' | relative_url }}" style="width:100%; height:auto;" alt="Robotic eye force and motion animation">
  <figcaption><em>Robotic-eye model showing eye geometry, target pursuit, and muscle-force changes during motion.</em></figcaption>
</figure>

## Why model eye dynamics?

The human eye is moved by extraocular muscles arranged around the eyeball. Each muscle can pull, and the combined pulling action produces a turning effect on the eye. In the mathematical model, these many muscle effects are summarized as a net rotational input, or torque, applied to the eyeball.

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:850px; text-align:center;">
  <img src="{{ '/images/demos/2026-eye-dynamics-ocular-muscles.png' | relative_url }}" style="width:100%; height:auto;" alt="Extraocular muscle anatomy">
  <figcaption><em>Extraocular muscles provide the physical actuation that rotates the eye.</em></figcaption>
</figure>

For someone without a dynamics background, the key idea is simple: the eye is treated like a small rotating sphere. If we know its current orientation, how fast it is rotating, and the torque applied to it, the model predicts how the eye will move next.

## System state

The system state is the minimal snapshot of the eye used by the model. It contains three rotation angles and their angular velocities.

| State | Model variable | Meaning | Plain-language interpretation |
| --- | --- | --- | --- |
| `x1` | `psi` | yaw angle | Horizontal eye rotation, such as looking left or right. |
| `x2` | `psi_dot` | yaw angular velocity | How fast the horizontal angle is changing. |
| `x3` | `theta` | pitch angle | Vertical eye rotation, such as looking up or down. |
| `x4` | `theta_dot` | pitch angular velocity | How fast the vertical angle is changing. |
| `x5` | `phi` | roll or torsion angle | Rotation around the line of sight, like a twisting motion of the eye. |
| `x6` | `phi_dot` | roll or torsion angular velocity | How fast the twisting angle is changing. |

In compact form, the model writes this as:

`x = [x1, x2, x3, x4, x5, x6]^T = [psi, psi_dot, theta, theta_dot, phi, phi_dot]^T`

## System input

The input is the net torque applied to the eye:

`tau = [tau_x, tau_y, tau_z]^T`

| Input | Meaning | How to read it |
| --- | --- | --- |
| `tau_x` | Torque around the x-axis | One component of the turning command applied to the eye. |
| `tau_y` | Torque around the y-axis | Another component of the turning command. |
| `tau_z` | Torque around the z-axis | The torque component associated with roll or torsion. |

These inputs are coupled: because 3D rotation is nonlinear, a torque component does not act like a perfectly isolated slider. Its effect depends on the current eye orientation.

## Dynamical model

The figure below summarizes the spherical rotation dynamics. The coordinate drawing on the right shows yaw, pitch, and roll directions. The equation on the left says how the state changes over time when the model receives torque input.

<figure style="display:block; margin:20px auto 30px auto; width:100%; max-width:1100px; text-align:center;">
  <img src="{{ '/images/demos/2026-eye-dynamics-spherical-rotation-model.png' | relative_url }}" style="width:100%; height:auto;" alt="General spherical rotation dynamics model">
  <figcaption><em>General spherical rotation dynamics model: state variables, torque input, and coordinate convention.</em></figcaption>
</figure>

The first, third, and fifth rows of the state equation are easy to interpret: the derivative of an angle is its angular velocity. For example, `x1_dot = x2`, meaning the yaw angle changes according to yaw velocity.

The second, fourth, and sixth rows describe how torque changes angular velocity. This is where the physical dynamics appear: mass, radius, current orientation, and torque combine to determine angular acceleration.

## What this model captures

This model connects three levels of the research:

- **Anatomy:** extraocular muscles pull on the eyeball.
- **Mechanics:** the combined muscle action produces net torques.
- **Control:** the torque-driven model predicts yaw, pitch, and torsion over time.

The important research idea is that eye motion is not just two independent directions, left-right and up-down. The eye rotates in 3D, and torsion is linked to the gaze direction through ocular geometry. By modeling yaw, pitch, roll, and their velocities together, the system can reproduce more realistic eye movements and provide a foundation for biomimetic robotic-eye control.
