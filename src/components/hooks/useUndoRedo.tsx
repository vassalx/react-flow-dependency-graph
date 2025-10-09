import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
};

export type UseUndoRedoProps = {
  rfInstance: ReactFlowInstance<Node, Edge> | null;
};

const useUndoRedo = ({ rfInstance }: UseUndoRedoProps) => {
  const [undoStack, setUndoStack] = useState<FlowState[]>([]);
  const [redoStack, setRedoStack] = useState<FlowState[]>([]);
  const [lastUndoState, setLastUndoState] = useState<FlowState | null>(null);

  const resetUndoRedoState = (flowState?: FlowState) => {
    setUndoStack([]);
    setRedoStack([]);
    setLastUndoState({
      nodes: flowState?.nodes || rfInstance?.getNodes() || [],
      edges: flowState?.edges || rfInstance?.getEdges() || [],
    });
  };

  const pushToUndoStack = (flowState?: FlowState) => {
    if (lastUndoState) {
      setUndoStack((prev) => [...prev, lastUndoState]);
    }
    setRedoStack([]);
    setLastUndoState({
      nodes: flowState?.nodes || rfInstance?.getNodes() || [],
      edges: flowState?.edges || rfInstance?.getEdges() || [],
    });
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || !rfInstance) return;
    const prevState = undoStack[undoStack.length - 1];
    setLastUndoState(prevState);
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [
      ...prev,
      {
        nodes: rfInstance.getNodes(),
        edges: rfInstance.getEdges(),
      },
    ]);
    rfInstance.setNodes(prevState.nodes || []);
    rfInstance.setEdges(prevState.edges || []);
  }, [rfInstance, undoStack]);

  const handleRedo = useCallback(() => {
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
    rfInstance.setNodes(nextState.nodes || []);
    rfInstance.setEdges(nextState.edges || []);
  }, [redoStack, rfInstance]);

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
  }, [handleRedo, handleUndo]);

  const isUndoStackEmpty = useMemo(() => undoStack.length === 0, [undoStack]);
  const isRedoStackEmpty = useMemo(() => redoStack.length === 0, [redoStack]);

  return {
    resetUndoRedoState,
    pushToUndoStack,
    handleUndo,
    handleRedo,
    isUndoStackEmpty,
    isRedoStackEmpty,
  };
};

export default useUndoRedo;
