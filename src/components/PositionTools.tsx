import { ElkDirectionType } from "../common/getElkLayout";
import TreeIcon from "./TreeIcon";

interface PositioningToolsProps {
  selectedDirection: ElkDirectionType;
  onSelectDirection: (direction: ElkDirectionType) => void;
}

const PositioningTools = (props: PositioningToolsProps) => {
  const { selectedDirection, onSelectDirection } = props;
  return (
    <div className="flex gap-2 right-5 z-40">
      <TreeIcon
        direction="LEFT"
        isSelected={selectedDirection === "LEFT"}
        onClick={() => onSelectDirection("LEFT")}
      />
      <div className="flex flex-col gap-2">
        <TreeIcon
          direction="UP"
          isSelected={selectedDirection === "UP"}
          onClick={() => onSelectDirection("UP")}
        />
        <TreeIcon
          isSelected={selectedDirection === "DOWN"}
          onClick={() => onSelectDirection("DOWN")}
        />
      </div>
      <TreeIcon
        direction="RIGHT"
        isSelected={selectedDirection === "RIGHT"}
        onClick={() => onSelectDirection("RIGHT")}
      />
    </div>
  );
};

export default PositioningTools;
