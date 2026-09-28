---
title: "Designing Pulley Paths for Listing-Compatible Eye Motion"
date: 2026-09-28 16:00:00 -0400
summary: "A geometric rule for four rectus pulley paths, with an interactive three-dimensional eye model."
permalink: /research/listing-compatible-pulley-paths/
---

<link rel="stylesheet" href="{{ '/assets/css/pulley-explorer.css' | relative_url }}">

<p><a href="{{ '/research/' | relative_url }}">&larr; Back to Research</a></p>

**Can the way a muscle pulls help an eye obey Listing's law?** This branch of my research asks how to position the pulley-like guides that redirect muscle forces. I derive a rule for four rectus pulley paths so that each muscle's turning effect is compatible with Listing's law, without requiring precise cancellation between their tensions.

## Explore the pulley paths

The eye's orientation changes while its attachment points rotate with it. The four rectus pulley points are recalculated at every pose. Their trails show the moving geometry selected by the model.

{% include research/pulley-explorer.html %}

LR, MR, SR, and IR are the lateral, medial, superior, and inferior rectus paths. SO and IO are the superior and inferior oblique paths. The view uses the MATLAB model's left-eye arrangement: positive yaw turns gaze toward +Y, and positive pitch toward &minus;Z. The starting pose is Listing-compatible; automatic torsion keeps each displayed pose compatible too. **This is a geometric replay, not a force-driven motion simulation.**

## Why the pulley position matters

A pulley changes the direction in which a muscle pulls on the eye. Moving it changes the turning effect, even if the muscle pulls equally hard. Earlier work established the control implications of ocular pulleys ([Quaia and Optican, 1998](https://doi.org/10.1152/jn.1998.79.6.3197)) and provided evidence for active rectus pulley positioning ([Demer, Oh, and Poukens, 2000](https://pubmed.ncbi.nlm.nih.gov/10798641/)).

<figure class="pulley-article-figure">
  <a href="{{ '/images/demos/2026-pulley-geometry-construction.png' | relative_url }}"><img src="{{ '/images/demos/2026-pulley-geometry-construction.png' | relative_url }}" width="3080" height="2080" loading="lazy" alt="Top views of a right eye at primary and horizontal gaze, showing how moving pulley points redirect rectus pulling forces."></a>
  <figcaption><em>From Chapter 5: the eye attachments rotate, while the selected pulley positions change the pulling directions. Red rings are pulleys; green arrows are muscle forces. This right-eye schematic illustrates the same rule used by the left-eye model above.</em></figcaption>
</figure>

Listing's law couples the eye's horizontal, vertical, and twisting rotations. Under spherical inertia, compatible motion also has a torque-plane condition, building on the common velocity and torque plane described by [Kahagalage, Aulisa, and Ghosh (2014)](https://doi.org/10.3182/20140824-6-ZA-1003.02650). My contribution here is to turn that condition into a **design rule for each individual rectus force path**.

## A geometric rule for each muscle

Let <b>h</b> be the sum of the primary and current unit gaze directions (the primary direction is labeled <b>g</b><sub>p</sub> in the schematic). It is normal to the compatible torque plane. For muscle <i>m</i>, <b>s</b><sub>m</sub> points from the eye center to its attachment, labeled I in the viewer, and <b>d</b><sub>m</sub> is the unit direction of pull toward its pulley. The required condition is:

$$
\mathbf h^T(\mathbf s_m\times\mathbf d_m)=0.
$$

The cross product describes the turning effect of one unit of pull. The zero dot product says that this effect has no component perpendicular to the allowed torque plane. **If every rectus path satisfies this rule, adding their torques preserves it for any independently chosen nonnegative tensions.**

This leaves a whole plane of possible pulley positions for each muscle. I select one by making the cable tangent to the sphere at its attachment, choosing the branch directed backward at primary gaze, and specifying the attachment-to-pulley distance. The default illustration uses a 15 mm eye radius and a 12 mm segment. The resulting pulley positions generally move with gaze.

<details>
  <summary>The position rule</summary>
  <div markdown="1">

The tangent pulling direction and selected pulley point are

$$
\begin{aligned}
\mathbf d_m=
\frac{(\mathbf h\times\mathbf s_m)\times\mathbf s_m}
{\|(\mathbf h\times\mathbf s_m)\times\mathbf s_m\|},\\[6pt]
\mathbf P_m=\mathbf s_m+\ell_m\mathbf d_m.
\end{aligned}
$$

Here <b>P</b><sub>m</sub> is the pulley position, &ell;<sub>m</sub> is the selected segment length, and the double bars mean vector length. The formula applies when its denominator is nonzero. The admissible pulley plane passes through the eye center and contains <b>h</b> and <b>s</b><sub>m</sub>; its normal is their cross product.

  </div>
</details>

## What the construction establishes

With spherical inertia, compatible initial orientation and velocity, and only the four modeled rectus torques, applying this rule at every actual pose preserves Listing-compatible motion. Tension magnitudes still determine the target and time course. This is an idealized geometric design condition: it does not identify a unique anatomical pulley location or specify a mechanism that moves the guides. Exact attachment tangency is a modeling choice; MRI measurements have found departures from it ([Clark and Demer, 2018](https://doi.org/10.1016/j.ajo.2018.07.002)).

Chapter 5 also tests the construction in full dynamics. These simulations let prescribed tensions generate the motion, rather than supplying a Listing torsion angle at each frame. They compare moving pulley positions with the same positions held fixed at the start.

<details>
  <summary>Force-driven simulation comparison from Chapter 5</summary>
  <figure class="pulley-article-figure">
    <a href="{{ '/images/demos/2026-pulley-constraint-preservation.png' | relative_url }}"><img src="{{ '/images/demos/2026-pulley-constraint-preservation.png' | relative_url }}" width="1917" height="2000" loading="lazy" alt="Three prescribed tension families, resulting eye rotations, and Listing residuals comparing designed moving pulley geometry with pulleys frozen at their initial positions."></a>
    <figcaption><em>Each pair uses the same tensions and initial state. Solid curves use the designed moving geometry; dashed curves hold the pulleys at their initial positions. The right column measures departure from Listing's law. These are numerical model tests, with a 20 mm segment length and a stated wrapping treatment for the fixed-position comparison.</em></figcaption>
  </figure>
</details>

The broader aim is to make biologically compatible motion a property of the force-transmission geometry, alongside the separate task of designing the controller.

<script type="module" src="{{ '/assets/js/research/pulley-explorer.mjs' | relative_url }}"></script>
