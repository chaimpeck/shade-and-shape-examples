export const EXAMPLES = [
  {
    description: "Render a simple triangle.",
    name: "Triangle",
    sourceHtml: "examples/triangle.html",
    source: "examples/triangle.ts",
  },
  // {
  //   description: "Render multiple triangles.",
  //   name: "Triangles",
  //   sourceHtml: "examples/triangles.html",
  //   source: "examples/triangles.ts",
  // },
  {
    description: "Render a Sphere.",
    name: "Sphere",
    sourceHtml: "examples/sphere.html",
    source: "examples/sphere.ts",
  },
  {
    description: "Render a Sphere with Normals.",
    name: "Sphere with Normals",
    sourceHtml: "examples/sphere-with-normals.html",
    source: "examples/sphere-with-normals.ts",
  },
  {
    description:
      "Adds a camera to the view and allows to switch between primitives.",
    name: "Primitives with Camera",
    sourceHtml: "examples/primitives-with-camera.html",
    source: "examples/primitives-with-camera.ts",
  },
  {
    description: "Adds lighting and color selection.",
    name: "Primitives with Lighting",
    sourceHtml: "examples/primitives-with-lighting.html",
    source: "examples/primitives-with-lighting.ts",
  },
  {
    description: "Adds optional noise.",
    name: "Primitives with noise",
    sourceHtml: "examples/primitives-with-noise.html",
    source: "examples/primitives-with-noise.ts",
  },
  // {
  //   description: "A wireframe of sphere in a wireframe of a cube.",
  //   name: "Sphere / Cube Wireframe",
  //   sourceHtml: "examples/sphere-cube-wireframe.html",
  //   source: "examples/sphere-cube-wireframe.ts",
  // },
];

export type Example = (typeof EXAMPLES)[0];
