import data1 from "../../assets/data1.json";
import data2 from "../../assets/data2.json";
import data3 from "../../assets/data3.json";
import data4 from "../../assets/data4.json";
import addColorsToNodes from "./addColorToNodex";
import normalizeEdges from "./normalizeEdges";
import normalizeNodes from "./normalizeNodes";
import { CustomEdgeProps, CustomNodeProps } from "./types";

export const dataExample1 = {
  edges: normalizeEdges(data1.edges as CustomEdgeProps[]),
  nodes: normalizeNodes(addColorsToNodes(data1.nodes as CustomNodeProps[], data1.edges as CustomEdgeProps[])),
};

export const dataExample2 = {
  edges: normalizeEdges(data2.edges as CustomEdgeProps[]),
  nodes: normalizeNodes(data2.nodes as CustomNodeProps[]),
};

export const dataExample3 = {
  edges: normalizeEdges(data3.edges as CustomEdgeProps[]),
  nodes: normalizeNodes(data3.nodes as CustomNodeProps[]),
};

export const dataExample4 = {
  edges: normalizeEdges(data4.edges as CustomEdgeProps[]),
  nodes: normalizeNodes(data4.nodes as CustomNodeProps[]),
};

export const dataExamples = [
  dataExample1,
  dataExample2,
  dataExample3,
  dataExample4,
];
