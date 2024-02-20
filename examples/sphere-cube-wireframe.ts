import REGL from "regl";

const regl = REGL();

interface DrawProps {
  modelMatrix: REGL.Mat4;
  projectionMatrix: REGL.Mat4;
}

interface Uniforms {
  modelMatrix: REGL.Mat4;
  projectionMatrix: REGL.Mat4;
  time: number;
}

interface Attributes {
  position: REGL.Vec2[];
  normal: REGL.Vec3[];
  barycentric: REGL.Vec3[];
}

const drawShape = regl<
  Uniforms,
  Attributes,
  {},
  {},
  { projectionMatrix: REGL.Mat4 }
>({
  vert: `
      precision mediump float;
  
      uniform mat4 modelMatrix, projectionMatrix;
      uniform float time;
      attribute vec3 position, normal, barycentric, offset;
      
      varying vec3 vColor, vBarycentric;
      
      void main() {
        vBarycentric = barycentric;
        vec4 modelPosition =modelMatrix
          * vec4(
            position + noise(vec3(
              position.x * (cos(time) + 1.),
              position.y * (sin(time) + 1.),
              position.z
            )) - offset * .02,
            2.
          );
        gl_Position = projectionMatrix * modelPosition;
        vColor = vec3(.5 - modelPosition.z) * (normal * .5 + .5);
      }
    `,

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
    position: ({ position }) => position,
    normal: expandedPrimitiveGeometry.normals,
    barycentric: expandedPrimitiveGeometry.barycentric,
  },

  uniforms: {
    time: ({ time }) => time,
    modelMatrix: regl.prop<DrawProps, "modelMatrix">("modelMatrix"),
    projectionMatrix: ({ projectionMatrix }) => projectionMatrix,
  },

  count: expandedPrimitiveGeometry.count,
  instances: N * N,
});
