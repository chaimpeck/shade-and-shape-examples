import { SimplicialComplex } from "primitive-geometry/types/types";

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
