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
  CustomEdgeProps,
  CustomNodeProps,
  DiagramData,
  edgeTypes,
  nodeTypes,
} from "../common/types";
import DownloadButton from "./DownloadButton";
import SelectExample from "./SelectExample";
import getElkLayout, { ElkDirectionType } from "../common/getElkLayout";
import PositioningTools from "./PositionTools";
import DiagramLegend from "./DiagramLegend";
import LoadingOverlay from "./LoadingOverlay";
import normalizeEdges from "../common/normalizeEdges";
import normalizeNodes from "../common/normalizeNodes";

const localStorageDirKey = "dir_";
const localStorageDraggableKey = "draggable"

const LayoutFlow = () => {
  const { setNodes, setEdges, setViewport } = useReactFlow();
  const [direction, setDirection] = useState<ElkDirectionType>("LEFT");
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const [id, setId] = useState<string>("");
  const [items, setItems] = useState<{ [key: string]: string }>({});
  const [draggable, setDraggable] = useState<boolean>(
    !(localStorage.getItem(localStorageDraggableKey) === "false")
  );

  const updateELKLayout = async (oldNodes: Node[], oldEdges: Edge[]) => {
    const { nodes, edges } = await getElkLayout(oldNodes, oldEdges, direction);
    setNodes(nodes);
    setEdges(edges);
  };

  const equalNodesData = (nodesA: Node[], nodesB: Node[]) => {
    if (nodesA.length != nodesB.length) {
      return false;
    }

    const a1 = nodesA
      .sort((a1, b1) => a1.id.localeCompare(b1.id))
      .map((node) => ({ id: node.id, data: node.data }));
    const a2 = nodesB
      .sort((a1, b1) => a1.id.localeCompare(b1.id))
      .map((node) => ({ id: node.id, data: node.data }));

    return JSON.stringify(a1) === JSON.stringify(a2);
  };

  const equalEdgesData = (edgesA: Edge[], edgesB: Edge[]) => {
    if (edgesA.length != edgesB.length) {
      return false;
    }

    const a1 = edgesA
      .sort((a1, b1) => a1.id.localeCompare(b1.id))
      .map((edge) => edge.data);
    const a2 = edgesB
      .sort((a1, b1) => a1.id.localeCompare(b1.id))
      .map((edge) => edge.data);

    return JSON.stringify(a1) === JSON.stringify(a2);
  };

  const handleSelectFile = async (data: DiagramData) => {
    setId(data.id || "");
    setItems(data.legend || {});
    const flowData = data.id ? localStorage.getItem(data.id) : null;
    const flow = flowData ? JSON.parse(flowData) : null;
    if (
      flow &&
      equalNodesData(flow.nodes, data.nodes) &&
      equalEdgesData(flow.edges, data.edges)
    ) {
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
      defaultNodes={normalizeNodes([
        {
          id: "1",
          data: {
            label: "Microsoft Corporation",
            link: "https://www.microsoft.com/uk-ua/",
          },
        },
        { id: "2", data: { label: "Satya Nadella - CEO", type: "person" } },

        {
          id: "3",
          data: { label: "Azure (Cloud Services)" },
        },
        {
          id: "3a",
          data: { label: "Scott Guthrie - EVP, Cloud & AI", type: "person" },
        },

        { id: "4", data: { label: "Windows & Devices" } },
        {
          id: "4a",
          data: {
            label: "Panos Panay - EVP, Windows & Devices",
            type: "person",
          },
        },

        {
          id: "5",
          data: { label: "Office & Productivity" },
        },
        {
          id: "5a",
          data: { label: "Rajesh Jha - EVP, Office & Teams", type: "person" },
        },

        {
          id: "6",
          data: { label: "Gaming (Xbox, Activision)" },
        },
        {
          id: "6a",
          data: { label: "Phil Spencer - CEO, Gaming", type: "person" },
        },

        {
          id: "7",
          data: { label: "LinkedIn", link: "https://www.linkedin.com/feed/" },
        },
        {
          id: "7a",
          data: { label: "Ryan Roslansky - CEO, LinkedIn", type: "person" },
        },

        { id: "8", data: { label: "GitHub", link: "https://github.com/" } },
        {
          id: "8a",
          data: { label: "Thomas Dohmke - CEO, GitHub", type: "person" },
        },
      ] as CustomNodeProps[])}
      defaultEdges={normalizeEdges([
        {
          id: "e1",
          source: "2",
          target: "1",
          label: "CEO of",
          data: { lineType: "dashed" },
        },

        {
          id: "e2",
          source: "3a",
          target: "3",
          label: "Leads",
          data: { lineType: "dashed" },
        },
        {
          id: "e3",
          source: "4a",
          target: "4",
          label: "Leads",
          data: { lineType: "dashed" },
        },
        {
          id: "e4",
          source: "5a",
          target: "5",
          label: "Leads",
          data: { lineType: "dashed" },
        },
        {
          id: "e5",
          source: "6a",
          target: "6",
          label: "Leads",
          data: { lineType: "dashed" },
        },
        {
          id: "e6",
          source: "7a",
          target: "7",
          label: "CEO of",
          data: { lineType: "dashed" },
        },
        {
          id: "e7",
          source: "8a",
          target: "8",
          label: "CEO of",
          data: { lineType: "dashed" },
        },

        { id: "e8", source: "1", target: "3" },
        { id: "e9", source: "1", target: "4" },
        { id: "e10", source: "1", target: "5" },
        { id: "e11", source: "1", target: "6" },
        { id: "e12", source: "1", target: "7" },
        { id: "e13", source: "1", target: "8" },
      ] as CustomEdgeProps[])}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeDragStop={onSave}
      onInit={setRfInstance}
      minZoom={0.05}
      maxZoom={2}
      nodesDraggable={draggable}
      nodesConnectable={draggable}
      elementsSelectable={draggable}
    >
      <Background />
      <div className="hidden sm:block">
        <MiniMap pannable zoomable />
      </div>
      <Panel position="top-left" className="mr-10">
        <div className="w-full flex flex-wrap gap-2 pr-32">
          <DownloadButton id={id} />
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
        <DiagramLegend items={items} />
      </Panel>
      <Controls
        className="bg-white"
        onInteractiveChange={(status) => {
          localStorage.setItem(localStorageDraggableKey, String(status));
          setDraggable(status);
        }}
      />
      <LoadingOverlay />
    </ReactFlow>
  );
};

export default LayoutFlow;
