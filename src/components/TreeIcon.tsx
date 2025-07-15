import { useCallback } from "react";
import getElkLayout, { ElkDirectionType } from "../common/getElkLayout";
import { useReactFlow } from "@xyflow/react";

export type TreeIconProps = {
  direction?: ElkDirectionType;
  isSelected?: boolean;
  onClick?: () => void;
};

const TreeIcon = (props: TreeIconProps) => {
  const { direction = "DOWN", isSelected, onClick } = props;
  const { setNodes, setEdges, getNodes, getEdges, fitView } = useReactFlow();
  const handleClick = useCallback(async () => {
    const { nodes, edges } = await getElkLayout(
      getNodes(),
      getEdges(),
      direction
    );
    setNodes(nodes);
    setEdges(edges);
    fitView();
    if (onClick) {
      onClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, getNodes, getEdges, setNodes, setEdges, fitView]);
  const isRight = direction === "RIGHT";
  const isLeft = direction === "LEFT";
  const isUp = direction === "UP";

  return (
    <button
      onClick={handleClick}
      className={`p-2 h-10 w-10 m-auto ${
        isSelected ? "border" : ""
      } shadow rounded bg-white hover:bg-gray-300 hover:scale-110`}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        version="1.1"
        viewBox="0 0 16 16"
        height="1.25em"
        width="1.25em"
        xmlns="http://www.w3.org/2000/svg"
        className={`${isRight && "-rotate-90"}
        ${isLeft && "rotate-90"}
        ${isUp && "rotate-180"}`}
      >
        <path d="M15.25 12h-0.25v-3.25c0-0.965-0.785-1.75-1.75-1.75h-4.25v-2h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v2h-4.25c-0.965 0-1.75 0.785-1.75 1.75v3.25h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.413 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.337-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75zM3 15h-2v-2h2v2zM9 15h-2v-2h2v2zM7 4v-2h2v2h-2zM15 15h-2v-2h2v2z"></path>
      </svg>
    </button>
  );
};

export default TreeIcon;
