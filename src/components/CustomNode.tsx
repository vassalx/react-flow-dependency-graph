import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react";
import { ReactNode, useEffect, useState } from "react";
import { CustomNodeProps } from "../common/types";

const CustomNode = (props: NodeProps<CustomNodeProps>) => {
  const { data, id, width, sourcePosition, targetPosition } = props;
  const [label, setLabel] = useState<string | ReactNode>(data.label);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sourcePosition, targetPosition]);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleNodeClick = () => {
    window.parent.postMessage(
      { type: "OPEN_ACCOUNT", accountId: id },
      "*"
    );
  };

  return (
    <div
      style={{
        minWidth: width,
        padding: 10,
        border: "1px solid black",
        boxSizing: "border-box",
        textAlign: "center",
        fontSize: 12,
      }}
      onClick={handleNodeClick}
    >
      {label}
      <>
        {sourcePosition === "bottom" ? (
          <Handle type="source" position={Position.Bottom} id="bottom" />
        ) : null}
        {targetPosition === "bottom" ? (
          <Handle type="target" position={Position.Bottom} id="bottom" />
        ) : null}
        {sourcePosition === "left" ? (
          <Handle type="source" position={Position.Left} id="left" />
        ) : null}
        {targetPosition === "left" ? (
          <Handle type="target" position={Position.Left} id="left" />
        ) : null}
        {sourcePosition === "top" ? (
          <Handle type="source" position={Position.Top} id="top" />
        ) : null}
        {targetPosition === "top" ? (
          <Handle type="target" position={Position.Top} id="top" />
        ) : null}
        {sourcePosition === "right" ? (
          <Handle type="source" position={Position.Right} id="right" />
        ) : null}
        {targetPosition === "right" ? (
          <Handle type="target" position={Position.Right} id="right" />
        ) : null}
      </>
    </div>
  );
};

export default CustomNode;
