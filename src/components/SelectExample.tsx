import { useEffect, useRef, useState } from "react";
import { CustomEdgeProps, CustomNodeProps, DiagramData } from "../common/types";
import normalizeNodes from "../common/normalizeNodes";
import normalizeEdges from "../common/normalizeEdges";

const getButtonsMessage = "getButtons";

interface Record {
  name: string;
  connection: string;
}

interface ButtonData {
  objectName: string;
  records: Record[];
}

interface SelectExampleProps {
  onSelectExample: (data: DiagramData) => void;
}

const SelectExample = (props: SelectExampleProps) => {
  const [examples, setExamples] = useState<
    { name: string; data: DiagramData }[]
  >([]);
  const { onSelectExample } = props;

  const getDependencyTree = (root: string, leaves: Record[]): DiagramData => {
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
          label: leaf.name,
        },
      });
      result.edges.push({
        id: `root-${index}`,
        source: "root",
        target: String(index),
        data: {
          targetLabel: leaf.connection,
        },
      });
    });
    return {
      nodes: normalizeNodes(result.nodes),
      edges: normalizeEdges(result.edges),
    };
  };

  const hasHandledMessage = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.data &&
        event.data.action === getButtonsMessage &&
        !hasHandledMessage.current
      ) {
        hasHandledMessage.current = true;
        const newExamples = event.data.data.map(
          ({ objectName, records }: ButtonData) => ({
            name: objectName,
            data: getDependencyTree(objectName, records),
          })
        );
        setExamples(newExamples);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (examples.length) {
      onSelectExample(examples[0].data);
    }
  }, [examples]);

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
