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
import { dataExample1 } from "../common/defaultData";
import { DiagramData, edgeTypes, nodeTypes } from "../common/types";
import DownloadButton from "./DownloadButton";
// import UploadButton from "./UploadButton";
import SelectExample from "./SelectExample";
import getElkLayout, { ElkDirectionType } from "../common/getElkLayout";
import PositioningTools from "./PositionTools";
// import normalizeNodes from "../common/normalizeNodes";
// import normalizeEdges from "../common/normalizeEdges";

// const FileUploadMessageAction = 'renderDiagram'

const LayoutFlow = () => {
  const { setNodes, setEdges, getNodes, getEdges, fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [direction, setDirection] = useState<ElkDirectionType>("DOWN");

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

  // useEffect(() => {
  //     const handleMessage = (event: MessageEvent) => {
  //       console.log("1", event.data);
  //         if (event.data && event.data.action === FileUploadMessageAction) {
  //           console.log("nodes and edges", event.data.data);
  //             handleSelectFile({
  //               nodes: normalizeNodes(event.data.data.nodes),
  //               edges: normalizeEdges(event.data.data.edges)
  //             })
  //         }
  //     }
  //     window.addEventListener('message', handleMessage);
  //     return () => window.removeEventListener('message', handleMessage);
  // }, []);

  return (
    <ReactFlow
      defaultNodes={dataExample1.nodes}
      defaultEdges={dataExample1.edges}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={{ type: "custom" }}
    >
      <Background />
      <MiniMap pannable zoomable />
      <Controls />

      <Panel position="top-left" className="mr-10">
        <div className="w-full flex flex-wrap gap-2 pr-32">
          <DownloadButton />
          {/* <UploadButton handleFileUpload={handleSelectFile} /> */}
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
