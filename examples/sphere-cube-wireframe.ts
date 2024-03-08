import mat4 from "gl-mat4";
import createCamera from "perspective-camera";
import * as Primitives from "primitive-geometry";
import REGL from "regl";

import { getDrawFunction, getExpandedPrimitiveGeometry } from "./lib";

const icosphereGeometry = Primitives.icosphere({ subdivisions: 3 });
const expandedIcosphereGeometry =
  getExpandedPrimitiveGeometry(icosphereGeometry);

const regl = REGL({
  extensions: ["angle_instanced_arrays", "OES_standard_derivatives"],
});

const camera = createCamera({
  fov: Math.PI / 4,
  near: 0.01,
  far: 100,
  viewport: [0, 0, window.innerWidth, window.innerHeight],
});

camera.translate([0, 0, -5]);
camera.lookAt([0, 0, 0]);
camera.update();

const cubeGeometry = Primitives.cube();
const expandedCubeGeometry = getExpandedPrimitiveGeometry(cubeGeometry);

const drawSphere = getDrawFunction(regl, expandedIcosphereGeometry);
const drawCube = getDrawFunction(regl, expandedCubeGeometry);

regl.frame(function ({ time }) {
  regl.clear({
    color: [0, 0, 0, 1],
  });

  const projectionMatrix = camera.projView;
  const cubeModelMatrix = mat4.rotateX(
    [],
    mat4.rotateZ([], mat4.identity([]), time),
    time
  );
  const sphereModelMatrix = mat4.rotateY(
    [],
    mat4.rotateX([], mat4.identity([]), time),
    -time
  );

  drawCube({
    projectionMatrix,
    modelMatrix: mat4.rotateY([], mat4.identity([]), time),
  });
  drawSphere({
    projectionMatrix,
    modelMatrix: mat4.rotateY([], mat4.identity([]), time),
  });
});
