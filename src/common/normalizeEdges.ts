import { Edge, EdgeMarkerType, MarkerType } from "@xyflow/react";
import { CustomEdgeProps, EdgeLineType } from "./types";
import { CSSProperties } from "react";

const defaultMarkerTypes = new Set([MarkerType.Arrow, MarkerType.ArrowClosed]);

const getStrokeDasharrayForEdgeLineType = (lineType?: EdgeLineType): string => {
  switch (lineType) {
    case "dashed":
      return "4";
    case "dotted":
      return "1 4";
    case "solid-dotted":
      return "40 4 4 4";
    case "solid":
    default:
      return "";
  }
};

const getEdgeMarker = (
  marker: EdgeMarkerType,
  style?: CSSProperties
): EdgeMarkerType => {
  const defaultMarkerProps = {
    width: 20,
    height: 20,
    color: (style && style.stroke) || "#000",
  };
  if (typeof marker === "object") {
    return {
      ...defaultMarkerProps,
      ...marker,
    };
  }
  if (defaultMarkerTypes.has(marker as MarkerType)) {
    return {
      ...defaultMarkerProps,
      type: marker as MarkerType,
    };
  }
  return marker;
};

const removeDuplicateEdges = (edges: CustomEdgeProps[]): CustomEdgeProps[] => {
  const seen = new Set();

  return edges.filter(edge => {
    // Create a sorted pair so direction doesn't matter
    const nodePair = [edge.source, edge.target].sort().join('|');
    const key = `${nodePair}|${edge.label}`;

    if (seen.has(key)) {
      return false; // duplicate
    }

    seen.add(key);
    return true; // keep
  });
}

const normalizeEdges = (edges: CustomEdgeProps[]): Edge[] => {
  return removeDuplicateEdges(edges).map((edge) => ({
    ...edge,
    markerEnd: edge.markerEnd && getEdgeMarker(edge.markerEnd),
    markerStart: edge.markerStart && getEdgeMarker(edge.markerStart),
    style: {
      ...edge.style,
      strokeDasharray: getStrokeDasharrayForEdgeLineType(edge.data?.lineType),
      strokeWidth: 1.5,
    },
  }));
};

export default normalizeEdges;
