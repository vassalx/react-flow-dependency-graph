import { Node, Position } from "@xyflow/react";
import { CustomNodeProps } from "./types";

const normalizeNodes = (nodes: CustomNodeProps[]): Node[] => {
  return nodes.map((node) => ({
    type: "custom",
    width: 150,
    handles: [{ x: 0, y: 0, position: "left" as Position, type: "source" }],
    ...node,
    position: node.position || { x: 0, y: 0 },
  }));
};

export default normalizeNodes;
