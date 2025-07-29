import { Node, Position } from "@xyflow/react";
import getLinearGradientFromColorsArray from "./getLinearGradientFromColorsArray";
import { CustomNodeProps } from "./types";

const normalizeNodes = (nodes: CustomNodeProps[]): Node[] => {
  return nodes.map((node) => ({
    type: "custom",
    width: 150,
    handles: [{ x: 0, y: 0, position: "left" as Position, type: "source" }],
    ...node,
    position: node.position || { x: 0, y: 0 },
    style: {
      ...node.style,
      background: Array.isArray(node.data.color)
        ? getLinearGradientFromColorsArray(node.data.color)
        : (node.data.color || "white"),
      color: node.data.textColor,
    },
  }));
};

export default normalizeNodes;
