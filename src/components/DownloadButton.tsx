import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";
import { useState } from "react";

const DownloadButton = () => {
  const { getNodes } = useReactFlow();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendPdfToSalesforceAttachments = async (pdf: jsPDF) => {
    const pdfBase64 = pdf.output("datauristring");

    window.parent.postMessage(
      {
        type: "SAVE_PDF",
        payload: pdfBase64,
        fileName: "diagram.pdf",
      },
      "*"
    );
  };

  const onClick = async () => {
    setIsLoading(true);
    const nodesBounds = getNodesBounds(getNodes());

    const viewElement = document.querySelector<HTMLElement>(
      ".react-flow__viewport"
    );
    if (!viewElement) return;

    try {
      const pdf = new jsPDF("l", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const totalWidth = nodesBounds.width;
      const totalHeight = nodesBounds.height;

      // Calculate a scaling factor to fit the diagram within a single page
      const scaleX = pageWidth / totalWidth;
      const scaleY = pageHeight / totalHeight;
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = totalWidth * scale;
      const scaledHeight = totalHeight * scale;

      const canvas = await toCanvas(viewElement, {
        backgroundColor: "white",
        // Only use the dimensions of the content for the canvas
        width: totalWidth,
        height: totalHeight,
        style: {
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
          // Translate the canvas to the top-left corner of the nodes' bounding box
          transform: `translate(${-nodesBounds.x}px, ${-nodesBounds.y}px)`,
          transformOrigin: "top left",
        },
      });

      // Add the single, correctly scaled image to the PDF
      const imageData = canvas.toDataURL("image/jpeg", 0.75);
      pdf.addImage(imageData, "JPEG", 0, 0, scaledWidth, scaledHeight);

      sendPdfToSalesforceAttachments(pdf);

      // Download as file locally
      // pdf.save("diagram.pdf");
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  };

  return (
    <button
      className={`bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex justify-center`}
      onClick={onClick}
    >
      <svg
        className={`${isLoading ? "visible" : "invisible"} text-gray-300 animate-spin absolute`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
      >
        <path
          d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="text-blue-500"
        ></path>
      </svg>
      <span className={isLoading ? "invisible" : "visible"}>Save as PDF</span>
    </button>
  );
};

export default DownloadButton;
