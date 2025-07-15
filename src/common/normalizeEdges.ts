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

const normalizeEdges = (edges: CustomEdgeProps[]): Edge[] => {
  return edges.map((edge) => ({
    ...edge,
    markerEnd: edge.markerEnd && getEdgeMarker(edge.markerEnd),
    markerStart: edge.markerStart && getEdgeMarker(edge.markerStart),
    style: {
      ...edge.style,
      strokeDasharray: getStrokeDasharrayForEdgeLineType(edge.data?.lineType),
    },
  }));
};

export default normalizeEdges;
