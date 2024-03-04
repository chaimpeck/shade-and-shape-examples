import { icosphere } from "primitive-geometry";
import REGL from "regl";

import { getExpandedPrimitiveGeometry } from "./lib";

const regl = REGL({ extensions: ["OES_standard_derivatives"] });
const icosphereGeometry = icosphere({ subdivisions: 2 });
const expandedIcosphereGeometry =
  getExpandedPrimitiveGeometry(icosphereGeometry);

// This clears the color buffer to black and the depth buffer to 1
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

regl({
  attributes: {
    position: expandedIcosphereGeometry.positions,
    normal: expandedIcosphereGeometry.normals,
    barycenter: expandedIcosphereGeometry.barycentric,
  },

  count: expandedIcosphereGeometry.count,

  frag: `
  #extension GL_OES_standard_derivatives : enable
  precision mediump float;
  varying vec3 vBarycenter, vNormal, vPosition;
  void main () {
    vec3 d = fwidth(vBarycenter);

    vec3 color = (vNormal + 1.) / 2.;
    gl_FragColor = vec4(color / (d * 30.), 1);
  }`,

  vert: `
  precision mediump float;
  attribute vec3 normal, position, barycenter;
  varying vec3 vBarycenter, vNormal, vPosition;
  void main () {
    gl_Position = vec4(position, 1);
    vBarycenter = barycenter;
    vNormal = normal;
    vPosition = position;
  }`,
})();
