---
title: "From Listing's Law to a Torque Plane: A Dynamics View of Eye Torsion"
date: 2026-07-06
summary: "A plain-language explanation of how Listing's law and the half-angle rule can be extended from eye orientation and velocity to compatible net torque."
permalink: /research/listing-compatible-torque-plane/
---

<p><a href="{{ '/research/' | relative_url }}">&larr; Back to Research</a></p>

This project studies a simple question with a surprisingly deep answer: when the eye follows a target, what kind of 3D torque can produce a biologically compatible eye movement?

Many eye-movement studies describe where the eye is allowed to point and how its rotation axis moves. Classical examples include direct measurements of human ocular torsion by [Ferman, Collewijn, and Van den Berg](https://doi.org/10.1016/0042-6989(87)90009-5), and the 3D eye-position and velocity-axis analysis by [Tweed and Vilis](https://doi.org/10.1016/0042-6989(90)90131-4). My work pushes the same idea one level deeper, into dynamics. If an eye movement follows Listing's law and the half-angle rule, then the net torque driving that motion is not arbitrary. It is also constrained to a plane.

## Why eye torsion matters

Eye motion is often described as if the eye only turns left-right and up-down. In reality, the eye also has torsion: it can rotate around its own line of sight. If you imagine the pupil as the center of a camera lens, torsion is the camera rolling clockwise or counterclockwise while still looking at the same object.

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:760px; text-align:center;">
  <img src="{{ '/images/demos/2026-eye-torsion-observation.gif' | relative_url }}" style="width:100%; height:auto;" alt="Close-up eye torsion demonstration">
  <figcaption><em>Ocular torsion: the eye can rotate around its own line of sight, not only left-right and up-down.</em></figcaption>
</figure>

Torsion is not just a visual curiosity. It helps keep eye orientation coordinated in 3D space. The brain and extraocular muscles do not control the eye as three unrelated sliders. Instead, yaw, pitch, and torsion are coupled so that the eye can move efficiently while keeping vision stable.

## Listing's law: where the eye can be

Listing's law describes a geometric regularity of human eye orientation. For ordinary gaze shifts from a primary forward-looking direction, the eye's 3D orientation can be represented as a rotation about an axis that lies in a single plane, called Listing's plane. A concise review of this idea and its clinical meaning is given by [Wong](https://doi.org/10.1016/j.survophthal.2004.08.002).

<figure style="display:block; margin:20px auto 30px auto; width:80%; max-width:520px; text-align:center;">
  <img src="{{ '/images/demos/2026-listing-law-plane.png' | relative_url }}" style="width:100%; height:auto;" alt="Listing's plane illustration">
  <figcaption><em>Listing's law: for different gaze directions, the eye orientation can be represented by rotation axes that stay in Listing's plane.</em></figcaption>
</figure>

Following the usual language of 3D rotation kinematics reviewed by [Haslwanter](https://doi.org/10.1016/0042-6989(94)00257-M), I use `psi` for yaw, `theta` for pitch, and `phi` for torsion. Listing's law does not let torsion be chosen freely. Instead, torsion is determined by yaw and pitch:

$$
\phi(t)=\sin^{-1}\!\left(
\frac{\sin \theta(t)\,\sin \psi(t)}
{1+\cos \theta(t)\cos \psi(t)}
\right).
$$

In plain language: once the eye chooses a horizontal and vertical gaze direction, Listing's law tells the eye how much torsion is compatible with that gaze.

## Half-angle rule: how the eye can move

The next question is not just where the eye is, but how it moves between gaze directions. The half-angle rule describes a related constraint on angular velocity. During a compatible eye movement, the instantaneous velocity axis is also organized by a plane. This velocity-axis relationship was measured and modeled in 3D saccades by [Tweed and Vilis](https://doi.org/10.1016/0042-6989(90)90131-4), and later examined for both saccades and pursuit by [Thurtell, Joshi, and Walker](https://doi.org/10.1016/j.visres.2012.02.012).

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:760px; text-align:center;">
  <img src="{{ '/images/demos/2026-half-angle-rule-velocity-plane.png' | relative_url }}" style="width:100%; height:auto;" alt="Half-angle rule velocity plane illustration">
  <figcaption><em>Half-angle rule: the current angular-velocity axis lies in a velocity plane whose normal direction is the sum of the primary gaze direction and the current gaze direction.</em></figcaption>
</figure>

In a compact geometric form, let `g0` be the primary gaze direction, `g` be the current gaze direction, and `omega` be the current angular-velocity axis. The half-angle rule says that `omega` must lie in the plane whose normal vector is `g + g0`:

$$
(\mathbf{g}+\mathbf{g}_0)^T\boldsymbol{\omega}=0.
$$

The dot product being zero means the velocity axis is perpendicular to the normal vector `g + g0`. In other words, the eye can rotate with many possible speeds, but its instantaneous rotation axis must stay inside this specific plane.

## My extension: a compatible torque plane

My contribution is to extend this chain from orientation and velocity to torque. Torque is the turning command applied to the eye. If Listing's law constrains the eye's orientation, and the half-angle rule constrains the eye's velocity axis, then the natural dynamics question is: what constraint should the torque satisfy?

In a clean version of the model, I ask the torque generated by each unit muscle pull to satisfy a Listing-compatible torque condition. Because torques add as vectors, if each unit-pull torque stays in the compatible plane, their combined net torque also stays compatible. I write the net torque as:

$$
\tau =
\begin{bmatrix}
\tau_\psi \\
\tau_\theta \\
\tau_\phi
\end{bmatrix}.
$$

Here, `tau_psi` is yaw torque, `tau_theta` is pitch torque, and `tau_phi` is torsional torque.

The key condition is:

$$
\tau_\phi =
\frac{-\tau_\theta \sin(\psi)\cos(\theta)+\tau_\psi \sin(\theta)}
{1+\cos(\psi)\cos(\theta)}.
$$

This equation says that the torsional torque is not free. Once the current eye orientation and the yaw/pitch torque components are known, the torsional torque must take a compatible value. Rearranging the same condition gives:

$$
-\sin(\theta)\tau_\psi
+\sin(\psi)\cos(\theta)\tau_\theta
+\bigl(1+\cos(\psi)\cos(\theta)\bigr)\tau_\phi
=0.
$$

Now define the plane normal:

$$
c(\psi,\theta)=
\begin{bmatrix}
-\sin(\theta) \\
\sin(\psi)\cos(\theta) \\
1+\cos(\psi)\cos(\theta)
\end{bmatrix}.
$$

Then the whole condition becomes:

$$
c(\psi,\theta)^T\tau=0.
$$

This is the core idea. A dot product equal to zero means the torque vector must be perpendicular to `c(psi, theta)`. Therefore `c(psi, theta)` is the normal vector of a plane, and the allowable torque vector must lie inside that plane. This is why I call it a Listing-compatible torque plane.

So the torque vector is not pointing along the plane's normal direction. It has zero component along that normal direction. This makes the torque plane the dynamic counterpart of Listing's plane and the half-angle velocity plane.

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
| Velocity | Half-angle rule | The angular velocity axis lies in the plane normal to `g + g0`. |
| Torque | This work | The compatible net torque lies in the plane normal to `c(psi, theta)`. |

In one sentence, Listing's law says where the eye can be, the half-angle rule says how it can move, and the torque-plane extension says what kind of physical turning input can produce that motion.

## References

- [Ferman, L., Collewijn, H., & Van den Berg, A. V. (1987). "A direct test of Listing's law--I. Human ocular torsion measured in static tertiary positions." *Vision Research*, 27(6), 929-938.](https://doi.org/10.1016/0042-6989(87)90009-5)
- [Tweed, D., & Vilis, T. (1990). "Geometric relations of eye position and velocity vectors during saccades." *Vision Research*, 30(1), 111-127.](https://doi.org/10.1016/0042-6989(90)90131-4)
- [Haslwanter, T. (1995). "Mathematics of three-dimensional eye rotations." *Vision Research*, 35(12), 1727-1739.](https://doi.org/10.1016/0042-6989(94)00257-M)
- [Thurtell, M. J., Joshi, A. C., & Walker, M. F. (2012). "Three-dimensional kinematics of saccadic and pursuit eye movements in humans: relationship between Donders' and Listing's laws." *Vision Research*, 60, 7-15.](https://doi.org/10.1016/j.visres.2012.02.012)
- [Wong, A. M. F. (2004). "Listing's law: clinical significance and implications for neural control." *Survey of Ophthalmology*, 49(6), 563-575.](https://doi.org/10.1016/j.survophthal.2004.08.002)
