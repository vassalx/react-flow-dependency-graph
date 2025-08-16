import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react";
import { ReactNode, useEffect, useState } from "react";
import { CustomNodeProps } from "../common/types";

const CustomNode = (props: NodeProps<CustomNodeProps>) => {
  const { data, id, width, selected, sourcePosition, targetPosition } = props;
  const [label, setLabel] = useState<string | ReactNode>(data.label);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sourcePosition, targetPosition]);

  const onChangeLabel = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLabel(event.target.value);
  };

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

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
    >
      {data.link ? (
        <a
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
          target="_blank"
          href={data.link}
        >
          ↗️
        </a>
      ) : null}
      {selected ? (
        <textarea
          className="block p-1 w-full text-sm bg-gray-50 rounded-sm border border-gray-300"
          id="w3review"
          name="w3review"
          defaultValue={typeof label === "string" ? label : ""}
          rows={2}
          cols={50}
          onChange={onChangeLabel}
        />
      ) : (
        label
      )}
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
