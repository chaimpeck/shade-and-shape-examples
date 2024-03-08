import glsl from "glslify";
import { SimplicialComplex } from "primitive-geometry/types/types";
import REGL from "regl";

interface DrawProps {
  modelMatrix: number[];
  projectionMatrix: number[];
}

export function getExpandedPrimitiveGeometry(geometry: SimplicialComplex) {
  const expandedPositions = Array.from(geometry.cells)
    .map((i) => Array.from(geometry.positions.slice(i * 3, i * 3 + 3)))
    .flat();
  const expandedNormals = Array.from(geometry.cells)
    .map((i) => Array.from(geometry.normals.slice(i * 3, i * 3 + 3)))
    .flat();
  const barycentric = Array(expandedPositions.length / 9)
    .fill([1, 0, 0, 0, 1, 0, 0, 0, 1])
    .flat();

  return {
    barycentric,
    positions: expandedPositions,
    normals: expandedNormals,
    count: expandedPositions.length / 3,
  };
}

export type ExpandedPrimitiveGeometry = ReturnType<
  typeof getExpandedPrimitiveGeometry
>;

const N = 1;

export const getDrawFunction = (
  regl: REGL.Regl,
  expandedPrimitiveGeometry: ExpandedPrimitiveGeometry
) =>
  regl({
    vert: glsl(`
      #pragma glslify: noise = require('glsl-noise/simplex/3d')

      precision mediump float;
  
      uniform mat4 modelMatrix, projectionMatrix;
      uniform float time;
      attribute vec3 position, normal, barycentric, offset;
      
      varying vec3 vColor, vBarycentric;
      
      void main() {
        vBarycentric = barycentric;
        vec4 modelPosition = modelMatrix
          * vec4(
            position + 0. * noise(vec3(
              position.x * (cos(time) + 1.),
              position.y * (sin(time) + 1.),
              position.z
            )) - offset * .02,
            2.
          );
        gl_Position = projectionMatrix * modelPosition;
        vColor = vec3(.5 - modelPosition.z) * (normal * .5 + .5);
      }
    `),

    frag: `
      #extension GL_OES_standard_derivatives : enable
      precision mediump float;
  
      varying vec3 vColor, vBarycentric;

      void main() {
        vec3 d = fwidth(vBarycentric);
        vec3 f = smoothstep(d, d + .001, vBarycentric);
        float edge_width = min(min(f.x, f.y), f.z);
  
        gl_FragColor = mix(
          vec4(vColor, 1.0),
          vec4(vColor, 0.1),
          smoothstep(0., 1., edge_width)
        );
      }
    `,

    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: "src alpha",
        dstRGB: "dst alpha",
        dstAlpha: "dst alpha",
      },
    },

    depth: {
      enable: false,
    },

    attributes: {
      position: expandedPrimitiveGeometry.positions,
      normal: expandedPrimitiveGeometry.normals,
      barycentric: expandedPrimitiveGeometry.barycentric,
      offset: {
        buffer: regl.buffer(
          Array(N * N)
            .fill(undefined)
            .map((_, i) => {
              const x = (-1 + (2 * Math.floor(i / N)) / N) * 120;
              const z = (-1 + (2 * (i % N)) / N) * 120;
              return [x, 0.0, z];
            })
        ),
        divisor: 1,
      },
    },

    uniforms: {
      time: ({ time }) => time,
      modelMatrix: regl.prop<DrawProps, "modelMatrix">("modelMatrix"),
      projectionMatrix: regl.prop<DrawProps, "projectionMatrix">(
        "projectionMatrix"
      ),
    },

    count: expandedPrimitiveGeometry.count,
    instances: N * N,
  });
