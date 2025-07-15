import normalizeEdges from "../common/normalizeEdges";
import normalizeNodes from "../common/normalizeNodes";
import { DiagramData } from "../common/types";

interface UploadButtonProps {
  handleFileUpload: (data: DiagramData) => void;
}

const UploadButton = (props: UploadButtonProps) => {
  const { handleFileUpload } = props;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const parsedData = JSON.parse(result);
          handleFileUpload({
            edges: normalizeEdges(parsedData.edges),
            nodes: normalizeNodes(parsedData.nodes),
          });
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Invalid JSON file. Please upload a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <span>
      <label
        htmlFor="json"
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded block"
      >
        Upload JSON
      </label>
      <input
        id="json"
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </span>
  );
};

export default UploadButton;
