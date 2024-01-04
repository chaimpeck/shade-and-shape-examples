export const EXAMPLES = [
  {
    description: "Render a simple triangle.",
    name: "Triangle",
    sourceHtml: "examples/triangle.html",
    source: "examples/triangle.ts",
  },
  {
    description: "Render multiple triangles.",
    name: "Triangles",
    sourceHtml: "examples/triangles.html",
    source: "examples/triangles.ts",
  },
];

export type Example = (typeof EXAMPLES)[0];
