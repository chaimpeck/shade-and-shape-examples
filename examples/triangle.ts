import REGL from "regl";

const regl = REGL();

// Example from here: https://github.com/regl-project/regl/blob/gh-pages/example/basic.js

// This clears the color buffer to black and the depth buffer to 1
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

regl({
  attributes: {
    position: [
      [-1, 0],
      [0, -1],
      [1, 1],
    ],
  },

  count: 3,

  frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }`,

  vert: `
  precision mediump float;
  attribute vec2 position;
  void main () {
    gl_Position = vec4(position, 0, 1);
  }`,

  uniforms: {
    color: [1, 0, 0, 1],
  },
})();
