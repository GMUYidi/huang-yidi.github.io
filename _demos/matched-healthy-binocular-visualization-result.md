---
title: "Binocular Visualization Result: Healthy vs. Strabismus"
date: 2026-07-07
summary: "A side-by-side experimental visualization comparing healthy binocular perception with a strabismus-patient view."
permalink: /research/matched-healthy-binocular-visualization-result/
---

<p><a href="{{ '/research/' | relative_url }}">&larr; Back to Research</a></p>

This demo compares two binocular visualization results generated from the robotic-eye visualization pipeline. Before generating the visualization clips, patient-specific eye-alignment data were replayed on the robotic eye platform so the two robotic eyes could reproduce the matched binocular viewing condition. The platform then provided the left-eye and right-eye camera views used to create the healthy reference and strabismus-patient visualizations below.

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:900px; text-align:center;">
  <img src="{{ '/images/demos/patient_data_driven_robotic_eye_replay2.png' | relative_url }}" style="width:100%; height:auto;" alt="Patient-data-driven robotic eye replay platform">
  <figcaption><em>Patient-data-driven robotic eye replay: recorded ocular alignment data are used to drive the robotic binocular platform before rendering the visualization results.</em></figcaption>
</figure>

## Healthy binocular view

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:900px; text-align:center;">
  <img src="{{ '/images/demos/2026-binocular-visualization-healthy.gif' | relative_url }}" style="width:100%; height:auto;" alt="Healthy binocular visualization result">
  <figcaption><em>Healthy binocular visualization result: the reference view of what a normally aligned binocular system should see.</em></figcaption>
</figure>

In the healthy condition, the left-eye and right-eye visual streams are aligned to support a stable binocular percept. This result serves as the reference case for comparison with altered ocular alignment.

## Strabismus-patient view

<figure style="display:block; margin:20px auto 30px auto; width:90%; max-width:900px; text-align:center;">
  <img src="{{ '/images/demos/2026-binocular-visualization-strabismus-q14.gif' | relative_url }}" style="width:100%; height:auto;" alt="Strabismus-patient binocular visualization result">
  <figcaption><em>Strabismus-patient binocular visualization result: a matched visualization showing how ocular misalignment can alter the perceived scene.</em></figcaption>
</figure>

The strabismus-patient condition uses matched eye-movement data to reproduce a patient-specific binocular viewing scenario. Compared with the healthy reference, the scene can appear shifted, mismatched, or less stable because the two eye views no longer correspond in the same way.

Together, these two clips illustrate how the visualization method can translate eye-alignment data into an interpretable visual result, making it easier to compare a healthy binocular reference with a strabismus-like viewing experience.
