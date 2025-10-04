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
import LoadingOverlay from "./LoadingOverlay";
import { CustomButton } from "./CustomButton";
import { SaveIcon } from "./icons/SaveIcon";
import toast from "react-hot-toast";
import RevertArrowIcon from "./icons/RevertArrowIcon";
import ClockwiseArrowIcon from "./icons/ClockwiseArrowIcon";

const localStorageDirKey = "dir_";
const localStorageDraggableKey = "draggable";
const localStorageRestoreKey = "restore_";
const localStorageVersionKey = "version_";

const LayoutFlow = () => {
  const [versions, setVersions] = useState<
    { key: string; date: string; name: string }[]
  >([]);
  const [version, setVersion] = useState<string>("");
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
    return { nodes, edges };
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
      const { nodes, edges } = await updateELKLayout(data.nodes, data.edges);
      console.log("SAVING NEW FLOW", nodes, edges);
      setUndoStack([]);
      setRedoStack([]);
      setLastUndoState({
        nodes: nodes || [],
        edges: edges || [],
      });
    }
  };

  const onSave = (key = "") => {
    if (rfInstance && id) {
      const flow = rfInstance.toObject();
      localStorage.setItem(key + id, JSON.stringify(flow));
      localStorage.setItem(key + localStorageDirKey + id, direction);
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
      onSave();
    }
  }, [direction]);

  // useEffect(() => {
  //   const edges = [
  //     {
  //       id: "e1",
  //       source: "2",
  //       target: "1",
  //       label: "CEO of",
  //       data: { lineType: "dashed" },
  //     },

  //     {
  //       id: "e2",
  //       source: "3a",
  //       target: "3",
  //       label: "Leads",
  //       data: { lineType: "dashed" },
  //     },
  //     {
  //       id: "e3",
  //       source: "4a",
  //       target: "4",
  //       label: "Leads",
  //       data: { lineType: "dashed" },
  //     },
  //     {
  //       id: "e4",
  //       source: "5a",
  //       target: "5",
  //       label: "Leads",
  //       data: { lineType: "dashed" },
  //     },
  //     {
  //       id: "e5",
  //       source: "6a",
  //       target: "6",
  //       label: "Leads",
  //       data: { lineType: "dashed" },
  //     },
  //     {
  //       id: "e6",
  //       source: "7a",
  //       target: "7",
  //       label: "CEO of",
  //       data: { lineType: "dashed" },
  //     },
  //     {
  //       id: "e7",
  //       source: "8a",
  //       target: "8",
  //       label: "CEO of",
  //       data: { lineType: "dashed" },
  //     },

  //     { id: "e8", source: "1", target: "3" },
  //     { id: "e9", source: "1", target: "4" },
  //     { id: "e10", source: "1", target: "5" },
  //     { id: "e11", source: "1", target: "6" },
  //     { id: "e12", source: "1", target: "7" },
  //     { id: "e13", source: "1", target: "8" },
  //   ] as CustomEdgeProps[];
  //   const nodes = [
  //     {
  //       id: "1",
  //       data: {
  //         label: "Microsoft Corporation",
  //         link: "https://www.microsoft.com/uk-ua/",
  //         group: "1",
  //       },
  //     },
  //     { id: "2", data: { label: "Satya Nadella - CEO", type: "Contact" } },

  //     {
  //       id: "3",
  //       data: { label: "Azure (Cloud Services)", group: "1", selected: true },
  //     },
  //     {
  //       id: "3a",
  //       data: { label: "Scott Guthrie - EVP, Cloud & AI", type: "Contact" },
  //     },

  //     { id: "4", data: { label: "Windows & Devices" } },
  //     {
  //       id: "4a",
  //       data: {
  //         label: "Panos Panay - EVP, Windows & Devices",
  //         type: "Contact",
  //       },
  //     },

  //     {
  //       id: "5",
  //       data: { label: "Office & Productivity" },
  //     },
  //     {
  //       id: "5a",
  //       data: { label: "Rajesh Jha - EVP, Office & Teams", type: "Contact" },
  //     },

  //     {
  //       id: "6",
  //       data: { label: "Gaming (Xbox, Activision)" },
  //     },
  //     {
  //       id: "6a",
  //       data: { label: "Phil Spencer - CEO, Gaming", type: "Contact" },
  //     },

  //     {
  //       id: "7",
  //       data: {
  //         label: "LinkedIn",
  //         link: "https://www.linkedin.com/feed/",
  //         group: "1",
  //       },
  //     },
  //     {
  //       id: "7a",
  //       data: { label: "Ryan Roslansky - CEO, LinkedIn", type: "Contact" },
  //     },
  //     {
  //       id: "8",
  //       data: { label: "GitHub", link: "https://github.com/", group: "1" },
  //     },
  //     {
  //       id: "8a",
  //       data: { label: "Thomas Dohmke - CEO, GitHub", type: "Contact" },
  //     },
  //   ] as CustomNodeProps[];
  //   setTimeout(() => {
  //     handleSelectFile({
  //       edges: normalizeEdges(edges),
  //       nodes: normalizeNodes(
  //         addColorsToNodes(nodes, {
  //           "1": "blue",
  //         })
  //       ),
  //       id: "1",
  //       legend: {
  //         "1": "blue",
  //       },
  //     });
  //   }, 1000);
  // }, []);

  useEffect(() => {
    if (id) {
      const keyBeginsWith =
        localStorageRestoreKey + localStorageVersionKey + id + "_";
      // Load all versions for current diagram
      const allKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith(keyBeginsWith)
      );
      const versionList = allKeys.map((key) => {
        const { date, name } = JSON.parse(localStorage.getItem(key) || '{}');
        return { key, date, name };
      });
      setVersions(
        versionList.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 20)
      );
    }
  }, [id]);

  const handleSaveVersion = () => {
    if (rfInstance && id) {
      const flow = rfInstance.toObject();
      const timestamp = new Date().toISOString();
      const name =
        prompt(
          "Enter version name (optional):",
          new Date(timestamp).toLocaleString()
        ) || new Date(timestamp).toLocaleString();
      const versionKey = `${localStorageRestoreKey}${localStorageVersionKey}${id}_${timestamp}`;
      let updatedVersions = [
        { key: versionKey, date: timestamp, name: name },
        ...versions,
      ];
      if (updatedVersions.length > 20) {
        // Remove the oldest version
        const oldest = updatedVersions[updatedVersions.length - 1];
        localStorage.removeItem(oldest.key);
        updatedVersions = updatedVersions.slice(0, 20);
      }
      localStorage.setItem(versionKey, JSON.stringify({ flow, name }));
      setVersions(updatedVersions);
      toast.success("Version saved!");
    }
  };

  const handleSelectVersion = (versionKey: string) => {
    const keyBeginsWith =
      localStorageRestoreKey + localStorageVersionKey + id + "_";
    const flowStr = localStorage.getItem(versionKey);
    if (flowStr) {
      setVersion(versionKey.replace(keyBeginsWith, ""));
      const { flow } = JSON.parse(flowStr);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
      toast.success("Version restored!");
    }
  };

  type FlowState = {
    nodes: Node[];
    edges: Edge[];
  };

  const [undoStack, setUndoStack] = useState<FlowState[]>([]);
  const [redoStack, setRedoStack] = useState<FlowState[]>([]);
  const [lastUndoState, setLastUndoState] = useState<FlowState | null>(null);

  useEffect(() => {
    if (rfInstance && id) {
      // Clear undo/redo stacks when diagram changes
      const flow = rfInstance.toObject();
      setUndoStack([]);
      setRedoStack([]);
      setLastUndoState({
        nodes: flow.nodes || [],
        edges: flow.edges || []
      });
    }
  }, [id, version]);

  // Push current state to undo stack before any change
  const pushToUndoStack = () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      if (lastUndoState) {
        setUndoStack((prev) => [...prev, lastUndoState]);
      }
      setRedoStack([]); // Clear redo stack on new action
      setLastUndoState({
        nodes: flow.nodes || [],
        edges: flow.edges || []
      });
    }
  };

  // Undo logic
  const handleUndo = () => {
    if (undoStack.length === 0 || !rfInstance) return;
    const prevState = undoStack[undoStack.length - 1];
    setLastUndoState(prevState);
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [
      ...prev,
      {
        nodes: rfInstance.getNodes(),
        edges: rfInstance.getEdges()
      },
    ]);
    setNodes(prevState.nodes || []);
    setEdges(prevState.edges || []);
  };

  // Redo logic
  const handleRedo = () => {
    if (redoStack.length === 0 || !rfInstance) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [
      ...prev,
      {
        nodes: rfInstance.getNodes(),
        edges: rfInstance.getEdges(),
      },
    ]);
    setNodes(nextState.nodes || []);
    setEdges(nextState.edges || []);
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "z"))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack, rfInstance]);

  return (
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
    >
      <Background variant={BackgroundVariant.Lines} gap={50} />
      <div className="hidden sm:block">
        <MiniMap pannable zoomable />
      </div>
      <Panel position="top-left" className="mr-10">
        <div className="flex flex-col gap-2 pr-32">
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
              value={version}
              onChange={(e) => {
                if (e.target.value) {
                  handleSelectVersion(e.target.value);
                }
              }}
            >
              <option value="">Restore version...</option>
              {versions.map((v) => (
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
              disabled={undoStack.length === 0}
            />
            <CustomButton
              className="flex-grow"
              label="Redo"
              icon={<ClockwiseArrowIcon />}
              onClick={handleRedo}
              disabled={redoStack.length === 0}
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
