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
  },

  elements: icosphereGeometry.cells,

  frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }`,

  vert: `
  precision mediump float;
  attribute vec3 position;
  void main () {
    gl_Position = vec4(position, 1);
  }`,

  uniforms: {
    color: [1, 0, 0, 1],
  },
})();
