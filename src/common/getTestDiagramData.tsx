import addColorsToNodes from "./addColorToNodex";
import normalizeEdges from "./normalizeEdges";
import normalizeNodes from "./normalizeNodes";
import { CustomEdgeProps, CustomNodeProps, DiagramData } from "./types";

const getTestDiagramData = (): DiagramData => {
  const edges = [
    {
      id: "e1",
      source: "2",
      target: "1",
      label: "CEO of",
      data: { lineType: "dashed" },
    },

    {
      id: "e2",
      source: "3a",
      target: "3",
      label: "Leads",
      data: { lineType: "dashed" },
    },
    {
      id: "e3",
      source: "4a",
      target: "4",
      label: "Leads",
      data: { lineType: "dashed" },
    },
    {
      id: "e4",
      source: "5a",
      target: "5",
      label: "Leads",
      data: { lineType: "dashed" },
    },
    {
      id: "e5",
      source: "6a",
      target: "6",
      label: "Leads",
      data: { lineType: "dashed" },
    },
    {
      id: "e6",
      source: "7a",
      target: "7",
      label: "CEO of",
      data: { lineType: "dashed" },
    },
    {
      id: "e7",
      source: "8a",
      target: "8",
      label: "CEO of",
      data: { lineType: "dashed" },
    },

    { id: "e8", source: "1", target: "3" },
    { id: "e9", source: "1", target: "4" },
    { id: "e10", source: "1", target: "5" },
    { id: "e11", source: "1", target: "6" },
    { id: "e12", source: "1", target: "7" },
    { id: "e13", source: "1", target: "8" },
  ] as CustomEdgeProps[];
  const nodes = [
    {
      id: "1",
      data: {
        label: "Microsoft Corporation",
        link: "https://www.microsoft.com/uk-ua/",
        group: "1",
      },
    },
    { id: "2", data: { label: "Satya Nadella - CEO", type: "Contact" } },

    {
      id: "3",
      data: { label: "Azure (Cloud Services)", group: "1", selected: true },
    },
    {
      id: "3a",
      data: { label: "Scott Guthrie - EVP, Cloud & AI", type: "Contact" },
    },

    { id: "4", data: { label: "Windows & Devices" } },
    {
      id: "4a",
      data: {
        label: "Panos Panay - EVP, Windows & Devices",
        type: "Contact",
      },
    },

    {
      id: "5",
      data: { label: "Office & Productivity" },
    },
    {
      id: "5a",
      data: { label: "Rajesh Jha - EVP, Office & Teams", type: "Contact" },
    },

    {
      id: "6",
      data: { label: "Gaming (Xbox, Activision)" },
    },
    {
      id: "6a",
      data: { label: "Phil Spencer - CEO, Gaming", type: "Contact" },
    },

    {
      id: "7",
      data: {
        label: "LinkedIn",
        link: "https://www.linkedin.com/feed/",
        group: "1",
      },
    },
    {
      id: "7a",
      data: { label: "Ryan Roslansky - CEO, LinkedIn", type: "Contact" },
    },
    {
      id: "8",
      data: { label: "GitHub", link: "https://github.com/", group: "1" },
    },
    {
      id: "8a",
      data: { label: "Thomas Dohmke - CEO, GitHub", type: "Contact" },
    },
  ] as CustomNodeProps[];
  return {
    edges: normalizeEdges(edges),
    nodes: normalizeNodes(
      addColorsToNodes(nodes, {
        "1": "hsl(228, 45%, 80%)",
      })
    ),
    id: "1",
    legend: {
      "1": "hsl(228, 45%, 80%)",
    },
  };
};

export default getTestDiagramData;