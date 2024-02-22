import glsl from "glslify";
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

interface Uniforms {
  color: REGL.Vec3;
  lightDirection: REGL.Vec3;
}

interface Attributes {
  position: REGL.Vec2[];
  normal: REGL.Vec2[];
}

interface Props {
  color: REGL.Vec3;
  lightDirection: REGL.Vec3;
}

Mesh.prototype.draw = regl<Uniforms, Attributes, Props>({
  attributes: {
    position: regl.this<typeof Mesh.prototype, "positions">("positions"),
    normal: regl.this<typeof Mesh.prototype, "normals">("normals"),
  },

  elements: regl.this<typeof Mesh.prototype, "cells">("cells"),

  frag: glsl(`
  precision mediump float;
  varying vec3 vColor;
  void main () {
    gl_FragColor = vec4(vColor, 1);
  }`),

  vert: glsl(`
  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 
  precision mediump float; 
  uniform mat4 projection, view;
  uniform vec3 color, lightDirection;
  attribute vec3 normal, position;
  varying vec3 vColor;
  void main () {
    float f = snoise3(position);
    gl_Position = projection * view * vec4(position - f * .1, 1);

    float light = dot(normalize(normal), lightDirection);
    float surfaceBrightness = max(0., light);
    vColor = color * surfaceBrightness; 
  }`),

  uniforms: {
    color: (ctx, { color }) => color,
    lightDirection: (ctx, { lightDirection }) => lightDirection,
  },
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
  color: { r: 1, g: 0, b: 0.1 },
  lightDirection: { x: 0.25, y: 1, z: 0.25 },
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
pane.addBinding(INPUTS, "lightDirection", {
  min: -1,
  max: 1,
});

// @ts-expect-error 2339
pane.addBinding(INPUTS, "color", { color: { type: "float" } });

// @ts-expect-error 2339
pane.on("change", () => {
  inputsChanged = true;
});

regl.frame(() => {
  // console.log("currentPrimitive", currentPrimitive);
  camera((cameraState) => {
    if (!cameraState.dirty && !inputsChanged) return;
    regl.clear({ color: [0, 0, 0, 1] });
    const { r, g, b } = INPUTS.color;
    const { x, y, z } = INPUTS.lightDirection;
    meshes[INPUTS.mesh]?.draw({
      color: [r, g, b],
      lightDirection: [x, y, z],
    });
    inputsChanged = false;
  });
});
