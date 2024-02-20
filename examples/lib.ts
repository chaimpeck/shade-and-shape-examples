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

  const zPositions = new Array<[number, number]>();
  for (let i = 0; i < expandedPositions.length / 9; i++) {
    zPositions.push([
      i,
      Math.max(
        expandedPositions[i * 3 + 2],
        expandedPositions[i * 3 + 6],
        expandedPositions[i * 3 + 8]
      ),
    ]);
  }

  return {
    barycentric: barycentric,
    positions: expandedPositions,
    normals: expandedNormals,
    count: expandedPositions.length / 3,
  };
}

export type ExpandedPrimitiveGeometry = ReturnType<
  typeof getExpandedPrimitiveGeometry
>;
