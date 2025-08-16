import {
  BuiltInEdge,
  BuiltInNode,
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
} from "@xyflow/react";
import CustomEdge from "../components/CustomEdge";
import CustomNode from "../components/CustomNode";
import { ReactNode } from "react";

export type EdgeLineType = "solid" | "dotted" | "dashed" | "solid-dotted";

export interface DiagramData {
  edges: Edge[];
  nodes: Node[];
}

export type CustomNodeProps = Node<
  {
    label: string | ReactNode;
    color?: string | string[];
    textColor?: string;
    link?: string;
  },
  "custom"
>;

export type CustomEdgeProps = Edge<
  {
    sourceLabel?: string | ReactNode;
    targetLabel?: string | ReactNode;
    lineType?: EdgeLineType;
  },
  "custom"
>;

export const edgeTypes = {
  custom: CustomEdge,
} satisfies EdgeTypes;

export const nodeTypes = {
  custom: CustomNode,
} satisfies NodeTypes;

export type AppNode = BuiltInEdge | CustomEdgeProps;
export type AppEdge = BuiltInNode | CustomNodeProps;
