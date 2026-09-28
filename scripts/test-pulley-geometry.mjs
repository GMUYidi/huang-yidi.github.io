import assert from 'node:assert/strict';
import fs from 'node:fs';
import { geometry, makeClip, listingRoll, RADIUS } from '../assets/js/research/pulley-geometry.mjs';
const near = (a,b,tol=1e-9) => assert(Math.abs(a-b)<tol,`${a} differs from ${b}`);
let seed=42;
const random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
let wrapped=0, direct=0;
for(let k=0;k<250;k++) {
  const pose=[140*(random()-0.5),140*(random()-0.5)];
  if(k%2) pose.push(60*(random()-0.5));
  const length=8+25*random(), g=geometry(pose,length);
  const torque=g.gaze.clone().set(0,0,0);
  for(const [i,m] of g.muscles.entries()) {
    near(m.insertion.length(),RADIUS);
    if(i<4) {
      near(m.insertion.distanceTo(m.pulley),length);
      near(m.pulley.length(),Math.hypot(RADIUS,length));
      near(m.tangency,0); near(m.normalMoment,0);
      torque.addScaledVector(m.unitTorque,random());
    } else {
      near(m.pulley.x,12.5); near(m.pulley.y,-24); near(m.pulley.z,i===4?7:-7);
      m.wrapped ? wrapped++ : direct++;
      for(const p of m.path) assert(p.length()>=RADIUS-1e-8);
      near(m.path[0].distanceTo(m.insertion),0);
      near(m.path.at(-1).distanceTo(m.pulley),0);
    }
  }
  near(g.normal.dot(torque),0);
  if(pose.length===2) { near(g.listingOffset,0); near(g.rotation.elements[6],g.rotation.elements[9]); }
}
assert(wrapped>0&&direct>0);
const clip=makeClip([15,13]);
assert.equal(clip.length,121);
assert.deepEqual(clip[0].pose,[0,0,0]);
near(clip.at(-1).pose[2],1.718734,1e-6);
near(clip[60].pose[0],7.5); near(clip[60].pose[1],6.5);
for(const g of clip) { near(g.listingOffset,0); near(g.maxNormalMoment,0); }
const manual=makeClip([-20,10,7]);
near(manual[60].pose[2],3.5); near(manual.at(-1).pose[2],7);
assert(Math.abs(manual.at(-1).listingOffset)>1);
const start=makeClip([20,-8],{start:[-5,4]});
near(start[0].pose[2],listingRoll(-5,4));
for(const args of [[[90,0]],[[NaN,0]],[[0]],[[0,0],0]]) assert.throws(()=>geometry(...args));
// Independent outputs from the original MATLAB function, with 12 mm segments.
const references=JSON.parse(fs.readFileSync(new URL('./fixtures/pulley-matlab-reference.json',import.meta.url),'utf8'));
let maxDifference=0;
for(const ref of references) {
  const g=geometry(ref.input);
  g.pose.forEach((value,i)=>near(value,ref.pose[i]));
  g.muscles.forEach((m,i)=> {
    for(const [actual,expected] of [[m.insertion.toArray(),ref.insertion[i]],[m.pulley.toArray(),ref.pulley[i]],
      [m.endpoint.toArray(),ref.endpoints[i]],[m.direction.toArray(),ref.direction[i]]]) {
      actual.forEach((value,j)=>{near(value,expected[j],1e-10);maxDifference=Math.max(maxDifference,Math.abs(value-expected[j]));});
    }
    near(m.normalMoment,ref.normalMoment[i]);
  });
}
console.log(`Five MATLAB reference poses match; maximum difference ${maxDifference}.`);
console.log('250 poses: tangency, torque compatibility, wrapping, fixed obliques, Listing rotation, and playback checks passed.');
