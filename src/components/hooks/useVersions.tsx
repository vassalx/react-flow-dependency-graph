import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const localStorageRestoreKey = "restore_";
const localStorageVersionKey = "version_";
const MAX_VERSIONS_LIST_LENGTH = 20;

export type UseVersionsProps = {
  rfInstance: ReactFlowInstance<Node, Edge> | null;
  id: string;
};

const useVersions = ({ rfInstance, id }: UseVersionsProps) => {
  const [versions, setVersions] = useState<
    { key: string; date: string; name: string }[]
  >([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  const saveVersion = () => {
    if (rfInstance && id) {
      const flow = rfInstance.toObject();
      const timestamp = new Date().toISOString();
      let name = prompt(
        "Enter version name (optional):",
        new Date(timestamp).toLocaleString()
      );
      if (name === null) {
        return;
      }
      if (!name.trim()) {
        name = new Date(timestamp).toLocaleString();
      }
      const versionKey = `${localStorageRestoreKey}${localStorageVersionKey}${id}_${timestamp}`;
      let updatedVersions = [
        { key: versionKey, date: timestamp, name: name },
        ...versions,
      ];
      if (updatedVersions.length > MAX_VERSIONS_LIST_LENGTH) {
        // Remove the oldest version
        const oldest = updatedVersions[updatedVersions.length - 1];
        localStorage.removeItem(oldest.key);
        updatedVersions = updatedVersions.slice(0, MAX_VERSIONS_LIST_LENGTH);
      }
      localStorage.setItem(versionKey, JSON.stringify({ flow, name }));
      setSelectedVersion(versionKey);
      setVersions(updatedVersions);
      toast.success("Version saved!");
    }
  };

    const selectVersion = (versionKey: string) => {
    const flow = getFlowVersion(versionKey);
    if (flow && rfInstance) {
      setSelectedVersion(versionKey);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      rfInstance.setNodes(flow.nodes || []);
      rfInstance.setEdges(flow.edges || []);
      rfInstance.setViewport({ x, y, zoom });
      toast.success("Version restored!");
    }
  };

  const getFlowVersion = (versionKey: string) => {
    const flowStr = localStorage.getItem(versionKey);
    if (flowStr && rfInstance) {
      const { flow } = JSON.parse(flowStr);
      return flow;
    }
    return null;
  }

  useEffect(() => {
    if (rfInstance && id) {
      const keyBeginsWith =
        localStorageRestoreKey + localStorageVersionKey + id + "_";
      // Load all versions for current diagram
      const allKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith(keyBeginsWith)
      );
      const versionList = allKeys.map((key) => {
        const { date, name } = JSON.parse(localStorage.getItem(key) || "{}");
        return { key, date, name };
      });
      setVersions(
        versionList.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, MAX_VERSIONS_LIST_LENGTH)
      );
    }
  }, [id, rfInstance]);

  return { selectedVersion, versions, saveVersion, selectVersion, getFlowVersion };
};

export default useVersions;
