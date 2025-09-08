import { Node, Position } from "@xyflow/react";
import getLinearGradientFromColorsArray from "./getLinearGradientFromColorsArray";
import { CustomNodeProps } from "./types";

const normalizeNodes = (nodes: CustomNodeProps[]): Node[] => {
  const getBackground = (node: CustomNodeProps) => {
    if (!node.data) {
      return "white";
    }

    if (Array.isArray(node.data.color)) {
      return getLinearGradientFromColorsArray(node.data.color);
    }
    return node.data.color || "white";
  };
  return nodes.map((node) => ({
    type: "custom",
    width: 150,
    handles: [{ x: 0, y: 0, position: "left" as Position, type: "source" }],
    ...node,
    position: node.position || { x: 0, y: 0 },
    style: {
      ...node.style,
      background: getBackground(node),
      color: node.data ? node.data.textColor : "black",
    },
  }));
};

export default normalizeNodes;
