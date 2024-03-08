import mat4 from "gl-mat4";
import glsl from "glslify";
import REGL from "regl";
import Camera from "regl-camera";
import { Pane } from "tweakpane";

const regl = REGL({ container: "app" });
const camera = Camera(regl, {
  phi: -(3 * Math.PI) / 4,
  theta: (2 * Math.PI) / 4,
  distance: 1,
});

// This clears the color buffer to black and the depth buffer to 1
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

function Mesh({ count, normals, positions }) {
  this.count = count;
  this.normals = regl.buffer(normals);
  this.positions = regl.buffer(positions);
}

interface Uniforms {
  color: REGL.Vec3;
  lightDirection: REGL.Vec3;
  model: REGL.Mat4;
  noiseLevel: number;
  noiseModifier: number;
  shinyness: number;
}

interface Attributes {
  position: REGL.Vec2[];
  normal: REGL.Vec2[];
}

interface Props {
  color: REGL.Vec3;
  lightDirection: REGL.Vec3;
  model: REGL.Mat4;
  noiseLevel: number;
  rotate: boolean;
  shinyness: number;
}

Mesh.prototype.draw = regl<Uniforms, Attributes, Props>({
  attributes: {
    position: regl.this<typeof Mesh.prototype, "positions">("positions"),
    normal: regl.this<typeof Mesh.prototype, "normals">("normals"),
  },

  count: regl.this<typeof Mesh.prototype, "count">("count"),

  frag: glsl`
  precision mediump float;
  #pragma glslify: cookTorranceSpec = require('glsl-specular-cook-torrance')

  uniform mat4 model;
  uniform vec3 color, lightDirection;
  uniform float shinyness;
  uniform float noiseLevel, noiseModifier;
  varying vec3 vNormal, vPosition;
  void main () {
    vec3 normal = normalize((model * vec4(vNormal, 1)).xyz);

    float light = dot(normal, lightDirection);


    float surfaceBrightness = max(0., light);
    gl_FragColor = vec4(color * surfaceBrightness, 1);
  }`,

  vert: glsl`
  precision mediump float;
  #pragma glslify: noise = require('glsl-noise/simplex/4d')

  uniform mat4 model, projection, view;
  uniform float noiseLevel, noiseModifier;
  attribute vec3 normal, position;
  varying vec3 vNormal, vPosition;
  void main () {
    vec3 noisy_position = position + noiseLevel * noise(vec4(position, noiseModifier));

    gl_Position = projection * view * model * vec4(noisy_position, 4);

    vNormal = normal;
    vPosition = position;
  }`,

  uniforms: {
    color: (ctx, { color }) => color,
    lightDirection: (ctx, { lightDirection }) => lightDirection,
    model: ({ time }, { rotate }) =>
      mat4.rotateY([], mat4.identity([]), rotate ? time : 0),
    noiseLevel: (ctx, { noiseLevel }) => noiseLevel,
    noiseModifier: ({ time }) => time,
    shinyness: (ctx, { shinyness }) => shinyness,
  },
});

const res = await fetch("./chair.json");
const rawText = await res.text();

const stlData = rawText
  .split("\n")
  .map((line) => (line.length > 0 ? JSON.parse(line) : ""))
  .slice(2, -2);

const vertices = stlData.flatMap((f) =>
  f.vertices.map(({ x, y, z }) => [x, y, z])
);
const normals = stlData.map(({ normal: { x, y, z } }) => [x, y, z]);

const normalsExpanded = vertices.map((_, i) => normals[Math.floor(i / 3)]);

console.log("stl", vertices.length, normals.length, normalsExpanded);

const chairMesh = new Mesh({
  count: vertices.length,
  normals: normalsExpanded,
  positions: vertices,
});

const INPUTS = {
  mesh: "torus",
  color: { r: 1, g: 0, b: 0.1 },
  lightDirection: { x: 0.25, y: 1, z: 0.25 },
  rotate: false,
  noiseLevel: 0,
  shinyness: 0.8,
};
let inputsChanged = true;

const pane = new Pane({
  container: document.querySelector<HTMLElement>("#config") ?? undefined,
});

// @ts-expect-error 2339
pane.addBinding(INPUTS, "lightDirection", {
  min: -1,
  max: 1,
});

// @ts-expect-error 2339
pane.addBinding(INPUTS, "color", { color: { type: "float" } });

// @ts-expect-error 2339
pane.addBinding(INPUTS, "rotate");

// @ts-expect-error 2339
pane.addBinding(INPUTS, "noiseLevel", {
  min: 0,
  max: 1,
});

// @ts-expect-error 2339
pane.addBinding(INPUTS, "shinyness", {
  min: 0,
  max: 2,
});

// @ts-expect-error 2339
pane.on("change", () => {
  inputsChanged = true;
});

regl.frame(() => {
  // console.log("currentPrimitive", currentPrimitive);
  camera((cameraState) => {
    if (
      !cameraState.dirty &&
      !inputsChanged &&
      !INPUTS.rotate &&
      INPUTS.noiseLevel === 0
    )
      return;
    regl.clear({ color: [0, 0, 0, 1] });
    const { r, g, b } = INPUTS.color;
    const { x, y, z } = INPUTS.lightDirection;
    chairMesh.draw({
      color: [r, g, b],
      lightDirection: [x, y, z],
      rotate: INPUTS.rotate,
      noiseLevel: INPUTS.noiseLevel,
      shinyness: INPUTS.shinyness,
    });
    inputsChanged = false;
  });
});
