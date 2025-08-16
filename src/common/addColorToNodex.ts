import { CustomEdgeProps, CustomNodeProps } from "./types";

const addColorsToNodes = (
  nodes: CustomNodeProps[],
  edges: CustomEdgeProps[]
) => {
  // Count degree for each node
  const degree: {[key: string]: number} = {};
  edges.forEach(edge => {
    degree[edge.source] = (degree[edge.source] || 0) + 1;
    degree[edge.target] = (degree[edge.target] || 0) + 1;
  });

  const maxDegree = Math.max(...Object.values(degree), 1); // avoid division by zero

  nodes.forEach(node => {
    if (node.data.color) return; // keep existing colors

    const d = degree[node.id] || 0;
    const ratio = d / maxDegree; // 0..1

    // Target green = #50C878 → RGB(80, 200, 120)
    const r = Math.round(255 - (255 - 80) * ratio);
    const g = Math.round(255 - (255 - 200) * ratio);
    const b = Math.round(255 - (255 - 120) * ratio);

    const color =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    node.data.color = color;
  });

  return nodes;
};
export default addColorsToNodes;
