import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const exportWidth = 1920;  // pixels per tile
const exportHeight = 1280;  // pixels per tile

const DownloadButton = () => {
  const { getNodes } = useReactFlow();

  const onClick = async () => {
    const nodesBounds = getNodesBounds(getNodes());

    const totalWidth = nodesBounds.width;
    const totalHeight = nodesBounds.height;

    // How many horizontal / vertical tiles
    const cols = Math.ceil(totalWidth / exportWidth);
    const rows = Math.ceil(totalHeight / exportHeight);

    const viewElement = document.querySelector<HTMLElement>(
      ".react-flow__viewport"
    );
    if (!viewElement) return;

    const pdf = new jsPDF("l", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    try {
      let isFirstPage = true;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const tileBounds = {
            x: nodesBounds.x + col * exportWidth,
            y: nodesBounds.y + row * exportHeight,
            width:
              col === cols - 1
                ? totalWidth - col * exportWidth
                : exportWidth,
            height:
              row === rows - 1
                ? totalHeight - row * exportHeight
                : exportHeight,
          };

          const viewport = getViewportForBounds(
            tileBounds,
            exportWidth,
            exportHeight,
            0.5,
            2,
            0
          );

          const dataUrl = await toPng(viewElement, {
            backgroundColor: "white",
            width: exportWidth,
            height: exportHeight,
            style: {
              width: exportWidth + "px",
              height: exportHeight + "px",
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            },
          });

          // Scale tile to fit PDF page
          const imgWidth = pageWidth;
          const imgHeight = (exportHeight * pageWidth) / exportWidth;

          if (!isFirstPage) pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);

          isFirstPage = false;
        }
      }

      pdf.save("diagram.pdf");
    } catch (err) {
      console.error("Failed to generate multi-page PDF:", err);
    }
  };

  return (
    <button
      className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
      onClick={onClick}
    >
      Download PDF
    </button>
  );
};

export default DownloadButton;
