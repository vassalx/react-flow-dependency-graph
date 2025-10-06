import {
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  getSimpleBezierPath,
} from "@xyflow/react";
import { CustomEdgeProps } from "../common/types";
import { ReactNode } from "react";

interface EdgeLabelProps {
  transform?: string;
  label: string | ReactNode;
  hasBorder?: boolean;
}

const EdgeLabel = (props: EdgeLabelProps) => {
  const { transform, label, hasBorder } = props;
  return (
    <div
      style={{
        transform,
        borderRadius: 4,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 4,
        paddingRight: 4,
        fontSize: 12,
      }}
      className={`nodrag nopan app__custom-edge ${
        hasBorder ? "app__custom-edge__box" : ""
      }`}
    >
      {label}
    </div>
  );
};

const CustomEdge = (props: EdgeProps<CustomEdgeProps>) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    targetHandleId,
    sourceHandleId,
    label,
    data,
    selectable, // eslint-disable-line @typescript-eslint/no-unused-vars
    deletable, // eslint-disable-line @typescript-eslint/no-unused-vars
    pathOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...edgeProps
  } = props;
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getTranslateSourceHandle = () => {
    switch (sourceHandleId || sourcePosition) {
      case "left":
        return "translate(-100%, -75%)";
      case "bottom":
        return "translate(0%, 0%)";
      case "right":
        return "translate(0%, -25%)";
      case "top":
      default:
        return "translate(0%, -25%)";
    }
  };

  const getTranslateTargetHandle = () => {
    switch (targetHandleId || targetPosition) {
      case "left":
        return "translate(-100%, -25%)";
      case "bottom":
        return "translate(0%, 0%)";
      case "right":
        return "translate(0%, -25%)";
      case "top":
      default:
        return "translate(0%, -75%)";
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} {...edgeProps} />
      <EdgeLabelRenderer>
        {data?.sourceLabel && (
          <EdgeLabel
            transform={`${getTranslateSourceHandle()} translate(${sourceX}px,${sourceY}px)`}
            label={data.sourceLabel}
          />
        )}
        {data?.targetLabel && (
          <EdgeLabel
            transform={`${getTranslateTargetHandle()} translate(${targetX}px,${targetY}px)`}
            label={data.targetLabel}
          />
        )}
        {label && (
          <EdgeLabel
            label={label}
            transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
            hasBorder
          />
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
