---
layout: single
title: "Research"
permalink: /research/
author_profile: true
project_roles:
  /research/listing-compatible-pulley-paths/: "Design muscle-force paths so the mechanical geometry itself supports Listing-compatible motion."
  /research/air-bearing-eye-dynamics-validation/: "Connect measured cable forces with eye motion on a low-friction testbed to investigate the dynamics model."
  /research/matched-healthy-binocular-visualization-result/: "Turn recorded eye-alignment data into robotic-eye replay and interpretable comparisons of binocular images."
  /research/kinematic-control-open-loop-vs-closed-loop/: "Make the robot reproduce target gaze accurately, so tracking errors do not dominate the visual comparison."
  /research/eye-dynamics-model-system-states/: "Predict how muscle-like pulling forces and their combined torque produce three-dimensional eye motion."
  /research/listing-compatible-torque-plane/: "Connect biological rules for eye rotation with a torque constraint that guides the model and mechanical design."
---

<link rel="stylesheet" href="{{ '/assets/css/research-overview.css' | relative_url }}">

## Robotic eyes as a physical twin

I develop **robotic eyes to connect eye mechanics, eye movement, and binocular images**. My broader goal is a **Physical Twin** for strabismus research: a controllable physical counterpart, informed by patient data, on which we can investigate abnormal eye movements and eventually test potential interventions before clinical use.

[Research projects](#research-projects) &middot; [The Physical Twin framework](#physical-twin-framework)

### Why build a robotic eye?

Strabismus is a misalignment of the eyes that can disrupt how their images work together ([AAPOS](https://www.aapos.org/glossary/strabismus)). Some patients need further surgery: an IRIS Registry study reported a **10.13% reoperation rate within five years** after strabismus surgery in its study cohort ([Repka et al., 2026](https://pubmed.ncbi.nlm.nih.gov/40907579/)). My long-term motivation is to help investigate treatment options for individual patients.

The question driving my work is: **can we reproduce aspects of a patient's eye movement on a measurable platform, then study how changes in mechanics affect motion and binocular images?** A robot lets us repeat the same task, change selected mechanical conditions, and examine real cable transmission, friction, control errors, and camera views alongside a computational model.

<figure class="research-platform-figure">
  <a href="{{ '/images/demos/2026-physical-twin-exam-platform.png' | relative_url }}"><img src="{{ '/images/demos/2026-physical-twin-exam-platform.png' | relative_url }}" width="1669" height="1225" alt="Annotated experiment setup with a human eye tracker and a cable-driven robotic eye platform viewing matching exam videos; insets identify motors, pulleys, and cameras."></a>
  <figcaption>The human and robotic-eye setup uses matching visual stimuli. Eye tracking provides motion data, while the robot supplies controllable eye orientations and paired camera views.</figcaption>
</figure>

<h2 id="physical-twin-framework">The Physical Twin framework</h2>

The proposed workflow links patient measurements to a computational model and a physical experiment. The illustrations below show the broader framework, rather than a completed clinical planning system.

<div class="research-framework">
  <figure>
    <a href="{{ '/images/demos/2026-physical-twin-mri.png' | relative_url }}"><img src="{{ '/images/demos/2026-physical-twin-mri.png' | relative_url }}" width="382" height="383" loading="lazy" alt="Orbital MRI slice illustrating the anatomical input to a patient-specific model."></a>
    <figcaption><strong>1. Patient measurements</strong>MRI would describe anatomy; eye tracking and alignment measurements describe how the eyes move.</figcaption>
  </figure>
  <figure>
    <a href="{{ '/images/demos/2026-physical-twin-computational-model.png' | relative_url }}"><img src="{{ '/images/demos/2026-physical-twin-computational-model.png' | relative_url }}" width="1062" height="1072" loading="lazy" alt="Computational eye model illustrating the eyeball and surrounding extraocular muscle geometry."></a>
    <figcaption><strong>2. A model of the eye</strong>Represent muscle geometry and dynamics to investigate altered mechanics and candidate interventions.</figcaption>
  </figure>
  <figure>
    <a href="{{ '/images/demos/2026-physical-twin-robotic-model.png' | relative_url }}"><img src="{{ '/images/demos/2026-physical-twin-robotic-model.png' | relative_url }}" width="1717" height="973" loading="lazy" alt="CAD of the binocular robotic-eye platform facing a checkerboard, with cable paths visible around both eyes."></a>
    <figcaption><strong>3. Physical experiments</strong>Reproduce selected conditions on the robot and compare the resulting eye motion and binocular images.</figcaption>
  </figure>
</div>

**Current experiments** replay recorded eye-alignment data on the robotic eyes and use their left and right camera streams to generate comparative visualizations. These show image differences associated with alignment; they do not directly reproduce a patient's subjective vision, which also depends on neural processing such as suppression ([AAPOS](https://www.aapos.org/glossary/strabismus)).

**The longer-term goal** is an iterative test-and-refine loop: simulate a candidate change, reproduce its modeled effects on the robot, measure the outcome, and revise the candidate. Patient-specific MRI integration and surgical planning belong to this broader goal and require further validation. Clearer robot images alone would not establish a successful patient outcome.

Achieving this goal requires accurate control of nonlinear eye dynamics. My work combines modeling and feedback control, with ongoing exploration of reinforcement learning. The projects below address the mechanical, mathematical, and experimental foundations of the same framework.

<h2 id="research-projects">Research projects</h2>

{% assign demos = site.demos | sort: "date" | reverse %}

{% if demos.size > 0 %}
<ul class="research-projects">
{% for demo in demos %}
  <li>
    <strong><a href="{{ demo.url | relative_url }}">{{ demo.title }}</a></strong>
    <p>{{ page.project_roles[demo.url] | default: demo.summary }}</p>
  </li>
{% endfor %}
</ul>
{% else %}
More research results will be added here soon.
{% endif %}
