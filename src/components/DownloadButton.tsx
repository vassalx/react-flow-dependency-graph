import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", "diagram.png");
  a.setAttribute("href", dataUrl);
  a.click();
};

const imageWidth = 1920;
const imageHeight = 1280;

const DownloadButton = () => {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0
    );

    const viewElement = document.querySelector<HTMLElement>(
      ".react-flow__viewport"
    );

    if (viewElement) {
      toPng(viewElement, {
        backgroundColor: "white",
        width: imageWidth,
        height: imageHeight,
        style: {
          width: imageWidth + "px",
          height: imageHeight + "px",
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      }).then(downloadImage);
    }
  };

  return (
    <button
      className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
      onClick={onClick}
    >
      Download Image
    </button>
  );
};

export default DownloadButton;
