import { icosphere } from "primitive-geometry";
import REGL from "regl";

const regl = REGL();
const icosphereGeometry = icosphere({ subdivisions: 2 });

// This clears the color buffer to black and the depth buffer to 1
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

regl({
  attributes: {
    position: icosphereGeometry.positions,
    normal: icosphereGeometry.normals,
  },

  elements: icosphereGeometry.cells,

  frag: `
  precision mediump float;
  varying vec3 vColor;
  void main () {
    gl_FragColor = vec4(vColor, 1);
  }`,

  vert: `
  precision mediump float;
  attribute vec3 normal, position;
  varying vec3 vColor;
  void main () {
    gl_Position = vec4(position, 1);
    vColor = (normal + 1.) / 2.;
  }`,
})();
