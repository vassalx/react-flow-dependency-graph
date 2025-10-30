import { Node } from "@xyflow/react";

const compareNodesData = (nodesA: Node[], nodesB: Node[]) => {
  if (nodesA.length != nodesB.length) {
    return false;
  }

  const a1 = nodesA
    .sort((a1, b1) => a1.id.localeCompare(b1.id))
    .map((node) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { collapsed, ...rest } = node.data;
      return { id: node.id, data: rest };
    });
  const a2 = nodesB
    .sort((a1, b1) => a1.id.localeCompare(b1.id))
    .map((node) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { collapsed, ...rest } = node.data;
      return { id: node.id, data: rest };
    });

  return JSON.stringify(a1) === JSON.stringify(a2);
};

export default compareNodesData;
