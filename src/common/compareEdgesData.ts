import { Edge } from "@xyflow/react";

const compareEdgesData = (edgesA: Edge[], edgesB: Edge[]) => {
  if (edgesA.length != edgesB.length) {
    return false;
  }

  const a1 = edgesA
    .sort((a1, b1) => a1.id.localeCompare(b1.id))
    .map((edge) => edge.data);
  const a2 = edgesB
    .sort((a1, b1) => a1.id.localeCompare(b1.id))
    .map((edge) => edge.data);

  return JSON.stringify(a1) === JSON.stringify(a2);
};

export default compareEdgesData;
