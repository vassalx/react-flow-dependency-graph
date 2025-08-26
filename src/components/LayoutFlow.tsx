import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  useNodesInitialized,
  Edge,
  Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect, useState } from "react";
import { DiagramData, edgeTypes, nodeTypes } from "../common/types";
import DownloadButton from "./DownloadButton";
import SelectExample from "./SelectExample";
import getElkLayout, { ElkDirectionType } from "../common/getElkLayout";
import PositioningTools from "./PositionTools";

const LayoutFlow = () => {
  const { setNodes, setEdges, getNodes, getEdges, fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [direction, setDirection] = useState<ElkDirectionType>("LEFT");

  const updateELKLayout = async (oldNodes: Node[], oldEdges: Edge[]) => {
    const { nodes, edges } = await getElkLayout(oldNodes, oldEdges, direction);
    setNodes(nodes);
    setEdges(edges);
  };

  const handleSelectFile = async (data: DiagramData) => {
    await updateELKLayout(data.nodes, data.edges);
  };

  useEffect(() => {
    updateELKLayout(getNodes(), getEdges());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nodesInitialized) {
      window.requestAnimationFrame(() => fitView());
    }
  }, [nodesInitialized, direction, fitView]);

  return (
    <ReactFlow
      defaultNodes={[]}
      defaultEdges={[]}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={{ type: "smart" }}
    >
      <Background />
      <MiniMap pannable zoomable />
      <Controls />

      <Panel position="top-left" className="mr-10">
        <div className="w-full flex flex-wrap gap-2 pr-32">
          <DownloadButton />
          <SelectExample onSelectExample={handleSelectFile} />
        </div>
      </Panel>
      <Panel position="top-right">
        <PositioningTools
          selectedDirection={direction}
          onSelectDirection={(newDirection) => setDirection(newDirection)}
        />
      </Panel>
    </ReactFlow>
  );
};

export default LayoutFlow;
