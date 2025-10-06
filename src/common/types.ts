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
import SimpleFloatingEdge from "../components/SimpleFloatingEdge";

export type EdgeLineType = "solid" | "dotted" | "dashed" | "solid-dotted";

export interface DiagramData {
  edges: Edge[];
  nodes: Node[];
  id?: string;
  legend?: { [key: string]: string };
}

export type CustomNodeProps = Node<
  {
    label: string | ReactNode;
    color?: string | string[];
    textColor?: string;
    id?: string;
    group?: string;
    selected?: boolean;
    type?: string
    borderStyle?: string;
  },
  "custom"
>;

export type CustomEdgeProps = Edge<
  {
    sourceLabel?: string | ReactNode;
    targetLabel?: string | ReactNode;
    lineType?: EdgeLineType;
    selected?: boolean;
  },
  "custom"
>;

export const edgeTypes = {
  custom: CustomEdge,
  floating: SimpleFloatingEdge,
} satisfies EdgeTypes;

export const nodeTypes = {
  custom: CustomNode,
} satisfies NodeTypes;

export type AppNode = BuiltInEdge | CustomEdgeProps;
export type AppEdge = BuiltInNode | CustomNodeProps;
