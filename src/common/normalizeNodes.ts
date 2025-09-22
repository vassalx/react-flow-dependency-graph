import { Node, Position } from "@xyflow/react";
import getLinearGradientFromColorsArray from "./getLinearGradientFromColorsArray";
import { CustomNodeProps } from "./types";

const normalizeNodes = (nodes: CustomNodeProps[]): Node[] => {
  const getBorderColor = (node: CustomNodeProps) => {
    console.log(node.data.color);
    if (!node.data) {
      return "black";
    }

    if (Array.isArray(node.data.color)) {
      return getLinearGradientFromColorsArray(node.data.color);
    }
    return node.data.color || "black";
  };
  return nodes.map((node) => ({
    type: "custom",
    width: 150,
    handles: [{ x: 0, y: 0, position: "left" as Position, type: "source" }],
    ...node,
    position: node.position || { x: 0, y: 0 },
    style: {
      ...node.style,
      borderColor: getBorderColor(node),
      borderStyle: "solid",
      borderWidth: node.data.selected ? 6 : 3,
      background: "white",
      color: node.data ? node.data.textColor : "black",
      minWidth: node.width,
      padding: 10,
    },
  }));
};

export default normalizeNodes;
