import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";

const exportWidth = 1920; // pixels per tile
const exportHeight = 1280; // pixels per tile

const DownloadButton = () => {
  const { getNodes } = useReactFlow();

  const onClick = async () => {
    const nodesBounds = getNodesBounds(getNodes());

    const totalWidth = nodesBounds.width;
    const totalHeight = nodesBounds.height;

    const viewElement = document.querySelector<HTMLElement>(
      ".react-flow__viewport"
    );
    if (!viewElement) return;

    try {
      const canvas = await toCanvas(viewElement, {
        backgroundColor: "white",
        width: totalWidth,
        height: totalHeight,
        style: {
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
          transform: `translate(${-nodesBounds.x}px, ${-nodesBounds.y}px) scale(1)`,
          transformOrigin: "top left",
        },
      });

      const pdf = new jsPDF("l", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      const scale = pageWidth / exportWidth;
      const scaledHeight = exportHeight * scale;

      const totalRows = Math.ceil(totalHeight/exportHeight);
      const totalCols = Math.ceil(totalWidth/exportWidth);

      const pageJobs: Promise<HTMLCanvasElement>[] = [];

      for (let x = 0; x < totalCols; x++) {
        for (let y = 0; y < totalRows; y++) {
          const job = new Promise<HTMLCanvasElement>((resolve) => {
            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = exportWidth;
            pageCanvas.height = exportHeight;

            const ctx = pageCanvas.getContext("2d");

            if (ctx) {
              ctx.fillStyle = "white";
              ctx.fillRect(0, 0, exportWidth, exportHeight);
              ctx.drawImage(canvas, -x * exportWidth, -y * exportHeight);
            }

            resolve(pageCanvas);
          });

          pageJobs.push(job);
        }
      }

      const allImages = await Promise.all(pageJobs);

      allImages.forEach((canvas, index) => {
        if (index > 0) pdf.addPage();
        pdf.addImage(canvas, 0, 0, pageWidth, scaledHeight);
      });

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
