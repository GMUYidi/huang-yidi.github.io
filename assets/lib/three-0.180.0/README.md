# Three.js 0.180.0

Vendored from the published `three@0.180.0` npm package, distributed at
https://cdn.jsdelivr.net/npm/three@0.180.0/.

- `build/three.module.min.js`
- `build/three.core.min.js`
- `examples/jsm/controls/OrbitControls.js`
- `LICENSE` (MIT)

The only source change is the OrbitControls import: `three` resolves to the
adjacent `./three.module.min.js` so the static site needs no import map or CDN.
