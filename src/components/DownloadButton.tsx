import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";

const DownloadButton = () => {
  const { getNodes } = useReactFlow();

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
  }

  const onClick = async () => {
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
      pdf.addImage(imageData, 'JPEG', 0, 0, scaledWidth, scaledHeight);

      sendPdfToSalesforceAttachments(pdf);

      pdf.save("diagram.pdf");

    } catch (err) {
      console.error("Failed to generate PDF:", err);
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