import { dataExamples } from "../common/defaultData";
import { DiagramData } from "../common/types";

interface SelectExampleProps {
  onSelectExample: (data: DiagramData) => void;
}

const SelectExample = (props: SelectExampleProps) => {
  const { onSelectExample } = props;
  return (
    <>
      {dataExamples.map((example, index) => (
        <button
          key={index}
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onSelectExample(example)}
        >{`Example ${index + 1}`}</button>
      ))}
    </>
  );
};

export default SelectExample;
