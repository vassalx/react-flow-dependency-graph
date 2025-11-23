import { Edge } from "@xyflow/react";

const getAncestors = (nodeId: string, edges: Edge[]) => {
  const parents = new Set();
  const queue = [nodeId];

  while (queue.length) {
    const current = queue.shift();
    for (const edge of edges) {
      if (!edge.hidden && edge.target === current && !parents.has(edge.source)) {
        parents.add(edge.source);
        queue.push(edge.source);
      }
    }
  }

  return Array.from(parents);
}

export default getAncestors;