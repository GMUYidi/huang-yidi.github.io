---
title: "Kinematic Control Performance: Open-Loop vs. Closed-Loop"
date: 2026-07-07
summary: "A visual comparison of open-loop and closed-loop kinematic control for the robotic binocular eye platform."
permalink: /demos/kinematic-control-open-loop-vs-closed-loop/
---

<p><a href="{{ '/demos/' | relative_url }}">&larr; Back to Demos</a></p>

This demo compares two ways of controlling the robotic eyes: **open-loop kinematic control** and **closed-loop feedback control**. Both methods start from the same idea: choose a desired gaze direction, convert that target into motor commands, and move the robotic eyes. The difference is what happens after the command is sent.

Open-loop control sends the planned command and trusts the robot to follow it. Closed-loop control keeps measuring the actual eye orientation and uses the error to correct the command until the robot reaches the target more accurately.

## Open-loop control

<figure style="display:block; margin:20px auto 30px auto; width:100%; max-width:1100px; text-align:center;">
  <img src="{{ '/images/demos/2026-kinematic-control-open-loop.gif' | relative_url }}" style="width:100%; height:auto;" alt="Open-loop kinematic control performance">
  <figcaption><em>Open-loop gaze-direction tracking. The command is sent without using the measured tracking error to correct the motion.</em></figcaption>
</figure>

In the open-loop experiment, the controller takes the target yaw and pitch, computes the corresponding roll from the eye-orientation model, converts the target pose into motor positions through inverse kinematics, and sends those motor commands to the robot.

The IMUs still measure the actual eye orientation, so the error can be plotted. However, that measured error is only recorded; it is not sent back into the controller to change the motor command. As a result, the eyes move in the correct general direction, but the residual error can remain roughly within about `+/-5 deg`.

## Closed-loop feedback control

<figure style="display:block; margin:20px auto 30px auto; width:100%; max-width:1100px; text-align:center;">
  <img src="{{ '/images/demos/2026-kinematic-control-closed-loop.gif' | relative_url }}" style="width:100%; height:auto;" alt="Closed-loop kinematic feedback control performance">
  <figcaption><em>Closed-loop gaze-direction tracking. The controller repeatedly measures the error and sends correction commands.</em></figcaption>
</figure>

Closed-loop control adds one important step: after the first kinematic command, the robot reads the actual yaw, pitch, and roll from the IMUs. The controller compares the measured orientation with the target orientation and computes the remaining error.

That error is then converted into a small motor correction using an IK-PD feedback rule. In plain terms, the controller asks: "How far am I from the target, and how should I adjust the motors to reduce that error?" This measure-and-correct loop repeats until the measured error stays inside the tolerance. In this experiment, the closed-loop controller keeps the error within about `+/-0.25 deg`.

## Control logic

| Step | Open-loop control | Closed-loop feedback control |
| --- | --- | --- |
| 1. Target | Choose desired yaw and pitch. | Choose desired yaw and pitch. |
| 2. 3D eye pose | Compute roll from the eye-orientation model. | Compute roll from the eye-orientation model. |
| 3. Motor command | Convert the target pose to motor positions. | Send an initial motor command from the same kinematic model. |
| 4. Measurement | IMUs measure actual eye motion for logging. | IMUs measure actual yaw, pitch, and roll after each command. |
| 5. Error use | Error is plotted but does not change the command. | Error is used to compute correction pulses. |
| 6. Result | Good approximate motion, but residual error remains. | The robot actively corrects itself until the error is small. |

## Why feedback improves performance

Real robotic eyes do not behave like a perfect mathematical model. Cable tension, friction, motor resolution, calibration offsets, and small mechanical asymmetries can all cause the actual eye orientation to differ from the planned pose.

Open-loop control cannot correct those differences because it does not use the measured result. Closed-loop control can correct them because the controller continuously compares:

`target orientation - actual orientation = tracking error`

Then it sends small correction commands until the tracking error is reduced. This is why the closed-loop experiment achieves much tighter gaze tracking than the open-loop experiment.
