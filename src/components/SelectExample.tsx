import { useEffect, useState } from "react";
import { CustomEdgeProps, CustomNodeProps, DiagramData } from "../common/types";
import normalizeNodes from "../common/normalizeNodes";
import normalizeEdges from "../common/normalizeEdges";

const getButtonsMessage = "getButtons";

interface ButtonData {
  objectName: string,
  records: string[]
}

interface SelectExampleProps {
  onSelectExample: (data: DiagramData) => void;
}

const SelectExample = (props: SelectExampleProps) => {
  const [examples, setExamples] = useState<
    { name: string; data: DiagramData }[]
  >([]);
  const { onSelectExample } = props;

  const getDependencyTree = (root: string, leaves: string[]): DiagramData => {
    const result = {
      nodes: [
        {
          position: { x: 0, y: 0 },
          id: "root",
          data: {
            label: root,
          },
        },
      ] as CustomNodeProps[],
      edges: [] as CustomEdgeProps[],
    };
    leaves.forEach((leaf, index) => {
      result.nodes.push({
        position: { x: 0, y: 0 },
        id: String(index),
        data: {
          label: leaf,
        },
      });
      result.edges.push({
        id: `root-${index}`,
        source: "root",
        target: String(index),
      });
    });
    return {
      nodes: normalizeNodes(result.nodes),
      edges: normalizeEdges(result.edges),
    };
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.data && event.data.action === getButtonsMessage) {
        const newExamples = event.data.data.map(
          ({
            objectName,
            records,
          }: ButtonData) => ({ name: objectName, data: getDependencyTree(objectName, records)})
        );
        setExamples(newExamples);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      {examples.map((example, index) => (
        <button
          key={index}
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onSelectExample(example.data)}
        >
          {example.name}
        </button>
      ))}
    </>
  );
};

export default SelectExample;
