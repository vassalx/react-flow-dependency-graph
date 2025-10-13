import { Edge } from "@xyflow/react";

const getDescendants = (nodeId: string, edges: Edge[]) => {
  const children = new Set();
  const queue = [nodeId];

  while (queue.length) {
    const current = queue.shift();
    for (const edge of edges) {
      if (edge.source === current && !children.has(edge.target)) {
        children.add(edge.target);
        queue.push(edge.target);
      }
    }
  }

  return Array.from(children);
}

export default getDescendants;