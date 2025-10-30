import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react";
import { ReactNode, useEffect, useState } from "react";
import { CustomNodeProps } from "../common/types";
import UserIcon from "./icons/UserIcon";
import getLinearGradientFromColorsArray from "../common/getLinearGradientFromColorsArray";
import { CustomButton } from "./CustomButton";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import { useRoll } from "../context/RollContext";

const CustomNode = (props: NodeProps<CustomNodeProps>) => {
  const { data, id, sourcePosition, targetPosition } = props;
  const [label, setLabel] = useState<string | ReactNode>(data.label);
  const updateNodeInternals = useUpdateNodeInternals();

  const { onRollDown, onRollUp } = useRoll();

  useEffect(() => {
    updateNodeInternals(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sourcePosition, targetPosition]);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleNodeClick = () => {
    window.parent.postMessage({ type: "OPEN_ACCOUNT", accountId: id }, "*");
  };

  const getBorderColor = (node: NodeProps<CustomNodeProps>) => {
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

  return (
    <div
      style={{
        boxSizing: "border-box",
        textAlign: "left",
        fontSize: 12,
        borderColor: getBorderColor(props),
        borderStyle: data.borderStyle || "solid",
        borderWidth: props.data.selected ? 4 : 2,
        background: "white",
        color: props.data ? props.data.textColor : "black",
        minWidth: props.width,
        padding: 10,
        borderRadius: props.data.type === "Contact" ? 36 : 12,
        boxShadow: "0px 0px 6px 2px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex items-center gap-2">
        {data.type === "Contact" ? (
          <div className="flex items-center justify-center rounded-full bg-gray-200 w-[36px] h-[36px] flex-none text-lg">
            <UserIcon />
          </div>
        ) : null}

        <div className="flex flex-col flex-1 [word-break:break-word]" onClick={handleNodeClick}>
          {label}
          <Handle type="source" position={Position.Top} id="top" />
          <Handle type="source" position={Position.Right} id="right" />
          <Handle type="source" position={Position.Bottom} id="bottom" />
          <Handle type="source" position={Position.Left} id="left" />
          {data.group ? (
            <div className="font-bold text-gray-500">CG: {data.group}</div>
          ) : null}
        </div>
        <CustomButton
          label={data.collapsed?.length ? <PlusIcon /> : <MinusIcon />}
          size="xs"
          className="border"
          round="full"
          onClick={() => {
            if (data.collapsed?.length) {
              onRollDown(id);
            } else {
              onRollUp(id);
            }
          }}
        />
      </div>
    </div>
  );
};

export default CustomNode;
