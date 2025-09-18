import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";
import { useLoading } from "../context/LoadingContext";
import { useEffect } from "react";

interface DownloadButtonProps {
  id?: string;
}

const DownloadButton = ({ id }: DownloadButtonProps) => {
  const { setIsLoading } = useLoading();
  const { getNodes } = useReactFlow();

  const sendPdfToSalesforceAttachments = async (pdf: jsPDF) => {
    const pdfBase64 = pdf.output("datauristring");

    window.parent.postMessage(
      {
        type: "SAVE_PDF",
        payload: pdfBase64,
        fileName: "diagram.pdf",
        id,
      },
      "*"
    );
  };

  const handleClick = async () => {
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
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.action === "pdfSaved") {
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <button
      className={`bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex justify-center`}
      onClick={() => {
        setIsLoading(true);
        setTimeout(() => {
          handleClick();
        }, 100);
      }}
    >
      <span>Save as PDF</span>
    </button>
  );
};

export default DownloadButton;
