import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  Edge,
  Node,
  ReactFlowInstance,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect, useState } from "react";
import {
  DiagramData,
  edgeTypes,
  nodeTypes,
} from "../common/types";
import DownloadButton from "./DownloadButton";
import SelectExample from "./SelectExample";
import getElkLayout, { ElkDirectionType } from "../common/getElkLayout";
import PositioningTools from "./PositionTools";
import DiagramLegend from "./DiagramLegend";

const localStorageDirKey = "dir_";

const LayoutFlow = () => {
  const { setNodes, setEdges, setViewport } = useReactFlow();
  const [direction, setDirection] = useState<ElkDirectionType>("LEFT");
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const [id, setId] = useState<string>("");

  const updateELKLayout = async (oldNodes: Node[], oldEdges: Edge[]) => {
    const { nodes, edges } = await getElkLayout(oldNodes, oldEdges, direction);
    setNodes(nodes);
    setEdges(edges);
  };

  const equalNodesData = (nodesA: Node[], nodesB: Node[]) => {
    if (nodesA.length != nodesB.length) {
      return false;
    }

    const a1 = nodesA.sort((a1, b1) => a1.id.localeCompare(b1.id)).map((node) => node.data);
    const a2 = nodesB.sort((a1, b1) => a1.id.localeCompare(b1.id)).map((node) => node.data);

    return JSON.stringify(a1) === JSON.stringify(a2);
  };

  const handleSelectFile = async (data: DiagramData) => {
    setId(data.id || "");
    const flowData = data.id ? localStorage.getItem(data.id) : null;
    const flow = flowData ? JSON.parse(flowData) : null;
    if (flow && equalNodesData(flow.nodes, data.nodes)) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setViewport({ x, y, zoom });
      return;
    } else {
      await updateELKLayout(data.nodes, data.edges);
    }
  };

  const onSave = () => {
    if (rfInstance && id) {
      const flow = rfInstance.toObject();
      localStorage.setItem(id, JSON.stringify(flow));
    }
  };

  useEffect(() => {
    if (id) {
      const newDir = localStorage.getItem(localStorageDirKey + id);
      if (newDir) {
        setDirection(newDir as ElkDirectionType);
      }
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(localStorageDirKey + id, direction);
      onSave();
    }
  }, [direction]);

  return (
    <ReactFlow
      defaultNodes={[]}
      defaultEdges={[]}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeDragStop={onSave}
      onInit={setRfInstance}
    >
      <Background />
      <div className="hidden sm:block">
        <MiniMap pannable zoomable />
      </div>
      <Panel position="top-left" className="mr-10">
        <div className="w-full flex flex-wrap gap-2 pr-32">
          <DownloadButton />
          <SelectExample onSelectExample={handleSelectFile} />
        </div>
      </Panel>
      <Panel position="top-right">
        <PositioningTools
          selectedDirection={direction}
          onSelectDirection={(newDirection) => {
            setDirection(newDirection);
          }}
        />
      </Panel>
      <Panel position="bottom-left">
        <DiagramLegend />
      </Panel>
      <Controls className="bg-white" />
    </ReactFlow>
  );
};

export default LayoutFlow;
