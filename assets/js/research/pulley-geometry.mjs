import { Vector3, Matrix4, Euler, MathUtils } from '../../lib/three-0.180.0/three.module.min.js';

// Port of pulley_kappa0_pose_viewer.m. Spatial coordinates here are millimeters.
export const MUSCLES = ['LR', 'MR', 'SR', 'IR', 'SO', 'IO'];
export const COLORS = ['#1f9440', '#d1385e', '#8f45ba', '#098cba', '#a38514', '#e6641a'];
export const RADIUS = 15;
const REFERENCE = [[4.8,13.4,0],[4.8,-13.4,0],[5.2,0,13.3],[1.6,0,-14.25],[-5.2,0,13.3],[-5.2,0,-13.3]];
const ENDPOINTS = [[-28,5.5,0],[-28,-5.5,0],[-28,0,7],[-28,0,-7],[12.5,-24,12],[12.5,-24,-12]];
const FIXED = [[12.5,-24,7],[12.5,-24,-7]];
const vec = values => new Vector3(...values);
const { degToRad, radToDeg, clamp } = MathUtils;

export function listingRoll(yaw, pitch) {
  const a = degToRad(yaw) / 2, b = degToRad(pitch) / 2;
  return radToDeg(2 * Math.atan2(Math.sin(a) * Math.sin(b), Math.cos(a) * Math.cos(b)));
}

function clearance(a, b) {
  const delta = b.clone().sub(a);
  const t = delta.lengthSq() ? clamp(-a.dot(delta) / delta.lengthSq(), 0, 1) : 0;
  return a.clone().addScaledVector(delta, t).length() - RADIUS;
}

function obliquePath(insertion, pulley) {
  const direct = pulley.clone().sub(insertion);
  if (insertion.dot(direct) >= -1e-8) {
    return { direction: direct.normalize(), path: [insertion.clone(), pulley.clone()], wrapped: false };
  }
  const iHat = insertion.clone().divideScalar(RADIUS);
  const pHat = pulley.clone().normalize();
  const v = insertion.clone().addScaledVector(pHat, -insertion.dot(pHat));
  if (v.length() < 1e-9) throw new Error('This pose does not define a unique oblique wrapping path.');
  const tangent = pHat.multiplyScalar(RADIUS ** 2 / pulley.length()).addScaledVector(
    v.normalize(), RADIUS * Math.sqrt(1 - (RADIUS / pulley.length()) ** 2));
  const cosine = clamp(iHat.dot(tangent.clone().divideScalar(RADIUS)), -1, 1);
  const angle = Math.acos(cosine);
  const direction = tangent.clone().divideScalar(RADIUS).addScaledVector(iHat, -cosine).normalize();
  const path = Array.from({ length: 61 }, (_, j) => {
    const a = angle * j / 60;
    return iHat.clone().multiplyScalar(RADIUS * Math.cos(a)).addScaledVector(direction, RADIUS * Math.sin(a));
  });
  path.push(pulley.clone());
  return { direction, path, wrapped: true };
}

export function geometry(pose, length = 12) {
  if (![2,3].includes(pose.length) || !pose.every(Number.isFinite)) throw new Error('Enter finite yaw, pitch, and torsion angles.');
  if (pose.slice(0,2).some(value => Math.abs(value) >= 90)) throw new Error('Yaw and pitch must be between -90 and 90 degrees.');
  if (!Number.isFinite(length) || length <= 0) throw new Error('The insertion-to-pulley length must be positive.');
  const [yaw,pitch] = pose;
  const roll = pose.length === 2 ? listingRoll(yaw,pitch) : pose[2];
  const rotation = new Matrix4().makeRotationFromEuler(new Euler(degToRad(roll),degToRad(pitch),degToRad(yaw),'ZYX'));
  const gaze = new Vector3(1,0,0).applyMatrix4(rotation);
  const normal = gaze.clone().add(new Vector3(1,0,0)).normalize();
  const muscles = MUSCLES.map((name,i) => {
    const insertion = vec(REFERENCE[i]).normalize().multiplyScalar(RADIUS).applyMatrix4(rotation);
    const endpoint = vec(ENDPOINTS[i]);
    let pulley, direction, path, wrapped = false;
    if (i < 4) {
      const iHat = insertion.clone().divideScalar(RADIUS);
      direction = iHat.clone().multiplyScalar(normal.dot(iHat)).sub(normal);
      if (direction.length() < 1e-9) throw new Error(`${name}: the insertion is parallel to the gaze bisector; choose another pose.`);
      direction.normalize();
      pulley = insertion.clone().addScaledVector(direction,length);
      path = [insertion.clone(),pulley.clone()];
    } else {
      pulley = vec(FIXED[i-4]);
      ({ direction, path, wrapped } = obliquePath(insertion,pulley));
    }
    const unitTorque = insertion.clone().cross(direction);
    return { name, insertion, pulley, endpoint, direction, path, wrapped, unitTorque,
      included: i < 4, normalMoment: normal.dot(unitTorque),
      tangency: insertion.clone().normalize().dot(direction), backClearance: clearance(pulley,endpoint) };
  });
  return { pose: [yaw,pitch,roll], rotation, gaze, normal, muscles,
    listingOffset: ((roll-listingRoll(yaw,pitch)+180)%360+360)%360-180,
    maxNormalMoment: Math.max(...muscles.slice(0,4).map(m => Math.abs(m.normalMoment))) };
}

export function makeClip(target, { start = [0,0], length = 12, frames = 121 } = {}) {
  const initial = geometry(start,length).pose;
  const final = geometry(target,length).pose;
  return Array.from({ length: frames }, (_,i) => {
    const t = i / (frames - 1), blend = t * t * (3-2*t);
    const pose = final.map((value,j) => initial[j] + blend * (value-initial[j]));
    return geometry(target.length === 2 ? pose.slice(0,2) : pose,length);
  });
}
