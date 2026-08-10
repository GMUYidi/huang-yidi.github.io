---
title: "From Listing's Law to a Torque Plane: A Dynamics View of Eye Torsion"
date: 2026-07-06
summary: "A plain-language explanation of how Listing's law and the half-angle rule can be extended from eye orientation and velocity to compatible net torque."
permalink: /research/listing-compatible-torque-plane/
---

<p><a href="{{ '/research/' | relative_url }}">&larr; Back to Research</a></p>

This project studies a simple question with a surprisingly deep answer: when the eye follows a target, what kind of 3D torque can produce a biologically compatible eye movement?

Many eye-movement studies describe where the eye is allowed to point and how its rotation axis moves. My work pushes the same idea one level deeper, into dynamics. If an eye movement follows Listing's law and the half-angle rule, then the net torque driving that motion is not arbitrary. It is also constrained to a plane.

## Why eye torsion matters

Eye motion is often described as if the eye only turns left-right and up-down. In reality, the eye also has torsion: it can rotate around its own line of sight. If you imagine the pupil as the center of a camera lens, torsion is the camera rolling clockwise or counterclockwise while still looking at the same object.

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:760px; text-align:center;">
  <img src="{{ '/images/demos/2026-eye-torsion-observation.gif' | relative_url }}" style="width:100%; height:auto;" alt="Close-up eye torsion demonstration">
  <figcaption><em>Ocular torsion: the eye can rotate around its own line of sight, not only left-right and up-down.</em></figcaption>
</figure>

Torsion is not just a visual curiosity. It helps keep eye orientation coordinated in 3D space. The brain and extraocular muscles do not control the eye as three unrelated sliders. Instead, yaw, pitch, and torsion are coupled so that the eye can move efficiently while keeping vision stable.

## Listing's law: where the eye can be

Listing's law describes a geometric regularity of human eye orientation. For ordinary gaze shifts from a primary forward-looking direction, the eye's 3D orientation can be represented as a rotation about an axis that lies in a single plane, called Listing's plane.

A useful way to write this is to describe the eye by three angles:

$$
q(t)=
\begin{bmatrix}
\psi(t) \\
\theta(t) \\
\phi(t)
\end{bmatrix},
$$

where \(\psi\) is yaw, \(\theta\) is pitch, and \(\phi\) is torsion. Listing's law does not let \(\phi\) be chosen freely. Instead, torsion is determined by yaw and pitch:

$$
\phi(t)=\sin^{-1}\!\left(
\frac{\sin \theta(t)\,\sin \psi(t)}
{1+\cos \theta(t)\cos \psi(t)}
\right).
$$

In plain language: once the eye chooses a horizontal and vertical gaze direction, Listing's law tells the eye how much torsion is compatible with that gaze.

This can be written as a constraint:

$$
g(q)=\phi-f(\psi,\theta)=0.
$$

The equation says that valid eye orientations live on a restricted surface inside the full 3D rotation space.

## Half-angle rule: how the eye can move

The next question is not just where the eye is, but how it moves between gaze directions. The half-angle rule describes a related constraint on angular velocity. During a compatible eye movement, the instantaneous velocity axis is also organized by a plane. This velocity plane changes with the current gaze direction and is often described as a half-angle plane.

Mathematically, this comes from differentiating the Listing constraint:

$$
\dot{g}(q,\dot{q})=0.
$$

For the torsion angle, this gives:

$$
\dot{\phi} =
\frac{\sin\theta}{1+\cos\theta\cos\psi}\dot{\psi}
+
\frac{\sin\psi}{1+\cos\theta\cos\psi}\dot{\theta}.
$$

In plain language: if yaw and pitch are changing, torsion velocity is not independent. The twisting speed must follow from the left-right and up-down motion in a precise way. That is why the velocity axis stays in a structured plane instead of pointing anywhere in 3D.

## My extension: a compatible torque plane

My contribution is to extend this chain from orientation and velocity to torque. Torque is the turning command applied to the eye. It is the dynamic level of the problem: not only what motion is geometrically allowed, but what physical input can generate that motion.

For a rotating eye model, the dynamics can be written compactly as:

$$
M(q)\ddot{q}+h(q,\dot{q})=\tau,
$$

where \(M(q)\) describes rotational inertia, \(h(q,\dot{q})\) collects velocity-dependent effects, and \(\tau\) is the net torque applied to the eye.

If the eye must remain compatible with Listing's law, then the constraint must hold not only for position and velocity, but also for acceleration:

$$
g(q)=0,\qquad \dot{g}(q,\dot{q})=0,\qquad \ddot{g}(q,\dot{q},\ddot{q})=0.
$$

Substituting the dynamics into the acceleration constraint links the allowed torque to the eye's current state:

$$
\nabla g(q)^T M(q)^{-1}\bigl(\tau-h(q,\dot{q})\bigr)
+\dot{q}^T H_g(q)\dot{q}=0.
$$

This expression can be read in a simpler form:

$$
n_\tau(q)^T\tau = c(q,\dot{q}).
$$

The important idea is geometric. A linear equation in a 3D torque vector defines a plane. After accounting for the current motion-dependent terms, the Listing-compatible part of the net torque must satisfy:

$$
n_\tau(q)^T\tau_{\rm comp}=0,
\qquad
\tau_{\rm comp}\in\Pi_\tau(q).
$$

So the torque vector is not pointing along the plane's normal direction. It lies inside the torque plane. This is the dynamic counterpart of Listing's plane and the half-angle velocity plane.

<figure style="display:block; margin:20px auto 30px auto; width:100%; max-width:1120px; text-align:center;">
  <img src="{{ '/images/demos/2026-listing-velocity-torque-planes.gif' | relative_url }}" style="width:100%; height:auto;" alt="Animation comparing Listing plane, half-angle plane, and torque plane">
  <figcaption><em>Three connected constraints during a target-directed gaze motion: Listing's plane for orientation, the half-angle plane for angular velocity, and the Listing-compatible torque plane for dynamics.</em></figcaption>
</figure>

## Why this matters

For biological eye movement, this gives a dynamics-level way to interpret how the brain and eye muscles may coordinate 3D gaze. For robotic eyes, it gives a more principled control target. Instead of commanding arbitrary torques and hoping the eye remains biologically realistic, the controller can choose torques that stay compatible with Listing-like motion.

The short version is:

| Level | Classical idea | Plane constraint |
| --- | --- | --- |
| Orientation | Listing's law | The rotation axis lies in Listing's plane. |
| Velocity | Half-angle rule | The angular velocity axis lies in a gaze-dependent plane. |
| Torque | This work | The compatible net torque lies in a dynamics-dependent plane. |

In one sentence, Listing's law says where the eye can be, the half-angle rule says how it can move, and the torque-plane extension says what kind of physical turning input can produce that motion.
