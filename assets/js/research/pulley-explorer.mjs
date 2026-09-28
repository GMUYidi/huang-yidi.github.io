import * as THREE from '../../lib/three-0.180.0/three.module.min.js';
import { OrbitControls } from '../../lib/three-0.180.0/OrbitControls.js';
import { makeClip, listingRoll, MUSCLES, COLORS, RADIUS } from './pulley-geometry.mjs';

const root = document.querySelector('[data-pulley-explorer]');
if (root) {
  try { initialize(root); }
  catch (error) {
    root.querySelector('.pulley-loading').hidden = true;
    root.querySelector('canvas').hidden = true;
    root.querySelector('.pulley-fallback').hidden = false;
    const message = root.querySelector('.pulley-error');
    message.textContent = 'The 3D view could not start. A static geometry view is shown; try a browser with WebGL enabled.';
    message.hidden = false;
    console.error(error);
  }
}

function initialize(root) {
  const field = name => root.querySelector(`[name="${name}"]`);
  const button = action => root.querySelector(`[data-action="${action}"]`);
  const viewport = root.querySelector('.pulley-viewport');
  const canvas = viewport.querySelector('canvas');
  const labelsRoot = root.querySelector('.pulley-labels');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false, preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0xffffff);
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff,2));
  const light = new THREE.DirectionalLight(0xffffff,2.2);
  light.position.set(40,-20,70);
  scene.add(light);
  const camera = new THREE.OrthographicCamera(-45,45,40,-40,0.1,500);
  camera.up.set(0,0,1);
  const controls = new OrbitControls(camera,canvas);
  controls.enableDamping = false;
  controls.minZoom = 0.55;
  controls.maxZoom = 4;
  controls.enablePan = false;
  let clip = makeClip([15,13]);
  let index = 120, playing = false, elapsed = 4, duration = 4, lastTime = null;
  let active = true, renderNeeded = true, halfHeight = 34;
  const moving = new THREE.Group();
  scene.add(moving);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(RADIUS,48,32),
    new THREE.MeshPhongMaterial({color:0xb6d2da,transparent:true,opacity:0.16,depthWrite:false,side:THREE.DoubleSide}));
  moving.add(sphere);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(RADIUS,16,12)),
    new THREE.LineBasicMaterial({color:0xb1c3c9,transparent:true,opacity:0.18,depthWrite:false}));
  moving.add(wire);
  const eyePose = new THREE.Group();
  moving.add(eyePose);
  const pupilPoints = Array.from({length:65},(_,i) => {
    const a = i*2*Math.PI/64;
    return new THREE.Vector3(Math.sqrt(RADIUS**2-2.4**2),2.4*Math.cos(a),2.4*Math.sin(a));
  });
  const pupil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pupilPoints),64,0.16,6,false),
    new THREE.MeshBasicMaterial({color:0x273b43}));
  eyePose.add(pupil);
  const gaze = new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),24.75,0x087f86,3,1.1);
  moving.add(gaze);
  const primaryGaze = new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),21,0x9aa6ab,2,0.8);
  moving.add(primaryGaze);
  const grid = new THREE.GridHelper(70,7,0xd5dee1,0xeaf0f2);
  grid.rotation.x = Math.PI/2;
  grid.position.z = -21;
  scene.add(grid);
  const origin = new THREE.Vector3(-24,14,-19);
  for (const [j,color] of [0xad5454,0x5a805c,0x4d769a].entries()) {
    const axis = new THREE.Vector3().setComponent(j,1);
    scene.add(new THREE.ArrowHelper(axis,origin,10,color,1.6,0.65));
  }
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(52,52),
    new THREE.MeshBasicMaterial({color:0x57a5a4,transparent:true,opacity:0.10,side:THREE.DoubleSide,depthWrite:false}));
  plane.visible = false;
  moving.add(plane);
  const planeOutline = new THREE.LineSegments(new THREE.EdgesGeometry(plane.geometry),
    new THREE.LineBasicMaterial({color:0x6e9f9f,transparent:true,opacity:0.35}));
  plane.add(planeOutline);

  function label(text,color) {
    const element = document.createElement('span');
    element.className = 'pulley-label';
    element.textContent = text;
    element.style.color = color;
    labelsRoot.append(element);
    return element;
  }
  const axisLabels = ['X','Y','Z'].map((text,j) => ({
    element:label(text,'#5e707a'), point:origin.clone().setComponent(j,origin.getComponent(j)+12)
  }));
  const originLabel = label('g','#087f86');
  const primaryLabel = label('g\u209a','#71818a');
  const cylinderGeometry = new THREE.CylinderGeometry(0.21,0.21,1,8);
  const yAxis = new THREE.Vector3(0,1,0);
  const lineGeometry = points => new THREE.BufferGeometry().setFromPoints(points);
  const items = MUSCLES.map((name,i) => {
    const group = new THREE.Group();
    moving.add(group);
    const material = new THREE.MeshPhongMaterial({color:COLORS[i]});
    const front = new THREE.Mesh(cylinderGeometry,material);
    group.add(front);
    const wrap = new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:COLORS[i]}));
    group.add(wrap);
    const back = new THREE.Line(new THREE.BufferGeometry(),new THREE.LineDashedMaterial({color:COLORS[i],dashSize:1.3,gapSize:0.7}));
    group.add(back);
    const insertion = new THREE.Mesh(new THREE.SphereGeometry(0.64,12,8),material);
    const pulley = new THREE.Mesh(i<4 ? new THREE.OctahedronGeometry(0.95) : new THREE.ConeGeometry(0.8,1.5,4),material);
    const endpoint = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material);
    group.add(insertion,pulley,endpoint);
    const fullTrail = new THREE.Line(new THREE.BufferGeometry(),new THREE.LineDashedMaterial({color:COLORS[i],transparent:true,opacity:0.38,dashSize:0.4,gapSize:0.7}));
    const elapsedTrail = new THREE.Mesh(new THREE.BufferGeometry(),material);
    group.add(fullTrail,elapsedTrail);
    return {group,front,wrap,back,insertion,pulley,endpoint,fullTrail,elapsedTrail,
      labels:[label(`P ${name}`,COLORS[i]),label(`I ${name}`,COLORS[i]),label(`E ${name}`,COLORS[i])]};
  });

  function selected(i) {
    const value = field('muscle').value;
    return value === 'all' || value === MUSCLES[i] || (value === 'recti' && i<4);
  }
  function replaceGeometry(object,next) {
    object.geometry.dispose();
    object.geometry = next;
  }
  function resetCamera() {
    const mode = field('view').value;
    camera.up.set(0,0,1);
    controls.target.set(-3,-2,0);
    camera.position.set(75,90,65);
    if (mode === 'front') camera.position.set(110,0,0);
    if (mode === 'side') camera.position.set(0,-110,0);
    if (mode === 'top') { camera.position.set(0,0,110); camera.up.set(0,1,0); }
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    controls.update();
    renderNeeded = true;
  }
  function resize() {
    const width = viewport.clientWidth, height = viewport.clientHeight;
    renderer.setSize(width,height,false);
    const aspect = width / height;
    const span = Math.max(halfHeight,34/aspect);
    camera.left = -span*aspect;
    camera.right = span*aspect;
    camera.top = span;
    camera.bottom = -span;
    camera.updateProjectionMatrix();
    renderNeeded = true;
  }
  function updatePaths() {
    for (let i=0;i<4;i++) {
      replaceGeometry(items[i].fullTrail,lineGeometry(clip.map(g => g.muscles[i].pulley)));
      items[i].fullTrail.computeLineDistances();
    }
    halfHeight = Math.max(34,...clip.flatMap(g => g.muscles.slice(0,4).map(m => m.pulley.length()+6)));
    resize();
  }
  function updateTable() {
    const frame = clip[index];
    const point = field('point').value;
    root.querySelector('tbody').replaceChildren(...frame.muscles.filter((_,i)=>selected(i)).map(m => {
      const row = document.createElement('tr');
      const header = document.createElement('th');
      header.scope = 'row'; header.textContent = m.name;
      header.style.color = COLORS[MUSCLES.indexOf(m.name)];
      row.append(header);
      for (const value of m[point].toArray()) {
        const cell = document.createElement('td');
        cell.textContent = (Math.abs(value)<0.0005 ? 0 : value).toFixed(2);
        row.append(cell);
      }
      return row;
    }));
  }
  function showFrame(next) {
    index = Math.max(0,Math.min(120,next));
    const frame = clip[index];
    eyePose.quaternion.setFromRotationMatrix(frame.rotation);
    gaze.setDirection(frame.gaze);
    for (let i=0;i<6;i++) {
      const item = items[i], m = frame.muscles[i];
      const delta = m.pulley.clone().sub(m.insertion);
      item.front.position.copy(m.insertion).add(m.pulley).multiplyScalar(0.5);
      item.front.quaternion.setFromUnitVectors(yAxis,delta.clone().normalize());
      item.front.scale.set(1,delta.length(),1);
      item.front.visible = !m.wrapped;
      item.wrap.visible = m.wrapped;
      replaceGeometry(item.wrap,lineGeometry(m.path));
      replaceGeometry(item.back,lineGeometry([m.pulley,m.endpoint]));
      item.back.material.dashSize = m.backClearance < -1e-6 ? 0.25 : 1.3;
      item.back.computeLineDistances();
      item.insertion.position.copy(m.insertion);
      item.pulley.position.copy(m.pulley);
      item.endpoint.position.copy(m.endpoint);
      if (i<4 && index>0) {
        const path = clip.slice(0,index+1).map(g=>g.muscles[i].pulley);
        // Coincident start/target poses have no trail to draw.
        if (path[0].distanceToSquared(path[path.length-1]) > 1e-15) {
          replaceGeometry(item.elapsedTrail,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path),Math.max(2,index),0.12,5,false));
        } else { replaceGeometry(item.elapsedTrail,new THREE.BufferGeometry()); }
      }
    }
    for (const [j,key] of ['yaw','pitch','roll'].entries()) root.querySelector(`[data-value="${key}"]`).textContent = `${frame.pose[j].toFixed(2)}\u00b0`;
    root.querySelector('[data-value="offset"]').textContent = `${frame.listingOffset.toFixed(4)}\u00b0`;
    root.querySelector('[data-value="moment"]').textContent = `${frame.maxNormalMoment.toExponential(1)} mm`;
    field('progress').value = index;
    field('progress').setAttribute('aria-valuetext',`${Math.round(index/1.2)} percent`);
    root.querySelector('.pulley-time').value = `${(index/120*duration).toFixed(2)} / ${duration.toFixed(2)} s`;
    updateVisibility();
    updateTable();
    root.dataset.frame = index;
    root.dataset.pose = JSON.stringify(frame.pose);
    renderNeeded = true;
  }
  function updateVisibility() {
    const frame = clip[index];
    const single = MUSCLES.includes(field('muscle').value);
    items.forEach((item,i)=> {
      item.group.visible = selected(i);
      item.fullTrail.visible = i<4 && field('trails').checked;
      item.elapsedTrail.visible = i<4 && index>0 && field('trails').checked;
      item.labels.forEach((el,j)=>el.hidden = !selected(i) || !field('labels').checked || (j>0&&!single));
    });
    axisLabels.forEach(({element})=>element.hidden=!field('labels').checked);
    originLabel.hidden=primaryLabel.hidden=!field('labels').checked;
    const focus = Math.max(0,MUSCLES.indexOf(field('muscle').value));
    plane.visible = field('plane').checked && focus<4;
    const planeLabel = root.querySelector('.pulley-plane-name');
    planeLabel.hidden = !field('plane').checked;
    if (plane.visible) {
      const normal = frame.normal.clone().cross(frame.muscles[focus].insertion).normalize();
      plane.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);
      planeLabel.textContent = `${MUSCLES[focus]} admissible pulley plane`;
    } else { planeLabel.textContent = 'The derived pulley plane applies to the four recti.'; }
    const crossings = frame.muscles.filter((m,i)=>selected(i)&&m.backClearance < -1e-6).map(m=>m.name);
    const routing = root.querySelector('.pulley-routing');
    routing.hidden = crossings.length===0;
    routing.textContent = `Posterior route crosses the globe: ${crossings.join(', ')}. Additional routing is needed.`;
    renderNeeded = true;
  }
  function setPlaying(value) {
    playing = value;
    const text = value ? 'Pause' : 'Play';
    button('play').title = text;
    button('play').setAttribute('aria-label',text);
    button('play').querySelector('i').className = `fa-solid fa-${value?'pause':'play'}`;
    root.dataset.playing = String(value);
    lastTime = null;
  }
  function apply(event) {
    event.preventDefault();
    setPlaying(false);
    const error = root.querySelector('.pulley-error');
    error.hidden = true;
    try {
      if (!root.querySelector('form').reportValidity()) return;
      const target = [field('yaw').valueAsNumber,field('pitch').valueAsNumber];
      if (!field('listing').checked) target.push(field('roll').valueAsNumber);
      const next = makeClip(target,{start:[field('startYaw').valueAsNumber,field('startPitch').valueAsNumber],length:field('length').valueAsNumber});
      clip = next;
      duration = field('duration').valueAsNumber;
      elapsed = duration;
      field('roll').value = clip[120].pose[2].toFixed(6);
      updatePaths();
      showFrame(120);
    } catch (exception) { error.textContent = exception.message; error.hidden = false; }
  }
  root.querySelector('form').addEventListener('submit',apply);
  field('listing').addEventListener('change',()=> {
    field('roll').disabled = field('listing').checked;
    if (field('listing').checked) field('roll').value = listingRoll(field('yaw').valueAsNumber,field('pitch').valueAsNumber).toFixed(6);
  });
  for (const key of ['yaw','pitch']) field(key).addEventListener('input',()=> {
    if (field('listing').checked && field('yaw').value!=='' && field('pitch').value!=='') {
      field('roll').value = listingRoll(field('yaw').valueAsNumber,field('pitch').valueAsNumber).toFixed(6);
    }
  });
  field('progress').addEventListener('input',()=> {
    setPlaying(false); elapsed = field('progress').valueAsNumber/120*duration;
    showFrame(field('progress').valueAsNumber);
  });
  button('play').addEventListener('click',()=> {
    if (!playing && index===120) { elapsed=0; showFrame(0); }
    setPlaying(!playing);
  });
  button('rewind').addEventListener('click',()=> { setPlaying(false); elapsed=0; showFrame(0); });
  for (const key of ['muscle','trails','labels','plane']) field(key).addEventListener('change',()=>{updateVisibility();updateTable();});
  field('point').addEventListener('change',()=>{updateTable();});
  field('view').addEventListener('change',resetCamera);
  button('camera').addEventListener('click',resetCamera);
  if (!root.requestFullscreen) button('fullscreen').hidden = true;
  button('fullscreen').addEventListener('click',async()=> {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.requestFullscreen(); }
    catch { button('fullscreen').hidden = true; }
  });
  document.addEventListener('fullscreenchange',()=> {
    const expanded=document.fullscreenElement===root;
    button('fullscreen').title=expanded?'Exit fullscreen':'Fullscreen';
    button('fullscreen').setAttribute('aria-label',button('fullscreen').title);
    button('fullscreen').querySelector('i').className=`fa-solid fa-${expanded?'compress':'expand'}`;
    resize();
  });
  button('download').addEventListener('click',()=> {
    const rows = ['muscle,point,x_mm,y_mm,z_mm,included_in_torque_model'];
    for (const m of clip[index].muscles) for (const point of ['insertion','pulley','endpoint']) rows.push([m.name,point,...m[point].toArray().map(v=>v.toFixed(6)),m.included].join(','));
    const url = URL.createObjectURL(new Blob([rows.join('\r\n')],{type:'text/csv'}));
    const link = document.createElement('a'); link.href=url; link.download='eye-pulley-coordinates.csv'; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  controls.addEventListener('change',()=>{renderNeeded=true;});
  canvas.addEventListener('webglcontextlost',event=> {
    event.preventDefault(); setPlaying(false);
    root.querySelector('.pulley-error').textContent='The 3D graphics context was interrupted. Reload this page to restart the view.';
    root.querySelector('.pulley-error').hidden=false;
  });
  document.addEventListener('visibilitychange',()=> { if (document.hidden) setPlaying(false); });
  new ResizeObserver(resize).observe(viewport);
  new IntersectionObserver(([entry])=> { active=entry.isIntersecting; if(!active) setPlaying(false); else renderNeeded=true; },{rootMargin:'150px'}).observe(viewport);
  function positionLabel(element,point,offsetX=6,offsetY=-18) {
    if (element.hidden) return;
    const p = point.clone().project(camera);
    const x = (p.x+1)/2*viewport.clientWidth, y = (1-p.y)/2*viewport.clientHeight;
    element.style.visibility = p.z>1 || p.z < -1 ? 'hidden' : 'visible';
    element.style.transform = `translate(${Math.max(0,Math.min(viewport.clientWidth-element.offsetWidth,x+offsetX))}px,${Math.max(0,Math.min(viewport.clientHeight-element.offsetHeight,y+offsetY))}px)`;
  }
  function render() {
    renderer.render(scene,camera);
    const frame=clip[index];
    items.forEach((item,i)=> {
      positionLabel(item.labels[0],frame.muscles[i].pulley);
      positionLabel(item.labels[1],frame.muscles[i].insertion,7,5);
      positionLabel(item.labels[2],frame.muscles[i].endpoint,5,-20);
    });
    axisLabels.forEach(({element,point})=>positionLabel(element,point,0,-10));
    positionLabel(originLabel,frame.gaze.clone().multiplyScalar(26),4,-10);
    positionLabel(primaryLabel,new THREE.Vector3(22,0,0),-18,8);
  }
  function tick(time) {
    requestAnimationFrame(tick);
    if (!active) { lastTime=null; return; }
    if (playing) {
      if (lastTime!==null) elapsed=Math.min(duration,elapsed+(time-lastTime)/1000*Number(field('speed').value));
      const next=Math.min(120,Math.floor(elapsed/duration*120));
      if(next!==index) showFrame(next);
      if(elapsed>=duration) setPlaying(false);
    }
    lastTime=time;
    if(renderNeeded) { render(); renderNeeded=false; }
  }
  updatePaths(); resetCamera(); showFrame(120); setPlaying(false);
  button('play').disabled=false; button('rewind').disabled=false; field('progress').disabled=false;
  root.querySelector('.pulley-loading').hidden=true;
  root.dataset.ready='true';
  requestAnimationFrame(tick);
}
