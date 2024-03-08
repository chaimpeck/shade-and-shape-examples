import {
  capsule,
  cone,
  cube,
  cylinder,
  icosphere,
  torus,
} from "primitive-geometry";
import REGL from "regl";
import Camera from "regl-camera";
import { Pane } from "tweakpane";

const regl = REGL({ container: "app" });
const camera = Camera(regl, {
  phi: Math.PI / 4,
  theta: Math.PI / 4,
  distance: 4,
});

// This clears the color buffer to black and the depth buffer to 1
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

function Mesh({ cells, normals, positions }) {
  this.cells = cells;
  this.normals = regl.buffer(normals);
  this.positions = regl.buffer(positions);
}

Mesh.prototype.draw = regl({
  attributes: {
    position: regl.this<typeof Mesh.prototype, "positions">("positions"),
    normal: regl.this<typeof Mesh.prototype, "normals">("normals"),
  },

  elements: regl.this<typeof Mesh.prototype, "cells">("cells"),

  frag: `
  precision mediump float;
  varying vec3 vColor;
  void main () {
    gl_FragColor = vec4(vColor, 1);
  }`,

  vert: `
  precision mediump float;
  uniform mat4 projection, view;
  attribute vec3 normal, position;
  varying vec3 vColor;
  void main () {
    gl_Position = projection * view * vec4(position, 1);
    vColor = (normal + 1.) / 2.;
  }`,
});

const meshes = {
  cube: new Mesh(cube()),
  capsule: new Mesh(capsule()),
  cone: new Mesh(cone()),
  cylinder: new Mesh(cylinder()),
  icosphere: new Mesh(icosphere({ subdivisions: 2 })),
  torus: new Mesh(torus()),
};

const INPUTS = {
  mesh: "torus",
};
let inputsChanged = false;

const pane = new Pane({
  container: document.querySelector<HTMLElement>("#config") ?? undefined,
});

// @ts-expect-error 2339
pane.addBinding(INPUTS, "mesh", {
  view: "list",
  label: "Primitive",
  options: Object.keys(meshes).map((v) => ({ text: v, value: v })),
});

// @ts-expect-error 2339
pane.on("change", () => {
  inputsChanged = true;
});

regl.frame(() => {
  camera((cameraState) => {
    if (!cameraState.dirty && !inputsChanged) return;
    regl.clear({ color: [0, 0, 0, 1] });
    meshes[INPUTS.mesh]?.draw();
    inputsChanged = false;
  });
});
