import { Node, Position } from "@xyflow/react";
import { CustomNodeProps } from "./types";

const normalizeNodes = (nodes: CustomNodeProps[]): Node[] => {
  const getBorderColor = (node: CustomNodeProps) => {
    if (!node.data) {
      return "#ebebeb";
    }

    if (node.data.selected && !node.data.group) {
      return "black";
    }

    if (Array.isArray(node.data.color)) {
      return getLinearGradientFromColorsArray(node.data.color);
    }

    return node.data.color || "#ebebeb";
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
      borderWidth: node.data.selected ? 3 : 1,
      background: "white",
      color: node.data ? node.data.textColor : "black",
      minWidth: node.width,
      padding: 10,
      borderRadius: node.data.type === 'Contact' ? 32 : 8,
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
    },
  }));
};

export default normalizeNodes;
