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
  BackgroundVariant,
  ConnectionMode,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DiagramData, edgeTypes, nodeTypes } from "../common/types";
import DownloadButton from "./DownloadButton";
import SelectExample from "./SelectExample";
import getElkLayout from "../common/getElkLayout";
import PositioningTools from "./PositionTools";
import DiagramLegend from "./DiagramLegend";
import LoadingOverlay from "./LoadingOverlay";
import { CustomButton } from "./CustomButton";
import { SaveIcon } from "./icons/SaveIcon";
import RevertArrowIcon from "./icons/RevertArrowIcon";
import ClockwiseArrowIcon from "./icons/ClockwiseArrowIcon";
import useUndoRedo from "./hooks/useUndoRedo";
import useVersions from "./hooks/useVersions";
import compareEdgesData from "../common/compareEdgesData";
import compareNodesData from "../common/compareNodesData";
import useDraggable from "./hooks/useDraggable";
import useDirection from "./hooks/useDirection";
import useCachedDiagramData from "./hooks/useCachedDiagramData";
import getAncestors from "../common/getAncestors";
import { RollProvider } from "../context/RollContext";
import jsPDF from "jspdf";

const pagePadding = 20; // pt (jsPDF units)

const LayoutFlow = () => {
  const { setNodes, setEdges, setViewport } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const [id, setId] = useState<string>("");
  const [items, setItems] = useState<{ [key: string]: string }>({});

  const {
    resetUndoRedoState,
    pushToUndoStack,
    handleUndo,
    handleRedo,
    isUndoStackEmpty,
    isRedoStackEmpty,
  } = useUndoRedo({ rfInstance });
  const {
    selectedVersion,
    versions,
    saveVersion,
    selectVersion,
    getFlowVersion,
  } = useVersions({ rfInstance, id });
  const { draggable, setDraggable } = useDraggable();
  const { getCachedDiagramData, setCachedDiagramData } = useCachedDiagramData();
  const [bgOffset, setBgOffset] = useState<[number, number]>([0, 0]);

  const nodes = rfInstance?.getNodes();

  const updateELKLayout = async (oldNodes: Node[], oldEdges: Edge[]) => {
    const { nodes, edges } = await getElkLayout(oldNodes, oldEdges, direction);
    setNodes(nodes);
    setEdges(edges);
    return { nodes, edges };
  };

  const { direction, setDirection } = useDirection({ id });

  const handleSelectFile = async (data: DiagramData) => {
    setId(data.id || "");
    setItems(data.legend || {});
    fetchLayout(data);
  };

  const fetchLayout = async (data: DiagramData) => {
    const cachedDiagramData = getCachedDiagramData(data.id || "");
    if (
      cachedDiagramData &&
      compareNodesData(cachedDiagramData.nodes, data.nodes) &&
      compareEdgesData(cachedDiagramData.edges, data.edges)
    ) {
      const { x = 0, y = 0, zoom = 1 } = cachedDiagramData.viewport || {};

      setNodes(cachedDiagramData.nodes);
      setEdges(cachedDiagramData.edges);
      setViewport({ x, y, zoom });
    } else if (data) {
      const { nodes, edges } = await updateELKLayout(data.nodes, data.edges);
      setCachedDiagramData(data, data.id || id);
      resetUndoRedoState({ nodes: nodes || [], edges: edges || [] });
    }
  };

  const onSave = () => {
    if (rfInstance && id) {
      setCachedDiagramData(rfInstance.toObject(), id);
    }
  };

  const handleSaveVersion = () => {
    saveVersion();
  };

  const handleSelectVersion = (versionKey: string) => {
    const flow = getFlowVersion(versionKey);
    if (flow) {
      selectVersion(versionKey);
      resetUndoRedoState({ nodes: flow.nodes || [], edges: flow.edges || [] });
    }
  };

  const rollUp = (nodeId: string) => {
    if (rfInstance) {
      const ancestors = getAncestors(nodeId, rfInstance?.getEdges() || []);

      const visibleIds = new Set([nodeId, ...ancestors]);

      const collapsedIds = rfInstance?.getNodes()
        ? new Set(
            rfInstance
              ?.getNodes()
              .filter((n) => !visibleIds.has(n.id))
              .map((n) => n.id)
          )
        : new Set<string>();

      const nodes = rfInstance?.getNodes() || [];
      const edges = rfInstance?.getEdges() || [];

      const newNodes = nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              collapsed: Array.from(collapsedIds.values()),
            },
            hidden: false,
          };
        } else {
          return {
            ...n,
            hidden: collapsedIds.has(n.id) || n.hidden,
          };
        }
      });

      const newEdges = edges.map((e) => ({
        ...e,
        hidden:
          collapsedIds.has(e.target) || collapsedIds.has(e.source) || e.hidden,
      }));

      setNodes(newNodes);
      setEdges(newEdges);

      const newData = rfInstance.toObject();
      newData.edges = newEdges;
      newData.nodes = newNodes;

      setCachedDiagramData(newData, id);
    }
  };

  const rollDown = (nodeId: string) => {
    const node = rfInstance?.getNode(nodeId);

    if (rfInstance && node) {
      const collapsedIds = new Set<string>(
        node.data.collapsed ? (node.data.collapsed as string[]) : []
      );
      const nodes = rfInstance.getNodes();
      const edges = rfInstance.getEdges();
      const newNodes = nodes.map((n) => {
        if (nodeId === n.id) {
          return {
            ...n,
            data: {
              ...n.data,
              collapsed: [],
            },
          };
        } else {
          return {
            ...n,
            hidden: n.hidden && collapsedIds.has(n.id) ? false : n.hidden,
          };
        }
      });
      setNodes(newNodes);

      collapsedIds.add(nodeId);

      const newEdges = edges.map((e) => ({
        ...e,
        hidden:
          (e.hidden && collapsedIds.has(e.source)) || collapsedIds.has(e.target)
            ? false
            : e.hidden,
      }));

      setEdges(newEdges);

      const newData = rfInstance.toObject();
      newData.edges = newEdges;
      newData.nodes = newNodes;

      setCachedDiagramData(newData, id);
    }
  };

  useEffect(() => {
    if (id) {
      onSave();
    }
  }, [direction]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const data = getTestDiagramData();
  //     handleSelectFile(data);
  //   }, 1000);
  // }, []);

  useEffect(() => {
    if (rfInstance && id) {
      // Clear undo/redo stacks when diagram changes
      const flow = rfInstance.toObject();
      resetUndoRedoState({ nodes: flow.nodes || [], edges: flow.edges || [] });
    }
  }, [id]);

  useEffect(() => {
    handleMove();
    if (!versions.length && nodes?.length) {
      saveVersion({ hasPrompt: false });
    }
  }, [nodes]);

  const { contentWidth, contentHeight } = useMemo(() => {
    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // The available area for diagram content on a single content page
    const contentWidth = pageWidth - pagePadding * 2;
    const contentHeight = pageHeight - pagePadding * 2;
    return { contentWidth, contentHeight };
  }, []);

  const handleMove = useCallback(() => {
    if (rfInstance) {
      const currentNodes = rfInstance.getNodes().filter((node) => !node.hidden);
      if (currentNodes.length === 0) return;

      const minX = Math.min(...currentNodes.map((n) => n.position.x));
      const minY = Math.min(...currentNodes.map((n) => n.position.y));

      setBgOffset([
        Math.abs(contentWidth - (minX + contentWidth / 2)),
        Math.abs(contentHeight - (minY + contentHeight / 2)),
      ]);
    }
  }, [rfInstance]);

  return (
    <RollProvider onRollUp={rollUp} onRollDown={rollDown}>
      <ReactFlow
        defaultNodes={[]}
        defaultEdges={[]}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeDragStop={() => {
          onSave();
          pushToUndoStack();
        }}
        onInit={setRfInstance}
        minZoom={0.05}
        maxZoom={2}
        nodesDraggable={draggable}
        nodesConnectable={draggable}
        elementsSelectable={draggable}
        connectionMode={ConnectionMode.Loose}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={[contentWidth, contentHeight]}
          offset={bgOffset}
        />
        <div className="hidden sm:block">
          <MiniMap pannable zoomable />
        </div>
        <Panel position="top-left" className="mr-32!">
          <div className="flex flex-col gap-2">
            <DownloadButton id={id} />
            <SelectExample onSelectExample={handleSelectFile} />
            <div className="flex gap-2">
              <CustomButton
                label="Save"
                onClick={handleSaveVersion}
                icon={<SaveIcon />}
              />
              <select
                className="shadow-sm rounded-md px-2 py-1 bg-white"
                value={selectedVersion}
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectVersion(e.target.value);
                  }
                }}
              >
                <option
                  value={
                    versions.length ? versions[versions.length - 1].key : ""
                  }
                >
                  Restore version...
                </option>
                {versions.slice(0, -1).map((v) => (
                  <option key={v.key} value={v.key}>
                    {v.name || new Date(v.date).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <CustomButton
                className="flex-grow"
                label="Undo"
                icon={<RevertArrowIcon />}
                onClick={handleUndo}
                disabled={isUndoStackEmpty}
              />
              <CustomButton
                className="flex-grow"
                label="Redo"
                icon={<ClockwiseArrowIcon />}
                onClick={handleRedo}
                disabled={isRedoStackEmpty}
              />
            </div>
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
        <Controls className="bg-white" onInteractiveChange={setDraggable} />
        <LoadingOverlay />
      </ReactFlow>
    </RollProvider>
  );
};

export default LayoutFlow;
